let sentiment = require('sentiment');
let emotional = require('emotional');
let natural = require('natural');
const db = require('./db.js');
let _ = require('lodash');

let TfIdf = natural.TfIdf,
    tfidf = new TfIdf();

//let comments = require('./data/game-of-thrones-comments.json');

/*emotional.load(() => {
    comments.forEach(c => {
        console.log(c.comment);
        console.log('User rating: ' + c.user_rating);

        // Term frequency
        tfidf.addDocument(c.comment);

        console.dir(emotional.get(c.comment), {depth: null});

        // console.log(sentiment(c.comment));
    });

    // Words in comments
    // let commentNumber = 1;
    // tfidf.listTerms(commentNumber).forEach(function(item) {
    //     console.log(item.term + ': ' + item.tfidf);
    // });

    // Importance of word in each comment
    // let word = 'like';
    // tfidf.tfidfs(word, function(i, measure) {
    //     console.log('document #' + i + ' is ' + measure);
    // });
});*/

db.init().then((db) => {

    /**
     * Fetches distribution of star ratings
     * @param {string} level - tvshow, season or episode level is accepted
     * @param {int} id - id of the requested level. Eg. 0 for the first show/season/episode.
     * @returns {Promise<Object>} A promise to an array with the amount of 1-10 star ratings for imdb and trakt ratings for each level.
     */
    let getRatingDistribution = function (level, id) {
        return new Promise(function (resolve, reject) {

            // set the parameter for the 'where'-clause to the right attribute of the database table.
            let levelParam;
            if (level === 'tvshow') {
                levelParam = 'tvShowId';
            } else if (level === 'season') {
                levelParam = 'seasonId';
            } else if (level === 'episode') {
                levelParam = 'episodeId';
            } else {
                reject('level parameter is not tvshow, season or episode');
            }

            // initialize empty array of 1-10 star ratings (imdb)
            let imdbRatingDistribution = [];
            for (let i = 1; i <= 10; i++) {
                imdbRatingDistribution[i] = 0;
            }
            // initialize empty array of 1-10 star ratings (trakt)
            let traktRatingDistribution = [];
            for (let i = 1; i <= 10; i++) {
                traktRatingDistribution[i] = 0;
            }

            let promises = [];

            // fetch all imdb ratings for tvShowId
            promises.push(db.sequelize.models.imdbUserReview.findAll({
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
            }));
            // fetch all trakt ratings for tvShowId
            promises.push(db.sequelize.models.traktComment.findAll({
                where: {levelParam: id}
            }));

            // when all ratings where fetched (promises resolved), then fill the arrays.
            Promise.all(promises).then(function (data) {
                let imdbRatings = data[0];
                let traktRatings = data[1];

                // add any rating occurrence to the array
                for (let index in imdbRatings) {
                    if (imdbRatings[index].rating !== null) {
                        imdbRatingDistribution[imdbRatings[index].rating]++;
                    }
                }
                // add any rating occurrence to the array
                for (let index in traktRatings) {
                    if (traktRatings[index].rating !== null) {
                        traktRatingDistribution[traktRatings[index].userRating]++;
                    }
                }

                let distributionOfRatings = [];
                distributionOfRatings.push(imdbRatingDistribution);
                distributionOfRatings.push(traktRatingDistribution);

                // resolve (return) the array with both distributions
                resolve(distributionOfRatings);
            });
        });
    };


    /*getRatingDistribution('tvshow', 0).then(function (distribution) {
        "use strict";
        console.log('yay distribution')
    });*/

    let saveAverageImdbRating = function(limit){
        db.sequelize.models.season.findAll({limit: limit}).then(function(seasons){
            for (let index in seasons){
                db.sequelize.models.episode.findAll({where: {seasonId: seasons[index].id}}).then(function (episodes){
                    let seasonRatingSum = 0;

                    for (let i in episodes){
                        seasonRatingSum += episodes[i].imdbRating;
                    }
                    let averageSeasonRating = seasonRatingSum / episodes.length;
                    seasons[index].update({
                        average_rating: averageSeasonRating
                    });
                })
            }
        });
    };


    // calculates and saves the RATING DISTRIBUTION for show, season and episodes
    // calculates and saves total amount of episodes, seasons, ratings for all levels.
    let saveImdbRatingDistribution = function(limit){
        db.sequelize.models.tvShow.findAll({
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
        }).then(dbShows => {
           for (let index in dbShows){
               let episodesCount = 0;
               let imdbUserReviewsCount = 0;
               let seasonImdbUserReviewsCount = 0;
               let imdbUserReviewRatings = {};
               let imdbUserReviewRatingsSeason = {};
               let imdbUserReviewRatingsEpisode = {};
               let seasonEpisodesCount = 0;

               _.range(1, 11).forEach(x => imdbUserReviewRatings[x] = 0);
               dbShows[index].seasons.forEach(season => {
                   seasonEpisodesCount = 0;
                   seasonImdbUserReviewsCount = 0;
                   imdbUserReviewRatingsSeason = {};
                   _.range(1, 11).forEach(x => imdbUserReviewRatingsSeason[x] = 0);
                   season.episodes.forEach(episode => {
                       imdbUserReviewRatingsEpisode = {};
                       _.range(1, 11).forEach(x => imdbUserReviewRatingsEpisode[x] = 0);
                       episodesCount += 1;
                       seasonEpisodesCount += 1;
                       imdbUserReviewsCount += episode.imdbUserReviews.length;
                       seasonImdbUserReviewsCount += episode.imdbUserReviews.length;
                       episode.imdbUserReviews.forEach(imdbUserReview => {
                           if (imdbUserReview !== null && imdbUserReview.rating !== null)
                               imdbUserReviewRatingsEpisode[imdbUserReview.rating] += 1;
                               imdbUserReviewRatingsSeason[imdbUserReview.rating] += 1;
                               imdbUserReviewRatings[imdbUserReview.rating] += 1;
                       });
                       db.sequelize.models.ratingDistribution.create({
                           star1: imdbUserReviewRatingsEpisode[1],
                           star2: imdbUserReviewRatingsEpisode[2],
                           star3: imdbUserReviewRatingsEpisode[3],
                           star4: imdbUserReviewRatingsEpisode[4],
                           star5: imdbUserReviewRatingsEpisode[5],
                           star6: imdbUserReviewRatingsEpisode[6],
                           star7: imdbUserReviewRatingsEpisode[7],
                           star8: imdbUserReviewRatingsEpisode[8],
                           star9: imdbUserReviewRatingsEpisode[9],
                           star10: imdbUserReviewRatingsEpisode[10],
                       }).then(function(episodeRatingDistribution){
                           episode.setRatingDistribution(episodeRatingDistribution);
                           episode.update({
                               imdb_review_count: episode.imdbUserReviews.length
                           })
                       });
                   });
                   db.sequelize.models.ratingDistribution.create({
                       star1: imdbUserReviewRatingsSeason[1],
                       star2: imdbUserReviewRatingsSeason[2],
                       star3: imdbUserReviewRatingsSeason[3],
                       star4: imdbUserReviewRatingsSeason[4],
                       star5: imdbUserReviewRatingsSeason[5],
                       star6: imdbUserReviewRatingsSeason[6],
                       star7: imdbUserReviewRatingsSeason[7],
                       star8: imdbUserReviewRatingsSeason[8],
                       star9: imdbUserReviewRatingsSeason[9],
                       star10: imdbUserReviewRatingsSeason[10],
                   }).then(function(seasonRatingDistribution){
                       season.setRatingDistribution(seasonRatingDistribution);
                       season.update({
                           imdb_review_count: seasonImdbUserReviewsCount,
                           totalepisodes: seasonEpisodesCount
                       })
                   });
               });
               db.sequelize.models.ratingDistribution.create({
                   star1: imdbUserReviewRatings[1],
                   star2: imdbUserReviewRatings[2],
                   star3: imdbUserReviewRatings[3],
                   star4: imdbUserReviewRatings[4],
                   star5: imdbUserReviewRatings[5],
                   star6: imdbUserReviewRatings[6],
                   star7: imdbUserReviewRatings[7],
                   star8: imdbUserReviewRatings[8],
                   star9: imdbUserReviewRatings[9],
                   star10: imdbUserReviewRatings[10],
               }).then(function(ratingDistribution){
                   dbShows[index].setRatingDistribution(ratingDistribution);
                   dbShows[index].update({
                       imdb_review_count: imdbUserReviewsCount,
                       totalepisodes: episodesCount
                   })
               });
           }

        });
    };

    //saveAverageImdbRating(100);

    saveImdbRatingDistribution(100);


});