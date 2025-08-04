if (typeof window.global === 'undefined') {
  window.global ||= window;
}

window.global.getBasePath = () => '/';
window.global.isDemoInstance = () => false;

import $ from 'jquery';

(window as any).$ = $;
(window as any).jQuery = $;

import '@testing-library/jest-dom/vitest';

import * as exports from '../src/constants/UIConstants';
import { vi } from 'vitest';

vi.mock('../src/constants/UIConstants', { spy: true });

vi.mocked(exports.AnimationConstants).dropdown = 0;
vi.mocked(exports.AnimationConstants).modal = 0;
vi.mocked(exports.AnimationConstants).popup = 0;

import { afterEach } from 'vitest';

afterEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
