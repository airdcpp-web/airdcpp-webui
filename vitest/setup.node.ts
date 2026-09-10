// Fetch polyfill
import 'whatwg-fetch';

import './setup.common';

// globalThis.getBasePath = () => '/';
// globalThis.isDemoInstance = () => false;

// https://stackoverflow.com/questions/19697858/referenceerror-textencoder-is-not-defined
import { TextEncoder, TextDecoder } from 'node:util';

globalThis.TextEncoder = globalThis.TextEncoder || TextEncoder;
globalThis.TextDecoder = globalThis.TextDecoder || TextDecoder;

import { ResizeObserver } from '@juggle/resize-observer';
globalThis.ResizeObserver = ResizeObserver;
