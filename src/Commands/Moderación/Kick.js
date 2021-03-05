const Command = require('../../Structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Saca a un usuario del servidor.",
            usage: "<target>",
            category: "Moderación"
        });
    }

    async run(message) {
        if(message.channel.type == 'DM') return message.reply('No puedes usar este comando aquí.');
	if(!message.member.hasPermission('KICK_MEMBERS')) return message.reply("No tienes permiso de ejecutar este comando.");
	let mentionMember = message.mentions.members.first();
	if(!mentionMember) return message.reply("Menciona al usuario que quieres sacar.");
	if(!mentionMember.kickable) return message.reply("No tengo permisos suficientes para sacar a este usuario. ¿Posee un rol más alto que el mio?");
	try {
		mentionMember.kick()
	} catch (error) {
		message.reply("No puedo sacar a este usuario, posee permisos elevados.");
	}
	const Discord = require('discord.js');
	const kickConfirm = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setDescription(`✅ **${mentionMember} fue pateado del servidor.**`);
	message.channel.send(kickConfirm);
    }
}