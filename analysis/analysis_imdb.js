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

    //if (db.sequelize.models.imdbUserReview.attributes.sentimentObject == undefined) {
    /*db.sequelize.queryInterface.addColumn(
        'imdbUserReviews',
        'sentimentObject',
        {
            type: Sequelize.TEXT,
            allowNull: true
        }
    );*/
    //}


    lastProcessedEpisodeId = 0;


    emotional.load(() => {
        db.sequelize.models.imdbUserReview.findAll({ where: { episodeId: { $gt: lastProcessedEpisodeId } } })
            .then(dbUserReviews => {
                dbUserReviews.forEach(dbUserReview => {
                    //console.log(dbUserReview);
                    var tfidf_temp_title = new TfIdf();
                    tfidf_temp_title.addDocument(dbUserReview.title);
                    var title_sentimentObject = sentiment(dbUserReview.title);
                    var title_emotionalObject = emotional.get(dbUserReview.title);
                    var title_termFrequencyObject = tfidf_temp_title;
                    //console.log(title_sentimentObject);
                    //console.log(title_emotionalObject);
                    //console.log(title_termFrequencyObject);

                    var tfidf_temp_text = new TfIdf();
                    tfidf_temp_text.addDocument(dbUserReview.text);
                    var text_sentimentObject = sentiment(dbUserReview.text);
                    var text_emotionalObject = emotional.get(dbUserReview.text);
                    var text_termFrequencyObject = tfidf_temp_text;
                    //console.log(text_sentimentObject);
                    //console.log(text_emotionalObject);
                    //console.log(text_termFrequencyObject);


                    //dbUserReview.sentimentObject = null;
                    var setValues = "";
                    setValues += "title_sentimentObject = '" + JSON.stringify(title_sentimentObject).replace(/'/g, "''") + "', ";
                    setValues += "title_emotionalObject = '" + JSON.stringify(title_emotionalObject).replace(/'/g, "''") + "', ";
                    setValues += "title_termFrequencyObject = '" + JSON.stringify(title_termFrequencyObject).replace(/'/g, "''") + "', ";
                    setValues += "text_sentimentObject = '" + JSON.stringify(text_sentimentObject).replace(/'/g, "''") + "', ";
                    setValues += "text_emotionalObject = '" + JSON.stringify(text_emotionalObject).replace(/'/g, "''") + "', ";
                    setValues += "text_termFrequencyObject = '" + JSON.stringify(text_termFrequencyObject).replace(/'/g, "''") + "'";
                    var updateQuery = "UPDATE imdbUserReviews SET " + setValues + " WHERE id = " + dbUserReview.id;
                    //console.log(updateQuery);
                    db.sequelize.query(updateQuery);
                });
            });
    });
});
