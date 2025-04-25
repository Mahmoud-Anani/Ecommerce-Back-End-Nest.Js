import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';

import * as bcrypt from 'bcrypt';
const saltOrRounds = 10;

type UserData = {
  userId: string;
  email: string;
  name: string;
  photo: string;
};

function generateRandomPassword() {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]\:;?><,./-=';
  let password = '';
  const passwordLength = Math.floor(Math.random() * (20 - 4 + 1)) + 4; // طول الباسورد بين 4 و 20

  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  return password;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  async validateUser(userData: UserData): Promise<any> {
    // business logic
    const user = await this.userModel.findOne({ email: userData.email });
    //sign-up=> if not, create a new user (create new token) (create new password)
    if (!user) {
      const password = await bcrypt.hash(
        generateRandomPassword(),
        saltOrRounds,
      );
      const newUser = await this.userModel.create({
        email: userData.email,
        name: userData.name,
        avatar: userData.photo,
        password,
        role: 'user',
      });
      const payload = {
        _id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      };
      const token = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      });

      // create secret refresh token
      // create payload refresh token
      // create refresh token
      const refresh_token = await this.jwtService.signAsync(
        { ...payload, countEX: 5 },
        {
          secret: process.env.JWT_SECRET_REFRESHTOKEN,
          expiresIn: '7d',
        },
      );
      // return refresh token and access token

      return {
        status: 200,
        message: 'User created successfully',
        data: newUser,
        access_token: token,
        refresh_token,
      };
    }

    //sign-in=> check if user exists in the db (create new token)
    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    // create secret refresh token
    // create payload refresh token
    // create refresh token
    const refresh_token = await this.jwtService.signAsync(
      { ...payload, countEX: 5 },
      {
        secret: process.env.JWT_SECRET_REFRESHTOKEN,
        expiresIn: '7d',
      },
    );
    // return refresh token and access token

    return {
      status: 200,
      message: 'User logged in successfully',
      data: user,
      access_token: token,
      refresh_token,
    };
  }
}

//  <sign-up>
// case 1: لزم يدخل باسورد عشان يقدر يخش علي النظام
// case 2: مش لزم المستخدم يدخل باسورد و ممكن يدخله في اي وقت كان .. في حالة تسجيل الدخول مرة اخري لزم يسجل بنفس المنصة الخارجية
