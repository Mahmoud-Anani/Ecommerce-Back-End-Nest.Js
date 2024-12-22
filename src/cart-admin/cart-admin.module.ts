import { Module } from '@nestjs/common';
import { CartAdminResolver } from './cart-admin.resolver';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

import { MongooseModule } from '@nestjs/mongoose';
import { CartAdminService } from './cart-admin.service';
import { Cart, cartSchema } from './cart-admin.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Cart.name,
        schema: cartSchema,
      },
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  providers: [CartAdminResolver, CartAdminService],
})
export class CartAdminModule {}
