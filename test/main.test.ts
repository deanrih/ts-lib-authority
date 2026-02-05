/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: test case */
import { describe, expect, it } from "bun:test";

import { can, nuke, Policy, set } from "../src";

describe("manual assignment -- old", () => {
	it("all systems permitted", () => {
		nuke();
		set("admin", "system", "make");
		set("admin", "system", "view");
		set("admin", "system", "edit");
		set("admin", "system", "drop");

		expect(can("admin", "system", "make")).toBe(true);
		expect(can("admin", "system", "view")).toBe(true);
		expect(can("admin", "system", "edit")).toBe(true);
		expect(can("admin", "system", "drop")).toBe(true);
	});

	it("three systems permitted except drop", () => {
		nuke();
		set("admin", "system", "make");
		set("admin", "system", "view");
		set("admin", "system", "edit");
		set("admin", "page", "drop");

		expect(can("admin", "system", "make")).toBe(true);
		expect(can("admin", "system", "view")).toBe(true);
		expect(can("admin", "system", "edit")).toBe(true);
		expect(can("admin", "system", "drop")).toBe(false);
	});

	it("two systems permitted", () => {
		nuke();
		set("admin", "system", "make");
		set("admin", "system", "edit");
		set("admin", "page", "view");
		set("admin", "page", "drop");

		expect(can("admin", "system", "make")).toBe(true);
		expect(can("admin", "system", "edit")).toBe(true);
		expect(can("admin", "system", "view")).toBe(false);
		expect(can("admin", "system", "drop")).toBe(false);
	});

	it("no page permitted", () => {
		nuke();
		set("admin", "system", "make");
		set("admin", "system", "view");
		set("admin", "system", "edit");
		set("admin", "system", "drop");

		expect(can("admin", "page", "make")).toBe(false);
		expect(can("admin", "page", "view")).toBe(false);
		expect(can("admin", "page", "edit")).toBe(false);
		expect(can("admin", "page", "drop")).toBe(false);
	});
});

describe("manual assignment -- new", () => {
	it("all systems permitted", () => {
		const policy = new Policy();
		policy.set("admin", "system", "make", "allow");
		policy.set("admin", "system", "view", "allow");
		policy.set("admin", "system", "edit", "allow");
		policy.set("admin", "system", "drop", "allow");
		policy.set("admin", "system", "drop", "allow", { "system": false });
		policy.set("admin", "system", "drop", "deny", { "system": true });

		expect(policy.can("admin", "system", "make")).toBe(true);
		expect(policy.can("admin", "system", "view")).toBe(true);
		expect(policy.can("admin", "system", "edit")).toBe(true);
		expect(policy.can("admin", "system", "drop")).toBe(true);
		expect(policy.can("admin", "system", "drop", { "system": false })).toBe(true);
		expect(policy.can("admin", "system", "drop", { "system": true })).toBe(false);
	});

	it("three systems permitted except drop", () => {
		const policy = new Policy();
		policy.set("admin", "system", "make", "allow");
		policy.set("admin", "system", "view", "allow");
		policy.set("admin", "system", "edit", "allow");
		policy.set("admin", "page", "drop", "allow");

		expect(policy.can("admin", "system", "make")).toBe(true);
		expect(policy.can("admin", "system", "view")).toBe(true);
		expect(policy.can("admin", "system", "edit")).toBe(true);
		expect(policy.can("admin", "system", "drop")).toBe(false);
	});

	it("three systems permitted except drop explicit", () => {
		const policy = new Policy();
		policy.set("admin", "system", "make", "allow");
		policy.set("admin", "system", "view", "allow");
		policy.set("admin", "system", "edit", "allow");
		policy.set("admin", "system", "drop", "deny");
		policy.set("admin", "page", "drop", "allow");

		expect(policy.can("admin", "system", "make")).toBe(true);
		expect(policy.can("admin", "system", "view")).toBe(true);
		expect(policy.can("admin", "system", "edit")).toBe(true);
		expect(policy.can("admin", "system", "drop")).toBe(false);
	});

	it("two systems permitted", () => {
		const policy = new Policy();
		policy.set("admin", "system", "make", "allow");
		policy.set("admin", "system", "edit", "allow");
		policy.set("admin", "system", "view", "deny");
		policy.set("admin", "page", "view", "allow");
		policy.set("admin", "page", "drop", "allow");

		expect(policy.can("admin", "system", "make")).toBe(true);
		expect(policy.can("admin", "system", "edit")).toBe(true);
		expect(policy.can("admin", "system", "view")).toBe(false);
		expect(policy.can("admin", "system", "drop")).toBe(false);
	});

	it("two systems permitted explicit", () => {
		const policy = new Policy();
		policy.set("admin", "system", "make", "allow");
		policy.set("admin", "system", "edit", "allow");
		policy.set("admin", "system", "view", "deny");
		policy.set("admin", "system", "drop", "deny");
		policy.set("admin", "page", "view", "allow");
		policy.set("admin", "page", "drop", "allow");

		expect(policy.can("admin", "system", "make")).toBe(true);
		expect(policy.can("admin", "system", "edit")).toBe(true);
		expect(policy.can("admin", "system", "view")).toBe(false);
		expect(policy.can("admin", "system", "drop")).toBe(false);
	});

	it("no page permitted", () => {
		const policy = new Policy();
		policy.set("admin", "page", "make", "deny");
		policy.set("admin", "page", "view", "deny");
		policy.set("admin", "page", "edit", "deny");
		// policy.set("admin", "page", "drop", "deny");

		expect(policy.can("admin", "page", "make")).toBe(false);
		expect(policy.can("admin", "page", "view")).toBe(false);
		expect(policy.can("admin", "page", "edit")).toBe(false);
		expect(policy.can("admin", "page", "drop")).toBe(false);
	});

	it("no page permitted explicit", () => {
		const policy = new Policy();
		policy.set("admin", "page", "*", "deny");

		expect(policy.can("admin", "page", "make")).toBe(false);
		expect(policy.can("admin", "page", "view")).toBe(false);
		expect(policy.can("admin", "page", "edit")).toBe(false);
		expect(policy.can("admin", "page", "drop")).toBe(false);
	});
});

describe("inferred assignment -- old", () => {
	it("all systems permitted", () => {
		nuke();
		set("admin", "system", "make");
		set("admin", "system", "view");
		set("admin", "system", "*");

		expect(can("admin", "system", "make")).toBe(true);
		expect(can("admin", "system", "view")).toBe(true);
		expect(can("admin", "system", "edit")).toBe(true);
		expect(can("admin", "system", "drop")).toBe(true);
		expect(can("admin", "system", "*")).toBe(true);
	});

	it("all systems permitted catch all", () => {
		nuke();
		set("admin", "system", "*");

		expect(can("admin", "system", "make")).toBe(true);
		expect(can("admin", "system", "view")).toBe(true);
		expect(can("admin", "system", "edit")).toBe(true);
		expect(can("admin", "system", "drop")).toBe(true);
		expect(can("admin", "system", "*")).toBe(true);
	});

	it("three systems permitted except drop", () => {
		nuke();
		set("admin", "system", "make");
		set("admin", "system", "view");
		set("admin", "system", "edit");
		set("admin", "page", "*");

		expect(can("admin", "system", "make")).toBe(true);
		expect(can("admin", "system", "view")).toBe(true);
		expect(can("admin", "system", "edit")).toBe(true);
		expect(can("admin", "system", "drop")).toBe(false);
		expect(can("admin", "system", "*")).toBe(false);
	});

	it("no page permitted", () => {
		nuke();
		set("admin", "system", "*");

		expect(can("admin", "page", "make")).toBe(false);
		expect(can("admin", "page", "view")).toBe(false);
		expect(can("admin", "page", "edit")).toBe(false);
		expect(can("admin", "page", "drop")).toBe(false);
		expect(can("admin", "page", "*")).toBe(false);
	});
});

describe("inferred assignment -- new", () => {
	it("all systems permitted", () => {
		const policy = new Policy();
		policy.set("admin", "system", "make", "allow");
		policy.set("admin", "system", "view", "allow");
		policy.set("admin", "system", "*", "allow");

		expect(policy.can("admin", "system", "make")).toBe(true);
		expect(policy.can("admin", "system", "view")).toBe(true);
		expect(policy.can("admin", "system", "edit")).toBe(true);
		expect(policy.can("admin", "system", "drop")).toBe(true);
		expect(policy.can("admin", "system", "*")).toBe(true);
	});

	it("all systems permitted catch all", () => {
		const policy = new Policy();
		policy.set("admin", "system", "*", "allow");

		expect(policy.can("admin", "system", "make")).toBe(true);
		expect(policy.can("admin", "system", "view")).toBe(true);
		expect(policy.can("admin", "system", "edit")).toBe(true);
		expect(policy.can("admin", "system", "drop")).toBe(true);
		expect(policy.can("admin", "system", "*")).toBe(true);
	});

	it("three systems permitted except drop", () => {
		const policy = new Policy();
		policy.set("admin", "system", "make", "allow");
		policy.set("admin", "system", "view", "allow");
		policy.set("admin", "system", "edit", "allow");
		policy.set("admin", "page", "*", "allow");

		expect(policy.can("admin", "system", "make")).toBe(true);
		expect(policy.can("admin", "system", "view")).toBe(true);
		expect(policy.can("admin", "system", "edit")).toBe(true);
		expect(policy.can("admin", "system", "drop")).toBe(false);
		expect(policy.can("admin", "system", "*")).toBe(false);
	});

	it("three systems permitted except drop explicit", () => {
		const policy = new Policy();
		policy.set("admin", "system", "make", "allow");
		policy.set("admin", "system", "view", "allow");
		policy.set("admin", "system", "edit", "allow");
		policy.set("admin", "system", "drop", "deny");
		policy.set("admin", "page", "*", "allow");

		expect(policy.can("admin", "system", "make")).toBe(true);
		expect(policy.can("admin", "system", "view")).toBe(true);
		expect(policy.can("admin", "system", "edit")).toBe(true);
		expect(policy.can("admin", "system", "drop")).toBe(false);
		expect(policy.can("admin", "system", "*")).toBe(false);
	});

	it("no page permitted", () => {
		const policy = new Policy();
		policy.set("admin", "system", "*", "allow");

		expect(policy.can("admin", "page", "make")).toBe(false);
		expect(policy.can("admin", "page", "view")).toBe(false);
		expect(policy.can("admin", "page", "edit")).toBe(false);
		expect(policy.can("admin", "page", "drop")).toBe(false);
		expect(policy.can("admin", "page", "*")).toBe(false);
	});

	it("no page permitted explicit", () => {
		const policy = new Policy();
		policy.set("admin", "page", "*", "deny");

		expect(policy.can("admin", "page", "make")).toBe(false);
		expect(policy.can("admin", "page", "view")).toBe(false);
		expect(policy.can("admin", "page", "edit")).toBe(false);
		expect(policy.can("admin", "page", "drop")).toBe(false);
		expect(policy.can("admin", "page", "*")).toBe(false);
	});
});
