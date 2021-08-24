import { useContext } from "react";
import Ribbon from "../components/Ribbon";
import Button from "../components/Button";
import { Global } from "..";
import difficulties from "../data/difficulties.yaml";

// home screen
const Home = () => (
  <>
    <header>
      <Title />
      <Score />
    </header>
    <main>
      <Difficulties />
    </main>
    <footer>
      <Info />
    </footer>
  </>
);

export default Home;

// the title
const Title = () => <h1>WORD 4 WORD</h1>;

// score ribbon
const Score = () => {
  const { score } = useContext(Global);
  return <Ribbon>Total Score: {Math.round(score).toLocaleString()}</Ribbon>;
};

// list of new game buttons
const Difficulties = () => {
  const { score } = useContext(Global);
  return (
    <div className="grid gap-5 justify-items-stretch">
      {difficulties.map(({ text, min, max, unlock, colors }, index) => (
        <Button
          key={index}
          text={text}
          colors={[colors[3], colors[4]]}
          locked={score < unlock}
          tooltip={
            score < unlock
              ? `Unlocks at ${unlock.toLocaleString()}`
              : `Pars ${min} to ${max}`
          }
        />
      ))}
      <Button
        text="Custom"
        className="mt-5"
        locked={score < 10}
        tooltip="Choose your own start and end words. Unlocks at 10."
      />
    </div>
  );
};

// info button
const Info = () => {
  const { setScreen } = useContext(Global);
  return (
    <Button
      text="About"
      design="plain"
      onClick={() => setScreen("about")}
      tooltip="How to play, list of words, and other fun stuff"
    />
  );
};
