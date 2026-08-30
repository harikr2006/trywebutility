export interface ASCIIChar {
  decimal: number;
  hex: string;
  octal: string;
  binary: string;
  char: string;
  html: string;
  description: string;
}

const DESCRIPTIONS: Record<number, string> = {
  0:"NUL",1:"SOH",2:"STX",3:"ETX",4:"EOT",5:"ENQ",6:"ACK",7:"BEL",8:"BS",9:"HT",
  10:"LF",11:"VT",12:"FF",13:"CR",14:"SO",15:"SI",16:"DLE",17:"DC1",18:"DC2",19:"DC3",
  20:"DC4",21:"NAK",22:"SYN",23:"ETB",24:"CAN",25:"EM",26:"SUB",27:"ESC",28:"FS",29:"GS",
  30:"RS",31:"US",32:"Space",127:"DEL",
};

export function getASCIITable(start = 0, end = 127): ASCIIChar[] {
  return Array.from({ length: end - start + 1 }, (_, i) => {
    const code = start + i;
    const isPrintable = code >= 32 && code <= 126;
    return {
      decimal: code,
      hex: code.toString(16).toUpperCase().padStart(2, "0"),
      octal: code.toString(8).padStart(3, "0"),
      binary: code.toString(2).padStart(8, "0"),
      char: isPrintable ? String.fromCharCode(code) : "",
      html: isPrintable && code !== 32 ? `&#${code};` : code === 32 ? "&nbsp;" : "",
      description: DESCRIPTIONS[code] ?? (isPrintable ? String.fromCharCode(code) : ""),
    };
  });
}
