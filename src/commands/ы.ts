import zalgo from "zalgo-js"
import { BotCommand } from "../commandBase"

new BotCommand("bl", "ы", ctx =>
	ctx.reply(
		zalgo("Ы".repeat(Math.ceil(Math.random() * 15 + 10)), {
			intensity: new Date().getMinutes() / 120 + 0.4 + Math.random() / 10,
		})
	)
)

function multText(txt: string, n: number): string {
	return txt
		.split("")
		.reduce((acc, val) => acc + val.repeat(val === "\n" ? 1 : n), "")
		.split("\n")
		.reduce(
			(acc, val) =>
				acc.concat(
					Array(n)
						.fill(null)
						.map(() => val)
				),
			[] as string[]
		)
		.join("\n")
}

const THE_BIG_ы = `
Ы   Ы
Ы   Ы
ЫЫЫ Ы
Ы Ы Ы
ЫЫЫ Ы
`.trim()

new BotCommand("big_bl", null, ctx =>
	ctx.replyWithMarkdown(
		"```\n" + multText(THE_BIG_ы, Math.floor(Math.random() * 4 + 1)) + "```"
	)
)
