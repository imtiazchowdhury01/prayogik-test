import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  coverageProvider: "v8",
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: "coverage",
  testEnvironment: "jest-environment-jsdom",
};
export default createJestConfig(config);