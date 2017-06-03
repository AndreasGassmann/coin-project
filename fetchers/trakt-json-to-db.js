let dbjs = require('../db');
let db;

dbjs.init().then(res => {
    db = res;


});