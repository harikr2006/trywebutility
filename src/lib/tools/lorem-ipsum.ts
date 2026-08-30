const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde",
  "omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque",
  "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab",
  "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta",
  "explicabo", "nemo", "ipsam", "quia", "voluptas", "aspernatur", "aut", "odit",
  "fugit", "consequuntur", "magni", "dolores", "eos", "ratione", "sequi",
  "nesciunt", "neque", "porro", "quisquam", "dolorem", "adipisci", "numquam",
  "eius", "modi", "tempora", "incidunt", "quaerat",
];

function pickWord(index: number): string {
  return WORDS[index % WORDS.length];
}

export function generateWords(count: number): string {
  const n = Math.max(1, Math.min(count, 5000));
  return Array.from({ length: n }, (_, i) => pickWord(i)).join(" ");
}

export function generateSentences(count: number): string {
  const n = Math.max(1, Math.min(count, 500));
  const sentences: string[] = [];
  let wordIndex = 0;

  for (let i = 0; i < n; i++) {
    // Each sentence is 8-18 words
    const length = 8 + (i % 11);
    const words: string[] = [];
    for (let j = 0; j < length; j++) {
      words.push(pickWord(wordIndex++));
    }
    // Capitalize first word, end with period
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    sentences.push(words.join(" ") + ".");
  }

  return sentences.join(" ");
}

export function generateParagraphs(count: number): string {
  const n = Math.max(1, Math.min(count, 100));
  const paragraphs: string[] = [];
  let sentenceOffset = 0;

  for (let i = 0; i < n; i++) {
    // Each paragraph has 3-7 sentences
    const sentenceCount = 3 + (i % 5);
    let wordIndex = sentenceOffset * 13;
    const sentences: string[] = [];

    for (let s = 0; s < sentenceCount; s++) {
      const length = 8 + ((sentenceOffset + s) % 11);
      const words: string[] = [];
      for (let j = 0; j < length; j++) {
        words.push(pickWord(wordIndex++));
      }
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      sentences.push(words.join(" ") + ".");
    }

    paragraphs.push(sentences.join(" "));
    sentenceOffset += sentenceCount;
  }

  return paragraphs.join("\n\n");
}
