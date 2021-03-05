const Command = require("../../Structures/Command");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Silencia a un usuario del servidor.",
			usage: "<target> [motivo]",
			category: "Moderación",
		});
	}

	async run(message, args) {
		const Discord = require("discord.js");
		if (
			!message.member.hasPermission("MANAGE_ROLES") ||
			!message.member.hasPermission(["KICK_MEMBERS", "BAN_MEMBERS"])
		)
			return message.reply(
				"No tienes permiso para ejecutar este comando."
			);
		if (!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"]))
			return message.reply(
				"No tengo permiso para **gestionar roles** y **administrar** el servidor."
			);
		let toMute = message.mentions.members.first();
		if (!toMute)
			return message.reply(
				"Especifica el usuario que quieres silenciar."
			);
		let reason = args.slice(1).join(" ");
		if (!reason) reason = "Sin motivo.";
		let muteRole = message.guild.roles.cache.find(
			(r) => r.name === "Muted"
		);
		if (!muteRole) {
			try {
				muteRole = await message.guild.roles.create({
					data: {
						name: "Muted",
						color: "#514f48",
						permissions: [],
					},
				});
			} catch (e) {
				console.log(e.stack);
			}
		}
		message.guild.channels.cache.forEach((channel) => {
			channel.updateOverwrite(muteRole, {
				SEND_MESSAGES: false,
				ATTACH_FILES: false,
				SEND_TTS_MESSAGES: false,
				ADD_REACTIONS: false,
				SPEAK: false,
				STREAM: false,
			});
		});
		const muteConfirm = new Discord.MessageEmbed()
			.setColor("#0099ff")
			.setDescription(
				`✅ **${toMute.user.username} fue silenciado del servidor.** **Motivo:** \`${reason}\``
			);
		toMute.roles.add(muteRole.id).then(() => {
			message.delete();
			toMute.send(
				`Fuiste silenciado de **${message.guild.name}** por: **${reason}**`
			);
			message.channel.send(muteConfirm);
		});
	}
};
