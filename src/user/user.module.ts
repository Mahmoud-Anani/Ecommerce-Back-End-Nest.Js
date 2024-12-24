import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController, UserMeController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './user.schema';

// For Admin
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
  ],

  controllers: [UserController, UserMeController],
  providers: [UserService],
})
export class UserModule {}
