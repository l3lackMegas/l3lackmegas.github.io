module.exports = {
	reactStrictMode: true,
	swcMinify: true,
	experimental: {
		appDir: true,
		transpilePackages: ["ui"],
		runtime: 'edge',
	},
	
}