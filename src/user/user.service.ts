import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
// import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
const saltOrRounds = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    // private jwtService: JwtService,
  ) {}
  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ status: number; message: string; data: User }> {
    // bussiness logic
    // name, email, password
    const ifUserExist = await this.userModel.findOne({
      email: createUserDto.email,
    });
    // If User Exist
    if (ifUserExist) {
      throw new HttpException('User already exist', 400);
    }
    // Create New User
    const password = await bcrypt.hash(createUserDto.password, saltOrRounds);
    const user = {
      password,
      role: createUserDto.role ?? 'user',
      active: true,
    };
    return {
      status: 200,
      message: 'User created successfully',
      data: await this.userModel.create({ ...user, ...createUserDto }),
    };
  }

  // Pagination
  findAll() {
    return this.userModel.find().select('-password -__v');
  }

  async findOne(id: string): Promise<{ status: number; data: User }> {
    const user = await this.userModel.findById(id).select('-password -__v');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      status: 200,
      data: user,
    };
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{
    status: number;
    message: string;
    data: User;
  }> {
    const userExist = await this.userModel
      .findById(id)
      .select('-password -__v');
    if (!userExist) {
      throw new NotFoundException('User not found');
    }
    let user = {
      ...updateUserDto,
    };
    // update User
    if (updateUserDto.password) {
      const password = await bcrypt.hash(updateUserDto.password, saltOrRounds);
      user = {
        ...user,
        password,
      };
    }
    return {
      status: 200,
      message: 'User updated successfully',
      data: await this.userModel.findByIdAndUpdate(id, user, {
        new: true,
      }),
    };
  }

  async remove(id: string): Promise<{ status: number; message: string }> {
    const user = await this.userModel.findById(id).select('-password -__v');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userModel.findByIdAndDelete(id);
    return {
      status: 200,
      message: 'User deleted successfully',
    };
  }
}
