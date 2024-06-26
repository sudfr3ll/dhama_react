const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
    entry: {
        userApp: './src/userApp/index.js',
        partnerApp: './src/partnerApp/index.js',
        maps: './src/maps/maps.js',
        purohitApp: './src/purohitApp/index.js',
        travelGuideApp: './src/travelGuideApp/index.js',    
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'scripts/[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.svg$/,
                use: ['svg-react-loader'],
            },
            {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
            },
            
        ]
    },
    plugins: [
        
        new HtmlWebpackPlugin({
            template: './public/index.html',
            chunks: ['userApp'],
            filename: 'index.html'
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            chunks: ['partnerApp'],
            filename: 'partnerApp.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/maps/maps.html',
            chunks: ['maps'],
            filename: 'maps.html'
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            chunks: ['purohitApp'],
            filename: 'purohitApp.html'
        }),

        new HtmlWebpackPlugin({
            template: './public/index.html',
            chunks: ['travelGuideApp'],
            filename: 'travelGuideApp.html'
        }),
        // Add more HtmlWebpackPlugin instances for additional SPAs
        new WebpackObfuscator({
            rotateStringArray: true,
            stringArray: true,
            stringArrayEncoding: ['base64'],
            stringArrayThreshold: 0.75,
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.75
        }, [])
        
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'), // Specify the root directory for serving static files
          },
        compress: true,
        port: 3000,
        hot: true
    }
};

