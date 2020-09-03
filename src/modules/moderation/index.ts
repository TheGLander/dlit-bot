import Telegraf from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"

export async function registerSpam(ctx: TelegrafContext): Promise<void> {
	let messages: number[] = []
	if (spamMsgs.has(ctx.from.id)) messages = spamMsgs.get(ctx.from.id)
	messages.push(ctx.message.message_id)
	spamMsgs.set(ctx.from.id, messages)
	console.log(messages)
	if (messages.length >= 5) {
		ctx.reply("Вижу спам, если был бы админом, временно зам'ютал бы их!")
	}
	setTimeout(() => {
		const messages = spamMsgs.get(ctx.from.id)
		messages.splice(messages.indexOf(ctx.message.message_id))
		spamMsgs.set(ctx.from.id, messages)
	}, 7000)
}
const spamMsgs: Map<number, number[]> = new Map()
export default function ({ bot }: { bot: Telegraf<TelegrafContext> }): void {
	//Anti spam
	bot.use(registerSpam)
	bot.on("sticker", registerSpam)
}
