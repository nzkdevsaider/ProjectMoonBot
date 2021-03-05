/*

--------------------------------------------
Erina Development (c) ODM Distribution
Project MoonBot
--------------------------------------------

*/

const { Client, Collection, Intents } = require("discord.js");
const Util = require("./Util.js");
const intents = new Intents(["GUILD_MEMBERS"]);

module.exports = class MoonClient extends Client {
    constructor(options = {}) {
        super({
            //ws: { intents },
            disableMentions: "everyone",
        });

        this.validate(options);

        this.commands = new Collection();

        this.aliases = new Collection();

        this.utils = new Util(this);

        this.once("ready", () => {
            console.log(
                "[MoonBot] " +
                    this.user.tag +
                    " se ha conectado al gateway de Discord."
            );

            this.user.setActivity(`${this.prefix}help`);

            // No útil
            // this.setInterval(() => {
            //     this.user.setActivity(`${options.prefix}help | ${this.guilds.cache.size.toLocaleString()} servers`);
            // }, (10 * 1000));
        });

        this.on("message", async (message) => {
            const mentionRegex = RegExp(`^<@!${this.user.id}>$`);
            const mentionRegexPrefix = RegExp(`^<@!${this.user.id}> `);

            if (!message.guild || message.author.bot) return;

            if (message.content.match(mentionRegex))
                message.channel.send(`Mi prefijo es \`${this.prefix}\`.`);

            const prefix = message.content.match(mentionRegexPrefix)
                ? message.content.match(mentionRegexPrefix)[0]
                : this.prefix;

            if (!message.content.startsWith(prefix)) return;

            const [cmd, ...args] = message.content
                .slice(prefix.length)
                .trim()
                .split(/ +/g);

            const command =
                this.commands.get(cmd.toLowerCase()) ||
                this.commands.get(this.aliases.get(cmd.toLowerCase()));
            if (command) {
                console.log(
                    `[cmd][${message.author.tag}] -> [${cmd}] [${message.content}]`
                );
                command.run(message, args);
            }
        });
    }

    validate(options) {
        if (typeof options !== "object")
            throw new TypeError("Options should be a type of Object.");

        if (!options.token)
            throw new Error("You must pass the token for the client.");
        this.token = options.token;

        if (!options.prefix)
            throw new Error("You must pass a prefix for the client.");
        if (typeof options.prefix !== "string")
            throw new TypeError("Prefix should be a type of String.");
        this.prefix = options.prefix;

        this.owners = options.owners;
    }

    async start(token = this.token) {
        this.utils.loadCommands();
        super.login(token);
    }
};
