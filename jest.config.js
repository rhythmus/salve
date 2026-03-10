module.exports = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.test.ts'],
    moduleNameMapper: {
        '^@salve/(.*)$': '<rootDir>/packages/$1/src',
    },
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(bg-name-days|greek-namedays|@desquared)/)',
    ]
};
