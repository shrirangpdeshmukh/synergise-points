import { React, useState, useEffect } from "react";

import TableComponent from "./components/TableComponent";

import store from "./store/reducer";
import * as boardActions from "./store/boardActions";
import axios from "axios";

const Table = () => {
  // const [pointsArray, setPointsArray] = useState([]);
  const [PRInfo, setPRInfo] = useState([]);
  const [issueInfo, setIssueInfo] = useState([]);

  const [data, setData] = useState(null);
  /**
   
   * GitHub ID : {
   * Image
   * Score
   * No.of PRs Merged
   * No. of Issues Created}
   */

  const scoreMap = new Map([
    ["syn-easy", 10],
    ["syn-medium", 25],
    ["syn-hard", 40],
  ]);

  const getPRs = () => {
    axios
      .get(
        'https://api.github.com/search/issues?q=org:Dummy-Organ+is:pr+is:merged+label:"syn-accepted"'
      )
      .then((response) => {
        console.log(response.data);
        setPRInfo(response.data.items);
      })
      .catch((error) => console.error(error));
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
      .catch((error) => console.error(error));
  };

  const refactorData = () => {
    const userMap = new Map();

    for (var j = 0; j < PRInfo.length; j++) {
      if (PRInfo[j].labels.length > 0) {
        let increment = 0;
        for (let label of PRInfo[j].labels) {
          if (scoreMap.has(label.name)) {
            increment = scoreMap.get(label.name);
            break;
          }
        }

        console.log(increment);

        if (increment > 0) {
          if (userMap.has(PRInfo[j].user.login)) {
            const oldData = userMap.get(PRInfo[j].user.login);
            const newData = { ...oldData };
            newData.score = newData.score + increment;
            newData.pr++;
            userMap.set(PRInfo[j].user.login, newData);
          } else {
            const data = {
              image: PRInfo[j].user.avatar_url,
              pr: 1,
              issue: 0,
              score: increment,
            };
            userMap.set(PRInfo[j].user.login, data);
          }
        }
      }
      // console.log(userMap);
      // console.log(PRInfo);
    }

    for (var j = 0; j < issueInfo.length; j++) {
      if (userMap.has(issueInfo[j].user.login)) {
        const oldData = userMap.get(issueInfo[j].user.login);
        const newData = { ...oldData };
        newData.score = newData.score + 4;
        newData.issue++;
        userMap.set(issueInfo[j].user.login, newData);
      } else {
        const data = {
          image: issueInfo[j].user.avatar_url,
          pr: 0,
          issue: 1,
          score: 4,
        };
        userMap.set(issueInfo[j].user.login, data);
      }

      // console.log(userMap);
      // console.log(PRInfo);
    }

    console.log([...userMap.entries()]);
    store.dispatch(boardActions.setLeaderBoardData([...userMap.entries()]));

    setData([...userMap.entries()]);
  };

  useEffect(() => {
    getPRs();
    getContributorIssues();
  }, []);

  useEffect(() => {
    if (PRInfo.length > 0) {
      refactorData();
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
