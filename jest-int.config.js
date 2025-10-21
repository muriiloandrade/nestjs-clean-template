const fs = require('node:fs');

const config = JSON.parse(fs.readFileSync('./.swcrc', 'utf-8'));

/** @type {import('jest').Config} */
const jestConfig = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './src',
  testRegex: '.*\\.int\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': [
      '@swc/jest',
      {
        ...config,
        jsc: {
          ...config.jsc,
          paths: {
            '~app/*': ['./src/app/*'],
            '~domain/*': ['./src/domain/*'],
            '~infra/*': ['./src/infra/*'],
            '~interface/*': ['./src/interface/*'],
            '~shared/*': ['./src/shared/*'],
            '~mocks': ['./src/../test/mocks'],
          },
        },
      },
    ],
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  coveragePathIgnorePatterns: [
    'node_modules',
    'dist',
    'coverage',
    '.spec.ts',
    'index.ts',
    'metadata.ts',
    'module.ts',
    'main.ts',
  ],
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
};

module.exports = jestConfig;
