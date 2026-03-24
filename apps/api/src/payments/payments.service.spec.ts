import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prisma = {
      creator: {
        findUnique: jest.fn(),
      },
      content: {
        findUnique: jest.fn(),
      },
      liveSession: {
        findUnique: jest.fn(),
      },
      subscription: {
        findFirst: jest.fn(),
        upsert: jest.fn(),
      },
      purchase: {
        create: jest.fn(),
      },
      tip: {
        create: jest.fn(),
      },
    } as any;

    service = new PaymentsService(prisma);
    (service as any).stripe = {
      paymentIntents: {
        create: jest.fn().mockResolvedValue({
          client_secret: 'secret',
          id: 'pi_123',
        }),
      },
      checkout: { sessions: { create: jest.fn().mockResolvedValue({ url: 'url' }) } },
      billingPortal: { sessions: { create: jest.fn().mockResolvedValue({ url: 'url' }) } },
      subscriptions: { retrieve: jest.fn().mockResolvedValue({ customer: 'cus_123' }) },
      webhooks: { constructEvent: jest.fn() },
    };
  });

  it('creates a content purchase intent', async () => {
    prisma.content.findUnique.mockResolvedValue({ id: 'content-1', price: 500 } as any);

    const result = await service.createContentPurchase('user-1', 'content-1');

    expect(result.clientSecret).toBe('secret');
    expect((service as any).stripe.paymentIntents.create).toHaveBeenCalled();
  });

  it('handles webhook payment_intent.succeeded', async () => {
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
    (service as any).stripe.webhooks.constructEvent.mockReturnValue({
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_123',
          amount: 500,
          metadata: { type: 'content', contentId: 'content-1', userId: 'user-1' },
        },
      },
    });

    await service.handleWebhook('sig', Buffer.from('payload'));

    expect(prisma.purchase.create).toHaveBeenCalled();
  });

  it('handles webhook tip creation', async () => {
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
    (service as any).stripe.webhooks.constructEvent.mockReturnValue({
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_tip',
          amount: 300,
          metadata: {
            type: 'tip',
            creatorId: 'creator-1',
            userId: 'user-1',
            message: 'Thanks!',
          },
        },
      },
    });

    await service.handleWebhook('sig', Buffer.from('payload'));

    expect(prisma.tip.create).toHaveBeenCalled();
  });

  it('handles webhook subscription updates', async () => {
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
    (service as any).stripe.webhooks.constructEvent.mockReturnValue({
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: 'sub_123',
          status: 'active',
          metadata: { creatorId: 'creator-1', userId: 'user-1' },
        },
      },
    });

    await service.handleWebhook('sig', Buffer.from('payload'));

    expect(prisma.subscription.upsert).toHaveBeenCalled();
  });
});
