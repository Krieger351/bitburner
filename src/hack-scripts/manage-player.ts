import type { NS } from "@ns";

const programs = [
  "BruteSSH.exe",
  "FTPCrack.exe",
  "relaySMTP.exe ",
  "HTTPWorm.exe",
  "SQLInject.exe",
  "ServerProfiler.exe",
  "DeepscanV1.exe",
  "DeepscanV2.exe",
  "AutoLink.exe",
  "Formulas.exe",
];

export async function main(ns: NS): Promise<void> {
  // eslint-disable-next-line no-constant-condition
  while (programs.every(program => !ns.fileExists(program, "home"))) {
    ns.purchaseTor();
    for (const program of programs) {
        if (!ns.fileExists(program, "home")) {
            ns.purchaseProgram(program);
        }
    }
    await ns.sleep(1000);
  }
}
