import getEnmap from "../../db"
import Enmap from "enmap"
import Telegraf from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import config from "../../config.json"

export default async function ({
	bot,
}: {
	bot: Telegraf<TelegrafContext>
}): Promise<void> {
	const homeworkMap: Enmap<string, string> = await getEnmap("homework")
	function updatePins(ctx: TelegrafContext) {
		if (!homeworkMap.has("pins")) return
		const params = JSON.parse(homeworkMap.get("pins"))
		let newText = ""
		for (const keyVal of homeworkMap.entries()) {
			if (keyVal[0] === "pins") continue
			newText += `${keyVal[0]}: ${keyVal[1]}\n`
		}

		ctx.telegram.editMessageText(params[0], params[1], undefined, newText)
	}

	bot.command("sethw", async ctx => {
		const args = ctx.message.text
			.substr(6)
			.split(",")
			.map(str => str.trim())
		if (args.length < 2) {
			ctx.replyWithMarkdown(
				"Неправильное сообщение! Надо формат, например **/sethw Мат, Посчитать 2+2**"
			)
			return
		}
		// Allign name
		let fullName = config.allowedLessons.find(name =>
			typeof name === "string"
				? name.toLowerCase().startsWith(args[0].toLowerCase())
				: name.some(name =>
						name.toLowerCase().startsWith(args[0].toLowerCase())
				  )
		)
		if (typeof fullName === "object") fullName = fullName[0]
		if (fullName === undefined) {
			ctx.replyWithMarkdown(
				`Неправильный предмет! Правильный предмет один из: ${config.allowedLessons
					.map(val =>
						typeof val === "object"
							? `${val[0]} (или ${val.slice(1).join(", ")})`
							: val
					)
					.join(", ")}`
			)
			return
		}
		homeworkMap.set(fullName, args.slice(1).join(","))
		ctx.reply(`Всё, записал ДЗ для предмета ${fullName}!`)
		updatePins(ctx)
	})
	bot.command("hw", async ctx => {
		const args = ctx.message.text
			.substr(3)
			.split(" ")
			.map(str => str.trim())
		const lessonsToFeature = []
		for (const arg of args) {
			if (arg.length <= 0) continue
			// Allign name
			let fullName = config.allowedLessons.find(name =>
				typeof name === "string"
					? name.toLowerCase().startsWith(arg.toLowerCase())
					: name.some(name => name.toLowerCase().startsWith(arg.toLowerCase()))
			)
			if (typeof fullName === "object") fullName = fullName[0]
			if (fullName !== undefined) {
				lessonsToFeature.push(fullName)
			}
		}
		if (lessonsToFeature.length === 0) return
		let retText = ""
		for (const lesson of lessonsToFeature) {
			retText += `${lesson}: ${
				homeworkMap.has(lesson) ? homeworkMap.get(lesson) : "???"
			}\n`
		}
		ctx.reply(retText)
	})
	bot.command("sethwpin", async ctx => {
		const msg = await ctx.reply("ы")
		homeworkMap.set("pins", JSON.stringify([msg.chat.id, msg.message_id]))
		updatePins(ctx)
	})
}
