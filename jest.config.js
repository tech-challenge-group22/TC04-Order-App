/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/enums/**'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePaths: [
    '/Volumes/ExternalHD/Documents EHD/FIAP/Tech-Challenge/tech-challenge/src',
  ],
};
