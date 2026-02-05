/**
 * @file
 * Copyright (c) 2025 Dean Rikrik Ichsan Hakiki.
 * All rights reserved.
 *
 * This code is licensed under the MIT License.
 *
 * @license     MIT
 * @description Utility to work with environment variables utilizing schema type validation of typebox.
 * @author      Dean Rikrik Ichsan Hakiki (deanrih)
 * @version     1.0.0
 * @copyright   Dean Rikrik Ichsan Hakiki 2025
 */

// TODO (deanrih): Next iteration feature
// const actions = [
// 	"view", // select
// 	"make", // insert
// 	"edit", // update
// 	"drop", // delete
// 	"v", // select
// 	"m", // insert
// 	"e", // update
// 	"d", // delete
// 	"vmed", // all
// 	"*", // all
// ] as const;

type Context = Record<string, string | number | boolean>;
type Permission = Map<string, Map<string, Set<Context>>>;

// TODO (deanrih): Next iteration should be a builder to return new instancce of permissions
// let permissions = <Record<string, Set<string>>>{};
let perms: Permission = new Map();

function can(r: string, d: string, a: string, c?: Context): boolean {
	// biome-ignore lint/style/noUnusedTemplateLiteral: revisit
	const permissionKeys = [`*__*`, `${r}__*`, `${r}__${d}`] as const;
	const actionSet = new Set(["*", a]);

	for (const key of permissionKeys) {
		const aMap = perms.get(key);
		if (aMap === undefined) {
			continue;
		}
		for (const action of actionSet) {
			const cSet = aMap.get(action);
			if (cSet === undefined) {
				continue;
			}

			if (c === undefined || cSet.has(c)) {
				return true;
			}
		}

		// const permission = permissions[key];
		// if (permission === undefined) {
		// 	continue;
		// }

		// if (permission.intersection(actionSet).size > 0) {
		// 	return true;
		// }
	}

	return false;
}

/**
 * @description Mainly for test purpose
 */
function nuke(): void {
	// permissions = {};
	perms.clear();
}

function set(r: string, d: string, a: string, c?: Context): void {
	const permissionKey = `${r}__${d}`;

	let aMap = perms.get(permissionKey);
	if (aMap === undefined) {
		aMap = new Map();
		perms.set(permissionKey, aMap);
	}

	let cSet = aMap.get(a);
	if (cSet === undefined) {
		cSet = new Set();
		aMap.set(a, cSet);
	}

	if (c === undefined) {
		return;
	}

	cSet.add(c);

	// if (permissions[permissionKey] === undefined) {
	// 	permissions[permissionKey] = new Set([a]);
	// } else {
	// 	permissions[permissionKey].add(a);
	// }
}

export { can, set, nuke };
