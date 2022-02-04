/* import { BotAnything, BotCommand, BotKeyboardResponse } from "../commandBase"
import { GatchaAPI, GatchaItem } from "../gachaAPI"
// import spec from "../gatchaSpec"
import { InlineKeyboard } from "grammy"

const rarityToText = [
	"специальная",
	"частая",
	"нечастая",
	"редкая",
	"епичная",
	"легендарная",
	"мистическая",
	"ы",
]

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

function generateWinText(items: GatchaItem[]): string {
	const mappedResults = items.reduce<[GatchaItem, number][]>((acc, val) => {
		const curItem = acc.find(sval => sval[0].id === val.id)
		if (curItem) curItem[1]++
		else acc.push([val, 1])
		return acc
	}, [])
	return mappedResults
		.map(val => `${val[0].name} (${rarityToText[val[0].rarity]}) x${val[1]}`)
		.join("\n")
}

new BotCommand(
	"gatcha_drydraw",
	"Посмотри свои теоритические выйгрыши с лутбокса!",
	async ctx => {
		await GatchaAPI.ready
		const res = api.getItemsFromBox(spec.boxes.daily)
		ctx.reply(`ГАЧЯ выйгрыши:
${generateWinText(res)}`)
	}
)

const select = new InlineKeyboard()
for (const item of spec.items) {
	select.text(item.name, item.id)
	new BotKeyboardResponse(item.id, async ctx => {
		if (!ctx.msg || !ctx.msg.reply_to_message || !ctx.msg.reply_to_message.from)
			return
		const whoAsked = ctx.msg.reply_to_message.from.id
		await GatchaAPI.ready
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

new BotCommand("gatcha_boxdaily", "Открой ежедневный лутбокс!", async ctx => {
	if (!ctx.msg.from?.id) return
	await GatchaAPI.ready
	const timeUntilBox = api.timeUntilDailyBox(ctx.msg.from.id),
		items = api.openDailyBox(ctx.msg.from.id)

	if (!items || timeUntilBox > 0)
		return ctx.reply(
			`Подожди ещё ${Math.floor(timeUntilBox / 1000)}с до коробки!`
		)
	ctx.reply(`Ежедневые выйгрыши:
${generateWinText(items)}`)
})

new BotAnything(bot =>
	bot.on("message", async ctx => {
		await GatchaAPI.ready
		api.onUserMessage(ctx.message.from?.id ?? 0, ctx.message.date * 1000)
	})
)
*/
