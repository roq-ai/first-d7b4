import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { flashCardValidationSchema } from 'validationSchema/flash-cards';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getFlashCards();
    case 'POST':
      return createFlashCard();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getFlashCards() {
    const data = await prisma.flash_card
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'flash_card'));
    return res.status(200).json(data);
  }

  async function createFlashCard() {
    await flashCardValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.learned_word?.length > 0) {
      const create_learned_word = body.learned_word;
      body.learned_word = {
        create: create_learned_word,
      };
    } else {
      delete body.learned_word;
    }
    const data = await prisma.flash_card.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
