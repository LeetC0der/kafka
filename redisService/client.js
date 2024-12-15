const {Redis} = require('ioredis');

const Client = new Redis();

module.exports = {
    Client
};