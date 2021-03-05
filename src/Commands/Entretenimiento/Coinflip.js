const Command = require("../../Structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description:
				"Trataré de imitar tus sonidos, ¿qué quieres que diga?",
			category: "Entretenimiento",
			usage: "",
		});
	}

	async run(message, args) {
		let lados = [
			{
				id: 0,
				name: "Cara",
				image:
					"https://echaloasuerte.com/_next/static/images/heads-c836a2dd37de7c4216d2e93ce6eb2f38.png",
			},
			{
				id: 1,
				name: "Sello",
				image:
					"https://echaloasuerte.com/_next/static/images/tails-f04491622713007c4d27111b3c44e02d.png",
			},
		];
		let selectResult = lados[Math.round(Math.random(lados.length))];

		let embed = new MessageEmbed()
			.setColor("00FF00")
			.setTitle(`¡Salió ${selectResult.name}!`)
			.setImage(selectResult.image);
		message.channel.send(embed);
	}
};
