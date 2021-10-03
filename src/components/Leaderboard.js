import { React, useState, useEffect } from "react";

import TableComponent from "./TableComponent";

import store from "../store/reducer";
import * as boardActions from "../store/boardActions";
import axios from "axios";

const Table = () => {
  const [PRInfo, setPRInfo] = useState(null);
  const [issueInfo, setIssueInfo] = useState(null);
  const [data, setData] = useState(null);

  /**
   * GitHub ID : {Image, Score, No.of PRs Merged, No. of Issues Created }
   */

  const scoreMap = new Map([
    ["syn-easy", 10],
    ["syn-medium", 25],
    ["syn-hard", 40],
  ]);

  const getIncrement = (labels) => {
    for (let label of labels) {
      if (scoreMap.has(label.name)) {
        return scoreMap.get(label.name);
      }
    }

    return 0;
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

  const getPRs = () => {
    axios
      .get(
        'https://api.github.com/search/issues?q=org:Dummy-Organ+is:pr+is:merged+label:"syn-accepted"'
      )
      .then((response) => {
        console.log(response.data);
        setPRInfo(response.data.items);
      })
      .catch((error) => {
        console.error(error);
        loadFromRedux();
      });
  };

  const getContributorIssues = () => {
    axios
      .get(
        'https://api.github.com/search/issues?q=org:Dummy-Organ+is:issue+label:"syn-accepted"'
      )
      .then((response) => {
        console.log(response.data);
        setIssueInfo(response.data.items);
      })
      .catch((error) => {
        console.error(error);
        loadFromRedux();
      });
  };

  const processPRs = (userMap) => {
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
            repo: getRepo(PR.repository_url),
          });

          userMap.set(PR.user.login, updateData);
        } else {
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
                repo: getRepo(PR.repository_url),
              },
            ],
            issues: [],
          };
          userMap.set(PR.user.login, data);
        }
      }
    }
  };

  const processIssues = (userMap) => {
    for (let issue of issueInfo) {
      if (userMap.has(issue.user.login)) {
        const updateData = userMap.get(issue.user.login);
        updateData.score += 4;
        updateData.issue++;
        updateData.issues.push({
          link: issue.html_url,
          title: issue.title,
          repo: getRepo(issue.repository_url),
        });
        userMap.set(issue.user.login, updateData);
      } else {
        const data = {
          image: issue.user.avatar_url,
          pr: 0,
          issue: 1,
          score: 4,
          issues: [
            {
              link: issue.html_url,
              title: issue.title,
              repo: getRepo(issue.repository_url),
            },
          ],
          PRs: [],
        };
        userMap.set(issue.user.login, data);
      }
    }
  };

  // const refactorData = () => {
  //   const userMap = new Map();

  //   for (var j = 0; j < PRInfo.length; j++) {
  //     if (PRInfo[j].labels.length > 0) {
  //       let increment = 0;
  //       for (let label of PRInfo[j].labels) {
  //         if (scoreMap.has(label.name)) {
  //           increment = scoreMap.get(label.name);
  //           break;
  //         }
  //       }

  //       console.log(increment);

  //       if (increment > 0) {
  //         if (userMap.has(PRInfo[j].user.login)) {
  //           const oldData = userMap.get(PRInfo[j].user.login);
  //           const newData = { ...oldData };
  //           newData.score = newData.score + increment;
  //           newData.pr++;
  //           userMap.set(PRInfo[j].user.login, newData);
  //         } else {
  //           const data = {
  //             image: PRInfo[j].user.avatar_url,
  //             pr: 1,
  //             issue: 0,
  //             score: increment,
  //           };
  //           userMap.set(PRInfo[j].user.login, data);
  //         }
  //       }
  //     }
  //     // console.log(userMap);
  //     // console.log(PRInfo);
  //   }

  //   for (var j = 0; j < issueInfo.length; j++) {
  //     if (userMap.has(issueInfo[j].user.login)) {
  //       const oldData = userMap.get(issueInfo[j].user.login);
  //       const newData = { ...oldData };
  //       newData.score = newData.score + 4;
  //       newData.issue++;
  //       userMap.set(issueInfo[j].user.login, newData);
  //     } else {
  //       const data = {
  //         image: issueInfo[j].user.avatar_url,
  //         pr: 0,
  //         issue: 1,
  //         score: 4,
  //       };
  //       userMap.set(issueInfo[j].user.login, data);
  //     }

  //     // console.log(userMap);
  //     // console.log(PRInfo);
  //   }

  //   console.log([...userMap.entries()]);
  //   store.dispatch(boardActions.setLeaderBoardData([...userMap.entries()]));

  //   setData([...userMap.entries()]);
  // };

  const processData = () => {
    const userMap = new Map();
    processPRs(userMap);
    processIssues(userMap);

    console.log([...userMap.entries()]);
    store.dispatch(boardActions.setLeaderBoardData([...userMap.entries()]));

    setData([...userMap.entries()]);
  };

  const getData = () => {
    getPRs();
    getContributorIssues();
  };

  const loadFromRedux = () => {
    const usersData = store.getState().usersData;
    if (usersData) {
      setData(usersData);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    // store.getState().usersData
    if (PRInfo && issueInfo) {
      processData();
    }
  }, [PRInfo, issueInfo]);

  if (data)
    return (
      <div>
        <TableComponent data={data} />
      </div>
    );
  return <div>Loading...</div>;
};

export default Table;
