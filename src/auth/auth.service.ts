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

    return {
      status: 200,
      message: 'User created successfully',
      data: newUser,
      access_token: token,
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

    return {
      status: 200,
      message: 'User logged in successfully',
      data: user,
      access_token: token,
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
}
