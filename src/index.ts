import Telegraf from "telegraf"
import "dotenv-defaults/config"
import "./commands"

import { generateCommandDocs, implementAll } from "./commandBase"
;(async () => {
	if (!process.env.TOKEN) throw new Error("No token supplied!")
	const bot = new Telegraf(process.env.TOKEN)

	implementAll(bot)
	bot.startPolling()
	await bot.telegram.setMyCommands(generateCommandDocs())
	const me = await bot.telegram.getMe()
	bot.options.username = me.username
	console.log(`Starting bot ${me.username}...`)
})()
