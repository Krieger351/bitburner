import type { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const target = ns.args[0] as string;
  ns.disableLog("ALL");
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  const maximumMoney = formatter.format(await ns.getServerMaxMoney(target));
  const minimumSecurity = await ns.getServerMinSecurityLevel(target);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // log stuff about target
    const currentMoney = formatter.format(
      await ns.getServerMoneyAvailable(target)
    );
    ns.clearLog();
    ns.print("Server Info: ", target);
    ns.print("Maximum Money:    ", maximumMoney);
    ns.print(
      "Current Money:    ",
      " ".repeat(maximumMoney.length - currentMoney.length),
      currentMoney
    );
    ns.print("Minimum Security: ", minimumSecurity);
    ns.print("Current Security: ", await ns.getServerSecurityLevel(target));
    ns.print("Hack Time:        ", await ns.getHackTime(target));
    ns.print("Grow Time:        ", await ns.getGrowTime(target));
    ns.print("Weaken Time:      ", await ns.getWeakenTime(target));
    await ns.sleep(1000);
  }
}

export function autocomplete(data: { servers: string[] }): string[] {
  return data.servers; // This script autocompletes the list of servers.
}
