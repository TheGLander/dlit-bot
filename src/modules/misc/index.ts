import Telegraf from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
export default function ({ bot }: { bot: Telegraf<TelegrafContext> }): void {
	bot.help(ctx =>
		ctx.replyWithMarkdown(`
/help - Это сообщение
/trust {Человек} - Даёт человеку статус доверенного.
/untrust {Человек} - Забирает человеку статус доверенного.
/hw {Урок} (ДЗ) - Задаёт или смотрит Домашнее Задание для урока **(Надо быть доверенным чтобы задавать)**`)
	)
}
