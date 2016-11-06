# airdcpp-webui [![Travis][build-badge]][build] [![npm package][npm-badge]][npm]

AirDC++ Web UI written in Javascript. Communicates with AirDC++ Core via [AirDC++ Web API](https://github.com/airdcpp/airdcpp-webapi).

This package should be downloaded directly only for development purposes; end users will get it through other projects, such as [AirDC++ Web Client](https://airdcpp-web.github.io).

## Installing dependencies

You must have [Node](https://nodejs.org/en/) installed before continuing. It's also recommended to ensure that your version of Node comes with npm 3 or newer (check with `npm -v`) as older versions may cause errors during the build process. See [this guide](https://docs.npmjs.com/getting-started/installing-node) for upgrading instructions.

The following commands should be run in the main directory of the cloned repository.

Install dependencies:

    $ npm install

## Production build

Run the command

    $ npm run build
    

## Running the integrated development server

The integrated server connects to AirDC++ Web API through the default port 5600. When the server is running, open your browser and navigate to http://localhost:3000

You may start the server by running

    $ npm start

Changes made to the source will be updated instantly to the browser while the server is running (there is no need to run the build command).

[build-badge]: https://img.shields.io/travis/airdcpp-web/airdcpp-webui/master.svg?style=flat-square
[build]: https://travis-ci.org/airdcpp-web/airdcpp-webui

[npm-badge]: https://img.shields.io/npm/v/airdcpp-webui.svg?style=flat-square
[npm]: https://www.npmjs.org/package/airdcpp-webui
