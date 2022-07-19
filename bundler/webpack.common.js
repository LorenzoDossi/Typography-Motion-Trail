const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports = {
    entry: path.resolve(__dirname, '../src/assets/js/index.js'),
    output: {
        path: path.resolve(__dirname, '../src/compiled-assets'),
    },
    devtool: 'source-map',
    plugins: [
        new MiniCSSExtractPlugin({
          filename: '[name].css'
        })
    ],
    module: {
        rules: [ // JS
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            },

            // CSS
            {
                test: /\.scss$/,
                use: [
                  {
                    loader: MiniCSSExtractPlugin.loader,
                  },
                  {
                    loader: 'css-loader',
                    options: {
                      url: false
                    }
                  },
                  {
                    loader: 'sass-loader',
                    options: {
                      implementation: require('sass'),
                        sassOptions: {
                          outputStyle: "expanded",
                          // outputStyle: "compressed",
                        },
                    }
                  }
                ]
            },

            // Images
            {
                test: /\.(jpg|png|gif|svg)$/,
                type: 'asset/resource',
                generator:
                {
                    filename: 'assets/images/[hash][ext]'
                }
            },

            // Fonts
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                type: 'asset/resource',
                generator:
                {
                    filename: 'assets/fonts/[hash][ext]'
                }
            },

            // glsl
            {
                test: /\.(txt|glsl|vert|frag)$/,
                type: 'asset/source',
            }
        ]
    }
}
