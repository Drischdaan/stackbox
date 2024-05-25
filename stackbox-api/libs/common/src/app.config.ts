export interface IAppConfig {
  port: number;
  allowedOrigins: string[];
}

type AppConfigContainer = {
  app: IAppConfig;
};

export default (): AppConfigContainer => ({
  app: {
    port: parseInt(process.env.PORT, 10) || 3000,
    allowedOrigins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : [],
  },
});
