const Command = require("../../Structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description:
				"Elimina por completo el canal donde es usado este comando y lo clona creando otro con el mismo nombre y permisos.",
			usage: "",
			category: "Moderación",
		});
	}

	async run(message, args) {
		const Discord = require("discord.js");
		let embed = new MessageEmbed();
		if (
			!message.member.hasPermission(["ADMINISTRATOR"])
		)
			return message.reply(
				"No tienes permiso para ejecutar este comando."
			);
		if (!message.guild.me.hasPermission(["ADMINISTRATOR"]))
			return message.reply(
				"No tengo permiso para **administrar** el servidor."
			);

		const filter = (response, user) =>
			response.author.id === message.author.id &&
			response.content.toLowerCase() === "sí";
		message.channel
			.send({
				embed: embed.setDescription(
					"¿Estás seguro de que quieres *nukear* este canal? Responde con `SÍ` o ignora este mensaje si quieres cancelar dicha acción."
				),
			})
			.then(() => {
				message.channel
					.awaitMessages(filter, {
						max: 1,
						time: 10000,
						errors: ["time"],
					})
					.then(async (collected) => {
						message.channel.send({
							embed: embed.setDescription("**¡Entendido!**"),
						});

						try {
							message.channel.clone();
							message.channel.delete();
						} catch (e) {
							message.channel.send(
								"No se ha podido completar esta acción debido a un error. Inténtalo de nuevo más tarde."
							);
						}
					})
					.catch((collected) => {
						message.channel.send({
							embed: embed.setDescription(
								" **La acción fue cancelada.** No ha sucedido nada, todo sigue normal."
							),
						});
					});
			});
	}
};
