export interface IAppConfig {
  port: number;
}

type AppConfigContainer = {
  app: IAppConfig;
};

export default (): AppConfigContainer => ({
  app: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
});
