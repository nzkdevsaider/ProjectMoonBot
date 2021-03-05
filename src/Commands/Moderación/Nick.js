const Command = require("../../Structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Cambia el apodo de alguien.",
            usage: "<target> <nuevonombre>",
            category: "Moderación",
            aliases: ["nickname"],
        });
    }

    async run(message, args) {
        if (message.channel.type == "DM")
            return message.reply("No puedes usar este comando aquí.");
        if (!message.guild.me.hasPermission("MANAGE_NICKNAMES"))
            return message.channel.send(
                "No tengo permisos para **cambiar apodos**."
            );
        if (!message.member.hasPermission("MANAGE_NICKNAMES"))
            return message.reply(
                "No tienes permisos para ejecutar este comando."
            );
        let mentionMember = message.mentions.members.first();
        let newNickname = args.slice(1).join(" ");
        if (!mentionMember)
            return message.reply(
                "Menciona al usuario que quieres modificar su apodo."
            );
        if (!newNickname) return message.reply("Proporciona el apodo.");
        if (!mentionMember.kickable)
            return message.reply(
                "No puedo ponerle un apodo a este usuario, probablemente posea un rol superior al mio."
            );
        try {
            mentionMember.setNickname(newNickname);
        } catch (error) {
            message.reply(
                "No puedo ponerle un apodo a este usuario porque posee permisos elevados."
            );
        }
        message.channel.send(
            `El apodo de ${mentionMember} cambió a **${newNickname}**`
        );
    }
};
