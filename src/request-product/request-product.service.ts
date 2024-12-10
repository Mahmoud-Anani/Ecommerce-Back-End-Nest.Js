import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateRequestProductDto } from './dto/update-request-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RequestProduct } from './request-product.schema';
import { Model } from 'mongoose';
import { CreateRequestProductDto } from './dto/create-request-product.dto';

interface NewUpdateRequestProductDto extends UpdateRequestProductDto {
  user: string;
}
interface NewCreateRequestProductDto extends CreateRequestProductDto {
  user: string;
}

@Injectable()
export class RequestProductService {
  constructor(
    @InjectModel(RequestProduct.name)
    private readonly requestProductModel: Model<RequestProduct>,
  ) {}
  async create(createRequestProductDto: NewCreateRequestProductDto) {
    const reqProduct = await this.requestProductModel.findOne({
      titleNeed: createRequestProductDto.titleNeed,
      user: createRequestProductDto.user,
    });
    if (reqProduct) {
      throw new HttpException('Request Product already exist', 400);
    }

    const newRequestProduct = await (
      await this.requestProductModel.create(createRequestProductDto)
    ).populate('user', '-password -__v -role');

    return {
      status: 200,
      message: 'Request Product created successfully',
      data: newRequestProduct,
    };
  }

  async findAll() {
    const requestProduct = await this.requestProductModel
      .find()
      .select('-__v')
      .populate('user', '-password -__v -role');
    return {
      status: 200,
      message: 'Request Product found',
      length: requestProduct.length,
      data: requestProduct,
    };
  }

  async findOne(id: string, req: any) {
    const requestProduct = await this.requestProductModel
      .findById(id)
      .select('-__v')
      .populate('user', '-password -__v -role');
    if (!requestProduct) {
      throw new NotFoundException('Not Found Request Product');
    }
    if (
      req.user._id.toString() !== requestProduct.user._id.toString() &&
      req.user.role.toLowerCase() !== 'admin'
    ) {
      throw new UnauthorizedException();
    }

    return {
      status: 200,
      message: 'Request Product found',
      data: requestProduct,
    };
  }

  async update(
    id: string,
    updateRequestProductDto: NewUpdateRequestProductDto,
  ) {
    const requestProduct = await this.requestProductModel
      .findById(id)
      .select('-__v')
      .populate('user', '-password -__v -role');
    if (!requestProduct) {
      throw new NotFoundException('Not Found Request Product');
    }
    if (
      updateRequestProductDto.user.toString() !==
      requestProduct.user._id.toString()
    ) {
      throw new UnauthorizedException();
    }

    const updatedRequestProduct =
      await this.requestProductModel.findByIdAndUpdate(
        id,
        updateRequestProductDto,
        { new: true },
      );

    return {
      status: 200,
      message: 'Request Product updated successfully',
      data: updatedRequestProduct,
    };
  }

  async remove(requestProduct_id: string, user_id: string):Promise<void> {
    const requestProduct = await this.requestProductModel
      .findById(requestProduct_id)
      .select('-__v')
      .populate('user', '-password -__v -role');
    if (!requestProduct) {
      throw new HttpException('Request Product already deleted', 400);
    }
    if (user_id.toString() !== requestProduct.user._id.toString()) {
      throw new UnauthorizedException();
    }

    await this.requestProductModel.findByIdAndDelete(requestProduct_id);
  }
}
