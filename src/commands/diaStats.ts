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
		// Limit the message to 3 seconds ago
		if (!ev.message || ev.message.date - Date.now() / 1000 < -3) return
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

new BotCommand("diatop", "Посмотри топ 100 Дія Рейтингов.", async ev => {
	if (!ev.message) return
	const diaDB = await diaDBPromise

	const map = [...diaDB.entries()]
	map.sort((a, b) => b[1] - a[1])
	let str = "Топ 100:\n"
	for (let i = 0; i < Math.min(map.length, 100); i++) {
		const [userName, bal] = map[i]
		let user: string | undefined
		try {
			const userProfile = (await ev.getChatMember(parseInt(userName))).user
			user = userProfile.first_name
		} catch {
			user = "???"
		}
		str += `${user}: ${bal}\n`
	}
	if (Math.random() < 1 / 10) str = "Не скажу тебе"
	else str = str.substring(0, str.length - 1)
	ev.reply(str)
})
