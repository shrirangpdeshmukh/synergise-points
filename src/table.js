import { React, useState, useEffect } from "react";

import axios from "axios";

const Table = () => {
  const [pointsArray, setPointsArray] = useState([]);

  const getPRs = () => {
    axios
      .get(
        "https://api.github.com/search/issues?q=org:Code4BBS+is:pr+is:merged"
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => getPRs(), []);

  return null;
};

export default Table;
