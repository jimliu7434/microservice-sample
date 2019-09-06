const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const Redis = require('ioredis');
const Handler = require('../handler/leaderboard_basic.js');
// const Handler = require('../handler/leaderboardRangeTime_local.js');

module.exports = () => {
    const app = new Koa();
    const router = new Router();
    const redis = new Redis({
        host: '127.0.0.1',
        port: 6379,
        db: 0,
        keepAlive: true,
    });

    app.use(bodyParser());
    app.use(async (ctx, next) => {
        ctx.RedisService = redis;
        return await next();
    });

    router.post('/apia', Handler.apia);
    router.post('/apib', Handler.apib);
    router.post('/apic', Handler.apic);
    router.get('/leaderboard', Handler.leaderboard);

    app.use(router.routes());

    return { app, };
};