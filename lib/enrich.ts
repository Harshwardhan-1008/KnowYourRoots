export async function enrichSurnameRecord(record: any) {
  const enriched = { ...record };

  try {
    // --- Auto Key ---
    enriched.key = (record.key || record.surname?.toLowerCase()?.trim()) || "";

    // --- Auto Origin Text ---
    if (!record.origin_text && record.origin_type === "place" && record.place_name) {
      enriched.origin_text = `Derived from ${record.place_name}, a historical location in ${record.region || "India"}.`;
    }

    // --- Auto Certainty Score ---
    enriched.certainty_score = record.certainty_score
      ? parseInt(record.certainty_score)
      : 75;

    // --- Auto Added Timestamp ---
    enriched.added_at = new Date();

    // --- If Place-based, enrich with coordinates ---
    if (record.origin_type === "place" && record.place_name) {
      const query = encodeURIComponent(record.place_name);
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

      const res = await fetch(url, { headers: { "User-Agent": "KnowYourRoots/1.0" } });
      const data = await res.json();

      if (data?.length > 0) {
        enriched.place_lat = data[0].lat;
        enriched.place_lng = data[0].lon;
        enriched.region = enriched.region || data[0].display_name;
      }
    }

    // --- Auto SEO description ---
    if (!record.meaning && record.origin_type === "place" && record.place_name) {
      enriched.meaning = `Surname derived from ${record.place_name}, traditionally indicating families who originated from there.`;
    }

    enriched.status = "enriched";
    return enriched;
  } catch (err) {
    console.error("Enrichment failed for:", record.surname, err);
    enriched.status = "error";
    return enriched;
  }
}
