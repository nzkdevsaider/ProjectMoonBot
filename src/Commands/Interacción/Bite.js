const Command = require("../../Structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Muerde a alguien.",
            usage: "<user>",
            category: "Interacción",
            aliases: ["morder"],
        });
    }

    async run(message, [target]) {
        let client = this.client;
        if (!target)
            return message.channel.send(
                "Lo siento, pero es necesario mencionar a una persona."
            );
        const member =
            message.mentions.members.last() ||
            message.guild.members.cache.get(target) ||
            message.member;

        if (member.id === message.author.id)
            return message.channel.send("¡No puedes hacer esto contigo mismo!");

        if (member.id === client.user.id)
            return message.channel.send("¡No te dejaré hacer eso!");

        let embed = new MessageEmbed()
            .setDescription(
                `**${message.author.username}** ha mordido a **${member.user.username}**`
            )
            .setColor("ff0044")
            .setImage(await client.utils.getImageInteract("bite"))
            .setFooter(
                message.author.username,
                message.author.displayAvatarURL()
            );
        message.channel.send({ embed });
    }
};
