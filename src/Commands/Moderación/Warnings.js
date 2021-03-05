const Command = require("../../Structures/Command");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const _ = require("lodash");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Advierte a un usuario del servidor.",
			usage: "<target> [motivo]",
			category: "Moderación",
		});
	}

	async run(message, args) {
		const Discord = require("discord.js");

		let opts = args[0];

		// DB Instance
		let db = await open({
			filename: "./Structures/DB/MoonDB.db",
			driver: sqlite3.Database,
		});

		let client = this.client;
		if (!message.member.hasPermission(["KICK_MEMBERS", "BAN_MEMBERS"]))
			return message.reply(
				"No tienes permiso para ejecutar este comando."
			);

		if (opts === "--prune") {
			const warnDelete = new Discord.MessageEmbed()
				.setColor("#0099ff")
				.setDescription(
					`**Se han eliminado todos los registros de advertencias exitosamente.**`
				);
			if (_.isEmpty(await db.all("SELECT * FROM Warnings")))
				return message.channel.send({
					embed: warnDelete.setDescription(
						"**No hay registros de advertencias almacenados en la base de datos.** Esta acción no es necesaria."
					),
				});
			db.run(`DELETE FROM Warnings`);
			message.channel.send(warnDelete);
			return;
		}

		if (opts) {
			let user =
				message.mentions.members.last() ||
				message.guild.members.cache.get(opts) ||
				message.member;
			let userCount = await db.get(
				`SELECT count(*) FROM Warnings WHERE id = "${user.id}"`
			);
			let userWarns = await db.all(
				`SELECT * FROM Warnings WHERE id = "${user.id}"`
			);
			if (!user)
				return message.reply(
					"El usuario proporcionado no existe o no está dentro del servidor."
				);

			if (userCount["count(*)"] < 1) {
				const warnClear = new Discord.MessageEmbed().setDescription(
					`**${user.user.tag}** no posee ningún registro de advertencias.`
				);
				message.channel.send(warnClear);
				return;
			}
			const warnUser = new Discord.MessageEmbed()
				.setColor("#0099ff")
				.setDescription(
					`**${user.user.tag}** tiene \`${userCount["count(*)"]}\` advertencias acumuladas.`
				);
			userWarns.map((value) => {
				warnUser.addField(
					"Motivo: " + value.reason,
					`**Por:** ${
						message.guild.members.cache.get(value.by)
							? message.guild.members.cache.get(value.by).user.tag
							: value.by
					}`
				);
			});
			message.channel.send(warnUser);
			return;
		}

		// Get the count of same USER id from DB
		let warnings = await db.all(`SELECT * FROM Warnings`);

		const warnList = new Discord.MessageEmbed()
			.setColor("#0099ff")
			.setDescription(
				`${
					_.isEmpty(warnings)
						? "No hay registros todavía."
						: "Hay un total de `" + warnings.length + "` registros."
				} ${
					warnings.length >= 10
						? "`(Se muestran solamente los 10 últimos registros recientes)`"
						: "`(Se muestran los últimos registros recientes)`"
				}`
			);

		let listLimit = 0;

		warnings.map(async (value) => {
			listLimit++;

			if (listLimit >= 10) {
				return;
			}

			warnList.addField(
				message.guild.members.cache.get(value.id)
					? message.guild.members.cache.get(value.id).user.tag
					: value.id + " (No está en el servidor)",
				`**ID:** \`${value.id}\`\n**Motivo:** ${
					value.reason
				}\n**Por:** ${
					message.guild.members.cache.get(value.by)
						? message.guild.members.cache.get(value.by).user.tag
						: value.by + " (No está en el servidor)"
				}`,
				true
			);
		});

		message.channel.send(warnList);
	}
};
