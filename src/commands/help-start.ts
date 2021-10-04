import zalgo from "zalgo-js"
import { BotCommand } from "../commandBase"

new BotCommand("help", ctx =>
	ctx.reply("DLIT v2 test.", { reply_to_message_id: ctx.message?.message_id })
)
new BotCommand("start", ctx =>
	ctx.reply(
		zalgo("Я странный бот, который может кидать странные «ы».", {
			intensity: 1 + Math.random() * 2,
		})
	)
)
