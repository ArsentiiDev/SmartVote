import { IVote } from '@/Types/Interfaces';
import { Expert, Heuristic, Vote, VotingObject } from '../vote_classes';

describe('Vote', () => {
    let vote: Vote;
  
    beforeEach(() => {
      vote = new Vote('title', 'criteria', 'method');
    });
  
    it('should add expert correctly', () => {
      const expert = new Expert('1', 'John Doe', 'john.doe@example.com', 'status');
      vote.addExpert(expert);
      expect(vote.Experts).toContain(expert);
    });

    it('should return id of vote correctly', () => {
      const expert = new Expert('1', 'John Doe', 'john.doe@example.com', 'status');
    
      expect(expert.id).toEqual('1');
    });
  
    it('should add object correctly', () => {
      const votingObject = new VotingObject('1', 'Object 1', 'Description 1');
      vote.addObject(votingObject);
      expect(vote.Objects).toContain(votingObject);
    });
  
    it('should add heuristic correctly', () => {
      const heuristic = new Heuristic('1', 10, 1);
      vote.addHeuristic(heuristic);
      expect(vote.Heuristics).toContain(heuristic);
    });
  
    it('should set assessments correctly', () => {
      const assessments = new Map();
      assessments.set('key1', ['assessment1', 'assessment2']);
      vote.setAssessments(assessments);
      expect(vote.Assessments).toEqual(assessments);
    });
  
    it('should set object placements correctly', () => {
      const votes: IVote[] = [
        { _id: '1', name: 'Object 1', scores: [1, 2, 3] },
        { _id: '2', name: 'Object 2', scores: [3, 2, 1] },
      ];
      vote.setObjectPlacements(votes);
      expect(vote.Votes).toEqual(votes);
    });
  
    it('should filter objects based on votes', () => {
      const votingObject1 = new VotingObject('1', 'Object 1', 'Description 1');
      const votingObject2 = new VotingObject('2', 'Object 2', 'Description 2');
      const votingObject3 = new VotingObject('3', 'Object 3', 'Description 3');
      const votes: IVote[] = [
        { _id: '1', name: 'Object 1', scores: [1, 2, 3] },
        { _id: '2', name: 'Object 2', scores: [3, 2, 1] },
      ];
      vote.addObject(votingObject1);
      vote.addObject(votingObject2);
      vote.addObject(votingObject3);
      vote.setObjectPlacements(votes);
      vote.filterObjects();
      expect(vote.Objects).toEqual([votingObject1, votingObject2]);
    });
  
    it('should apply heuristics correctly', () => {
      const votingObject1 = new VotingObject('1', 'Object 1', 'Description 1');
      const votingObject2 = new VotingObject('2', 'Object 2', 'Description 2');
      const votingObject3 = new VotingObject('3', 'Object 3', 'Description 3');
      const votes: IVote[] = [
        { _id: '1', name: 'Object 1', scores: [1, 2, 3] },
        { _id: '2', name: 'Object 2', scores: [0, 2, 0] },
        { _id: '3', name: 'Object 3', scores: [0, 0, 1] },
      ];
      const heuristic = new Heuristic('1', 1, 3);
      const heuristic2 = new Heuristic('2', 2, 2);
      vote.addObject(votingObject1);
      vote.addObject(votingObject2);
      vote.addObject(votingObject3);
      vote.setObjectPlacements(votes);
      vote.addHeuristic(heuristic);
      vote.addHeuristic(heuristic2);
      vote.applyHeuristics();
      expect(vote.Votes).toEqual([{ _id: '1', name: 'Object 1', scores: [1, 2, 3] }]);
    });
  });
  