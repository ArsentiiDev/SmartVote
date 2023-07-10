export function calculateMatrix(a, b) {
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

export function findSmallestSum(array) {
    let minSum = Number.MAX_VALUE; // початкове значення мінімальної суми
    let minRowIndex = []; // масив для зберігання індексів рядків з мінімальною сумою
    let cRows = array.length;
    let cCols = array[0].length;
  
    // проходимо по кожному рядку результуючої матриці
    for (let i = 0; i < cRows; i++) {
      let rowSum = 0; // змінна для зберігання суми елементів рядка
      let maxN = 0;
  
      // проходимо по кожному елементу рядка
      for (let j = 0; j < cCols; j++) {
        if (array[i][j] > maxN) maxN = array[i][j]
        rowSum += array[i][j]; // додаємо елемент до суми
      }
  
      // порівнюємо поточну суму з мінімальною
      if (rowSum < minSum) {
        minSum = rowSum; // зберігаємо нову мінімальну суму
        minRowIndex = [[i, maxN, minSum]]; // зберігаємо новий індекс рядка
      } else if (rowSum === minSum) {
        minRowIndex.push([i, maxN,minSum]); // якщо сума рядка співпадає з мінімальною, то додаємо індекс до масиву
      }
    }
  
    return {
      minSum: minSum,
      minRowIndex: minRowIndex,
    };
  }