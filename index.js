const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const config = require('./config.js');
const LoginHandler = require('./handler/login.js');
const SessionMiddleware = require('./middleware/session.js');
const SessionModel = new (require('./model/session_local.js'))();
const SessionStoreModel = new (require('./model/session_redis.js'))();

const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(SessionMiddleware(SessionModel));
app.use(SessionMiddleware(SessionStoreModel));

router.post('/login', LoginHandler.login);
router.post('/logout', LoginHandler.logout);
router.get('/session', LoginHandler.session);
router.get('/sessionAsync', LoginHandler.sessionAsync);
router.post('/loginAsync', LoginHandler.loginAsync);
router.post('/logoutAsync', LoginHandler.logoutAsync);
app.use(router.routes());

const port = Number(process.argv[2] || 80);
app.listen(port, async () => {
    console.log(`listening ${port}`);

    if (config.showRedisList === '1') {
        const PodsService1 = new (require('./service/pods1.js'))({ port });
        setInterval(async () => {
            await PodsService1.getPods();
            PodsService1.showPods();
        }, 10000);
    }
    if (config.showRedisPubSub === '1') {
        const PodsService2 = new (require('./service/pods2.js'))({ port });
        setInterval(() => {
            PodsService2.leave();
        }, 120000);
    }
});