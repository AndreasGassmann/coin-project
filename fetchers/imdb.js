let imdb = require('imdb-api');
let scraperjs = require('scraperjs');

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
 * @param {int[]} includeSeasons - The numbers of all seasons that this function should return
 * @param {int[]} includeEpisodes - The numbers of all episodes (of a season) that this function should return
 * @returns {Object[]} Filtered array of episodes as JSON objects
 */
let filterEpisodes = (episodes, includeSeasons, includeEpisodes) => {
    var filteredEpisodes = new Array();
    episodes.forEach(function (episode) {
        var cond = includeSeasons.indexOf(episode.season) != -1;
        cond &= includeEpisodes.indexOf(episode.episode) != -1;
        if (cond) {
            filteredEpisodes.push(episode)
        }
    }, this);
    return filteredEpisodes;
};

/**
 * Iterates over all user reviews of one TV show episode
 * @param {Object} episode - The episode as JSON object
 * @returns {Promise<string>} A promise to the user reviews as raw text string
 */
let fetchUserReviews = (episode) => {
    return new Promise((resolve, reject) => {
        var imdburl = 'http://www.imdb.com/title/' + episode.imdbid + '/reviews' + "?filter=chrono&start=";
        var start = 0;
        var content = "";
        function next() {
            scraperjs.StaticScraper.create(imdburl + start)
                .scrape($ => {
                    return $('div#tn15content').find('div').map(function () {
                        return $(this).text();
                    }).get();
                })
                .then(result => {
                    content += result;
                    if (result.length > 0) {
                        start = start + 10;
                        next();
                    }
                    else {
                        resolve(content);
                    }
                });
        };
        next();
    });
};

/**
 * The main procedure
 */
(_ => {
    var seasonsFilter = [5];
    var episodesFilter = [1];
    var tvshow;
    fetchTvShow('Game of Thrones')
        .then(result => { // tv show
            return new Promise((resolve, reject) => {
                tvshow = result;
                tvshow.episodes().then(resolve);
            });
        })
        .then(result => { // episodes
            return new Promise((resolve, reject) => {
                var reviewsRaw;
                tvshow._episodes = filterEpisodes(tvshow._episodes, seasonsFilter, episodesFilter);
                fetchUserReviews(tvshow._episodes[0]).then(resolve);
            });
        })
        .then(result => { // user reviews
            var regex = new RegExp(/([0-9]*) out of ([0-9]*) people.*useful:\n\n(.*)\n\nAuthor:\n(.*) from (.*)\n(.*)/g);
            reviewsRaw = result.split("Was the above review useful to you?");
            //console.log(reviewsRaw); // TODO this works
            for (var i = 0, len = reviewsRaw.length; i < len; i++) {
                var reviewRaw = reviewsRaw[i];
                reviewRaw = reviewRaw.trim();
                //console.log(reviewRaw); // TODO this works
                if (reviewRaw.length > 0) {
                    var regexResult = regex.exec(reviewRaw); // TODO this does NOT work (some returns are null)
                    console.log(regexResult); // TODO this does NOT work (null values)
                }
            }
        });
})();

/*


                    .then(result => {
                        //console.log(result);
                        reviewsRaw = result.split("Was the above review useful to you?");
                        //console.log(reviewsRaw);
                        var reviews = new Array();
                        var counter = 0;
                        var matches = new Array();
                        reviewsRaw.forEach((element) => {
                            element = element.trim();
                            //console.log(element);
                            //console.log("____START____");
                            //onsole.log(element);
                            //console.log("____END____");
                            if (element.length > 0) {
                                //console.log(element);
                                //console.log("____START____");
                                //console.log(counter++);
                                var review = new Object();
                                //console.log(element);
                                var regex = new RegExp(/([0-9]*) out of ([0-9]*) people.*useful:\n\n(.*)\n\nAuthor:\n(.*) from (.*)\n(.*)/g);
                                matches.push(regex.exec(element));
                            }
                        }, this);

                        //console.log(matches);

                        matches.forEach(function (element) {
                            console.log(element); // TODO this works!
                            console.log(element[3]); // TODO this does not work!
                            if (false) {
                                review.votes_helpful_yes = match[1];
                                review.votes_helpful_total = match[2];
                                review.title = match[3];
                                review.author_name = match[4];
                                review.author_from = match[5];
                                review.date = match[6];
                                reviews.push(review);
                            }
                        }, this);
                    });

            });
        });
})();


*/