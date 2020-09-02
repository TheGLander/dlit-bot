import { Telegraf } from "telegraf"
import config from "./config.json"

const bot = new Telegraf(config.token)
bot.use()
bot.start(async ctx => {
	if (
		(await ctx.getChatMember(ctx?.from.id)).status in
		["administrator", "creator"]
	) {
		ctx.reply("Привет Админ!")
	}
})
bot.help(ctx =>
	ctx.replyWithMarkdown(`
/help - Это сообщение
/trust []
/hw [Урок] (ДЗ) - Задаёт или смотрит Домашнее Задание для урока **(Надо быть доверенным чтобы задавать)**`)
)
bot.on("sticker", ctx => ctx.reply("👍"))
bot.command("trust", async ctx => {
	const trustedUser = ctx.message.entities.filter(
		val => val.type === "text_mention"
	)[0]?.user
	if (!trustedUser) {
		ctx.reply("Дай мне пользователя!")
		return
	}
	ctx.reply(`ID: ${trustedUser.first_name} ${trustedUser.last_name} WIP!`)
})
bot.hears("hi", ctx => ctx.reply("Пока ыыыыы"))
bot.launch()
