module.exports = {
    preset: 'ts-jest',
    moduleNameMapper: {
        'source-map-support/register': 'identity-obj-proxy',
    },
    setupFiles: ['<rootDir>/jest.env.js'],
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: ['lib/**'],
    testTimeout: 15000
}