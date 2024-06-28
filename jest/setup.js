global.getBasePath = () => '/';
global.isDemoInstance = () => false;

window.$ = require('jquery');
window.jQuery = require('jquery');

// https://stackoverflow.com/questions/19697858/referenceerror-textencoder-is-not-defined
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = global.TextEncoder || TextEncoder;
global.TextDecoder = global.TextDecoder || TextDecoder;
