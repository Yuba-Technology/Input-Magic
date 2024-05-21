// const path = require("node:path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const TerserPlugin = require("terser-webpack-plugin");
const packageData = require("./package.json");
const common = require("./webpack.common.js");

const banner = () => {
    const name = formatName(packageData.name);
    const { version, author, license } = packageData;
    const year = new Date().getFullYear();
    return formatBannerString(name, version, year, author, license);
};

const formatName = (name) => {
    return name
        .split("-")
        .map((item) => item[0].toUpperCase() + item.slice(1))
        .join(" ");
};

const formatBannerString = (name, version, year, author, license) => {
    return `
        ${name} v${version}
        Copyright (c) 2015-${year} ${author}
        Released under the ${license} License.
        `
        .split("\n")
        .filter((item) => item.trim() !== "")
        .map((item) => item.trim())
        .join("\n");
};

module.exports = merge(common, {
    mode: "production",
    target: ["web", "es5"],
    // devtool: false,
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false, // 将注释提取到单独的文件中
                terserOptions: {
                    output: {
                        // comments: false, // 删除所有的注释
                    }
                    // compress: {
                    //     drop_console: true, // 删除所有的console语句
                    //     drop_debugger: true // 删除所有的debugger语句
                    // }
                }
            })
        ]
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: banner(),
            // banner: `版权所有：${new Date().getFullYear()}`,
            raw: false, // 如果为true，将直接将内容插入到源文件中，可能会导致语法错误
            entryOnly: true // 如果为true，将只在入口文件中添加版权信息
        })
    ]
});
