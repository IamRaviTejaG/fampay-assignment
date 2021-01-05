# FamPay - YouTube Trending API

## Contents
- [Getting Started](#getting-started)
- [Running locally](#running-locally)
  - [The .env file](#the-env-file)
  - [npm scripts](#npm-scripts)
- [API endpoints](#api-endpoints)
    - [1. /get](#1-get)
    - [2. /search](#2-search)

## Getting Started
Start by cloning the repository using: `git clone https://github.com/IamRaviTejaG/fampay-assignment.git` followed by `cd fampay-assignment`.

Install all the dependencies (including the dev dependencies) using the `npm install` or `npm i` command. Once the dependencies are installed, use `npm start` to start the server.

## Running locally
### The `.env` file
The `.env` file holds the important variables for the whole application which include the MongoDB URL, Google API keys, Redis URL, etc.

### npm scripts
The `package.json` file contains three scripts for running locally: `linter`, `build` & `start`.

- `"linter": "standard --fix"`

Runs the StandardJS linter along with the `--fix` flag, which lints code to a great extent. The traceback (if one shows up) is the list of errors that need to be fixed manually.

- `"build": "rimraf dist/ && babel ./ --out-dir dist/ --copy-files"`

Builds the project.

- `"start": "npm run build && node -r dotenv/config dist/index.js --no-deprecation"`

First builds the source code and then starts the server.

## API endpoints
#### 1. `/get`
```
URL: /get/:page?
Request type: GET
Optional data parameters: page
```

NOTE: The `page` parameter is optional and defaults to page 1.

#### 2. `/search`
```
URL: /set/:searchString
Request type: GET
Data parameters: searchString
```
