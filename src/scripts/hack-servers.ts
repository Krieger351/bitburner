import type {NS} from "@ns";
import { areScriptsRunning } from "/lib/areScriptsRunning";
import { autoNuke } from "/lib/autoNuke";
import { getAllServers } from "/lib/getAllServers";
import { killAllServers } from "/lib/killAllServers";

const uploadScripts = async (ns:NS , target: string) => {
	await ns.scp("/scripts/basic-hack-loop.js", target)
}


const startHacksOnTarget = async (ns: NS, target: string, hackTarget: string, memoryReserve = 0) => {
	const serverMaxRam = ns.getServerMaxRam(target) - memoryReserve;
	if (target !== "home") {
		ns.killall(target);
	}
    const threads = serverMaxRam / 2.2;
	ns.exec("/scripts/basic-hack-loop.js", target, threads, hackTarget, ns.getServerMinSecurityLevel(hackTarget), ns.getServerMaxMoney(hackTarget));
}


const runHack = async (ns: NS, hackTarget: string) => {
	const servers = await getAllServers(ns);
	for (const server of servers) {
		if (!await areScriptsRunning(ns, server) && await autoNuke(ns, server)) {
			await uploadScripts(ns, server);
			await startHacksOnTarget(ns, server, hackTarget)
		}
	}
	await ns.sleep(10000);
}

export async function main(ns: NS) {
    const hackTarget = ns.args[0] as string;
    const homeMemoryReserve = ns.args[1] as number;
	ns.disableLog("ALL");
	await killAllServers(ns);
	await startHacksOnTarget(ns, "home", hackTarget, homeMemoryReserve)

	while (true) {
		await runHack(ns, hackTarget)
	}
}