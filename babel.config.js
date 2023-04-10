/** @type {import('@babel').config} */
const config = {
	presets: ['@babel/preset-env'],
	plugins: [['@babel/plugin-transform-react-jsx', { throwIfNamespace: false }]]
};

module.exports = config;
