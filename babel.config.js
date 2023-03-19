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
    '@babel/plugin-syntax-dynamic-import',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-class-properties',
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
