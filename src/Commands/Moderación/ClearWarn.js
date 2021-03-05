const Command = require("../../Structures/Command");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

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

		let toWarn = message.mentions.members.first();
		if (!toWarn)
			return message.reply("Especifica el usuario que quieres limpiar.");

		// Get the count of same USER id from DB
		let user = await db.get(
			`SELECT * FROM Warnings WHERE id = "${toWarn.id}"`
		);
		let userCount = await db.get(
			`SELECT count(*) FROM Warnings WHERE id = "${toWarn.id}"`
		);

		if (userCount["count(*)"] >= 1) {
			const warnClear = new Discord.MessageEmbed().setDescription(
				`✅ Se han eliminado \`${userCount["count(*)"]}\` registros de advertencias del expediente de **${toWarn.user.tag}**`
			);
			db.run(`DELETE FROM Warnings WHERE id = "${toWarn.id}"`);
			message.channel.send(warnClear);
			return;
		}

		const warnWhat = new Discord.MessageEmbed()
			.setColor("#0099ff")
			.setDescription(
				`Lo siento, pero **${toWarn.user.tag}** no posee ningún registro de advertencias.`
			);

		message.channel.send(warnWhat);
	}
};
