module.exports = {
  testEnvironment: "node",
  verbose: false,
  projects: [
    {
      displayName: "unit",
      testMatch: ["**/tests/unit/**/*.test.js"],
    },
    {
      displayName: "integration",
      testMatch: ["**/tests/integration/**/*.test.js"],
    },
  ],
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.js"],
};
