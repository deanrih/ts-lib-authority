/** biome-ignore-all lint/nursery/noFloatingPromises: benchmark */

import { barplot, bench, /* boxplot, */ do_not_optimize, group, run, summary } from "mitata";

type Context = Record<string, string | number | boolean>;

// biome-ignore lint/style/useNamingConvention: bench func
function getKey_one(r: string, d: string, a: string, c: Context = {}): string {
	const cEntries = Object.entries(c).sort(([kA], [kB]) => {
		return kA.localeCompare(kB);
	});

	const cItems: string[] = [];
	for (const [k, v] of cEntries) {
		cItems.push(`"${k}":${v}`);
	}

	const cStr = `{${cItems.join(":")}}`;
	const result = `${r}:${d}:${a}:${cStr}`;
	return result;
}

// biome-ignore lint/style/useNamingConvention: bench func
function getKey_two(r: string, d: string, a: string, c: Context = {}): string {
	const cStr = JSON.stringify(c);
	const result = `${r}:${d}:${a}:${cStr}`;
	return result;
}

// biome-ignore lint/style/useNamingConvention: bench func
function getKey_tri(r: string, d: string, a: string, c: Context = {}): string {
	const cStr = JSON.stringify(c);
	const rStr = [r, d, a, cStr];
	const result = rStr.join(":");
	return result;
}

// Fastest
// biome-ignore lint/style/useNamingConvention: bench func
function getKey_cus1(r: string, d: string, a: string, c: Context = {}): string {
	const cStr = isEmptyObject_one(c) ? "{}" : JSON.stringify(c);
	const result = `${r}:${d}:${a}:${cStr}`;
	return result;
}

// biome-ignore lint/style/useNamingConvention: bench func
function isEmptyObject_one(input: unknown): boolean {
	if (input === null || input === undefined || Array.isArray(input) || typeof input !== "object") {
		return false;
	}

	return Object.keys(input).length === 0;
}

function objectEntries(c: Context): number {
	return Object.entries(c).length;
}

// Fastest
function objectKeys(c: Context): number {
	return Object.keys(c).length;
}

function compareEntries(a: Context, b: Context): boolean {
	const aEntries = Object.entries(a);
	const bEntries = Object.entries(b);

	return bEntries.every(([k, v]) => {
		return a[k] === v;
	});
}

function compareEntriesWithEarlyCheck(a: Context, b: Context): boolean {
	const aEntries = Object.entries(a);
	const bEntries = Object.entries(b);

	if (aEntries.length !== bEntries.length) {
		return false;
	}

	return bEntries.every(([k, v]) => {
		return a[k] === v;
	});
}

function compareKeys(a: Context, b: Context): boolean {
	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);

	return bKeys.every((k) => {
		return a[k] === b[k];
	});
}

// Fastest
function compareKeysWithEarlyCheck(a: Context, b: Context): boolean {
	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);

	if (aKeys.length !== bKeys.length) {
		return false;
	}

	return bKeys.every((k) => {
		return a[k] === b[k];
	});
}

function compareNative(a: Context, b: Context): boolean {
	return Bun.deepEquals(a, b);
}

// function compareCustom(a: Context, b: Context): boolean {}

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: bench
barplot(() => {
	// biome-ignore lint/complexity/noExcessiveLinesPerFunction: bench
	summary(() => {
		group("empty context", () => {
			const r = "role";
			const d = "domain";
			const a = "action";
			const c = {};

			bench("generate key one", () => {
				const _ = do_not_optimize(getKey_one(r, d, a, c));
			});

			bench("generate key two", () => {
				const _ = do_not_optimize(getKey_two(r, d, a, c));
			});

			bench("generate key tri", () => {
				const _ = do_not_optimize(getKey_tri(r, d, a, c));
			});

			bench("generate key cus", () => {
				const _ = do_not_optimize(getKey_cus1(r, d, a, c));
			});
		});

		group("one context", () => {
			const r = "role";
			const d = "domain";
			const a = "action";
			const c = {
				"bool": true,
			};

			bench("generate key one", () => {
				const _ = do_not_optimize(getKey_one(r, d, a, c));
			});

			bench("generate key two", () => {
				const _ = do_not_optimize(getKey_two(r, d, a, c));
			});

			bench("generate key tri", () => {
				const _ = do_not_optimize(getKey_tri(r, d, a, c));
			});

			bench("generate key cus", () => {
				const _ = do_not_optimize(getKey_cus1(r, d, a, c));
			});
		});

		group("two context", () => {
			const r = "role";
			const d = "domain";
			const a = "action";
			const c = {
				"bool": true,
				"str": "hello",
			};

			bench("generate key one", () => {
				const _ = do_not_optimize(getKey_one(r, d, a, c));
			});

			bench("generate key two", () => {
				const _ = do_not_optimize(getKey_two(r, d, a, c));
			});

			bench("generate key tri", () => {
				const _ = do_not_optimize(getKey_tri(r, d, a, c));
			});

			bench("generate key cus", () => {
				const _ = do_not_optimize(getKey_cus1(r, d, a, c));
			});
		});

		group("tri context", () => {
			const r = "role";
			const d = "domain";
			const a = "action";
			const c = {
				"bool": true,
				"str": "hello",
				"num": 1234,
			};

			bench("generate key one", () => {
				const _ = do_not_optimize(getKey_one(r, d, a, c));
			});

			bench("generate key two", () => {
				const _ = do_not_optimize(getKey_two(r, d, a, c));
			});

			bench("generate key tri", () => {
				const _ = do_not_optimize(getKey_tri(r, d, a, c));
			});

			bench("generate key cus", () => {
				const _ = do_not_optimize(getKey_cus1(r, d, a, c));
			});
		});

		group("lot context", () => {
			const r = "role";
			const d = "domain";
			const a = "action";
			// biome-ignore-start lint/style/useNamingConvention: bench data
			const c = {
				"bool": true,
				"str": "hello",
				"num": 1234,
				"str_one": "hello world",
				"str_two": "hello another world",
				"str_tri": "hello and goodbye to the world",
				"num_one": 12345,
				"num_two": 123456,
				"num_tri": 1234567,
			};
			// biome-ignore-end lint/style/useNamingConvention: bench data

			bench("generate key one", () => {
				const _ = do_not_optimize(getKey_one(r, d, a, c));
			});

			bench("generate key two", () => {
				const _ = do_not_optimize(getKey_two(r, d, a, c));
			});

			bench("generate key tri", () => {
				const _ = do_not_optimize(getKey_tri(r, d, a, c));
			});

			bench("generate key cus", () => {
				const _ = do_not_optimize(getKey_cus1(r, d, a, c));
			});
		});

		group("object count", () => {
			// biome-ignore-start lint/style/useNamingConvention: bench data
			const c = {
				"bool": true,
				"str": "hello",
				"num": 1234,
				"str_one": "hello world",
				"str_two": "hello another world",
				"str_tri": "hello and goodbye to the world",
				"num_one": 12345,
				"num_two": 123456,
				"num_tri": 1234567,
			};
			// biome-ignore-end lint/style/useNamingConvention: bench data

			bench("object entries", () => {
				const _ = do_not_optimize(objectEntries(c));
			});

			bench("object keys", () => {
				const _ = do_not_optimize(objectKeys(c));
			});
		});

		group("object compare match", () => {
			// biome-ignore-start lint/style/useNamingConvention: bench data
			const a = {
				"bool": true,
				"str": "hello",
				"num": 1234,
				"str_one": "hello world",
				"str_two": "hello another world",
				"str_tri": "hello and goodbye to the world",
				"num_one": 12345,
				"num_two": 123456,
				"num_tri": 1234567,
			};
			const b = {
				"str_two": "hello another world",
				"bool": true,
				"str_one": "hello world",
				"num": 1234,
				"str": "hello",
				"num_two": 123456,
				"num_tri": 1234567,
				"num_one": 12345,
				"str_tri": "hello and goodbye to the world",
			};
			const c = {
				"str_two": "hello another world",
				"bool": true,
				"num": 1234,
				"str": "hello",
				"num_one": 12345,
				"str_tri": "hello and goodbye to the world",
			};
			// biome-ignore-end lint/style/useNamingConvention: bench data

			bench("object entries", () => {
				const _ = do_not_optimize(compareEntries(a, b));
			});

			bench("object entries with early exit", () => {
				const _ = do_not_optimize(compareEntriesWithEarlyCheck(a, b));
			});

			bench("object keys", () => {
				const _ = do_not_optimize(compareKeys(a, b));
			});

			bench("object keys with early exit", () => {
				const _ = do_not_optimize(compareKeysWithEarlyCheck(a, b));
			});

			bench("bun native", () => {
				const _ = do_not_optimize(compareNative(a, b));
			});
		});

		group("object compare mismatch", () => {
			// biome-ignore-start lint/style/useNamingConvention: bench data
			const a = {
				"bool": true,
				"str": "hello",
				"num": 1234,
				"str_one": "hello world",
				"str_two": "hello another world",
				"str_tri": "hello and goodbye to the world",
				"num_one": 12345,
				"num_two": 123456,
				"num_tri": 1234567,
			};
			const b = {
				"str_two": "hello another world",
				"bool": true,
				"num": 1234,
				"str": "hello",
				"num_one": 12345,
				"str_tri": "hello and goodbye to the world",
			};
			// biome-ignore-end lint/style/useNamingConvention: bench data

			bench("object entries", () => {
				const _ = do_not_optimize(compareEntries(a, b));
			});

			bench("object entries with early exit", () => {
				const _ = do_not_optimize(compareEntriesWithEarlyCheck(a, b));
			});

			bench("object keys", () => {
				const _ = do_not_optimize(compareKeys(a, b));
			});

			bench("object keys with early exit", () => {
				const _ = do_not_optimize(compareKeysWithEarlyCheck(a, b));
			});

			bench("bun native", () => {
				const _ = do_not_optimize(compareNative(a, b));
			});
		});
	});
});

await run();
