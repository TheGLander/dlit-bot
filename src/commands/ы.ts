import zalgo from "zalgo-js"
import { BotCommand } from "../commandBase"

new BotCommand("bl", ctx =>
	ctx.reply(
		zalgo("Ы".repeat(Math.ceil(Math.random() * 15 + 10)), {
			intensity: new Date().getMinutes() / 120 + 0.4 + Math.random() / 10,
		})
	)
)
