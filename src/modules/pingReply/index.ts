import getEnmap from "../../db"
import Enmap from "enmap"
import Telegraf from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"

export default async function ({
	bot,
}: {
	bot: Telegraf<TelegrafContext>
}): Promise<void> {
	bot.on("message", ctx => {
		if (
			ctx.message.entities?.findIndex(
				val => val.type === "mention" || val.type === "text_mention"
			) > -1
		) {
			ctx.replyWithSticker(
				"CAACAgIAAxkBAAI8MGA_2L6LskIQEKN5xoiW6GU7PBSkAAI4AAPOinAv_tJhcRzzjn8eBA"
			)
		}
	})
}
