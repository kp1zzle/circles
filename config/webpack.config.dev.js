const config = require("./webpack.config")

module.exports = {
  ...config,
  mode: "development",
  devServer: {
    // disable hot module replacement
    hot: false,
    port: 8080,
    open: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
}