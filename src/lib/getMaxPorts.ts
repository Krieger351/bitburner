import type { NS } from "@ns";

export const getMaxPorts = (ns: NS): number => {
  let hackLevel = 0;
  const hackPrograms = [
    "BruteSSH.exe",
    "ftpcrack.exe",
    "RelaySMTP.exe",
    "HTTPWorm.exe",
    "SQLInject.exe",
  ];
  for (const program of hackPrograms) {
    if (ns.fileExists(program, "home")) {
      hackLevel++;
    }
  }
  return hackLevel;
};
