import fetch from "node-fetch"
import { BotAnything } from "../commandBase"

const voteRegex = /data-votes="(\d+)"/

new BotAnything(bot => {
	async function postUpdate() {
		const res = await fetch("https://petition.president.gov.ua/petition/133870")
		const body = await res.text()
		const match = voteRegex.exec(body)
		if (!match) return
		const voters = parseInt(match[1])
		bot.api.sendMessage(
			parseInt(process.env.PETITION_GROUP || "0"),
			`Петиція: ${voters}/25000 (${Math.round((voters / 25000) * 1000) / 10}%)
Слава Україні!
Героям слава!`
		)
	}
	const timeUntilStart =
		Math.ceil(Date.now() / (1000 * 60 * 10)) * (1000 * 60 * 10) - Date.now()
	setTimeout(() => {
		postUpdate()
		setInterval(postUpdate, 1000 * 60 * 10)
	}, timeUntilStart)
})
