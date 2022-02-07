import fetch from "node-fetch"
import { BotAnything } from "../commandBase"

const voteRegex = /data-votes="(\d+)"/
const updateInterval = 1000 * 60 * 30

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
		Math.ceil(Date.now() / updateInterval) * updateInterval - Date.now()
	setTimeout(() => {
		postUpdate()
		setInterval(postUpdate, updateInterval)
	}, timeUntilStart)
})
