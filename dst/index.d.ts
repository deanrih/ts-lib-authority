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
type Effect = "allow" | "deny";
declare function generateContextKey(c: Context): CeKey;
declare function generateRdaKey(r: RoleKey, d: DomainKey, a: ActionKey): RdaKey;
declare function isContextMatch(rC: Context, iC: Context): boolean;
declare function isEmptyObject(input: unknown): boolean;
declare class Policy {
	private readonly policies;
	set(r: RoleKey, d: DomainKey, a: ActionKey, c: Context, e: Effect): void;
	can(r: RoleKey, d: DomainKey, a: ActionKey, c?: Context): boolean;
}
export { isEmptyObject, isContextMatch, generateRdaKey, generateContextKey, Policy };
