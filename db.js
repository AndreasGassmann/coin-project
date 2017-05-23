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
            imdburl: Sequelize.STRING,
            startYear: Sequelize.INTEGER,
            endYear: Sequelize.INTEGER
        });

        let season = sequelize.define('season', {
            seasonNumber: Sequelize.INTEGER
        });
        season.belongsTo(tvShow);

        tvShow.hasMany(season);

        let episode = sequelize.define('episode', {
            name: Sequelize.STRING,
            episodeNumber: Sequelize.INTEGER,
            releaseDate: Sequelize.DATE,
            imdbId: Sequelize.STRING,
            imdbRating: Sequelize.DECIMAL,
            traktId: Sequelize.STRING,
            traktRating: Sequelize.DECIMAL
        });
        episode.belongsTo(season);

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

        let redditPost = sequelize.define('redditPost', {
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
            subRedditID: Sequelize.STRING,
            author: Sequelize.STRING
        });
        redditPost.belongsTo(tvShow);
        redditPost.belongsTo(episode);

        episode.hasMany(imdbUserReview);
        episode.hasMany(traktComment);
        episode.hasMany(redditPost);

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
