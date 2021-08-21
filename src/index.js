import { createContext } from "react";
import ReactTooltip from "react-tooltip";
import Home from "./screens/Home";
import Game from "./screens/Game";
import { useStorage } from "./util/hooks";
import difficulties from "./data/difficulties.yaml";
import "./index.css";

// map of screen keys to components
const screens = { home: Home, game: Game };

export const Global = createContext({});

const App = () => {
  // key/index of current screen
  const [screen, setScreen] = useStorage("home", "screen");
  // total score from played games
  const [score, setScore] = useStorage(0, "score");

  // max unlocked difficulty level
  let level = difficulties.findIndex(({ unlock }) => score < unlock);
  if (level === -1) level = difficulties.length - 1;
  else level--;

  // get screen component
  const Screen = screens[screen];

  return (
    <>
      <Global.Provider value={{ screen, setScreen, score, setScore, level }}>
        <Screen />
      </Global.Provider>
      <ReactTooltip effect="solid" delayShow={200} delayUpdate={200} />
    </>
  );
};

export default App;
