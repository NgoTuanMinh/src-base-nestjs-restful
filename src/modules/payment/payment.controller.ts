import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentAccount } from 'src/decorators/current-account.decorator';
import { Balence } from 'src/entities/balence.entity';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import { PayInput, UpdateBalenceInput } from './dto/payment.input';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
  ) {}
  @Post('/update-balence')
  @UseGuards(JwtAuthenticationGuard)
  async updateBalence(
    @Body() data: UpdateBalenceInput,
    @CurrentAccount() account: any,
  ): Promise<Balence> {
    return await this.paymentService.updateBalence(data, account?.id);
  }

  @Post('/pay-product')
  @UseGuards(JwtAuthenticationGuard)
  async handlePay(
    @Body() data: PayInput,
    @CurrentAccount() account: any,
  ): Promise<Balence> {
    return await this.paymentService.handlePay(data, account?.id);
  }

}
