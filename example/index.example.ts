import { Policy } from "../src";

const policy = new Policy();
// biome-ignore-start lint/style/useNamingConvention: test data
policy.set("admin", "system", "make", {}, "allow");
policy.set("admin", "system", "view", {}, "allow");
policy.set("admin", "system", "edit", {}, "allow");
policy.set("admin", "system", "drop", {}, "allow");
policy.set("admin", "system", "aprv", { "user_only": true, "scope_account": true }, "allow");
policy.set("admin", "system", "drop", { "system": false }, "allow");
policy.set("admin", "system", "drop", { "system": true }, "deny");
// biome-ignore-end lint/style/useNamingConvention: test data

// biome-ignore-start lint/suspicious/noConsole: example
console.log(`admin can make system > ${policy.can("admin", "system", "make")}`);
console.log(`admin can view system > ${policy.can("admin", "system", "view")}`);
console.log(`admin can drop system > ${policy.can("admin", "system", "drop")}`);
console.log(`admin can edit system > ${policy.can("admin", "system", "edit")}`);
console.log(`admin can view page > ${policy.can("admin", "page", "view")}`);

const permitted = policy.can("admin", "system", "make");

if (permitted) {
	console.log("Admins are permitted!");
}
// biome-ignore-end lint/suspicious/noConsole: example
