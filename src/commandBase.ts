import Telegraf from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"

const commands: BotCommand[] = []

export function implementAll(bot: Telegraf<TelegrafContext>): void {
	for (const command of commands) command.implement(bot)
}

export class BotCommand {
	constructor(
		public command: string,
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
