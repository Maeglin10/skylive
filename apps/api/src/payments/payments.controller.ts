import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PaymentsService } from './payments.service';
import { TipDto } from './dto/tip.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('subscribe/:creatorId')
  subscribe(@CurrentUser() user: { id: string }, @Param('creatorId') creatorId: string) {
    return this.paymentsService.createSubscriptionCheckout(user.id, creatorId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('purchase/content/:contentId')
  purchaseContent(@CurrentUser() user: { id: string }, @Param('contentId') contentId: string) {
    return this.paymentsService.createContentPurchase(user.id, contentId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('purchase/live/:liveSessionId')
  purchaseLive(@CurrentUser() user: { id: string }, @Param('liveSessionId') liveSessionId: string) {
    return this.paymentsService.createLivePurchase(user.id, liveSessionId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('tip/:creatorId')
  tip(
    @CurrentUser() user: { id: string },
    @Param('creatorId') creatorId: string,
    @Body() dto: TipDto,
  ) {
    return this.paymentsService.createTip(user.id, creatorId, dto.amount, dto.message);
  }

  @Post('webhook')
  @SkipThrottle()
  webhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: Request & { rawBody?: Buffer },
  ) {
    if (!signature) {
      throw new BadRequestException('Missing Stripe signature');
    }
    const rawBody = req.rawBody || Buffer.from('');
    return this.paymentsService.handleWebhook(signature, rawBody);
  }

  @UseGuards(JwtAuthGuard)
  @Get('portal')
  portal(@CurrentUser() user: { id: string }) {
    return this.paymentsService.createPortalSession(user.id);
  }
}
