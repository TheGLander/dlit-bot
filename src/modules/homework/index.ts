import getEnmap from "../../db"
import Enmap from "enmap"
import Telegraf from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import config from "../../config.json"

export function expandLessonName(lessonName: string): string | null {
	let fullName = config.allowedLessons.find(name =>
		typeof name === "string"
			? name.toLowerCase().startsWith(lessonName.toLowerCase())
			: name.some(name =>
					name.toLowerCase().startsWith(lessonName.toLowerCase())
			  )
	)
	if (typeof fullName === "object") fullName = fullName[0]
	return fullName ?? null
}

export interface HomeworkEntry {
	value: string
	editTime: number
}

export default async function ({
	bot,
}: {
	bot: Telegraf<TelegrafContext>
}): Promise<void> {
	const homeworkMap: Enmap<string, HomeworkEntry> = await getEnmap("homework")

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
		const fullName = expandLessonName(args[0])
		if (fullName === null) {
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
		homeworkMap.set(fullName, {
			value: args.slice(1).join(","),
			editTime: Date.now(),
		})
		ctx.reply(`Всё, записал ДЗ для предмета ${fullName}!`)
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
			const fullName = expandLessonName(arg)
			if (fullName !== undefined) {
				lessonsToFeature.push(fullName)
			}
		}
		if (lessonsToFeature.length === 0) return
		let retText = ""
		for (const lessonName of lessonsToFeature) {
			if (!homeworkMap.has(lessonName)) continue
			const lesson = homeworkMap.get(lessonName)
			const editDate = new Date()
			editDate.setTime(lesson.editTime)
			retText += `${lessonName}: ${lesson.value} (${
				lesson.editTime === 0 ? "???" : editDate.toLocaleString("en-GB")
			})\n`
		}
		ctx.reply(retText)
	})
	/*bot.command("sethwpin", async ctx => {
		const msg = await ctx.reply("ы")
		homeworkMap.set("pins", JSON.stringify([msg.chat.id, msg.message_id]))
	})*/
}
