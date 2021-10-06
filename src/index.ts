import { Bot } from "grammy"
import "dotenv-defaults/config"
import "./commands"

import { generateCommandDocs, implementAll } from "./commandBase"
;(async () => {
	if (!process.env.TOKEN) throw new Error("No token supplied!")
	const bot = new Bot(process.env.TOKEN)

	implementAll(bot)
	bot.start()
	await bot.api.setMyCommands(generateCommandDocs())
	const me = await bot.api.getMe()
	bot.botInfo.username = me.username
	console.log(`Starting bot ${me.username}...`)
})()
