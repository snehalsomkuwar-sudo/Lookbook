import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import { encodeBase64 } from "jsr:@std/encoding/base64";
// kv_store is imported dynamically inside route handlers to avoid top-level init crash

const app = new Hono();

// Supabase client (service role — server only)
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// Enable logger
app.use("*", logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check
app.get("/make-server-ef09e2ac/health", (c) => c.json({ status: "ok" }));

/* ──────────────────────────────────────────────
   GET /looks?room=<slug>
   Returns all looks for a room, with style name
   and product count. Categorised by section flags.
────────────────────────────────────────────── */
app.get("/make-server-ef09e2ac/looks", async (c) => {
  const roomSlug = c.req.query("room");
  try {
    // Resolve room slug → id
    let roomId: string | null = null;
    if (roomSlug) {
      const { data: room, error: roomErr } = await supabase
        .from("lb_rooms")
        .select("id, slug")
        .eq("slug", roomSlug)
        .maybeSingle();            // returns null instead of error when 0 rows
      if (roomErr) {
        console.log(`Room lookup error for slug="${roomSlug}":`, roomErr.message);
      } else if (!room) {
        // Log available slugs so we can diagnose mismatches
        const { data: allRooms } = await supabase.from("lb_rooms").select("name, slug");
        console.log(`No room found for slug="${roomSlug}". Available:`, JSON.stringify(allRooms));
        return c.json([]);         // return empty — don't 500
      }
      roomId = room?.id ?? null;
    }

    // Fetch looks with style + room joins
    let query = supabase
      .from("lb_looks")
      .select(
        "id, name, image_url, price, is_top_pick, is_trending, is_under_budget, style:lb_styles(name), room:lb_rooms(name, slug)",
      );
    if (roomId) query = query.eq("room_id", roomId);

    const { data: looks, error } = await query;
    if (error) throw new Error(`Looks fetch failed: ${error.message}`);

    // Count hotspot products per look
    const lookIds = (looks ?? []).map((l: any) => l.id);
    const { data: lps } = await supabase
      .from("lb_look_products")
      .select("look_id")
      .in("look_id", lookIds);

    const countMap = (lps ?? []).reduce(
      (acc: Record<string, number>, row: any) => {
        acc[row.look_id] = (acc[row.look_id] || 0) + 1;
        return acc;
      },
      {},
    );

    const result = (looks ?? []).map((l: any) => ({
      id: l.id,
      name: l.name,
      image_url: l.image_url,
      price: l.price,
      is_top_pick: l.is_top_pick,
      is_trending: l.is_trending,
      is_under_budget: l.is_under_budget,
      style_name: l.style?.name ?? "",
      room_name: l.room?.name ?? "",
      room_slug: l.room?.slug ?? "",
      item_count: countMap[l.id] ?? 0,
    }));

    return c.json(result);
  } catch (err: any) {
    console.log("Error in GET /looks:", err.message);
    return c.json({ error: err.message }, 500);
  }
});

/* ──────────────────────────────────────────────
   GET /looks/:id/products
   Returns hotspot products for a look,
   each with x/y coordinates and alternatives.
────────────────────────────────────────────── */
app.get("/make-server-ef09e2ac/looks/:id/products", async (c) => {
  const lookId = c.req.param("id");
  try {
    const { data: lps, error } = await supabase
      .from("lb_look_products")
      .select(
        "x_percent, y_percent, is_featured, product:lb_products(id, name, category, brand, price, description, image_url, in_stock)",
      )
      .eq("look_id", lookId);
    if (error)
      throw new Error(`Look products fetch failed: ${error.message}`);

    const productIds = (lps ?? [])
      .map((lp: any) => lp.product?.id)
      .filter(Boolean);

    // Fetch alternatives for all products in one query
    const { data: alts } = await supabase
      .from("lb_product_alternatives")
      .select(
        "product_id, sort_order, alternative:lb_products!alternative_product_id(id, name, price, category, image_url)",
      )
      .in("product_id", productIds)
      .order("sort_order");

    const altMap = (alts ?? []).reduce(
      (acc: Record<string, any[]>, row: any) => {
        if (!acc[row.product_id]) acc[row.product_id] = [];
        acc[row.product_id].push(row.alternative);
        return acc;
      },
      {},
    );

    const result = (lps ?? []).map((lp: any) => {
      const p = lp.product ?? {};
      return {
        id: p.id,
        name: p.name,
        category: p.category,
        brand: p.brand,
        price: p.price,
        description: p.description,
        image_url: p.image_url,
        in_stock: p.in_stock,
        x_percent: lp.x_percent,
        y_percent: lp.y_percent,
        is_featured: lp.is_featured,
        alternatives: altMap[p.id] ?? [],
      };
    });

    return c.json(result);
  } catch (err: any) {
    console.log("Error in GET /looks/:id/products:", err.message);
    return c.json({ error: err.message }, 500);
  }
});

/* ──────────────────────────────────────────────
   GET /products/categories
   Returns all unique category values from lb_products
────────────────────────────────────────────── */
app.get("/make-server-ef09e2ac/products/categories", async (c) => {
  try {
    const { data, error } = await supabase
      .from("lb_products")
      .select("category");
    if (error) throw new Error(`Categories fetch failed: ${error.message}`);
    const unique = [...new Set((data ?? []).map((r: any) => r.category).filter(Boolean))].sort();
    return c.json(unique);
  } catch (err: any) {
    console.log("Error in GET /products/categories:", err.message);
    return c.json({ error: err.message }, 500);
  }
});

/* ──────────────────────────────────────────────
   GET /products/by-category
   Returns product names grouped by category
────────────────────────────────────────────── */
app.get("/make-server-ef09e2ac/products/by-category", async (c) => {
  try {
    const { data, error } = await supabase
      .from("lb_products")
      .select("name, category")
      .order("category");
    if (error) throw new Error(`Products by category fetch failed: ${error.message}`);
    const grouped = (data ?? []).reduce((acc: Record<string, string[]>, row: any) => {
      if (!acc[row.category]) acc[row.category] = [];
      acc[row.category].push(row.name);
      return acc;
    }, {});
    return c.json(grouped);
  } catch (err: any) {
    console.log("Error in GET /products/by-category:", err.message);
    return c.json({ error: err.message }, 500);
  }
});

/* ──────────────────────────────────────────────
   POST /moodboard
   Accepts { look_id, image_url, look_name, style_name }
   Returns a moodboard object generated by Gemini Vision.
   Results are cached in KV store per look_id.
────────────────────────────────────────────── */
app.post("/make-server-ef09e2ac/moodboard", async (c) => {
  const { look_id, image_url, look_name, style_name } = await c.req.json();

  if (!look_id || !image_url) {
    return c.json({ error: "look_id and image_url are required" }, 400);
  }

  const cacheKey = `lb_moodboard_v2:${look_id}`;

  try {
    // ── 1. Check KV cache (lazy import to avoid top-level init crash) ──
    const kv = await import("./kv_store.tsx");
    const cached = await kv.get(cacheKey);
    if (cached) {
      console.log(`[moodboard] cache hit for look_id=${look_id}`);
      return c.json(cached);
    }

    // ── 2. Fetch image → base64 ────────────────────────────────
    const imgResp = await fetch(image_url, { headers: { "Accept": "image/*" } });
    if (!imgResp.ok) throw new Error(`Image fetch failed with status ${imgResp.status}`);
    const imgBuffer = await imgResp.arrayBuffer();
    const bytes = new Uint8Array(imgBuffer);
    const base64Data = encodeBase64(bytes);
    // Strip charset parameter from MIME type (e.g. "image/jpeg; charset=UTF-8" -> "image/jpeg")
    const mimeType = (imgResp.headers.get("content-type") || "image/jpeg").split(";")[0].trim();
    console.log(`[moodboard] image fetched: ${bytes.length} bytes, mimeType=${mimeType}`);

    // ── 3. Call Gemini Vision ───────────────────────────────────
    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiKey) throw new Error("GEMINI_API_KEY environment variable is not set");

    const prompt = `You are a senior interior design expert and colour analyst.
Carefully analyse this interior design image called "${look_name}" which showcases the "${style_name}" aesthetic.

Return ONLY a valid JSON object — no markdown fences, no extra commentary. Use this exact schema:
{
  "palette": [
    {"hex": "#RRGGBB", "name": "Color Name"}
  ],
  "mood_words": ["word1", "word2", "word3", "word4", "word5", "word6"],
  "materials": ["material 1", "material 2", "material 3", "material 4", "material 5"],
  "ambience": "One evocative sentence (max 30 words) capturing the feeling of this space.",
  "design_principles": ["Principle one", "Principle two", "Principle three"]
}

Rules:
- palette: exactly 5 dominant hex colours extracted from the image (real colours you see, not guesses)
- mood_words: exactly 6 evocative single words that describe the emotional mood of the space
- materials: 4–5 primary materials visible in the space (e.g. "solid walnut", "travertine marble", "bouclé linen")
- ambience: one sentence, poetic and specific to this image
- design_principles: exactly 3 concise interior-design principles this look demonstrates`;

    const geminiResp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ inlineData: { mimeType, data: base64Data } }, { text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
        }),
      }
    );

    if (!geminiResp.ok) {
      const errBody = await geminiResp.text();
      throw new Error(`Gemini API error ${geminiResp.status}: ${errBody}`);
    }

    const geminiData = await geminiResp.json();
    const rawText: string = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    console.log(`[moodboard] Gemini raw text: ${rawText.slice(0, 200)}`);

    // Extract JSON from the response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error(`No JSON found in Gemini response: ${rawText.slice(0, 300)}`);
    const moodboard = JSON.parse(jsonMatch[0]);

    // ── 4. Cache & return ──────────────────────────────────────
    await kv.set(cacheKey, moodboard);
    console.log(`[moodboard] generated and cached for look_id=${look_id}`);
    return c.json(moodboard);

  } catch (err: any) {
    console.log(`[moodboard] Error for look_id=${look_id}:`, err.message);
    return c.json({ error: err.message }, 500);
  }
});

/* ──────────────────────────────────────────────
   POST /match-image
   Accepts { image_url } (can be URL or base64)
   Returns a moodboard-style analysis of uploaded image
────────────────────────────────────────────── */
app.post("/make-server-ef09e2ac/match-image", async (c) => {
  const { image_url } = await c.req.json();

  if (!image_url) {
    return c.json({ error: "image_url is required" }, 400);
  }

  try {
    let base64Data: string;
    let mimeType: string;

    // ── 1. Handle base64 or URL ──────────────────────────────
    if (image_url.startsWith("data:")) {
      // Base64 data URI
      const matches = image_url.match(/^data:(image\/[^;]+);base64,(.+)$/);
      if (!matches) throw new Error("Invalid base64 data URI");
      mimeType = matches[1];
      base64Data = matches[2];
      console.log(`[match-image] base64 image detected, mimeType=${mimeType}`);
    } else {
      // External URL
      const imgResp = await fetch(image_url, { headers: { "Accept": "image/*" } });
      if (!imgResp.ok) throw new Error(`Image fetch failed with status ${imgResp.status}`);
      const imgBuffer = await imgResp.arrayBuffer();
      const bytes = new Uint8Array(imgBuffer);
      base64Data = encodeBase64(bytes);
      mimeType = (imgResp.headers.get("content-type") || "image/jpeg").split(";")[0].trim();
      console.log(`[match-image] URL image fetched: ${bytes.length} bytes, mimeType=${mimeType}`);
    }

    // ── 2. Call Gemini Vision ───────────────────────────────────
    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiKey) throw new Error("GEMINI_API_KEY environment variable is not set");

    const prompt = `You are a senior interior design expert analyzing a user-uploaded interior image.

Analyze this image and return ONLY a valid JSON object — no markdown fences, no extra commentary. Use this exact schema:
{
  "room_type": "The specific room type (e.g., Kitchen, Living Room, Bedroom, Bathroom, Dining Room, Home Office, etc.)",
  "style": "Primary design style (e.g., Modern Scandinavian, Industrial Chic, etc.)",
  "palette": ["#RRGGBB", "#RRGGBB", "#RRGGBB", "#RRGGBB", "#RRGGBB"],
  "materials": ["material 1", "material 2", "material 3", "material 4"],
  "mood_words": ["word1", "word2", "word3", "word4", "word5", "word6"],
  "summary": "A concise 2-3 sentence description of this interior's aesthetic and design approach."
}

Rules:
- room_type: identify the specific room type from the image (Kitchen, Living Room, Bedroom, Bathroom, Dining Room, Home Office, etc.)
- style: identify the dominant interior design style from the image
- palette: exactly 5 dominant hex colors extracted from the image
- materials: 3-5 primary materials visible (e.g., "oak wood", "marble", "linen fabric")
- mood_words: exactly 6 evocative words describing the emotional feel
- summary: 2-3 sentences capturing the essence of this space`;

    const geminiResp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ inlineData: { mimeType, data: base64Data } }, { text: prompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
        }),
      }
    );

    if (!geminiResp.ok) {
      const errBody = await geminiResp.text();
      throw new Error(`Gemini API error ${geminiResp.status}: ${errBody}`);
    }

    const geminiData = await geminiResp.json();
    const rawText: string = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    console.log(`[match-image] Gemini raw text: ${rawText.slice(0, 200)}`);

    // Extract JSON from the response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error(`No JSON found in Gemini response: ${rawText.slice(0, 300)}`);
    const analysis = JSON.parse(jsonMatch[0]);

    console.log(`[match-image] successfully analyzed image`);
    return c.json(analysis);

  } catch (err: any) {
    console.log(`[match-image] Error:`, err.message);
    return c.json({ error: err.message }, 500);
  }
});

/* ──────────────────────────────────────────────
   GET /moodboard-materials
   Returns a map of look_id → { materials, mood_words, palette }
   for all looks that have Gemini moodboard data in the KV cache.
   Used by the Search panel for real-time material-based filtering.
────────────────────────────────────────────── */
app.get("/make-server-ef09e2ac/moodboard-materials", async (c) => {
  try {
    // 1. Fetch all look IDs from the database
    const { data: looks, error } = await supabase
      .from("lb_looks")
      .select("id");
    if (error) throw new Error(`Looks ID fetch failed: ${error.message}`);

    const lookIds = (looks ?? []).map((l: any) => l.id as string);
    if (lookIds.length === 0) {
      console.log("[moodboard-materials] no looks found in database");
      return c.json({});
    }

    // 2. Batch-fetch all cached moodboards from KV store in one call
    const kv = await import("./kv_store.tsx");
    const keys = lookIds.map((id) => `lb_moodboard_v2:${id}`);
    const values = await kv.mget(keys);

    // 3. Build look_id → { materials, mood_words, palette } map
    //    Only include looks that have been Gemini-analyzed and cached
    const result: Record<string, {
      materials: string[];
      mood_words: string[];
      palette: string[];
    }> = {};

    lookIds.forEach((id, i) => {
      const mb = values[i];
      if (mb && mb.materials && Array.isArray(mb.materials)) {
        result[id] = {
          materials: mb.materials.map((m: any) => String(m).toLowerCase()),
          mood_words: (mb.mood_words ?? []).map((w: any) => String(w).toLowerCase()),
          // palette can be [{hex, name}] or ["#hex"] — normalise to plain hex strings
          palette: (mb.palette ?? [])
            .map((p: any) => (typeof p === "string" ? p : (p?.hex ?? "")))
            .filter((p: string) => p.startsWith("#")),
        };
      }
    });

    const cachedCount = Object.keys(result).length;
    console.log(
      `[moodboard-materials] returning Gemini data for ${cachedCount}/${lookIds.length} looks`
    );
    return c.json(result);
  } catch (err: any) {
    console.log("[moodboard-materials] Error:", err.message);
    return c.json({ error: err.message }, 500);
  }
});

/* ──────────────────────────────────────────────
   Shared helper: upsert a room + styles + looks + products
────────────────────────────────────────────── */
async function seedRoom(
  roomName: string,
  roomSlug: string,
  looks: Array<{
    name: string; image_url: string; price: number; style: string;
    is_top_pick: boolean; is_trending: boolean; is_under_budget: boolean;
    products: Array<{
      name: string; category: string; brand: string; price: number;
      description: string; image_url: string; in_stock: boolean;
      x: number; y: number; featured: boolean;
    }>;
  }>
) {
  // 1. Upsert room
  const { data: existingRoom } = await supabase
    .from("lb_rooms").select("id").eq("slug", roomSlug).maybeSingle();
  let roomId: string;
  if (existingRoom?.id) {
    roomId = existingRoom.id;
  } else {
    const { data: newRoom, error: re } = await supabase
      .from("lb_rooms").insert({ name: roomName, slug: roomSlug }).select("id").single();
    if (re) throw new Error(`Room insert: ${re.message}`);
    roomId = newRoom.id;
  }

  // 2. Upsert styles
  const styleIds: Record<string, string> = {};
  const styleNames = [...new Set(looks.map(l => l.style))];
  for (const name of styleNames) {
    const { data: ex } = await supabase.from("lb_styles").select("id").eq("name", name).maybeSingle();
    if (ex?.id) { styleIds[name] = ex.id; }
    else {
      const { data: ns, error: se } = await supabase.from("lb_styles").insert({ name }).select("id").single();
      if (se) throw new Error(`Style insert "${name}": ${se.message}`);
      styleIds[name] = ns.id;
    }
  }

  // 3. Insert each look + products
  const inserted: string[] = [];
  for (const look of looks) {
    const { data: existLook } = await supabase
      .from("lb_looks").select("id").eq("name", look.name).eq("room_id", roomId).maybeSingle();
    if (existLook?.id) { inserted.push(look.name + " (skipped)"); continue; }

    const { data: newLook, error: le } = await supabase.from("lb_looks").insert({
      name: look.name, image_url: look.image_url, price: look.price,
      room_id: roomId, style_id: styleIds[look.style] ?? null,
      is_top_pick: look.is_top_pick, is_trending: look.is_trending, is_under_budget: look.is_under_budget,
    }).select("id").single();
    if (le) throw new Error(`Look insert "${look.name}": ${le.message}`);

    for (const p of look.products) {
      const { data: newProd, error: pe } = await supabase.from("lb_products").insert({
        name: p.name, category: p.category, brand: p.brand, price: p.price,
        description: p.description, image_url: p.image_url, in_stock: p.in_stock,
      }).select("id").single();
      if (pe) throw new Error(`Product insert "${p.name}": ${pe.message}`);
      const { error: lpe } = await supabase.from("lb_look_products").insert({
        look_id: newLook.id, product_id: newProd.id,
        x_percent: p.x, y_percent: p.y, is_featured: p.featured,
      });
      if (lpe) throw new Error(`LP link "${p.name}": ${lpe.message}`);
    }
    inserted.push(look.name);
    console.log(`[seed-${roomSlug}] inserted "${look.name}" with ${look.products.length} products`);
  }
  return inserted;
}

/* ──────────────────────────────────────────────
   POST /seed-kids-room
────────────────────────────────────────────── */
app.post("/make-server-ef09e2ac/seed-kids-room", async (c) => {
  try {
    const inserted = await seedRoom("Kids Room", "kids-room", [
      {
        name: "Rainbow Playhouse",
        image_url: "https://images.unsplash.com/photo-1769690399035-2f4e60edf2ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwYmVkcm9vbSUyMGNvbG9yZnVsJTIwcGxheWZ1bCUyMGludGVyaW9yJTIwZGVzaWdufGVufDF8fHx8MTc3MjcwMTc3OHww&ixlib=rb-4.1.0&q=80&w=1080",
        price: 95000,
        style: "Playful Colourful",
        is_top_pick: true, is_trending: false, is_under_budget: false,
        products: [
          { name: "Mid-Sleeper Cabin Bed", category: "Beds", brand: "Livspace", price: 38000, description: "Solid pine mid-sleeper with built-in slide and storage ladder.", image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80", in_stock: true, x: 50, y: 55, featured: true },
          { name: "Rainbow Bookshelf", category: "Storage", brand: "KidsNest", price: 12500, description: "Wall-mounted arch bookshelf in 7 colour segments, holds 40+ books.", image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", in_stock: true, x: 20, y: 35, featured: false },
          { name: "Play Mat Foam Set", category: "Rugs", brand: "SafePlay", price: 4800, description: "Interlocking EVA foam tiles, non-toxic, waterproof, 12-piece set.", image_url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80", in_stock: true, x: 55, y: 85, featured: false },
          { name: "Teepee Reading Tent", category: "Decor", brand: "WildNest", price: 6200, description: "Cotton canvas teepee with fairy lights — perfect cozy reading corner.", image_url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&q=80", in_stock: true, x: 80, y: 60, featured: false },
        ],
      },
      {
        name: "Soft Scandi Baby",
        image_url: "https://images.unsplash.com/photo-1666005367800-71f89f6c3057?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwcm9vbSUyMHBhc3RlbCUyMHNjYW5kaW5hdmlhbiUyMG1pbmltYWwlMjBudXJzZXJ5fGVufDF8fHx8MTc3MjcwMTc3OXww&ixlib=rb-4.1.0&q=80&w=1080",
        price: 72000,
        style: "Scandi Nursery",
        is_top_pick: false, is_trending: true, is_under_budget: false,
        products: [
          { name: "Convertible Cot Bed", category: "Beds", brand: "Livspace", price: 28000, description: "Beech wood cot that converts to toddler bed, grows with your child.", image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80", in_stock: true, x: 45, y: 55, featured: true },
          { name: "Pastel Wardrobe", category: "Storage", brand: "NordicKids", price: 22000, description: "3-door soft-close wardrobe in sage green with child-safe handles.", image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80", in_stock: true, x: 75, y: 45, featured: false },
          { name: "Cloud Mobile", category: "Decor", brand: "DreamCraft", price: 2800, description: "Hand-felted wool cloud & star mobile with gentle wind-chime sound.", image_url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80", in_stock: true, x: 50, y: 20, featured: false },
        ],
      },
      {
        name: "Adventure Bunkhouse",
        image_url: "https://images.unsplash.com/photo-1771838230544-aac51a5fcd24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwcm9vbSUyMGJ1bmslMjBiZWQlMjBzdG9yYWdlJTIwcGxheXJvb20lMjBjb3p5fGVufDF8fHx8MTc3MjcwMTc4MHww&ixlib=rb-4.1.0&q=80&w=1080",
        price: 58000,
        style: "Adventure Theme",
        is_top_pick: false, is_trending: false, is_under_budget: true,
        products: [
          { name: "Solid Pine Bunk Bed", category: "Beds", brand: "Woodcraft", price: 24000, description: "L-shaped bunk bed with integrated study desk and storage drawers.", image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80", in_stock: true, x: 50, y: 50, featured: true },
          { name: "Adventure Wall Decals", category: "Wall Decor", brand: "ArtWeave", price: 1800, description: "Peel-and-stick mountain & forest wall decals, repositionable.", image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80", in_stock: true, x: 20, y: 30, featured: false },
          { name: "Storage Ottoman Bench", category: "Storage", brand: "KidsNest", price: 8500, description: "Faux-leather ottomans with hidden toy storage — doubles as seating.", image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", in_stock: true, x: 70, y: 80, featured: false },
        ],
      },
      {
        name: "Study & Sleep",
        image_url: "https://images.unsplash.com/photo-1769690399035-2f4e60edf2ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwYmVkcm9vbSUyMGNvbG9yZnVsJTIwcGxheWZ1bCUyMGludGVyaW9yJTIwZGVzaWdufGVufDF8fHx8MTc3MjcwMTc3OHww&ixlib=rb-4.1.0&q=80&w=1080",
        price: 85000,
        style: "Kids Functional",
        is_top_pick: true, is_trending: true, is_under_budget: false,
        products: [
          { name: "Kids Loft Bed with Desk", category: "Beds", brand: "Livspace", price: 32000, description: "High-sleeper with full-width study desk below and shelving unit.", image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80", in_stock: true, x: 55, y: 55, featured: true },
          { name: "Ergonomic Kids Chair", category: "Seating", brand: "ErgoPro", price: 8200, description: "Height-adjustable mesh chair for 6–14 year olds, lumbar support.", image_url: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=80", in_stock: true, x: 55, y: 80, featured: false },
          { name: "LED Desk Lamp", category: "Lighting", brand: "LumiGlow", price: 3200, description: "USB-powered LED lamp with 5 brightness levels and eye-care mode.", image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", in_stock: true, x: 40, y: 45, featured: false },
          { name: "Wall Pinboard & Shelves", category: "Storage", brand: "KidsNest", price: 5500, description: "Combo cork pinboard + 3 floating shelves for artwork and books.", image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80", in_stock: true, x: 20, y: 30, featured: false },
        ],
      },
    ]);
    return c.json({ success: true, inserted });
  } catch (err: any) {
    console.log("[seed-kids-room] Error:", err.message);
    return c.json({ error: err.message }, 500);
  }
});

/* ──────────────────────────────────────────────
   POST /seed-study-room
────────────────────────────────────────────── */
app.post("/make-server-ef09e2ac/seed-study-room", async (c) => {
  try {
    const inserted = await seedRoom("Study Room", "study-room", [
      {
        name: "Scholar's Retreat",
        image_url: "https://images.unsplash.com/photo-1766330977451-de1b64b5e641?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwc3R1ZHklMjByb29tJTIwbGlicmFyeSUyMHdvb2RlbiUyMGRlc2slMjBtb2Rlcm58ZW58MXx8fHwxNzcyNzAxNzgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
        price: 128000,
        style: "Classic Library",
        is_top_pick: true, is_trending: false, is_under_budget: false,
        products: [
          { name: "Solid Walnut Writing Desk", category: "Desks", brand: "Livspace", price: 42000, description: "180cm solid walnut executive desk with cable management tray.", image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80", in_stock: true, x: 50, y: 65, featured: true },
          { name: "Full-Wall Bookcase", category: "Storage", brand: "Woodcraft", price: 38000, description: "Floor-to-ceiling modular bookcase in oak veneer, 6 adjustable shelves.", image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", in_stock: true, x: 15, y: 45, featured: false },
          { name: "Leather Chesterfield Chair", category: "Seating", brand: "RoyalFurniture", price: 28000, description: "Button-tufted full-grain leather reading chair with ottoman.", image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80", in_stock: true, x: 80, y: 70, featured: false },
          { name: "Brass Banker Lamp", category: "Lighting", brand: "GlowCraft", price: 6800, description: "Adjustable brass desk lamp with green glass shade, vintage appeal.", image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", in_stock: true, x: 55, y: 45, featured: false },
        ],
      },
      {
        name: "Clean Slate",
        image_url: "https://images.unsplash.com/photo-1772475385458-21163e41f4ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwb2ZmaWNlJTIwbWluaW1hbCUyMHdoaXRlJTIwZGVzayUyMHNldHVwJTIwc2hlbHZlc3xlbnwxfHx8fDE3NzI3MDE3ODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
        price: 78000,
        style: "Urban Minimal",
        is_top_pick: false, is_trending: true, is_under_budget: false,
        products: [
          { name: "Floating Desk Setup", category: "Desks", brand: "Livspace", price: 18000, description: "Wall-mounted 160cm floating desk with hidden cable tray, white oak.", image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80", in_stock: true, x: 50, y: 60, featured: true },
          { name: "Ergonomic Mesh Chair", category: "Seating", brand: "ErgoPro", price: 22000, description: "Fully adjustable mesh task chair with lumbar & headrest support.", image_url: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=80", in_stock: true, x: 50, y: 80, featured: false },
          { name: "Dual Monitor Arm", category: "Accessories", brand: "TechHome", price: 8500, description: "VESA-compatible dual-arm monitor stand, full motion, desk-clamp.", image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", in_stock: true, x: 50, y: 40, featured: false },
          { name: "Floating Shelf Trio", category: "Storage", brand: "EcoHome", price: 4800, description: "Set of 3 white oak floating shelves with invisible brackets.", image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80", in_stock: true, x: 20, y: 30, featured: false },
        ],
      },
      {
        name: "Dark Mode Studio",
        image_url: "https://images.unsplash.com/photo-1762553338304-c4bfc4000488?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkeSUyMHJvb20lMjBkYXJrJTIwbW9vZHklMjBpbmR1c3RyaWFsJTIwYm9va3NoZWxmfGVufDF8fHx8MTc3MjcwMTc4Mnww&ixlib=rb-4.1.0&q=80&w=1080",
        price: 112000,
        style: "Industrial Moody",
        is_top_pick: true, is_trending: true, is_under_budget: false,
        products: [
          { name: "Blackened Steel Desk", category: "Desks", brand: "MetalCraft", price: 35000, description: "Industrial blackened steel frame with solid mango wood top, 180cm.", image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80", in_stock: true, x: 50, y: 65, featured: true },
          { name: "Industrial Bookshelf", category: "Storage", brand: "MetalCraft", price: 24000, description: "Pipe-and-reclaimed-wood industrial shelving unit, 6 tiers, 180cm tall.", image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", in_stock: true, x: 15, y: 50, featured: false },
          { name: "Cognac Leather Office Chair", category: "Seating", brand: "RoyalFurniture", price: 32000, description: "Mid-century executive chair in full-grain tan leather with brass feet.", image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80", in_stock: true, x: 55, y: 80, featured: false },
          { name: "Edison Bulb Pendant", category: "Lighting", brand: "GlowCraft", price: 4500, description: "Exposed filament Edison pendant on braided cloth cord, dimmable.", image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80", in_stock: true, x: 50, y: 15, featured: false },
        ],
      },
      {
        name: "Zen Reading Nook",
        image_url: "https://images.unsplash.com/photo-1766330977451-de1b64b5e641?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwcmVhZGluZyUyMG5vb2slMjBqYXBhbmRpJTIwc3R1ZHklMjBjb3JuZXIlMjB3YXJtfGVufDF8fHx8MTc3MjcwMTc4Mnww&ixlib=rb-4.1.0&q=80&w=1080",
        price: 62000,
        style: "Japandi Study",
        is_top_pick: false, is_trending: false, is_under_budget: true,
        products: [
          { name: "Japandi Low Desk", category: "Desks", brand: "EcoHome", price: 18500, description: "Low-profile ash wood desk with clean lines and natural oil finish.", image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80", in_stock: true, x: 50, y: 65, featured: true },
          { name: "Zaisu Floor Chair", category: "Seating", brand: "Livspace", price: 7800, description: "Japanese legless cushion chair in oatmeal linen — meditative comfort.", image_url: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=80", in_stock: true, x: 50, y: 85, featured: false },
          { name: "Bamboo Desk Organiser", category: "Accessories", brand: "EcoHome", price: 2200, description: "Multi-compartment bamboo organiser for pens, cards and cables.", image_url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80", in_stock: true, x: 65, y: 55, featured: false },
          { name: "Washi Paper Pendant", category: "Lighting", brand: "ArtWeave", price: 5500, description: "Hand-folded Japanese washi paper pendant in warm ivory, dimmable.", image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80", in_stock: true, x: 50, y: 20, featured: false },
        ],
      },
    ]);
    return c.json({ success: true, inserted });
  } catch (err: any) {
    console.log("[seed-study-room] Error:", err.message);
    return c.json({ error: err.message }, 500);
  }
});

/* ──────────────────────────────────────────────
   POST /analyze-floorplan
   Accepts JSON { image: "data:image/...;base64,..." }
   Uses Gemini Vision to detect BHK configuration.
   Returns { bhk, bedroom_count, estimated_area_sqft, confidence, reasoning }
────────────────────────────────────────────── */
app.post("/make-server-ef09e2ac/analyze-floorplan", async (c) => {
  try {
    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiKey) throw new Error("GEMINI_API_KEY environment variable is not set");

    const body = await c.req.json();
    const dataUri: string = body.image ?? "";
    if (!dataUri) throw new Error("No image field in JSON body");

    let base64Data: string;
    let mimeType: string;

    if (dataUri.startsWith("data:")) {
      const matches = dataUri.match(/^data:(image\/[^;]+);base64,(.+)$/);
      if (!matches) throw new Error("Invalid base64 data URI");
      mimeType = matches[1];
      base64Data = matches[2];
    } else {
      throw new Error("image must be a base64 data URI (data:image/...;base64,...)");
    }
    console.log(`[analyze-floorplan] received image, mimeType=${mimeType}, base64 length=${base64Data.length}`);

    const prompt = `You are an expert architectural analyst specialising in Indian residential floor plans.
Carefully examine this floor plan image and count the number of bedrooms to determine the flat configuration.

Indian BHK conventions:
- 1 BHK = 1 bedroom + 1 hall + 1 kitchen (typically 400–700 sq ft)
- 2 BHK = 2 bedrooms + 1 hall + 1 kitchen (typically 700–1100 sq ft)
- 3 BHK = 3 bedrooms + 1 hall + 1 kitchen (typically 1100–1600 sq ft)
- 4 BHK = 4 bedrooms + 1 hall + 1 kitchen (typically 1600–2400 sq ft)

Return ONLY a valid JSON object — no markdown, no extra text:
{
  "bhk": "2BHK",
  "bedroom_count": 2,
  "estimated_area_sqft": 950,
  "confidence": "high",
  "reasoning": "Brief 1-2 sentence explanation of how you identified the BHK type from the floor plan."
}

Rules:
- bhk must be exactly one of: "1BHK", "2BHK", "3BHK", "4BHK"
- confidence must be "high", "medium", or "low"
- If the image is not a floor plan, return bhk "2BHK" with confidence "low" and explain in reasoning`;

    const geminiResp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ inlineData: { mimeType, data: base64Data } }, { text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 512 },
        }),
      }
    );

    if (!geminiResp.ok) {
      const errBody = await geminiResp.text();
      throw new Error(`Gemini API error ${geminiResp.status}: ${errBody}`);
    }

    const geminiData = await geminiResp.json();
    const rawText: string = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    console.log(`[analyze-floorplan] Gemini raw: ${rawText.slice(0, 300)}`);

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error(`No JSON in Gemini response: ${rawText.slice(0, 300)}`);
    const result = JSON.parse(jsonMatch[0]);

    const validBhk = ["1BHK", "2BHK", "3BHK", "4BHK"];
    if (!validBhk.includes(result.bhk)) {
      result.bhk = "2BHK";
      result.confidence = "low";
    }

    console.log(`[analyze-floorplan] detected ${result.bhk} with ${result.confidence} confidence`);
    return c.json(result);
  } catch (err: any) {
    console.log("[analyze-floorplan] Error:", err.message);
    return c.json({ error: err.message }, 500);
  }
});

Deno.serve(app.fetch);