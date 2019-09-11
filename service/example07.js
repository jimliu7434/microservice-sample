const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const Redis = require('ioredis');
const SetTimeoutHandler = require('../handler/leaderboardRangeTime_settimeout.js');
const MqDelayHandler = require('../handler/leaderboardRangeTime_mqdelay.js');
const MQ = require('../class/mq_delaymsg.js');
const DELAY = 0.5 * 60 * 1000;

module.exports = () => {
    const app = new Koa();
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

    const rootRouter = new Router();
    const settimoutRouter = new Router();
    const mqDelayRouter = new Router();

    settimoutRouter.post('/apia', SetTimeoutHandler.apia);
    settimoutRouter.post('/apib', SetTimeoutHandler.apib);
    settimoutRouter.post('/apic', SetTimeoutHandler.apic);
    settimoutRouter.get('/leaderboard', SetTimeoutHandler.leaderboard);

    mqDelayRouter.post('/apia', MqDelayHandler.apia);
    mqDelayRouter.post('/apib', MqDelayHandler.apib);
    mqDelayRouter.post('/apic', MqDelayHandler.apic);
    mqDelayRouter.get('/leaderboard', MqDelayHandler.leaderboard);

    rootRouter.use('/3', settimoutRouter.routes());
    rootRouter.use('/4', mqDelayRouter.routes());
    app.use(rootRouter.routes());

    return { app, };
};