import type {NS} from "@ns";

export const areScriptsRunning = async (ns: NS, target: string): Promise<boolean> => ns.getServerUsedRam(target) > 0;
