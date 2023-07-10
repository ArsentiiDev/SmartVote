import { IErrorResponse, ISuccessResponse } from '@/Types/Interfaces';
import Voting, { addAssessment } from '../../models/Voting';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<IErrorResponse | ISuccessResponse<string[] | null>>) {
      if (req.method === 'POST') {
        const { firstPlace, secondPlace, thirdPlace, expertId, votingId } = req.body;
        //console.log('SUBMITFORM',req.body)
        try {
          const newAssessment = await addAssessment(votingId, expertId, [firstPlace, secondPlace, thirdPlace]);
          //console.log('submitForm',newAssessment)
          res.status(200).json({success:true, object:  newAssessment});
        } catch (error:any) {
          console.error('Failed to submit vote:', error);
          if (error.message === "Expert has already voted") {
            res.status(400).json({success:false, message: 'You have already voted.' });
          } else {
            res.status(500).json({success:false, message: 'Failed to submit vote.' });
          }
        }
      } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).json({success:false, message: `Method ${req.method} Not Allowed` })
      }
}
