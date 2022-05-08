const storageMock = (function() {
  var store = {};
  return {
    getItem: function(key) {
      return store[key];
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    removeItem: function(key) {
      delete store[key];
    },
    clear: function() {
      store = {};
    }
  };
});

global.getBasePath = () => '/'

global.localStorage = storageMock();
global.sessionStorage = storageMock();

window.$ = require('jquery');
window.jQuery = require('jquery');


// https://stackoverflow.com/questions/19697858/referenceerror-textencoder-is-not-defined
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = global.TextEncoder || TextEncoder;
global.TextDecoder = global.TextDecoder || TextDecoder;
