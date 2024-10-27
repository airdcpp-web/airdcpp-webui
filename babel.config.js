module.exports = {
  presets: [
    '@babel/react',
    [
      '@babel/env',
      {
        targets: {
          browsers: [
            'last 5 Chrome versions',
            'last 3 Firefox versions',
            'safari >= 9',
            'edge >= 15',
          ],
        },
      },
    ],
    '@babel/typescript',
  ],
  plugins: [
    '@babel/transform-react-display-name',
    ['@babel/plugin-proposal-decorators', { version: '2023-11' }],
    [
      'module-resolver',
      {
        root: ['./src', './node_modules/fomantic-ui-css'],
        alias: {
          'fomantic-ui': 'fomantic-ui-css',
        },
      },
    ],
  ],
};
