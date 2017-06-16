const Router = require('koa-router');
const dbConnection = require('./db');

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
        'image': "../assets/img/show-cards/game-of-thrones.jpg",
        'titleimage': "../assets/img/title-images/game-of-thrones.jpg"
    },
    '2': {
        'image': "../assets/img/show-cards/big-bang-theory.jpg",
        'titleimage': "../assets/img/title-images/big-bang-theory.jpg"
    },
    '3': {
        'image': "../assets/img/show-cards/criminal-minds.jpg",
        'titleimage': "../assets/img/title-images/criminal-minds.jpg"
    },
    '4': {
        'image': "../assets/img/show-cards/13-reasons-why.jpg",
        'titleimage': "../assets/img/title-images/13-reasons-why.jpg"
    }
};

let stopWords = [
    'about', 'after', 'all', 'also', 'am', 'an', 'and', 'another', 'any', 'are', 'as', 'at', 'be',
    'because', 'been', 'before', 'being', 'between', 'both', 'but', 'by', 'came', 'can',
    'come', 'could', 'did', 'do', 'each', 'for', 'from', 'get', 'got', 'has', 'had',
    'he', 'have', 'her', 'here', 'him', 'himself', 'his', 'how', 'if', 'in', 'into',
    'is', 'it', 'like', 'make', 'many', 'me', 'might', 'more', 'most', 'much', 'must',
    'my', 'never', 'now', 'of', 'on', 'only', 'or', 'other', 'our', 'out', 'over',
    'said', 'same', 'see', 'should', 'since', 'some', 'still', 'such', 'take', 'than',
    'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those',
    'through', 'to', 'too', 'under', 'up', 'very', 'was', 'way', 'we', 'well', 'were',
    'what', 'where', 'which', 'while', 'who', 'with', 'would', 'you', 'your', 'a', 'i'
];


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
                    'imdbUserReviewsCount': dbShow.imdb_review_count,
                    'imdbRatingDistribution': dbShow.ratingDistribution,
                    'traktCommentCount': dbShow.trakt_review_count,
                    'redditPost_count': dbShow.redditPost_count,
                    'redditComment_count': dbShow.redditComment_count,
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
            where: {
                id: showId
            },
            include: [{
                model: db.sequelize.models.season,
                attributes: ['id', 'seasonNumber', 'average_imdb_rating', 'average_trakt_rating', 'totalepisodes', 'redditPost_count', 'redditComment_count']
            }, {
                model: db.sequelize.models.ratingDistribution,
                attributes: ['star1', 'star2', 'star3', 'star4', 'star5', 'star6', 'star7', 'star8', 'star9', 'star10'],
            }, {
                model: db.sequelize.models.traktRatingDistribution,
                attributes: ['star1', 'star2', 'star3', 'star4', 'star5', 'star6', 'star7', 'star8', 'star9', 'star10'],
            }, {
                model: db.sequelize.models.imdbCorrelation,
                attributes: ['regr_r_square', 'regr_coeff_intercept', 'regr_coeff_slope', 'v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9', 'v10']
            }]
        }).then(dbShow => {
            dbShow = dbShow[0];
            // TODO make dummy data dynamic!
            let show = {
                'id': dbShow.id,
                'name': dbShow.title,
                'image': staticData[dbShow.id]['image'],
                'titleimage': staticData[dbShow.id]['titleimage'],
                'runtime': dbShow.runtime,
                'genres': dbShow.genres,
                'releaseDate': dbShow.releaseDate,
                'seasonsCount': dbShow.seasons.length,
                'episodesCount': dbShow.totalepisodes,
                'viewers': 51301,
                'imdbRating': dbShow.rating,
                'imdbUserReviewsCount': dbShow.imdb_review_count,
                'imdbRatingDistribution': dbShow.ratingDistribution,
                'traktRating': dbShow.average_trakt_rating,
                'traktCommentCount': dbShow.trakt_review_count,
                'traktRatingDistribution': dbShow.traktRatingDistribution,
                'redditPost_count': dbShow.redditPost_count,
                'redditComment_count': dbShow.redditComment_count,
                'seasons': dbShow.seasons,
                'imdbCorrelation': dbShow.imdbCorrelation
            };
            resolve(show);
        });
    });
};

let getSeasonFromDb = (showId, seasonId) => {
    return new Promise((resolve, reject) => {
        db.sequelize.models.season.findOne({
            where: {
                seasonNumber: seasonId,
                tvShowId: showId
            },
            include: [{
                model: db.sequelize.models.episode,
                attributes: ['id', 'name', 'episodeNumber', 'imdbRating', 'traktRating', 'redditPost_count', 'redditComment_count'],
            }, {
                model: db.sequelize.models.ratingDistribution,
                attributes: ['star1', 'star2', 'star3', 'star4', 'star5', 'star6', 'star7', 'star8', 'star9', 'star10'],
            }, {
                model: db.sequelize.models.traktRatingDistribution,
                attributes: ['star1', 'star2', 'star3', 'star4', 'star5', 'star6', 'star7', 'star8', 'star9', 'star10'],
            }]
        }).then(season => {
            let resolveSeason = {
                'id': season.id,
                'seasonNumber': season.seasonNumber,
                'episodesCount': season.totalepisodes,
                'imdbRating': season.average_imdb_rating,
                'imdbUserReviewsCount': season.imdb_review_count,
                'imdbRatingDistribution': season.ratingDistribution,
                'traktRating': season.average_trakt_rating,
                'traktCommentCount': season.trakt_review_count,
                'traktRatingDistribution': season.traktRatingDistribution,
                'redditPost_count': season.redditPost_count,
                'redditComment_count': season.redditComment_count,
                'episodes': season.episodes
            };

            resolve(resolveSeason);
        })
    })
};

let getEpisodeFromDb = (showId, seasonId, episodeId) => {
    return new Promise((resolve, reject) => {
        db.sequelize.models.season.findOne({
            where: {
                seasonNumber: seasonId,
                tvShowId: showId
            },
            include: [{
                model: db.sequelize.models.episode,
                attributes: ['id', 'name', 'episodeNumber', 'imdbRating', 'imdb_review_count', 'redditPost_count', 'redditComment_count'],
                include: [{
                    model: db.sequelize.models.ratingDistribution,
                    attributes: ['star1', 'star2', 'star3', 'star4', 'star5', 'star6', 'star7', 'star8', 'star9', 'star10'],
                }, {
                    model: db.sequelize.models.traktRatingDistribution,
                    attributes: ['star1', 'star2', 'star3', 'star4', 'star5', 'star6', 'star7', 'star8', 'star9', 'star10'],
                }]
            }]
        }).then(season => {
            for (let index in season.episodes) {
                if (season.episodes[index].episodeNumber === parseInt(episodeId)) {
                    resolve(season.episodes[index]);
                }
            }
        });
    });
};

let getCharacterStats = function () {
    return new Promise((resolve, reject) => {
        db.sequelize.models.characters.findAll({
            attributes: ['name', 'imdb_numOfAppearances', 'imdb_sentimentScoreAvg', 'imdb_sentimentScoreTotal', 'imdb_sentimentComparativeAvg',
                'imdb_emotionalitySubjectivityAvg',
                'imdb_emotionalityPolarityAvg',
                'redditTit_numOfAppearances',
                'redditTit_sentimentScoreAvg',
                'redditTit_sentimentScoreTotal',
                'redditTit_sentimentComparativeAvg',
                'redditTit_emotionalitySubjectivityAvg',
                'redditTit_emotionalityPolarityAvg'
            ]
        }).then(function (characterStats) {
            resolve(characterStats);
        });
    });
};

let getWordCloudDataForEpisode = (episodeId) => {
    return new Promise((resolve, reject) => {
        db.sequelize.models.imdbUserReview.findAll({
            where: {
                episodeId: episodeId
            },
            attributes: ['id', 'text_sentimentObject']
        }).then(res => {
            resolve(res);
        });
    });
};

router.use(async(ctx, next) => {
    if (!db) {
        ctx.body = {
            message: 'API starting up'
        };
    } else {
        await next();
    }
});

router.get('/', async(ctx, next) => {
    ctx.body = {
        'message': 'Hello!'
    };
});

router.get('/show/', async(ctx, next) => {
    let shows = await getShowsFromDb();
    ctx.body = shows;
});

router.get('/show/:id', async(ctx, next) => {
    if (!ctx.params.id) return;
    let show = await getShowFromDb(ctx.params.id);
    ctx.body = show;
});

router.get('/show/:id/season/', async(ctx, next) => {
    if (!ctx.params.id) return;
    let show = shows.filter(s => s.id === ctx.params.id);
    ctx.body = show.length === 1 ? show[0] : show;
});

router.get('/show/:id/season/:seasonId', async(ctx, next) => {
    if (!ctx.params.id || !ctx.params.seasonId) return;
    let season = await getSeasonFromDb(ctx.params.id, ctx.params.seasonId);
    ctx.body = season;
});

router.get('/show/:id/season/:seasonId/episode', async(ctx, next) => {
    ctx.body = {};
});

router.get('/characters/', async(ctx, next) => {
    ctx.body = await getCharacterStats();
});

router.get('/wordCloud/episode/:id', async(ctx, next) => {
    if (!ctx.params.id) return;
    let wordCloudData = await getWordCloudDataForEpisode(ctx.params.id);

    let wordCount = {};

    wordCloudData.forEach(c => {
        let data = c.dataValues.text_sentimentObject.split(`
`).join(' '); // Don't change this, otherwise JSON cannot be parsed!

        let obj = JSON.parse(data);
        obj.tokens.forEach(t => {
            if (wordCount.hasOwnProperty(t)) {
                wordCount[t].push(obj.score);
            } else {
                wordCount[t] = [obj.score];
            }
        })
    });

    let wordArray = [];

    for (var property in wordCount) {
        if (wordCount.hasOwnProperty(property)) {

            // calculate average
            let word = wordCount[property];
            let average = word.reduce(function (acc, val) {
                return acc + parseInt(val);
            }, 0) / wordCount[property].length;

            wordArray.push({
                text: property,
                size: wordCount[property].length,
                avgSentiment: average
            });
        }
    }

    wordArray = wordArray.filter(e => {
        return stopWords.indexOf(e.text) === -1;
    });

    wordArray = wordArray.filter(e => {
        return e.text;
    });

    let result = wordArray.sort((a, b) => {
        if (a.size > b.size) {
            return -1;
        }
        if (a.size < b.size) {
            return 1;
        }
        // a must be equal to b
        return 0;
    });

    let smallerArray = [];
    let count = 0;
    result.forEach(el => {
        if (count > 50) {
            return
        } else {

        }
        count++;
        //el.size = el.size * 3;
        smallerArray.push(el);
    });

    ctx.body = smallerArray;
});

router.get('/show/:id/season/:seasonId/episode/:episodeId', async(ctx, next) => {
    if (!ctx.params.id || !ctx.params.seasonId || !ctx.params.episodeId) return;
    let episode = await getEpisodeFromDb(ctx.params.id, ctx.params.seasonId, ctx.params.episodeId);
    ctx.body = episode;
});


module.exports = router;