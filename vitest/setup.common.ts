if (typeof window.global === 'undefined') {
  window.global ||= window;
}

window.global.getBasePath = () => '/';
window.global.isDemoInstance = () => false;

import $ from 'jquery';

(window as any).$ = $;
(window as any).jQuery = $;

import '@testing-library/jest-dom/vitest';
