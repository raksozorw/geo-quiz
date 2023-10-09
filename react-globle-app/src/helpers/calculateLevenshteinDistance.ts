// this uses an algorithm to calculate Levenshtein distance
function calculateLevenshteinDistance(a: string, b: string) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let i = 0; i <= a.length; i++) {
    matrix[0][i] = i;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[b.length][a.length];
}

export default function isStringCloseToReference(
  input: string,
  reference: string,
  threshold: number
) {
  const distance = calculateLevenshteinDistance(input, reference);

  // if distance is 0, it's correct
  // if distance is less than thresh, it's close, prompt the answer
  // if distance is off, incorrect

  if (distance === 0) {
    return "match";
  } else if (distance <= threshold) {
    return "close";
  } else {
    return "nomatch";
  }
}

// example
const userInput = "apple";
const referenceString = "apples";
const thresholdDistance = 2;

if (isStringCloseToReference(userInput, referenceString, thresholdDistance)) {
  console.log("The strings are close.");
} else {
  console.log("The strings are not close.");
}
