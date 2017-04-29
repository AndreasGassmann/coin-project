# CoinProject

## Setup

### System Dependencies

To run this app, you need to have `node` and `npm` installed.

You can download them here: https://nodejs.org/en/

Make sure you have the latest version (v7.9.0) installed because we will use features that are only supported in the most recent version.

### Setting up the project

First you need to clone this repository and install the apps dependencies

```
git clone https://github.com/AndreasGassmann/coin-project

cd coin-project

npm i
```

### Running the project

You can now run the app by using the followin command:

```
node server.js
```

The webserver is now accessible on port 3000. `http://localhost:3000/`

## Config

Because it's a bad idea to store credentials in a github repository, we can safely store our own credentials in the file `config/config.json`. This file will not be committed to the server and everyone can use their own credentials.


## Working with external APIs

NPM offers a huge library of packages that simplify common tasks. As an example, we will look at the twitter API. You can either go to https://www.npmjs.com and search for "twitter", or you do a google search with "npm twitter".

The "twitter" module https://www.npmjs.com/package/twitter allows for easy access to the twitter API with just a few lines of code.

As described in the package itself, you first have to run

```
npm i twitter --save
```

This will download the package into the `node_modules` folder and also add a reference to the package in the `package.json` file. This is the place where all the dependencies for our project are stored. If someone else added a package to the package.json file, you can just run `npm i` and it will be added to your project.

In the file `fetchers/twitter.js` you can see how the the library is used.

You can start the fetcher with the following command:

```
node fetchers/twitter.js
```