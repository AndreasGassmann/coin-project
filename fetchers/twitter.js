let Twitter = require('twitter');

let credentials = require('../config/config.json').credentials.twitter;

let client = new Twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});

// Get user timeline
client.get('statuses/user_timeline', {screen_name: 'GameOfThrones'}, function(error, tweets, response) {
    if (!error) {
        if (tweets) {
            tweets.forEach(tweet => {
                console.log(tweet.text);
                console.log('----------')
            });
        }
    } else {
        console.log(error);
    }
});

client.get('search/tweets', {q: 'game of thrones'}, function(error, tweets, response) {
    if (!error) {
        if (tweets.statuses) {
            tweets.statuses.forEach(tweet => {
                console.log(tweet.text);
                console.log('----------')
            });
        }
    } else {
        console.log(error);
    }
});

/*
 Sample response (tweet)

 { created_at: 'Wed Apr 26 13:10:34 +0000 2017',
    id: 857220360542048300,
    id_str: '857220360542048256',
    text: 'RT @azat_co: Node Toolchain for Newbies: The Best Node Apps and Libraries to Increase Productivity\n#nodejs @nodejs https://t.co/fRGCmTlpnL',
    truncated: false,
    entities:
     { hashtags: [Object],
       symbols: [],
       user_mentions: [Object],
       urls: [Object] },
    source: '<a href="http://twitter.com" rel="nofollow">Twitter Web Client</a>',
    in_reply_to_status_id: null,
    in_reply_to_status_id_str: null,
    in_reply_to_user_id: null,
    in_reply_to_user_id_str: null,
    in_reply_to_screen_name: null,
    user:
     { id: 91985735,
       id_str: '91985735',
       name: 'Node.js',
       screen_name: 'nodejs',
       location: 'Earth',
       description: 'The Node.js JavaScript Runtime',
       url: 'https://t.co/X32n3a0B1h',
       entities: [Object],
       protected: false,
       followers_count: 442808,
       friends_count: 538,
       listed_count: 6070,
       created_at: 'Mon Nov 23 10:57:50 +0000 2009',
       favourites_count: 963,
       utc_offset: -25200,
       time_zone: 'Pacific Time (US & Canada)',
       geo_enabled: true,
       verified: true,
       statuses_count: 4091,
       lang: 'en',
       contributors_enabled: false,
       is_translator: false,
       is_translation_enabled: false,
       profile_background_color: 'C0DEED',
       profile_background_image_url: 'http://abs.twimg.com/images/themes/theme1/bg.png',
       profile_background_image_url_https: 'https://abs.twimg.com/images/themes/theme1/bg.png',
       profile_background_tile: false,
       profile_image_url: 'http://pbs.twimg.com/profile_images/702185727262482432/n1JRsFeB_normal.png',
       profile_image_url_https: 'https://pbs.twimg.com/profile_images/702185727262482432/n1JRsFeB_normal.png',
       profile_banner_url: 'https://pbs.twimg.com/profile_banners/91985735/1456180633',
       profile_link_color: '1DA1F2',
       profile_sidebar_border_color: 'C0DEED',
       profile_sidebar_fill_color: 'DDEEF6',
       profile_text_color: '333333',
       profile_use_background_image: true,
       has_extended_profile: false,
       default_profile: true,
       default_profile_image: false,
       following: false,
       follow_request_sent: false,
       notifications: false,
       translator_type: 'none' },
    geo: null,
    coordinates: null,
    place: null,
    contributors: null,
    retweeted_status:
     { created_at: 'Wed Apr 26 05:54:00 +0000 2017',
       id: 857110493793849300,
       id_str: '857110493793849346',
       text: 'Node Toolchain for Newbies: The Best Node Apps and Libraries to Increase Productivity\n#nodejs @nodejs https://t.co/fRGCmTlpnL',
       truncated: false,
       entities: [Object],
       source: '<a href="http://bufferapp.com" rel="nofollow">Buffer</a>',
       in_reply_to_status_id: null,
       in_reply_to_status_id_str: null,
       in_reply_to_user_id: null,
       in_reply_to_user_id_str: null,
       in_reply_to_screen_name: null,
       user: [Object],
       geo: null,
       coordinates: null,
       place: null,
       contributors: null,
       is_quote_status: false,
       retweet_count: 14,
       favorite_count: 54,
       favorited: false,
       retweeted: false,
       possibly_sensitive: false,
       lang: 'en' },
    is_quote_status: false,
    retweet_count: 14,
    favorite_count: 0,
    favorited: false,
    retweeted: false,
    possibly_sensitive: false,
    lang: 'en' },
 */