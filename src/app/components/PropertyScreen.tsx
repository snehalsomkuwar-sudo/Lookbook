import React, { useState, useRef } from "react";
const projectId = import.meta.env.VITE_SUPABASE_URL?.replace("https://", "").replace(".supabase.co", "") ?? "";
const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

/* ── Local design tokens ── */
const tk = {
  primaryDefault:      "#EB595F",
  primaryVariant:      "#FDEEEF",
  primaryHover:        "#BC474C",
  primaryVariantHover: "#FBDEDF",
  surfaceDefault:      "#FFFFFF",
  surfaceVariant:      "#E6E6E6",
};

/* ── Tiny shared UI pieces ── */
function StatusBar() {
  return <div style={{ height: 44, flexShrink: 0 }} />;
}

function NavBar({ title, onBack, cartCount = 0, onCartClick }: { title: string; onBack: () => void; cartCount?: number; onCartClick?: () => void }) {
  return (
    <div style={{ height: 56, display: "flex", alignItems: "center", padding: "0 20px", gap: 14, flexShrink: 0, background: tk.surfaceDefault, borderBottom: `1px solid ${tk.surfaceVariant}` }}>
      <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--background)", border: "none", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--foreground)", flexShrink: 0 }}>←</button>
      <span style={{ flex: 1, fontFamily: "var(--font-roboto)", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
      {onCartClick && (
        <button onClick={onCartClick} style={{ position: "relative", width: 36, height: 36, borderRadius: "50%", background: "var(--background)", border: "none", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          🛒
          {cartCount > 0 && <span style={{ position: "absolute", top: 4, right: 4, width: 16, height: 16, background: "var(--primary)", color: "var(--primary-foreground)", borderRadius: "50%", fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-roboto)", fontWeight: 700 }}>{cartCount}</span>}
        </button>
      )}
    </div>
  );
}

function ProgressStrip({ pct }: { pct: number }) {
  return (
    <div style={{ height: 3, background: tk.surfaceVariant, flexShrink: 0 }}>
      <div style={{ height: "100%", width: `${pct}%`, background: "var(--primary)", transition: "width 0.4s ease" }} />
    </div>
  );
}

/* ── Data ── */
const allConfigs = [
  { id: "1BHK", label: "1 BHK", detail: "~600 sq ft",  rooms: [{ l:"5%",t:"5%",w:"55%",h:"68%" },{ l:"64%",t:"5%",w:"31%",h:"38%" },{ l:"64%",t:"48%",w:"31%",h:"47%" }] },
  { id: "2BHK", label: "2 BHK", detail: "~900 sq ft",  rooms: [{ l:"5%",t:"5%",w:"48%",h:"48%" },{ l:"58%",t:"5%",w:"37%",h:"43%" },{ l:"5%",t:"58%",w:"35%",h:"37%" },{ l:"44%",t:"58%",w:"51%",h:"37%" }] },
  { id: "3BHK", label: "3 BHK", detail: "~1200 sq ft", rooms: [{ l:"4%",t:"4%",w:"40%",h:"44%" },{ l:"49%",t:"4%",w:"47%",h:"44%" },{ l:"4%",t:"53%",w:"28%",h:"43%" },{ l:"37%",t:"53%",w:"30%",h:"43%" },{ l:"72%",t:"53%",w:"24%",h:"43%" }] },
  { id: "4BHK", label: "4 BHK", detail: "~1600 sq ft", rooms: [{ l:"3%",t:"3%",w:"42%",h:"42%" },{ l:"50%",t:"3%",w:"47%",h:"42%" },{ l:"3%",t:"50%",w:"27%",h:"47%" },{ l:"35%",t:"50%",w:"27%",h:"47%" },{ l:"67%",t:"50%",w:"30%",h:"47%" }] },
];

const suggestions = [
  { icon: "🏙️", name: "Prestige Shantiniketan", meta: "Whitefield, Bengaluru", configs: ["2BHK", "3BHK"] },
  { icon: "🏢", name: "Godrej Air NXT",          meta: "Hoodi, Bengaluru",      configs: ["2BHK", "3BHK", "4BHK"] },
  { icon: "🏠", name: "Sobha Dream Acres",        meta: "Panathur, Bengaluru",  configs: ["1BHK", "2BHK"] },
];
type Society = typeof suggestions[0];

/* ── Props ── */
export interface PropertyScreenProps {
  goTo: (id: string) => void;
  cartCount: number;
  showToast: (m: string) => void;
  setBhkType: (v: string) => void;
  isDesktop?: boolean;
  onBackToWebsite?: () => void;
}

export function PropertyScreen({ goTo, cartCount, showToast, setBhkType, isDesktop, onBackToWebsite }: PropertyScreenProps) {
  const [query,           setQuery]           = useState("");
  const [selectedSociety, setSelectedSociety] = useState<Society | null>(null);
  const [selectedBhk,     setSelectedBhk]     = useState("");
  const [showSugg,        setShowSugg]        = useState(false);

  /* ── Upload state ── */
  type UploadState = "idle" | "reading" | "analyzing" | "done" | "error";
  const [uploadState,   setUploadState]   = useState<UploadState>("idle");
  const [uploadFile,    setUploadFile]    = useState<{ name: string; preview: string } | null>(null);
  const [uploadResult,  setUploadResult]  = useState<{ bhk: string; confidence: string; reasoning: string; estimated_area_sqft?: number } | null>(null);
  const [uploadError,   setUploadError]   = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered       = suggestions.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));
  const visibleConfigs = selectedSociety
    ? allConfigs.filter(c => selectedSociety.configs.includes(c.id))
    : allConfigs;

  const handleSelectSociety = (s: Society) => {
    setSelectedSociety(s);
    setQuery(s.name);
    setShowSugg(false);
    setSelectedBhk(s.configs[0]);
    showToast(`✓ ${s.name} — ${s.configs.length} flat configs loaded`);
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setShowSugg(val.length > 1);
    if (selectedSociety && val !== selectedSociety.name) {
      setSelectedSociety(null);
      // keep selectedBhk — user may have already picked one
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!fileInputRef.current) return;
    fileInputRef.current.value = ""; // reset so same file can be re-picked
    if (!file) return;

    // Only accept image types (PDF support limited in browsers without a PDF renderer)
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      showToast("Please upload a JPG, PNG or WebP floor plan image");
      return;
    }

    setUploadFile({ name: file.name, preview: "" });
    setUploadState("reading");
    setUploadResult(null);
    setUploadError("");

    try {
      // 1. Read as base64 data URI
      const dataUri = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });

      // Store preview
      setUploadFile({ name: file.name, preview: dataUri });
      setUploadState("analyzing");

      // 2. Send to Gemini via server
      const resp = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ef09e2ac/analyze-floorplan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ image: dataUri }),
        }
      );

      const data = await resp.json();
      if (!resp.ok || data.error) {
        throw new Error(data.error ?? `Server error ${resp.status}`);
      }

      // 3. Auto-select the detected BHK
      setUploadResult(data);
      setSelectedBhk(data.bhk);
      setUploadState("done");
      showToast(`✓ Gemini detected ${data.bhk} from your floor plan`);
    } catch (err: any) {
      console.error("[analyze-floorplan] frontend error:", err.message);
      setUploadError(err.message ?? "Analysis failed");
      setUploadState("error");
    }
  };

  const resetUpload = () => {
    setUploadState("idle");
    setUploadFile(null);
    setUploadResult(null);
    setUploadError("");
  };

  const maxW = isDesktop ? 580 : "none" as const;
  const padX = isDesktop ? "0" : "0 24px";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--background)", overflow: "hidden" }}>
      {!isDesktop && <StatusBar />}
      <NavBar
        title="Find Your Home"
        onBack={() => onBackToWebsite ? onBackToWebsite() : goTo("splash")}
        cartCount={cartCount}
        onCartClick={() => goTo("cart")}
      />
      <ProgressStrip pct={25} />

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: maxW, margin: "0 auto", padding: isDesktop ? "40px 0 32px" : "20px 0 32px", width: "100%" }}>

          {/* ─── Page heading ─── */}
          <div style={{ padding: padX, marginBottom: 28 }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: isDesktop ? 32 : 26, fontWeight: 600, color: "var(--foreground)", lineHeight: 1.25 }}>
              Where is your<br />home located?
            </div>
            <div style={{ fontSize: "var(--text-sm)", fontFamily: "var(--font-roboto)", color: "var(--muted-foreground)", marginTop: 8, lineHeight: 1.6 }}>
              Search your project to auto-load configs, or pick your flat size directly.
            </div>
          </div>

          {/* ─── Section A: Find project ─── */}
          <div style={{ padding: padX, marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontFamily: "var(--font-roboto)", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: selectedSociety ? "var(--primary)" : "var(--foreground)", marginBottom: 12 }}>
              Find your project or society
            </div>

            {/* Search input */}
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, pointerEvents: "none" }}>🔍</span>
              <input
                value={query}
                onChange={e => handleQueryChange(e.target.value)}
                onFocus={() => { if (query.length > 1) setShowSugg(true); }}
                placeholder="Search project or society…"
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "var(--card)",
                  border: selectedSociety ? "1.5px solid var(--primary)" : "1.5px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "13px 40px 13px 42px",
                  fontSize: "var(--text-sm)", fontFamily: "var(--font-roboto)",
                  color: "var(--foreground)", outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
              {(query.length > 0) && (
                <button
                  onClick={() => { setQuery(""); setSelectedSociety(null); setShowSugg(false); }}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--muted-foreground)", lineHeight: 1, padding: 0 }}
                >×</button>
              )}
            </div>

            {/* Dropdown */}
            {showSugg && filtered.length > 0 && (
              <div style={{ background: "var(--card)", borderRadius: "var(--radius)", overflow: "hidden", boxShadow: "0 8px 28px rgba(0,0,0,0.13)", border: "1px solid var(--border)", marginTop: 6, position: "relative", zIndex: 10 }}>
                {filtered.map((s, i) => (
                  <div
                    key={s.name}
                    onClick={() => handleSelectSociety(s)}
                    style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", borderBottom: i < filtered.length - 1 ? "1px solid var(--background)" : "none" }}
                  >
                    <div style={{ width: 38, height: 38, background: tk.primaryVariant, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, fontFamily: "var(--font-roboto)", color: "var(--foreground)" }}>{s.name}</div>
                      <div style={{ fontSize: 12, fontFamily: "var(--font-roboto)", color: "var(--muted-foreground)", marginTop: 1 }}>{s.meta}</div>
                    </div>
                    <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                      {s.configs.map(c => (
                        <span key={c} style={{ fontSize: 10, fontFamily: "var(--font-roboto)", background: "var(--background)", color: "var(--muted-foreground)", borderRadius: 4, padding: "2px 7px", border: "1px solid var(--border)", whiteSpace: "nowrap" }}>{c}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Society confirmed pill */}
            {selectedSociety && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, padding: "10px 14px", background: "var(--card)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{selectedSociety.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, fontFamily: "var(--font-roboto)", color: "var(--foreground)" }}>{selectedSociety.name}</div>
                  <div style={{ fontSize: 11, fontFamily: "var(--font-roboto)", color: "var(--muted-foreground)", marginTop: 1 }}>
                    {selectedSociety.meta} · {selectedSociety.configs.join(", ")} available
                  </div>
                </div>
                <span style={{ fontSize: 10, fontFamily: "var(--font-roboto)", color: "var(--primary)", fontWeight: 700, background: tk.primaryVariant, borderRadius: 6, padding: "3px 9px", whiteSpace: "nowrap" }}>
                  {selectedSociety.configs.length} loaded ✓
                </span>
              </div>
            )}

            {/* Upload alternative */}
            <div style={{ fontSize: 11, fontFamily: "var(--font-roboto)", color: "var(--muted-foreground)", textAlign: "center", margin: "14px 0 10px" }}>— or —</div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            {/* Upload zone — state-aware */}
            {uploadState === "idle" && (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{ background: "var(--card)", border: "1.5px dashed var(--border)", borderRadius: "var(--radius)", padding: "13px 16px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}
              >
                <div style={{ width: 38, height: 38, background: "var(--background)", borderRadius: "var(--radius)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📐</div>
                <div>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, fontFamily: "var(--font-roboto)", color: "var(--foreground)" }}>Upload your floor plan</div>
                  <div style={{ fontSize: 11, fontFamily: "var(--font-roboto)", color: "var(--muted-foreground)", marginTop: 2 }}>JPG or PNG · Gemini reads it instantly</div>
                </div>
              </div>
            )}

            {(uploadState === "reading" || uploadState === "analyzing") && (
              <div style={{ background: "var(--card)", border: `1.5px solid var(--primary)`, borderRadius: "var(--radius)", padding: "13px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                {/* Thumbnail */}
                {uploadFile?.preview ? (
                  <img src={uploadFile.preview} alt="floor plan" style={{ width: 38, height: 38, objectFit: "cover", borderRadius: 6, flexShrink: 0, border: "1px solid var(--border)" }} />
                ) : (
                  <div style={{ width: 38, height: 38, background: "var(--background)", borderRadius: "var(--radius)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📐</div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, fontFamily: "var(--font-roboto)", color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {uploadFile?.name ?? "Uploading…"}
                  </div>
                  <div style={{ fontSize: 11, fontFamily: "var(--font-roboto)", color: "var(--primary)", marginTop: 3, display: "flex", alignItems: "center", gap: 6 }}>
                    <SpinnerIcon />
                    {uploadState === "reading" ? "Reading file…" : "Gemini is analysing your floor plan…"}
                  </div>
                  {/* Indeterminate progress bar */}
                  <div style={{ marginTop: 6, height: 3, background: "var(--border)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: "60%", background: "var(--primary)", borderRadius: 2, animation: "fp-slide 1.4s ease-in-out infinite" }} />
                  </div>
                  <style>{`@keyframes fp-slide { 0%{transform:translateX(-100%)} 100%{transform:translateX(280%)} }`}</style>
                </div>
              </div>
            )}

            {uploadState === "done" && uploadResult && (
              <div style={{ background: "var(--card)", border: `1.5px solid var(--primary)`, borderRadius: "var(--radius)", padding: "13px 16px", display: "flex", alignItems: "flex-start", gap: 14 }}>
                {uploadFile?.preview && (
                  <img src={uploadFile.preview} alt="floor plan" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, flexShrink: 0, border: "1px solid var(--border)" }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, fontFamily: "var(--font-roboto)", color: "var(--primary)" }}>{uploadResult.bhk} detected</span>
                    <span style={{ fontSize: 10, fontFamily: "var(--font-roboto)", fontWeight: 600, background: uploadResult.confidence === "high" ? "#D1FAE5" : uploadResult.confidence === "medium" ? "#FEF3C7" : "#FEE2E2", color: uploadResult.confidence === "high" ? "#065F46" : uploadResult.confidence === "medium" ? "#92400E" : "#991B1B", borderRadius: 4, padding: "2px 7px" }}>{uploadResult.confidence} confidence</span>
                  </div>
                  {uploadResult.estimated_area_sqft && (
                    <div style={{ fontSize: 11, fontFamily: "var(--font-roboto)", color: "var(--muted-foreground)", marginBottom: 3 }}>~{uploadResult.estimated_area_sqft} sq ft</div>
                  )}
                  <div style={{ fontSize: 11, fontFamily: "var(--font-roboto)", color: "var(--muted-foreground)", lineHeight: 1.5 }}>{uploadResult.reasoning}</div>
                  <button
                    onClick={resetUpload}
                    style={{ marginTop: 8, fontSize: 11, fontFamily: "var(--font-roboto)", color: "var(--primary)", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}
                  >Upload a different plan</button>
                </div>
              </div>
            )}

            {uploadState === "error" && (
              <div style={{ background: "var(--card)", border: "1.5px solid #FECACA", borderRadius: "var(--radius)", padding: "13px 16px", display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ width: 38, height: 38, background: "#FEF2F2", borderRadius: "var(--radius)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>⚠️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, fontFamily: "var(--font-roboto)", color: "#DC2626", marginBottom: 3 }}>Analysis failed</div>
                  <div style={{ fontSize: 11, fontFamily: "var(--font-roboto)", color: "var(--muted-foreground)", lineHeight: 1.5 }}>{uploadError}</div>
                  <button
                    onClick={() => { resetUpload(); fileInputRef.current?.click(); }}
                    style={{ marginTop: 8, fontSize: 11, fontFamily: "var(--font-roboto)", color: "var(--primary)", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}
                  >Try again</button>
                </div>
              </div>
            )}
          </div>

          {/* ─── Divider ─── */}
          <div style={{ height: 1, background: "var(--border)", margin: isDesktop ? "24px 0" : "24px 24px" }} />

          {/* ─── Section B: Choose flat configuration ─── */}
          <div style={{ padding: padX }}>
            <div style={{ fontSize: 11, fontFamily: "var(--font-roboto)", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: selectedBhk ? "var(--primary)" : "var(--foreground)", marginBottom: 4 }}>
              Choose your flat configuration
            </div>
            <div style={{ fontSize: 12, fontFamily: "var(--font-roboto)", color: "var(--muted-foreground)", marginBottom: 16 }}>
              {selectedSociety
                ? `Showing ${visibleConfigs.length} configs available at ${selectedSociety.name}`
                : "All configurations — or select a project above to filter"}
            </div>

            {/* Config cards */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              {visibleConfigs.map(cfg => {
                const sel = selectedBhk === cfg.id;
                return (
                  <div
                    key={cfg.id}
                    onClick={() => setSelectedBhk(cfg.id)}
                    style={{
                      background:   sel ? tk.primaryVariant : "var(--card)",
                      border:       `1.5px solid ${sel ? tk.primaryDefault : "var(--border)"}`,
                      borderRadius: "var(--radius)",
                      padding:      "14px 12px",
                      cursor:       "pointer",
                      position:     "relative",
                      transition:   "all 0.18s",
                      width:        120,
                      flexShrink:   0,
                    }}
                  >
                    {/* Mini floor-plan diagram */}
                    <div style={{ width: "100%", height: 60, position: "relative", marginBottom: 10 }}>
                      {cfg.rooms.map((r, ri) => (
                        <div key={ri} style={{ position: "absolute", left: r.l, top: r.t, width: r.w, height: r.h, background: sel ? tk.primaryVariantHover : "var(--background)", border: `1.5px solid ${sel ? tk.primaryHover : "var(--border)"}`, borderRadius: 2 }} />
                      ))}
                    </div>
                    <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, fontFamily: "var(--font-roboto)", color: "var(--foreground)" }}>{cfg.label}</div>
                    <div style={{ fontSize: 11, fontFamily: "var(--font-roboto)", color: "var(--muted-foreground)", marginTop: 2 }}>{cfg.detail}</div>
                    {sel && (
                      <div style={{ position: "absolute", top: 8, right: 8, width: 20, height: 20, borderRadius: "50%", background: tk.primaryDefault, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>✓</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ── Sticky footer CTA — always enabled once a BHK is picked ── */}
      <div style={{ padding: "14px 24px", background: "var(--card)", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
        <div style={{ maxWidth: isDesktop ? 580 : "none", margin: "0 auto" }}>
        <button
          onClick={() => {
            if (selectedBhk) {
              setBhkType(selectedBhk);
              goTo("quiz");
            } else {
              showToast("Pick a flat configuration to continue");
            }
          }}
          style={{
            width:        "100%",
            background:   selectedBhk ? "var(--primary)" : "var(--muted)",
            color:        selectedBhk ? "var(--primary-foreground)" : "var(--muted-foreground)",
            border:       "none",
            borderRadius: "var(--radius)",
            padding:      "15px 24px",
            fontSize:     "var(--text-sm)",
            fontWeight:   600,
            fontFamily:   "var(--font-roboto)",
            cursor:       selectedBhk ? "pointer" : "default",
            transition:   "background 0.2s, color 0.2s",
          }}
        >
          Continue to Vibe Match →
        </button>
        </div>
      </div>
    </div>
  );
}

/* ── Spinner icon ── */
function SpinnerIcon() {
  return (
    <>
      <style>{`@keyframes fp-spin { to { transform: rotate(360deg); } }`}</style>
      <svg
        width="14" height="14" viewBox="0 0 14 14" fill="none"
        style={{ animation: "fp-spin 0.85s linear infinite", flexShrink: 0 }}
      >
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </>
  );
}