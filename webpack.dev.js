// const path = require("node:path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "development",
    devServer: {
        static: {
            directory: "public"
        },
        compress: true,
        port: 8001
    }
});
