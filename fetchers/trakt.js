let credentials = require('../config/config.json').credentials.trakt;

let request = require('request');
let fs = require('fs');

let dbjs = require('../db');
let db;

dbjs.init().then(res => {
    db = res;
    //fetchShow('game-of-thrones');
    //fetchShow('the-big-bang-theory');
    //fetchShow('criminal-minds');
    //fetchShow('13-reasons-why');
});

let episodesArray;

let showId = 2;

let trakt = function(url) {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'trakt-api-version': '2',
                'trakt-api-key': credentials.client_id
            }}, function (error, response, body) {
            resolve({ error, response, body });
        });
    });
};

let successHandler = function(showName, seasonNr, episodeNr) {
    return (res) => {
        console.log('successfully fetched ' + showName + '-' + seasonNr + '-' + episodeNr);
        //fs.writeFileSync('./data/trakt/' + showName + '-' + seasonNr + '-' + episodeNr + '.json', res.body);
        db.sequelize.models.season.findOne({
            where: {seasonNumber: seasonNr, tvShowId: showId},
            include: [{
                model: db.sequelize.models.episode,
                where: { episodeNumber: episodeNr },
                attributes: ['id', 'name', 'episodeNumber']
            }]
        }).then(season => {
            if (!season) {
                let nextEpisode = getNextEpisode(showName, seasonNr, episodeNr);
                if (nextEpisode) {
                    setTimeout(() => {
                        fetchTraktEpisodeComments(showName, nextEpisode.season, nextEpisode.episode);
                    }, 500);
                }
            }
            //console.log(res.body);
            let comments = [];
            JSON.parse(res.body).forEach(r => {
                comments.push({
                    comment: r.comment,
                    isSpoiler: r.spoiler,
                    isReview: r.review,
                    parentId: r.parent_id,
                    replies: r.replies,
                    likes: r.likes,
                    date: r.created_at,
                    userRating: r.user_rating,
                    episodeId: season.episodes[0].id,
                    seasonId: season.id,
                    tvShowId: showId,
                });
            });

            console.log(comments);

            /*
            db.sequelize.models.traktComment.bulkCreate(comments).then(dbResult => {
                console.log('created!');
                let nextEpisode = getNextEpisode(showName, seasonNr, episodeNr);
                if (nextEpisode) {
                    setTimeout(() => {
                        fetchTraktEpisodeComments(showName, nextEpisode.season, nextEpisode.episode);
                    }, 500);
                }
            });
            */
        });
    }
};

let simpleSuccessHandler = function(showName, name) {
    return (res) => {
        console.log('successfully fetched ' + showName + name);
        fs.writeFileSync('./data/trakt/' + showName + '-' + name + '.json', res.body);
    }
};

let errorHandler = (res) => {
    console.log('Raw:', res);
    console.log('Status:', res.response.statusCode);
    console.log('Headers:', JSON.stringify(res.response.headers));
    console.log('Response:', res.body);
};

let fetchShow = (showName) => {
    trakt('https://api.trakt.tv/shows/'+ showName +'/people/?limit=1000').then(simpleSuccessHandler(showName, 'people')).catch(errorHandler);
    trakt('https://api.trakt.tv/shows/'+ showName +'/comments/newest?limit=1000').then(simpleSuccessHandler(showName, 'show')).catch(errorHandler);
    trakt('https://api.trakt.tv/shows/'+ showName +'/seasons?extended=episodes').then(res => {
        let tempSeasonsWithEpisodes = JSON.parse(res.body);
        episodesArray = [].concat.apply([], tempSeasonsWithEpisodes.map(s => s.episodes));

        fetchTraktEpisodeComments(showName, 1, 1);
    }).catch(errorHandler);
};

let fetchTraktEpisodeComments = (showName, seasonNr, episodeNr) => {
    trakt('https://api.trakt.tv/shows/' + showName + '/seasons/' + seasonNr + '/episodes/' + episodeNr + '/comments/newest?limit=1000').then(successHandler(showName, seasonNr, episodeNr)).catch(errorHandler);
};

let getNextEpisode = (showName, seasonNr, episodeNr) => {
    let nextEpisode = episodesArray.find(e => {
        return e.season === seasonNr && e.number === episodeNr + 1;
    });

    if (!nextEpisode) {
        nextEpisode = episodesArray.find(e => {
            return e.season === seasonNr + 1 && e.number === 1;
        });
        if (nextEpisode) {
            trakt('https://api.trakt.tv/shows/' + showName + '/seasons/' + (seasonNr + 1) + '/comments/newest?limit=1000').then(simpleSuccessHandler(showName, 'season-' + seasonNr)).catch(errorHandler);
        }
    }
    if (!nextEpisode) return null;
    return { season: nextEpisode.season, episode: nextEpisode.number };
};

