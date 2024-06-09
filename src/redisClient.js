const redis = require('redis');
require('dotenv').config();

exports.redisClient = redis.createClient({
	// url: process.env.redisUrl
	username: process.env.redisUser,
    password: process.env.redisPassword,
    legacyMode: false,
    socket: {
        host: process.env.redisHost,
        port: process.env.redisPort,
        keepAlive: false,
    }
});