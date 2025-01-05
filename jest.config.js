module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/__tests__/unit/'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text'],
  collectCoverageFrom: [
    'src/utils/util.js',
  ],
};
