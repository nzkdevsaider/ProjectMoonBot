const Command = require("../../Structures/Command");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");

const flags = {
	DISCORD_EMPLOYEE: "Empleado de Discord",
	DISCORD_PARTNER: "Partner",
	BUGHUNTER_LEVEL_1: "Bug Hunter (Nivel 1)",
	BUGHUNTER_LEVEL_2: "Bug Hunter (Nivel 2)",
	HYPESQUAD_EVENTS: "Hypesquad",
	HOUSE_BRAVERY: "House of Bravery",
	HOUSE_BRILLIANCE: "House of Brilliance",
	HOUSE_BALANCE: "House of Balance",
	EARLY_SUPPORTER: "Early Supporter",
	TEAM_USER: "Team User",
	SYSTEM: "Sistema",
	VERIFIED_BOT: "Bot verificado",
	VERIFIED_DEVELOPER: "Desarrollador de bots verificado",
};

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			aliases: ["user", "ui"],
			description:
				"Muestra información técnica sobre la información de un usuario.",
			category: "Información",
			usage: "[user]",
		});
	}

	async run(message, [target]) {
		const member =
			message.mentions.members.last() ||
			message.guild.members.cache.get(target) ||
			message.member;
		const roles = member.roles.cache
			.sort((a, b) => b.position - a.position)
			.map((role) => role.toString())
			.slice(0, -1);
		const userFlags = member.user.flags.toArray();
		const embed = new MessageEmbed()
			.setThumbnail(
				member.user.displayAvatarURL({ dynamic: true, size: 512 })
			)
			.setColor(member.displayHexColor || "BLUE")
			.addField("Usuario", [
				`**» Nombre de usuario:** ${member.user.username}`,
				`**» Discriminador:** ${member.user.discriminator}`,
				`**» ID:** ${member.id}`,
				`**» Banderas:** ${
					userFlags.length
						? userFlags.map((flag) => flags[flag]).join(", ")
						: "None"
				}`,
				`**» Avatar:** [Enlace al avatar](${member.user.displayAvatarURL(
					{ dynamic: true }
				)})`,
				`**» Tiempo creado:** ${moment(
					member.user.createdTimestamp
				).format("LT")} ${moment(member.user.createdTimestamp).format(
					"LL"
				)} ${moment(member.user.createdTimestamp).fromNow()}`,
				`**» Estado:** ${member.user.presence.status}`,
				`**» Juego:** ${
					member.user.presence.game || "Not playing a game."
				}`,
				`\u200b`,
			])
			.addField("Miembro", [
				`**» Rol más alto:** ${
					member.roles.highest.id === message.guild.id
						? "Ninguno"
						: member.roles.highest.name
				}`,
				`**» Fecha de entrada:** ${moment(member.joinedAt).format(
					"LL LTS"
				)}`,
				`**» Rol heredado:** ${
					member.roles.hoist ? member.roles.hoist.name : "Ninguno"
				}`,
				`**» Roles [${roles.length}]:** ${
					roles.length < 10
						? roles.join(", ")
						: roles.length > 10
						? this.client.utils.trimArray(roles)
						: "Ninguno"
				}`,
				`\u200b`,
			]);
		return message.channel.send(embed);
	}
};
