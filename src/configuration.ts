export default () => {
  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    app: {
      name: process.env.APP_NAME,
      version: process.env.APP_VERSION,
      url: process.env.APP_URL,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    },
    session: {
      expiration: process.env.SESSION_EXPIRATION,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiration: process.env.JWT_EXPIRATION,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  }
}
