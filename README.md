# airdcpp-webui

AirDC++ Web UI written in Javascript. Communicates with AirDC++ Core via [AirDC++ Web API](https://github.com/airdcpp/airdcpp-webapi).

This package should be downloaded directly only for development purposes; end users will get it through other projects, such as [AirDC++ Web Client](https://airdcpp-web.github.io).

## Installing dependencies

You must have [Node](https://nodejs.org/en/) installed before continuing. The following commands should be run in the main directory of the cloned repository.

Install dependencies:

    $ npm install

You can skip Semantic UI installation when prompted.

## Production build

#### Windows

Run ``scripts/build-prod-windows.bat``


#### Other operating systems

Run the command

    $ npm run build
    

## Using the integrated web server

The integrated server connects to AirDC++ Web API through the default port 5600. When the server is running, open your browser and navigate to http://localhost:3000

#### Development mode

Start the server by running

    $ npm start

Changes made to the source will be updated instantly to the browser while the server is running (there is no need to run the build command).

#### Serving production build files (won't work on Windows)

The UI must be built first.

Run the following command:

    $ npm run serve
