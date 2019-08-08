const Redis = require('ioredis');

class Pods {
    constructor({ port }) {
        const that = this;
        this.port = port;

        const redisOpt = {
            host: '127.0.0.1',
            port: 6379,
            db: 1,
            keepAlive: true,
        };

        this.redis = new Redis(redisOpt);

        this.pub = new Redis(redisOpt);
        this.sub = new Redis(redisOpt);

        this.redis.on('ready', async () => {
            console.log(`pods service ready`);
            const host = `127.0.0.1:${that.port}`;
            that.redis.sadd('podslist', host);
            await that.getPods();
        });

        that.sub.subscribe('addpods', 'removepods', (err, count) => {
            if (err) {
                throw err;
            }
        });

        that.sub.on('message', (channel, msg) => {
            if (channel === 'addpods') {
                console.log(`someone joined : ${msg}`);
                that.list.add(msg);
                that.showPods();
            }
            else if (channel === 'removepods') {
                console.log(`someone leaved : ${msg}`);
                that.list.delete(msg);
                that.showPods();
            }
        });

        this.pub.on('ready', () => {
            const host = `127.0.0.1:${that.port}`;
            setTimeout(() => {
                that.pub.publish("addpods", host);
                console.log(`※ I'm joined from ip ${host} !`);
            }, 500);
        });
    }

    async getPods() {
        this.list = new Set(await this.redis.smembers('podslist'));
    }

    async showPods() {
        for (const ip of this.list) {
            console.log(`pods: ${ip}`);
        }
        console.log('---');
    }

    async leave() {
        const host = `127.0.0.1:${this.port}`;
        this.pub.publish("removepods", host);
        await this.redis.srem('podslist', host);
        await this.getPods();
        console.log(`※ I'm leaved from ip ${host} !`);
    }
}

module.exports = Pods;