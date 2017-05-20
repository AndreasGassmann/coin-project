let fs = require('fs');

const csvFilePath = './imdbUserReviews.csv';

let wordCount = {};
/*
wordCount = {
  'hallo': 1,
  'x': 5
}
wordCount['hallo'] // 1
*/
const csv = require('csvtojson');
csv({
    noheader:false,
    delimiter:';',
})
.fromFile(csvFilePath)
.on('json',(jsonObj) => {

  let sentiment = jsonObj.text_sentimentObject;
  let score = sentiment.substring(sentiment.indexOf(':') + 1, sentiment.indexOf(','));

  let text = jsonObj.title + ' ' + jsonObj.text;

  text = text
    .split(',').join(' ')
    .split(';').join(' ')
    .split('.').join(' ')
    .split(')').join(' ')
    .split('(').join(' ')
    .split('<').join(' ')
    .split('>').join(' ')
    .split('/').join(' ')
    .split('!').join(' ')
    .split("'").join('')
    .split('\n').join(' ');

  let processedText = text.split(' ');

  processedText.forEach(el => { 
    if(wordCount[el.toLowerCase()] === undefined) {
      wordCount[el.toLowerCase()] = [score];
    } else {
      wordCount[el.toLowerCase()].push(score);
    }
  });

  //console.log(wordCount);

  //process.exit();
    // combine csv header row and csv line to a json object 
    // jsonObj.a ==> 1 or 4 
})
.on('done',(error) => {
    console.log('end')
    let wordArray = [];

    for (var property in wordCount) {
      if (wordCount.hasOwnProperty(property)) {

          // calculate average
          let word = wordCount[property];
          let average = word.reduce(function(acc, val) {
            return acc + parseInt(val);
          }, 0) / wordCount[property].length;

          wordArray.push({ text: property, size: wordCount[property].length, avgSentiment: average });
      }
    }

    let result = wordArray.sort((a, b) => {
      if (a.size > b.size) {
        return -1;
      }
      if (a.size < b.size) {
        return 1;
      }
      // a must be equal to b
      return 0;
    });

    let smallerArray = [];
    let count = 0;
    result.forEach(el => {
      if (count > 50) {
        return
      } else {
        
      }
      count++;
      el.size = el.size / 100;
      smallerArray.push(el);
    });

    console.log(smallerArray);

    fs.writeFileSync('./result.json', JSON.stringify(smallerArray));
})