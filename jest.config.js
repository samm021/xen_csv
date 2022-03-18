module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/index.{ts,js}',
    '!src/**/errors.{ts,js}',
    '!src/**/*.(interface|constants|type|validator|enum|error).{ts,js}',
    '!**/__mocks__/**',
    '!**/node_modules/**'
  ]
};
