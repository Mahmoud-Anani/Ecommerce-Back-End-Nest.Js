import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
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
  // Role
  @IsEnum(['user', 'admin'], { message: 'role must be user or admin' })
  @MinLength(0, { message: 'Thie role Must be Required' })
  @IsOptional()
  role: string;
  // Avatar
  @IsString({ message: 'avatar must be a string' })
  @IsUrl({}, { message: 'avatar must be a valid URL' })
  @IsOptional()
  avatar: string;
  //   Age
  @IsNumber({}, { message: 'age must be a number' })
  @IsOptional()
  age: number;
  // PhoneNumber
  @IsString({ message: 'phoneNumber must be a string' })
  @IsPhoneNumber('EG', {
    message: 'phoneNumber must be a Egyptian phone number',
  })
  @IsOptional()
  phoneNumber: string;
  // Address
  @IsString({ message: 'address must be a string' })
  @IsOptional()
  address: string;
  // Active
  @IsBoolean({ message: 'active must be a boolean' })
  @IsEnum([true, false], { message: 'active must be true or false' })
  @IsOptional()
  active: boolean;
  // VerificationCode
  @IsString({ message: 'verificationCode must be a string' })
  @IsOptional()
  @Length(6, 6, { message: 'verificationCode must be 6 characters' })
  verificationCode: string;
  // Gender
  @IsEnum(['male', 'female'], { message: 'gender must be male or female' })
  @IsOptional()
  gender: string;
}
