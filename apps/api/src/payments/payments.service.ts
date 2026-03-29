import { Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { NotificationsGateway } from '../events/notifications.gateway';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2024-06-20',
    });
  }

  async createSubscriptionCheckout(userId: string, creatorId: string) {
    const creator = await this.prisma.creator.findUnique({ where: { id: creatorId } });
    if (!creator || !creator.subscriptionPrice) {
      throw new NotFoundException('Creator or subscription price not found');
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: creator.subscriptionPrice,
            product_data: { name: `Subscription to ${creator.username}` },
            recurring: { interval: 'month' },
          },
        },
      ],
      metadata: {
        creatorId,
        userId,
        type: 'subscription',
      },
      subscription_data: {
        metadata: { creatorId, userId },
      },
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/billing?success=1`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/billing?canceled=1`,
    });

    return { url: session.url };
  }

  async createContentPurchase(userId: string, contentId: string) {
    const content = await this.prisma.content.findUnique({ where: { id: contentId } });
    if (!content || !content.price) throw new NotFoundException('Content not purchasable');

    const intent = await this.stripe.paymentIntents.create({
      amount: content.price,
      currency: 'eur',
      metadata: {
        type: 'content',
        contentId,
        userId,
      },
    });

    return { clientSecret: intent.client_secret, paymentIntentId: intent.id };
  }

  async createLivePurchase(userId: string, liveSessionId: string) {
    const liveSession = await this.prisma.liveSession.findUnique({ where: { id: liveSessionId } });
    if (!liveSession) throw new NotFoundException('Live session not found');
    if (!liveSession.price) throw new NotFoundException('Live session not purchasable');

    const intent = await this.stripe.paymentIntents.create({
      amount: liveSession.price,
      currency: 'eur',
      metadata: {
        type: 'live',
        liveSessionId,
        userId,
      },
    });

    return { clientSecret: intent.client_secret, paymentIntentId: intent.id };
  }

  async createTip(userId: string, creatorId: string, amount: number, message?: string) {
    const intent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      metadata: {
        type: 'tip',
        creatorId,
        userId,
        message: message ?? '',
      },
    });

    return { clientSecret: intent.client_secret, paymentIntentId: intent.id };
  }

  async handleWebhook(signature: string | string[] | undefined, rawBody: Buffer) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET || '';
    if (!secret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
    }
    const event = this.stripe.webhooks.constructEvent(rawBody, signature as string, secret);

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const intent = event.data.object as Stripe.PaymentIntent;
        await this.handlePaymentIntentSucceeded(intent);
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await this.handleSubscriptionUpdate(subscription);
        break;
      }
      default:
        break;
    }

    return { received: true };
  }

  async createPortalSession(userId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { userId, stripeSubscriptionId: { not: null } },
      orderBy: { updatedAt: 'desc' },
      select: { stripeSubscriptionId: true },
    });

    if (!subscription?.stripeSubscriptionId) {
      throw new NotFoundException('No active subscription found');
    }

    const stripeSub = await this.stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
    const customerId =
      typeof stripeSub.customer === 'string' ? stripeSub.customer : stripeSub.customer?.id;

    if (!customerId) {
      throw new NotFoundException('Stripe customer not found');
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/billing`,
    });

    return { url: session.url };
  }

  private async handlePaymentIntentSucceeded(intent: Stripe.PaymentIntent) {
    const metadata = intent.metadata || {};

    if (metadata.type === 'content' && metadata.contentId) {
      try {
        await this.prisma.purchase.create({
          data: {
            userId: metadata.userId,
            contentId: metadata.contentId,
            amount: intent.amount,
            stripePaymentIntentId: intent.id,
          },
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          return;
        }
        throw error;
      }
      return;
    }

    if (metadata.type === 'live' && metadata.liveSessionId) {
      try {
        await this.prisma.purchase.create({
          data: {
            userId: metadata.userId,
            liveSessionId: metadata.liveSessionId,
            amount: intent.amount,
            stripePaymentIntentId: intent.id,
          },
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          return;
        }
        throw error;
      }
      return;
    }

    if (metadata.type === 'tip' && metadata.creatorId) {
      try {
        await this.prisma.tip.create({
          data: {
            userId: metadata.userId,
            creatorId: metadata.creatorId,
            liveSessionId: metadata.liveSessionId || null,
            amount: intent.amount,
            message: metadata.message || null,
            stripePaymentIntentId: intent.id,
          },
        });

        const tipAmount = (intent.amount / 100).toFixed(2);
        this.notificationsGateway.notifyUser(metadata.creatorId, {
          type: 'new_tip',
          message: `Vous avez reçu un tip de ${tipAmount}€`,
          data: {
            tipAmount,
            message: metadata.message || null,
          },
          createdAt: new Date().toISOString(),
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          return;
        }
        throw error;
      }
    }
  }

  private async handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    const creatorId = subscription.metadata?.creatorId;
    const userId = subscription.metadata?.userId;

    if (!creatorId || !userId) return;

    const result = await this.prisma.subscription.upsert({
      where: { userId_creatorId: { userId, creatorId } },
      update: {
        status: subscription.status.toUpperCase() as any,
        stripeSubscriptionId: subscription.id,
      },
      create: {
        userId,
        creatorId,
        status: subscription.status.toUpperCase() as any,
        stripeSubscriptionId: subscription.id,
      },
    });

    if (result.status === 'ACTIVE') {
      this.notificationsGateway.notifyUser(creatorId, {
        type: 'new_subscriber',
        message: 'Vous avez un nouveau subscriber',
        data: {
          subscriberId: userId,
        },
        createdAt: new Date().toISOString(),
      });
    }
  }
}
