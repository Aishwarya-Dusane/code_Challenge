module.exports = {
  // other Jest config options
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // <-- move here, top-level
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
  transform: {
  "^.+\\.(ts|tsx|js)$": "ts-jest",  // add js to transform
},

};