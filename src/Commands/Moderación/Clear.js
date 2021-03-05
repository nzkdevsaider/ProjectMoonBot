const Command = require('../../Structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Elimina una cantidad de mensajes especifica de un canal.",
            usage: "<cantidad>",
            category: "Moderación",
            aliases: ["purge"]
        });
    }

    async run(message, args) {
        if (!args[0]) return message.reply('Necesitas especificar una cantidad de mensajes especifica.');
        if (isNaN(args[0])) return message.reply("Necesitas especificar una cantidad en numérica.");
        if (args[0] > 100) return message.reply("¡No puedes eliminar más de 100 mensajes!");
        if (args[0] < 1) return message.reply('¡Necesitas eliminar al menos 1 mensaje!');

        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply("No tienes permiso para ejecutar este comando.");
    
        await message.channel.messages.fetch({ limit: args[0] }).then(messages => {
            message.channel.bulkDelete(messages)
        });
    }
}