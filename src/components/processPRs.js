import { getIncrement, getDifficulty, getRepo, getRepoLink } from "./utility";

const indexMap = new Map([
  ["syn-beginner", 0],
  ["syn-easy", 1],
  ["syn-medium", 2],
  ["syn-hard", 3],
]);

const processPRs = (userMap, PRInfo) => {
  for (let PR of PRInfo) {
    const increment = getIncrement(PR.labels);
    const difficulty = getDifficulty(PR.labels);

    if (increment > 0) {
      if (userMap.has(PR.user.login)) {
        const updateData = userMap.get(PR.user.login);
        updateData.score += increment;
        updateData.pr++;
        updateData.PRs.push({
          link: PR.html_url,
          title: PR.title,
          difficulty: difficulty.split("-")[1],
          repoLink: getRepoLink(PR.repository_url),
          repo: getRepo(PR.repository_url),
          time: PR.closed_at,
        });
        updateData.diff[indexMap.get(difficulty)]++;

        userMap.set(PR.user.login, updateData);
      } else {
        const diff = [0, 0, 0, 0];
        diff[indexMap.get(difficulty)]++;

        const data = {
          image: PR.user.avatar_url,
          pr: 1,
          issue: 0,
          score: increment,
          PRs: [
            {
              link: PR.html_url,
              title: PR.title,
              difficulty: difficulty.split("-")[1],
              repoLink: getRepoLink(PR.repository_url),
              repo: getRepo(PR.repository_url),
              time: PR.closed_at,
            },
          ],
          issues: [],
          diff: diff,
        };
        userMap.set(PR.user.login, data);
      }
    }
  }
};

export default processPRs;
