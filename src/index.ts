import { Telegraf } from "telegraf"
import config from "./config.json"
import fs from "fs"
import path from "path"
;(async () => {
	const bot = new Telegraf(config.token)
	for (const name of fs.readdirSync(path.join(__dirname, "modules"))) {
		const func = (
			await import(path.join(__dirname, "modules", name, "index.js"))
		)?.default
		if (typeof func === "function") func({ bot })
	}
	/*bot.start(async ctx => {
		if (
			(await ctx.getChatMember(ctx?.from.id)).status in
			["administrator", "creator"]
		) {
			ctx.reply("Привет Админ!")
		}
	})*/
	/*
	 */

	bot.launch()
})()
