import { Controller, Get, Request, Response, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/login-register')
  @Render('auth/master')
  getLoginRegister(@Request() req, @Response() _res) {
    return {
      errors: req.flash('errors'),
      success: req.flash('success'),
    };
  }
}
