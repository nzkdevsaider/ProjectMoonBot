const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

const filterLevels = {
	DISABLED: 'Deshabilitado',
	MEMBERS_WITHOUT_ROLES: 'Sin rol',
	ALL_MEMBERS: 'Todos'
};

const verificationLevels = {
	NONE: 'Ninguno',
	LOW: 'Bajo',
	MEDIUM: 'Medio',
	HIGH: '(╯°□°）╯︵ ┻━┻',
	VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};

const regions = {
	brazil: 'Brazil',
	europe: 'Europa',
	hongkong: 'Hong Kong',
	india: 'India',
	japan: 'Japón',
	russia: 'Rusia',
	singapore: 'Singapur',
	southafrica: 'Sudáfrica',
	sydeny: 'Sídney',
	'us-central': 'US Central',
	'us-east': 'US East',
	'us-west': 'US West',
	'us-south': 'US South'
};

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['server', 'guild', 'guildinfo'],
			description: 'Muestra información técnica del servidor.',
			category: 'Información'
		});
	}

	async run(message) {
		const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
		const members = message.guild.members.cache;
		const channels = message.guild.channels.cache;
		const emojis = message.guild.emojis.cache;

		const embed = new MessageEmbed()
			.setDescription(`**Información sobre __${message.guild.name}__**`)
			.setColor('BLUE')
			.setThumbnail(message.guild.iconURL({ dynamic: true }))
			.addField('General', [
				`**» Nombre:** ${message.guild.name}`,
				`**» ID:** ${message.guild.id}`,
				`**» Propietario:** ${message.guild.owner.user.tag} (${message.guild.ownerID})`,
				`**» Región:** ${regions[message.guild.region]}`,
				`**» Boost Tier:** ${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'}`,
				`**» Filtro de Contenido:** ${filterLevels[message.guild.explicitContentFilter]}`,
				`**» Nivel de verificación:** ${verificationLevels[message.guild.verificationLevel]}`,
				`**» Tiempo creado:** ${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} ${moment(message.guild.createdTimestamp).fromNow()}`,
				'\u200b'
			])
			.addField('Estadisticas', [
				`**» Roles:** ${roles.length}`,
				`**» Emojis:** ${emojis.size}`,
				`**» Emojis regulares:** ${emojis.filter(emoji => !emoji.animated).size}`,
				`**» Emojis animados:** ${emojis.filter(emoji => emoji.animated).size}`,
				`**» Miembros:** ${message.guild.memberCount}`,
				`**» Humanos:** ${members.filter(member => !member.user.bot).size}`,
				`**» Bots:** ${members.filter(member => member.user.bot).size}`,
				`**» Canales de texto:** ${channels.filter(channel => channel.type === 'text').size}`,
				`**» Canales de voz:** ${channels.filter(channel => channel.type === 'voice').size}`,
				`**» Boosts:** ${message.guild.premiumSubscriptionCount || '0'}`,
				'\u200b'
			])
			.addField('Presencia', [
				`**» Online:** ${members.filter(member => member.presence.status === 'online').size}`,
				`**» Ausente:** ${members.filter(member => member.presence.status === 'idle').size}`,
				`**» No Molestar:** ${members.filter(member => member.presence.status === 'dnd').size}`,
				`**» Offline:** ${members.filter(member => member.presence.status === 'offline').size}`,
				'\u200b'
			])
			.addField(`Roles [${roles.length - 1}]`, roles.length < 10 ? roles.join(', ') : roles.length > 10 ? this.client.utils.trimArray(roles) : 'Ninguno')
			.setTimestamp();
		message.channel.send(embed);
	}

};
