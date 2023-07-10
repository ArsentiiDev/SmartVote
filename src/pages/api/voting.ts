import { NextApiRequest, NextApiResponse } from "next";
import { z, ZodError } from 'zod';

import dbConnect from "@/lib/dbConnect";
import { createVoting, getVotings } from "@/models/Voting";
import { IErrorResponse, ISuccessResponse, IVoting } from "@/Types/Interfaces";

export default async function handler(req:NextApiRequest, res:NextApiResponse<ISuccessResponse<IVoting[] | IVoting | null> | IErrorResponse>) {
    const {method, body, query} = req;

    await dbConnect();
    //console.log('connection successfull');

    switch(method) {
        case 'GET': 
            try {
                const {userEmail} = query;
                const votings = await getVotings(userEmail as string);
                if (!votings) {
                    throw new Error('Votings are not found');
                } else {
                    return res.status(200).json({success: true, objects: votings})
                }
            } catch(err: any) {
                res.status(400).json({success: false, message: err.message})
            }
            break;
        case 'POST':
            try {
                const voting = await createVoting(body)
                //console.log('VOTING', voting)
                // voting = await voting.data.object
                return res.status(201).json({success: true, object:voting})
            } catch(err:any) {
                //console.log('error',err)
                res.status(400).json({success: false, message: err.message})
            }
    }
}
