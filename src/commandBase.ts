import Telegraf, { Telegram } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import { BotCommand as TBotCommand } from "telegraf/typings/telegram-types"

const commands: BotCommand[] = []

export function implementAll(bot: Telegraf<TelegrafContext>): void {
	for (const command of commands) command.implement(bot)
}

export class BotCommand {
	constructor(
		public command: string,
		public description: string | null,
		public middleware: (ctx: TelegrafContext) => void
	) {
		commands.push(this)
	}
	implement(bot: Telegraf<TelegrafContext>): void {
		bot.command(this.command, ctx => {
			if (!ctx.message || ctx.message.date - Date.now() / 1000 < -3) return
			this.middleware(ctx)
		})
	}
}

export function generateCommandDocs(): TBotCommand[] {
	return commands
		.filter<BotCommand & { description: string }>(
			(val): val is BotCommand & { description: string } =>
				val.description !== null
		)
		.map(val => ({ command: val.command, description: val.description }))
}
