import type { NS } from "@ns";
import { getMaxPorts } from "/lib/getMaxPorts";

export const autoNuke = async (ns: NS, target: string): Promise<boolean> => {
  if (await ns.hasRootAccess(target)) {
    return true;
  }
  if ((await ns.getServerNumPortsRequired(target)) > (await getMaxPorts(ns))) {
    return false;
  }
  if (await ns.fileExists("BruteSSH.exe")) {
    await ns.brutessh(target);
  }
  if (await ns.fileExists("ftpcrack.exe")) {
    await ns.ftpcrack(target);
  }
  if (await ns.fileExists("RelaySMTP.exe")) {
    await ns.relaysmtp(target);
  }
  if (await ns.fileExists("HTTPWorm.exe")) {
    await ns.httpworm(target);
  }
  if (await ns.fileExists("SQLInject.exe")) {
    await ns.sqlinject(target);
  }
  await ns.nuke(target);
  ns.print(`Gained root on ${target}`);
  return true;
};
