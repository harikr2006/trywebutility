const TEXT_TO_MORSE: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....",
  I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.",
  Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....",
  "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--",
  "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...",
  ";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-",
  "\"": ".-..-.", "$": "...-..-", "@": ".--.-.",
};

const MORSE_TO_TEXT: Record<string, string> = Object.fromEntries(
  Object.entries(TEXT_TO_MORSE).map(([k, v]) => [v, k])
);

export function textToMorse(text: string): { output: string; error: string | null } {
  const words = text.toUpperCase().split(/\s+/);
  const morseWords = words.map(word => {
    const chars = word.split("").map(c => {
      const m = TEXT_TO_MORSE[c];
      return m ?? `[?${c}]`;
    });
    return chars.join(" ");
  });
  return { output: morseWords.join(" / "), error: null };
}

export function morseToText(morse: string): { output: string; error: string | null } {
  const words = morse.trim().split(/\s*\/\s*/);
  const textWords = words.map(word => {
    const codes = word.trim().split(/\s+/);
    return codes.map(code => {
      if (!code) return "";
      const c = MORSE_TO_TEXT[code];
      if (!c) return `[?]`;
      return c;
    }).join("");
  });
  return { output: textWords.join(" "), error: null };
}

export { TEXT_TO_MORSE };
