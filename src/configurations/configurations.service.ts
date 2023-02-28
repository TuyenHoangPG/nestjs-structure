import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { config } from 'dotenv';
dotenv.config();

@Injectable()
export class ConfigurationsService {
  private environment: string = process.env.NODE_ENV || 'development';

  constructor() {
    const envFound = config({
      path: `./${this.environment}.env`,
    });

    if (!envFound || envFound?.error) {
      throw new Error('Could not find .env file');
    }
  }

  get(name: string): string | undefined {
    return process.env[name];
  }

  get isDevelopment(): boolean {
    return this.environment === 'development';
  }
}
