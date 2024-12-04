import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import {  ResetPasswordDto, SignInDto, SignUpDto } from './Dto/auth.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  //  @docs   Sign Up
  //  @Route  POST /api/v1/auth/sign-up
  //  @access Public
  @Post('sign-up')
  signUp(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    signUpDto: SignUpDto,
  ) {
    return this.authService.signUp(signUpDto);
  }
  //  @docs   Sign In
  //  @Route  POST /api/v1/auth/sign-in
  //  @access Public
  @Post('sign-in')
  signIn(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    signInDto: SignInDto,
  ) {
    return this.authService.signIn(signInDto);
  }
  //  @docs   Any User Can Reset Password
  //  @Route  POST /api/v1/auth/reset-password
  //  @access Public
  @Post('reset-password')
  resetPassword(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    email: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(email);
  }
  //  @docs   Any User Can Virify Code
  //  @Route  POST /api/v1/auth/virify-code
  //  @access Public
  @Post('virify-code')
  virifyCode(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    virifyCode: {
      email: string;
      code: string;
    },
  ) {
    return this.authService.virifyCode(virifyCode);
  }

  //  @docs   Any User Can change password
  //  @Route  POST /api/v1/auth/change-password
  //  @access Private for users=> admin, user
  @Post('change-password')
  changePassword(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    changePasswordData: SignInDto,
  ) {
    return this.authService.changePassword(changePasswordData);
  }
}
