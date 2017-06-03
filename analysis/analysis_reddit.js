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


    emotional.load(() => {
        db.sequelize.query("SELECT * FROM RedditPosts where subreddit <> 'gameofthrones'", { type: db.sequelize.QueryTypes.SELECT })
            .then(RedditPosts => {
                RedditPosts.forEach(RedditPosts => {
                    //console.log(dbUserReview);
                    var tfidf_temp_title = new TfIdf();
                    tfidf_temp_title.addDocument(RedditPosts.title);
                    var title_sentimentObject = sentiment(RedditPosts.title);
                    var title_emotionalObject = emotional.get(RedditPosts.title);
                    var title_termFrequencyObject = tfidf_temp_title;
                    //console.log(title_sentimentObject);
                    //console.log(title_emotionalObject);
                    //console.log(title_termFrequencyObject);

                    var tfidf_temp_content = new TfIdf();
                    tfidf_temp_content.addDocument(RedditPosts.content);
                    var content_sentimentObject = sentiment(RedditPosts.content);
                    var content_emotionalObject = emotional.get(RedditPosts.content);
                    var content_termFrequencyObject = tfidf_temp_content;
                    //console.log(content_sentimentObject);
                    //console.log(content_emotionalObject);
                    //console.log(content_termFrequencyObject);

                    var setValues = "";
                    setValues += "title_sentimentObject = '" + JSON.stringify(title_sentimentObject).replace(/'/g, "''") + "', ";
                    setValues += "title_emotionalObject = '" + JSON.stringify(title_emotionalObject).replace(/'/g, "''") + "', ";
                    setValues += "title_termFrequencyObject = '" + JSON.stringify(title_termFrequencyObject).replace(/'/g, "''") + "', ";
                    setValues += "content_sentimentObject = '" + JSON.stringify(content_sentimentObject).replace(/'/g, "''") + "', ";
                    setValues += "content_emotionalObject = '" + JSON.stringify(content_emotionalObject).replace(/'/g, "''") + "', ";
                    setValues += "content_termFrequencyObject = '" + JSON.stringify(content_termFrequencyObject).replace(/'/g, "''") + "'";
                    var updateQuery = "UPDATE RedditPosts SET " + setValues + " WHERE pID = '" + RedditPosts.pID + "' AND subreddit = '" + RedditPosts.subreddit + "'";
                    //console.log(updateQuery);
                    var i = 0;
                    console.log(i);
                    i++;
                    db.sequelize.query(updateQuery);
                });
            });
    });
});
