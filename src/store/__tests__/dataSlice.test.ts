import { IExpert, IHeuristic, IObject, IResult, IVoting } from '@/Types/Interfaces';
import dataReducer, {
    setVotings,
    setIsLoading,
    addExpert,
    addObject,
    removeObject,
    editObject,
    editExpert,
    removeExpert,
    addVoting,
    addHeuristic,
    editHeuristic,
    removeHeuristic,
    setResults,
    clearResults,
  } from '../dataSlice';
  
  describe('dataSlice', () => {
    interface DataSlice {
        votings: IVoting[];
        isLoading: boolean;
        results: IResult[] | null;
      }
    
      const initialState: DataSlice = {
        votings: [],
        isLoading: false,
        results: null,
      };
  
    it('should set votings correctly', () => {
        const votings: IVoting[] = [
          { _id: '1', title: 'Voting 1', objects: [], experts: [], heuristics: [], criteria: '', method: '', results: [], assessments: null, votes: [] },
          { _id: '2', title: 'Voting 2', objects: [], experts: [], heuristics: [], criteria: '', method: '', results: [], assessments: null, votes: [] },
        ];
    
        const nextState = dataReducer(initialState, setVotings(votings));
    
        expect(nextState.votings).toEqual(votings);
      });
  
    it('should set isLoading correctly', () => {
      const nextState = dataReducer(initialState, setIsLoading(true));
  
      expect(nextState.isLoading).toBe(true);
    });
  
    it('should add an expert correctly', () => {
      const expert: IExpert = { _id: '1', name: 'John Doe', email: 'test@mail.com', status: 'Voted'};
      const votingId = '2';
      const currentState = { ...initialState, votings: [{ _id: '2', title: 'Voting 2', objects: [], experts: [], heuristics: [], criteria: '', method: '', results: [], assessments: null, votes: [] }] };
  
      const nextState = dataReducer(currentState, addExpert({ expert, votingId }));
  
      expect(nextState.votings[0].experts).toContain(expert);
    });
  
    it('should add an object correctly', () => {
      const object: IObject = { _id: '1', title: 'Object 1', description: '' };
      const votingId = '2';
      const currentState = { ...initialState, votings: [{ _id: '2', title: 'Voting 2', objects: [], experts: [], heuristics: [], criteria: '', method: '', results: [], assessments: null, votes: [] }] };
  
      const nextState = dataReducer(currentState, addObject({ object, votingId }));
  
      expect(nextState.votings[0].objects).toContain(object);
    });
  
    it('should remove an object correctly', () => {
      const objectId = '1';
      const votingId = '2';
      const currentState = {
        ...initialState,
        votings: [{ _id: '2', title: 'Voting 2', objects: [{ _id: '1', title: 'Object 1', description: '' }, { _id: '2', title: 'Object 2', description: '' }], experts: [], heuristics: [], criteria: '', method: '', results: [], assessments: null, votes: [] }],
      };
  
      const nextState = dataReducer(currentState, removeObject({ objectId, votingId }));
  
      expect(nextState.votings[0].objects).not.toContainEqual(expect.objectContaining({ _id: '1', name: 'Object 1' }));
    });
  
    it('should edit an object correctly', () => {
        const updatedObject: IObject = { _id: '1', title: 'Updated Object 1', description: '' };
        const objectId = '1';
        const votingId = '2';
        const currentState = {
          ...initialState,
          votings: [{ _id: '2', title: 'Voting 2', objects: [{ _id: '1', title: 'Object 1', description: '' }, { _id: '2', title: 'Object 2', description: '' }], experts: [], heuristics: [], criteria: '', method: '', results: [], assessments: null, votes: [] }],
        };
    
        const nextState = dataReducer(currentState, editObject({ object: updatedObject, objectId, votingId }));
    
        expect(nextState.votings[0].objects).toContainEqual(expect.objectContaining({ _id: '1', title: 'Updated Object 1' }));
      });
  
    it('should edit an expert correctly', () => {
      const updatedExpert = { _id: '1', name: 'Updated Expert 1', email: 'ter @mail.com', status: 'Voted' };
      const expertId = '1';
      const votingId = '2';
      const currentState = {
        ...initialState,
        votings: [{ _id: '2', title: 'Voting 2', objects: [], experts: [{ _id: '1', name: 'Expert 1', email: '', status: '' }, { _id: '2', name: 'Expert 2', email: '', status: '' }], heuristics: [], criteria: '', method: '', results: [], assessments: null, votes: [] }],
      };
  
      const nextState = dataReducer(currentState, editExpert({ expert: updatedExpert, expertId, votingId }));
  
      expect(nextState.votings[0].experts).toContainEqual(expect.objectContaining({ _id: '1', name: 'Updated Expert 1' }));
    });
  
    it('should remove an expert correctly', () => {
      const expertId = '1';
      const votingId = '2';
      const currentState = {
        ...initialState,
        votings: [{ _id: '2', title: 'Voting 2', objects: [], experts: [{ _id: '1', name: 'Expert 1', email: '', status: '' }, { _id: '2', name: 'Expert 2', email: '', status: '' }], heuristics: [], criteria: '', method: '', results: [], assessments: null, votes: [] }],
      };
  
      const nextState = dataReducer(currentState, removeExpert({ expertId, votingId }));
  
      expect(nextState.votings[0].experts).not.toContainEqual(expect.objectContaining({ _id: '1', name: 'Expert 1' }));
    });
  
    it('should add a voting correctly', () => {
        const voting: IVoting = {
          _id: '1', 
          title: 'New Voting', 
          objects: [], 
          experts: [], 
          heuristics: [], 
          criteria: '', 
          method: '', 
          results: [], 
          assessments: null, 
          votes: []
        };
      
        const nextState = dataReducer(initialState, addVoting(voting));
      
        expect(nextState.votings).toContainEqual(voting);
      });
      
  
      it('should add a heuristic correctly', () => {
        const object: IHeuristic = { _id: '1', sum: 0, placing: null };
        const votingId = '2';
        const currentState = { ...initialState, votings: [{ _id: '2', title: 'Voting 2', objects: [], experts: [{ _id: '1', name: 'Expert 1', email: '', status: '' }, { _id: '2', name: 'Expert 2', email: '', status: '' }], heuristics: [], criteria: '', method: '', results: [], assessments: null, votes: [] }] };
      
        const nextState = dataReducer(currentState, addHeuristic({ object, votingId }));
      
        expect(nextState.votings[0].heuristics).toContain(object);
      });
      
      it('should edit a heuristic correctly', () => {
        const object: IHeuristic = { _id: '1', sum: 100, placing: 1 };
        const heuristicId = '1';
        const votingId = '2';
        const currentState = {
          ...initialState,
          votings: [{ _id: '2', title: 'Voting 2', objects: [], experts: [], heuristics: [{_id:'1', sum:0, placing: 1}], criteria: '', method: '', results: [], assessments: null, votes: [] }],
        };
      
        const nextState = dataReducer(currentState, editHeuristic({ object, objectId:heuristicId, votingId }));
      
        expect(nextState.votings[0].heuristics).toContainEqual(object);
      });
      
  
    it('should remove a heuristic correctly', () => {
      const heuristicId = '1';
      const votingId = '2';
      const currentState = {
        ...initialState,
        votings: [{ _id: '2', title: 'Voting 2', objects: [], experts: [], heuristics: [{_id:'1', sum:0, placing: 1}], criteria: '', method: '', results: [], assessments: null, votes: [] }],
      };
  
      const nextState = dataReducer(currentState, removeHeuristic({ heuristicId, votingId }));
  
      expect(nextState.votings[0].heuristics).not.toContainEqual(expect.objectContaining({ _id: '1'}));
    });
  });
  