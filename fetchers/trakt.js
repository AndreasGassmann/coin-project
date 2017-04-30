let credentials = require('../config/config.json').credentials.trakt;

let request = require('request');

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

let successHandler = (res) => {
    console.log('Status:', res.response.statusCode);
    console.log('Headers:', JSON.stringify(res.response.headers));
    console.log('Response:', res.body);
};

let errorHandler = (res) => {
    console.log('Status:', res.response.statusCode);
    console.log('Headers:', JSON.stringify(res.response.headers));
    console.log('Response:', res.body);
};

// trakt('https://api.trakt.tv/shows/game-of-thrones/ratings').then(successHandler).catch(errorHandler);

// trakt('https://api.trakt.tv/shows/game-of-thrones/stats').then(successHandler).catch(errorHandler);

// trakt('https://api.trakt.tv/shows/game-of-thrones/comments/newest?limit=1000').then(successHandler).catch(errorHandler);

// trakt('https://api.trakt.tv/shows/game-of-thrones/seasons?extended=episodes,full').then(successHandler).catch(errorHandler);
