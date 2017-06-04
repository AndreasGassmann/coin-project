const Router = require('koa-router');
const dbConnection = require('./db');

const router = new Router({
    prefix: '/api'
});

// TODO make static data dynamic in queries, then delete this object
staticData = {
    '1': {
        'image': "http://thetvdb.com/banners/fanart/original/121361-15.jpg",
        'titleimage': "https://red.elbenwald.de/media/image/3a/49/87/game-of-thrones_cat.jpg"
    },
    '2': {
        'image': "http://thetvdb.com/banners/fanart/original/80379-38.jpg",
        'titleimage': "https://red.elbenwald.de/media/image/e5/96/fc/big-bang-theorycat.jpg"
    },
    '3': {
        'image': "http://thetvdb.com/banners/fanart/original/323168-10.jpg",
        'titleimage': "https://img-www.tf-cdn.com/show/2/13-reasons-why.jpeg?_v=20170307014747&w=1024&h=342&dpr=2&auto=compress&fit=crop&crop=faces,top"
    },
    '4': {
        'image': "http://www.returndates.com/backgrounds/criminalminds.jpg",
        'titleimage': "http://www.asset1.net/tv/pictures/show/criminal-minds/Criminal-Minds-S10-LB-1.jpg"
    }
};


let getShowsFromDb = () => {
    return new Promise((resolve, reject) => {
        // TODO do initialization of db connection earlier (to avoid multiple db initializations)
        dbConnection.init().then(db => {
            db.sequelize.models.tvShow.findAll().then(dbShows => {
                var shows = [];
                dbShows.forEach(function (dbShow) {
                    // TODO make dummy data dynamic!
                    var show = {
                        'id': dbShow.id,
                        'name': dbShow.title,
                        'image': staticData[dbShow.id]['image'],
                        'titleimage': staticData[dbShow.id]['titleimage'],
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
                        'seasons': 9
                    }
                    shows.push(show);
                });
                resolve(shows);
            });
        });
    });
};


let getShowFromDb = (showId) => {
    return new Promise((resolve, reject) => {
        // TODO do initialization of db connection earlier (to avoid multiple db initializations)
        dbConnection.init().then(db => {
            db.sequelize.models.tvShow.findById(showId).then(dbShow => {
                // TODO make dummy data dynamic!
                var show = {
                    'id': dbShow.id,
                    'name': dbShow.title,
                    'image': staticData[dbShow.id]['image'],
                    'titleimage': staticData[dbShow.id]['titleimage'],
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
                    'seasons': [
                        {
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
                            }]
                        },
                        {
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
                            }]
                        }
                    ]
                }
                resolve(show);
            });
        });
    });
};


router.get('/', async (ctx, next) => {
    ctx.body = {
        'message': 'Hello!'
    };
});

router.get('/show/', async (ctx, next) => {
    var shows = await getShowsFromDb();
    ctx.body = shows;
});

router.get('/show/:id', async (ctx, next) => {
    if (!ctx.params.id) return;
    var show = await getShowFromDb(ctx.params.id);
    ctx.body = show;
});

router.get('/show/:id/season/', async (ctx, next) => {
    if (!ctx.params.id) return;
    let show = shows.filter(s => s.id == ctx.params.id);
    ctx.body = show.length === 1 ? show[0] : show;
});

router.get('/show/:id/season/:seasonId', async (ctx, next) => {
    ctx.body = {};
});

router.get('/show/:id/season/:seasonId/episode', async (ctx, next) => {
    ctx.body = {};
});

router.get('/show/:id/season/:seasonId/episode/:episodesId', async (ctx, next) => {
    ctx.body = {};
});



module.exports = router;