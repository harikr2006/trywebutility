export interface TextStats {
  words: number;
  chars: number;
  charsNoSpaces: number;
  lines: number;
  sentences: number;
  paragraphs: number;
  readingTimeMin: number;
  uniqueWords: number;
}

export function analyzeText(text: string): TextStats {
  if (!text) {
    return {
      words: 0,
      chars: 0,
      charsNoSpaces: 0,
      lines: 0,
      sentences: 0,
      paragraphs: 0,
      readingTimeMin: 0,
      uniqueWords: 0,
    };
  }

  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;

  // Lines: split on newline characters
  const lines = text.split(/\r?\n/).length;

  // Words: non-empty tokens separated by whitespace
  const wordTokens = text.trim().match(/\S+/g) ?? [];
  const words = wordTokens.length;

  // Sentences: split on .  !  ? followed by space or end
  const sentences = (text.match(/[^.!?]*[.!?]+/g) ?? []).filter(
    (s) => s.trim().length > 0
  ).length || (words > 0 ? 1 : 0);

  // Paragraphs: blocks separated by one or more blank lines
  const paragraphs = text
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0).length;

  // Reading time: average 200 words per minute
  const readingTimeMin = words > 0 ? Math.ceil(words / 200) : 0;

  // Unique words (case-insensitive)
  const uniqueWords = new Set(
    wordTokens.map((w) => w.toLowerCase().replace(/[^a-z0-9']/g, ""))
  ).size;

  return {
    words,
    chars,
    charsNoSpaces,
    lines,
    sentences,
    paragraphs,
    readingTimeMin,
    uniqueWords,
  };
}
