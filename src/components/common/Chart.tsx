import { IVote } from '@/Types/Interfaces';
import { RootState } from '@/store/store';
import React, { PureComponent, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }: {active: any, payload: any, label: any}) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-background px-6 py-2 border border-main-secondary flex flex-col items-center">
        <p className="label my-2 uppercase">{`${label}`}</p>
        <p className="intro">Placements</p>
        <div className="grid grid-cols-2 grid-rows-3 gap-y-2 gap-x-6">
          <p className="desc">1st place:</p>
          <p className="desc">{`${payload[0].value}`}</p>
          
          <p className="desc">2nd place:</p>
          <p className="desc">{`${payload[1].value}`}</p>
          
          <p className="desc">3rd place:</p>
          <p className="desc">{`${payload[2].value}`}</p>
        </div>
      </div>

    );
  }

  return null;
};

interface ChartData {
  name: string,
  1: number,
  2: number,
  3: number
}

export default function Chart ({}) {
  const activeVoting = useSelector((state: RootState) => state.ui.activeVotingIndex);
  const assessments = useSelector((state:RootState) => state.data.votings.find(voting => voting._id === activeVoting)?.assessments);

  function convertAssessmentsToVotings(assessments: Record<string, string[]>): ChartData[] {
    const objectVotings: Map<string, number[]> = new Map();
    
    for (const expertId in assessments) {
        const objectList = assessments[expertId];
        for (let i = 0; i < objectList.length; i++) {
            const object = objectList[i];
            if (!objectVotings.has(object)) {
                // Initialize the voting array if the object is not already in the map
                objectVotings.set(object, new Array(objectList.length).fill(0));
            }
            // Increment the voting count for this object at this position
            const votingArray = objectVotings.get(object);
            if (votingArray) {
                votingArray[i]++;
            }
        }
    }
    // Convert the map to an array of objects
    const objectVotingsArray = [];
    for (const [object, votings] of objectVotings) {
        objectVotingsArray.push({
            name: object,
            1: votings[0] || 0,
            2: votings[1] || 0,
            3: votings[2] || 0
        });
    }
    return objectVotingsArray;
}


    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={assessments ? convertAssessmentsToVotings(assessments): null}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="2 2" />
          <Legend />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />}/>
          <Bar dataKey="1" fill="#8884d8" />
          <Bar dataKey="2" fill="#82ca9d" />
          <Bar dataKey="3" fill="#CAC782" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
