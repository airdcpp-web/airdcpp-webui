# airdcpp-webui [![Node.js CI][build-badge]][build] [![npm package][npm-badge]][npm]

>This package should be used directly only for development purposes; end users will get it through other projects, such as [AirDC++ Web Client](https://airdcpp-web.github.io). Normal feature request and bug reports should also be posted on [AirDC++ Web Client's issue tracker](https://github.com/airdcpp-web/airdcpp-webclient).

AirDC++ Web UI written in Javascript. Communicates with AirDC++ Core via [AirDC++ Web API](https://github.com/airdcpp/airdcpp-webapi).

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


[build-badge]: https://github.com/airdcpp-web/airdcpp-webui/actions/workflows/node.js.yml/badge.svg
[build]: https://github.com/airdcpp-web/airdcpp-webui/actions/workflows/node.js.yml

[npm-badge]: https://img.shields.io/npm/v/airdcpp-webui.svg?style=flat-square
[npm]: https://www.npmjs.org/package/airdcpp-webui
