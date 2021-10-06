import { Bot, Context } from "grammy"
import { BotCommand as TBotCommand } from "@grammyjs/types"
import { MiddlewareFn, run } from "grammy/out/composer"

type CommandContext = Bot["command"] extends (
	arg1: never,
	arg2: infer A
) => unknown
	? A extends (arg1: infer B, ...args: never[]) => unknown
		? B
		: never
	: never

const commands: BotCommand[] = []

export function implementAll(bot: Bot): void {
	for (const command of commands) command.implement(bot)
}

export class BotCommand {
	constructor(
		public command: string,
		public description: string | null,
		public middleware: MiddlewareFn<CommandContext>
	) {
		commands.push(this)
	}
	implement(bot: Bot): void {
		bot.command(this.command, ctx => {
			if (!ctx.message || ctx.message.date - Date.now() / 1000 < -3) return
			run(this.middleware, ctx)
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
