let sentiment = require('sentiment');
let emotional = require('emotional');
let natural = require('natural');
const db = require('./db.js');

let TfIdf = natural.TfIdf,
    tfidf = new TfIdf();

let comments = require('./data/game-of-thrones-comments.json');

emotional.load(() => {
    comments.forEach(c => {
        console.log(c.comment);
        console.log('User rating: ' + c.user_rating);

        // Term frequency
        tfidf.addDocument(c.comment);

        console.dir(emotional.get(c.comment), { depth: null });

        // console.log(sentiment(c.comment));
    });

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

db.init().then((db) => {

    // returns array with the amount of 1-10 star ratings per TV-Show for imdb and trakt ratings
    let getRatingDistributionShowLevel = function(showId){
		return new Promise(function(resolve, reject){
			// initialize empty array of 1-10 star ratings (imdb)
			let imdbRatingDistribution = [];
			for (let i=1; i <= 10; i++){
				imdbRatingDistribution[i] = 0;
			}
            // initialize empty array of 1-10 star ratings (trakt)
			let traktRatingDistribution = [];
			for (let i=1; i <= 10; i++){
				traktRatingDistribution[i] = 0;
			}

			let promises = [];

			// fetch all imdb ratings for tvShowId
			promises.push(db.sequelize.models.imdbUserReview.findAll({
				//where: {tvShowId: showId} // auskommentiert, da in der db keine showId hinterlegt ist
			}));
			// fetch all trakt ratings for tvShowId
			promises.push(db.sequelize.models.traktComment.findAll({
				//where: {tvShowId: showId} // auskommentiert, da in der db keine showId hinterlegt ist
			}));

            // when all ratings where fetched (promises resolved), then fill the arrays.
			Promise.all(promises).then(function(data){
				let imdbRatings = data[0];
				let traktRatings = data[1];

				// add any rating occurrence to the array
				for (let index in imdbRatings){
					if (imdbRatings[index].rating !== null){
						imdbRatingDistribution[imdbRatings[index].rating]++;
					}
				}
				// add any rating occurrence to the array
				for (let index in traktRatings){
					if (traktRatings[index].rating !== null){
						traktRatingDistribution[traktRatings[index].userRating]++;
					}
				}

				let distributionOfRatings = [];
				distributionOfRatings.push(imdbRatingDistribution);
				distributionOfRatings.push(traktRatingDistribution);

				// resolve (return) the array with both distributions
				resolve(distributionOfRatings);
			});
        });
    };


    getRatingDistributionShowLevel(0);



});