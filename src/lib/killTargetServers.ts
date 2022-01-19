import type { NS } from "@ns";
import { getTargetServers } from "/lib/getTargetServers";

export const killTargetServers = async (ns: NS): Promise<void> => {
  await Promise.all(
    [...(await getTargetServers(ns))].map(
      async (server) => await ns.killall(server)
    )
  );
};
