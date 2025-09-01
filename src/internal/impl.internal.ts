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

// TODO (deanrih): Next iteration should be a builder to return new instancce of permissions
let permissions = <Record<string, Set<string>>>{};

function can(role: string, domain: string, action: string): boolean {
	const permissionKeys = [`*__*`, `${role}__*`, `${role}__${domain}`] as const;
	const actionSet = new Set(["*", action]);

	for (const key of permissionKeys) {
		const permission = permissions[key];
		if (permission === undefined) {
			continue;
		}

		if (permission.intersection(actionSet).size > 0) {
			return true;
		}
	}

	return false;
}

/**
 * @description Mainly for test purpose
 */
function nuke() {
	permissions = {};
}

function set(role: string, domain: string, action: string) {
	const permissionKey = `${role}__${domain}`;

	if (permissions[permissionKey] === undefined) {
		permissions[permissionKey] = new Set([action]);
	} else {
		permissions[permissionKey].add(action);
	}
}

export { can, set, nuke };
