// Callbacks are a very old concept. The modern alternative are Promises. As the name suggests, it is a "Promise" that
// a value will be available at a later time.

// A Promise can be resolved (which means it was successful) or rejected (error).

let promise = new Promise((resolve, reject) => {
   // We can do things here and then resolve or reject
    setTimeout(() => {
        resolve('Everything ok!');
    }, 1000); // After 1 second we resolve the promise
});

console.log(promise); // Because our promise was neither resolved or rejected, it will print "Promise { <pending> }"

// To wait for a promise, we can use "then". This means, as soon as the promise is resolved, execute the then function

promise.then((result) => {
   console.log('Promise was resolved with: ' + result);
});

// We can use catch to handle errors

let promise2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject('Error!');
    }, 1000);
});

promise2.then((result) => {
    console.log('Promise2 was resolved with: ' + result);
}).catch((error) => {
    console.log('Promise2 was rejected: ' + error);
});

// So the way we usually want to work is with promises. Every time we have an asynchronous function, we will wrap it
// in a promise and return the promise. The caller then needs to make sure the "wait" for the result using "then" and
// "catch"

// Using the example from the last file:

let db = {
    query: (query, callback) => {
        setTimeout(() => {
            callback('We found 10 results'); // We are not returning anything, instead we call the callback function with our result
        }, 1000);
    }
};


let getSeasonsForTvShow = function(showName) {
    return new Promise((resolve, reject) => {
        db.query('SELECT COUNT(*) FROM test', (res) => {
            resolve(res);
        })
    });
};

getSeasonsForTvShow('Game of Thrones').then(res => {
    console.log(res);
}).catch(error => {
    // Do something with error
});