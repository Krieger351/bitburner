import type { NS } from "@ns";
import { gatServerPaths } from "/lib/getServerPaths";

export async function main(ns: NS): Promise<void> {
  const target = ns.args[0] as string;
  ns.disableLog("ALL");
  const paths = await gatServerPaths(ns);
  ns.tprint(paths[target]);
}

export function autocomplete(data: { servers: string[] }): string[] {
  return data.servers; // This script autocompletes the list of servers.
}
