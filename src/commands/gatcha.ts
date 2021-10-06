import { BotCommand, BotKeyboardResponse } from "../commandBase"
import { GatchaAPI } from "../gachaAPI"
import spec from "../gatchaSpec"
import { InlineKeyboard } from "grammy"

const api = new GatchaAPI(spec)

new BotCommand(
	"gatcha_stat",
	"Посмотри свои статистики ГАЧЯ цитат!.",
	async ctx => {
		if (!ctx.message?.from?.id) return
		await GatchaAPI.ready
		const res = api.getUserById(ctx.message?.from?.id)
		ctx.reply(`ГАЧЯ статистики @${ctx.message.from.username}:
Всего цитат: ${Object.values(res.quotesN).reduce((acc, val) => acc + val, 0)}
Монетки: ${res.coins}`)
	}
)

new BotCommand(
	"gatcha_drydraw",
	"Посмотри свои теоритические выйгрыши с лутбокса!",
	async ctx => {
		await GatchaAPI.ready
		const res = api.getItemsFromBox(spec.boxes.daily)
		ctx.reply(`ГАЧЯ выйгрыши:
${res.map(val => `${val.name} - Редкость ${val.rarity}\n`)}`)
	}
)

const select = new InlineKeyboard()
for (const item of spec.items) {
	select.text(item.name, item.id)
	new BotKeyboardResponse(item.id, async ctx => {
		if (!ctx.msg || !ctx.msg.reply_to_message || !ctx.msg.reply_to_message.from)
			return
		const whoAsked = ctx.msg.reply_to_message.from.id
		const res = api.getUserById(whoAsked)
		const statMessage = await ctx.reply(
			`Название: ${item.name}
Описание: ${item.desc}
У вас: ${res.quotesN[item.id] ?? 0}`,
			{ reply_to_message_id: ctx.msg.message_id }
		)
		ctx.replyWithSticker(item.iconID, {
			reply_to_message_id: statMessage.message_id,
		})
		try {
			await ctx.answerCallbackQuery()
		} catch (err) {
			console.error(err)
		}
	})
}

new BotCommand("gatcha_checksticker", "Посмотри на стикер!", ctx => {
	ctx.reply("Выберите стикер!", {
		reply_markup: select,
		reply_to_message_id: ctx.msg.message_id,
	})
})
