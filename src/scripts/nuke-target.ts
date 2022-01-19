import type { NS } from "@ns";
import { autoNuke } from "/lib/autoNuke";
import { getAllServers } from "/lib/getAllServers";

export async function main(ns: NS): Promise<void> {
  const servers = await getAllServers(ns);
  for (const server of servers) {
    await autoNuke(ns, server);
  }
}

export function autocomplete(data: { servers: string[] }): string[] {
  return data.servers; // This script autocompletes the list of servers.
}
