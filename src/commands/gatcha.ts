import { BotCommand } from "../commandBase"
import { GatchaAPI } from "../gachaAPI"
import spec from "../gatchaSpec"

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

new BotCommand("gatcha_checksticker", "Посмотри на стикер!", ctx => {})
