const Command = require('../../Structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Remueve el silencio de un usuario silenciado.",
            usage: "<target>",
            category: "Moderación"
        });
    }

    async run(message, args) {
        const Discord = require('discord.js');
    if(!message.member.hasPermission('MANAGE_ROLES') || !message.member.hasPermission(["KICK_MEMBERS", "BAN_MEMBERS"])) return message.reply("No tienes permisos para ejecutar este comando.");
	if(!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.reply("No tengo permisos para **gestionar roles** y **administrar** el servidor.");
    let toUnmute = message.mentions.members.first();
    if(!toUnmute) return message.reply("Proporciona al usuario que quieres remover el silencio.");
    let muteRole = message.guild.roles.cache.find(r => r.name === "Muted");
    const unmuteConfirm = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setDescription(`✅ **${toUnmute.user.username} ya no está silenciado.**`);
    toUnmute.roles.remove(muteRole.id).then(() => {
        message.delete()
        toUnmute.send(`Tu silencio en **${message.guild.name}** ha sido removido.`)
        message.channel.send(unmuteConfirm)
    });
    }
}