import { React, useState, useEffect } from "react";
import axios from "axios";

const UserPage = () => {
  const [userInfo, setUserInfo] = useState({
    image: null,
    // PR: 0,
    // issues: 0,
    points: 0,
  });

  const [loading, setLoading] = useState(true);

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
        // console.log(response.data);

        const newData = { ...userInfo };
        // newData.PR = response.data.total_count;

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
        // console.log(response.data);

        const newData = { ...userInfo };
        // newData.issues = response.data.total_count;

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

  const processPRs = () => {
    let score = 0;
    const PRs = [];
    for (let PR of PRInfo) {
      const difficulty = getDifficulty(PR.labels);
      score += scoreMap.get(difficulty);

      PRs.push({
        link: PR.html_url,
        title: PR.title,
        difficulty: difficulty.split("-")[1],
        repo: getRepo(PR.repository_url),
      });
    }

    setPRArray(PRs);
    return score;
  };

  const processIssues = () => {
    let score = 0;
    const issues = [];
    for (let issue of issueInfo) {
      score += 4;
      issues.push({
        link: issue.html_url,
        title: issue.title,
        repo: getRepo(issue.repository_url),
      });
    }

    setIssueArray(issues);
    return score;
  };

  const processData = () => {
    let score = 0;
    score += processIssues();
    score += processPRs();

    const newData = { ...userInfo };
    newData.points = score;
    setUserInfo(newData);

    setLoading(false);
  };

  // const refactorData = () => {
  //   const PRs = [];
  //   const Issues = [];
  //   let score = 0;

  //   for (var i = 0; i < PRInfo.length; i++) {
  //     const PR = PRInfo[i];

  //     const difficulty = getDifficulty(PR.labels);
  //     score += scoreMap.get(difficulty);

  //     PRs.push({
  //       link: PR.html_url,
  //       title: PR.title,
  //       difficulty: difficulty.split("-")[1],
  //       repo: getRepo(PR.repository_url),
  //     });
  //   }

  //   for (var j = 0; j < issueInfo.length; j++) {
  //     const issue = issueInfo[j];
  //     score += 4;

  //     Issues.push({
  //       link: issue.html_url,
  //       title: issue.title,
  //       repo: getRepo(issue.repository_url),
  //     });
  //   }

  //   setIssueArray(Issues);
  //   setPRArray(PRs);

  //   const newData = { ...userInfo };
  //   newData.points = score;
  //   setUserInfo(newData);

  //   setLoading(false);
  // };

  const getData = () => {
    getPRs();
    getContributorIssues();
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (PRInfo && issueInfo) {
      // refactorData();
      processData();
    }
  }, [PRInfo, issueInfo]);

  if (loading) return <div>Loading...</div>;
  else {
    return (
      <div>
        <img src={userInfo.image} alt={`${userID}`} />
        <p>Name: {userID}</p>
        <p>Score: {userInfo.points}</p>
        <p>PR: {PRArray.length}</p>
        <p>Issues: {issueArray.length}</p>

        <div>
          <table>
            <thead>
              <tr>
                <th>Repository</th>
                <th>Title</th>
                <th>Link</th>
                <th>difficulty</th>
              </tr>
            </thead>
            <tbody>
              {PRArray.map((PR) => {
                return (
                  <tr key={PR.link}>
                    <td>{PR.repo}</td>
                    <td>{PR.title}</td>
                    <td>{PR.link}</td>
                    <td>{PR.difficulty}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div>
          <table>
            <thead>
              <tr>
                <th>Repository</th>
                <th>Title</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {issueArray.map((issue) => {
                return (
                  <tr key={issue.link}>
                    <td>{issue.repo}</td>
                    <td>{issue.title}</td>
                    <td>{issue.link}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
};

export default UserPage;
