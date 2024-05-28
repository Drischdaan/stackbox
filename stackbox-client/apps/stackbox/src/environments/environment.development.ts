import { IEnvironment } from './environment.models';

export const environment: IEnvironment = {
  production: false,
  auth: {
    domain: 'stackbox-dev.eu.auth0.com',
    clientId: 'bKWB3VCnkI5sca58ih2RvLOvXSKiEuAN',
  },
  api: {
    url: 'http://localhost:3000',
    audience: 'https://api.stackbox.dev',
    scope: 'openid profile email',
  },
};
