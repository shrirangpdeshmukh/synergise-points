import { React, useState, useEffect } from "react";

import axios from "axios";

const Table = () => {
  // const [pointsArray, setPointsArray] = useState([]);
  const [PRInfo, setPRInfo] = useState([]);
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
        "https://api.github.com/search/issues?q=org:Code4BBS+is:pr+is:merged"
      )
      .then((response) => {
        console.log(response.data);
        setPRInfo(response.data);
      })
      .catch((error) => console.error(error));
  };

  const refactorData = () => {
    const userMap = new Map();

    for (var i = 0; i < PRInfo.length; i++) {
      if (PRInfo[i].labels.length === 2) {
        let index = PRInfo[i].labels.indexOf((e) => e.name === "syn-accepted");

        const otherIndex = index === 0 ? 1 : 0;

        const increment = scoreMap.get(PRInfo.labels[otherIndex].name);

        if (userMap.has(PRInfo[i].user.login)) {
          const oldData = userMap.get(PRInfo[i].user.login);
          const newData = { ...oldData };
          newData.score = newData.score + increment;
          newData.pr++;
          userMap.set(PRInfo[i].user.login, newData);
        } else {
          const data = {
            image: PRInfo[i].user.avatar_url,
            pr: 1,
            issue: 0,
            score: increment,
          };
          userMap.set(PRInfo[i].user.login, data);
        }
      }

      // console.log(userMap);
      // console.log(PRInfo);
    }
  };

  useEffect(() => {
    getPRs();
  }, []);

  return null;
};

export default Table;
