import type { NS } from "@ns";

const getServerPrices = (ns: NS): [number, number][] => {
  const prices: [number, number][] = [];
  const upperBound = Math.log2(ns.getPurchasedServerMaxRam());
  for (let i = 3; i <= upperBound; i++) {
    const ram = Math.pow(2, i);
    prices.push([ram, ns.getPurchasedServerCost(ram)]);
  }
  return prices;
};

const getBestRam = (currentMoney: number, serverPrices: [number, number][]) => {
  for (const [ram, serverPrice] of serverPrices) {
    if (serverPrice < currentMoney) {
      return ram;
    }
  }
  return -1;
};

const buyServers = async (ns: NS): Promise<void> => {
  ns.print("Buy: Starting");
  const minimumRam = 8;
  const serverPrices = getServerPrices(ns);
  const buyServer = async () => {
    ns.print("Buy: Checking money");
    const currentMoney = await ns.getServerMoneyAvailable("home");
    const bestRam = getBestRam(currentMoney, serverPrices);

    if (bestRam > minimumRam) {
      const servername = await ns.purchaseServer("drone", bestRam);
      ns.print(`Buy: Purchased ${servername} with ${bestRam}GB of ram`);
    } else {
      await ns.sleep(60_000);
    }
  };

  while (ns.getPurchasedServerLimit() > ns.getPurchasedServers().length) {
    await buyServer();
  }
};

const findSmallestServer = (ns: NS, servers: string[]): string => {
  let [smallestServer] = servers;
  for (const currentServer of servers) {
    if (
      ns.getServerMaxRam(currentServer) < ns.getServerMaxRam(smallestServer)
    ) {
      smallestServer = currentServer;
    }
  }
  return smallestServer;
};

const replaceServers = async (ns: NS): Promise<void> => {
  ns.print("Replace: Starting");
  const serverPrices = getServerPrices(ns);
  const replaceServer = async () => {
    const servers = await ns.getPurchasedServers();
    const smallestServer = findSmallestServer(ns, servers);
    const smallestRam = ns.getServerMaxRam(smallestServer);
    ns.print(
      `Replace: The smallest server is ${smallestServer} with ${smallestRam}GB of ram`
    );
    const currentMoney = await ns.getServerMoneyAvailable("home");
    const bestRam = getBestRam(currentMoney, serverPrices);

    if (bestRam > smallestRam) {
      ns.killall(smallestServer);
      ns.deleteServer(smallestServer);
      const replacement = ns.purchaseServer("drone", bestRam);
      ns.print(
        `Buy: Replaced ${smallestServer} with ${replacement} @ ${bestRam}GB`
      );
    } else {
      await ns.sleep(60_000);
    }
  };

  // eslint-disable-next-line no-constant-condition
  while (true) {
    await replaceServer();
  }
};

export async function main(ns: NS): Promise<void> {
  ns.disableLog("ALL");
  await buyServers(ns);
  await replaceServers(ns);
}

/*
loop
  if currentServer < max servers
    buy most efficient servers possible
  else 
    replace worst server with best possible server
    */
