const tailwind = require("preact-cli-tailwind");

module.exports = (config, env, helpers) => {
  config.module.rules.push({
    test: /\.yaml$/,
    type: "json",
    use: "yaml-loader",
  });
  tailwind(config, env, helpers);
};
