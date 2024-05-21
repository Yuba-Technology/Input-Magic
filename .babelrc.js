module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                loose: true,
                bugfixes: true,
                modules: false,
                targets: "ie 11" // 几乎不兼容所有ES6+的语法
            }
        ]
    ],
    env: {
        test: {
            plugins: ["@babel/plugin-transform-modules-commonjs"]
        }
    }
};
