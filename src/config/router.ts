import { Routes } from 'nest-router';
import { UserModule } from 'src/modules/authentication/user.module';
import { ProductModule } from 'src/modules/product/product.module';

export const ROUTERS: Routes = [
  {
    path: '/api/v1',
    children: [
      // {
      //   path: '/authentication',
      //   module: AuthenticationModule,
      // },
      {
        path: '/products',
        module: ProductModule,
      },
      {
        path: '/authentication',
        module: UserModule,
      },
    ],
  },
];
