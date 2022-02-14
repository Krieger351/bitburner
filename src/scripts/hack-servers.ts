import type { NS } from "@ns";
import { areScriptsRunning } from "/lib/areScriptsRunning";
import { autoNuke } from "/lib/autoNuke";
import { getTargetServers } from "/lib/getTargetServers";
import { killTargetServers } from "/lib/killTargetServers";

const targetHackScript = "/target-scripts/hack.js";
const targetWeakenScript = "/target-scripts/weaken.js";
const targetGrowScript = "/target-scripts/grow.js";

const calculateThreads = (ns: NS, usableRam: number, minimum = 0) => {
  const hackRam = ns.getScriptRam(targetHackScript);
  const weakenRam = ns.getScriptRam(targetWeakenScript);
  const growRam = ns.getScriptRam(targetGrowScript);

  const chunk = usableRam / 100;
  const hackThreads = Math.max(Math.floor(chunk / hackRam), minimum);
  const weakenThreads = Math.max(Math.floor((10 * chunk) / weakenRam), minimum);
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

const startScript = (
  ns: NS,
  chunkCount: number,
  threadCount: number,
  scriptPath: string,
  runTarget: string,
  hackTarget: string
) => {
  const threadsPerChunk = Math.floor(threadCount / chunkCount);
  const chunkLeftover = threadCount - chunkCount * threadsPerChunk;
  if (threadsPerChunk > 0) {
    for (let i = 0; i < chunkCount; i++) {
      ns.exec(scriptPath, runTarget, threadsPerChunk, hackTarget, i);
    }
  }
  if (chunkLeftover > 0) {
    ns.exec(scriptPath, runTarget, chunkLeftover, hackTarget);
  }
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
  const threads = calculateThreads(ns, usableRam, target === "home" ? 1 : 0);
  ns.print(`Starting hacks on ${target}`);
  if (threads.hack) {
    const hackChunkSize = 20;
    startScript(
      ns,
      hackChunkSize,
      threads.hack,
      targetHackScript,
      target,
      hackTarget
    );
  }
  if (threads.weaken) {
    const weakenChunkSize = 20;
    startScript(
      ns,
      weakenChunkSize,
      threads.weaken,
      targetWeakenScript,
      target,
      hackTarget
    );
  }
  const growChunkSize = 20;

  startScript(
    ns,
    growChunkSize,
    threads.grow,
    targetGrowScript,
    target,
    hackTarget
  );
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
