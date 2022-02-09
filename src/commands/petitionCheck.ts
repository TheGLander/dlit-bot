import fetch from "node-fetch"
import { BotAnything } from "../commandBase"

const voteRegex = /data-votes="(\d+)"/
const updateInterval = 1000 * 60 * 30

new BotAnything(bot => {
	let intervalId: NodeJS.Timeout
	async function postUpdate() {
		const res = await fetch("https://petition.president.gov.ua/petition/133870")
		const body = await res.text()
		const match = voteRegex.exec(body)
		if (!match) return
		const voters = parseInt(match[1])
		if (voters > 25000) {
			await bot.api.sendMessage(
				parseInt(process.env.PETITION_GROUP || "0"),
				`Петиція: ${voters}/25000 (${Math.round((voters / 25000) * 1000) / 10}%)
Козаки!! Ми се зробили!`
			)
			if (intervalId) clearInterval(intervalId)
		} else
			await bot.api.sendMessage(
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
		intervalId = setInterval(postUpdate, updateInterval)
	}, timeUntilStart)
})
