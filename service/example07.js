const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const Redis = require('ioredis');
const Handler = require('../handler/leaderboardRangeTime_mq.js');
const MQ = require('../class/mq_delaymsg.js');
const DELAY = 0.5 * 60 * 1000;

module.exports = () => {
    const app = new Koa();
    const router = new Router();
    const redis = new Redis({
        host: '127.0.0.1',
        port: 6379,
        db: 0,
        keepAlive: true,
    });
    const Pub = new MQ({ type: 'PUB', delay: DELAY, });
    const Sub = new MQ({ type: 'SUB', });

    Sub.on('data', ({ msg, ack, }) => {
        const { type, key, member, } = JSON.parse(msg);
        if (type === 'minus') {
            redis.zincrby(key, -1, member);
            console.log(`${member} : -1 `);
        }
        if (ack) ack();
    });

    app.use(bodyParser());
    app.use(async (ctx, next) => {
        ctx.RedisService = redis;
        ctx.PubService = Pub;
        ctx.SubService = Sub;
        return await next();
    });

    router.post('/apia', Handler.apia);
    router.post('/apib', Handler.apib);
    router.post('/apic', Handler.apic);
    router.get('/leaderboard', Handler.leaderboard);

    app.use(router.routes());

    return { app, };
};