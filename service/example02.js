const Redis = require('ioredis');

class Example {
    constructor({ port, }) {
        const that = this;
        this.port = port;

        this.redis = new Redis({
            host: '127.0.0.1',
            port: 6379,
            db: 1,
            keepAlive: true,
        });

        this.redis.on('ready', async () => {
            console.log('[Example02] Redis is ready');
            that.redis.sadd('podslist', `127.0.0.1:${that.port}`);
            await that.getPods();
        });
    }

    async getPods() {
        this.list = new Set(await this.redis.smembers('podslist'));
    }

    async leave() {
        await this.redis.srem('podslist', `127.0.0.1:${this.port}`);
        await this.getPods();
    }

    showPods() {
        for (const ip of this.list) {
            console.log(`[Example02] Service: ${ip}`);
        }
        console.log('---');
    }
}

module.exports = Example;