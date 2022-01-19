import type { NS } from "@ns";

export function main(ns: NS): void {
  ns.exec(
    "/scripts/hack-servers.js",
    "home",
    1,
    ns.args[0],
    ns.getScriptRam("/scripts/hack-servers.js") +
      ns.getScriptRam("/scripts/buy-servers.js") +
      ns.getScriptRam("run.js")
  );
  ns.exec("/scripts/buy-servers.js", "home");
}

export function autocomplete(data: { servers: string[] }): string[] {
  return data.servers; // This script autocompletes the list of servers.
}
