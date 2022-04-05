export enum Environment {
  Production = 'production',
  Development = 'development',
  Test = 'test',
}

export const environmentDirection = Object.freeze({
  Production: '',
  Development: process.cwd() + '/.env.development',
  Test: process.cwd() + '/.env.test',
});

export const environmentSetup = () => {
  let env: string = environmentDirection.Development;

  if (process.env.NODE_ENV === Environment.Production) {
    env = environmentDirection.Production;
  }

  if (process.env.NODE_ENV === 'test') {
    env = environmentDirection.Test;
  }

  return env;
};
