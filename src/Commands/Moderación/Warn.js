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
		if (!message.member.hasPermission("KICK_MEMBERS"))
			return message.reply("No tienes permiso de ejecutar este comando.");

		let toWarn = message.mentions.members.first();
		if (!toWarn)
			return message.reply("Especifica el usuario que quieres advertir.");

		// Get the count of same USER id from DB
		let user = await db.get(
			`SELECT count(*) FROM Warnings WHERE id = "${toWarn.id}"`
		);

		if (user["count(*)"] >= 5) {
			const warnLimit = new Discord.MessageEmbed().setDescription(
				`⚠ **${toWarn.user.username}** ha alcanzado el limite de advertencias y posteriormente pateado del servidor.`
			);
			db.run(`DELETE FROM Warnings WHERE id = "${toWarn.id}"`);
			toWarn.kick();
			message.channel.send(warnLimit);
			return;
		}

		let reason = args.slice(1).join(" ");
		if (!reason) reason = "Sin motivo.";

		// Insert USER to DB
		db.run(`INSERT INTO Warnings (id, reason, by) values (?, ?, ?)`, [
			toWarn.id,
			reason,
			message.author.id,
		]);

		let userCount = await db.get(
			`SELECT count(*) FROM Warnings WHERE id = "${toWarn.id}"`
		);
		const warnConfirm = new Discord.MessageEmbed()
			.setColor("#0099ff")
			.setDescription(
				`⚠ **${toWarn.user.username}** ha sido advertido/a ${
					userCount["count(*)"] <= 1
						? "inicialmente"
						: "(`" + userCount["count(*)"] + "` vez)"
				}. **Motivo:** \`${reason}\``
			);

		message.channel.send(warnConfirm);
	}
};
