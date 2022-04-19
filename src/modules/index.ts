import { AuctionModule } from './auction/auction.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { PaymentModule } from './payment/payment.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';

export const MODULES = [ProductModule, UserModule, AuthenticationModule, PaymentModule, AuctionModule];
