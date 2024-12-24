import { Module } from '@nestjs/common';
import { TaxService } from './tax.service';
import { TaxController } from './tax.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tax, taxSchema } from './tax.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tax.name,
        schema: taxSchema,
      },
    ]),
  ],
  controllers: [TaxController],
  providers: [TaxService],
})
export class TaxModule {}
