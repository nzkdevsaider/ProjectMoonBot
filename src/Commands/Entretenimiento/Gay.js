const Command = require("../../Structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Muestra tu porcentaje de homosexualidad.",
			category: "Entretenimiento",
			usage: "<user>",
		});
	}

	async run(message, [target]) {
		const randomnumber = Math.floor(Math.random() * 101);
		const member =
			message.mentions.members.last() ||
			message.guild.members.cache.get(target) ||
			message.member;

		if (!member || member.id === message.author.id) {
			message.channel.send(`${message.author} es **${randomnumber}%** gay!`);
		} else if (member.id === "280985817097306113") {
			message.channel.send(`${member} es **-999%** gay!`);
		} else {
			message.channel.send(`${member} es **${randomnumber}%** gay!`);
		}
	}
};
