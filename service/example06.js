const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const Redis = require('ioredis');
const BasicHandler = require('../handler/leaderboard_basic.js');
const UnionStoreHandler = require('../handler/leaderboardRangeTime_unionstore.js');

module.exports = () => {
    const app = new Koa();
    
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
    const rootRouter = new Router();
    const basicRouter = new Router();
    const unionStoreRouter = new Router();

    basicRouter.post('/apia', BasicHandler.apia);
    basicRouter.post('/apib', BasicHandler.apib);
    basicRouter.post('/apic', BasicHandler.apic);
    basicRouter.get('/leaderboard', BasicHandler.leaderboard);

    unionStoreRouter.post('/apia', UnionStoreHandler.apia);
    unionStoreRouter.post('/apib', UnionStoreHandler.apib);
    unionStoreRouter.post('/apic', UnionStoreHandler.apic);
    unionStoreRouter.get('/leaderboard', UnionStoreHandler.leaderboard);

    rootRouter.use('/1', basicRouter.routes());
    rootRouter.use('/2', unionStoreRouter.routes());
    app.use(rootRouter.routes());

    return { app, };
};