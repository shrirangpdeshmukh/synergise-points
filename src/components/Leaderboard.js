import { React, useState, useEffect } from "react";

import TableComponent from "./TableComponent";

import store from "../store/reducer";
import * as boardActions from "../store/boardActions";
import axios from "axios";

import processPRs from "./processPRs";
import processIssues from "./processIssues";

const Table = () => {
  const [PRInfo, setPRInfo] = useState(null);
  const [issueInfo, setIssueInfo] = useState(null);
  const [data, setData] = useState(null);

  /**
   * GitHub ID : {Image, Score, No.of PRs Merged, No. of Issues Created }
   */

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
      });
  };

  const processData = () => {
    const userMap = new Map();
    processPRs(userMap, PRInfo);
    processIssues(userMap, issueInfo);

    console.log([...userMap.entries()]);
    store.dispatch(boardActions.setLeaderBoardData([...userMap.entries()]));
    localStorage.setItem("users_data", JSON.stringify([...userMap.entries()]));
    setData([...userMap.entries()]);
  };

  const getData = () => {
    getPRs();
    getContributorIssues();
  };

  const loadFromStorage = () => {
    // const usersData = store.getState().usersData;
    const usersData = JSON.parse(localStorage.getItem("users_data"));
    if (usersData) {
      setData(usersData);
    }

    getData();
  };

  useEffect(() => {
    // getData();
    loadFromStorage();
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
