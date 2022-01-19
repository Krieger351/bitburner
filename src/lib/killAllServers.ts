import type {NS} from "@ns";
import { getAllServers } from "/lib/getAllServers";

export const killAllServers = async (ns: NS) => {
	const servers = await getAllServers(ns)
	for (const server of servers) {
		ns.killall(server);
	}
}