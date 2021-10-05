import { getRepo, getRepoLink } from "./utility";

const issuePoints = 4;

const processIssues = (userMap, issueInfo) => {
  for (let issue of issueInfo) {
    if (userMap.has(issue.user.login)) {
      const updateData = userMap.get(issue.user.login);
      updateData.score += issuePoints;
      updateData.issue++;
      updateData.issues.push({
        link: issue.html_url,
        title: issue.title,
        repoLink: getRepoLink(issue.repository_url),
        repo: getRepo(issue.repository_url),
        time: issue.created_at,
      });
      userMap.set(issue.user.login, updateData);
    } else {
      const data = {
        image: issue.user.avatar_url,
        pr: 0,
        issue: 1,
        score: issuePoints,
        issues: [
          {
            link: issue.html_url,
            title: issue.title,
            repoLink: getRepoLink(issue.repository_url),
            repo: getRepo(issue.repository_url),
            time: issue.created_at,
          },
        ],
        PRs: [],
        diff: [0, 0, 0, 0],
      };
      userMap.set(issue.user.login, data);
    }
  }
};

export default processIssues;
