import "./App.css";
import Leaderboard from "./Leaderboard.js";
import UserComponent from "./components/userComponent";
import { Switch, Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/" exact>
            <Leaderboard />{" "}
          </Route>
          <Route path="/user">
            <UserComponent />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
