module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins:[
    ["transform-remove-strict-mode"],
    ["@babel/plugin-proposal-optional-chaining"]  //解析 可选链式语法
  ]
}
