export interface SubnetInfo {
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  subnetMask: string;
  wildcardMask: string;
  totalHosts: number;
  usableHosts: number;
  cidr: number;
  ipClass: string;
  error: string | null;
}

function ipToInt(ip: string): number {
  return ip.split(".").reduce((acc, octet) => (acc << 8) | parseInt(octet, 10), 0) >>> 0;
}

function intToIp(n: number): string {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff].join(".");
}

export function calculateSubnet(cidrInput: string): SubnetInfo {
  try {
    const [ip, prefixStr] = cidrInput.trim().split("/");
    if (!ip || !prefixStr) throw new Error("Invalid CIDR notation. Use format: 192.168.1.0/24");
    const prefix = parseInt(prefixStr, 10);
    if (isNaN(prefix) || prefix < 0 || prefix > 32) throw new Error("Prefix must be 0-32");
    const parts = ip.split(".").map(Number);
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) throw new Error("Invalid IP address");

    const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
    const wildcard = (~mask) >>> 0;
    const ipInt = ipToInt(ip);
    const network = (ipInt & mask) >>> 0;
    const broadcast = (network | wildcard) >>> 0;
    const totalHosts = Math.pow(2, 32 - prefix);
    const usableHosts = prefix >= 31 ? totalHosts : Math.max(0, totalHosts - 2);
    const firstHost = prefix >= 31 ? intToIp(network) : intToIp(network + 1);
    const lastHost = prefix >= 31 ? intToIp(broadcast) : intToIp(broadcast - 1);

    const firstOctet = (ipInt >>> 24) & 0xff;
    const ipClass = firstOctet < 128 ? "A" : firstOctet < 192 ? "B" : firstOctet < 224 ? "C" : firstOctet < 240 ? "D" : "E";

    return {
      networkAddress: intToIp(network),
      broadcastAddress: intToIp(broadcast),
      firstHost, lastHost,
      subnetMask: intToIp(mask),
      wildcardMask: intToIp(wildcard),
      totalHosts, usableHosts,
      cidr: prefix, ipClass, error: null,
    };
  } catch (e) {
    return {
      networkAddress: "", broadcastAddress: "", firstHost: "", lastHost: "",
      subnetMask: "", wildcardMask: "", totalHosts: 0, usableHosts: 0,
      cidr: 0, ipClass: "", error: e instanceof Error ? e.message : "Error",
    };
  }
}
