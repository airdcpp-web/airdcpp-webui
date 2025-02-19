export const installSvgMocks = () => {
  // https://github.com/apexcharts/react-apexcharts/issues/52#issuecomment-844757362

  Object.defineProperty(global.SVGElement.prototype, 'getScreenCTM', {
    writable: true,
    value: jest.fn(),
  });

  Object.defineProperty(global.SVGElement.prototype, 'getBBox', {
    writable: true,
    value: jest.fn().mockReturnValue({
      x: 0,
      y: 0,
    }),
  });

  Object.defineProperty(global.SVGElement.prototype, 'getComputedTextLength', {
    writable: true,
    value: jest.fn().mockReturnValue(0),
  });

  Object.defineProperty(global.SVGElement.prototype, 'createSVGMatrix', {
    writable: true,
    value: jest.fn().mockReturnValue({
      x: 10,
      y: 10,
      inverse: () => {},
      multiply: () => {},
    }),
  });
};
