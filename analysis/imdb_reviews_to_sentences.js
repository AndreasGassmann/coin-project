let sentiment = require('sentiment');
let emotional = require('emotional');
let natural = require('natural');
let imdb = require('imdb-api');
let scraperjs = require('scraperjs');
let _ = require('lodash');
let fs = require('fs');
let pad = require('pad');
let Sequelize = require('sequelize');
let dbjs = require('../db.js');
//let async = require('async');

let TfIdf = natural.TfIdf,
    tfidf = new TfIdf();

var db;

var globalCounter = 0; // for debugging

dbjs.init().then(res => {
    db = res;

    var lastProcessedEpisodeId = 0;

    db.sequelize.models.imdbUserReview.findAll({ where: { id: { $gt: lastProcessedEpisodeId } } })
        .then(dbUserReviews => {
            var promises = [];
            dbUserReviews.forEach(dbUserReview => {
                console.log(dbUserReview.id);

                // TODO also add title of user review?
                sentences = dbUserReview.text.split('.');

                sentences.forEach(sentence => {
                    sentence = sentence.trim();
                    if (sentence.length > 4)
                        promises.push(db.sequelize.models.sentence.create({ content: sentence, imdbUserReviewId: dbUserReview.id }));
                });
            });
            console.log("please wait ...");
            Promise.all(promises).then(r => {
                console.log("done")
            });
        });

});
