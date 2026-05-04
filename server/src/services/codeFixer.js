import stringSimilarity from "string-similarity";

export const fixColumnNames = (code, columns) => {
  let fixedCode = code;

  // Ensure correlation uses only numeric columns
  fixedCode = fixedCode.replace(
    /\bdf\.corr\(\s*\)/g,
    'df.select_dtypes(include="number").corr()',
  );

  columns.forEach((col) => {
    const regex = new RegExp(col, "gi");

    // already correct → skip
    if (regex.test(code)) return;
  });

  // find words in code (possible column names)
  const words = code.match(/[a-zA-Z_]+/g) || [];

  words.forEach((word) => {
    const match = stringSimilarity.findBestMatch(word, columns);

    if (match.bestMatch.rating > 0.6) {
      const correctCol = match.bestMatch.target;

      const wordRegex = new RegExp(`\\b${word}\\b`, "g");

      fixedCode = fixedCode.replace(wordRegex, correctCol);
    }
  });

  return fixedCode;
};
