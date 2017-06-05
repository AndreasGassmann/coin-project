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


    //subredditName = 'gameofthrones';

    var i = 0;
    emotional.load(() => {
        db.sequelize.query("SELECT * FROM RedditComments where subreddit <> 'gameofthrones' and subreddit <> 'bigbangtheory' and content_sentimentObject is null", { type: db.sequelize.QueryTypes.SELECT })
            .then(RedditComments => {
                RedditComments.forEach(RedditComments => {

                    var tfidf_temp_content = new TfIdf();
                    tfidf_temp_content.addDocument(RedditComments.content);
                    var content_sentimentObject = sentiment(RedditComments.content);
                    var content_emotionalObject = emotional.get(RedditComments.content);
                    var content_termFrequencyObject = tfidf_temp_content;
                    //console.log(content_sentimentObject);
                    //console.log(content_emotionalObject);
                    //console.log(content_termFrequencyObject);

                    var setValues = "";
                    setValues += "content_sentimentObject = '" + JSON.stringify(content_sentimentObject).replace(/'/g, "''") + "', ";
                    setValues += "content_emotionalObject = '" + JSON.stringify(content_emotionalObject).replace(/'/g, "''") + "', ";
                    setValues += "content_termFrequencyObject = '" + JSON.stringify(content_termFrequencyObject).replace(/'/g, "''") + "'";
                    var updateQuery = "UPDATE RedditComments SET " + setValues + " WHERE commentID = '" + RedditComments.commentID + "' AND subreddit = '" + RedditComments.subreddit + "'";
                    //console.log(updateQuery);

                    console.log(i);
                    i++;
                    db.sequelize.query(updateQuery);
                });
            });
    });
});
