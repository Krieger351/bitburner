import type { NS } from "@ns";

export const gatServerPaths = async (
  ns: NS,
  startingServer = "home"
): Promise<Record<string, string[]>> => {
  const servers = new Set<string>();
  const paths: Record<string, string[]> = {};
  const loadServer = async (target: string, path: string[]) => {
    if (!servers.has(target)) {
      servers.add(target);
      paths[target] = path;
      const siblings = await ns.scan(target);
      for (const sibling of siblings) {
        await loadServer(sibling, [...path, target]);
      }
    }
  };
  await loadServer(startingServer, []);
  return paths;
};
