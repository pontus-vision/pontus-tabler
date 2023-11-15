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
  coverage: true,
};
