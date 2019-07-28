const Redis = require('ioredis');

class Pods {
    constructor({ port }) {
        const that = this;
        this.port = port;

        this.redis = new Redis({
            host: '127.0.0.1',
            port: 6379,
            db: 1,
            keepAlive: true,
        });

        this.redis.on('ready', async () => {
            console.log(`pods service ready`);
            that.redis.rpush('podslist', `127.0.0.1:${that.port}`);
            await that.getPods();
        });
    }

    async getPods() {
        this.list = new Set(await this.redis.lrange('podslist', 0, -1));
    }

    showPods() {
        for (const ip of this.list) {
            console.log(`pods: ${ip}`);
        }
        console.log('---');
    }
}

module.exports = Pods;