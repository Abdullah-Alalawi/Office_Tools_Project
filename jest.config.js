// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  },

  // allow ESM deps like axios to be compiled
  transformIgnorePatterns: [
    '/node_modules/(?!(axios)/)'
  ],

  moduleNameMapper: {
    // CSS modules & styles
    '\\.(css|scss)$': 'identity-obj-proxy',

    // image & other static assets
    '\\.(jpg|jpeg|png|gif|webp|avif|svg)$': '<rootDir>/__mocks__/fileMock.js'
  }
};
