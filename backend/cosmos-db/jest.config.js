module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '.*.js',
    '.*d.ts',
    '.*http.ts',
    '.*pv-response.ts',
    '.*test-utils.ts',
  ],
  // testNamePattern: 'testing tables',
  coverage: true,
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  // testMatch: [
  //   '<rootDir>/src/__tests__/**/*.[jt]s?(x)',
  //   '**/?(*.)+(spec|test).[jt]s?(x)',
  // ],
};
