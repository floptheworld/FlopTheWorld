# FlopTheWorld

### Getting Started

First Set is to fork the FlopTheWorld Repository and add the upstream remote. You can place the forked repository anywhere on your system.

```bash
$ git clone git@github.com:YOUR_GIT_USERNAME/FlopTheWorld.git
$ cd FlopTheWorld
$ git remote add upstream https://github.com/zsarnett/FlopTheWorld.git
```

### Installing Node.js

Node.js is required to build the frontend. The preferred method of installing node.js is with [nvm](https://github.com/creationix/nvm). Install nvm using the instructions in the [README](https://github.com/creationix/nvm#install-script), and install the correct node.js by running the following command:

```bash
$ nvm install
```

Next, development dependencies need to be installed. First activate the right Node version and then download all the dependencies:

```bash
$ nvm use
$ npm install
```

## Development

During development, you will need to run the development script to maintain a development build of the frontend that auto updates when you change any of the source files. To run this server, run:

```bash
$ nvm use
$ npm run develop
```

To run the Node JS Express Server:

```bash
$ nvm use
$ npm start
```

To make sure your code has no errors in Syntax/Sematics, you can run TSLint:

```bash
$ nvm use
$ npm run lint
```

> It is recommended that you use VSCode as your Text Editor and install the following packages: 

- Prettier - Code Formatter
- TSLint
- ESLint
- lit-html

## Creating pull requests

If you're planning on issuing a PR back to the FlopTheWorld codebase you need to fork the project and add your fork as a remote to the FlopTheWorld repo.

```bash
$ git remote add fork <github URL to your fork>
```

When you've made your changes and are ready to push them change to the working directory for the project and then push your changes

```bash
$ git add -A
$ git commit -m "Added new feature X"
$ git push -u fork HEAD
```
