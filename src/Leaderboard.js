import { React, useState, useEffect } from "react";
import store from "./store/reducer";
import * as boardActions from "./store/boardActions";
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
        'https://api.github.com/search/issues?q=org:Dummy-Organ+is:pr+is:merged+label:"syn-accepted"'
      )
      .then((response) => {
        console.log(response.data);
        setPRInfo(response.data.items);
      })
      .catch((error) => console.error(error));
  };

  const refactorData = () => {
    const userMap = new Map();

    for (var i = 0; i < PRInfo.length; i++) {
      if (PRInfo[i].labels.length > 0) {
        let increment = 0;
        for (let label of PRInfo[i].labels) {
          if (scoreMap.has(label.name)) {
            increment = scoreMap.get(label.name);
            break;
          }
        }

        console.log(increment);

        if (increment > 0) {
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
      }
      // console.log(userMap);
      // console.log(PRInfo);
    }

    console.log([...userMap.entries()]);
    store.dispatch(boardActions.setLeaderBoardData([...userMap.entries()]));
  };

  useEffect(() => {
    getPRs();
  }, []);

  useEffect(() => {
    if (PRInfo.length > 0) {
      refactorData();
    }
  }, [PRInfo]);

  return null;
};

export default Table;
