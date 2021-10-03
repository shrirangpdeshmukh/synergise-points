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
import store from "../store/reducer";

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
  icon: {
    borderRadius: "50%",
    backgroundColor: "green",
    fontSize: "16px",
    padding: "2px 10px",
  },
  span: {
    position: "relative",
    bottom: "6px",
    left: "2px",
    fontWeight: "500",
  },
}));

const UserComponent = () => {
  const classes = useStyles();
  const url = window.location.pathname;
  const username = url.split("/")[2];
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

  // const getPRs = (userID) => {
  //   axios
  //     .get(
  //       `https://api.github.com/search/issues?q=org:Dummy-Organ+is:pr+is:merged+label:"syn-accepted"`
  //     )
  //     .then((response) => {
  //       // console.info(response.data);

  //       const newData = { ...userInfo };
  //       newData.PR = response.data.total_count;
  //       if (newData.image === null && response.data.total_count > 0) {
  //         newData.image = response.data.items[0].user.avatar_url;
  //       }

  //       setUserInfo(newData);
  //       setPRInfo(response.data.items);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       // loadDataFromRedux(userID);
  //     });
  // };
  const getPRs = () => {
    axios
      .get(
        'https://api.github.com/search/issues?q=org:Dummy-Organ+is:pr+is:merged+label:"syn-accepted"'
      )
      .then((response) => {
        console.info(response.data);
        setPRInfo(response.data.items);
      })
      .catch((error) => {
        console.error(error);
        // loadFromRedux();
      });
  };

  // const getContributorIssues = (userID) => {
  //   axios
  //     .get(
  //       `https://api.github.com/search/issues?q=org:Dummy-Organ+is:issue+label:"syn-accepted"`
  //     )
  //     .then((response) => {
  //       // console.info(response.data);

  //       const newData = { ...userInfo };
  //       newData.issues = response.data.total_count;

  //       if (newData.image === null && response.data.total_count > 0) {
  //         newData.image = response.data.items[0].user.avatar_url;
  //       }

  //       setUserInfo(newData);
  //       setIssueInfo(response.data.items);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       // loadDataFromRedux(userID);
  //     });
  // };

  const getContributorIssues = () => {
    axios
      .get(
        'https://api.github.com/search/issues?q=org:Dummy-Organ+is:issue+label:"syn-accepted"'
      )
      .then((response) => {
        console.info(response.data);
        setIssueInfo(response.data.items);
      })
      .catch((error) => {
        console.error(error);
        // loadFromRedux();
      });
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

  // const processPRs = () => {
  //   let score = 0;
  //   let difficultyMap = new Map([
  //     ["syn-easy", 0],
  //     ["syn-medium", 0],
  //     ["syn-hard", 0],
  //   ]);

  //   const PRs = [];
  //   for (let PR of PRInfo) {
  //     const difficulty = getDifficulty(PR.labels);
  //     score += scoreMap.get(difficulty);
  //     difficultyMap.set(difficulty, difficultyMap.get(difficulty) + 1);

  //     PRs.push({
  //       link: PR.html_url,
  //       title: PR.title,
  //       difficulty: difficulty.split("-")[1],
  //       repo: getRepo(PR.repository_url),
  //     });
  //   }
  //   // console.info(PRs);
  //   const result = [...difficultyMap.entries(), score];

  //   setPRArray(PRs);
  //   return result;
  // };

  // const processIssues = () => {
  //   let score = 0;
  //   const issues = [];
  //   for (let issue of issueInfo) {
  //     score += 4;
  //     issues.push({
  //       link: issue.html_url,
  //       title: issue.title,
  //       repo: getRepo(issue.repository_url),
  //     });
  //   }
  //   // console.info(issues);
  //   setIssueArray(issues);
  //   return score;
  // };

  const getIncrement = (labels) => {
    for (let label of labels) {
      if (scoreMap.has(label.name)) {
        return scoreMap.get(label.name);
      }
    }

    return 0;
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

  const processData = (currentUser) => {
    // console.info(currentUser);

    const newData = { ...currentUser };
    const userPrs = newData.PRs;
    // console.info(userPrs);
    let diffMap = new Map([
      ["very_easy", 0],
      ["easy", 0],
      ["medium", 0],
      ["hard", 0],
    ]);

    for (let PR of userPrs) {
      diffMap.set(PR.difficulty, diffMap.get(PR.difficulty) + 1);
    }
    newData.easy = diffMap.get("easy");
    newData.medium = diffMap.get("medium");
    newData.hard = diffMap.get("hard");
    newData.very_easy = diffMap.get("very_easy");

    setUserInfo(newData);
  };

  const processUsersData = () => {
    const userMap = new Map();
    processPRs(userMap);
    processIssues(userMap);

    console.info([...userMap.entries()]);
    // store.dispatch(boardActions.setLeaderBoardData([...userMap.entries()]));
    localStorage.setItem("users_data", JSON.stringify([...userMap.entries()]));

    const currentUser = userMap.get(username);
    console.info(currentUser);
    processData(currentUser);
    // setData([...userMap.entries()]);
  };

  const getData = (username) => {
    console.info("axios requests");
    getPRs(username);
    getContributorIssues(username);
  };

  const loadDataFromRedux = (username) => {
    // const usersData = store.getState().usersData;
    const usersData = JSON.parse(localStorage.getItem("users_data"));
    if (usersData) {
      const userData = usersData.find((data) => data[0] === username);
      // console.info(userData);
      if (userData) {
        const PRs = userData[1].PRs;
        const issues = userData[1].issues;
        setPRArray(PRs);
        setIssueArray(issues);
        processData(userData[1]);
        // setUserInfo(userData[1]);
      }
    }
    setLoading(false);
    getData(username);
  };

  useEffect(() => {
    setAuthor(username);
    // getData(username);
    loadDataFromRedux(username);
  }, []);

  useEffect(() => {
    if (PRInfo && issueInfo) {
      // refactorData();
      processUsersData();
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
      {!loading ? (
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
                  label={`Points achieved ${userInfo.score}`}
                  variant="outlined"
                  className={classes.chip}
                />
              </CardContent>
              <CardActions
                style={{ display: "flex", justifyContent: "space-evenly" }}
              >
                <p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width={24}
                    height={24}
                    viewBox="0 0 172 172"
                    style={{ fill: "#000000" }}
                  >
                    <g
                      fill="none"
                      fillRule="nonzero"
                      stroke="none"
                      strokeWidth={1}
                      strokeLinecap="butt"
                      strokeLinejoin="miter"
                      strokeMiterlimit={10}
                      strokeDasharray
                      strokeDashoffset={0}
                      fontFamily="none"
                      fontWeight="none"
                      fontSize="none"
                      textAnchor="none"
                      style={{ mixBlendMode: "normal" }}
                    >
                      <path d="M0,172v-172h172v172z" fill="none" />
                      <g fill="#2ecc71">
                        <path d="M86,14.33333c-39.5815,0 -71.66667,32.08517 -71.66667,71.66667c0,39.5815 32.08517,71.66667 71.66667,71.66667c39.5815,0 71.66667,-32.08517 71.66667,-71.66667c0,-39.5815 -32.08517,-71.66667 -71.66667,-71.66667zM94.93325,78.83333c0.01075,0 0.01792,0 0.02508,0c2.95625,0 5.36067,2.39008 5.375,5.34992c0.01433,2.97058 -2.38292,5.38575 -5.34992,5.40008l-19.72625,0.086l0.00358,17.845l26.86067,-0.01433h0.00358c2.967,0 5.37142,2.40442 5.375,5.37142c0.00358,2.97058 -2.40442,5.375 -5.37142,5.37858l-32.23925,0.01792h-0.00358c-1.42258,0 -2.79142,-0.56617 -3.80192,-1.57308c-1.0105,-1.00692 -1.57308,-2.37575 -1.57308,-3.80192l-0.01075,-57.35125c0,-1.42617 0.56617,-2.79142 1.57308,-3.80192c1.0105,-1.00692 2.37933,-1.57308 3.80192,-1.57308h32.25c2.967,0 5.375,2.40442 5.375,5.375c0,2.97058 -2.408,5.375 -5.375,5.375h-26.87142l0.00358,18.00267z" />
                      </g>
                    </g>
                  </svg>
                  <span className={classes.span}>{userInfo.easy}</span>
                </p>
                <p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width={24}
                    height={24}
                    viewBox="0 0 172 172"
                    style={{ fill: "#000000" }}
                  >
                    <g
                      fill="none"
                      fillRule="nonzero"
                      stroke="none"
                      strokeWidth={1}
                      strokeLinecap="butt"
                      strokeLinejoin="miter"
                      strokeMiterlimit={10}
                      strokeDasharray
                      strokeDashoffset={0}
                      fontFamily="none"
                      fontWeight="none"
                      fontSize="none"
                      textAnchor="none"
                      style={{ mixBlendMode: "normal" }}
                    >
                      <path d="M0,172v-172h172v172z" fill="none" />
                      <g fill="#f1c40f">
                        <path d="M86,14.33333c-39.5815,0 -71.66667,32.08517 -71.66667,71.66667c0,39.5815 32.08517,71.66667 71.66667,71.66667c39.5815,0 71.66667,-32.08517 71.66667,-71.66667c0,-39.5815 -32.08517,-71.66667 -71.66667,-71.66667zM118.25,116.45833c0,2.97058 -2.40442,5.375 -5.375,5.375c-2.97058,0 -5.375,-2.40442 -5.375,-5.375v-47.32508l-17.57983,18.75158c-2.03175,2.16792 -5.80858,2.16792 -7.84033,0l-17.57983,-18.75158v47.32508c0,2.97058 -2.40442,5.375 -5.375,5.375c-2.97058,0 -5.375,-2.40442 -5.375,-5.375v-60.91667c0,-2.20733 1.34733,-4.18533 3.397,-4.99875c2.05325,-0.80983 4.39317,-0.28667 5.89817,1.32225l22.95483,24.48492l22.95483,-24.48492c1.50858,-1.60892 3.8485,-2.13208 5.89817,-1.32225c2.04967,0.81342 3.397,2.79142 3.397,4.99875z" />
                      </g>
                    </g>
                  </svg>
                  <span className={classes.span}>{userInfo.medium}</span>
                </p>
                <p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width={24}
                    height={24}
                    viewBox="0 0 172 172"
                    style={{ fill: "#000000" }}
                  >
                    <g
                      fill="none"
                      fillRule="nonzero"
                      stroke="none"
                      strokeWidth={1}
                      strokeLinecap="butt"
                      strokeLinejoin="miter"
                      strokeMiterlimit={10}
                      strokeDasharray
                      strokeDashoffset={0}
                      fontFamily="none"
                      fontWeight="none"
                      fontSize="none"
                      textAnchor="none"
                      style={{ mixBlendMode: "normal" }}
                    >
                      <path d="M0,172v-172h172v172z" fill="none" />
                      <g fill="#e74c3c">
                        <path d="M86,14.33333c-39.5815,0 -71.66667,32.08517 -71.66667,71.66667c0,39.5815 32.08517,71.66667 71.66667,71.66667c39.5815,0 71.66667,-32.08517 71.66667,-71.66667c0,-39.5815 -32.08517,-71.66667 -71.66667,-71.66667zM111.08333,112.83917c0,2.97058 -2.408,5.375 -5.375,5.375c-2.967,0 -5.375,-2.40442 -5.375,-5.375v-23.25225l-28.6595,0.06092l0.00358,23.21283c0,2.97058 -2.408,5.375 -5.375,5.375c-2.967,0 -5.375,-2.40442 -5.375,-5.375l-0.01075,-57.35125c0,-2.967 2.40442,-5.375 5.37142,-5.375c0.00358,0 0.00358,0 0.00358,0c2.967,0 5.375,2.40442 5.375,5.375l0.00358,23.392l28.66308,-0.0645v-23.29525c0,-2.97058 2.408,-5.375 5.375,-5.375c2.967,0 5.375,2.40442 5.375,5.375z" />
                      </g>
                    </g>
                  </svg>
                  <span className={classes.span}>{userInfo.hard}</span>
                </p>
                <p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width={24}
                    height={24}
                    viewBox="0 0 172 172"
                    style={{ fill: "#000000" }}
                  >
                    <g
                      fill="none"
                      fillRule="nonzero"
                      stroke="none"
                      strokeWidth={1}
                      strokeLinecap="butt"
                      strokeLinejoin="miter"
                      strokeMiterlimit={10}
                      strokeDasharray
                      strokeDashoffset={0}
                      fontFamily="none"
                      fontWeight="none"
                      fontSize="none"
                      textAnchor="none"
                      style={{ mixBlendMode: "normal" }}
                    >
                      <path d="M0,172v-172h172v172z" fill="none" />
                      <g fill="#9b59b6">
                        <path d="M86,14.33333c-39.5815,0 -71.66667,32.08517 -71.66667,71.66667c0,39.5815 32.08517,71.66667 71.66667,71.66667c39.5815,0 71.66667,-32.08517 71.66667,-71.66667c0,-39.5815 -32.08517,-71.66667 -71.66667,-71.66667zM91.375,116.45833c0,2.97058 -2.40442,5.375 -5.375,5.375c-2.97058,0 -5.375,-2.40442 -5.375,-5.375v-57.33333c0,-2.97058 2.40442,-5.375 5.375,-5.375c2.97058,0 5.375,2.40442 5.375,5.375z" />
                      </g>
                    </g>
                  </svg>
                  <span className={classes.span}>{userInfo.issue}</span>
                </p>
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
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

export default UserComponent;
