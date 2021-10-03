import "./App.css";
import Leaderboard from "./components/Leaderboard";
import UserComponent from "./components/userComponent";
import { Switch, Route, BrowserRouter, Redirect } from "react-router-dom";

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
          <Redirect from="*" to="/" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
