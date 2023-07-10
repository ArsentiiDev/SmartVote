import dbConnect from '@/lib/dbConnect';
import {
  createExpert,
  createExperts,
  deleteExpert,
  getExperts,
  updateExpert,
} from '@/models/Voting';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { IErrorResponse, IExpert, ISuccessResponse } from '@/Types/Interfaces';

const singleExpertSchema = z.object({
  name: z.optional(z.string()),
  email: z.optional(
    z
      .string()
      .min(1, { message: 'This field has to be filled' })
      .email('This is not valid email')
  ),
  votingId: z.string(),
  newExpertData: z.optional(
    z.object({
      name: z.string(),
      email: z
        .string()
        .min(1, { message: 'This field has to be filled' })
        .email('This is not valid email'),
    })
  ),
});

const dataExpertSchema = z.object({
  data: z.array(z.array(z.string())),
  votingId: z.string(),
  importOption: z.string(),
});

const expertSchema = z.union([singleExpertSchema, dataExpertSchema]);

function isSingleExpertSchema(
  data: any
): data is z.infer<typeof singleExpertSchema> {
  return data.newExpertData !== undefined;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ISuccessResponse<IExpert> | IErrorResponse>
) {
  const { method, body, query } = req;

  await dbConnect();

  let votingId, expertId, parsedBody;

  try {
    switch (method) {
      case 'POST':
        parsedBody = expertSchema.safeParse(body);
        if (!parsedBody.success) {
          throw parsedBody.error;
        }
        const inputData =
          body.data && Array.isArray(body.data)
            ? {
                data: body.data,
                votingId: body.votingId,
                importOption: body.importOption,
              }
            : { data: [[body.name, body.email]], votingId: body.votingId };
        const expertsPost: IExpert[] | IExpert = [];
        const result:any = await createExperts(inputData);
        if (result.success) {
          expertsPost.push(...result.experts);
          //console.log('CREATE EXPERTS', result.experts)
          return res.status(200).json({ success: true, objects: expertsPost });
        } else {
          console.error('Failed to create experts', result.error);
          return res.status(400).json({ success: false, error: result.error });
        }

      case 'DELETE':
        ({ votingId, expertId } = query);
        if (typeof votingId !== 'string' || typeof expertId !== 'string') {
          throw new Error('Invalid votingId or expertId');
        }
        const deleteResult = await deleteExpert(votingId, expertId);
        if (!deleteResult.success) {
          throw new Error(deleteResult.error);
        }
        return res.status(200).json({ success: true });
      case 'PUT':
        parsedBody = expertSchema.safeParse(body);
        if (!parsedBody.success) {
          throw parsedBody.error;
        }
        expertId = query.expertId;
        if (typeof expertId !== 'string') {
          throw new Error('Invalid expertId');
        }
        if (isSingleExpertSchema(parsedBody.data)) {
          const { newExpertData, votingId: votingIdInput } = parsedBody.data;
          if (!newExpertData) {
            throw new Error('Invalid expertData');
          }
          const updatedExpert = await updateExpert(
            expertId,
            newExpertData,
            votingIdInput
          );
          res.status(200).json({ success: true, object: updatedExpert });
        } else {
          res
            .status(400)
            .json({ success: false, message: 'Couldnt update an expert' });
        }
      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
