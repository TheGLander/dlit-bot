import { BotAnything, BotCommand } from "../commandBase"
import getEnmap from "../db"

const diaDBPromise = getEnmap<number>("dia")

const balanceChange: Record<string, number> = {
	AgADpwsAAo1TYEk: +10,
	AgADVgsAAvl0aEk: +50,
	AgAD6w8AApJ2YUk: -10,
	AgAD8gsAAuATYUk: -50,
}

new BotAnything(bot => {
	bot.on("msg:sticker", async ev => {
		if (!ev.message?.sticker) return
		const delta = balanceChange[ev.message.sticker.file_unique_id]
		const repliedTo = ev.message.reply_to_message?.from?.id
		if (!repliedTo || repliedTo === ev.message.from.id) return
		if (!delta) return
		const diaDB = await diaDBPromise
		let balance = diaDB.get(repliedTo.toString())
		if (balance === undefined) {
			balance = 0
		}
		diaDB.set(repliedTo.toString(), balance + delta)
	})
})

new BotCommand("diatop", "Посмотри топ 10 Дія Рейтингов.", async ev => {
	if (!ev.message) return
	const diaDB = await diaDBPromise

	const map = [...diaDB.entries()]
	map.sort((a, b) => -a[1] + b[1])
	let str = "Топ 10:\n"
	for (let i = 0; i < Math.min(map.length, 10); i++) {
		const [userName, bal] = map[i]
		let user: string | undefined
		try {
			user = (await ev.getChatMember(parseInt(userName))).user.username
		} catch {
			user = "???"
		}
		str += `${user}: ${bal}\n`
	}
	str = str.substring(0, str.length - 1)
	ev.reply(str)
})
