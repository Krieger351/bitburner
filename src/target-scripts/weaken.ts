import type { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  await ns.sleep(Math.random() * 100_000);
  const target = ns.args[0] as string;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await ns.weaken(target);
  }
}
