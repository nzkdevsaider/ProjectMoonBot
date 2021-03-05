const Command = require("../../Structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "¡Baila!",
            usage: "<user>",
            category: "Interacción",
            aliases: ["bailar"],
        });
    }

    async run(message) {
        let client = this.client;
        
        let embed = new MessageEmbed()
            .setDescription(
                `¡**${message.author.username}** ha empezado a bailar!`
            )
            .setColor("ff0044")
            .setImage(await client.utils.getImageInteract("dance"))
            .setFooter(
                message.author.username,
                message.author.displayAvatarURL()
            );
        message.channel.send({ embed });
    }
};
