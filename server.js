// Dependencies
const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');

// Creating the "webserver"
const app = new Koa();

// Load the logger module and create a new instance with the name 'server.js'
const log = require('./modules/logger')('server.js');

// Once a new request hits the server, this will be the first function that is called.
// It logs the URL and measures the time
app.use(async(ctx, next) => {
    log(`${ctx.method} ${ctx.url} - start`);
    const start = new Date();
    await next();
    const ms = new Date() - start;
    log(`${ctx.method} ${ctx.url} - ended after ${ms}ms`);
});

// Server static files
app.use(serve(__dirname + '/public'));

// We use koa-router to simplify handling of different routes
const router = new Router();

router.get('/', async(ctx, next) => {
    ctx.body = 'Welcome to our coin project website!';
});

const apiRoutes = require('./api');

// Add our routes to the webserver
app.use(router.routes());
app.use(apiRoutes.routes());
app.use(router.allowedMethods());

// Tell the webserver to start listening on port 3000
app.listen(3000);