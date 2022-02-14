import type { NS } from "@ns";
import { getAllServers } from "/lib/getAllServers";

const formatMoney = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
}).format;

const getInfo = (ns: NS, target: string) => {
  const serverInfo = ns.getServer(target);
  ns.tprint("=".repeat(20));
  ns.tprint(target);
  ns.tprint("=".repeat(20));
  const print = (k: string, v: string) => ns.tprint("  ", k, ": ", v);
  for (const [key, value] of Object.entries(serverInfo)) {
    switch (key) {
      case "moneyAvailable":
      case "moneyMax":
        print(key, formatMoney(value));
        break;
      default:
        print(key, value);
    }
  }
};

export async function main(ns: NS): Promise<void> {
  const servers =
    ns.args.length > 0
      ? new Set<string>(ns.args as string[])
      : await getAllServers(ns);
  for (const server of servers) {
    getInfo(ns, server);
  }
}

export function autocomplete(data: { servers: string[] }): string[] {
  return data.servers; // This script autocompletes the list of servers.
}
