let credentials = require('../config/config.json').credentials.trakt;

let request = require('request');
let fs = require('fs');

let episodesArray;

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
        fs.writeFileSync('./data/trakt/' + showName + '-' + seasonNr + '-' + episodeNr + '.json', res.body);
        let nextEpisode = getNextEpisode(showName, seasonNr, episodeNr);
        if (nextEpisode) {
            setTimeout(() => {
                fetchTraktEpisodeComments(showName, nextEpisode.season, nextEpisode.episode);
            }, 500);
        }
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
        if (!nextEpisode) {
            trakt('https://api.trakt.tv/shows/' + showName + '/seasons/' + seasonNr + '/comments/newest?limit=1000').then(simpleSuccessHandler(showName, 'season-' + seasonNr)).catch(errorHandler);
        }
    }
    if (!nextEpisode) return null;
    return { season: nextEpisode.season, episode: nextEpisode.number };
};

fetchShow('the-big-bang-theory');
//fetchShow('13-reasons-why');
//fetchShow('game-of-thrones');
