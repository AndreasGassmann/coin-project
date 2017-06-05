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

    lastProcessedImdbUserReviewId = 0;


    emotional.load(() => {
        db.sequelize.models.sentence.findAll({ where: {imdbUserReviewId: {$gt: lastProcessedImdbUserReviewId}}})
            .then(dbSentences => {
                dbSentences.forEach(dbSentence => {
                    console.log(globalCounter++);
                    //console.log(dbSentence);
                    var tfidf_temp = new TfIdf();
                    tfidf_temp.addDocument(dbSentence.content);
                    var sentimentObject = sentiment(dbSentence.content);
                    var emotionalObject = emotional.get(dbSentence.content);
                    var termFrequencyObject = tfidf_temp;
                    //console.log(sentimentObject);
                    //console.log(emotionalObject);
                    //console.log(termFrequencyObject);

                    //dbUserReview.sentimentObject = null;
                    var setValues = "";
                    setValues += "sentimentObject = '" + JSON.stringify(sentimentObject).replace(/'/g, "''") + "', ";
                    setValues += "emotionalObject = '" + JSON.stringify(emotionalObject).replace(/'/g, "''") + "', ";
                    setValues += "termFrequencyObject = '" + JSON.stringify(termFrequencyObject).replace(/'/g, "''") + "'";
                    var updateQuery = "UPDATE sentences SET " + setValues + " WHERE id = " + dbSentence.id;
                    //console.log(updateQuery);
                    db.sequelize.query(updateQuery);
                });
            });
    });
});
