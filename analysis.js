let sentiment = require('sentiment');
let emotional = require('emotional');
let natural = require('natural');

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
