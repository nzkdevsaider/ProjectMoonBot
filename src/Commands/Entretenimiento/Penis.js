const Command = require("../../Structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description:
				"Muestra el tamaño de tu miembro viril con mucho orgullo.",
			category: "Entretenimiento",
			usage: "",
		});
	}

	async run(message, [target]) {
		const randomnumber = Math.floor(Math.random() * 31);
		const member =
			message.mentions.members.last() ||
			message.guild.members.cache.get(target) ||
			message.member;

		if (!member || member.id === message.author.id) {
			message.channel.send(
				`${message.author} le mide **${randomnumber}cm**`
			);
		} else if (member.id === "280985817097306113") {
			message.channel.send(
				`${member} le mide **101cm**. *Posteriormente ha tenido que pagar pasaje extra en el transporte público por semejante bulto*`
			);
		} else {
			message.channel.send(`${member} le mide **${randomnumber}**!`);
		}
	}
};
