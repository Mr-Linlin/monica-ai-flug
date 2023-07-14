const CopyWebpackPlugin = require('copy-webpack-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const path = require('path')

// 复制文件到指定目录
const copyFiles = [
  {
    from: path.resolve('src/plugins/manifest.json'),
    to: `${path.resolve('dist')}/manifest.json`
  },
  {
    from: path.resolve('src/assets'),
    to: path.resolve('dist/assets')
  },
  {
    from: path.resolve('src/plugins/inject.js'),
    to: path.resolve('dist/js')
  },
  // {
  //   from: path.resolve('src/background/background.js'),
  //   to: path.resolve('dist/js')
  // }
]

const plugins = [
  // 复制插件
  new CopyWebpackPlugin({
    patterns: copyFiles
  }),
  //压缩文件插件
  new FileManagerPlugin({
    events: {
      onEnd: {
        delete: ['./dist.zip'],
        archive: [{ source: './dist', destination: './dist/fiona_plugin.zip' }]
      }
    }
  })
]

// 页面文件
const pages = {}
// 配置 popup.html 页面
const chromeName = ["popup", "sidebar"];

chromeName.forEach((name) => {
  pages[name] = {
    entry: `src/${name}/main.js`,
    template: `src/${name}/index.html`,
    filename: `${name}.html`,
  };
});

module.exports = {
  pages,
  productionSourceMap: false,
  lintOnSave: false, // 关闭Eslint
  runtimeCompiler: true,
  // 配置 content.js background.js
  configureWebpack: {
    optimization: {
      splitChunks: false
    },
    entry: {
      content: './src/content/main.js',
      background: './src/background/background.js'
    },
    output: {
      filename: 'js/[name].js',
    },
    plugins
  },
  //  去除console
  // chainWebpack: (config) => {
  //   config.optimization.minimizer("terser").tap((args) => {
  //     args[0].terserOptions.compress.drop_console = true;
  //     return args;
  //   });
  // },
  // 配置 content.css
  css: {
    extract: {
      filename: 'css/[name].css'
    }
  }
}
