# airdcpp-webui

AirDC++ Web UI written in Javascript. Communicates with AirDC++ Core via [AirDC++ Web API](https://github.com/airdcpp/airdcpp-webapi).

This package should be downloaded directly only for development purposes; end users will get it through other projects, such as [AirDC++ Web Client](https://github.com/maksis/airdcpp-webclient).

## Running development server

You must have [Node](https://nodejs.org/en/) installed before continuing. The following commands should be run in the main directory of the cloned repository.

Install dependencies:

    $ npm install

You can skip Semantic UI installation when prompted.

Start the server:

    $ npm start

The development server connects to AirDC++ Web API through the default port 5600.

When the server is running, open your browser and navigate to http://localhost:3000
