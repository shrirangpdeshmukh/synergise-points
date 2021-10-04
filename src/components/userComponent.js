import {
  Avatar,
  makeStyles,
  Card,
  // CardHeader,
  CardActions,
  Typography,
  CardContent,
  Button,
  Grid,
  Chip,
  Paper,
  SvgIcon,
  Tooltip,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import axios from "axios";
import "./UserComponent.css";
import processPRs from "./processPRs";
import processIssues from "./processIssues";
import { useHistory } from "react-router-dom";
// import store from "../store/reducer";

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
    marginLeft: "10px",
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
  title: {
    fontWeight: "600",
    marginLeft: "5px",
  },
}));

const UserComponent = () => {
  const classes = useStyles();
  const history = useHistory();

  const url = window.location.pathname;
  const username = url.split("/")[2];
  const [author, setAuthor] = useState("");
  const [userInfo, setUserInfo] = useState({
    image: null,
    PR: 0,
    issue: 0,
    score: 0,
    diff: [0, 0, 0, 0],
  });

  const [loading, setLoading] = useState(true);

  const [PRArray, setPRArray] = useState([]);
  const [issueArray, setIssueArray] = useState([]);

  const [PRInfo, setPRInfo] = useState(null);
  const [issueInfo, setIssueInfo] = useState(null);

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

  const processUsersData = () => {
    const userMap = new Map();
    processPRs(userMap, PRInfo);
    processIssues(userMap, issueInfo);

    console.log([...userMap.entries()]);

    localStorage.setItem("users_data", JSON.stringify([...userMap.entries()]));

    console.log("PrcoessUserData");
    console.log([...userMap.entries()]);

    const currentUser = userMap.get(username);
    console.log(currentUser);
    setUserInfo(currentUser);
  };

  const getData = (username) => {
    console.log("axios requests");
    getPRs(username);
    getContributorIssues(username);
  };

  const loadDataFromStorage = (username) => {
    const usersData = JSON.parse(localStorage.getItem("users_data"));
    if (usersData) {
      const userData = usersData.find((data) => data[0] === username);

      console.log("Loading user data");
      console.log(userData);

      if (userData) {
        const PRs = userData[1].PRs;
        const issues = userData[1].issues;

        console.log(usersData[1]);

        setPRArray(PRs);
        setIssueArray(issues);
        setUserInfo(userData[1]);
      }
    }
    setLoading(false);
    getData(username);
  };

  useEffect(() => {
    setAuthor(username);
    loadDataFromStorage(username);
  }, []);

  useEffect(() => {
    if (PRInfo && issueInfo) {
      processUsersData();
    }
  }, [PRInfo, issueInfo]);

  const redirectTo = (link) => {
    // history.replace(link);
    window.location.href = link;
  };

  const cardContent = (PR, ind) => {
    let chipColor = "#2ECC71";
    if (PR.difficulty === "medium") chipColor = "#F1C40F";
    else if (PR.difficulty === "hard") chipColor = "#E74C3C";

    return (
      <div id="paper">
        <Paper
          className={classes.paper}
          key={ind}
          // style={{ maxWidth: "500px", margin: "10px", padding: "10px" }}
        >
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item style={{ marginRight: "5px" }}>
              <svg
                aria-hidden="true"
                height="16"
                viewBox="0 0 16 16"
                version="1.1"
                width="16"
                data-view-component="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"
                ></path>
              </svg>
            </Grid>
            <Grid>
              <Typography className={classes.title}>{PR.title}</Typography>
              <Typography noWrap style={{ fontSize: "14px" }}>
                {new Date(PR.time).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid
              item
              xs
              style={{ display: "flex", justifyContent: "space-evenly" }}
            >
              <Chip
                label={PR.repo}
                variant="outlined"
                className={classes.chip}
                style={{ backgroundColor: "#5D3F6A", color: "white" }}
                onClick={() => redirectTo(PR.repoLink)}
              />
              <Chip
                label={PR.difficulty}
                variant="outlined"
                className={classes.chip}
                style={{ backgroundColor: chipColor, color: "white" }}
              />
            </Grid>
            <Grid item xs style={{ right: "10px", textAlign: "right" }}>
              <SvgIcon
                style={{ cursor: "pointer" }}
                onClick={() => redirectTo(PR.link)}
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  class="css-13o7eu2"
                >
                  <path
                    d="M15 0H8v2h4.6L6.3 8.3l1.4 1.4L14 3.4V8h2V1c0-.6-.4-1-1-1z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M14 16H1c-.6 0-1-.4-1-1V2c0-.6.4-1 1-1h4v2H2v11h11v-3h2v4c0 .6-.4 1-1 1z"
                    fill="currentColor"
                  ></path>
                </svg>{" "}
              </SvgIcon>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  };

  const issueContent = (issue, ind) => {
    console.log(issue);
    return (
      <div id="paper">
        <Paper
          className={classes.paper}
          key={ind}
          // style={{ maxWidth: "500px", margin: "10px", padding: "10px" }}
        >
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item style={{ marginRight: "5px" }}>
              <svg
                aria-hidden="true"
                height="15"
                viewBox="0 0 16 16"
                version="1.1"
                width="15"
                data-view-component="true"
                style={{ transform: "translate(0px,1px)" }}
              >
                <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                <path
                  fillRule="evenodd"
                  d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"
                ></path>
              </svg>
            </Grid>
            <Grid>
              <Typography className={classes.title}>{issue.title}</Typography>
              <Typography noWrap style={{ fontSize: "14px" }}>
                {new Date(issue.time).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid
              item
              xs
              style={{ display: "flex", justifyContent: "space-evenly" }}
            >
              <Chip
                label={issue.repo}
                variant="outlined"
                className={classes.chip}
                style={{ backgroundColor: "#5D3F6A", color: "white" }}
                onClick={() => redirectTo(issue.repoLink)}
              />
            </Grid>
            <Grid item xs style={{ right: "10px", textAlign: "right" }}>
              <SvgIcon
                style={{ cursor: "pointer" }}
                onClick={() => (window.location.href = issue.link)}
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  class="css-13o7eu2"
                >
                  <path
                    d="M15 0H8v2h4.6L6.3 8.3l1.4 1.4L14 3.4V8h2V1c0-.6-.4-1-1-1z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M14 16H1c-.6 0-1-.4-1-1V2c0-.6.4-1 1-1h4v2H2v11h11v-3h2v4c0 .6-.4 1-1 1z"
                    fill="currentColor"
                  ></path>
                </svg>{" "}
              </SvgIcon>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  };
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
                <Tooltip title="easy" placement="top">
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
                    <span className={classes.span}>{userInfo.diff[1]}</span>
                  </p>
                </Tooltip>
                <Tooltip title="medium" placement="top">
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
                    <span className={classes.span}>{userInfo.diff[2]}</span>
                  </p>
                </Tooltip>
                <Tooltip title="hard" placement="top">
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
                    <span className={classes.span}>{userInfo.diff[3]}</span>
                  </p>
                </Tooltip>
                <Tooltip title="issues" placement="top">
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
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
          <Grid item lg={6} md={10} xs={12}>
            <Card style={{ backgroundColor: "#FFFFFF" }}>
              <CardContent id="user-header" style={{ textAlign: "center" }}>
                {/* <Avatar
                aria-label="recipe"
                src={userInfo.image}
                classes={classes.avatar}
              /> */}
                <Typography gutterBottom variant="h5" component="div">
                  Activity
                </Typography>

                <div>{PRArray.map((PR, ind) => cardContent(PR, ind))}</div>

                <div>
                  {issueArray.map((issue, ind) => issueContent(issue, ind))}
                </div>
              </CardContent>
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
