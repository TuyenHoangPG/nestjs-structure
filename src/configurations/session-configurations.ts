import * as connectPgSimple from 'connect-pg-simple';
import * as session from 'express-session';
import { Pool } from 'pg';
import { ConfigurationEnum } from './configurations.enum';
import { ConfigurationsService } from './configurations.service';

export class SessionConfigurations extends ConfigurationsService {
  static get config(): session.SessionOptions {
    const pool = new Pool({
      host: process.env[ConfigurationEnum.DB_HOST],
      port: Number(process.env[ConfigurationEnum.DB_PORT] || 5432),
      user: process.env[ConfigurationEnum.DB_USERNAME],
      password: process.env[ConfigurationEnum.DB_PASSWORD],
      database: process.env[ConfigurationEnum.DB_NAME],
    });

    const store = new (connectPgSimple(session))({
      pool,
      tableName: 'user_sessions',
    });

    return {
      secret: process.env[ConfigurationEnum.SESSION_SECRET],
      store,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
      },
    };
  }
}
