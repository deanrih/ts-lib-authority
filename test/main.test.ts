import { describe, expect, it } from "bun:test";
import { can, nuke, set } from "../src";

describe("manual assignment", () => {
	it("all system permitted", () => {
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

	it("three system permitted except drop", () => {
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

	it("two system permitted", () => {
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

describe("inferred assignment", () => {
	it("all system permitted", () => {
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

	it("all system permitted catch all", () => {
		nuke();
		set("admin", "system", "*");

		expect(can("admin", "system", "make")).toBe(true);
		expect(can("admin", "system", "view")).toBe(true);
		expect(can("admin", "system", "edit")).toBe(true);
		expect(can("admin", "system", "drop")).toBe(true);
		expect(can("admin", "system", "*")).toBe(true);
	});

	it("three system permitted except drop", () => {
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
