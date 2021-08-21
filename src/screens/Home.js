import { useContext } from "react";
import Ribbon from "../components/Ribbon";
import { Global } from "..";
import difficulties from "../data/difficulties.yaml";

// colors for the respective difficulty levels
const colors = [
  {
    ribbon: ["text-sky-500", "text-sky-600", "text-sky-400"],
    button: ["hover:bg-sky-500", "focus:bg-sky-500"],
  },
  {
    ribbon: ["text-green-500", "text-green-600", "text-green-400"],
    button: ["hover:bg-green-500", "focus:bg-green-500"],
  },
  {
    ribbon: ["text-amber-500", "text-amber-600", "text-amber-400"],
    button: ["hover:bg-amber-500", "focus:bg-amber-500"],
  },
  {
    ribbon: ["text-rose-500", "text-rose-600", "text-rose-400"],
    button: ["hover:bg-rose-500", "focus:bg-rose-500"],
  },
  {
    ribbon: ["text-fuchsia-500", "text-fuchsia-600", "text-fuchsia-400"],
    button: ["hover:bg-fuchsia-500", "focus:bg-fuchsia-500"],
  },
  {
    ribbon: ["text-gray-800", "text-gray-900", "text-gray-700"],
    button: ["hover:bg-gray-900", "focus:bg-gray-900"],
  },
];

// home screen
const Home = () => (
  <>
    <main>
      <Title />
      <Score />
      <Difficulties />
    </main>
  </>
);

export default Home;

// the title
const Title = () => <h1 className="my-10 text-center text-3xl">WORD 4 WORD</h1>;

// score ribbon
const Score = () => {
  const { score, level } = useContext(Global);
  return (
    <div className="relative text-center text-lg text-white h-8 my-10">
      <div className="wiggle-parent flex justify-center items-center h-full">
        Total Score: {Math.round(score).toLocaleString()}
      </div>
      <Ribbon colors={colors[level].ribbon} />
    </div>
  );
};

// list of new game buttons
const Difficulties = () => {
  const { score } = useContext(Global);
  return (
    <div className="grid gap-5 mt-20">
      {difficulties.map((props, index) => (
        <Button
          key={index}
          {...props}
          colors={colors[index].button}
          locked={score < props.unlock}
        />
      ))}
      <Button
        text="Custom"
        colors={["hover:bg-gray-500", "focus:bg-gray-500"]}
      />
    </div>
  );
};

// new game button
const Button = ({ text, colors, locked, min, max, unlock = 0 }) => {
  // determine text when hovered
  let tooltip = text;
  if (!locked) {
    if (min && max) tooltip = `Pars ${min} to ${max}`;
    else tooltip = "Choose your own start and end words";
  }
  if (locked) tooltip = `Unlocks at ${unlock.toLocaleString()}`;

  return (
    <button
      data-tip={tooltip}
      className={[
        "group",
        "relative",
        "flex",
        "justify-center",
        "items-center",
        "w-full",
        "h-12",
        "text-lg",
        "bg-gray-200",
        locked ? "" : "hover:text-white focus:text-white",
        ...(locked ? [] : colors),
        locked ? "opacity-30" : "",
        "transition",
      ].join(" ")}
      style={{ cursor: locked ? "auto" : "pointer" }}
    >
      <span>{text}</span>
      {locked && (
        <i className={["fas", "fa-lock", "absolute", "right-5"].join(" ")} />
      )}
    </button>
  );
};
