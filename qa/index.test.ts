/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: test case */
import { describe, expect, it } from "bun:test";

import { generateContextKey, generateRdaKey, isContextMatch, Policy } from "../src";

describe("generate/key/context", () => {
	it("should be the same", () => {
		// biome-ignore-start lint/style/useNamingConvention: test data
		const c1 = {};
		const c2 = {
			"bool": true,
		};
		const c3 = {
			"bool": true,
			"str": "hello",
		};
		const c4 = {
			"bool": true,
			"str": "hello",
			"num": 1234,
		};
		// biome-ignore-end lint/style/useNamingConvention: test data

		const r1 = generateContextKey(c1);
		const r2 = generateContextKey(c2);
		const r3 = generateContextKey(c3);
		const r4 = generateContextKey(c4);

		expect(r1).toBe("{}");
		expect(r2).toBe(`{"bool":true}`);
		expect(r3).toBe(`{"bool":true,"str":"hello"}`);
		expect(r4).toBe(`{"bool":true,"str":"hello","num":1234}`);
	});
});

describe("generate/key/rda", () => {
	it("should be the same", () => {
		// biome-ignore-start lint/style/useNamingConvention: test data
		const r = "role";
		const d = "domain";
		const a = "action";
		// biome-ignore-end lint/style/useNamingConvention: test data

		const result = generateRdaKey(r, d, a);

		expect(result).toBe("role:domain:action");
	});
});

describe("compare/context", () => {
	it("should match (full)", () => {
		// biome-ignore-start lint/style/useNamingConvention: test data
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
		// biome-ignore-end lint/style/useNamingConvention: test data

		const result = isContextMatch(a, b);

		expect(result).toBe(true);
	});

	it("should match (selective)", () => {
		// biome-ignore-start lint/style/useNamingConvention: test data
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
			"num": 1234,
			"str": "hello",
			"num_one": 12345,
			"str_tri": "hello and goodbye to the world",
		};
		// biome-ignore-end lint/style/useNamingConvention: test data

		const result = isContextMatch(a, b);

		expect(result).toBe(true);
	});

	it("should match (empty select)", () => {
		// biome-ignore-start lint/style/useNamingConvention: test data
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
		const b = {};
		// biome-ignore-end lint/style/useNamingConvention: test data

		const result = isContextMatch(a, b);

		expect(result).toBe(true);
	});
});

describe("assignment/manual", () => {
	it("all systems permitted", () => {
		const policy = new Policy();
		// biome-ignore-start lint/style/useNamingConvention: test data
		policy.set("admin", "system", "make", {}, "allow");
		policy.set("admin", "system", "view", {}, "allow");
		policy.set("admin", "system", "edit", {}, "allow");
		policy.set("admin", "system", "drop", {}, "allow");
		policy.set("admin", "system", "aprv", { "user_only": true, "scope_account": true }, "allow");
		policy.set("admin", "system", "drop", { "system": false }, "allow");
		policy.set("admin", "system", "drop", { "system": true }, "deny");

		expect(policy.can("admin", "system", "make")).toBe(true);
		expect(policy.can("admin", "system", "view")).toBe(true);
		expect(policy.can("admin", "system", "edit")).toBe(true);
		expect(policy.can("admin", "system", "drop")).toBe(true);
		expect(policy.can("admin", "system", "aprv")).toBe(true);
		expect(policy.can("admin", "system", "aprv", {})).toBe(true);
		expect(policy.can("admin", "system", "aprv", { "user_only": true })).toBe(true);
		expect(policy.can("admin", "system", "aprv", { "scope_account": true })).toBe(true);
		expect(policy.can("admin", "system", "aprv", { "user_only": true, "scope_account": true })).toBe(true);
		expect(policy.can("admin", "system", "aprv", { "user_only": false, "scope_account": true })).toBe(false);
		expect(policy.can("admin", "system", "aprv", { "user_only": true, "scope_account": false })).toBe(false);
		expect(policy.can("admin", "system", "aprv", { "user_only": false, "scope_account": false })).toBe(false);
		expect(policy.can("admin", "system", "aprv", { "scope_settings": true })).toBe(false);
		expect(policy.can("admin", "system", "drop", { "system": false })).toBe(true);
		expect(policy.can("admin", "system", "drop", { "system": true })).toBe(false);
		// biome-ignore-end lint/style/useNamingConvention: test data
	});

	it("three systems permitted except drop", () => {
		const policy = new Policy();
		policy.set("admin", "system", "make", {}, "allow");
		policy.set("admin", "system", "view", {}, "allow");
		policy.set("admin", "system", "edit", {}, "allow");
		policy.set("admin", "page", "drop", {}, "allow");

		expect(policy.can("admin", "system", "make")).toBe(true);
		expect(policy.can("admin", "system", "view")).toBe(true);
		expect(policy.can("admin", "system", "edit")).toBe(true);
		expect(policy.can("admin", "system", "drop")).toBe(false);
	});

	it("three systems permitted except drop explicit", () => {
		const policy = new Policy();
		policy.set("admin", "system", "make", {}, "allow");
		policy.set("admin", "system", "view", {}, "allow");
		policy.set("admin", "system", "edit", {}, "allow");
		policy.set("admin", "system", "drop", {}, "deny");
		policy.set("admin", "page", "drop", {}, "allow");

		expect(policy.can("admin", "system", "make")).toBe(true);
		expect(policy.can("admin", "system", "view")).toBe(true);
		expect(policy.can("admin", "system", "edit")).toBe(true);
		expect(policy.can("admin", "system", "drop")).toBe(false);
	});

	it("two systems permitted", () => {
		const policy = new Policy();
		policy.set("admin", "system", "make", {}, "allow");
		policy.set("admin", "system", "edit", {}, "allow");
		policy.set("admin", "system", "view", {}, "deny");
		policy.set("admin", "page", "view", {}, "allow");
		policy.set("admin", "page", "drop", {}, "allow");

		expect(policy.can("admin", "system", "make")).toBe(true);
		expect(policy.can("admin", "system", "edit")).toBe(true);
		expect(policy.can("admin", "system", "view")).toBe(false);
		expect(policy.can("admin", "system", "drop")).toBe(false);
	});

	it("two systems permitted explicit", () => {
		const policy = new Policy();
		policy.set("admin", "system", "make", {}, "allow");
		policy.set("admin", "system", "edit", {}, "allow");
		policy.set("admin", "system", "view", {}, "deny");
		policy.set("admin", "system", "drop", {}, "deny");
		policy.set("admin", "page", "view", {}, "allow");
		policy.set("admin", "page", "drop", {}, "allow");

		expect(policy.can("admin", "system", "make")).toBe(true);
		expect(policy.can("admin", "system", "edit")).toBe(true);
		expect(policy.can("admin", "system", "view")).toBe(false);
		expect(policy.can("admin", "system", "drop")).toBe(false);
	});

	it("no page permitted", () => {
		const policy = new Policy();
		policy.set("admin", "page", "make", {}, "deny");
		policy.set("admin", "page", "view", {}, "deny");
		policy.set("admin", "page", "edit", {}, "deny");
		// policy.set("admin", "page", "drop", {}, "deny");

		expect(policy.can("admin", "page", "make")).toBe(false);
		expect(policy.can("admin", "page", "view")).toBe(false);
		expect(policy.can("admin", "page", "edit")).toBe(false);
		expect(policy.can("admin", "page", "drop")).toBe(false);
	});

	// it("no page permitted explicit", () => {
	// 	const policy = new Policy();
	// 	policy.set("admin", "page", "*", "deny");

	// 	expect(policy.can("admin", "page", "make")).toBe(false);
	// 	expect(policy.can("admin", "page", "view")).toBe(false);
	// 	expect(policy.can("admin", "page", "edit")).toBe(false);
	// 	expect(policy.can("admin", "page", "drop")).toBe(false);
	// });

	// it("empty-context not-set", () => {
	// 	const policy = new Policy();
	// 	policy.set("admin", "*", "*", "allow");

	// 	expect(policy.can("admin", "access_role", "view")).toBe(true);
	// 	expect(policy.can("admin", "access_role", "view", {})).toBe(true);
	// 	expect(policy.can("admin", "access_role", "view", undefined)).toBe(true);
	// 	expect(policy.can("admin", "access_role", "view", { "henlo": "aaa" })).toBe(true);
	// });

	// it("empty-context explicit", () => {
	// 	const policy = new Policy();
	// 	policy.set("admin", "*", "*", "allow", {});

	// 	expect(policy.can("admin", "access_role", "view")).toBe(true);
	// 	expect(policy.can("admin", "access_role", "view", {})).toBe(true);
	// 	expect(policy.can("admin", "access_role", "view", undefined)).toBe(true);
	// 	expect(policy.can("admin", "access_role", "view", { "henlo": "aaa" })).toBe(true);
	// });

	// it("empty-context undefined", () => {
	// 	const policy = new Policy();
	// 	policy.set("admin", "*", "*", "allow", undefined);

	// 	expect(policy.can("admin", "access_role", "view")).toBe(true);
	// 	expect(policy.can("admin", "access_role", "view", {})).toBe(true);
	// 	expect(policy.can("admin", "access_role", "view", undefined)).toBe(true);
	// 	expect(policy.can("admin", "access_role", "view", { "henlo": "aaa" })).toBe(true);
	// });
});
