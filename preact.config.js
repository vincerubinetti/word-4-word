const tailwind = require("preact-cli-tailwind");

module.exports = (config, env, helpers) => {
  config.module.rules.push({
    test: /\.yaml$/,
    type: "json",
    use: "yaml-loader",
  });
  config.module.rules.push({
    test: /\.dat/,
    use: [
      {
        loader: "file-loader",
      },
    ],
  });
  tailwind(config, env, helpers);
};
