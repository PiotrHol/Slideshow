const path = require("path");
const Html = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Copy = require("copy-webpack-plugin");
const autoprefixer = require("autoprefixer");
const MiniCSS = require("mini-css-extract-plugin");
const CssMini = require("css-minimizer-webpack-plugin");

module.exports = {
    entry: ["./js/app.js","./scss/main.scss"],
    output: {
        filename: "js/app.js",
        path: path.resolve(__dirname, "docs"),
    },
    plugins: [
        new CleanWebpackPlugin(),
        new Html({
            filename: "index.html",
            template: "./index.html",
        }),
        new Copy({
           patterns: [
               {from: "assets", to: "assets"}
           ],
        }),
        autoprefixer,
        new MiniCSS({
            filename: "css/main.css",
        }),
        new CssMini(),
    ],
}