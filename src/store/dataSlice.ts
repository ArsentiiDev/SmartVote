import {
  IExpert,
  IHeuristic,
  IObject,
  IResult,
  IVoting,
} from '@/Types/Interfaces';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface DataSlice {
  votings: IVoting[];
  isLoading: boolean;
  results: [IResult] | null;
}

const initialState: DataSlice = {
  votings: [],
  isLoading: false,
  results: null,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setVotings: (state, action: PayloadAction<IVoting[]>) => {
      state.votings = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addExpert: (
      state,
      action: PayloadAction<{ objects: IExpert[]; votingId: string | null }>
    ) => {
      const { objects, votingId } = action.payload;
      const voting = state.votings.find((voting) => voting._id === votingId);
      if (voting) {
        voting.experts.push(...objects)
      }
    },
    addObject: (
      state,
      action: PayloadAction<{ objects: IObject[]; votingId: string | null }>
    ) => {
      const { objects, votingId } = action.payload;
      const voting = state.votings.find((voting) => voting._id === votingId);
      if (voting) {
        voting.objects = objects;
      }
    },
    removeObject: (
      state,
      action: PayloadAction<{ objectId: string; votingId: string | null }>
    ) => {
      const { objectId, votingId } = action.payload;
      if (votingId) {
        const voting = state.votings.find((voting) => voting._id === votingId);
        const deleteObjectIndex = voting?.objects.findIndex(
          (object) => object._id === objectId
        );

        if (deleteObjectIndex !== undefined && deleteObjectIndex > -1) {
          voting?.objects.splice(deleteObjectIndex, 1);
        }
      }
    },
    editObject: (
      state,
      action: PayloadAction<{
        object: IObject;
        objectId: string;
        votingId: string;
      }>
    ) => {
      const { object: updatedObject, objectId, votingId } = action.payload;
      const voting = state.votings.find((voting) => voting._id === votingId);
      const objectIndex = voting?.objects.findIndex(
        (object) => object._id === objectId
      );

      if (objectIndex !== undefined && objectIndex > -1) {
        voting?.objects.splice(objectIndex, 1, updatedObject);
      }
    },
    editExpert: (
      state,
      action: PayloadAction<{
        expert: IExpert;
        expertId: string;
        votingId: string;
      }>
    ) => {
      const { expert: updatedExpert, expertId, votingId } = action.payload;
      const voting = state.votings.find((voting) => voting._id === votingId);
      const expertIndex = voting?.experts.findIndex(
        (expert) => expert._id === expertId
      );

      if (expertIndex !== undefined && expertIndex > -1) {
        voting?.experts.splice(expertIndex, 1, updatedExpert);
      }
    },
    removeExpert: (
      state,
      action: PayloadAction<{ expertId: string; votingId: string | null }>
    ) => {
      const { expertId, votingId } = action.payload;
      if (votingId) {
        const voting = state.votings.find((voting) => voting._id === votingId);
        const deleteExpertIndex = voting?.experts.findIndex(
          (expert) => expert._id === expertId
        );
        if (deleteExpertIndex !== undefined && deleteExpertIndex > -1) {
          voting?.experts.splice(deleteExpertIndex, 1);
        }
      }
    },
    addVoting: (state, action: PayloadAction<IVoting>) => {
      state.votings.push(action.payload);
    },
    addHeuristic: (
      state,
      action: PayloadAction<{ object: IHeuristic; votingId: string }>
    ) => {
      const { object, votingId } = action.payload;
      const voting = state.votings.find((voting) => voting._id === votingId);
      if (voting) {
        voting.heuristics.push(object);
      }
    },
    editHeuristic: (
      state,
      action: PayloadAction<{
        object: IHeuristic;
        objectId: string;
        votingId: string;
      }>
    ) => {
      const { object: updatedHeuristic, objectId, votingId } = action.payload;
      const voting = state.votings.find((voting) => voting._id === votingId);
      const heuristicIndex = voting?.heuristics.findIndex(
        (heuristic) => heuristic._id === objectId
      );

      if (heuristicIndex !== undefined && heuristicIndex > -1) {
        voting?.heuristics.splice(heuristicIndex, 1, updatedHeuristic);
      }
    },
    removeHeuristic: (
      state,
      action: PayloadAction<{ heuristicId: string; votingId: string | null }>
    ) => {
      const { heuristicId, votingId } = action.payload;
      if (votingId) {
        const voting = state.votings.find((voting) => voting._id === votingId);
        const deleteHeuristicId = voting?.heuristics.findIndex(
          (heuristic) => heuristic._id === heuristicId
        );
        if (deleteHeuristicId !== undefined && deleteHeuristicId > -1) {
          voting?.heuristics.splice(deleteHeuristicId, 1);
        }
      }
    },
    setResults: (
      state,
      action: PayloadAction<{ results: IResult[]; votingId: string }>
    ) => {
      const { results, votingId } = action.payload;
      const voting = state.votings.find((voting) => voting._id === votingId);
      if (voting) {
        voting.results = results;
      }
    },
    clearResults: (state) => {
      state.results = null;
    },
  },
});

export const {
  setVotings,
  setIsLoading,
  addExpert,
  addObject,
  removeObject,
  removeExpert,
  editObject,
  addVoting,
  editExpert,
  addHeuristic,
  editHeuristic,
  removeHeuristic,
  setResults,
  clearResults,
} = dataSlice.actions;

export default dataSlice.reducer;
