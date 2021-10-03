import {
  Avatar,
  makeStyles,
  Card,
  CardHeader,
  CardActions,
  Typography,
  CardContent,
  Button,
  Grid,
  Chip,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import axios from "axios";
import "./UserComponent.css";

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
  avatar: {
    width: "50px",
    height: "50px",
  },
  align: {
    marginTop: "40px",
    justifyContent: "center",
  },
  author: {
    fontSize: "20px",
    fontFamily: "Trebuchet MS ,sans-serif",
    color: "#1b294a",
    fontWeight: "600",
    marginTop: "7px",
  },
  chip: {
    backgroundColor: "#ebf7ff",
    border: "0px",
    padding: "5px",
    color: "#77dce6",
    fontWeight: "700",
  },
  card1: {
    boxShadow: "0px 0px 5px 5px rgb(0,0,0,0.05) ",
    backgroundColor: "white",
    transition: "all 0.2s",
    borderRadius: "0px",
  },
}));

const UserComponent = () => {
  const classes = useStyles();
  const [author, setAuthor] = useState("");
  const [userInfo, setUserInfo] = useState({
    image: null,
    PR: 0,
    issues: 0,
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

  const getPRs = (userID) => {
    axios
      .get(
        `https://api.github.com/search/issues?q=org:Dummy-Organ+is:pr+is:merged+label:"syn-accepted"+author:"${userID}"`
      )
      .then((response) => {
        // console.log(response.data);

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

  const getContributorIssues = (userID) => {
    axios
      .get(
        `https://api.github.com/search/issues?q=org:Dummy-Organ+is:issue+label:"syn-accepted"+author:"${userID}"`
      )
      .then((response) => {
        // console.log(response.data);

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
    console.log(PRs);
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
    console.log(issues);
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

  const getData = (username) => {
    getPRs(username);
    getContributorIssues(username);
  };

  useEffect(() => {
    const url = window.location.pathname;
    const username = url.split("/")[2];
    setAuthor(username);
    getData(username);
  }, []);

  useEffect(() => {
    if (PRInfo && issueInfo) {
      // refactorData();
      processData();
    }
  }, [PRInfo, issueInfo]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        flexWrap: "wrap",
      }}
    >
      <Grid container className={classes.align} spacing={1}>
        <Grid item lg={4} md={10} xs={12}>
          <Card className={classes.card1}>
            <CardContent id="user-header" style={{ textAlign: "center" }}>
              <Avatar
                aria-label="recipe"
                src={userInfo.image}
                className={classes.avatar}
              />
              <Typography
                gutterBottom
                component="div"
                className={classes.author}
              >
                {author}
              </Typography>
              <Chip
                label={`Points achieved ${userInfo.points}`}
                variant="outlined"
                className={classes.chip}
              />
            </CardContent>
            <CardActions>
              <Chip
                label={`Points achieved ${userInfo.points}`}
                variant="outlined"
                className={classes.chip1}
              />
              <Chip
                label={`Points achieved ${userInfo.points}`}
                variant="outlined"
                className={classes.chip1}
              />
              <Chip
                label={`Points achieved ${userInfo.points}`}
                variant="outlined"
                className={classes.chip1}
              />
            </CardActions>
          </Card>
        </Grid>
        <Grid item lg={6} md={10} xs={12}>
          <Card>
            <CardContent id="user-header" style={{ textAlign: "center" }}>
              {/* <Avatar
                aria-label="recipe"
                src={userInfo.image}
                classes={classes.avatar}
              /> */}
              <Typography gutterBottom variant="h5" component="div">
                {author}
              </Typography>
              <Typography variant="body2">
                Lizards are a widespread group of squamate reptiles, with over
                6,000 species, ranging across all continents except Antarctica
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Share</Button>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserComponent;
