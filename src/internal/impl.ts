/**
 * @file
 * Copyright (c) 2026 Dean Rikrik Ichsan Hakiki.
 * All rights reserved.
 *
 * This code is licensed under the MIT License.
 *
 * @license     MIT
 * @description Utility to work with environment variables utilizing schema type validation of typebox.
 * @author      Dean Rikrik Ichsan Hakiki (deanrih)
 * @version     1.0.0
 * @copyright   Dean Rikrik Ichsan Hakiki 2026
 */

type RoleKey = string;
type DomainKey = string;
type ActionKey = string;

type ContextKey = string;
type ContextVal = string | number | boolean;
type Context = Record<ContextKey, ContextVal>;

type RdaKey = string;
type CeKey = string;
// type PolicyKey = string;
// type CacheKey = string;

type Effect = "allow" | "deny";

interface ContextEffectEntry {
	c: Context;
	e: Effect;
}
interface PolicyEntry {
	r: string;
	d: string;
	a: string;
	// ce: Map<CeKey, ContextEffectEntry>;
	ce: Set<ContextEffectEntry>;
}

type Policies = Map<RdaKey, PolicyEntry>;
// type ResolvedPolicy = Map<PolicyKey, boolean>;

const EMPTY_CONTEXT = "{}";

function generateContextKey(c: Context): CeKey {
	const contextString = isEmptyObject(c) ? EMPTY_CONTEXT : JSON.stringify(c);
	return contextString;
}

function generateRdaKey(r: RoleKey, d: DomainKey, a: ActionKey): RdaKey {
	return `${r}:${d}:${a}`;
}

function isContextMatch(rC: Context, iC: Context): boolean {
	// const rKeys = Object.keys(rC);
	const iKeys = Object.keys(iC);

	// too strict
	// if (rKeys.length !== iKeys.length) {
	// 	return false;
	// }

	const result = iKeys.every((k) => {
		return iC[k] === rC[k];
	});

	return result;
}

function isEmptyObject(input: unknown): boolean {
	if (input === null || input === undefined || Array.isArray(input) || typeof input !== "object") {
		return false;
	}

	return Object.keys(input).length === 0;
}

// "role:domain:action"
class Policy {
	private readonly policies: Policies = new Map();
	// private readonly resolvedPolicyCache: ResolvedPolicy = new Map();

	set(r: RoleKey, d: DomainKey, a: ActionKey, c: Context, e: Effect): void {
		const rdaKey = generateRdaKey(r, d, a);
		// const cKey = generateContextKey(c);

		const policy = this.policies.getOrInsert(rdaKey, {
			r,
			d,
			a,
			// ce: new Map(),
			ce: new Set(),
		});

		// policy.ce.getOrInsert(cKey, { c, e });
		policy.ce.add({ c, e });
	}

	can(r: RoleKey, d: DomainKey, a: ActionKey, c: Context = {}): boolean {
		const rdaKey = generateRdaKey(r, d, a);
		// const cKey = generateContextKey(c);
		// const pKey = `${rdaKey}:${cKey}`;

		// const resolvedPolicy = this.resolvedPolicyCache.get(pKey);
		// if (resolvedPolicy !== undefined) {
		// 	return resolvedPolicy;
		// }

		const policy = this.policies.get(rdaKey);
		if (policy === undefined) {
			return false;
		}

		const { ce } = policy;

		for (const entry of ce) {
			if (isContextMatch(entry.c, c)) {
				return entry.e === "allow";
			}
		}

		return false;
	}
}

export { generateContextKey, generateRdaKey, isContextMatch, isEmptyObject, Policy };
