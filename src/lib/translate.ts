/**
 * AI & Automatic English-to-Arabic Translation Engine
 * Resilient multi-provider translation using Google Translate & MyMemory
 */

export async function translateEnglishToArabic(text: string): Promise<string> {
  const trimmed = text?.trim();
  if (!trimmed) return "";

  // Guard against excessive payload denial-of-service
  const sanitized = trimmed.slice(0, 5000);

  // If already predominantly Arabic, return as-is
  const arabicRegex = /[\u0600-\u06FF]/;
  if (arabicRegex.test(sanitized) && sanitized.length > 5 && !/[a-zA-Z]/.test(sanitized)) {
    return sanitized;
  }

  // Provider 1: Google Translate API (atv engine)
  try {
    const response = await fetch("https://translate.google.com/translate_a/single?client=atv&dt=t&dj=1", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      body: `sl=en&tl=ar&q=${encodeURIComponent(trimmed)}`,
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data?.sentences) && data.sentences.length > 0) {
        const translated = data.sentences.map((s: { trans?: string }) => s?.trans || "").join("").trim();
        if (translated) return translated;
      }
    }
  } catch (err) {
    console.warn("Google translate error, falling back to MyMemory:", err);
  }

  // Provider 2: MyMemory Translation API fallback
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=en|ar`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (response.ok) {
      const data = await response.json();
      const translated = data?.responseData?.translatedText?.trim();
      if (translated && !translated.startsWith("MYMEMORY WARNING")) {
        return translated;
      }
    }
  } catch (err) {
    console.warn("MyMemory translation fallback error:", err);
  }

  // If both APIs fail (e.g. offline), return original string safely
  return trimmed;
}

/**
 * Translate multiple key-value text pairs in parallel
 */
export async function translateBatchEnglishToArabic(
  texts: Record<string, string | undefined>
): Promise<Record<string, string>> {
  const entries = Object.entries(texts);
  const results: Record<string, string> = {};

  await Promise.all(
    entries.map(async ([key, value]) => {
      if (!value) {
        results[key] = "";
        return;
      }
      results[key] = await translateEnglishToArabic(value);
    })
  );

  return results;
}
