import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { ResetPasswordDto, SignInDto, SignUpDto } from './Dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

const saltOrRounds = 10;
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const user = await this.userModel.findOne({ email: signUpDto.email });
    if (user) {
      throw new HttpException('User already exist', 400);
    }
    const password = await bcrypt.hash(signUpDto.password, saltOrRounds);
    const userCreated = {
      password,
      role: 'user',
      active: true,
    };
    const newUser = await this.userModel.create({
      ...signUpDto,
      ...userCreated,
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

  async signIn(signInDto: SignInDto) {
    // email, password
    const user = await this.userModel
      .findOne({ email: signInDto.email })
      .select('-__v');
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const isMatch = await bcrypt.compare(signInDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
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

  async resetPassword({ email }: ResetPasswordDto) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    // create code 6 digit
    const code = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    // inser code in db=> verificationCode
    await this.userModel.findOneAndUpdate(
      { email },
      { verificationCode: code },
    );
    // send code to user email
    const htmlMessage = `
    <div>
      <h1>Forgot your password? If you didn't forget your password, please ignore this email!</h1>
      <p>Use the following code to verify your account: <h3 style="color: red; font-weight: bold; text-align: center">${code}</h3></p>
      <h6 style="font-weight: bold">Ecommerce-Nest.JS</h6>
    </div>
    `;

    await this.mailService.sendMail({
      from: `Ecommerce-Nest.JS <${process.env.MAIL_USER}>`,
      to: email,
      subject: `Ecommerce-Nest.JS - Reset Password`,
      html: htmlMessage,
    });
    return {
      status: 200,
      message: `Code sent successfully on your email (${email})`,
    };
  }

  async virifyCode({ email, code }: { email: string; code: string }) {
    const user = await this.userModel
      .findOne({ email })
      .select('verificationCode');

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    if (user.verificationCode !== code) {
      throw new UnauthorizedException('Invalid code');
    }

    await this.userModel.findOneAndUpdate(
      { email },
      { verificationCode: null },
    );

    return {
      status: 200,
      message: 'Code verified successfully, go to change your password',
    };
  }

  async changePassword(changePasswordData: SignInDto) {
    const user = await this.userModel.findOne({
      email: changePasswordData.email,
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const password = await bcrypt.hash(
      changePasswordData.password,
      saltOrRounds,
    );
    await this.userModel.findOneAndUpdate(
      { email: changePasswordData.email },
      { password },
    );
    return {
      status: 200,
      message: 'Password changed successfully, go to login',
    };
  }

  async refreshToken(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_SECRET_REFRESHTOKEN,
    });
    if (!payload || payload.countEX <= 0) {
      throw new UnauthorizedException(
        'Invalid refresh token, please go to sign in',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { exp, ...newPayload } = payload;

    const newPayoadForAccessToken = {
      _id: newPayload._id,
      email: newPayload.email,
      role: newPayload.role,
    };

    // create access token
    const access_token = await this.jwtService.signAsync(
      newPayoadForAccessToken,
      {
        secret: process.env.JWT_SECRET,
      },
    );

    // create refresh token

    const refresh_token = await this.jwtService.signAsync(
      { ...newPayload, countEX: payload.countEX - 1 },
      {
        secret: process.env.JWT_SECRET_REFRESHTOKEN,
        expiresIn: '7d',
      },
    );


    return {
      status: 200,
      message: 'Refresh Access token successfully',
      access_token,
      refresh_token,
    }
  }
}
