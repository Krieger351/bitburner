import type { NS } from "@ns";

export const areScriptsRunning = async (
  ns: NS,
  target: string
): Promise<boolean> => (await ns.getServerUsedRam(target)) > 0;
