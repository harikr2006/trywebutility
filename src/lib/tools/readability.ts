export interface ReadabilityResult {
  fleschReading: number;
  fleschGrade: number;
  gunningFog: number;
  avgWordsPerSentence: number;
  avgSyllablesPerWord: number;
  sentenceCount: number;
  wordCount: number;
  syllableCount: number;
  level: string;
  error: string | null;
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return 0;
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const m = word.match(/[aeiouy]{1,2}/g);
  return Math.max(1, m ? m.length : 1);
}

function countComplexWords(words: string[]): number {
  return words.filter(w => countSyllables(w) >= 3).length;
}

export function analyzeReadability(text: string): ReadabilityResult {
  const empty = { fleschReading: 0, fleschGrade: 0, gunningFog: 0, avgWordsPerSentence: 0, avgSyllablesPerWord: 0, sentenceCount: 0, wordCount: 0, syllableCount: 0, level: "", error: "" };
  if (!text.trim()) return { ...empty, error: null };
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.match(/\b[a-zA-Z]+\b/g) ?? [];
  if (words.length < 5) return { ...empty, error: "Need at least 5 words for analysis" };
  const syllableCount = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const sentenceCount = Math.max(1, sentences.length);
  const wordCount = words.length;
  const avgW = wordCount / sentenceCount;
  const avgS = syllableCount / wordCount;
  const fleschReading = Math.round(206.835 - 1.015 * avgW - 84.6 * avgS);
  const fleschGrade = Math.round(0.39 * avgW + 11.8 * avgS - 15.59);
  const complexWords = countComplexWords(words);
  const gunningFog = Math.round(0.4 * (avgW + 100 * (complexWords / wordCount)));

  const level =
    fleschReading >= 90 ? "5th grade (Very Easy)" :
    fleschReading >= 70 ? "6th grade (Easy)" :
    fleschReading >= 60 ? "7th-8th grade (Standard)" :
    fleschReading >= 50 ? "9th-10th grade (Fairly Difficult)" :
    fleschReading >= 30 ? "College (Difficult)" :
    "Professional (Very Difficult)";

  return { fleschReading: Math.min(100, Math.max(0, fleschReading)), fleschGrade: Math.max(0, fleschGrade), gunningFog: Math.max(0, gunningFog), avgWordsPerSentence: Math.round(avgW * 10) / 10, avgSyllablesPerWord: Math.round(avgS * 100) / 100, sentenceCount, wordCount, syllableCount, level, error: null };
}
