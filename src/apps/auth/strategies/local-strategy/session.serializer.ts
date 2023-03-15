import { UserService } from '@apps/user/user.service';
import { User } from '@entities/user.entity';
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(user: User, done: (err: Error, userId: string) => void) {
    done(null, user.userId);
  }

  async deserializeUser(userId: string, done: (err: Error, user: User) => void) {
    try {
      const user = await this.userService.getUserById(userId);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
}
