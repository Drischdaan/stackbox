export interface IJwtPayload {
  /* Issuer */
  iss: string;

  /* User Id */
  sub: string;

  /* Audience */
  aud: string[];

  /* Issued At */
  iat: number;

  /* Expiration Time */
  exp: number;

  /* Scopes */
  scope: string;

  /* Client Id */
  azp: string;

  /* Permissions */
  permissions: string[];
}
