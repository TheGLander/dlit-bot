import config from "../../config.json"
import Telegraf from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import { expandLessonName } from "../homework"

export default async function ({
	bot,
}: {
	bot: Telegraf<TelegrafContext>
}): Promise<void> {
	bot.command("schd", ctx => {
		const dayArg = ctx.message.text.trim().split(/\s+/g)[1] ?? ""
		let day = isNaN(parseInt(dayArg, 10))
			? config.scheduleNames.findIndex(name =>
					name.toLowerCase().startsWith(dayArg.toLowerCase())
			  )
			: parseInt(dayArg, 10) - 1
		if (day === -1 || isNaN(day)) day = new Date().getDay() - 1
		if (day > 4 || day < 0) day = 0
		const schedule = config.schedule[day]
		let retText = `${config.scheduleNames[day]}:\n`
		for (const lessons of schedule) {
			retText += `${schedule.indexOf(lessons) + 1}: `
			for (const lesson of lessons)
				retText += `${expandLessonName(lesson.lesson)} ${lesson.place} `
			retText += "\n"
		}
		ctx.reply(retText)
	})
}
