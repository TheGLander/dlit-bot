import Telegraf from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"

export default function ({ bot }: { bot: Telegraf<TelegrafContext> }): void {
	bot.command("trust", async ctx => {
		/*if (
			!["administrator", "creator"].includes(
				(await (message?.from.id)).status
			)
		) {
			message.reply("Надо быть админом для /trust!")
			return
		}*/
		const trustedUser = ctx.message.entities.filter(
			val => val.type === "text_mention"
		)[0]?.user
		if (!trustedUser) {
			ctx.reply("Дай мне пользователя (Используй @)!")
			return
		}
		ctx.reply(`ID: ${trustedUser.first_name} ${trustedUser.last_name} WIP!`)
	})
}
