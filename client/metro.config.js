const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// 🔥 Fix tslib default import issue on web
config.resolver.extraNodeModules = {
  tslib: require.resolve("tslib"),
};

module.exports = config;
