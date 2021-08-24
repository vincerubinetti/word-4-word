const Button = ({
  text,
  icon = "",
  colors,
  locked,
  tooltip = "",
  className = "",
  onClick,
}) => {
  const hoverText =
    locked || !colors ? "" : "hover:text-white focus:text-white";

  const defaultHoverBgs = ["hover:bg-gray-300", "focus:bg-gray-300"];

  const hoverBgs = locked ? [] : colors || defaultHoverBgs;

  const opacity = locked ? "opacity-30" : "";

  const cursor = locked ? "auto" : "pointer";

  return (
    <button
      onClick={locked ? null : onClick}
      data-tip={tooltip}
      className={[
        "relative",
        "flex",
        "justify-center",
        "items-center",
        "w-full",
        "max-w-sm",
        "h-10",
        "mx-auto",
        "text-lg",
        "bg-gray-200",
        hoverText,
        ...hoverBgs,
        opacity,
        "transition",
        className,
      ].join(" ")}
      style={{ cursor }}
    >
      <span>{text}</span>
      <i className={icon} />
      {locked && (
        <i className={["fas", "fa-lock", "absolute", "right-5"].join(" ")} />
      )}
    </button>
  );
};

export default Button;
