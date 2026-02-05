type CacheKey = string;
type Context = Record<string, string | number | boolean>; // add weight / priority?
type Effect = "allow" | "deny";

// interface CheckResult {
// 	allowed: boolean;
// 	reasons: string[];
// 	rule?: string;
// }
interface Rule {
	a: string;
	e: Effect;
	c?: Context;
}
interface RuleCandidate {
	rule: Rule;
	score: number;
}

type MapDomain = Map<string, Set<Rule>>; // Rule[]>;
type MapRole = Map<string, MapDomain>;

const ANY = "*";

class Policy {
	private readonly rules: MapRole = new Map();
	private readonly cache = new Map<CacheKey, boolean>(); // new Map<CacheKey, CheckResult>();

	set(r: string, d: string, a: string, e: Effect, c?: Context): void {
		let dMap = this.rules.get(r);
		if (dMap === undefined) {
			dMap = new Map();
			this.rules.set(r, dMap);
		}

		let rule = dMap.get(d);
		if (rule === undefined) {
			rule = new Set(); // [];
			dMap.set(d, rule);
		}

		rule.add({
			// push({
			a,
			e,
			c,
		});
	}

	// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: revisit
	can(r: string, d: string, a: string, c?: Context): boolean {
		const cacheKey = this.key(r, d, a, c);
		const cached = this.cache.get(cacheKey);
		if (cached !== undefined) {
			return cached;
		}

		const candidates: RuleCandidate[] = [];

		const kR = [ANY, r];
		const kD = [ANY, d];

		for (const role of kR) {
			const dMap = this.rules.get(role);
			if (dMap === undefined) {
				continue;
			}

			for (const domain of kD) {
				const rules = dMap.get(domain);
				if (rules === undefined) {
					continue;
				}

				for (const rule of rules) {
					if (rule.a !== ANY && rule.a !== a) {
						continue;
					}
					if (!this.isContextMatch(rule.c, c)) {
						continue;
					}

					candidates.push({
						rule,
						score: this.computeScore(r, d, a, rule),
					});
				}
			}
		}

		if (candidates.length === 0) {
			this.cache.set(cacheKey, false);
			return false;
		}

		candidates.sort((kA, kB) => {
			return kB.score - kA.score;
		});

		const [candidate] = candidates;
		const result = candidate.rule.e === "allow";
		this.cache.set(cacheKey, result);
		return result;
	}

	private key(r: string, d: string, a: string, c?: Context): CacheKey {
		const context =
			c === undefined
				? "undefined"
				: Object.entries(c)
						.sort(([kA], [kB]) => {
							return kA.localeCompare(kB);
						})
						.map(([k, v]) => {
							return `${k}:${v}`;
						})
						.join("|");
		const result = `${r}|${d}|${a}|${context}`;

		return result;
	}

	private isContextMatch(rC?: Context, iC?: Context): boolean {
		if (rC === undefined) {
			return true;
		}
		if (iC === undefined) {
			return false;
		}

		return Object.entries(rC).every(([k, v]) => {
			return iC[k] === v;
		});
	}

	// biome-ignore-start lint/style/noMagicNumbers: ignore
	private computeScore(r: string, d: string, a: string, rule: Rule): number {
		let score = 0;

		if (r !== ANY) {
			score += 100;
		}
		if (d !== ANY) {
			score += 50;
		}
		if (a !== ANY && rule.a === a) {
			score += 25;
		} else {
			score += 10;
		}

		if (rule.c !== undefined) {
			score += Object.keys(rule.c).length * 5;
		}

		return score;
	}
	// biome-ignore-end lint/style/noMagicNumbers: ignore
}

export type { CacheKey, Context, Effect, Rule, RuleCandidate, MapDomain, MapRole };
export { ANY, Policy };
