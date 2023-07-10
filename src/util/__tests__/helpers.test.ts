import {
    transformAssessments,
    generateCombinations,
    calculateMatrix,
    findMinimaxValue,
    findQuadraticCriterionValue,
    findAdditiveCriterionValue,
  } from '../helpers';
  import { VotingObject } from '../vote_classes';
  
  describe('Helpers', () => {
    describe('transformAssessments', () => {
      it('should transform assessments correctly', () => {
        const assessments = new Map();
        assessments.set('expert1', ['Title 1', 'Title 2', 'Title 4']);
        assessments.set('expert2', ['Title 3', 'Title 4', 'Title 2']);
        const objects = [
          new VotingObject('object1', 'Title 1', 'Description 1'),
          new VotingObject('object2', 'Title 2', 'Description 2'),
          new VotingObject('object3', 'Title 3', 'Description 3'),
          new VotingObject('object4', 'Title 4', 'Description 4'),
        ];
  
        const transformedAssessments = transformAssessments(assessments, objects);
  
        expect(transformedAssessments).toEqual([
          [1, 0],
          [2, 3],
          [0, 1],
          [3, 2],
        ]);
      });
    });
  
    describe('generateCombinations', () => {
      it('should generate combinations correctly', () => {
        const objects = [new VotingObject('1', 'Object 1', 'Description 1'), new VotingObject('2', 'Object 2', 'Description 2')];
  
        const combinations = generateCombinations(objects);
  
        expect(combinations).toEqual([[1, 2], [2, 1]]);
      });
    });
  
    describe('calculateMatrix', () => {
      it('should calculate matrix correctly', () => {
        const matrixA = [[1, 2], [3, 4], [5, 6]];
        const matrixB = [[1, 2], [3, 4]];
        const expectedMatrix = [[1, 3], [3, 1], [7, 5]];
  
        const resultMatrix = calculateMatrix(matrixA, matrixB);
  
        expect(resultMatrix).toEqual(expectedMatrix);
      });
  
      it('should return undefined if number of columns in A is not equal to the number of rows in B', () => {
        const matrixA = [[1, 2,4], [3, 4,5]];
        const matrixB = [[1, 2, 3], [4, 5, 6]];
  
        const resultMatrix = calculateMatrix(matrixA, matrixB);
  
        expect(resultMatrix).toBeUndefined();
      });
    });
  
    describe('findMinimaxValue', () => {
      it('should find minimax value correctly', () => {
        const array = [[5, 3, 7], [2, 9, 1], [4, 6, 8]];
        const expectedValue = {
          minMax: 7,
          minRowIndex: [[0, 15, 7]],
        };
  
        const result = findMinimaxValue(array);
  
        expect(result).toEqual(expectedValue);
      });
    });
  
    describe('findQuadraticCriterionValue', () => {
      it('should find quadratic criterion value correctly', () => {
        const array = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
        const expectedValue = {
          minQuadraticSum: 14,
          minRowIndex: [[0, 6, 14]],
        };
  
        const result = findQuadraticCriterionValue(array);
  
        expect(result).toEqual(expectedValue);
      });
    });
  
    describe('findAdditiveCriterionValue', () => {
      it('should find additive criterion value correctly', () => {
        const array = [[5, 3, 7], [2, 9, 1], [4, 6, 8]];
        const expectedValue = {
          minSum: 12,
          minRowIndex: [[1, 9, 12]],
        };
  
        const result = findAdditiveCriterionValue(array);
  
        expect(result).toEqual(expectedValue);
      });
    });
  });
  