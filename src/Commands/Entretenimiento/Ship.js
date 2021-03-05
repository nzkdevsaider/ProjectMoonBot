const Command = require("../../Structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Junta a dos personas y forma un nombre único.",
			category: "Entretenimiento",
			usage: "<user1> <user2>",
		});
	}

	async run(message, args) {
		let user1 = args[0];
		let user2 = args[1];
		let getUser1;
		let getUser2;
		let client = this.client;
		if (!user1 || !user2)
			return message.channel.send(
				" ¡Es necesario mencionar dos usuarios!"
			);
		try {
			let getUserId1 = !isNaN(user1)
				? await client.users.fetch(user1).then((u) => u.id)
				: false || message.mentions.members.array()[0].id
				? message.mentions.members.array()[0].id
				: message.guild.members.cache.find(
						(n) =>
							n.displayName.toLowerCase() ===
								user1.toLowerCase() ||
							n.user.username.toLowerCase() ===
								user1.toLowerCase()
				  ).id;
			getUser1 = client.users.cache.get(getUserId1);

			let getUserId2 = !isNaN(user2)
				? await client.users.fetch(user2).then((u) => u.id)
				: false || message.mentions.members.array()[1].id
				? message.mentions.members.array()[1].id
				: message.guild.members.cache.find(
						(n) =>
							n.displayName.toLowerCase() ===
								user2.toLowerCase() ||
							n.user.username.toLowerCase() ===
								user2.toLowerCase()
				  ).id;
			getUser2 = client.users.cache.get(getUserId2);
		} catch (e) {
			return message.channel.send(
				" Uno de los usuarios mencionado no fue encontrado, inténtalo de nuevo."
			);
		}

		message.channel.send(
			`${getUser1.username} x ${
				getUser2.username
			}: **${client.utils.shipName(
				getUser1.username,
				getUser2.username
			)}**`
		);
	}
};
