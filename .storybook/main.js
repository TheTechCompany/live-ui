module.exports = {
  "webpackFinal": (config) => {
    if(!config.node) config.node = {};
    config.node['fs'] = 'empty'
    return config;
  },
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ]
}