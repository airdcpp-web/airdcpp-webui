module.exports = {
  preset: 'ts-jest',
  //testEnvironment: 'node',
  moduleDirectories: [
    'src',
    'node_modules',
  ],
  //tsConfig: 'tsconfig.jest.json',
  globals: {
    'ts-jest': {
      //tsConfig: 'tsconfig.json',
      //tsConfig: './tsconfig.test.json'
      //tsConfig: false
      //tsConfig: {
      //  module: 'commonjs',
      //  importHelpers: true
      //}
    }
  },
  transform: {
    //'^.+\\.jsx?$': 'babel-jest',
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx'
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/jest/stubs/FileStub.js',
    '\\.(css|less)$': '<rootDir>/jest/stubs/CSSStub.js'
  },
  setupFiles: [
    './jest/setup.js'
  ],
  cacheDirectory: './jest/cache/'
};