const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
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
app.listen(port, () => {
    console.log(`listening ${port}`);
});