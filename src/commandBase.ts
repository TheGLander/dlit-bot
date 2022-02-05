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

const implementables: BotImplementable[] = []

export function implementAll(bot: Bot): void {
	for (const command of implementables) command.implement(bot)
}

export abstract class BotImplementable {
	constructor() {
		implementables.push(this)
	}
	abstract implement(bot: Bot): void
}

export class BotCommand extends BotImplementable {
	constructor(
		public command: string,
		public description: string | null,
		public middleware: MiddlewareFn<CommandContext>
	) {
		super()
	}
	implement(bot: Bot): void {
		bot.command(this.command, ctx => {
			if (!ctx.message || ctx.message.date - Date.now() / 1000 < -3) return
			run(this.middleware, ctx)
		})
	}
}

export function generateCommandDocs(): TBotCommand[] {
	return implementables
		.filter<BotCommand & { description: string }>(
			(val): val is BotCommand & { description: string } =>
				val instanceof BotCommand && val.description !== null
		)
		.map(val => ({ command: val.command, description: val.description }))
}

type QueryContext = Bot["callbackQuery"] extends (
	arg1: never,
	arg2: infer A
) => unknown
	? A extends (arg1: infer B, ...args: never[]) => unknown
		? B
		: never
	: never

export class BotKeyboardResponse extends BotImplementable {
	constructor(
		public queryName: string,
		public middleware: MiddlewareFn<QueryContext>
	) {
		super()
	}
	implement(bot: Bot): void {
		bot.callbackQuery(this.queryName, this.middleware)
	}
}

export class BotAnything extends BotImplementable {
	constructor(public todo: (bot: Bot) => void) {
		super()
	}
	implement(bot: Bot): void {
		this.todo(bot)
	}
}
