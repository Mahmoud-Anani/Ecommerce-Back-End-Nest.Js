import { Module } from '@nestjs/common';
import { OAuthController } from './oauth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthService } from './oauth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
  ],
  controllers: [OAuthController],
  providers: [GoogleStrategy, AuthService],
})
export class OAuthModule {}
