import { IsAuthenticatedGuard } from '@guards/is-authenticated.guard';
import { LocalAuthGuard } from '@guards/local-auth.guard';
import { Controller, Get, Request, Response, Render, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(['/', '/login-register'])
  @Render('auth/master')
  getLoginRegister(@Request() req) {
    return {
      errors: req.flash('errors'),
      success: req.flash('success'),
    };
  }

  @UseGuards(IsAuthenticatedGuard)
  @Get('/home')
  @Render('main/home/home')
  getHomePage(@Request() req) {
    return {
      errors: req.flash('errors'),
      success: req.flash('success'),
      user: req.user, // this variable is saved in request by passport
      notifications: [],
      countNotifUnread: 0,
      contacts: [],
      contactsSent: [],
      contactsReceived: [],
      countAllContacts: 0,
      countAllContactsSent: 0,
      countAllContactsReceived: 0,
      // allConversations,
      // userConversations,
      // groupConversations,
      allConversationWithMessages: [],
      convertBufferToBase64: () => {},
      getLastItemInArray: () => {},
      convertTimestampToHumanTime: () => {},
      iceServerList: JSON.stringify([]),
    };
  }
}
