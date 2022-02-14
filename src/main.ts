import type { NS } from "@ns";

const RealTimeout = setTimeout;

// @ts-ignore
// eslint-disable-next-line no-global-assign
setTimeout = (thing: Parameters<typeof RealTimeout>[0]) =>
  RealTimeout(thing, 5);

export function main(ns: NS): void {
  ns.exec(
    "/scripts/hack-servers.js",
    "home",
    1,
    ns.args[0],
    ns.getScriptRam("/scripts/hack-servers.js") +
      ns.getScriptRam("/scripts/buy-servers.js") +
      ns.getScriptRam("/scripts/monitor-target.js") +
      ns.getScriptRam("run.js") +
      10
  );
  ns.exec("/scripts/buy-servers.js", "home");
  ns.tail(
    ns.exec("/scripts/monitor-target.js", "home", 1, ns.args[0] as string)
  );
}

export function autocomplete(data: { servers: string[] }): string[] {
  return data.servers; // This script autocompletes the list of servers.
}
