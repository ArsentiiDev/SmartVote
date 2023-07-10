import { z } from 'zod';

import dbConnect from "@/lib/dbConnect";
import { createHeuristic, deleteHeuristic, getHeuristics, updateHeuristic } from "@/models/Voting";
import { NextApiRequest, NextApiResponse } from "next";
import { IErrorResponse, IHeuristic, ISuccessResponse } from '@/Types/Interfaces';


const heuristicSchema = z.object({
  sum: z.optional(z.number()),
  placing: z.optional(z.number().nullable()),
  votingId: z.string(),
  newHeuristicData: z.optional(z.object({
    sum: z.number(),
    placing: z.optional(z.number().nullable()),
  })),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<ISuccessResponse<IHeuristic> | IErrorResponse>) {
  const { method, body, query } = req;

  await dbConnect();
  
  let votingId, heuristicId, parsedBody;

  try {
    switch(method) {
      case 'GET':
        votingId = body.votingId;
        const heuristics = await getHeuristics(votingId);
        return res.status(200).json({ success: true, object: heuristics });
      case 'POST':
        parsedBody = heuristicSchema.safeParse(body);
        if (!parsedBody.success) {
          throw parsedBody.error;
        }
        //console.log('parsedBody',parsedBody.data)
        const { sum, placing} = parsedBody.data ?? {};
        votingId = parsedBody.data.votingId;
        //console.log('api-heuristic', { sum, placing, votingId });
        const heuristic = await createHeuristic({ sum, placing, votingId });        
        return res.status(200).json({ success: true, object: heuristic });
      case 'DELETE':
        ({ votingId, heuristicId } = query);
        if (typeof votingId !== 'string' || typeof heuristicId !== 'string') {
            throw new Error('Invalid votingId or heuristicId');
          }
          const deleteResult = await deleteHeuristic(votingId, heuristicId);
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
        parsedBody = heuristicSchema.safeParse(body);
        if (!parsedBody.success) {
          throw parsedBody.error;
        }
        heuristicId = query.heuristicId;
        if (typeof heuristicId !== 'string') {
            throw new Error('Invalid heuristicId')
        }
        const { newHeuristicData, votingId: votingIdInput } = parsedBody.data;
        if (!newHeuristicData) {
          throw new Error('Invalid heuristicData')
        }
        if(newHeuristicData.placing === undefined) newHeuristicData.placing = null;
        const updatedHeuristic = await updateHeuristic(heuristicId, newHeuristicData, votingIdInput);        
        return res.status(200).json({ success: true, object: updatedHeuristic });
      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
