/** biome-ignore-all lint/style/noDefaultExport: build config */
import { defineConfig } from "bunup";

export default defineConfig({
	entry: [
		// "./src/**/*.ts",
		"./src/*.ts",
	],
	// compile: true,// executable compile https://bunup.dev/docs/advanced/compile.html
	minify: true,
	target: "bun",
	format: "esm",
	outDir: "./dist",
	splitting: true, //nodeProtocol
	// exports: true,
	// noExternal: []
	unused: {
		level: "error",
	},
});
