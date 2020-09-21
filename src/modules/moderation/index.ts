import Telegraf from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
const start = Date.now() / 1000
interface SpamMessage {
	id: number
	type: "image" | "text"
	deleted: boolean
}
const spamMsgs: Map<number, SpamMessage[]> = new Map()
const spammers: number[] = []
export async function registerSpam(ctx: TelegrafContext): Promise<void> {
	if ((ctx.message?.date ?? 0) < start) return
	let messages: SpamMessage[] = []
	if (spamMsgs.has(ctx.from.id)) messages = spamMsgs.get(ctx.from.id)
	const newMsg: SpamMessage = {
		id: ctx.message.message_id,
		type: ctx.message.photo ? "image" : "text",
		deleted: false,
	}
	if (newMsg.type === "image") return
	messages.push(newMsg)
	spamMsgs.set(ctx.from.id, messages)
	//console.log(messages)
	if (messages.length >= 5) {
		for (const msg of messages)
			if (!msg.deleted) {
				await ctx.deleteMessage(msg.id)
				msg.deleted = true
			}

		let result: boolean
		try {
			result = await ctx.restrictChatMember(ctx.from.id, {
				until_date: 300,
				permissions: { can_send_messages: false },
			})
		} catch {
			result = false
		}
		if (!spammers.includes(ctx.from.id)) {
			spammers.push(ctx.from.id)
			ctx.reply(
				`Удалил сообщения спама, ${
					result ? "зам'ютал" : "не получилось зам'ютить :("
				}`
			)
		}
	}
	setTimeout(() => {
		const messages = spamMsgs.get(ctx.from.id)
		messages.splice(messages.indexOf(newMsg))
		spamMsgs.set(ctx.from.id, messages)
		if (spammers.includes(ctx.from.id) && messages.length < 5)
			spammers.splice(spammers.indexOf(ctx.from.id), 1)
	}, 7000)
}

export default function ({ bot }: { bot: Telegraf<TelegrafContext> }): void {
	//Anti spam
	/*bot.command("spam", async ctx => {
		return ctx
		let reply = "Сообщения: "
		const ids = [...spamMsgs.keys()]
		for (const id of ids) {
			const user = (await ctx.getChatMember(id)).user
			reply += `\n${user.first_name} ${user.last_name}: ${
				spamMsgs.get(id).length
			} ${spammers.includes(user.id) ? "(Спаммер)" : ""}`
		}
		ctx.reply(reply)
	})
	bot.use(registerSpam)*/
}
