const {merge} = require("webpack-merge");
const common = require("./webpack.common.js");
const MiniCSS = require("mini-css-extract-plugin");
const CssMini = require("css-minimizer-webpack-plugin");

module.exports = merge(common, {
   mode: "production",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [MiniCSS.loader, "css-loader", "postcss-loader", "sass-loader"],
            },
        ],
    },
    optimization: {
      minimizer: [new CssMini()],
    },
});