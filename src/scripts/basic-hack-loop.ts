import type { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  await ns.sleep(Math.random() * 1000);
  const target = ns.args[0] as string;
  const minSecurityLevel = (ns.args[1] as number) * 1.1;
  const serverMoneyThreshold = (ns.args[2] as number) * 0.9;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (ns.getServerSecurityLevel(target) > minSecurityLevel) {
      await ns.weaken(target);
    } else if (ns.getServerMoneyAvailable(target) < serverMoneyThreshold) {
      await ns.grow(target);
    } else {
      await ns.hack(target);
    }
  }
}
