import { Routes } from 'nest-router';
import { AuctionModule } from 'src/modules/auction/auction.module';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { PaymentModule } from 'src/modules/payment/payment.module';
import { ProductModule } from 'src/modules/product/product.module';
import { UserModule } from 'src/modules/user/user.module';

export const ROUTERS: Routes = [
  {
    path: '/api/v1',
    children: [
      {
        path: '/product',
        module: ProductModule,
      },
      {
        path: '/authentication',
        module: AuthenticationModule,
      },
      {
        path: '/user',
        module: UserModule,
      },
      {
        path: '/payment',
        module: PaymentModule,
      },
      {
        path: '/auction',
        module: AuctionModule,
      },
    ],
  },
];
