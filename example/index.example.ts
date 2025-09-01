import { can, set } from "../src";

set("admin", "system", "make");
set("admin", "system", "edit");
set("admin", "*", "view");
// set("admin", "*", "drop");
// set("admin", "system", "*");
set("admin", "*", "*");

console.log(`admin can make system > ${can("admin", "system", "make")}`);
console.log(`admin can view system > ${can("admin", "system", "view")}`);
console.log(`admin can drop system > ${can("admin", "system", "drop")}`);
console.log(`admin can edit system > ${can("admin", "system", "edit")}`);
console.log(`admin can view page > ${can("admin", "page", "view")}`);

const permitted = can("admin", "system", "make");

if (permitted) {
	console.log("Admins are permitted!");
}
