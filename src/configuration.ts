export interface RedisConfig {
  host: string
  port: number
  password?: string
}

export interface AppConfig {
  name: string
  version: string
  url?: string
}

export interface SessionConfig {
  expiresIn: string
}

export interface JwtConfig {
  secret: string
  expiresIn: string
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
    port: parseInt(process.env.PORT || '3000', 10),
    app: {
      name: process.env.APP_NAME || 'app',
      version: process.env.APP_VERSION?.substring(0, 7) || 'local',
      url: process.env.APP_URL,
    },
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD,
    },
    session: {
      expiresIn: process.env.SESSION_EXPIRATION || '8h',
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'secret',
      expiresIn: process.env.JWT_EXPIRATION || '1h',
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  }
}
