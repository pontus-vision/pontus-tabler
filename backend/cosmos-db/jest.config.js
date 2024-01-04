module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '.*.js',
    '.*.d.ts',
    '.*http.ts',
    '.*pv-response.ts',
    '.*test-utils.ts',
  ],
  // testNamePattern: 'testing tables',
  coverage: true,
  // collectCoverageFrom: ['**/*.{ts}', '!**/node_modules/**', '!**/vendor/**'],
  coverageProvider: 'v8',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  // testMatch: [
  //   '<rootDir>/src/__tests__/**/*.[jt]s?(x)',
  //   '**/?(*.)+(spec|test).[jt]s?(x)',
  // ],
};
