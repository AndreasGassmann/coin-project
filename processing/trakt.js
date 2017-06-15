/*let dbjs = require('../db');
let db;

dbjs.init().then(db => {
    console.log('db initialized');/*
    db.sequelize.models.traktComment.findAll().then(comments => {
        //console.log(comments);
        comments.forEach(e => {
            //console.log(e.dataValues);
        });
    }).catch(console.log);
*//*
    db.sequelize.models.tvShow.findAll().then(shows => {
        console.log(shows);
    })
}).catch(console.log);
*/

let sentiment = require('sentiment');
let emotional = require('emotional');
let natural = require('natural');
const db = require('../db.js');
let _ = require('lodash');

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
                where: { id: showId }
            }));

            // when all ratings where fetched (promises resolved), then fill the arrays.
            Promise.all(promises).then(function (data) {
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
/*
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
    };*/


    // calculates and saves the RATING DISTRIBUTION for show, season and episodes
    // calculates and saves total amount of episodes, seasons, ratings for all levels.
    let saveTraktRatingDistribution = function(limit){
        db.sequelize.models.tvShow.findAll({
            include: [{
                model: db.sequelize.models.season,
                attributes: ['id', 'seasonNumber'],
                include: [{
                    model: db.sequelize.models.episode,
                    attributes: ['id', 'name', 'episodeNumber'],
                    include: [{
                        model: db.sequelize.models.traktComment,
                        attributes: ['id', 'userRating']
                    }]
                }]
            }]
        }).then(dbShows => {
            console.log(dbShows);
            for (let index in dbShows){
                let episodesCount = 0;
                let traktCommentsCount = 0;
                let seasontraktCommentsCount = 0;
                let traktCommentRatings = {};
                let traktCommentRatingsSeason = {};
                let traktCommentRatingsEpisode = {};
                let seasonEpisodesCount = 0;

                _.range(1, 11).forEach(x => traktCommentRatings[x] = 0);
                dbShows[index].seasons.forEach(season => {
                    seasonEpisodesCount = 0;
                    seasontraktCommentsCount = 0;
                    traktCommentRatingsSeason = {};
                    _.range(1, 11).forEach(x => traktCommentRatingsSeason[x] = 0);
                    season.episodes.forEach(episode => {
                        traktCommentRatingsEpisode = {};
                        _.range(1, 11).forEach(x => traktCommentRatingsEpisode[x] = 0);
                        episodesCount += 1;
                        seasonEpisodesCount += 1;
                        traktCommentsCount += episode.traktComments.length;
                        seasontraktCommentsCount += episode.traktComments.length;
                        episode.traktComments.forEach(traktComment => {
                            if (traktComment !== null && traktComment.rating !== null)
                                traktCommentRatingsEpisode[traktComment.rating] += 1;
                            traktCommentRatingsSeason[traktComment.rating] += 1;
                            traktCommentRatings[traktComment.rating] += 1;
                        });

                        console.log(traktCommentRatingsEpisode);
                        /*
                        db.sequelize.models.traktRatingDistribution.create({
                            star1: traktCommentRatingsEpisode[1],
                            star2: traktCommentRatingsEpisode[2],
                            star3: traktCommentRatingsEpisode[3],
                            star4: traktCommentRatingsEpisode[4],
                            star5: traktCommentRatingsEpisode[5],
                            star6: traktCommentRatingsEpisode[6],
                            star7: traktCommentRatingsEpisode[7],
                            star8: traktCommentRatingsEpisode[8],
                            star9: traktCommentRatingsEpisode[9],
                            star10: traktCommentRatingsEpisode[10],
                        }).then(function(episodeRatingDistribution){
                            episode.setTraktRatingDistribution(episodeRatingDistribution);
                            episode.update({
                                trakt_review_count: episode.traktComments.length
                            })
                        });
                        */
                    });/*
                    db.sequelize.models.traktRatingDistribution.create({
                        star1: traktCommentRatingsSeason[1],
                        star2: traktCommentRatingsSeason[2],
                        star3: traktCommentRatingsSeason[3],
                        star4: traktCommentRatingsSeason[4],
                        star5: traktCommentRatingsSeason[5],
                        star6: traktCommentRatingsSeason[6],
                        star7: traktCommentRatingsSeason[7],
                        star8: traktCommentRatingsSeason[8],
                        star9: traktCommentRatingsSeason[9],
                        star10: traktCommentRatingsSeason[10],
                    }).then(function(seasonRatingDistribution){

                        season.setTraktRatingDistribution(seasonRatingDistribution);
                        season.update({
                            trakt_review_count: seasontraktCommentsCount,
                            totalepisodes: seasonEpisodesCount
                        })

                    });*/
                });/*
                db.sequelize.models.traktRatingDistribution.create({
                    star1: traktCommentRatings[1],
                    star2: traktCommentRatings[2],
                    star3: traktCommentRatings[3],
                    star4: traktCommentRatings[4],
                    star5: traktCommentRatings[5],
                    star6: traktCommentRatings[6],
                    star7: traktCommentRatings[7],
                    star8: traktCommentRatings[8],
                    star9: traktCommentRatings[9],
                    star10: traktCommentRatings[10],
                }).then(function(ratingDistribution){

                    dbShows[index].setTraktRatingDistribution(ratingDistribution);
                    dbShows[index].update({
                        trakt_review_count: traktCommentsCount,
                        totalepisodes: episodesCount
                    })

                });*/
            }

        });
    };

    //saveAverageImdbRating(100);

    saveTraktRatingDistribution(1000);


});