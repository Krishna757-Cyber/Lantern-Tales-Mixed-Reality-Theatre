/* ================================================================
   LANTERN TALES — FABLE & STORYTELLING MODULE (src/story/fables.ts)
   Loads world fables, cultural lineages, and performance acts
================================================================ */

export async function loadFables() {
  try {
    const res = await fetch('/api/fables');
    if (!res.ok) throw new Error('API fetch failed');
    return await res.json();
  } catch (err) {
    console.warn('[Fables] Using bundled fallback data:', err);
    return null;
  }
}
