const colors = require("tailwindcss/colors");

// tailwind.config.js
module.exports = {
  // ...
  variants: {
    extend: {
      opacity: ["disabled", "group-focus"],
    },
  },
  theme: {
    colors,
  },
};
