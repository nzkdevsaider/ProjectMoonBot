const Command = require("../../Structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Haz pucheros.",
            usage: "<user>",
            category: "Interacción",
            aliases: ["puchero"],
        });
    }

    async run(message) {
        let client = this.client;

        let embed = new MessageEmbed()
            .setDescription(
                `**${message.author.username}** está haciendo pucheros. *¡Hmpf!*`
            )
            .setColor("ff0044")
            .setImage(await client.utils.getImageInteract("pout"))
            .setFooter(
                message.author.username,
                message.author.displayAvatarURL()
            );
        message.channel.send({ embed });
    }
};
