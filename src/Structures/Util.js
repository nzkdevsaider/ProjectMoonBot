const path = require("path");
const { promisify } = require("util");
const glob = promisify(require("glob"));
const Command = require("./Command.js");

module.exports = class Util {
	constructor(client) {
		this.client = client;
	}

	isClass(input) {
		return (
			typeof input === "function" &&
			typeof input.prototype === "object" &&
			input.toString().substring(0, 5) === "class"
		);
	}

	get directory() {
		return `${path.dirname(require.main.filename)}${path.sep}`;
	}

	trimArray(arr, maxLen = 10) {
		if (arr.length > maxLen) {
			const len = arr.length - maxLen;
			arr = arr.slice(0, maxLen);
			arr.push(`${len} more...`);
		}
		return arr;
	}

	formatBytes(bytes) {
		if (bytes === 0) return "0 Bytes";
		const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${
			sizes[i]
		}`;
	}

	removeDuplicates(arr) {
		return [...new Set(arr)];
	}

	capitalise(string) {
		return string
			.split(" ")
			.map((str) => str.slice(0, 1).toUpperCase() + str.slice(1))
			.join(" ");
	}

	async loadCommands() {
		return glob(`${this.directory}Commands/**/*.js`).then((commands) => {
			for (const commandFile of commands) {
				delete require.cache[commandFile];
				const { name } = path.parse(commandFile);
				const File = require(commandFile);
				if (!this.isClass(File))
					throw new TypeError(
						`Command ${name} doesn't export a class.`
					);
				const command = new File(this.client, name.toLowerCase());
				if (!(command instanceof Command))
					throw new TypeError(
						`Comamnd ${name} doesnt belong in Commands.`
					);
				this.client.commands.set(command.name, command);
				if (command.aliases.length) {
					for (const alias of command.aliases) {
						this.client.aliases.set(alias, command.name);
					}
				}
			}
		});
	}

	async getImageInteract(name) {
		if (!name) throw TypeError("El nombre de la interacción es necesario.");
		let axios = require("axios");
		let url =
			"https://api.github.com/repositories/273819064/contents/resources";
		let content;
		try {
			content = await axios.get(url + "/" + name + "?ref=master");
		} catch {
			throw Error(
				"No se ha podido encontrar ningún archivo de esta interacción."
			);
		}
		let getFiles = content.data.map((f) => f.download_url);
		let getRandom = getFiles[Math.floor(Math.random() * getFiles.length)];
		return getRandom;
	}

	shipName(name1, name2) {
		return (
			name1.slice(0, Math.floor(name1.length / 2)) +
			name2.slice(Math.floor(name2.length / 2))
		);
	}
};
