const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,

  // lintOnSave: true,
  publicPath: "/coolors-co-obj-to-svg/",

  chainWebpack: (config) => {
    // vue inspect --plugin html
    // Altera titulo do html
    config.plugin("html").tap((args) => {
      args[0].title = "Cores para paleta de cores";
      return args;
    });
  },

  devServer: {
    port: 10001,
  },
});
