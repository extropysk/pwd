export interface RedisConfig {
  host: string
  port: number
  password?: string
}

export interface AppConfig {
  name?: string
  version?: string
  url?: string
}

export interface SessionConfig {
  expiration?: string
}

export interface JwtConfig {
  secret?: string
  expiration?: string
}

export interface GoogleConfig {
  clientId?: string
  clientSecret?: string
}

export interface Config {
  port: number
  app: AppConfig
  redis: RedisConfig
  session: SessionConfig
  jwt: JwtConfig
  google: GoogleConfig
}

export default (): Config => {
  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    app: {
      name: process.env.APP_NAME,
      version: process.env.APP_VERSION,
      url: process.env.APP_URL,
    },
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
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
