let sentiment = require('sentiment');
let emotional = require('emotional');
let natural = require('natural');
let imdb = require('imdb-api');
let scraperjs = require('scraperjs');
let _ = require('lodash');
let fs = require('fs');
let pad = require('pad');
let Sequelize = require('sequelize');
let dbjs = require('./db.js');
//let async = require('async');

let TfIdf = natural.TfIdf,
    tfidf = new TfIdf();

var db;

var globalCounter = 0; // for debugging

// TV Shows array
var tvshows = [];

// Game of Thrones
var got = {};
got.tvshowName = 'Game of Thrones';
got.fetchTvShowReviews = true;
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
bbt.fetchTvShowReviews = true;
bbt.seasons = (() => _.range(1, 10).map((element) => {
    return {
        season: element,
        episodes: (() => {
            if (element == 1)
                return _.range(1, 18);
            else if (element == 2 | element == 3)
                return _.range(1, 24);
            else
                return _.range(1, 25);
        })()
    }
}))();

//tvshows.push(got);
tvshows.push(bbt);

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


    lastProcessedEpisodeId = 267;


    emotional.load(() => {
        db.sequelize.models.imdbUserReview.findAll({ where: {episodeId: {$gt: lastProcessedEpisodeId}}})
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

/*
    emotional.load(() => {
        jsonUserReviews.forEach(jsonUserReview => {

            //console.log(jsonUserReview.text);
            //console.log('User rating: ' + jsonUserReview.rating);

            // Term frequency
            tfidf.addDocument(jsonUserReview.text);

            //console.dir(emotional.get(jsonUserReview.text).polarity, { depth: null });
            //console.dir(emotional.get(jsonUserReview.text).subjectivity, { depth: null });

            console.log(jsonUserReview.rating + ';' + sentiment(jsonUserReview.text).comparative + ';' + sentiment(jsonUserReview.text).score);





            // Words in comments
            // let commentNumber = 1;
            // tfidf.listTerms(commentNumber).forEach(function(item) {
            //     console.log(item.term + ': ' + item.tfidf);
            // });

            // Importance of word in each comment
            // let word = 'like';
            // tfidf.tfidfs(word, function(i, measure) {
            //     console.log('document #' + i + ' is ' + measure);
            // });
        });
    });
});*/






