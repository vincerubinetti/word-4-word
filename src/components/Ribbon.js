import { useEffect, useState, useRef } from "react";

const Ribbon = ({ colors }) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const ref = useRef();

  // set width relative to height such that center segment covers parent fully
  useEffect(() => {
    const onResize = () => {
      if (!ref.current) return;
      const { clientWidth, clientHeight } = ref.current;
      setWidth(clientWidth);
      setHeight(clientHeight);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // calc other dimensions relative to ribbon height
  const creaseH = 0.5 * height; // horizontal length of crease segment
  const creaseV = 0.3 * height; // vertical length of crease segment
  const tail = 1.5 * height; // length of tail segment

  return (
    <svg
      ref={ref}
      viewBox={`-${width / 2} -${height / 2} ${width} ${height}`}
      className="absolute overflow-visible inset-0 w-full h-full"
      style={{ zIndex: -1 }}
      preserveAspectRatio="xMidYMid slice"
    >
      <path
        className={["fill-current", colors[2]].join(" ")}
        d={`
          M ${-width / 2 + creaseH} ${-height / 2 + creaseV}
          h ${-tail}
          l ${height / 2} ${height / 2}
          l ${-height / 2} ${height / 2}
          h ${tail}
          z
          M ${width / 2 - creaseH} ${-height / 2 + creaseV}
          h ${tail}
          l ${-height / 2} ${height / 2}
          l ${height / 2} ${height / 2}
          h ${-tail}
          z
        `}
      />
      <path
        className={["fill-current", colors[1]].join(" ")}
        d={`
          M ${-width / 2} ${-height / 2}
          l ${creaseH} ${creaseV}
          v ${height}
          l ${-creaseH} ${-creaseV}
          M ${width / 2} ${-height / 2}
          l ${-creaseH} ${creaseV}
          v ${height}
          l ${creaseH} ${-creaseV}
        `}
      />
      <rect
        className={["fill-current", colors[0]].join(" ")}
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
      />
    </svg>
  );
};

export default Ribbon;
