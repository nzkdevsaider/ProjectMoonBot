const MoonClient = require('./Structures/MoonClient.js');
const config = require('../config.js');

const client = new MoonClient(config);
client.start();