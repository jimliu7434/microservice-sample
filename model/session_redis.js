const base = require('./session_base.js');
const Redis = require('ioredis');

class Session extends base{
    constructor() {
        super();
        this.maxAge = 300 * 1000;
        this.store = new Redis({
            host: '127.0.0.1',
            port: 6379,
            db: 0,
            keepAlive: true,
        });
        this.store.on('ready',  () => {
            console.log(`[Example01] Redis is ready`);
        });
        this.isAsync = true;
    }

    async Get(key) {
        const json = await this.store.get(key);
        return JSON.parse(json);
    }

    async Set(key, data) {
        const json = JSON.stringify(data);
        await this.store.setex(key, this.maxAge, json);
        return ;
    }

    async Destroy(key) {
        await this.store.del(key);
        return ; 
    }
}

module.exports = Session;