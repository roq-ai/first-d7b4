import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { learnedWordValidationSchema } from 'validationSchema/learned-words';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.learned_word
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getLearnedWordById();
    case 'PUT':
      return updateLearnedWordById();
    case 'DELETE':
      return deleteLearnedWordById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getLearnedWordById() {
    const data = await prisma.learned_word.findFirst(convertQueryToPrismaUtil(req.query, 'learned_word'));
    return res.status(200).json(data);
  }

  async function updateLearnedWordById() {
    await learnedWordValidationSchema.validate(req.body);
    const data = await prisma.learned_word.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteLearnedWordById() {
    const data = await prisma.learned_word.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
