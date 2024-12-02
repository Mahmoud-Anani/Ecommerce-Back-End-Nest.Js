import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  // Name
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(30, { message: 'Name must be at most 30 characters' })
  name: string;
  // Email
  @IsString({ message: 'Email must be a string' })
  @MinLength(0, { message: 'Thie Email Must be Required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;
  // Password
  @IsString({ message: 'Password must be a string' })
  @MinLength(3, { message: 'password must be at least 3 characters' })
  @MaxLength(20, { message: 'password must be at most 20 characters' })
  password: string;
}
export class SignInDto {
  // Email
  @IsString({ message: 'Email must be a string' })
  @MinLength(0, { message: 'Thie Email Must be Required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;
  // Password
  @IsString({ message: 'Password must be a string' })
  @MinLength(3, { message: 'password must be at least 3 characters' })
  @MaxLength(20, { message: 'password must be at most 20 characters' })
  password: string;
}

export class ResetPasswordDto {
  // Email
  @IsString({ message: 'Email must be a string' })
  @MinLength(0, { message: 'Thie Email Must be Required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;
}
