import { React, useState, useEffect } from "react";

import axios from "axios";

const Table = () => {
  // const [pointsArray, setPointsArray] = useState([]);
  const [PRInfo, setPRInfo] = useState([]);
  /**
   * User:
   * GitHub ID
   * Image
   * Score
   * PRs
   * Issues
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
        console.log(scoreMap.get("syn-easy"));
      })
      .catch((error) => console.error(error));
  };

  const refactorData = () => {
    const userMap = new Map();

    for (var i = 0; i < PRInfo.length; i++) {
      if (PRInfo[i].labels.length > 0) {
      }
    }

    console.log(PRInfo);
  };

  useEffect(() => {
    getPRs();
  }, []);

  return null;
};

export default Table;
