export function calculateMatrix(a:number[][], b:number[][]) {
    const rowsA = a.length,
      colsA = a[0].length;
    const rowsB = b.length,
      colsB = b[0].length;
    const result = new Array(rowsA);
  
    if (colsA !== rowsB) {
      console.error(
        "The number of columns of the first matrix must be equal to the number of rows of the second matrix"
      );
      return;
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

export function findSmallestSum(array:any) {
    let minSum = Number.MAX_VALUE; 
    let minRowIndex :any= []; 
    let cRows = array.length;
    let cCols = array[0].length;
  
    for (let i = 0; i < cRows; i++) {
      let rowSum = 0;
      let maxN = 0;
  
      for (let j = 0; j < cCols; j++) {
        if (array[i][j] > maxN) maxN = array[i][j]
        rowSum += array[i][j];
      }
  
      if (rowSum < minSum) {
        minSum = rowSum;
        minRowIndex = [[i, maxN, minSum]];
      } else if (rowSum === minSum) {
        minRowIndex.push([i, maxN,minSum]);
      }
    }
  
    return {
      minSum: minSum,
      minRowIndex: minRowIndex,
    };
  }