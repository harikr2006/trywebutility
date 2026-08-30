// Named entity map: character -> entity name
const CHAR_TO_ENTITY: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
  "/": "&#x2F;",
  " ": "&nbsp;",
  "©": "&copy;",
  "®": "&reg;",
  "™": "&trade;",
  "€": "&euro;",
  "£": "&pound;",
  "¥": "&yen;",
  "¢": "&cent;",
  "°": "&deg;",
  "±": "&plusmn;",
  "²": "&sup2;",
  "³": "&sup3;",
  "´": "&acute;",
  "µ": "&micro;",
  "¶": "&para;",
  "·": "&middot;",
  "¸": "&cedil;",
  "¹": "&sup1;",
  "º": "&ordm;",
  "»": "&raquo;",
  "¼": "&frac14;",
  "½": "&frac12;",
  "¾": "&frac34;",
  "¿": "&iquest;",
  "À": "&Agrave;",
  "Á": "&Aacute;",
  "Â": "&Acirc;",
  "Ã": "&Atilde;",
  "Ä": "&Auml;",
  "Å": "&Aring;",
  "Æ": "&AElig;",
  "Ç": "&Ccedil;",
  "È": "&Egrave;",
  "É": "&Eacute;",
  "Ê": "&Ecirc;",
  "Ë": "&Euml;",
  "Ì": "&Igrave;",
  "Í": "&Iacute;",
  "Î": "&Icirc;",
  "Ï": "&Iuml;",
  "Ð": "&ETH;",
  "Ñ": "&Ntilde;",
  "Ò": "&Ograve;",
  "Ó": "&Oacute;",
  "Ô": "&Ocirc;",
  "Õ": "&Otilde;",
  "Ö": "&Ouml;",
  "×": "&times;",
  "Ø": "&Oslash;",
  "Ù": "&Ugrave;",
  "Ú": "&Uacute;",
  "Û": "&Ucirc;",
  "Ü": "&Uuml;",
  "Ý": "&Yacute;",
  "Þ": "&THORN;",
  "ß": "&szlig;",
  "à": "&agrave;",
  "á": "&aacute;",
  "â": "&acirc;",
  "ã": "&atilde;",
  "ä": "&auml;",
  "å": "&aring;",
  "æ": "&aelig;",
  "ç": "&ccedil;",
  "è": "&egrave;",
  "é": "&eacute;",
  "ê": "&ecirc;",
  "ë": "&euml;",
  "ì": "&igrave;",
  "í": "&iacute;",
  "î": "&icirc;",
  "ï": "&iuml;",
  "ð": "&eth;",
  "ñ": "&ntilde;",
  "ò": "&ograve;",
  "ó": "&oacute;",
  "ô": "&ocirc;",
  "õ": "&otilde;",
  "ö": "&ouml;",
  "÷": "&divide;",
  "ø": "&oslash;",
  "ù": "&ugrave;",
  "ú": "&uacute;",
  "û": "&ucirc;",
  "ü": "&uuml;",
  "ý": "&yacute;",
  "þ": "&thorn;",
  "ÿ": "&yuml;",
  "–": "&ndash;",
  "—": "&mdash;",
  "‘": "&lsquo;",
  "’": "&rsquo;",
  "“": "&ldquo;",
  "”": "&rdquo;",
  "…": "&hellip;",
  "•": "&bull;",
  "†": "&dagger;",
  "‡": "&Dagger;",
  "‰": "&permil;",
  "‹": "&lsaquo;",
  "›": "&rsaquo;",
};

// Reverse map: entity name -> character
const ENTITY_TO_CHAR: Record<string, string> = {};
for (const [char, entity] of Object.entries(CHAR_TO_ENTITY)) {
  // Strip & and ; to get the entity name
  const name = entity.slice(1, -1);
  ENTITY_TO_CHAR[name] = char;
}

export function encodeHTMLEntities(s: string): string {
  return s.replace(/./gu, (char) => CHAR_TO_ENTITY[char] ?? char);
}

export function decodeHTMLEntities(s: string): string {
  return s
    .replace(/&([a-zA-Z][a-zA-Z0-9]*);/g, (match, name) => {
      return ENTITY_TO_CHAR[name] ?? match;
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(/&#([0-9]+);/g, (_, dec) =>
      String.fromCodePoint(parseInt(dec, 10))
    );
}
