export async function main(ns) {
  ns.disableLog("ALL");

  //Welcome to the Auto Farm part 2: Electric Boogaloo - Advanced Edition
  //This script is a little more complicated to explain easily, it dedicates high RAM servers to attack high profit servers
  //This is also set and forget, your EXEs and hacking level are reacquired each second, so new servers are added without needing to reboot it
  //Well I hope this brings you ideas, knowledge and or profits

  const files = ["grow.script", "weak.script", "hack.script"];
  await ns.write(files[0], "grow(args)", "w");
  await ns.write(files[1], "weaken(args)", "w");
  await ns.write(files[2], "hack(args)", "w");

  const exclude = new Set([""]); //Servers names that won't be used as hosts or deleted

  let servers;
  let hosts;
  let targets;
  let exes;
  let tarIndex;
  let loop;
  let hType;
  let tmp;
  let act;
  let netManager = false;
  let serverManager = false;
  const cycle = [0, "▄", "█", "▀", "█"];
  if (false) {
    brutessh();
    ftpcrack();
    relaysmtp();
    httpworm();
    sqlinject();
  }

  const checkM = (c, d) => eval(c < ns.getPlayer().money / d);
  const arraySort = (arr) => arr.sort((a, b) => b[0] - a[0]);
  function str(s) {
    return s.length > 14 ? `${s.slice(0, 14)}...` : s;
  }
  function info(t, s) {
    if (t == "MM") {
      return ns.getServerMaxMoney(s);
    }
    if (t == "MA") {
      return ns.getServerMoneyAvailable(s);
    }
    if (t == "MR") {
      return ns.getServerMaxRam(s);
    }
    if (t == "UR") {
      return ns.getServerUsedRam(s);
    }
    if (t == "NPR") {
      return ns.getServerNumPortsRequired(s);
    }
    if (t == "RHL") {
      return ns.getServerRequiredHackingLevel(s);
    }
    if (t == "SL") {
      return ns.getServerSecurityLevel(s);
    }
    if (t == "MSL") {
      return ns.getServerMinSecurityLevel(s);
    }
  }

  async function scanExes() {
    for (const hack of [
      "brutessh",
      "ftpcrack",
      "relaysmtp",
      "sqlinject",
      "httpworm",
    ]) {
      if (ns.fileExists(`${hack}.exe`)) {
        exes.push(hack);
      }
    }
  }

  function log() {
    if (cycle[0] >= 4) {
      cycle[0] = 0;
    }
    cycle[0]++;
    ns.clearLog();
    ns.print("╔═══╦════════════════════════════════════╗");
    tmp = targets.slice(0, 12);
    ns.print(`║ ${cycle[cycle[0]]} ║ HIGH PROFIT            BALANCE     ║`);
    for (const t of tmp) {
      ns.print(
        `║ ${act[t[1]]} ║ ${str(t[1])} + ${ns.nFormat(
          info("MA", t[1]),
          "0a"
        )} / ${ns.nFormat(info("MM", t[1]), "0a")} : ${ns.nFormat(
          info("MA", t[1]) / info("MM", t[1]),
          "0%"
        )} ║.padStart(36 - str(t[1]).length)`
      );
    }
    ns.print("╠═══╩════════════════════════════════════╝");
    ns.print(
      `║ EXE ${exes.length}/5 ║ HOSTS ${hosts.length} ║ TARGETS ${targets.length}`
    );
    ns.print("╠═════════════════════════════════════════");

    if (netManager || serverManager) {
      tmp = "║ MANAGER";
      if (netManager) {
        tmp += ` ║ HN-Nodes ${ns.hacknet.numNodes()}`;
      }
      if (serverManager) {
        tmp += ` ║ P-Servers ${ns.getPurchasedServers().length}`;
      }
      ns.print(`${tmp}\n╠═════════════════════════════════════════`);
    }
  }

  async function scanServers(host, current) {
    //Combined scan and check
    for (const server of ns.scan(current)) {
      if (
        (ns.getPurchasedServers().includes(server) ||
          info("NPR", server) <= exes.length) &&
        host != server
      ) {
        if (!ns.getPurchasedServers().includes(server)) {
          for (const hack of exes) {
            ns[hack](server);
          }
          ns.nuke(server);
        }
        if (
          info("MM", server) != 0 &&
          info("RHL", server) <= ns.getHackingLevel() &&
          info("MSL", server) < 100
        ) {
          targets.push([
            Math.floor(info("MM", server) / info("MSL", server)),
            server,
          ]);
          targets = arraySort(targets);
        }
        if (info("MR", server) > 4 && !exclude.has(server)) {
          hosts.push([info("MR", server), server]);
          hosts = arraySort(hosts);
        }
        servers.push(server);
        await ns.scp(files, "home", server);
        await scanServers(current, server);
      }
    }
  }

  async function hackAll() {
    //Dedicates high RAM servers to high value ones
    for (const host of hosts) {
      if (tarIndex > targets.length - 1) {
        tarIndex = 0;
        loop = true;
      }
      const target = targets[tarIndex][1];
      function fRam() {
        return info("MR", host[1]) - info("UR", host[1]);
      }
      if (info("MA", target) < info("MM", target) * 0.8) {
        hType = 0;
      } else if (info("SL", target) > info("MSL", target) + 5 || loop) {
        hType = 1;
        if (fRam() / info("MR", host[1]) > 0.13 && fRam() > 4) {
          tmp = Math.floor(fRam() / 1.75);
          if (tmp > 0) {
            ns.exec(files[1], host[1], tmp, target);
          }
        }
      } else {
        hType = 2;
        for (const h of hosts) {
          if (ns.isRunning(files[2], h[1], target) && h[1] != host[1]) {
            hType = 0;
            break;
          }
        }
        if (hType == 2 && !ns.scriptRunning(files[2], host[1])) {
          if (fRam() < 2) {
            ns.scriptKill(files[0], host[1]);
            ns.scriptKill(files[1], host[1]);
          }
          tmp = [1, Math.floor(fRam() / 1.7)];
          while (
            Number.parseFloat(ns.hackAnalyze(target)) * tmp[0] < 0.7 &&
            tmp[0] <= tmp[1]
          ) {
            tmp[0]++;
          }
          if (tmp[0] > 0) {
            ns.exec(files[2], host[1], tmp[0], target);
          }
        }
      }
      if ((hType == 0 || hType == 2) && fRam() > 4) {
        tmp = [
          Math.ceil((info("MR", host[1]) / 1.75) * 0.14),
          Math.floor((info("MR", host[1]) / 1.75) * 0.79),
        ];
        if (tmp[0] > 0 && fRam() / info("MR", host[1]) >= 0.15) {
          ns.exec(files[1], host[1], tmp[0], target);
        }
        if (tmp[1] > 0 && fRam() / info("MR", host[1]) >= 0.8) {
          ns.exec(files[0], host[1], tmp[1], target);
        }
      }
      if (!loop) {
        if (hType == 0) {
          act[target] = "G";
        }
        if (hType == 1) {
          act[target] = "W";
        }
        if (hType == 2) {
          act[target] = "H";
        }
      }
      tarIndex++;
    }
  }
  //MODULES BELOW HERE
  netManager = await ns.prompt("Activate Hacknet Manager?");
  async function hnManager() {
    if (checkM(ns.hacknet.getPurchaseNodeCost(), 20)) {
      ns.hacknet.purchaseNode();
    }
    for (let i = 0; i < ns.hacknet.numNodes(); i++) {
      for (const part of ["Level", "Ram", "Core"]) {
        if (checkM(ns.hacknet[`get${part}UpgradeCost`](i), 20)) {
          ns.hacknet[`upgrade${part}`](i);
        }
      }
    }
  }
  serverManager = await ns.prompt("Activate Player Server Manager?");
  async function pServerManager() {
    let ram = 0;
    const ramList = [8];
    for (const num of ramList) {
      if (num <= 1_048_576 && checkM(ns.getPurchasedServerCost(num), 20)) {
        ramList.push(num * 2);
        ram = num;
      } else {
        break;
      }
    }
    function buyServer(r) {
      ns.purchaseServer(`SERVER-${ns.nFormat(r * 1_000_000_000, "0.0b")}`, r);
    }
    if (ns.getPurchasedServers().length < 25 && ram > 0) {
      buyServer(ram);
    }
    for (let i = ns.getPurchasedServers().length - 1; i >= 0; i--) {
      tmp = ns.getPurchasedServers()[i];
      if (
        info("MR", tmp) < ram &&
        checkM(ns.getPurchasedServerCost(ram), 20) &&
        !exclude.has(tmp)
      ) {
        ns.killall(tmp);
        ns.deleteServer(tmp);
        buyServer(ram);
      }
    }
  }
  //MODULES ABOVE HERE
  ns.tail();
  while (true) {
    //Keeps everything running once per second
    servers = [];
    targets = [];
    hosts = [[Math.max(info("MR", "home") - 50, 0), "home"]];
    exes = [];
    tarIndex = 0;
    loop = false;
    act = {};
    await scanExes();
    await scanServers("", "home");
    await hackAll();
    if (netManager) {
      await hnManager();
    }
    if (serverManager) {
      await pServerManager();
    }
    log();
    await ns.asleep(1000);
  }
}
