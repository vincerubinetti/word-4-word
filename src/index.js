import { useState, createContext, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import Loading from "./screens/Loading";
import Home from "./screens/Home";
import Game from "./screens/Game";
import About from "./screens/About";
import difficulties from "./data/difficulties.yaml";
import { loadData } from "./data";
import { useStorage } from "./util/hooks";
import "./index.css";

// map of screen keys to components
const screens = { loading: Loading, home: Home, game: Game, about: About };

export const Global = createContext({});

const App = () => {
  // key/index of current screen
  const [screen, setScreen] = useStorage("home", "screen");
  // total score from played games
  const [score, setScore] = useStorage(0, "score");
  // dictionary of words
  const [dictionary, setDictionary] = useState([]);
  // list of word pars per par
  const [pars, setPars] = useState({});

  useEffect(() => {
    loadData().then(({ dictionary, pars }) => {
      setDictionary(dictionary);
      setPars(pars);
    });
  }, []);

  // max unlocked difficulty level
  let level = difficulties.findIndex(({ unlock }) => score < unlock);
  if (level === -1) level = difficulties.length - 1;
  else level--;

  // get screen component
  // const Screen = screens[screen];
  const Screen =
    dictionary.length && Object.keys(pars).length
      ? screens[screen]
      : screens.loading;

  // manually rebuild after every render because react-tooltip is bad
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <>
      <div id="app">
        <Global.Provider
          value={{
            screen,
            setScreen,
            score,
            setScore,
            level,
            dictionary,
            pars,
          }}
        >
          <Screen />
        </Global.Provider>
      </div>
      <ReactTooltip
        effect="solid"
        delayShow={100}
        delayUpdate={100}
        multiline={true}
      />
    </>
  );
};

export default App;
