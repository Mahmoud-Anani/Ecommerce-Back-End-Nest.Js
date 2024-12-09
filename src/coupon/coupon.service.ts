import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon } from './coupon.schema';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponService {
  constructor(@InjectModel(Coupon.name) private couponModule: Model<Coupon>) {}

  async create(createCouponDto: CreateCouponDto) {
    const brand = await this.couponModule.findOne({ name: createCouponDto.name });
    if (brand) {
      throw new HttpException('Coupon already exist', 400);
    }

    const newCoupon = await this.couponModule.create(createCouponDto);
    return {
      status: 200,
      message: 'Coupon created successfully',
      data: newCoupon,
    };
  }

  async findAll() {
    const coupons = await this.couponModule.find().select('-__v');
    return {
      status: 200,
      message: 'Coupons found',
      length: coupons.length,
      data: coupons,
    };
  }

  async findOne(id: string) {
    const coupon = await this.couponModule.findById(id).select('-__v');
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    return {
      status: 200,
      message: 'Coupon found',
      data: coupon,
    };
  }

  async update(id: string, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.couponModule.findById(id).select('-__v');
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    const updatedCoupon = await this.couponModule.findByIdAndUpdate(
      id,
      updateCouponDto,
      {
        new: true,
      },
    );
    return {
      status: 200,
      message: 'Coupon updated successfully',
      data: updatedCoupon,
    };
  }

  async remove(id: string): Promise<void> {
    const coupon = await this.couponModule.findById(id).select('-__v');
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    await this.couponModule.findByIdAndDelete(id);
  }
}
