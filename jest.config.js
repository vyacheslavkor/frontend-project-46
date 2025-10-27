/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',

  testMatch: ['**/__tests__/**/*.test.js'],
  // Generate code coverage
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],

  // Files to include coverage
  collectCoverageFrom: [
    'src/**/*.js',
  ],
  transform: {},
}
