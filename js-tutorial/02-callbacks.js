// Not everything in javascript is asynchronous:

console.log(1);

/*
for (let i = 0; i < 1000000000; i++) {
    let y = i / 2;
};
*/

console.log(2);

// This will block execution, just like you would expect.
// However, many functions like http requests or db queries are asynchronous and will not block execution.
// Those tasks will be handed over to the OS and once it has the result, it will notify the javascript engine.

// So the following code would not work:

let db = {
    query: (query) => {
        setTimeout(() => { // We use setTimeout to imitate an asynchronous function
            return 'We found 10 results';
        }, 1000); // 1 second delay
    }
};

let result = db.query('SELECT * FROM test');
console.log(result); // Undefined

// Assuming that db.query is asynchronous, the "console.log(result)" immediately after we give the query to the OS, which
// obviously means that we don't have the result yet. The "return"-value will never be handled and is lost.

// The way to handle that is by using "callback" functions. Those functions the added to the Event Loop and will be executed
// once the OS notifies us that we have the result.

db = {
    query: (query, callback) => {
        setTimeout(() => {
            callback('We found 10 results'); // We are not returning anything, instead we call the callback function with our result
        }, 1000);
    }
};

db.query('SELECT COUNT(*) FROM test', (result) => {
    console.log(result);
    // As the second argument of the query function we pass in another function, that we later call to return the result.
    // This code snippet will only be executed when we have a result. Depending on the task, this can be almost immediately
    // or 10 minutes later.
});

console.log('end of file');