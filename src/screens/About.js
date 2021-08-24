import { Fragment, useContext, useState, useMemo } from "react";
import { Global } from "..";
import Button from "../components/Button";
import difficulties from "../data/difficulties.yaml";

const About = () => (
  <>
    <header>
      <Title />
    </header>
    <main>
      <HowToPlay />
      <Dictionary />
      <Stats />
    </main>
  </>
);

export default About;

const Title = () => {
  const { setScreen } = useContext(Global);

  return (
    <>
      <h2>About Word 4 Word</h2>
      <Button text="Back" onClick={() => setScreen("home")} design="plain" />
    </>
  );
};

const HowToPlay = () => (
  <>
    <h3>How to Play</h3>
    <p>
      Connect a path from one 4-letter word to another by changing only one
      letter at a time, using valid words for each step in-between.
    </p>
    <p>
      The game has a <b>dictionary</b> of words that it considers valid. The
      dictionary is split into <b>regular</b> words, which are commonly known,
      and <b>special</b> words, which are less common but still somewhat known.{" "}
      <i>
        It also includes things like profanity, proper nouns, and abbreviations!
      </i>
    </p>
    <p>
      Each game has a <b>par</b> number. It is the shortest possible number of
      steps between the two words if you used only regular words. <b>Steps</b>{" "}
      are counted by the number of words used in the path, including the
      start/end words themselves. The lower your steps, the better your score.
      You get significant point bonuses for matching or beating par, and for
      using special words.
    </p>
    <p>
      When you choose a difficulty, the game <b>randomly selects</b> a pair of
      regular words from the dictionary that have a certain par. The higher the
      par, the more difficult the game, and the higher the point rewards.
      Complete more games to get more points and unlock more difficulty levels.
    </p>
  </>
);

// columns for dictionary table
const cols = [
  { name: "Word", align: "left", width: 100 },
  {
    name: "Type",
    tooltip: "Whether the word is considered regular or special",
    width: 100,
  },
  {
    name: "Links",
    tooltip: "How many words are one letter different",
    width: 100,
  },
  {
    name: "Regular Links",
    tooltip: "Regular words that are one letter different",
    align: "left",
    width: 400,
  },
  {
    name: "Special Links",
    tooltip: "Special words that are one letter different",
    align: "left",
    width: 400,
  },
];

const Dictionary = () => {
  const { dictionary } = useContext(Global);
  const [regular, setRegular] = useState(true);
  const [special, setSpecial] = useState(false);
  const [sortCol, setSortCol] = useState(0);
  const [sortDown, setSortDown] = useState(true);

  // set sort props on heading button click
  const onSort = (col) => {
    if (sortCol === col) setSortDown(!sortDown);
    else {
      setSortCol(col);
      setSortDown(true);
    }
  };

  // convert dictionary into list of pre-computed props ready for display
  const mapped = useMemo(
    () =>
      dictionary.map(({ text, type, links }) => {
        if (type === 1) type = "regular";
        else if (type === 2) type = "special";
        else type = "";

        const regular = links
          .filter(({ type }) => type === 1)
          .map(({ text }) => text)
          .join(" ");
        const special = links
          .filter(({ type }) => type === 2)
          .map(({ text }) => text)
          .join(" ");
        links = links.map(({ text }) => text).length;

        return [text, type, links, regular, special];
      }),
    [dictionary]
  );

  // sort and filter rows from mapped list
  const processed = useMemo(() => {
    const compare = (a, b) => {
      a = a[sortCol];
      b = b[sortCol];
      if (a?.length !== b?.length) {
        a = a.length;
        b = b.length;
      }
      if (a > b) return typeof a === "number" ? -1 : 1;
      if (a < b) return typeof a === "number" ? 1 : -1;
      return 0;
    };
    const sorted = mapped.sort(compare);
    if (!sortDown) sorted.reverse();

    const filtered = sorted.filter(([, type]) => {
      if (type === "regular") return regular;
      if (type === "special") return special;
      return false;
    });

    return filtered;
  }, [mapped, sortCol, sortDown, regular, special]);

  return (
    <>
      <h3>Dictionary</h3>
      <div className="mb-5">
        <label className="inline-block p-3 cursor-pointer">
          <input
            type="checkbox"
            className="mr-2"
            checked={regular}
            onChange={() => setRegular(!regular)}
          />
          <span>Regular Words</span>
        </label>
        <label className="inline-block p-3 cursor-pointer">
          <input
            type="checkbox"
            className="mr-2"
            value={regular}
            onChange={() => setSpecial(!special)}
          />
          <span>Special Words</span>
        </label>
      </div>
      <div className="max-h-96 overflow-x-auto overflow-y-auto text-center">
        <table className="w-full border-collapse">
          <thead>
            <tr className="sticky top-0 bg-white">
              {cols.map(({ name, tooltip, align }, index) => (
                <th key={index} data-tip={tooltip} className="p-0">
                  <button
                    className={[
                      "w-full",
                      "h-full",
                      "p-2",
                      "font-bold",
                      "hover:bg-gray-100",
                      "focus:bg-gray-100",
                      align === "left" ? "text-left" : "",
                      "transition-colors",
                    ].join(" ")}
                    onClick={() => onSort(index)}
                  >
                    {name} {sortCol === index && (sortDown ? "↓" : "↑")}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processed.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                {row.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={[
                      "p-2",
                      "align-top",
                      cols[colIndex].align === "left" ? "text-left" : "",
                    ].join(" ")}
                    style={{ minWidth: `${cols[colIndex].width}px` }}
                  >
                    {colIndex === 0 && (
                      <a
                        href={`https://google.com/search?q=define%3A+${col}`}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        {col}
                      </a>
                    )}
                    {colIndex > 0 && col}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const Stats = () => {
  const { dictionary, pars } = useContext(Global);

  // turn pars object into object of counts instead of words
  const parCounts = {};
  Object.entries(pars).forEach(
    ([key, value]) => (parCounts[key] = value.length)
  );

  // get basic stats
  const count = dictionary.length.toLocaleString();
  const regularCount = dictionary
    .filter(({ type }) => type === 1)
    .length.toLocaleString();
  const specialCount = dictionary
    .filter(({ type }) => type === 2)
    .length.toLocaleString();
  const parTotal = Object.entries(parCounts)
    .filter(([key]) => key > 2)
    .reduce((total, [, value]) => total + value, 0)
    .toLocaleString();
  const trivialCount = parCounts["2"].toLocaleString();
  const impossibleCount = parCounts["∞"].toLocaleString();

  // get graph data
  const width = 100;
  const height = 40;
  const padding = 5;
  const maxValue = Math.max(...Object.values(parCounts));
  const barWidth = width / (Object.keys(parCounts).length + 1) / 2;
  const bars = Object.entries(parCounts).map(([key, value], index, array) => ({
    x: ((index + 1) * width) / (array.length + 1),
    y: height / 20 + Math.sqrt(value / maxValue) * (height - height / 20),
    difficulty: difficulties.find(({ min, max }) => key >= min && key <= max),
    label: key,
    value,
  }));

  return (
    <>
      <h3>Fun Stats</h3>
      <p>
        The dictionary has <b>{regularCount}</b> regular words +{" "}
        <b>{specialCount}</b> special words = <b>{count}</b> total words.
        Between the regular words, there are <b>{parTotal}</b> unique games
        (pairs of words) to be played &ndash; not including the{" "}
        <b>{trivialCount}</b> trivial games where the start/end words are
        already one letter different from each other, or the{" "}
        <b>{impossibleCount}</b> impossible games where there is now way to
        connect the start/end words (using only regular words).
      </p>
      <p>Here is a distribution of the possible games with regular words:</p>
      <svg
        viewBox={`-${padding} -${height} ${width + 2 * padding} ${
          height + padding
        }`}
        className="my-10 overflow-visible"
      >
        {bars.map(({ x, y, difficulty, value, label }, index) => (
          <Fragment key={index}>
            <line
              fill="none"
              stroke="currentColor"
              strokeWidth={barWidth}
              className={[
                difficulty?.colors[0] || "text-gray-500",
                "outline-none",
              ].join(" ")}
              data-tip={`${value.toLocaleString()} games`}
              x1={x}
              x2={x}
              y1={0}
              y2={-y}
            />
            <text
              x={x}
              y="2"
              textAnchor="middle"
              alignmentBaseline="hanging"
              style={{ fontSize: "0.15rem" }}
            >
              {label}
            </text>
          </Fragment>
        ))}
        <path
          fill="none"
          stroke="black"
          strokeWidth={width / 500}
          d={`M 0 -${height} L 0 0 L ${width} 0`}
        />
        <text
          textAnchor="middle"
          style={{
            fontSize: "0.15rem",
            transform: `translate(${width / 2}px, ${padding * 1.5}px)`,
          }}
        >
          Par Number
        </text>
        <text
          textAnchor="middle"
          style={{
            fontSize: "0.15rem",
            transform: `translate(${-padding * 0.5}px, ${
              -height / 2
            }px) rotate(-90deg)`,
          }}
        >
          Number of Games
        </text>
      </svg>
    </>
  );
};
