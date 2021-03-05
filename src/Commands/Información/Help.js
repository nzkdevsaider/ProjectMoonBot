const { MessageEmbed } = require("discord.js");
const Command = require("../../Structures/Command");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			aliases: ["halp"],
			description:
				"Muestra información general del bot sobre sus comandos y funcionalidades.",
			category: "Información",
			usage: "[command]",
		});
	}

	async run(message, [command]) {
		const embed = new MessageEmbed()
			.setColor(message.guild.me.displayColor)
			.setAuthor(
				`Menú de ayuda de ${message.guild.name}`,
				message.guild.iconURL({ dynamic: true })
			)
			.setThumbnail(this.client.user.displayAvatarURL())
			.setFooter(
				`Petición por ${message.author.username}`,
				message.author.displayAvatarURL({ dynamic: true })
			)
			.setTimestamp();

		if (command) {
			const cmd =
				this.client.commands.get(command) ||
				this.client.commands.get(this.client.aliases.get(command));

			if (!cmd)
				return message.channel.send(`Comando inválido. \`${command}\``);

			embed.setAuthor(
				`${this.client.utils.capitalise(cmd.name)} Command Help`,
				this.client.user.displayAvatarURL()
			);
			embed.setDescription([
				`**» Apodos:** ${
					cmd.aliases.length
						? cmd.aliases.map((alias) => `\`${alias}\``).join(" ")
						: "Sin apodos."
				}`,
				`**» Descripción:** ${cmd.description}`,
				`**» Categoría:** ${cmd.category}`,
				`**» Uso:** ${cmd.usage}`,
			]);

			return message.channel.send(embed);
		} else {
			embed.setDescription([
				`El prefijo del bot es: ${this.client.prefix}`,
				`Párametros: \`<>\` es un campo requerido & \`[]\` es un campo opcional`,
			]);
			let categories;
			if (!this.client.owners.includes(message.author.id)) {
				categories = this.client.utils.removeDuplicates(
					this.client.commands
						.filter((cmd) => cmd.category !== "Owner")
						.map((cmd) => cmd.category)
				);
			} else {
				categories = this.client.utils.removeDuplicates(
					this.client.commands.map((cmd) => cmd.category)
				);
			}

			for (const category of categories) {
				embed.addField(
					`**${this.client.utils.capitalise(category)}**`,
					this.client.commands
						.filter((cmd) => cmd.category === category)
						.map((cmd) => `\`${cmd.name}\``)
						.join(" ")
				);
			}
			return message.channel.send(embed);
		}
	}
};
