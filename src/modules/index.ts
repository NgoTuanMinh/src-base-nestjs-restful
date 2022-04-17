import { AuthenticationModule } from './authentication/authentication.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';

export const MODULES = [ProductModule, UserModule, AuthenticationModule];
