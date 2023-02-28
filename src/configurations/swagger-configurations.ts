import { APP_NAME } from '@constants/constants';
import { DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle(APP_NAME)
  .setDescription(`API for ${APP_NAME}`)
  .setVersion('1.0')
  .addBearerAuth()
  .build();

export default config;
