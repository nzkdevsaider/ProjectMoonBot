const Command = require("../../Structures/Command");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			aliases: ["pong"],
			description: "Pong!",
			category: "Información",
		});
	}

	async run(message) {
		const msg = await message.channel.send("Pinging...");

		const latency = msg.createdTimestamp - message.createdTimestamp;
		const response = choices[Math.floor(Math.random() * choices.length)];

		msg.edit(
			`Bot: \`${latency}ms\`, Discord API: \`${Math.round(
				this.client.ws.ping
			)}ms\``
		);
	}
};
