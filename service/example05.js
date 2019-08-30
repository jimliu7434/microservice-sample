const Redis = require('ioredis');
const MQ = require('../class/mq');

class Example {
    constructor({ port, }) {
        const that = this;
        this.port = port;

        const redisOpt = {
            host: '127.0.0.1',
            port: 6379,
            db: 1,
            keepAlive: true,
        };

        this.redis = new Redis(redisOpt);

        this.pubAdd = new MQ({ type: 'PUBLISH', queue: 'addservice', });
        this.subAdd = new MQ({ type: 'SUBSCRIBE', queue: 'addservice', });
        this.pubRemove = new MQ({ type: 'PUBLISH', queue: 'removeservice', });
        this.subRemove = new MQ({ type: 'SUBSCRIBE', queue: 'removeservice', });

        this.redis.on('ready', async () => {
            console.log('[Example05] redis ready');
            const host = `127.0.0.1:${that.port}`;
            that.redis.sadd('podslist', host);
            await that.getPods();
        });

        that.subAdd.on('data', ({msg, ack,}) => {
            console.log(`[Example05] Someone joined : ${msg}`);
            that.list.add(msg);
            that.showPods();
            if (ack) {
                ack();
            }
        });

        that.subRemove.on('data', ({msg, ack,}) => {
            console.log(`[Example05] Someone leaved : ${msg}`);
            that.list.delete(msg);
            that.showPods();
            if (ack) {
                ack();
            }
        });

        this.pubAdd.on('ready', () => {
            const host = `127.0.0.1:${that.port}`;
            setTimeout(() => {
                that.pubAdd.publish(host);
                console.log(`[Example05] ※ I joined from ip ${host} !`);
            }, 500);
        });
    }

    async getPods() {
        this.list = new Set(await this.redis.smembers('podslist'));
    }

    async showPods() {
        for (const ip of this.list) {
            console.log(`[Example05] Service: ${ip}`);
        }
        console.log('---');
    }

    async leave() {
        const host = `127.0.0.1:${this.port}`;
        await this.redis.srem('podslist', host);
        this.pubRemove.publish(host);
        await this.getPods();
        console.log(`[Example05] ※ I leaved from ip ${host} !`);
    }
}

module.exports = Example;

