const Command = require("../../Structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description:
				"Envía una confesión anónima directamente a una persona.",
			category: "Entretenimiento",
			usage: "<userID> <texto>",
		});
	}

	async run(message, args) {
		let parts = args.join(" ").split(" "),
			to = parts[0],
			confess = args.slice(1).join(" ");

		let getUser = await message.guild.members.fetch(to);
		message.delete();

		if (!to || !confess)
			return message.author.send(
				":x: **Necesitas llenar todos los párametros.** Necesitas especificar a qué persona va la confesión (ID de la persona) y la confesión."
			);
		if (confess.length > 2000)
			return message.author.send(
				":x: **La confesión es demasiado larga.** Intenta resumir más y procura que no pase de 2000 caracteres."
			);
		if (!getUser)
			return message.author.send(
				":x: **Este usuario no se encuentra dentro del servidor.** No puedes enviar confesiones a otros usuarios que no pertenezcan al servidor."
			);
		if(getUser.id === message.author.id) return message.author.send(":x: **No puedes enviarte confesiones a tí mismo.**")
		let embedConfess = new MessageEmbed()
			.setTitle("Has recibido una confesión anónima")
			.setColor("ff6961")
			.setFooter(message.guild.name, message.guild.iconURL())
			.setDescription(confess);

		getUser
			.send(embedConfess)
			.then((m) => {})
			.catch((e) => {
				message.author.send(
					":x: **Este usuario tiene los mensajes privados bloqueados.** Esta función actualmente solo está disponible para personas con los mensajes privados abiertos."
				);
			});
		message.author.send(
			"✅ **Tu confesión ha sido enviada.** " +
				getUser.user.tag +
				" recibirá la confesión en sus mensajes privados, tu indentidad es anónima."
		);
	}
};
