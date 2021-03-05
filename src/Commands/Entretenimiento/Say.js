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
		message.channel.send(args.join(" "));
	}
};
