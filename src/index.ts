import Telegraf from "telegraf"
import "dotenv-defaults/config"
import zalgo from "zalgo-js"

//
;(async () => {
	if (!process.env.TOKEN) throw new Error("No token supplied!")
	const bot = new Telegraf(process.env.TOKEN)
	bot.help(ctx => {
		ctx.reply("DLIT v2 test.", { reply_to_message_id: ctx.message?.message_id })
	})
	bot.command("bl", ctx =>
		ctx.reply(
			zalgo("Ы".repeat(Math.ceil(Math.random() * 15 + 10)), {
				intensity: new Date().getMinutes() / 120 + 0.4 + Math.random() / 10,
			})
		)
	)
	bot.startPolling()
	bot.options.username = (await bot.telegram.getMe()).username
})()
