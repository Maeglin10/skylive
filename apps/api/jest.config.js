module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'commonjs',
          target: 'ES2022',
          lib: ['ES2022'],
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          types: ['jest', 'node'],
          noImplicitAny: false,
          strict: false,
        },
      },
    ],
  },
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
};
