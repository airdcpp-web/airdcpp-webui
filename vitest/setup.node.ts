// Fetch polyfill
import 'whatwg-fetch';

import './setup.common';

// global.getBasePath = () => '/';
// global.isDemoInstance = () => false;

// https://stackoverflow.com/questions/19697858/referenceerror-textencoder-is-not-defined
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = global.TextEncoder || TextEncoder;
global.TextDecoder = global.TextDecoder || TextDecoder;

import { ResizeObserver } from '@juggle/resize-observer';
global.ResizeObserver = ResizeObserver;
