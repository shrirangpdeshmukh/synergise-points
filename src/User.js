import { React, useState, useEffect } from "react";
import axios from "axios";

const UserPage = () => {
  const [userInfo, setUserInfo] = useState({
    image: null,
    PR: 0,
    issues: 0,
    points: 0,
  });

  // const [userImage, setUserImage] = useState(null);
  // const [points, setPoints] = useState(0);
  // const [PR, setPR] = useState(0);
  // const [issues, setIssues] = useState(0);

  const [PRArray, setPRArray] = useState([]);
  const [issueArray, setIssueArray] = useState([]);

  const [PRInfo, setPRInfo] = useState(null);
  const [issueInfo, setIssueInfo] = useState(null);

  const userID = "MintuJupally";

  const scoreMap = new Map([
    ["syn-easy", 10],
    ["syn-medium", 25],
    ["syn-hard", 40],
  ]);

  const getPRs = () => {
    axios
      .get(
        `https://api.github.com/search/issues?q=org:Dummy-Organ+is:pr+is:merged+label:"syn-accepted"+author:"${userID}"`
      )
      .then((response) => {
        console.log(response.data);

        const newData = { ...userInfo };
        newData.PR = response.data.total_count;

        if (newData.image === null && response.data.total_count > 0) {
          newData.image = response.data.items[0].user.avatar_url;
        }

        setUserInfo(newData);
        setPRInfo(response.data.items);
      })
      .catch((error) => console.error(error));
  };

  const getContributorIssues = () => {
    axios
      .get(
        `https://api.github.com/search/issues?q=org:Dummy-Organ+is:issue+label:"syn-accepted"+author:"${userID}"`
      )
      .then((response) => {
        console.log(response.data);

        const newData = { ...userInfo };
        newData.issues = response.data.total_count;

        if (newData.image === null && response.data.total_count > 0) {
          newData.image = response.data.items[0].user.avatar_url;
        }

        setUserInfo(newData);
        setIssueInfo(response.data.items);
      })
      .catch((error) => console.error(error));
  };

  const getRepo = (url) => {
    return url.split("/")[url.split("/").length - 1];
  };

  const getDifficulty = (labels) => {
    for (let label of labels) {
      if (scoreMap.has(label.name)) {
        return label.name;
      }
    }
  };

  const refactorData = () => {
    const PRs = [];
    const Issues = [];
    let score = 0;

    for (var i = 0; i < PRInfo.length; i++) {
      const PR = PRInfo[i];

      const difficulty = getDifficulty(PR.labels);
      score += scoreMap.get(difficulty);

      PRs.push({
        link: PR.html_url,
        title: PR.title,
        difficulty: difficulty.split("-")[1],
        repo: getRepo(PR.repository_url),
      });
    }

    for (var j = 0; j < issueInfo.length; j++) {
      const issue = issueInfo[j];
      score += 4;

      Issues.push({
        link: issue.html_url,
        title: issue.title,
        repo: getRepo(issue.repository_url),
      });
    }

    setIssueArray(Issues);
    setPRArray(PRs);

    const newData = { ...userInfo };
    newData.points = score;
    setUserInfo(newData);
  };

  useEffect(() => {
    getPRs();
    getContributorIssues();
  }, []);

  useEffect(() => {
    if (PRInfo && issueInfo) {
      refactorData();

      console.log(userInfo);
      console.log(PRArray);
      console.log(issueArray);
    }
  }, [PRInfo, issueInfo]);

  return null;
};

export default UserPage;
