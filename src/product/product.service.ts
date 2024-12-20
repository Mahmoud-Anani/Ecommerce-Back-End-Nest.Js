import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.productModel.findOne({
      title: createProductDto.title,
    });
    const category = await this.productModel.findById(
      createProductDto.category,
    );

    if (product) {
      throw new HttpException('This Product already Exist', 400);
    }

    if (!category) {
      throw new HttpException('This Category not Exist', 400);
    }

    if (createProductDto.subCategory) {
      const subCategory = await this.productModel.findById(
        createProductDto.subCategory,
      );
      if (!subCategory) {
        throw new HttpException('This Sub Category not Exist', 400);
      }
    }
    const priceAfterDiscount = createProductDto?.priceAfterDiscount || 0;
    if (createProductDto.price < priceAfterDiscount) {
      throw new HttpException(
        'Must be price After discount greater than price',
        400,
      );
    }

    const newProduct = await (
      await this.productModel.create(createProductDto)
    ).populate('category subCategory brand', '-__v');
    return {
      status: 200,
      message: 'Product created successfully',
      data: newProduct,
    };
  }

  async findAll(query: any) {
    // 1) filter
    // eslint-disable-next-line prefer-const
    let requestQuery = { ...query };
    const removeQuery = [
      'page',
      'limit',
      'sort',
      'keyword',
      'categoty',
      'fields',
    ];
    removeQuery.forEach((singelQuery) => {
      delete requestQuery[singelQuery];
    });
    requestQuery = JSON.parse(
      JSON.stringify(requestQuery).replace(
        /\b(gte|lte|lt|gt)\b/g,
        (match) => `$${match}`,
      ),
    );

    // 2) pagenation
    const page = query?.page || 1;
    const limit = query?.limit || 5;
    const skip = (page - 1) * limit;

    // 3) sorting
    // eslint-disable-next-line prefer-const
    let sort = query?.sort || 'asc';
    if (!['asc', 'desc'].includes(sort)) {
      throw new HttpException('Invalid sort', 400);
    }
    // 4) fields
    // eslint-disable-next-line prefer-const
    let fields = query?.fields || ''; // description,title
    fields = fields.split(',').join(' ');

    // 5) search
    // eslint-disable-next-line prefer-const
    let findData = { ...requestQuery };

    if (query.keyword) {
      findData.$or = [
        { title: { $regex: query.keyword } },
        { description: { $regex: query.keyword } },
      ];
    }
    if (query.category) {
      findData.category = query.category.toString();
    }

    const products = await this.productModel
      .find(findData)
      .limit(limit)
      .skip(skip)
      .sort({ title: sort })
      .select(fields);
    return {
      status: 200,
      message: 'Found Product',
      isEmpty: products.length > 0 ? 'false' : 'true',
      length: products.length,
      data: products,
    };
  }

  async findOne(id: string) {
    const product = await this.productModel
      .findById(id)
      .select('-__v')
      .populate('category subCategory brand', '-__v');
    if (!product) {
      throw new NotFoundException('Procut Not Found');
    }

    return {
      status: 200,
      message: 'Found a Product',
      data: product,
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Procut Not Found');
    }
    if (updateProductDto.category) {
      const category = await this.productModel.findById(
        updateProductDto.category,
      );
      if (!category) {
        throw new HttpException('This Category not Exist', 400);
      }
    }
    if (updateProductDto.subCategory) {
      const subCategory = await this.productModel.findById(
        updateProductDto.subCategory,
      );
      if (!subCategory) {
        throw new HttpException('This Sub Category not Exist', 400);
      }
    }

    if (product.quantity < updateProductDto.sold) {
      throw new HttpException('Thie Quantity is < sold', 400);
    }

    const price = updateProductDto?.price || product.price;
    const priceAfterDiscount =
      updateProductDto?.priceAfterDiscount || product.priceAfterDiscount;
    if (price < priceAfterDiscount) {
      throw new HttpException(
        'Must be price After discount greater than price',
        400,
      );
    }

    return {
      status: 200,
      message: 'Product Updated successfully',
      data: await this.productModel
        .findByIdAndUpdate(id, updateProductDto, {
          new: true,
        })
        .select('-__v')
        .populate('category subCategory brand', '-__v'),
    };
  }

  async remove(id: string): Promise<void> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Procut Not Found');
    }

    await this.productModel.findByIdAndDelete(id);
  }
}
