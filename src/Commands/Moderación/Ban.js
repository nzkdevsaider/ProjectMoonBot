const Command = require("../../Structures/Command");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Prohíbe a un usuario del servidor.",
			usage: "<target> [motivo]",
			category: "Moderación",
		});
	}

	async run(message, args) {
		if (message.channel.type == "DM")
			return message.reply("No puedes usar este comando aquí.");
		var user = message.mentions.users.first();
		const banReason = args.slice(1).join(" ");
		if (!message.member.hasPermission("BAN_MEMBERS"))
			return message.reply(
				"No tienes permiso para ejecutar este comando."
			);
		if (!user) {
			try {
				if (!message.guild.members.get(args.slice(0, 1).join(" ")))
					throw new Error("No puedo obtener un usuario con este ID.");
				user = message.guild.members.get(args.slice(0, 1).join(" "));
				user = user.user;
			} catch (error) {
				return message.reply(
					"No puedo obtener un usuario con este ID."
				);
			}
		}
		if (user === message.author)
			return message.channel.send("No te puedes banear a ti mismo.");
		if (!banReason)
			return message.reply("Necesitas proporcionar un motivo.");
		message.guild.members.ban(user, { reason: banReason });
		const Discord = require("discord.js");
		const banConfirm = new Discord.MessageEmbed()
			.setColor("#0099ff")
			.setDescription(
				`✅ **${user.tag} fue baneado.** **Motivo:** \`${banReason}\``
			);
		message.channel.send(banConfirm);
	}
};
