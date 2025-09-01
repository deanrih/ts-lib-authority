# @deanrih/ts-lib-authority

A helper library for handling permissions.

## Installation

```sh
# Bun
bun add @deanrih/ts-lib-authority
# pnpm
pnpm add @deanrih/ts-lib-authority
# npm
npm install @deanrih/ts-lib-authority
```

## Usage

```ts
import { can, set } from "@deanrih/ts-lib-authority";

set("admin", "system", "make");
set("admin", "system", "edit");
set("admin", "*", "view");
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
```

Checkout the [example](https://github.com/deanrih/ts-lib-authority/blob/main/example) folder.

## Credits/Reference
