import { Injectable } from '@nestjs/common';
import { CreateTexDto } from './dto/create-tex.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tex } from './tex.schema';
import { Model } from 'mongoose';

@Injectable()
export class TexService {
  constructor(@InjectModel(Tex.name) private readonly texModel: Model<Tex>) {}
  async createOrUpdate(createTexDto: CreateTexDto) {
    const tex = await this.texModel.findOne({});
    if (!tex) {
      // Create New Tex
      const newTex = await this.texModel.create(createTexDto);
      return {
        status: 200,
        message: 'Tex created successfully',
        data: newTex,
      };
    }
    // Update Tex
    const updateTex = await this.texModel
      .findOneAndUpdate({}, createTexDto, {
        new: true,
      })
      .select('-__v');
    return {
      status: 200,
      message: 'Tex Updated successfully',
      data: updateTex,
    };
  }

  async find() {
    const tex = await this.texModel.findOne({}).select('-__v');

    return {
      status: 200,
      message: 'Tex found successfully',
      data: tex,
    };
  }

  async reSet(): Promise<void> {
    await this.texModel.findOneAndUpdate({}, { texPrice: 0, shippingPrice: 0 });
  }
}
/*
tex table:
{ texPrice: 3, shippingPrice: 2 }
*/
