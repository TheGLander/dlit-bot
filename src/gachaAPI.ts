import getEnmap from "./db"
import Enmap from "enmap"

export enum GatchaRarity {
	Special,
	Common,
	Uncommon,
	Rare,
	Epic,
	Legendary,
	Mythic,
	ы,
}

export interface GatchaUser {
	quotesN: Record<string, number>
	lastMessageT: number
	validMessages: number
	coins: number
	lastDailyLootbox?: number
}

export interface GatchaBox {
	name: string
	chances: { [P in GatchaRarity]?: number }
	drawN: number
	cost?: number
	desc: string
}

export interface GatchaItem {
	name: string
	rarity: GatchaRarity
	iconID: string
	desc: string
	id: string
}

export interface GatchaSpec {
	boxes: Record<string, GatchaBox>
	items: GatchaItem[]
}

export class GatchaAPI {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	static ready: Promise<Enmap<string, GatchaUser>> = new Promise(() => {})
	private static DB?: Enmap<string, GatchaUser>
	private validMessageInterval = 1000 * 60
	get DB(): Enmap<string, GatchaUser> {
		if (!GatchaAPI.DB)
			throw new Error("Please use GatchaAPI.ready before using this!")
		return GatchaAPI.DB
	}
	itemsByRarity: Record<GatchaRarity, GatchaItem[]>
	constructor(public gatchaInfo: GatchaSpec) {
		if (!GatchaAPI.DB) {
			GatchaAPI.ready = getEnmap<GatchaUser>("quote-gatcha")
			GatchaAPI.ready.then(db => (GatchaAPI.DB = db))
		}
		this.itemsByRarity = {} as Record<GatchaRarity, GatchaItem[]>
		for (let i = 0; i < GatchaRarity.ы; i++)
			this.itemsByRarity[i as GatchaRarity] = gatchaInfo.items.filter(
				val => val.rarity === i
			)
	}
	createUser(id: number): GatchaUser {
		if (this.DB.has(id.toString())) throw new Error("This should never happen")
		const data = {
			coins: 0,
			lastMessageT: 0,
			quotesN: {},
			validMessages: 0,
		}
		this.DB.set(id.toString(), data)
		return data
	}
	getUserById(id: number): GatchaUser {
		return this.DB.get(id.toString()) || this.createUser(id)
	}
	getItemsFromBox(lootbox: GatchaBox): GatchaItem[] {
		const weights: { rarity: GatchaRarity; weightTreshold: number }[] = [],
			items: GatchaItem[] = []
		let totalWeight = 0
		for (const rarity in lootbox.chances) {
			// @ts-expect-error Typescript should allow to do this smartly.
			const rarityWeight: number = lootbox.chances[rarity]
			totalWeight += rarityWeight
			weights.push({
				rarity: parseInt(rarity) as GatchaRarity,
				weightTreshold: totalWeight,
			})
		}
		for (let i = 0; i < lootbox.drawN; i++) {
			const drawnNumber = Math.random() * totalWeight
			let chosenRarity: GatchaRarity | undefined
			for (const weight of weights)
				if (drawnNumber < weight.weightTreshold) {
					chosenRarity = weight.rarity
					break
				}
			if (chosenRarity === undefined)
				throw new Error("This should never happen.")
			let chosenItem: GatchaItem | undefined
			for (let rarity = chosenRarity; rarity > 0 && !chosenItem; rarity--)
				chosenItem = this.itemsByRarity[rarity][
					Math.floor(Math.random() * this.itemsByRarity[rarity].length)
				]
			if (!chosenItem) throw new Error("This should never happen.")
			items.push(chosenItem)
		}
		return items
	}
	openBoxOnUser(userId: number, box: GatchaBox): GatchaItem[] {
		const items = this.getItemsFromBox(box),
			user = this.getUserById(userId)
		for (const item of items)
			if (user.quotesN[item.id] === undefined) user.quotesN[item.id] = 1
			else user.quotesN[item.id]++
		this.DB.set(userId.toString(), user)
		return items
	}
	timeUntilDailyBox(userId: number): number {
		const user = this.getUserById(userId)
		return !user.lastDailyLootbox
			? 0
			: Math.max(
					0,
					Math.min(24 * 60 * 60 * 1000 + user.lastDailyLootbox - Date.now())
			  )
	}
	openDailyBox(userId: number): GatchaItem[] | null {
		const user = this.getUserById(userId)
		if (
			user.lastDailyLootbox &&
			user.lastDailyLootbox - Date.now() < 24 * 60 * 60 * 1000
		)
			return null
		user.lastDailyLootbox = Date.now()
		this.DB.set(userId.toString(), user)
		return this.openBoxOnUser(userId, this.gatchaInfo.boxes.daily)
	}
	onUserMessage(userId: number, sendTime: number): void {
		const user = this.getUserById(userId)
		if (sendTime - user.lastMessageT > this.validMessageInterval) {
			user.coins++
			user.validMessages++
			user.lastMessageT = sendTime
			this.DB.set(userId.toString(), user)
		}
	}
}
