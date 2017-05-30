const Router = require('koa-router');

const router = new Router({
    prefix: '/api'
});

let shows = [{
    'id': 1,
    'name': 'Game of Thrones',
    'seasons': 7,
    'episodes': 70,
    'rating': {
        '1': 5,
        '2': 57,
        '3': 72,
        '4': 322,
        '5': 263,
        '6': 886,
        '7': 1201,
        '8': 2200,
        '9': 2301,
        '10': 1900
    }
}, {
    'id': 2,
    'name': '13 Reasons Why'
}, {
    'id': 3,
    'name': 'Criminal Minds'
}];

router.get('/', async(ctx, next) => {
    ctx.body = {
        'message': 'Hello!'
    };
});

router.get('/show/', async(ctx, next) => {
    ctx.body = shows;
});

router.get('/show/:id', async(ctx, next) => {
    if (!ctx.params.id) return;
    ctx.body = shows.filter(s => s.id == ctx.params.id);
});



module.exports = router;