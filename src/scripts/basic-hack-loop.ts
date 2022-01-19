import type {NS} from "@ns";

export async function main(ns: NS) {
	const target = ns.args[0] as string;
	const minSecurityLevel = ns.args[1] as number * 1.1;
	const serverMoneyThreshold = ns.args[2] as number * .9;

	while (true) {
		if (ns.getServerSecurityLevel(target) > minSecurityLevel) {
			await ns.weaken(target)
		} else if (ns.getServerMoneyAvailable(target) < serverMoneyThreshold) {
			await ns.grow(target)
		} else {
			await ns.hack(target)
		}
	}
}