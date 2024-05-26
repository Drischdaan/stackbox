export interface IAuthConfig {
  issuerUrl: string;
  audience: string;
}

type AuthConfigContainer = {
  auth: IAuthConfig;
};

export default (): AuthConfigContainer => ({
  auth: {
    issuerUrl: process.env.AUTH_ISSUER_URL,
    audience: process.env.AUTH_AUDIENCE,
  },
});
