module.exports.init = () => {
    return new Promise((resolve, reject) => {

        let Sequelize = require('sequelize');

        let dbConfig = require('./config/config.json').credentials.db;

        let config = {};
        config.dialect = dbConfig.dialect;
        config.host = dbConfig.host;
        config.port = dbConfig.port;

        let sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

        let db = {};

        db.sequelize = sequelize;

        let tvShow = sequelize.define('tvShow', {
            title: Sequelize.STRING,
            year: Sequelize.INTEGER,
            rated: Sequelize.STRING,
            releaseDate: Sequelize.DATEONLY,
            runtime: Sequelize.INTEGER,
            genres: Sequelize.STRING,
            director: Sequelize.STRING,
            writer: Sequelize.STRING,
            actors: Sequelize.STRING,
            plot: Sequelize.TEXT,
            languages: Sequelize.STRING,
            country: Sequelize.STRING,
            awards: Sequelize.STRING,
            poster: Sequelize.STRING,
            metascore: Sequelize.INTEGER,
            rating: Sequelize.DECIMAL,
            votes: Sequelize.INTEGER,
            imdbid: Sequelize.STRING,
            totalseasons: Sequelize.INTEGER,
            totalepisodes: Sequelize.INTEGER,
            imdburl: Sequelize.STRING,
            startYear: Sequelize.INTEGER,
            endYear: Sequelize.INTEGER,
            imdb_review_count: Sequelize.INTEGER,
            redditPost_count: Sequelize.INTEGER,
            redditComment_count: Sequelize.INTEGER
        });

        let season = sequelize.define('season', {
            seasonNumber: Sequelize.INTEGER,
            average_imdb_rating: Sequelize.FLOAT,
            totalepisodes: Sequelize.INTEGER,
            imdb_review_count: Sequelize.INTEGER,
            redditPost_count: Sequelize.INTEGER,
            redditComment_count: Sequelize.INTEGER
        });
        season.belongsTo(tvShow);

        tvShow.hasMany(season);

        let episode = sequelize.define('episode', {
            name: Sequelize.STRING,
            tvShowId: Sequelize.INTEGER,
            episodeNumber: Sequelize.INTEGER,
            releaseDate: Sequelize.DATE,
            imdbId: Sequelize.STRING,
            imdbRating: Sequelize.DECIMAL,
            traktId: Sequelize.STRING,
            traktRating: Sequelize.DECIMAL,
            imdb_review_count: Sequelize.INTEGER,
            redditPost_count: Sequelize.INTEGER,
            redditComment_count: Sequelize.INTEGER
        });
        episode.belongsTo(season);

        let episodePlot = sequelize.define('episode_plot', {
            plot: Sequelize.TEXT
        });
		episodePlot.belongsTo(episode);

        season.hasMany(episode);

        let imdbUserReview = sequelize.define('imdbUserReview', {
            isSpoiler: Sequelize.BOOLEAN,
            date: Sequelize.DATEONLY,
            authorName: Sequelize.STRING,
            authorFrom: Sequelize.STRING,
            title: Sequelize.STRING,
            text: Sequelize.TEXT,
            rating: Sequelize.INTEGER,
            helpfulYes: Sequelize.INTEGER,
            helpfulTotal: Sequelize.INTEGER
        });
        imdbUserReview.belongsTo(tvShow);
        imdbUserReview.belongsTo(episode);

        let sentence = sequelize.define('sentence', {
            content: Sequelize.TEXT
        });
        sentence.belongsTo(imdbUserReview);
        imdbUserReview.hasMany(sentence);

        let traktComment = sequelize.define('traktComment', {
            title: Sequelize.STRING,
            isSpoiler: Sequelize.BOOLEAN,
            isReview: Sequelize.BOOLEAN,
            parentId: Sequelize.INTEGER,
            createdAt: Sequelize.DATE,
            replies: Sequelize.INTEGER,
            likes: Sequelize.INTEGER,
            userRating: Sequelize.INTEGER
        });
        traktComment.belongsTo(tvShow);
        traktComment.belongsTo(season);
        traktComment.belongsTo(episode);

        let RedditPosts = sequelize.define('RedditPosts', {
            id: {type: Sequelize.INTEGER, primaryKey: true},
            pID: Sequelize.STRING,
            subreddit: Sequelize.STRING,
            title: Sequelize.STRING,
            isSpoiler: Sequelize.BOOLEAN,
            content: Sequelize.STRING,
            linkFlairText: Sequelize.STRING,
            numOfComments: Sequelize.INTEGER,
            rankInTopPosts: Sequelize.INTEGER,
            score: Sequelize.INTEGER,
            over18: Sequelize.BOOLEAN,
            subredditType: Sequelize.STRING,
            numOfUpvotes: Sequelize.INTEGER,
            postedOnDate: Sequelize.DATE,
            url: Sequelize.STRING,
            title_sentimentObject: Sequelize.TEXT,
            title_emotionalObject: Sequelize.TEXT,
            title_termFrequencyObject: Sequelize.TEXT,
            content_SentimentObject: Sequelize.TEXT,
            content_emotionalObject: Sequelize.TEXT,
            content_termFrequencyObject: Sequelize.TEXT,
        });
        RedditPosts.belongsTo(tvShow);

        let RedditComments = sequelize.define('RedditComments', {
            id: {type: Sequelize.INTEGER, primaryKey: true},
            commentID: Sequelize.STRING,
            parentID: Sequelize.STRING,
            content: Sequelize.STRING,
            score: Sequelize.INTEGER,
            commentedOnDate: Sequelize.DATE,
            subreddit: Sequelize.STRING,
            content_SentimentObject: Sequelize.TEXT,
            content_emotionalObject: Sequelize.TEXT,
            content_termFrequencyObject: Sequelize.TEXT,
        });
        RedditComments.belongsTo(tvShow);
//        RedditComments.belongsTo(RedditPosts);


        let ratingDistribution = sequelize.define('ratingDistribution',{
            star1: Sequelize.INTEGER,
            star2: Sequelize.INTEGER,
            star3: Sequelize.INTEGER,
            star4: Sequelize.INTEGER,
            star5: Sequelize.INTEGER,
            star6: Sequelize.INTEGER,
            star7: Sequelize.INTEGER,
            star8: Sequelize.INTEGER,
            star9: Sequelize.INTEGER,
            star10: Sequelize.INTEGER,
        });
        season.belongsTo(ratingDistribution);
        episode.belongsTo(ratingDistribution);
        tvShow.belongsTo(ratingDistribution);

        let characters = sequelize.define('characters',{
            id: {type: Sequelize.INTEGER, primaryKey: true},
            name: Sequelize.STRING,
            imdb_numOfAppearances: Sequelize.INTEGER,
            imdb_sentimentScoreAvg: Sequelize.FLOAT,
            imdb_sentimentScoreTotal: Sequelize.INTEGER,
            imdb_sentimentComparativeAvg: Sequelize.FLOAT,
            imdb_emotionalitySubjectivityAvg: Sequelize.FLOAT,
            imdb_emotionalityPolarityAvg: Sequelize.FLOAT,
            reddit_numOfAppearances: Sequelize.INTEGER,
            reddit_sentimentScoreAvg: Sequelize.FLOAT,
            reddit_sentimentScoreTotal: Sequelize.INTEGER,
            reddit_sentimentComparativeAvg: Sequelize.FLOAT,
            reddit_emotionalitySubjectivityAvg: Sequelize.FLOAT,
            reddit_emotionalityPolarityAvg: Sequelize.FLOAT,
        });


        episode.hasMany(imdbUserReview);
        episode.hasMany(traktComment);
        tvShow.hasMany(RedditPosts);
        tvShow.hasMany(RedditComments);
//        episode.hasMany(RedditPosts);

        sequelize.sync({ force: false }).then(function () {
            resolve(db);
            //console.log('done');
            /*
            tvShow.create({
                title: 'Test Show',
                releaseYear: 2010
            }).then(show => {
                season.create({
                    seasonNumber: 1,
                    tvShowId: show.id
                }).then(s => {
                    episode.bulkCreate([{
                        episodeNumber: 1,
                        seasonId: s.id
                    }, {
                        episodeNumber: 2,
                        seasonId: s.id
                    }]).then(x => {
                episode.findOne().then(ep => {
                    ep.getSeason().then(se => {
                        //console.log(se);
                    });
                })
                        season.findOne().then(se => {
                            se.getEpisodes().then(a => {
                                //console.log(a);
                            })
                            //console.log(se);
                        });
                    })
                })
                //season.setTvShow(show);
            });
 
            tvShow.bulkCreate([, {
                title: 'Simpsons',
                releaseYear: 1995
            }]).then(res => {
        
                tvShow.findAll({
                    where: {
                        releaseYear: { gt: 2009 }
                    }
                }).then(show => {
                    show.forEach(s => {
                       console.log(s.dataValues);
                    });
                });
                sequelize.query("SELECT * FROM tvShows").then(show => {
                    show.forEach(s => {
                        console.log(s);
                    });
                })
            });*/
        });
    });
};
