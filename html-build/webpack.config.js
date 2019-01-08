const isProduction = true;
const useSourceMap = !isProduction;

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: './src/main.js',
  output: { // ファイルの出力設定
    path: `${__dirname}/../html/js`,  //  出力ファイルのディレクトリ名
    filename: 'bundle.js',  // 出力ファイル名
  },
  module: {
    rules: [
      {
        // 拡張子 .js の場合
        test: /\.js$/,
        use: [
          {
            // Babel を利用する
            loader: 'babel-loader',
            // Babel のオプションを指定する
            options: {
              presets: [
                // プリセットを指定することで、ES2018 を ES5 に変換
                '@babel/preset-env',
              ],
            },
          },
        ],
        // node_modules は除外する
        exclude: /node_modules/,
      },
      {
        // 対象となるファイルの拡張子
        test: /\.s?a?css$/,
        // Sassファイルの読み込みとコンパイル
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              // オプションでCSS内のurl()メソッドの取り込みを禁止する
              url: true,
              // ソースマップを有効にする
              sourceMap: useSourceMap,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              // PostCSS側でもソースマップを有効にする
              sourceMap: useSourceMap,
            },
          },
          'sass-loader',
        ],
      },
      // 画像関係
      {
        test: /\.(png|jpeg|svg)$/,
        use: 'url-loader',
      },
      // フォント関係
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2)(\?.+)?$/,
        use: 'url-loader',
      },
    ],
  },
};
