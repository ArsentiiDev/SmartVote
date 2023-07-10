import {
  IExpert,
  IObject,
  IVoting,
  IHeuristic,
  IVote,
  IResult,
} from '@/Types/Interfaces';
import mongoose from 'mongoose';
import { TEXT_CONSTANTS, IMPORT_OPTIONS } from '@/Constants/constants';
import ExpertSchema from './Experts';
import ObjectSchema from './Objects';
import User from './User';

const HeuristicSchema = new mongoose.Schema({
  sum: Number,
  placing: Number,
});

const ResultsSchema = new mongoose.Schema({
  minSum: Number,
  criteria: Number,
  set: [String],
});

const VotingSchema = new mongoose.Schema(
  {
    title: String,
    status: String,
    objects: [ObjectSchema],
    experts: [ExpertSchema],
    heuristics: [HeuristicSchema],
    criteria: String,
    method: String,
    results: [ResultsSchema],
    assessments: {
      type: Map,
      of: [String],
      default: {},
    },
    votes: [
      {
        name: String,
        scores: [Number],
      },
    ],
    userId: String
  },
  {
    minimize: false,
  }
);

const Voting = mongoose.models.Voting || mongoose.model('Voting', VotingSchema);

export default Voting;

export const getVotingById = async (
  votingId: string
): Promise<IVoting | null> => {
  try {
    const voting = await Voting.findById(votingId);
    if (!voting) {
      throw new Error('Voting not found');
    }
    return voting;
  } catch (err: any) {
    console.error(`Failed to get a voting: ${err.message}`);
    return null;
  }
};

export const getVotings = async (userEmail: string): Promise<IVoting[] | null> => {
  try {
    const user = await User.findOne({email: userEmail})
    if (user) {
      return await Voting.find({userId: user._id});
    } else {
      return null
    }
  } catch (err) {
    console.error(`Failed to get votings: ${err}`);
    return null;
  }
};

export const createVoting = async (
  values: Record<string, any>
): Promise<any | null> => {
  try {
    const { title, status, userEmail } = values;
    const user = await User.findOne({email: userEmail})
    if (!user) {
      throw new Error('User not found')
    }
    return new Voting({
      title,
      status,
      objects: [],
      experts: [],
      heuristics: [],
      criteria: '',
      method: '',
      results: null,
      assessments: new Map(),
      votes: [],
      userId: user._id
    })
      .save()
      .then((voting: Record<string, any>) => voting.toObject());
  } catch (err) {
    console.error('Failed to create a voting', err);
    return null;
  }
};

export const getObjects = async (votingId: string) => {
  try {
    const voting = await Voting.findById(votingId);
    if (!voting) {
      throw new Error('Voting not found');
    }
    return voting.objects;
  } catch (err) {
    console.error(`Failed to get objects: ${err}`);
    return null;
  }
};

export const createObjects = async (values: {
  data: string[][];
  votingId: string;
  importOption: string;
}) => {
  try {
    const { data, votingId, importOption = IMPORT_OPTIONS.MERGE } = values;
    const voting = await Voting.findById(votingId);
    if (!voting) {
      throw new Error('Voting not found');
    }
    const createdVotings = [];

    switch (importOption) {
      case IMPORT_OPTIONS.MERGE:
        for (const object of data) {
          const title = object[0],
            description = object[1];
          const newObject = { title, description };
          voting.objects.push(newObject);
          const newVote = { name: newObject.title, scores: [0, 0, 0] };
          voting.votes.push(newVote);
        }
        break;
      case IMPORT_OPTIONS.REPLACE:
        const newObjects = data.map((object) => ({
          title: object[0],
          description: object[1],
        }));
        const newVotes = newObjects.map((obj) => ({
          name: obj.title,
          scores: [0, 0, 0],
        }));
        await Voting.updateOne(
          { _id: votingId },
          { $set: { objects: newObjects, votes: newVotes } }
        );
        break;
      default:
        throw new Error('Invalid importOption');
    }
    const updatedVoting = await voting.save();
    for (const object of updatedVoting.objects) {
      createdVotings.push(object);
    }
    return createdVotings;
  } catch (err) {
    console.error('Failed to create an object', err);
    return null;
  }
};

export const deleteObject = async (votingId: string, objectId: string) => {
  try {
    const voting = await Voting.findOne({
      _id: votingId,
      'objects._id': objectId,
    });
    if (!voting) {
      throw new Error('Voting or Object not found');
    }
    const objectTitle = voting.objects.find(
      (object: IObject) => object._id.toString() === objectId
    ).title;
    await Voting.updateOne(
      { _id: votingId },
      {
        $pull: {
          objects: { _id: objectId },
          votes: { name: objectTitle },
        },
      }
    );
    if (voting.assessments) {
      for (const [key, value] of voting.assessments.entries()) {
        const index = value.indexOf(objectTitle);
        if (index !== -1) {
          value.splice(index, 1);
          voting.assessments[key] = value;
        }
      }
    }
    await voting.save();
    return { success: true };
  } catch (err) {
    console.error(`Failed to delete object: ${err}`);
    return { success: false, error: err };
  }
};

export async function updateObject(
  objectId: string,
  newObjectData: { title: string; description: string },
  votingId: string
) {
  try {
    const voting: any = await Voting.findById(votingId);
    if (!voting) {
      throw new Error('Voting not found');
    }
    const objectIndex = voting.objects.findIndex(
      (object: IObject) => object._id.toString() === objectId
    );
    const objectToUpdate = voting.objects[objectIndex];
    if (objectIndex === -1) {
      throw new Error('Object not found');
    }
    if (voting.assessments) {
      for (const [key, value] of voting.assessments.entries()) {
        const index = value.indexOf(objectToUpdate.title);
        if (index !== -1) {
          value[index] = newObjectData.title;
          voting.assessments.set(key, value);
        }
      }
    }
    const voteIndex = voting.votes.findIndex(
      (vote: IVote) => vote.name === voting.objects[objectIndex].title
    );
    if (voteIndex > -1) {
      voting.votes[voteIndex].name = newObjectData.title;
    }
    Object.assign(voting.objects[objectIndex], newObjectData);
    const updatedVoting = await voting.save();
    return updatedVoting.objects[objectIndex];
  } catch (err) {
    console.error('Failed to update an object', err);
    return null;
  }
}

export const createExperts = async (values: {
  data: string[][];
  votingId: string;
  importOption: string;
}): Promise<
  { success: boolean; experts: IExpert[] } | { success: boolean; error: string }
> => {
  try {
    const { data, votingId, importOption = IMPORT_OPTIONS.MERGE } = values;
    const voting = await Voting.findById(votingId);
    if (!voting) {
      throw new Error('Voting not found');
    }
    const dataEmails = data.map((el) => el[1]);
    const existingExperts = voting.experts.filter((expert:any) =>
      dataEmails.includes(expert.email)
    );
    if (existingExperts.length > 0) {
      throw new Error('Expert with email exists');
    }
    const createdExperts: IExpert[] = [];
    switch (importOption) {
      case IMPORT_OPTIONS.MERGE:
        const newExpertsMerge = data.map(([name, email]) => ({
          name,
          email,
          status: TEXT_CONSTANTS.INVITED,
        }));
        voting.experts.push(...newExpertsMerge);
        break;
      case IMPORT_OPTIONS.REPLACE:
        const newExpertsReplace = data.map(([name, email]) => ({
          name,
          email,
          status: TEXT_CONSTANTS.INVITED,
        }));
        voting.experts = newExpertsReplace;
        voting.assessments = {};
        break;
      case IMPORT_OPTIONS.UPDATE:
        for (const expertData of data) {
          const [name, email] = expertData;
          const existingExpert = voting.experts.find(
            (expert:any) => expert.name === name
          );
          if (existingExpert) {
            existingExpert.email = email;
          } else {
            const newExpert = { name, email, status: TEXT_CONSTANTS.INVITED };
            voting.experts.push(newExpert);
          }
        }
        break;
      default:
        throw new Error('Invalid importOption');
    }
    const updatedVoting = await voting.save();
    for (const expert of updatedVoting.experts) {
      if (dataEmails.includes(expert.email)) {
        createdExperts.push(expert);
      }
    }
    return { success: true, experts: createdExperts };
  } catch (err: any) {
    console.error('Failed to create an expert', err);
    return { success: false, error: err.message };
  }
};

export const deleteExpert = async (votingId: string, expertId: string) => {
  try {
    const voting = await Voting.findByIdAndUpdate(votingId, {
      $pull: { experts: { _id: expertId } },
    });
    if (!voting) {
      throw new Error('Voting not found');
    }
    return { success: true };
  } catch (err: any) {
    console.error(`Failed to delete expert: ${err}`);
    return { success: false, error: err.message };
  }
};

export async function updateExpert(
  expertId: string,
  newExpertData: { name: string; email: string } | undefined,
  votingId: string
): Promise<IExpert | null> {
  try {
    if (!newExpertData) {
      throw new Error('Expert data not provided');
    }
    const voting = await Voting.findById(votingId);
    if (!voting) {
      throw new Error('Voting not found');
    }
    const expertIndex = voting.experts.findIndex(
      (expert: IExpert) => expert._id.toString() === expertId
    );
    if (expertIndex === -1) {
      throw new Error('Expert not found');
    }
    Object.assign(voting.experts[expertIndex], newExpertData);
    const updatedVoting = await voting.save();
    return updatedVoting.experts[expertIndex];
  } catch (err) {
    console.error('Failed to update an expert', err);
    return null;
  }
}

export const getHeuristics = async (votingId: string) => {
  try {
    const voting = await Voting.findById(votingId);
    if (!voting) {
      throw new Error('Voting not found');
    }
    return voting.heuristics;
  } catch (err) {
    console.error(`Failed to get heuristics: ${err}`);
    return null;
  }
};

export const createHeuristic = async (values: Record<string, any>) => {
  try {
    const { sum, placing, votingId } = values;
    const updatedVoting = await Voting.findByIdAndUpdate(
      votingId,
      {
        $push: { heuristics: { sum, placing } },
      },
      { new: true }
    );
    if (!updatedVoting) {
      throw new Error('Voting not found');
    }
    const createdHeuristic =
      updatedVoting.heuristics[updatedVoting.heuristics.length - 1];
    return createdHeuristic;
  } catch (err: any) {
    console.error('Failed to create a heuristic', err);
    return null;
  }
};

export const deleteHeuristic = async (
  votingId: string,
  heuristicId: string
) => {
  try {
    const voting = await Voting.findById(votingId);
    if (!voting) {
      throw new Error('Voting not found');
    }
    const heuristicIndex = voting.heuristics.findIndex(
      (heuristic: IHeuristic) => heuristic._id.toString() === heuristicId
    );
    if (heuristicIndex === -1) {
      throw new Error('Heuristic not found');
    }
    voting.heuristics.splice(heuristicIndex, 1);
    await voting.save();
    return { success: true };
  } catch (err) {
    console.error(`Failed to delete heuristic: ${err}`);
    return { success: false, error: err };
  }
};

export async function updateHeuristic(
  heuristicId: string,
  newHeuristicData: { sum: number; placing: number | null },
  votingId: string
) {
  try {
    const { sum, placing } = newHeuristicData;
    const updatedVoting = await Voting.findOneAndUpdate(
      {
        _id: votingId,
        'heuristics._id': heuristicId,
      },
      {
        $set: {
          'heuristics.$.sum': sum,
          'heuristics.$.placing': placing,
        },
      },
      { new: true }
    );

    if (!updatedVoting) {
      throw new Error('Voting or Heuristic not found');
    }
    const updatedHeuristic = updatedVoting.heuristics.find(
      (heuristic: IHeuristic) => heuristic._id.toString() === heuristicId
    );

    return updatedHeuristic;
  } catch (err: any) {
    console.error('Failed to update a heuristic', err);
    return null;
  }
}

export async function addAssessment(
  votingId: string,
  expertId: string,
  scores: string[]
): Promise<string[] | null> {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const updatedVoting = await Voting.findOneAndUpdate(
      {
        _id: votingId,
        'experts._id': expertId,
        'assessments.expertId': { $exists: false },
      },
      {
        $set: {
          'experts.$.status': TEXT_CONSTANTS.VOTED,
          [`assessments.${expertId}`]: scores,
        },
      },
      { new: true, session }
    );

    if (!updatedVoting) {
      throw new Error('Failed to add an assessment');
    }

    await session.commitTransaction();
    return scores;
  } catch (err: any) {
    console.error('Failed to add an assessment', err);
    await session.abortTransaction();
    return null;
  } finally {
    session.endSession();
  }
}

export async function addVoteFromExpert(
  votingId: string,
  newAssessment: string[]
) {
  try {
    const voting = await Voting.findById(votingId);
    if (!voting) {
      throw new Error('Voting not found');
    }
    for (const [index, value] of newAssessment.entries()) {
      const votingObject = voting.votes.find(
        (vote: IVote) => vote.name === value
      );
      if (votingObject) {
        votingObject.scores[index]++;
      } else {
        const newVote = { name: value, scores: [0, 0, 0] };

        newVote.scores[index]++;
        voting.votes.push(newVote);
      }
    }
    await voting.save();
  } catch (err) {
    console.error('Failed to add a vote from an expert', err);
    return null;
  }
}

export async function setResults(results: IResult[], votingId: string) {
  try {
    const voting = await Voting.findById(votingId);
    if (!voting) {
      throw new Error('Voting not found');
    }
    voting.results = results;
    await voting.save();
  } catch (err) {
    console.error('Failed to set results', err);
    throw err;
  }
}
