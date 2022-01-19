import type { NS } from "@ns";
import { areScriptsRunning } from "/lib/areScriptsRunning";
import { autoNuke } from "/lib/autoNuke";
import { getTargetServers } from "/lib/getTargetServers";
import { killTargetServers } from "/lib/killTargetServers";

const targetHackScript = "/target-scripts/hack.js";
const targetWeakenScript = "/target-scripts/weaken.js";
const targetGrowScript = "/target-scripts/grow.js";

const calculateThreads = (ns: NS, usableRam: number) => {
  const hackRam = ns.getScriptRam(targetHackScript);
  const weakenRam = ns.getScriptRam(targetWeakenScript);
  const growRam = ns.getScriptRam(targetGrowScript);

  const chunk = usableRam / 16;
  const hackThreads = Math.floor(Math.max(chunk / hackRam, 1));
  const weakenThreads = Math.floor(Math.max((2 * chunk) / weakenRam, 1));
  const serverUsedRam = hackThreads * hackRam + weakenThreads * weakenRam;
  const growThreads = Math.floor((usableRam - serverUsedRam) / growRam);
  return {
    hack: hackThreads,
    weaken: weakenThreads,
    grow: growThreads,
  };
};

const uploadScripts = async (ns: NS, target: string) => {
  await ns.scp(
    [targetHackScript, targetWeakenScript, targetGrowScript],
    target
  );
};

const startHacksOnTarget = async (
  ns: NS,
  target: string,
  hackTarget: string,
  memoryReserve = 0
) => {
  const usableRam = (await ns.getServerMaxRam(target)) - memoryReserve;
  if (target !== "home") {
    ns.killall(target);
  }
  const threads = calculateThreads(ns, usableRam);
  ns.,tprint(`Starting hacks on ${target}`, threads);
  ns.exec(targetHackScript, target, threads.hack, hackTarget);
  ns.exec(targetWeakenScript, target, threads.weaken, hackTarget);
  ns.exec(targetGrowScript, target, threads.grow, hackTarget);
};

const runHack = async (ns: NS, hackTarget: string) => {
  const servers = await getTargetServers(ns);
  for (const server of servers) {
    if (
      !(await areScriptsRunning(ns, server)) &&
      (await autoNuke(ns, server))
    ) {
      await uploadScripts(ns, server);
      await startHacksOnTarget(ns, server, hackTarget);
    }
  }
  await ns.sleep(10_000);
};

export async function main(ns: NS): Promise<void> {
  const hackTarget = ns.args[0] as string;
  const homeMemoryReserve = ns.args[1] as number;
  ns.disableLog("ALL");
  if (await autoNuke(ns, hackTarget)) {
    await killTargetServers(ns);
    await startHacksOnTarget(ns, "home", hackTarget, homeMemoryReserve);

    // eslint-disable-next-line no-constant-condition
    while (true) {
      await runHack(ns, hackTarget);
    }
  } else {
    ns.tprint(`Can not gain root on ${hackTarget}`);
  }
}
