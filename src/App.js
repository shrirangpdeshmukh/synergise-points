import "./App.css";
import Leaderboard from "./components/Leaderboard";
import UserComponent from "./components/userComponent";
import {
  Switch,
  Route,
  BrowserRouter,
  Redirect,
  useHistory,
} from "react-router-dom";

function App() {
  const history = useHistory();

  return (
    <div className="App">
      <header>
        <h1
          onClick={() => {
            history.push("/");
          }}
          style={{
            padding: "20px 0px",
            margin: "0px 30px",
            color: "rgb(26, 90, 189)",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          Synergise
        </h1>
      </header>

      <Switch>
        <Route path="/" exact>
          <Leaderboard />{" "}
        </Route>
        <Route path="/user">
          <UserComponent />
        </Route>
        <Redirect from="*" to="/" />
      </Switch>
    </div>
  );
}

export default App;
