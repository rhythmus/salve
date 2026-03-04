module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.test.ts'],
    moduleNameMapper: {
        '^@salve/(.*)$': '<rootDir>/packages/$1/src',
    },
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
    },
    transformIgnorePatterns: [
        'node_modules/(?!(bg-name-days)/)',
    ],
    extensionsToTreatAsEsm: ['.ts'],
};
