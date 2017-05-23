let imdb = require('imdb-api');
let scraperjs = require('scraperjs');
let _ = require('lodash');
let fs = require('fs');
let pad = require('pad');
let Sequelize = require('sequelize');
let dbjs = require('../db.js');
//let async = require('async');

var db;

var globalCounter = 0; // for debugging

// TV Shows array
var tvshows = [];

// Game of Thrones
var got = {};
got.tvshowName = 'Game of Thrones';
got.fetchTvShowReviews = true;
got.seasons = (() => _.range(1, 7).map((element) => {
    return {
        season: element,
        episodes: _.range(1, 11)
    }
}))();

// The Big Bang Theory
// TODO episode 0
var bbt = {};
bbt.tvshowName = 'The Big Bang Theory';
bbt.fetchTvShowReviews = true;
bbt.seasons = (() => _.range(1, 10).map((element) => {
    return {
        season: element,
        episodes: (() => {
            if (element == 1)
                return _.range(1, 18);
            else if (element == 2 | element == 3)
                return _.range(1, 24);
            else
                return _.range(1, 25);
        })()
    }
}))();

// Criminal Minds
var crms = {};
crms.tvshowName = 'Criminal Minds';
crms.fetchTvShowReviews = true;
crms.seasons = (() => _.range(1, 12).map((element) => {
    return {
        season: element,
        episodes: (() => {
            if ([2, 5, 10].indexOf(element) != -1)
                return _.range(1, 24);
            else if (element == 3)
                return _.range(1, 21);
            else if (element == 4)
                return _.range(1, 26);
            else if (_.range(6, 10).indexOf(element) != -1)
                return _.range(1, 25);
            else if ([1, 11, 12].indexOf(element) != -1)
                return _.range(1, 23);
            else
                return null; // should never happen
        })()
    }
}))();

// Add TVShows to tvshows array to iterate over them
//tvshows.push(got);
//tvshows.push(bbt);
tvshows.push(crms);


let saveTvShowToDB = (jsonTvShow) => {
    return new Promise((resolve, reject) => {
        //console.log(jsonTvShow);
        db.sequelize.models.tvShow.find({ where: { title: jsonTvShow.title } })
            .then(dbTvShow => {
                //console.log(dbTvShow);
                //console.log(jsonTvShow);
                //console.log(jsonEpisode);
                if (dbTvShow == null) {
                    db.sequelize.models.tvShow.create({
                        title: jsonTvShow.title,
                        year: jsonTvShow.year,
                        rated: jsonTvShow.rated,
                        releaseDate: jsonTvShow.released.substring(0, 10),
                        runtime: parseInt(jsonTvShow.runtime.replace(' min', '')),
                        genres: jsonTvShow.genres,
                        director: jsonTvShow.director,
                        writer: jsonTvShow.writer,
                        actors: jsonTvShow.actors,
                        plot: jsonTvShow.plot,
                        languages: jsonTvShow.languages,
                        country: jsonTvShow.country,
                        awards: jsonTvShow.awards,
                        poster: jsonTvShow.poster,
                        metascore: jsonTvShow.metascore == 'N/A' ? null : jsonTvShow.metascore,
                        rating: jsonTvShow.rating, // TODO fix: number rounded to integer
                        votes: parseInt(jsonTvShow.votes.replace(',', '')),
                        imdbid: jsonTvShow.imdbid,
                        totalseasons: jsonTvShow.totalseasons,
                        imdburl: jsonTvShow.imdburl,
                        startYear: jsonTvShow.start_year,
                        endYear: jsonTvShow.end_year
                    }).then(resolve);
                }
                else {
                    resolve(dbTvShow);
                }
            });
    });
};


let saveSeasonToDB = (jsonTvShow, dbTvShow) => {
    return new Promise((resolve, reject) => {
        var jsonEpisode = jsonTvShow._episodes[0];
        //console.log(jsonTvShow);
        //console.log(dbTvShow);
        db.sequelize.models.season.findOne({ where: { tvShowId: dbTvShow.id, seasonNumber: jsonEpisode.season } })
            .then(dbSeason => {
                //console.log(jsonTvShow);
                //console.log(dbTvShow);
                if (dbSeason == null) {
                    db.sequelize.models.season.create({
                        seasonNumber: jsonEpisode.season,
                        tvShowId: dbTvShow.id
                    }).then(resolve);
                }
                else {
                    resolve(dbSeason);
                }
            });
    });
};



let saveEpisodeToDB = (jsonTvShow, dbSeason) => {
    return new Promise((resolve, reject) => {
        var jsonEpisode = jsonTvShow._episodes[0];
        if (jsonEpisode.rating == 'N/A') {
            jsonEpisode.rating = null;
        }
        //console.log(jsonTvShow);
        //console.log(dbSeason);
        db.sequelize.models.episode.findOne({ where: { seasonId: dbSeason.id, episodeNumber: jsonEpisode.episode } })
            .then(dbEpisode => {
                //console.log(jsonTvShow);
                if (dbEpisode == null) {
                    db.sequelize.models.episode.create({
                        name: jsonEpisode.name,
                        releaseDate: jsonEpisode.released,
                        imdbId: jsonEpisode.imdbid,
                        imdbRating: jsonEpisode.rating,
                        episodeNumber: jsonEpisode.episode,
                        seasonId: dbSeason.id
                    }).then(resolve);
                }
                else {
                    resolve(dbEpisode);
                }
            });
    });
};


let saveUserReviewsToDB = (jsonTvShow, dbEpisode) => {
    return new Promise((resolve, reject) => {
        var jsonEpisode = jsonTvShow._episodes[0];
        var jsonUserReviews = jsonEpisode.reviews;
        var currentDbUserReview = null;
        //console.log(jsonTvShow);
        //console.log(dbEpisode);

        var i = 0;
        let helper = (i) => {
            return new Promise((resolve, reject) => {
                if (i < jsonUserReviews.length) {
                    var jsonUserReview = jsonUserReviews[i];
                    if (jsonUserReview != undefined) {
                        //console.log(jsonUserReview);
                        db.sequelize.models.imdbUserReview.findOne({ where: { episodeId: dbEpisode.id, date: jsonUserReview.date, title: jsonUserReview.title } })
                            .then(dbUserReview => {
                                //console.log(i);
                                //console.log(dbEpisode.id);
                                //console.log(jsonUserReview);
                                //console.log(dbUserReview);
                                if (dbUserReview == null) {
                                    db.sequelize.models.imdbUserReview.create({
                                        isSpoiler: jsonUserReview.isSpoiler,
                                        date: jsonUserReview.date,
                                        authorName: jsonUserReview.authorName,
                                        authorFrom: jsonUserReview.authorFrom,
                                        title: jsonUserReview.title,
                                        text: jsonUserReview.text,
                                        rating: jsonUserReview.rating,
                                        helpfulYes: jsonUserReview.helpfulYes,
                                        helpfulTotal: jsonUserReview.helpfulTotal,
                                        episodeId: dbEpisode.id
                                    }).then(resolve);
                                }
                                else {
                                    currentDbUserReview = dbUserReview;
                                    resolve(dbUserReview);
                                }
                            });
                    }
                }
                else {
                    resolve(currentDbUserReview);
                }
            }).then(dbUserReview => {
                i++;
                if (i < jsonUserReviews.length) {
                    helper(i);
                }
                else {
                    console.log('       > ' + i + ' reviews');
                    resolve(dbUserReview)
                }
            });
        };
        helper(0);
    });
};


let storeEpisodeUserReviewsInDB = (jsonTvShow) => {
    return new Promise((resolve, reject) => {
        var jsonEpisode = jsonTvShow._episodes[0];
        console.log(pad(4, ++globalCounter, '0') + ' - ' + jsonTvShow.title + '_S' + pad(2, jsonEpisode.season, '0') + '_E' + pad(2, jsonEpisode.episode, '0') + ' \'' + jsonEpisode.name + '\'');
        saveTvShowToDB(jsonTvShow)
            .then((dbTvShow) => {
                saveSeasonToDB(jsonTvShow, dbTvShow)
                    .then((dbSeason => {
                        saveEpisodeToDB(jsonTvShow, dbSeason)
                            .then(dbEpisode => {
                                saveUserReviewsToDB(jsonTvShow, dbEpisode)
                                    .then(lastDbUserReview => {
                                        //console.log(lastDbUserReview);
                                        //console.log(dbEpisode);
                                        resolve(dbEpisode);
                                    });
                            });
                    }));;
            });
    });
};




dbjs.init().then((res) => {
    return new Promise((resolve, reject) => {
        db = res;
        // Database
        console.log('db synced');

        let helper = (i_tvshow, i_season, i_episode) => {
            return new Promise((resolve, reject) => {
                if (i_episode < tvshows[i_tvshow].seasons[i_season].episodes.length) {
                    var tvshow = tvshows[i_tvshow];
                    var season = tvshow.seasons[i_season];
                    var episode = season.episodes[i_episode];
                    //console.log(tvshow);
                    //console.log(season);
                    //console.log(episode);
                    var filePath = __dirname + '/../data/imdb/' + tvshow.tvshowName + '_S' + pad(2, season.season, '0') + '_E' + pad(2, episode, '0') + '.json';
                    var jsonTvShow = require(filePath);
                    var jsonEpisode = jsonTvShow._episodes[0];
                    storeEpisodeUserReviewsInDB(jsonTvShow).then(res => {
                        //console.log(tvshow.tvshowName);
                        resolve(res);
                    });
                }
                else {
                    resolve(episode);
                }

            }).then(lastEpisode => {
                i_episode++;
                if (i_episode < tvshows[i_tvshow].seasons[i_season].episodes.length) {
                    helper(i_tvshow, i_season, i_episode);
                }
                else {
                    i_episode = 0;
                    i_season++;
                    if (i_season < tvshows[i_tvshow].seasons.length) {
                        helper(i_tvshow, i_season, i_episode);
                    }
                    else {
                        i_season = 0;
                        i_tvshow++;
                        if (i_tvshow < tvshows.length) {
                            helper(i_tvshow, i_season, i_episode);
                        }
                        else {
                            //i_tvshow = 0;
                            resolve(lastEpisode);
                        }
                    }
                }
            });
        };
        helper(0, 0, 0);
    }).then(lastEpisode => {
        //console.log(lastEpisode);
        console.log("done");
    });
});
