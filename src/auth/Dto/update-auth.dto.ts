import { PartialType } from '@nestjs/mapped-types';
import { SignUpDto } from './auth.dto'

export class UpdateUserDto extends PartialType(SignUpDto) {}
