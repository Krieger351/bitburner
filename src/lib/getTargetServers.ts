import type { NS } from "@ns";
import { getAllServers } from "/lib/getAllServers";

export const getTargetServers = async (ns: NS): Promise<Set<string>> => {
  const servers = await getAllServers(ns);
  servers.delete("home");
  for (const server of servers) {
    if (ns.getServerMaxRam(server) < 8) {
      servers.delete(server);
    }
  }
  return servers;
};
