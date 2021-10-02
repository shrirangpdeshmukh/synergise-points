import {
  Avatar,
  makeStyles,
  Card,
  CardHeader,
  CardActions,
  Typography,
  CardContent,
  Button,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import axios from "axios";

const useStyles = makeStyles(() => ({
  row: {
    boxShadow: "0px 0px 5px 5px rgb(0,0,0,0.05) ",
    backgroundColor: "white",
    transition: "all 0.2s",
    cursor: "pointer",
    "&:hover": {
      boxShadow: "0px 0px 10px 6px rgb(0,0,0,0.1) ",
      //   transform: "scale(1.01)",
    },
  },
  cell: {
    border: "0px",
    padding: "10px 0px",
  },
  table: {
    width: "90vw",
    borderSpacing: "0px 8px",
    borderCollapse: "separate",
  },
}));

const UserComponent = () => {
  const classes = useStyles();
  const [userImage, setUserImage] = useState(null);
  const [points, setPoints] = useState(0);
  const [PR, setPR] = useState(0);
  const [issues, setIssues] = useState(0);
  const [PRInfo, setPRInfo] = useState(null);
  const [issueInfo, setIssueInfo] = useState(null);
  const [PRArray, setPRArray] = useState([]);
  const [issueArray, setIssueArray] = useState([]);

  const scoreMap = new Map([
    ["syn-easy", 10],
    ["syn-medium", 25],
    ["syn-hard", 40],
  ]);

  const getPRs = (userId) => {
    axios
      .get(
        `https://api.github.com/search/issues?q=org:Dummy-Organ+is:pr+is:merged+label:"syn-accepted"+author:"${userId}"`
      )
      .then((response) => {
        console.log(response.data);
        setPR(response.data.total_count);
        setPRInfo(response.data.items);
        if (userImage === null && response.data.total_count > 0) {
          setUserImage(response.data.items[0].user.avatar_url);
        }
      })
      .catch((error) => console.error(error));
  };

  const getContributorIssues = (userId) => {
    axios
      .get(
        `https://api.github.com/search/issues?q=org:Dummy-Organ+is:issue+label:"syn-accepted"+author:"${userId}"`
      )
      .then((response) => {
        console.log(response.data);
        setIssues(response.data.total_count);
        setIssueInfo(response.data.items);
        if (userImage === null && response.data.total_count > 0) {
          setUserImage(response.data.items[0].user.avatar_url);
        }
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
    setPoints(score);
  };

  useEffect(() => {
    const url = window.location.pathname;
    const username = url.split("/")[2];

    getPRs(username);
    getContributorIssues(username);
  }, []);

  useEffect(() => {
    if (PRInfo && issueInfo) {
      refactorData();
    }
  }, [PRInfo, issueInfo]);

  return (
    <div
      style={{ display: "flex", justifyContent: "center", paddingTop: "50px" }}
    >
      <Card sx={{ maxWidth: 345 }}>
        <CardHeader
          avatar={<Avatar aria-label="recipe" src={userImage} />}
          title="Shrimp and Chorizo Paella"
          subheader="September 14, 2016"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Lizard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Share</Button>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default UserComponent;
