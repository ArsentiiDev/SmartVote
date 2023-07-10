import { VotingObject } from "./vote_classes";

export default function generateCombinations(objects:VotingObject[]) {
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
