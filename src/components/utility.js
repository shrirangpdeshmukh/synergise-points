const scoreMap = new Map([
  ["syn-beginner", 5],
  ["syn-easy", 10],
  ["syn-medium", 25],
  ["syn-hard", 40],
]);

export const getRepo = (url) => {
  return url.split("/")[url.split("/").length - 1];
};

export const getRepoLink = (url) => {
  let repo = "https://github.com/";
  url = url.split("/");
  repo += url[url.length - 2] + "/" + url[url.length - 1];
  return repo;
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
