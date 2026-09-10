import { vi } from 'vitest';

export const installSvgMocks = () => {
  // https://github.com/apexcharts/react-apexcharts/issues/52#issuecomment-844757362

  Object.defineProperty(globalThis.SVGElement.prototype, 'getScreenCTM', {
    writable: true,
    value: vi.fn(),
  });

  Object.defineProperty(globalThis.SVGElement.prototype, 'getBBox', {
    writable: true,
    value: vi.fn().mockReturnValue({
      x: 0,
      y: 0,
    }),
  });

  Object.defineProperty(globalThis.SVGElement.prototype, 'getComputedTextLength', {
    writable: true,
    value: vi.fn().mockReturnValue(0),
  });

  Object.defineProperty(globalThis.SVGElement.prototype, 'createSVGMatrix', {
    writable: true,
    value: vi.fn().mockReturnValue({
      x: 10,
      y: 10,
      inverse: () => {},
      multiply: () => {},
    }),
  });
};
