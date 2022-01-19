import type {NS} from "@ns";

const buyServers = async (ns: NS): Promise<void> => {
	ns.print("Buy: Starting");
	const ram = 8;
	const buyServer = async () => {
		ns.print("Buy: Checking money");
		const serverCost = await ns.getPurchasedServerCost(ram);
		const currentMoney = await ns.getServerMoneyAvailable("home");
		if (currentMoney > serverCost) {
			const servername = await ns.purchaseServer("drone", ram)
			ns.print(`Buy: Purchased ${servername} with ${ram}GB of ram`);
		} else {
			await ns.sleep(60000);
		}
	}

	while (await ns.getPurchasedServerLimit() > (await ns.getPurchasedServers()).length) {
		await buyServer();
	}
}

const findSmallestServer = (ns: NS, servers: string[]): string => servers.reduce((smallestServer, currentServer) =>
	ns.getServerMaxRam(smallestServer) < ns.getServerMaxRam(currentServer) ? smallestServer : currentServer
)

const replaceServers = async (ns: NS): Promise<void> => {
	ns.print("Replace: Starting");
	const replaceServer = async () => {
		const servers = await ns.getPurchasedServers();
		const smallestServer = findSmallestServer(ns, servers);
		const smallestRam = ns.getServerMaxRam(smallestServer);
		ns.print(`Replace: The smallest server is ${smallestServer} with ${smallestRam}GB of ram`)
		const nextMinimumRam = smallestRam * 2;
		const serverCost = await ns.getPurchasedServerCost(nextMinimumRam);
		const currentMoney = await ns.getServerMoneyAvailable("home");

		ns.print(`Replace: The next server will have ${nextMinimumRam}GB of ram and will cost ${serverCost}`)
		if (currentMoney > serverCost) {
			ns.killall(smallestServer);
			ns.deleteServer(smallestServer);
			const replacement = ns.purchaseServer("drone", nextMinimumRam);
			ns.print(`Buy: Replaced ${smallestServer} with ${replacement}`);
		} else {
			await ns.sleep(60000)
		}
	}

	while (true) {
		await replaceServer();
	}
}

export async function main(ns: NS) {
	ns.disableLog("ALL");
	await buyServers(ns);
	await replaceServers(ns);
}