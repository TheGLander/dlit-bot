import zalgo from "zalgo-js"
import { BotCommand, generateCommandDocs } from "../commandBase"

new BotCommand("help", "Показать все команды", ctx =>
	ctx.reply(
		`DLIT v2 test.
${generateCommandDocs()
	.map(val => `/${val.command} - ${val.description}`)
	.join("\n")}`,
		{ reply_to_message_id: ctx.message?.message_id }
	)
)
new BotCommand("start", "Почитай капельку про бота!", ctx =>
	ctx.reply(
		zalgo("Я странный бот, который может кидать странные «ы».", {
			intensity: 1 + Math.random() * 2,
		})
	)
)
