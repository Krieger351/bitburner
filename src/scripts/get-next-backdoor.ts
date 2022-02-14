import type { NS } from "@ns";
import { autoNuke } from "/lib/autoNuke";
import { getAllServers } from "/lib/getAllServers";

export async function main(ns: NS): Promise<void> {
  const servers = await getAllServers(ns);
  for (const server of servers) {
    if (await autoNuke(ns, server)) {
      const { backdoorInstalled, requiredHackingSkill, purchasedByPlayer } =
        await ns.getServer(server);
      if (
        ns.getHackingLevel() > requiredHackingSkill &&
        !backdoorInstalled &&
        !purchasedByPlayer
      ) {
        ns.tprint(server);
        return;
      }
    }
  }
}

export function autocomplete(data: { servers: string[] }): string[] {
  return data.servers; // This script autocompletes the list of servers.
}
