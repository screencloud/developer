const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/index",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].[chunkhash].js",
  },

  module: {
    rules: [
      {
        test: [/.js$|.ts$/],
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/typescript"],
          },
        },
      },
      {
        test: [/.css$|.scss$/],
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "images/",
            },
          },
        ],
      },
    ],
  },

  resolve: {
    alias: {
      "@scss": path.resolve(__dirname, "../src/styles/scss"),
      "@img": path.resolve(__dirname, "../src/images"),
      "@": path.resolve(__dirname, "../src"),
    },
    modules: ["node_modules", path.resolve(__dirname, "src")],
    extensions: [".js", ".ts"],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: "style.[chunkhash].css",
    }),
    new CopyWebpackPlugin([
      {
        from: "./src/images",
        to: "images",
      },
    ]),
    new CleanWebpackPlugin(),
  ],

  devServer: {
    port: 8000,
  },
};
