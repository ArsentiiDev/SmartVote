import { IErrorResponse, ISuccessResponse } from '@/Types/Interfaces';
import Voting, { addVoteFromExpert, getVotingById, setResults } from '../../models/Voting';
import { NextApiRequest, NextApiResponse } from 'next';
import { Expert, Heuristic, VotingObject, Vote } from '@/util/vote_classes';

export default async function handler(req: NextApiRequest, res: NextApiResponse<IErrorResponse | ISuccessResponse<any>>) {
    if (req.method === 'POST') {
        const { criteria, method, votingId } = req.body;
        try {
            const currentVoting = await getVotingById(votingId);
            if (currentVoting) {
                //console.log('response',currentVoting)
                const voteInstance = new Vote(currentVoting._id,  criteria, method)
        
                for (const object of currentVoting.objects) {
                    const newObject = new VotingObject(object._id,object.title,object.description)
                    voteInstance.addObject(newObject)
                }
    
                for (const expert of currentVoting.experts) {
                    const newExpert = new Expert(expert._id, expert.name, expert.email, expert.status)
                    voteInstance.addExpert(newExpert);
                }
    
                for (const heuristic of currentVoting.heuristics) {
                    const newHeuristic = new Heuristic(heuristic._id, heuristic.sum, heuristic.placing)
                    voteInstance.addHeuristic(newHeuristic)
                }
                voteInstance.setAssessments(currentVoting.assessments!)
                voteInstance.setObjectPlacements(currentVoting!.votes)
                const result = voteInstance.vote();
                await setResults(result, votingId)
                //console.log('results/api',result)
                res.status(200).json({success:true, objects: result})
            }
        } catch(err: any) {
            //console.log(err)
            if (err.message === 'Failed to set results') {
                res.status(500).json({ success: false, message: 'Failed to save results.' });
              } else {
                res.status(500).json({ success: false, message: err.message });
              }
        }
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` })
    }
}
