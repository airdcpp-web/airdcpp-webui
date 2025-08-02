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

/*exports.AnimationConstants = {
  modal: 10,
  dropdown: 10,
  popup: 10,
};*/

vi.mocked(exports.AnimationConstants).dropdown = 10;
vi.mocked(exports.AnimationConstants).modal = 10;
vi.mocked(exports.AnimationConstants).popup = 10;

/*vi.spyOn(exports, 'AnimationConstants', 'get').mockReturnValue({
  modal: 10,
  dropdown: 10,
  popup: 10,
});*/
