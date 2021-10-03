const scoreMap = new Map([
  ["syn-very-easy", 5],
  ["syn-easy", 10],
  ["syn-medium", 25],
  ["syn-hard", 40],
]);

export const getRepo = (url) => {
  return url.split("/")[url.split("/").length - 1];
};

export const getDifficulty = (labels) => {
  for (let label of labels) {
    if (scoreMap.has(label.name)) {
      return label.name;
    }
  }
};

export const getIncrement = (labels) => {
  for (let label of labels) {
    if (scoreMap.has(label.name)) {
      return scoreMap.get(label.name);
    }
  }

  return 0;
};
