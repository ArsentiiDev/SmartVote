import { IErrorResponse, ISuccessResponse } from '@/Types/Interfaces';
import Voting, { addVoteFromExpert } from '../../models/Voting';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<IErrorResponse | ISuccessResponse<any>>) {
    if (req.method === 'POST') {
        const { scores, votingId } = req.body;
        //console.log('votes',scores, votingId)
        try {
            await addVoteFromExpert(votingId, scores);
            res.status(200).json({ success: true, message: 'Vote added successfully' });
        } catch(err: any) {
            res.status(500).json({ success: false, message: err.message });
        }
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` })
    }
}
