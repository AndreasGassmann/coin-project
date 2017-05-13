let imdb = require('imdb-api');
let scraperjs = require('scraperjs');
let _ = require('lodash');
let fs = require('fs');
let pad = require('pad');
let Sequelize = require('sequelize');
let db = require('../db.js');

/**
 * Fetches a TV show from IMDb
 * @param {string} name - The name of the TV show
 * @returns {Promise<Object>} A promise to the TV show as JSON object
 */
let fetchTvShow = (name) => {
    return new Promise((resolve, reject) => {
        imdb.get(name).then(resolve);
    });
};

/**
 * Filters an array of TV show episodes for specific seasons
 * @param {Object[]} episodes - The episodes as JSON objects
 * @param {int[]} includeSeasons - The numbers of all seasons that this function should return (or null for all seasons)
 * @param {int[]} includeEpisodes - The numbers of all episodes (of a season) that this function should return (or null for all episodes)
 * @returns {Object[]} Filtered array of episodes as JSON objects
 */
let filterEpisodes = (episodes, includeSeasons, includeEpisodes) => {
    var filteredEpisodes = new Array();
    episodes.forEach(function (episode) {
        var cond = includeSeasons == null ? true : includeSeasons.indexOf(episode.season) != -1;
        cond &= includeEpisodes == null ? true : includeEpisodes.indexOf(episode.episode) != -1;
        if (cond) {
            filteredEpisodes.push(episode)
        }
    }, this);
    return filteredEpisodes;
};

/**
 * Iterates over all user reviews of one TV show episode
 * @param {Object} episode - The episode as JSON object
 * @returns {Promise<string>} A promise to the episode object containing user reviews as raw text string
 */
let fetchUserReviews = (episode) => {
    return new Promise((resolve, reject) => {
        var imdburl = 'http://www.imdb.com/title/' + episode.imdbid + '/reviews' + "?filter=chrono&start=";
        var start = 0;
        var content = "";
        let next = function () {
            scraperjs.StaticScraper.create(imdburl + start)
                .scrape($ => {
                    return $('div#tn15content').find('div,p').map(function () {
                        this.children.forEach(obj => { // TODO redo this in a cleaner way
                            if (obj.type == 'tag' & obj.name == 'img') {
                                obj.type = 'text';
                                obj.data = obj.attribs.alt;
                            }
                        });
                        return $(this).text();
                    }).get();
                })
                .then(result => {
                    content += result;
                    var cond = result.length > 0;
                    //console.log(result.toString());
                    cond &= (result.toString() !== "Add another review");
                    if (cond) {
                        start = start + 10;
                        next();
                    }
                    else {
                        episode.reviewsRaw = content;
                        resolve(episode);
                    }
                });
        };
        next();
    });
};


/**
 * Returns a function that can be used to extract textual information from a review text
 * using a regular expression (the first matching group will be the return string)
 * @param {RegExp} regex - The regular expression used to extract information out of a user review
 * @returns {Function} An extractor function that has the first matching group of the regular expression as return value
 */
let extractorsFactory = (regex) => {
    return (review) => {
        var matches = regex.exec(review);
        return matches ? matches[1] : null;
    };
};

/**
 * A set of functions for extracting information out of user reviews
 */
let extractors = {
    helpfulYes: (review) => {
        var result = parseInt(extractorsFactory(new RegExp(/([0-9]*) out of/g))(review));
        if (isNaN(result))
            return null;
        return result;
    },
    helpfulTotal: (review) => {
        var result = parseInt(extractorsFactory(new RegExp(/out of ([0-9]*)/g))(review));
        if (isNaN(result))
            return null;
        return result;
    },
    title: (review) => extractorsFactory(new RegExp(/\s*(.*)\n?(?:(?:(?:(?:[0-9])|(?:10))\/10))?\nAuthor/g))(review),
    rating: (review) => {
        var result = extractorsFactory(new RegExp(/\s*(?:.*)\n?(?:(?:(?:([0-9]|10)|(?:10))\/10))?\nAuthor/g))(review);
        if (result != null & result != undefined)
            return parseInt(result);
        return null;
    },
    authorName: (review) => extractorsFactory(new RegExp(/Author:\s*(.*?)(?:\n| from)/g))(review),
    authorFrom: (review) => extractorsFactory(new RegExp(/Author:\n.* from (.*)\n/g))(review),
    date: (review) => {
        let parseDateString = (input) => {
            if (input == null)
                return null;
            var months = { 'January': '01', 'February': '02', 'March': '03', 'April': '04', 'May': '05', 'June': '06', 'July': '07', 'August': '08', 'September': '09', 'October': '10', 'November': '11', 'December': '12' };
            var components = input.split(' '); // e.g., '3 September 2014'
            return components[2] + '-' + months[components[1]] + '-' + pad(2, components[0], '0'); // e.g., '2014-09-03'
        };
        return parseDateString(extractorsFactory(new RegExp(/Author:\n.*\n(.*)/g))(review));
    },
    isSpoiler: (review) => (extractorsFactory(new RegExp(/[0-9]{1,2} [A-z]+ [0-9]{4}\n\*(.*)\*/g))(review) != null),
    text: (review) => {
        var regex = new RegExp(/\*\*\* This review may contain spoilers \*\*\*/g);
        review = review.replace(regex, '');
        return extractorsFactory(new RegExp(/[0-9]{1,2} [A-z]+ [0-9]{4}\s*(?:,{1,2})\n((?:.|\s)*)/g))(review)
    }
};

/**
 * Performs data fetching
 */
let runFetcher = (tvshowName, seasonNo, episodeNo) => {
    return new Promise((resolve, reject) => {
        var seasonsFilter = [seasonNo];
        var episodesFilter = [episodeNo];
        var tvshow;
        fetchTvShow(tvshowName)
            .then(result => { // tv show
                return new Promise((resolve, reject) => {
                    tvshow = result;
                    tvshow.episodes().then(resolve);
                });
            })
            .then(result => { // episodes
                return new Promise((resolve, reject) => {
                    tvshow._episodes = filterEpisodes(tvshow._episodes, seasonsFilter, episodesFilter);
                    var promises = [];
                    tvshow._episodes.forEach(episode => {
                        promises.push(fetchUserReviews(episode));
                    });
                    Promise.all(promises).then(results => { // Episode[]
                        resolve(results);
                    });
                });
            })
            .then(episodes => { // episodes (now containing raw reviews content)
                episodes.forEach(episode => {
                    var reviewsRaw = episode.reviewsRaw.split("Was the above review useful to you?");
                    episode.reviewsRaw = null;
                    episode.reviews = [];
                    reviewsRaw.forEach(element => {
                        element = element.trim();
                        if (element.length > 0) {
                            var review = {};
                            Object.keys(extractors).forEach(ext => {
                                review[ext] = extractors[ext](element)
                            });
                            if (review.title != null)
                                episode.reviews.push(review);
                        }
                    });
                });
                var filePath = __dirname + '/../data/imdb/' + tvshow.title + '_S' + pad(2, seasonNo, '0') + '_E' + pad(2, episodeNo, '0') + '.json';
                fs.writeFile(filePath, JSON.stringify(tvshow, null, 2) + "\n", 'utf8', (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log("File created: " + filePath);
                });
                resolve(tvshow);
            }).catch(console.log);
    });
};

// TV Shows array
var tvshows = [];

// Game of Thrones
var got = {};
got.tvshowName = 'Game of Thrones';
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
bbt.seasons = (() => _.range(1, 10).map((element) => {
    return {
        season: element,
        episodes: (() => {
            if (element == 1)
                return _.range(1, 18);
            else if (element == 2)
                return _.range(1, 24);
            else
                return _.range(1, 25);
        })()
    }
}))();

// Criminal Minds
var crms = {};
crms.tvshowName = 'Criminal Minds';
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
tvshows.push(got);
//tvshows.push(bbt);
//tvshows.push(crms);

db.init().then((db) => {
    // Database
    console.log('db synced');
    // Iterate over all episodes of all seasons of all defined TvShows and run fetcher for each episode
    tvshows.forEach((tvshow) => {
        tvshow.seasons.forEach((season) => {
            season.episodes.forEach((episode) => {
                runFetcher(tvshow.tvshowName, season.season, episode).then(fetchedTvShow => {
                    var episode = fetchedTvShow._episodes[0];
                    db.sequelize.models.tvShow.findOne({ where: { title: fetchedTvShow.title } })
                        .then(dbTvShow => {
                            return new Promise((resolve, reject) => {
                                if (dbTvShow == null) {
                                    db.sequelize.models.tvShow.create({
                                        title: fetchedTvShow.title,
                                        year: fetchedTvShow.year,
                                        rated: fetchedTvShow.rated,
                                        releaseDate: fetchedTvShow.released,
                                        runtime: parseInt(fetchedTvShow.runtime.replace(' min', '')),
                                        genres: fetchedTvShow.genres,
                                        director: fetchedTvShow.director,
                                        writer: fetchedTvShow.writer,
                                        actors: fetchedTvShow.actors,
                                        plot: fetchedTvShow.plot,
                                        languages: fetchedTvShow.languages,
                                        country: fetchedTvShow.country,
                                        awards: fetchedTvShow.awards,
                                        poster: fetchedTvShow.poster,
                                        metascore: fetchedTvShow.metascore == 'N/A' ? null : fetchedTvShow.metascore,
                                        rating: fetchedTvShow.rating, // TODO fix: number rounded to integer
                                        votes: parseInt(fetchedTvShow.votes.replace(',', '')),
                                        imdbid: fetchedTvShow.imdbid,
                                        totalseasons: fetchedTvShow.totalseasons,
                                        imdburl: fetchedTvShow.imdburl,
                                        startYear: fetchedTvShow.start_year,
                                        endYear: fetchedTvShow.end_year
                                    }).then(resolve);
                                } else {
                                    resolve(dbTvShow);
                                }

                            }).then(dbTvShow => {
                                db.sequelize.models.season.findOne({ where: { tvShowId: dbTvShow.id, seasonNumber: season.season } })
                                    .then(dbSeason => {
                                        return new Promise((resolve, reject) => {
                                            if (dbSeason == null) {
                                                db.sequelize.models.season.create({
                                                    seasonNumber: season.season,
                                                    tvShowId: dbTvShow.id
                                                }).then(resolve);
                                            } else {
                                                resolve(dbSeason);
                                            }
                                        }).then(dbSeason => {



                                            //console.log(dbSeason);
                                            db.sequelize.models.episode.findOne({ where: { seasonId: dbSeason.id, episodeNumber: episode.episode } })
                                                .then(dbEpisode => {
                                                    return new Promise((resolve, reject) => {
                                                        if (dbEpisode == null) {
                                                            db.sequelize.models.episode.create({
                                                                name: episode.name,
                                                                releaseDate: episode.released,
                                                                imdbId: episode.imdbid,
                                                                imdbRating: episode.rating,
                                                                episodeNumber: episode.episode,
                                                                seasonId: dbSeason.id
                                                            }).then(resolve);
                                                        }
                                                        else {
                                                            resolve(dbEpisode);
                                                        }
                                                    }).then(dbEpisode => {

                                                        if (episode.reviews.length > 0) {
                                                            episode.reviews.forEach(review => {
                                                                db.sequelize.models.imdbUserReview.create({
                                                                    isSpoiler: review.isSpoiler,
                                                                    date: review.date,
                                                                    authorName: review.authorName,
                                                                    authorFrom: review.authorFrom,
                                                                    title: review.title,
                                                                    text: review.text,
                                                                    rating: review.rating,
                                                                    helpfulYes: review.helpfulYes,
                                                                    helpfulTotal: review.helpfulTotal,
                                                                    episodeId: dbEpisode.id
                                                                    //tvShowId: show[0].id
                                                                });

                                                            });
                                                        }



                                                    });
                                                }); // END then(dbEpisode ..)


                                        });






                                    }); // END then(dbSeason ..)
                            });









                        }); // END then(dbTvShow ..)


                });






            }); // END season.episodes.forEach
        }); // END tvshow.seasons.forEach


    }); // END tvshows.forEach
});

console.log("DONE");

// TODO also fetch user reviews from TVShow context (only episode-level so far)
