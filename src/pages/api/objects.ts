import { z } from 'zod';

import dbConnect from "@/lib/dbConnect";
import { createObjects, deleteObject, getObjects, updateObject } from "@/models/Voting";
import { NextApiRequest, NextApiResponse } from "next";
import { IErrorResponse, IObject, ISuccessResponse } from '@/Types/Interfaces';


const singleObjectSchema = z.object({
  title: z.optional(z.string()),
  description: z.optional(z.string()),
  votingId: z.string(),
  newObjectData: z.optional(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ),
});

const dataObjectSchema = z.object({
  data: z.array(z.array(z.string())),
  votingId: z.string(),
  importOption: z.string()
});

const objectSchema = z.union([
  singleObjectSchema,
  dataObjectSchema
]);

function isSingleObjectSchema(data: any): data is z.infer<typeof singleObjectSchema> {
  return data.newObjectData !== undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ISuccessResponse<IObject> | IErrorResponse>) {
  const { method, body, query } = req;

  await dbConnect();
  
  let votingId, objectId, parsedBody;

  try {
    switch(method) {
      case 'GET':
        //console.log('query',query)
        votingId = query.votingId;
        if (typeof votingId === 'string') {
          //console.log('votingId', votingId)
          const objects = await getObjects(votingId);
          return res.status(200).json({ success: true, objects });
        } else {
          return res.status(400).json({success:false, message: 'Faild to get ovjects'})
        }
        case 'POST':
          parsedBody = objectSchema.safeParse(body);
          if (!parsedBody.success) {
              throw parsedBody.error;
          }
          const inputData = body.data &&  Array.isArray(body.data) ? {data: body.data, votingId: body.votingId, importOption: body.importOption} : {data: [[body.title, body.description]], votingId: body.votingId};
          //console.log('inputData', body)
          const objects:IObject[] = [];
            const object:any = await createObjects(inputData as any);
            objects.push(...object);
          return res.status(200).json({ success: true, objects: objects });
      case 'DELETE':
        ({ votingId, objectId } = query);
        if (typeof votingId !== 'string' || typeof objectId !== 'string') {
            throw new Error('Invalid votingId or objectId');
          }
          const deleteResult = await deleteObject(votingId, objectId);
        if (!deleteResult.success) {
            let errorMessage = 'Unknown error';
            if (deleteResult.error) {
                errorMessage = typeof deleteResult.error === 'string' 
                ? deleteResult.error 
                : 'Non-string error message';
            }
            throw new Error(errorMessage);
        }
        return res.status(200).json({ success: true });
      case 'PUT':
        //console.log("body", body)
        parsedBody = objectSchema.safeParse(body);
        if (!parsedBody.success) {
          throw parsedBody.error;
        }
        objectId = query.objectId;
        if (typeof objectId !== 'string') {
            throw new Error('Invalid objectId')
        }
        if (isSingleObjectSchema(parsedBody.data)) {
          const { newObjectData, votingId: votingIdInput } = parsedBody.data;
          if (!newObjectData) {
            throw new Error('Invalid objectData')
          }
          const updatedObject = await updateObject(objectId, newObjectData, votingIdInput);
          return res.status(200).json({ success: true, object: updatedObject });
        } else {
          throw new Error('Invalid data')
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
