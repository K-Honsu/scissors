/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  forceExit: true,
  testMatch: ["**/**/*.test.ts"],
  // clearMocks: true,
  jest: {
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    },
  },
};
