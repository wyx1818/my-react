if (!/pnpm/.test(process.env.npm_execpath || '')) {
	console.warn(
		`\u001b[33mThis repository requires use pnpm as the package manager` +
			` for scripts to work properly. \u001b[39m` +
			`\nPlease visit https://pnpm.io/installation`
	);

	process.exit(1);
}
