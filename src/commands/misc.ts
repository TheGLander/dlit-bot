import { BotCommand } from "../commandBase"

new BotCommand("city_covid_map", "Карта ковида в городе.", ctx =>
	ctx.reply(
		"Для @geograf228\nhttps://dniprorada.gov.ua/uk/page/interaktivna-karta-covid-19",
		{
			reply_to_message_id: ctx.message?.message_id,
		}
	)
)
