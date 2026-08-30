export interface UAResult {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: string;
  engine: string;
  isBot: boolean;
  isMobile: boolean;
  raw: string;
}

function match(ua: string, pattern: RegExp): string {
  const m = ua.match(pattern);
  return m ? m[1] ?? "" : "";
}

export function parseUserAgent(ua: string): UAResult {
  const result: UAResult = {
    browser: "Unknown",
    browserVersion: "",
    os: "Unknown",
    osVersion: "",
    device: "Desktop",
    engine: "Unknown",
    isBot: false,
    isMobile: false,
    raw: ua,
  };

  if (!ua) return result;

  // Bot detection
  const botPattern =
    /bot|crawler|spider|crawling|Googlebot|bingbot|Slurp|DuckDuckBot|facebookexternalhit|Baiduspider|YandexBot|Sogou|Exabot|ia_archiver|Pinterestbot|Twitterbot|AhrefsBot|SemrushBot|MJ12bot|DotBot/i;
  result.isBot = botPattern.test(ua);

  // Mobile detection
  result.isMobile = /Mobile|Android.*(?!Tablet)|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  // Device
  if (/iPad/i.test(ua)) {
    result.device = "Tablet";
  } else if (/iPhone/i.test(ua)) {
    result.device = "iPhone";
  } else if (/Android/i.test(ua) && /Mobile/i.test(ua)) {
    result.device = "Android Phone";
  } else if (/Android/i.test(ua)) {
    result.device = "Android Tablet";
  } else if (result.isMobile) {
    result.device = "Mobile";
  } else if (result.isBot) {
    result.device = "Bot";
  } else {
    result.device = "Desktop";
  }

  // OS detection
  if (/Windows NT/i.test(ua)) {
    result.os = "Windows";
    const ntVersion = match(ua, /Windows NT ([\d.]+)/i);
    const ntMap: Record<string, string> = {
      "10.0": "10/11",
      "6.3": "8.1",
      "6.2": "8",
      "6.1": "7",
      "6.0": "Vista",
      "5.2": "XP x64",
      "5.1": "XP",
      "5.0": "2000",
    };
    result.osVersion = ntMap[ntVersion] ?? ntVersion;
  } else if (/Mac OS X/i.test(ua)) {
    result.os = "macOS";
    result.osVersion = match(ua, /Mac OS X ([\d_]+)/i).replace(/_/g, ".");
  } else if (/Android/i.test(ua)) {
    result.os = "Android";
    result.osVersion = match(ua, /Android ([\d.]+)/i);
  } else if (/iPhone OS/i.test(ua)) {
    result.os = "iOS";
    result.osVersion = match(ua, /iPhone OS ([\d_]+)/i).replace(/_/g, ".");
  } else if (/iPad.*OS/i.test(ua)) {
    result.os = "iPadOS";
    result.osVersion = match(ua, /OS ([\d_]+)/i).replace(/_/g, ".");
  } else if (/Linux/i.test(ua)) {
    result.os = "Linux";
    result.osVersion = "";
  } else if (/CrOS/i.test(ua)) {
    result.os = "Chrome OS";
    result.osVersion = match(ua, /CrOS \w+ ([\d.]+)/i);
  }

  // Engine detection
  if (/Trident/i.test(ua)) {
    result.engine = "Trident";
  } else if (/Gecko/i.test(ua) && !/like Gecko/i.test(ua)) {
    result.engine = "Gecko";
  } else if (/AppleWebKit/i.test(ua)) {
    result.engine = "WebKit";
  } else if (/Presto/i.test(ua)) {
    result.engine = "Presto";
  }

  // Browser detection — order matters (Edge/Opera before Chrome, Chrome before Safari)
  if (/Edg\//i.test(ua)) {
    result.browser = "Microsoft Edge";
    result.browserVersion = match(ua, /Edg\/([\d.]+)/i);
    result.engine = "Blink";
  } else if (/EdgA\//i.test(ua)) {
    result.browser = "Microsoft Edge (Android)";
    result.browserVersion = match(ua, /EdgA\/([\d.]+)/i);
    result.engine = "Blink";
  } else if (/OPR\//i.test(ua)) {
    result.browser = "Opera";
    result.browserVersion = match(ua, /OPR\/([\d.]+)/i);
    result.engine = "Blink";
  } else if (/Opera Mini/i.test(ua)) {
    result.browser = "Opera Mini";
    result.browserVersion = match(ua, /Opera Mini\/([\d.]+)/i);
    result.engine = "Presto";
  } else if (/Opera/i.test(ua)) {
    result.browser = "Opera";
    result.browserVersion = match(ua, /Opera\/([\d.]+)/i);
    result.engine = "Presto";
  } else if (/Trident\/|MSIE /i.test(ua)) {
    result.browser = "Internet Explorer";
    result.browserVersion =
      match(ua, /rv:([\d.]+)/) || match(ua, /MSIE ([\d.]+)/i);
    result.engine = "Trident";
  } else if (/SamsungBrowser/i.test(ua)) {
    result.browser = "Samsung Browser";
    result.browserVersion = match(ua, /SamsungBrowser\/([\d.]+)/i);
    result.engine = "Blink";
  } else if (/UCBrowser/i.test(ua)) {
    result.browser = "UC Browser";
    result.browserVersion = match(ua, /UCBrowser\/([\d.]+)/i);
  } else if (/YaBrowser/i.test(ua)) {
    result.browser = "Yandex Browser";
    result.browserVersion = match(ua, /YaBrowser\/([\d.]+)/i);
    result.engine = "Blink";
  } else if (/Firefox/i.test(ua)) {
    result.browser = "Firefox";
    result.browserVersion = match(ua, /Firefox\/([\d.]+)/i);
    result.engine = "Gecko";
  } else if (/FxiOS/i.test(ua)) {
    result.browser = "Firefox (iOS)";
    result.browserVersion = match(ua, /FxiOS\/([\d.]+)/i);
    result.engine = "WebKit";
  } else if (/CriOS/i.test(ua)) {
    result.browser = "Chrome (iOS)";
    result.browserVersion = match(ua, /CriOS\/([\d.]+)/i);
    result.engine = "WebKit";
  } else if (/Chrome/i.test(ua)) {
    result.browser = "Chrome";
    result.browserVersion = match(ua, /Chrome\/([\d.]+)/i);
    result.engine = "Blink";
  } else if (/Safari/i.test(ua)) {
    result.browser = "Safari";
    result.browserVersion = match(ua, /Version\/([\d.]+)/i);
    result.engine = "WebKit";
  } else if (result.isBot) {
    result.browser = "Bot/Crawler";
    result.browserVersion = "";
  }

  return result;
}
