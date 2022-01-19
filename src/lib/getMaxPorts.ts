import type {NS} from "@ns";

export const getMaxPorts = async (ns: NS): Promise<number> => {
	let hackLevel = 0;
	const hackPrograms = ["BruteSSH.exe", "ftpcrack.exe", "RelaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"];
	for (const program of hackPrograms) {
		if (ns.fileExists(program, "home")) {
			hackLevel++;
		}
	}
	return hackLevel;
}
