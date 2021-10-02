import {
  Avatar,
  makeStyles,
  Card,
  CardMedia,
  CardActions,
  Typography,
  CardContent,
  Button,
} from "@material-ui/core";
import { useEffect, useState } from "react";

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
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const url = window.location.pathname;
    const username = url.split("/")[2];
    setAuthor(username);
  }, []);

  return (
    <div
      style={{ display: "flex", justifyContent: "center", paddingTop: "50px" }}
    >
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          height="140"
          image="/static/images/cards/contemplative-reptile.jpg"
          alt="green iguana"
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
