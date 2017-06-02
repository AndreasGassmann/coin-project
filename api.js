const Router = require('koa-router');
const dbConnection = require('./db');

const router = new Router({
    prefix: '/api'
});

let shows = [{
    'id': 1,
    'name': 'Game of Thrones',
    'image': "http://thetvdb.com/banners/fanart/original/121361-15.jpg",
    'titleimage': "https://red.elbenwald.de/media/image/3a/49/87/game-of-thrones_cat.jpg",
    'episodes': 70,
    'viewers': 51301,
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
    },
    'seasons': [{
        id: 1,
        episodes: [{
            id: 1,
            name: 'Test'
        }, {
            id: 2,
            name: 'Test'
        }, {
            id: 3,
            name: 'Test'
        }, {
            id: 4,
            name: 'Test'
        }, {
            id: 5,
            name: 'Test'
        }]
    }, {
        id: 2,
        episodes: [{
            id: 1,
            name: 'Test'
        }, {
            id: 2,
            name: 'Test'
        }, {
            id: 3,
            name: 'Test'
        }, {
            id: 4,
            name: 'Test'
        }, {
            id: 5,
            name: 'Test'
        }]
    },{
        id: 3,
        episodes: [{
            id: 1,
            name: 'Test'
        }, {
            id: 2,
            name: 'Test'
        }, {
            id: 3,
            name: 'Test'
        }, {
            id: 4,
            name: 'Test'
        }, {
            id: 5,
            name: 'Test'
        }]
    },{
        id: 4,
        episodes: [{
            id: 1,
            name: 'Test'
        }, {
            id: 2,
            name: 'Test'
        }, {
            id: 3,
            name: 'Test'
        }, {
            id: 4,
            name: 'Test'
        }, {
            id: 5,
            name: 'Test'
        }]
    },{
        id: 5,
        episodes: [{
            id: 1,
            name: 'Test'
        }, {
            id: 2,
            name: 'Test'
        }, {
            id: 3,
            name: 'Test'
        }, {
            id: 4,
            name: 'Test'
        }, {
            id: 5,
            name: 'Test'
        }]
    },{
        id: 6,
        episodes: [{
            id: 1,
            name: 'Test'
        }, {
            id: 2,
            name: 'Test'
        }, {
            id: 3,
            name: 'Test'
        }, {
            id: 4,
            name: 'Test'
        }, {
            id: 5,
            name: 'Test'
        }]
    }]
}, {
    'id': 2,
    'name': 'The Big Bang Theory',
    'image': "http://thetvdb.com/banners/fanart/original/80379-38.jpg",
    'titleimage': "https://red.elbenwald.de/media/image/e5/96/fc/big-bang-theorycat.jpg",
    'episodes': 70,
    'viewers': 51301,
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
    },
    'seasons': [{
        id: 1,
        episodes: [{
            id: 1,
            name: 'Test'
        }, {
            id: 2,
            name: 'Test'
        }, {
            id: 3,
            name: 'Test'
        }, {
            id: 4,
            name: 'Test'
        }, {
            id: 5,
            name: 'Test'
        }]
    }, {
        id: 2,
        episodes: [{
            id: 1,
            name: 'Test'
        }, {
            id: 2,
            name: 'Test'
        }, {
            id: 3,
            name: 'Test'
        }, {
            id: 4,
            name: 'Test'
        }, {
            id: 5,
            name: 'Test'
        }]
    }],
}, {
    'id': 3,
    'name': '13 Reasons Why',
    'image': "http://thetvdb.com/banners/fanart/original/323168-10.jpg",
    'titleimage': "https://img-www.tf-cdn.com/show/2/13-reasons-why.jpeg?_v=20170307014747&w=1024&h=342&dpr=2&auto=compress&fit=crop&crop=faces,top",
    'episodes': 70,
    'viewers': 51301,
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
    },
    'seasons': [{
        id: 1,
        episodes: [{
            id: 1,
            name: 'Test'
        }, {
            id: 2,
            name: 'Test'
        }, {
            id: 3,
            name: 'Test'
        }, {
            id: 4,
            name: 'Test'
        }, {
            id: 5,
            name: 'Test'
        }]
    }, {
        id: 2,
        episodes: [{
            id: 1,
            name: 'Test'
        }, {
            id: 2,
            name: 'Test'
        }, {
            id: 3,
            name: 'Test'
        }, {
            id: 4,
            name: 'Test'
        }, {
            id: 5,
            name: 'Test'
        }]
    }],
}, {
    'id': 4,
    'name': 'Criminal Minds',
    'image': "http://www.returndates.com/backgrounds/criminalminds.jpg",
    'titleimage': "http://www.asset1.net/tv/pictures/show/criminal-minds/Criminal-Minds-S10-LB-1.jpg",
    'episodes': 70,
    'viewers': 51301,
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
    },
    'seasons': [{
        id: 1,
        episodes: [{
            id: 1,
            name: 'Test'
        }, {
            id: 2,
            name: 'Test'
        }, {
            id: 3,
            name: 'Test'
        }, {
            id: 4,
            name: 'Test'
        }, {
            id: 5,
            name: 'Test'
        }]
    }, {
        id: 2,
        episodes: [{
            id: 1,
            name: 'Test'
        }, {
            id: 2,
            name: 'Test'
        }, {
            id: 3,
            name: 'Test'
        }, {
            id: 4,
            name: 'Test'
        }, {
            id: 5,
            name: 'Test'
        }]
    }],
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
    let show = shows.filter(s => s.id == ctx.params.id);
    ctx.body = show.length === 1 ? show[0] : show;
});

router.get('/show/:id/seasons/', async(ctx, next) => {
    if (!ctx.params.id) return;
    let show = shows.filter(s => s.id == ctx.params.id);
    ctx.body = show.length === 1 ? show[0] : show;
});

router.get('/show/:id/seasons/:seasonId', async(ctx, next) => {
    if (!ctx.params.id) return;
    let show = shows.filter(s => s.id == ctx.params.id);
    let season = show.seasons.filter(e => e.id == ctx.params.seasonId)
    ctx.body = season.length === 1 ? season[0] : season;
});



module.exports = router;