const Router = require('koa-router');
const dbConnection = require('./db');
let _ = require('lodash');

const router = new Router({
    prefix: '/api'
});

let db;

dbConnection.init().then(res => {
    db = res;
    console.log('db is initialized');
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
        'image': "http://www.returndates.com/backgrounds/criminalminds.jpg",
        'titleimage': "http://www.asset1.net/tv/pictures/show/criminal-minds/Criminal-Minds-S10-LB-1.jpg"
    },
    '4': {
        'image': "http://thetvdb.com/banners/fanart/original/323168-10.jpg",
        'titleimage': "https://img-www.tf-cdn.com/show/2/13-reasons-why.jpeg?_v=20170307014747&w=1024&h=342&dpr=2&auto=compress&fit=crop&crop=faces,top"
    }
};


let getShowsFromDb = () => {
    return new Promise((resolve, reject) => {
        db.sequelize.models.tvShow.findAll().then(dbShows => {
            console.log(dbShows);
            let shows = [];
            dbShows.forEach(function (dbShow) {
                // TODO make dummy data dynamic!
                let show = {
                    'id': dbShow.id,
                    'name': dbShow.title,
                    'image': staticData[dbShow.id]['image'],
                    'titleimage': staticData[dbShow.id]['titleimage'],
                    'episodes': 70,
                    'viewers': 51301,
                    'imdbRatingDistribution': {
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
                };
                shows.push(show);
            });
            resolve(shows);
        });
    });
};


let getShowFromDb = (showId) => {
    console.log('getting show', showId);
    return new Promise((resolve, reject) => {
        db.sequelize.models.tvShow.findAll({
            where: { id: showId },
            include: [{
                model: db.sequelize.models.season,
                attributes: ['id', 'seasonNumber'],
                include: [{
                    model: db.sequelize.models.episode,
                    attributes: ['id', 'name', 'episodeNumber'],
                    include: [{
                        model: db.sequelize.models.imdbUserReview,
                        attributes: ['id', 'rating']
                    }]
                }]
            }]
        }).then(dbShow => {
            dbShow = dbShow[0];
            let seasons = [];
            let episodesCount = 0;
            let imdbUserReviewsCount = 0;
            let imdbUserReviewRatings = {};
            _.range(1, 11).forEach(x => imdbUserReviewRatings[x] = 0);
            dbShow.seasons.forEach(season => {
                let tempSeason = { id: season.id, seasonNumber: season.seasonNumber };
                let tempEpisodes = [];
                season.episodes.forEach(episode => {
                    episodesCount += 1;
                    tempEpisodes.push({ id: episode.id, name: episode.name });
                    imdbUserReviewsCount += episode.imdbUserReviews.length;
                    episode.imdbUserReviews.forEach(imdbUserReview => {
                        if (imdbUserReview.rating !== null)
                            imdbUserReviewRatings[imdbUserReview.rating.toString()] += 1;
                    });
                });
                tempSeason.episodes = tempEpisodes;
                seasons.push(tempSeason);
            });
            // TODO make dummy data dynamic!
            let show = {
                'id': dbShow.id,
                'name': dbShow.title,
                'image': staticData[dbShow.id]['image'],
                'titleimage': staticData[dbShow.id]['titleimage'],
                'runtime': dbShow.runtime,
                'genres': dbShow.genres,
                'releaseDate': dbShow.releaseDate,
                'seasonsCount': seasons.length,
                'episodesCount': episodesCount,
                'viewers': 51301,
                'imdbRating': dbShow.rating,
                'imdbUserReviewsCount': imdbUserReviewsCount,
                'imdbRatingDistribution': imdbUserReviewRatings,
                'seasons': seasons
            };
            resolve(show);
        });
    });
};

router.use(async (ctx, next) => {
    if (!db) {
        ctx.body = { message: 'API starting up' };
    } else {
        await next();
    }
});

router.get('/', async (ctx, next) => {
    ctx.body = {
        'message': 'Hello!'
    };
});

router.get('/show/', async (ctx, next) => {
    let shows = await getShowsFromDb();
    ctx.body = shows;
});

router.get('/show/:id', async (ctx, next) => {
    if (!ctx.params.id) return;
    let show = await getShowFromDb(ctx.params.id);
    ctx.body = show;
});

router.get('/show/:id/season/', async (ctx, next) => {
    if (!ctx.params.id) return;
    let show = shows.filter(s => s.id === ctx.params.id);
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