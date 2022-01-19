import type { NS } from "@ns";

export const getAllServers = async (ns: NS): Promise<Set<string>> => {
  const servers = new Set<string>();
  const loadServer = async (target: string) => {
    if (!servers.has(target)) {
      servers.add(target);
      const siblings = await ns.scan(target);
      for (const sibling of siblings) {
        await loadServer(sibling);
      }
    }
  };
  await loadServer("home");
  return servers;
};
