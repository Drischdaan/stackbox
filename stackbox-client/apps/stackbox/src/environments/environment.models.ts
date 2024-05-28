export interface IEnvironment {
  production: boolean;
  auth: {
    domain: string;
    clientId: string;
  };
  api: {
    url: string;
    audience: string;
    scope: string;
  };
}
