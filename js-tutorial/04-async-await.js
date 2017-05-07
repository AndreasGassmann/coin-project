// Async/Await is a brand new feature in javascript (that's why we need node 7.6.0 or higher). It's mostly just syntactic
// sugar for promises and makes the code more readable.

// Let's say we have the following promise like before

let promise = new Promise((resolve, reject) => {
   // We can do things here and then resolve or reject
    setTimeout(() => {
        resolve('Everything ok!');
    }, 1000); // After 1 second we resolve the promise
});

// Instead of using "then" and "catch", we can use await instead.

let myFunction = async() => {
    let result = await promise; // By using await inside an async function, the program will "stop" executing here until
                                // the result is back. It's the same as using "then", but makes the code a bit more readable.
    console.log(result); // This will only be printed once the promise has been resolved.
};

myFunction();