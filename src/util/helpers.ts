import { VotingObject } from "./vote_classes";

export function transformAssessments(assessments: Map<string, string[]>, objects: VotingObject[]) {
    const transformedAssessments = [];
    
    for (let i = 0; i < objects.length; i++) {
      transformedAssessments[i] = new Array(assessments.size).fill(0);
    }

    const objectIndexMap = new Map();
    objects.forEach((object, index) => {
        objectIndexMap.set(object.title, index);
    });
    console.log('objectIndexMap', objectIndexMap)
    let expertIndex = 0;
    for (const [expert, scores] of assessments) {
      for (let place = 0; place < scores.length; place++) {
        const objectId = scores[place]; 
        if (objectIndexMap.get(objectId) >=0) {
            transformedAssessments[objectIndexMap.get(objectId)][expertIndex] = place + 1;
        }
    }
      expertIndex++;
    }    
    return transformedAssessments;
  }
  
  export function generateCombinations(objects:VotingObject[]) {
    const n = objects.length;
    const combinations: any = [];
  
    function generate(currentCombination: number[], remainingObjects: number[]) {
      if (currentCombination.length === n) {
        combinations.push(currentCombination);
        return;
      }
  
      for (let i = 0; i < remainingObjects.length; i++) {
        const newCombination = currentCombination.concat(remainingObjects[i] +1);
        const newRemainingObjects = remainingObjects
          .slice(0, i)
          .concat(remainingObjects.slice(i + 1));
        generate(newCombination, newRemainingObjects);
      }
    }
    
    // Generate an array with indices [0, 1, 2, ..., n-1]
    const indices = Array.from({length: n}, (_, i) => i);
    generate([], indices);
    
    return combinations;
  }

  export function calculateMatrix(a:number[][], b:number[][]):number[][] | undefined {
    const rowsA = a.length,
      colsA = a[0].length;
    const rowsB = b.length,
      colsB = b[0].length;
    const result = new Array(rowsA);
  
    if (colsA !== rowsB) {
      //console.log(
       // "The number of columns of the first matrix must be equal to the number of rows of the second matrix"
     // );
      return undefined;
    }
  
    for (let i = 0; i < rowsA; i++) {
      result[i] = new Array(colsB);
      let biggest = 0;
  
      for (let j = 0; j < colsB; j++) {
        let sum = 0;
  
        for (let k = 0; k < colsA; k++) {
          if (b[k][j] > 0) {
            const diff = Math.abs(a[i][k] - b[k][j]);
            if (diff > biggest) biggest = diff;
            sum += diff;
          }
        }
  
        result[i][j] = sum;
      }
    }
  
    return result;
  }

export function findMinimaxValue(array: number[][]) {
  console.log('ARRAY',array)
  let minSum = Number.MAX_VALUE;
  let minRowIndex: [number, number, number][] = [];

  for (let i = 0; i < array.length; i++) {
      const maxVal = Math.max(...array[i]);  // знайти максимум в рядку
      const rowSum = array[i].reduce((a, b) => a + b, 0); 
      // console.log('sum', rowSum, minSum)
      if (rowSum < minSum) {
          minSum = rowSum;  // зберігаємо новий мінімакс
          minRowIndex = [[i, minSum,maxVal]];
      } else if (rowSum === minSum) {
          minRowIndex.push([i,minSum,maxVal]);
      }
  }

  return {
      minMax: minSum,
      minRowIndex: minRowIndex,
  };
}

export function findQuadraticCriterionValue(array:number[][]) {
  let minQuadraticSum = Number.MAX_VALUE;
  let minRowIndex:[number, number, number][] = [];

  for (let i = 0; i < array.length; i++) {
      const quadraticSum = array[i].reduce((sum, val) => sum + Math.pow(val, 2), 0);
      const rowSum = array[i].reduce((a, b) => a + b, 0); 

      if (quadraticSum < minQuadraticSum) {
          minQuadraticSum = quadraticSum;
          minRowIndex = [[i, rowSum, quadraticSum]];
      } else if (quadraticSum === minQuadraticSum) {
          minRowIndex.push([i,rowSum, quadraticSum]);
      }
  }

  return {
      minQuadraticSum: minQuadraticSum,
      minRowIndex: minRowIndex,
  };
}

export function findAdditiveCriterionValue(array:number[][]) {
  let minSum = Number.MAX_VALUE;
  let minRowIndex:[number, number,number][] = [];

  for (let i = 0; i < array.length; i++) {
      const rowSum = array[i].reduce((a, b) => a + b, 0);
      const maxVal = Math.max(...array[i]); 

      if (rowSum < minSum) {
          minSum = rowSum;
          minRowIndex = [[i, maxVal, rowSum]];
      } else if (rowSum === minSum) {
          minRowIndex.push([i, maxVal, rowSum]);
      }
  }

  return {
      minSum: minSum,
      minRowIndex: minRowIndex,
  };
}

export const sendEmail = async (activeVoting: string, html: any) => {
  return await fetch('/api/sendEmail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      votingId: activeVoting,
      html: html,
    }),
  });

}