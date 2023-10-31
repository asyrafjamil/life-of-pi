const redis = require('redis');

class RedisClient {
    constructor() {
        this.client = redis.createClient({
            url: process.env.REDIS_URL || 'redis://redis:6379'
        });

        this.client.on('error', (err) => {
            console.error(`An error occurred with Redis: ${err}`);
        });

        this.connect();
    }

    async connect() {
        try {
            await this.client.connect();
            console.log('Redis connected successfully...');
        } catch (err) {
            console.error('Failed to connect to Redis:', err);
        }
    }

    async set(key, value) {
        try {
            await this.client.set(key, value);
            console.log(`Value set for ${key}`);
        } catch (err) {
            console.error('Redis Set Error:', err);
        }
    }

    async get(key) {
        try {
            const value = await this.client.get(key);
            console.log(`Value for ${key}:`, value);
            return value;
        } catch (err) {
            console.error('Redis Get Error:', err);
        }
    }
}

const redisClient = new RedisClient();

module.exports = redisClient;
