// One of the most difficult concepts of javascript are asynchronous functions. Some functions don't get executed
// immediately, but get added to the "Event Loop", which is basically a queue of functions to be executed.

// A simple example:

console.log('---- Example 1 ----');

console.log(1);

setTimeout(() => {
    console.log(2);
}, 0);

console.log(3);

// The output will be:
// 1
// 3
// 2

// The reason for that is the asynchronous "setTimeout" function. Everything inside it will be added to the Event Loop
// and will only be executed at a later time. The program then continues and executes everything else in this file, until
// there is nothing else to execute (reached the bottom of the file). It will then check if there is anything left in the
// Event Loop and will execute that.