import { useState } from "react";

interface Props {
  onOpenLookBook: (room?: string) => void;
  onElevate?: (room?: string) => void;
  isDesktop?: boolean;
}

const T = {
  primary:    "#EB595F",
  primaryFg:  "#FFFFFF",
  fg:         "#1A1A1A",
  mutedFg:    "#888888",
  border:     "#EBEBEB",
  card:       "#FFFFFF",
  bg:         "#F7F5F2",
  font:       "var(--font-gilroy, 'Gill Sans', sans-serif)",
};

type Tab = "Interiors" | "Products" | "LookBook" | "Elevate";

/* ─── Section header ─── */
function SectionHead({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: T.fg, fontFamily: T.font, margin: 0 }}>{title}</h2>
      {action && (
        <span onClick={onAction} style={{ fontSize: 12, color: T.primary, fontFamily: T.font, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
          {action}
        </span>
      )}
    </div>
  );
}

/* ─── Horizontal scroll wrapper ─── */
function HScroll({ children, gap = 12 }: { children: React.ReactNode; gap?: number }) {
  return (
    <div style={{ display: "flex", gap, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4 } as React.CSSProperties}>
      {children}
    </div>
  );
}

export function LivespaceWebsite({ onOpenLookBook, onElevate, isDesktop }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("Interiors");

  const tabs: { id: Tab; icon: string }[] = [
    { id: "Interiors", icon: "🏠" },
    { id: "LookBook",  icon: "📖" },
    { id: "Elevate",   icon: "✨" },
    { id: "Products",  icon: "🛋️" },
  ];

  const interiorSolutions = [
    { label: "Full Home\nInteriors",   img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80", sub: "Turnkey interior solutions for your home" },
    { label: "Modular\nInteriors",     img: "https://images.unsplash.com/photo-1556909195-0cc489df19a0?w=400&q=80", sub: "Customised kitchens, wardrobes and storage" },
    { label: "Luxury\nInteriors",      img: "https://images.unsplash.com/photo-1616137466211-f939a420be84?w=400&q=80", sub: "Tailored interiors that redefine elegance" },
    { label: "Renovation",             img: "https://images.unsplash.com/photo-1631048499455-4f9e26f23b9f?w=400&q=80", sub: "Expert renovations to upgrade your home" },
  ];

  const furnishings = [
    { name: "Bloomshire Classic | Everyday Elegance Cotton Bedsheet...", price: "₹848.00", originalPrice: "₹2,647", rating: 4.4, reviews: 7839, img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&q=80" },
    { name: "Bloomshire Classic | Everyday Elegance Printed Cotton Bedsheet...", price: "₹946.00", originalPrice: "₹3,457", rating: 4.4, reviews: 7839, img: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=300&q=80" },
    { name: "Bloomshire Luxe | Romantic Floral Printed Cotton Bedsheet Set (Pile...", price: "₹1,260.00", originalPrice: "₹4,749", rating: 4.4, reviews: 7839, img: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=300&q=80" },
    { name: "Bloomshire Luxe | Romantic Floral Printed Cotton Bedsheet Set (Pile...", price: "₹1,260.00", originalPrice: "₹4,749", rating: 4.4, reviews: 7839, img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&q=80" },
  ];

  const designIdeas = [
    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=300&q=80",
    "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=300&q=80",
    "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=300&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&q=80",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=300&q=80",
  ];

  const inspireImages = [
    { img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80", span: "col" },
    { img: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&q=80", span: "col" },
    { img: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&q=80", span: "col" },
    { img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80", span: "col" },
    { img: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80", span: "col" },
    { img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80", span: "col" },
  ];

  const stores = [
    { name: "Marathahalli, Bengaluru",  img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&q=80", status: "Open" },
    { name: "HSR Layout, Bengaluru",    img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=300&q=80", status: "Open" },
    { name: "Sarjapur Road, Bengaluru", img: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=300&q=80", status: "Open" },
    { name: "Bela by Livspace, Sarjapur Road", img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=300&q=80", status: "Open" },
  ];

  const articles = [
    { title: "PVC Kitchen Cabinets 2025: Moisture-Resistant, Termite-Proof & Long-Lasting", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80", tag: "Kitchen" },
    { title: "Tall Kitchen Designs 2025: 19+ Smart Ways to Double Your Storage Without Losing Space", img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300&q=80", tag: "Kitchen" },
    { title: "99+ Stunning Almirah Design Ideas to Elevate Your Storage Game in 2025", img: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=300&q=80", tag: "Wardrobe" },
    { title: "What&#8203;&#8203;&#8203;&#8203;&#8203; is The Interior Design Cost in Kolkata for 1BHK, 2BHK and 3BHK Homes in 2025?", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&q=80", tag: "Design" },
  ];

  const trophies = [
    { label: "India's Most\nTrusted Brand",           sub: "India's Most" },
    { label: "Best Interior\nDesign Solutions Brand",  sub: "Dazeinfo" },
    { label: "Innovative\nStart-up",                   sub: "Outlook" },
    { label: "World's Most\nInnovative Company",       sub: "Fast Company" },
  ];

  const reviews = [
    { name: "Aishwarya & Rajesh",  text: "Livspace frequently comments on our timely delivery and the attentive nature of our service which clearly reflects their overall satisfaction...", rating: 5 },
    { name: "Riya & John",         text: "Based on positive customer experiences across our operations, this review highlights the quality of service our team provides...", rating: 5 },
    { name: "Anita & Suresh",      text: "Another positive customer experience at our store, reflecting the quality of service our team regularly provides...", rating: 5 },
    { name: "Preethi & Prasad",    text: "Livspace frequently comments on the work quality and design expertise of our team that makes the overall experience seamless...", rating: 5 },
  ];

  const INTERIORS_TILES = [
    { label: "Full Home\nInteriors", img: "https://images.unsplash.com/photo-1639663742190-1b3dba2eebcf?w=400&q=80" },
    { label: "Modular\nKitchens",    img: "https://images.unsplash.com/photo-1544614940-686234a602e9?w=400&q=80" },
    { label: "Modular\nWardrobes",   img: "https://images.unsplash.com/photo-1649361811423-a55616f7ab11?w=400&q=80" },
    { label: "Luxury\nInteriors",    img: "https://images.unsplash.com/photo-1772567732959-fcae5d9f39da?w=400&q=80" },
    { label: "Renovation",           img: "https://images.unsplash.com/photo-1631048499455-4f9e26f23b9f?w=400&q=80" },
    { label: "Modular\nStorage",     img: "https://images.unsplash.com/photo-1764813128286-7062913e1dc1?w=400&q=80" },
    { label: "Kids\nRoom",           img: "https://images.unsplash.com/photo-1615800098779-1be32e60cca3?w=400&q=80" },
    { label: "Explore\nAll",         isExploreAll: true },
  ];

  const PRODUCTS_TILES = [
    { label: "Sofas",          img: "https://images.unsplash.com/photo-1762803841262-99261e8ff08a?w=400&q=80" },
    { label: "Beds",           img: "https://images.unsplash.com/photo-1556597258-dca9fea9489d?w=400&q=80" },
    { label: "Dining\nTables", img: "https://images.unsplash.com/photo-1656403002413-2ac6137237d6?w=400&q=80" },
    { label: "Wardrobes",      img: "https://images.unsplash.com/photo-1649361811423-a55616f7ab11?w=400&q=80" },
    { label: "TV Units",       img: "https://images.unsplash.com/photo-1639663742190-1b3dba2eebcf?w=400&q=80" },
    { label: "Chairs",         img: "https://images.unsplash.com/photo-1593136596203-7212b076f4d2?w=400&q=80" },
    { label: "Lighting",       img: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=400&q=80" },
    { label: "Explore\nAll",   isExploreAll: true },
  ];

  const LOOKBOOK_TILES = [
    { label: "Living\nRoom",  img: "https://images.unsplash.com/photo-1674230227190-05b589f2f730?w=400&q=80" },
    { label: "Bedroom",       img: "https://images.unsplash.com/photo-1773101883552-1ea68c7b471b?w=400&q=80" },
    { label: "Kitchen",       img: "https://images.unsplash.com/photo-1643034738686-d69e7bc047e1?w=400&q=80" },
    { label: "Bathroom",      img: "https://images.unsplash.com/photo-1771239048293-72abf673adb2?w=400&q=80" },
    { label: "Dining\nRoom",  img: "https://images.unsplash.com/photo-1593136596203-7212b076f4d2?w=400&q=80" },
    { label: "Home\nOffice",  img: "https://images.unsplash.com/photo-1614250836482-b596f7494f2f?w=400&q=80" },
    { label: "Kids\nRoom",    img: "https://images.unsplash.com/photo-1769690399035-2f4e60edf2ea?w=400&q=80" },
    { label: "Browse\nAll",   isExploreAll: true },
  ];

  const ELEVATE_TILES = [
    { label: "Living\nRoom",  img: "https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?w=400&q=80" },
    { label: "Bedroom",       img: "https://images.unsplash.com/photo-1616418928117-4e6d19be2df1?w=400&q=80" },
    { label: "Kitchen",       img: "https://images.unsplash.com/photo-1668026694348-b73c5eb5e299?w=400&q=80" },
    { label: "Dining\nRoom",  img: "https://images.unsplash.com/photo-1656403002413-2ac6137237d6?w=400&q=80" },
    { label: "Home\nOffice",  img: "https://images.unsplash.com/photo-1751200065697-4461cc2b43cb?w=400&q=80" },
    { label: "Kids\nRoom",    img: "https://images.unsplash.com/photo-1572025442367-756c1e7887a1?w=400&q=80" },
    { label: "Bathroom",      img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80" },
    { label: "Explore\nAll",  isExploreAll: true },
  ];

  const TileGrid = ({ tiles, onExploreClick, onTileClick }: { tiles: typeof INTERIORS_TILES; onExploreClick?: () => void; onTileClick?: (l: string) => void }) => (
    isDesktop ? (
      <div className="ls-scroll-hide" style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 6 }}>
        {tiles.map((tile, i) => tile.isExploreAll ? (
          <div key={i} onClick={onExploreClick} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", flexShrink: 0, width: 140 }}>
            <div style={{ width: 140, height: 140, borderRadius: 14, background: "#FDEAEA", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", border: `1.5px solid ${T.primary}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
              </div>
            </div>
            <div style={{ textAlign: "center", fontSize: 11, color: T.primary, fontFamily: T.font, fontWeight: 600, marginTop: 7, lineHeight: 1.35, whiteSpace: "pre-line" }}>{tile.label}</div>
          </div>
        ) : (
          <div key={i} onClick={() => onTileClick?.(tile.label)} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", flexShrink: 0, width: 140 }}>
            <div style={{ width: 140, height: 140, borderRadius: 14, overflow: "hidden", background: "#E8E0D8" }}>
              {tile.img && <img src={tile.img} alt={tile.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
            </div>
            <div style={{ textAlign: "center", fontSize: 11, color: T.fg, fontFamily: T.font, marginTop: 7, lineHeight: 1.35, whiteSpace: "pre-line", width: 140 }}>{tile.label}</div>
          </div>
        ))}
      </div>
    ) : (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px 10px" }}>
        {tiles.map((tile, i) => tile.isExploreAll ? (
          <div key={i} onClick={onExploreClick} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}>
            <div style={{ width: "100%", aspectRatio: "1", borderRadius: 14, background: "#FDEAEA", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", border: `1.5px solid ${T.primary}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
              </div>
            </div>
            <div style={{ textAlign: "center", fontSize: 11, color: T.primary, fontFamily: T.font, fontWeight: 600, marginTop: 7, lineHeight: 1.35, whiteSpace: "pre-line" }}>{tile.label}</div>
          </div>
        ) : (
          <div key={i} onClick={() => onTileClick?.(tile.label)} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}>
            <div style={{ width: "100%", aspectRatio: "1", borderRadius: 14, overflow: "hidden", background: "#E8E0D8" }}>
              {tile.img && <img src={tile.img} alt={tile.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
            </div>
            <div style={{ textAlign: "center", fontSize: 11, color: T.fg, fontFamily: T.font, marginTop: 7, lineHeight: 1.35, whiteSpace: "pre-line", width: "100%" }}>{tile.label}</div>
          </div>
        ))}
      </div>
    )
  );

  const GradientCTA = ({ label, onClick, icon }: { label: string; onClick?: () => void; icon: React.ReactNode }) => (
    <button onClick={onClick} style={{ width: isDesktop ? "auto" : "100%", maxWidth: isDesktop ? 420 : undefined, display: "flex", alignItems: "center", justifyContent: "space-between", background: `linear-gradient(to right, #5E455A 0%, ${T.primary} 100%)`, border: "none", borderRadius: 18, padding: "4px 20px 4px 4px", cursor: "pointer", margin: isDesktop ? "20px auto 0" : undefined, marginTop: isDesktop ? undefined : 20, minHeight: 56 }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
      <span style={{ flex: 1, textAlign: "left", paddingLeft: 14, fontSize: 15, fontWeight: 600, color: "white", fontFamily: T.font }}>{label}</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
    </button>
  );

  return (
    <div style={{ fontFamily: T.font, background: T.bg, minHeight: "100dvh", overflowX: "hidden", paddingBottom: 80 }}>
      <style>{`
        .ls-scroll-hide { scrollbar-width: none; }
        .ls-scroll-hide::-webkit-scrollbar { display: none; }
        @media (max-width: 768px)  { .ls-desktop-only { display: none !important; } }
        @media (min-width: 769px)  { .ls-mobile-only  { display: none !important; } }
        .ls-bnav-item { display:flex; flex-direction:column; align-items:center; gap:3px; font-size:10px; font-weight:500; cursor:pointer; color:${T.mutedFg}; font-family:${T.font}; padding:4px 6px; transition:color 0.15s; }
        .ls-bnav-item-active { color:${T.primary}; }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{ background: T.card, borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, zIndex: 100 }}>
        {/* Desktop */}
        <div className="ls-desktop-only" style={{ maxWidth: 1280, margin: "0 auto", height: 64, display: "flex", alignItems: "center", gap: 32, padding: "0 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${T.primary}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: T.primary, opacity: 0.7 }} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "0.06em", color: T.fg }}>LIVSPACE</span>
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: 24, flex: 1 }}>
            {(["Interiors","Products","Elevate"] as const).map(id => (
              <span key={id} style={{ fontSize: 14, color: T.mutedFg, cursor: "pointer", fontFamily: T.font }}>{id}</span>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F5F5F5", borderRadius: 9999, padding: "8px 14px", width: 180, flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.mutedFg} strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <span style={{ fontSize: 12, color: T.mutedFg }}>Search for "Livspace"</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", flexShrink: 0 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.fg} strokeWidth="2"><path d="M20 10c0 6-8 13-8 13s-8-7-8-13a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <span style={{ fontSize: 12, fontWeight: 600, color: T.fg }}>Bengaluru</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={T.fg} strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.fg} strokeWidth="1.8" style={{ cursor:"pointer" }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.fg} strokeWidth="1.8" style={{ cursor:"pointer" }}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.fg} strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
          </div>
        </div>
        {/* Mobile */}
        <div className="ls-mobile-only" style={{ padding: "10px 16px 10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", border: `2px solid ${T.primary}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: T.primary, opacity: 0.7 }} />
              </div>
              <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.06em", color: T.fg }}>LIVSPACE</span>
            </div>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.fg} strokeWidth="1.8" style={{ cursor:"pointer" }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.fg} strokeWidth="1.8" style={{ cursor:"pointer" }}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.fg} strokeWidth="1.8" style={{ cursor:"pointer" }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F5F5F5", borderRadius: 9999, padding: "9px 14px" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.mutedFg} strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <span style={{ fontSize: 13, color: T.mutedFg }}>Search for "Livspace"</span>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <section style={{ margin: "0 16px 0", borderRadius: 16, overflow: "hidden", position: "relative", height: 190, background: "#C9A98A" }}>
        <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80" alt="hero" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(220,70,60,0.88) 0%, rgba(220,70,60,0.55) 50%, transparent 80%)" }} />
        {/* Left ribbon */}
        <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 8, background: T.primary }} />
        <div style={{ position: "absolute", top: "50%", left: 22, transform: "translateY(-50%)" }}>
          <div style={{ fontSize: 22, color: "white", fontFamily: T.font, fontWeight: 800, lineHeight: 1.25 }}>
            Your home<br />for all things<br />home.
          </div>
        </div>
      </section>

      {/* ── EXPLORE ALL THINGS HOME (Tabs) ── */}
      <section style={{ padding: "24px 16px 0" }}>
        <h2 style={{ textAlign: "center", fontSize: 20, fontWeight: 700, color: T.fg, fontFamily: T.font, marginBottom: 16 }}>Explore all things home</h2>

        {/* Tab pills */}
        <div className="ls-scroll-hide" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {tabs.map(({ id, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9999, border: `1.5px solid ${activeTab === id ? T.primary : T.border}`, background: activeTab === id ? "#FFF5F5" : T.card, cursor: "pointer", fontFamily: T.font, fontSize: 13, fontWeight: activeTab === id ? 600 : 500, color: activeTab === id ? T.primary : T.fg, whiteSpace: "nowrap", flexShrink: 0 }}
            >
              <span style={{ fontSize: 15 }}>{icon}</span>{id}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ marginTop: 16, paddingBottom: 20 }}>
          {activeTab === "Interiors" && (
            <>
              <TileGrid tiles={INTERIORS_TILES} />
              <GradientCTA label="Get an estimate for your interiors" onClick={() => onOpenLookBook("design")} icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h8M8 14h5"/></svg>} />
            </>
          )}
          {activeTab === "Products" && (
            <TileGrid tiles={PRODUCTS_TILES} />
          )}
          {activeTab === "LookBook" && (
            <>
              <TileGrid tiles={LOOKBOOK_TILES} onExploreClick={onOpenLookBook} onTileClick={label => onOpenLookBook(label)} />
              <GradientCTA label="Design my looks" onClick={() => onOpenLookBook("design")} icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>} />
            </>
          )}
          {activeTab === "Elevate" && (
            <>
              <TileGrid tiles={ELEVATE_TILES} onExploreClick={() => onElevate?.()} onTileClick={label => onElevate?.(label)} />
              <GradientCTA label="Browse all wall designs" onClick={() => onElevate?.()} icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>} />
            </>
          )}
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section style={{ padding: "4px 16px 24px", background: T.card, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <SectionHead title="Why choose us" />
        <HScroll gap={20}>
          {[
            { num: "1,40,000+", sub: "happy customers" },
            { num: "2,35,000+", sub: "curated products" },
            { num: "200+",      sub: "design experts" },
            { num: "11 years",  sub: "of shaping homes" },
            { num: "4.8",       sub: "Ratings · 224K Reviews", star: true },
          ].map((w, i) => (
            <div key={i} style={{ flexShrink: 0, textAlign: "center", minWidth: 80 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: T.fg, fontFamily: T.font }}>{w.star ? "⭐ " : ""}{w.num}</div>
              <div style={{ fontSize: 10, color: T.mutedFg, marginTop: 2, lineHeight: 1.35 }}>{w.sub}</div>
            </div>
          ))}
        </HScroll>
      </section>

      {/* ── CHOOSE YOUR INTERIOR SOLUTION ── */}
      <section style={{ padding: "20px 16px" }}>
        <SectionHead title="Choose your interior solution" action="Explore Now ›" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {interiorSolutions.map((s, i) => (
            <div key={i} style={{ borderRadius: 12, overflow: "hidden", background: T.card, border: `1px solid ${T.border}`, cursor: "pointer" }}>
              <div style={{ height: 110, overflow: "hidden", background: "#E8E0D8" }}>
                <img src={s.img} alt={s.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ padding: "9px 10px 11px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.fg, fontFamily: T.font, whiteSpace: "pre-line", lineHeight: 1.3, marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: T.mutedFg, lineHeight: 1.4 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BESTSELLING FURNISHINGS ── */}
      <section style={{ padding: "4px 16px 20px", background: T.card, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <SectionHead title="Bestselling furnishings" action="View all ›" />
        <HScroll gap={12}>
          {furnishings.map((p, i) => (
            <div key={i} style={{ flexShrink: 0, width: 160, background: T.card, borderRadius: 12, overflow: "hidden", border: `1px solid ${T.border}` }}>
              <div style={{ height: 160, overflow: "hidden", background: "#EEE", position: "relative" }}>
                <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <button style={{ position: "absolute", top: 7, right: 7, width: 26, height: 26, borderRadius: "50%", background: "rgba(255,255,255,0.85)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🤍</button>
                <div style={{ position: "absolute", bottom: 6, left: 6, background: "rgba(0,0,0,0.55)", borderRadius: 6, padding: "2px 6px", fontSize: 9, color: "white" }}>Add</div>
              </div>
              <div style={{ padding: "8px 9px 10px" }}>
                <div style={{ fontSize: 10, color: T.fg, lineHeight: 1.35, marginBottom: 4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>{p.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 3 }}>
                  <span style={{ fontSize: 10, color: "#F59E0B" }}>★</span>
                  <span style={{ fontSize: 10, color: T.fg, fontWeight: 600 }}>{p.rating}</span>
                  <span style={{ fontSize: 9, color: T.mutedFg }}>({p.reviews.toLocaleString()})</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.fg }}>{p.price}</div>
                <div style={{ fontSize: 10, color: T.mutedFg, textDecoration: "line-through" }}>{p.originalPrice}</div>
              </div>
            </div>
          ))}
        </HScroll>
      </section>

      {/* ── DAILY SCROLL OF DESIGN IDEAS ── */}
      <section style={{ padding: "20px 16px" }}>
        <SectionHead title="Your daily scroll of design ideas" action="Watch More ›" />
        <HScroll gap={10}>
          {designIdeas.map((src, i) => (
            <div key={i} style={{ flexShrink: 0, width: 130, height: 180, borderRadius: 12, overflow: "hidden", background: "#DDD", position: "relative" }}>
              <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              {i === 3 && (
                <div style={{ position: "absolute", bottom: 8, left: 8, right: 8, fontSize: 10, color: "white", fontWeight: 600, textShadow: "0 1px 3px rgba(0,0,0,0.7)", lineHeight: 1.3 }}>
                  Can this give the core of the natural look?
                </div>
              )}
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </div>
              {i === 4 && (
                <div style={{ position: "absolute", top: "50%", right: -10, transform: "translateY(-50%)", width: 24, height: 24, borderRadius: "50%", background: T.card, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.fg} strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              )}
            </div>
          ))}
        </HScroll>
      </section>

      {/* ── DESIGNED TO INSPIRE ── */}
      <section style={{ padding: "4px 16px 20px", background: T.card, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <SectionHead title="Designed to inspire" action="Explore More ›" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {inspireImages.map((img, i) => (
            <div key={i} style={{ borderRadius: 10, overflow: "hidden", background: "#DDD", aspectRatio: i === 0 || i === 3 ? "3/4" : "4/3" }}>
              <img src={img.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── COME SAY HELLO ── */}
      <section style={{ padding: "20px 16px" }}>
        <SectionHead title="Come say hello, in store" action="Find Stores Near You ›" />
        {/* Sub-tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {["All","Design","Kids"].map((t, i) => (
            <button key={t} style={{ padding: "5px 14px", borderRadius: 9999, border: `1.5px solid ${i === 0 ? T.primary : T.border}`, background: i === 0 ? "#FFF5F5" : T.card, fontSize: 12, color: i === 0 ? T.primary : T.fg, fontFamily: T.font, cursor: "pointer" }}>{t}</button>
          ))}
        </div>
        <HScroll gap={12}>
          {stores.map((s, i) => (
            <div key={i} style={{ flexShrink: 0, width: 170, borderRadius: 12, overflow: "hidden", background: T.card, border: `1px solid ${T.border}` }}>
              <div style={{ height: 110, overflow: "hidden", background: "#DDD" }}>
                <img src={s.img} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ padding: "9px 10px 11px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", flexShrink: 0 }} />
                  <span style={{ fontSize: 9, color: "#22C55E", fontWeight: 600 }}>{s.status}</span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: T.fg, lineHeight: 1.35 }}>{s.name}</div>
                <div style={{ fontSize: 10, color: T.primary, marginTop: 4, cursor: "pointer" }}>Bengaluru →</div>
              </div>
            </div>
          ))}
        </HScroll>
      </section>

      {/* ── IDEAS, TRENDS & HOW-TOS ── */}
      <section style={{ padding: "4px 16px 20px", background: T.card, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <SectionHead title="Ideas, trends & how-tos" action="Read More ›" />
        <HScroll gap={12}>
          {articles.map((a, i) => (
            <div key={i} style={{ flexShrink: 0, width: 170, borderRadius: 12, overflow: "hidden", background: T.bg, border: `1px solid ${T.border}` }}>
              <div style={{ height: 105, overflow: "hidden", background: "#DDD" }}>
                <img src={a.img} alt={a.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ padding: "8px 10px 10px" }}>
                <div style={{ fontSize: 9, color: T.primary, fontWeight: 600, marginBottom: 4, textTransform: "uppercase" as const }}>{a.tag}</div>
                <div style={{ fontSize: 11, color: T.fg, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>{a.title}</div>
              </div>
            </div>
          ))}
        </HScroll>
      </section>

      {/* ── OUR TROPHY CABINET ── */}
      <section style={{ padding: "20px 16px" }}>
        <SectionHead title="Our trophy cabinet" />
        <HScroll gap={12}>
          {trophies.map((t, i) => (
            <div key={i} style={{ flexShrink: 0, width: 110, background: T.card, borderRadius: 12, border: `1px solid ${T.border}`, padding: "14px 10px", textAlign: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, background: "#F5F5F5", margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🏆</div>
              <div style={{ fontSize: 9, color: T.mutedFg, marginBottom: 4 }}>{t.sub}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.fg, lineHeight: 1.35, whiteSpace: "pre-line" }}>{t.label}</div>
            </div>
          ))}
        </HScroll>
      </section>

      {/* ── WHAT CUSTOMERS SAY ── */}
      <section style={{ padding: "4px 16px 24px", background: T.card, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <SectionHead title="What customers say" />
        <p style={{ fontSize: 12, color: T.mutedFg, lineHeight: 1.55, marginBottom: 16 }}>
          Livspace frequently comments our timely delivery and the attentive nature of our service which clearly reflects their overall satisfaction. This depicts a strong inclination to recommend us to their friends and family, demonstrating our customers an unwavering confidence in Livspace.
        </p>
        {/* Rating summary */}
        <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 16, padding: "14px 16px", background: "#F9F9F9", borderRadius: 12, border: `1px solid ${T.border}` }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: T.fg, lineHeight: 1 }}>4.7</div>
            <div style={{ fontSize: 16, color: "#F59E0B", marginTop: 2 }}>★★★★★</div>
            <div style={{ fontSize: 10, color: T.mutedFg, marginTop: 2 }}>548 reviews</div>
          </div>
          <div style={{ flex: 1 }}>
            {[5,4,3,2,1].map((star, i) => (
              <div key={star} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 10, color: T.mutedFg, width: 6 }}>{star}</span>
                <div style={{ flex: 1, height: 5, borderRadius: 3, background: "#EEE", overflow: "hidden" }}>
                  <div style={{ height: "100%", background: "#F59E0B", width: [72,14,6,4,4][i] + "%" }} />
                </div>
                <span style={{ fontSize: 9, color: T.mutedFg, width: 16 }}>{[72,14,6,4,4][i]}%</span>
              </div>
            ))}
          </div>
        </div>
        {/* Review cards */}
        <HScroll gap={12}>
          {reviews.map((r, i) => (
            <div key={i} style={{ flexShrink: 0, width: 220, background: "#F9F9F9", borderRadius: 12, padding: "12px 14px", border: `1px solid ${T.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: T.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "white", fontWeight: 700, flexShrink: 0 }}>
                  {r.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.fg }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: "#F59E0B" }}>{"★".repeat(r.rating)}</div>
                </div>
              </div>
              <p style={{ fontSize: 11, color: T.mutedFg, lineHeight: 1.5, margin: 0, display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>{r.text}</p>
            </div>
          ))}
        </HScroll>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#1A1A1A", padding: "28px 16px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "white", opacity: 0.7 }} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.06em", color: "white" }}>LIVSPACE</span>
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          {["f","in","🐦","▶","📷"].map((s, i) => (
            <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 13, color: "white" }}>{s}</div>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px 20px", marginBottom: 20 }}>
          {["Interiors","Products","LookBook","Elevate","About Us","Careers","Press","Blog","Contact","Privacy Policy","Terms"].map((l, i) => (
            <span key={i} style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", cursor: "pointer" }}>{l}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 36, background: "rgba(255,255,255,0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}>
            <span style={{ fontSize: 16 }}>🍎</span><span style={{ fontSize: 11, color: "white" }}>App Store</span>
          </div>
          <div style={{ flex: 1, height: 36, background: "rgba(255,255,255,0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}>
            <span style={{ fontSize: 16 }}>▶</span><span style={{ fontSize: 11, color: "white" }}>Google Play</span>
          </div>
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
          © 2025 Livspace. All rights reserved. Registered Office: 12th Floor, The Embassy Tech Village, Marathahalli - Sarjapur, Bengaluru, Karnataka 560103
        </div>
      </footer>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="ls-mobile-only" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: T.card, borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-around", alignItems: "center", padding: "8px 0 16px", zIndex: 200 }}>
        {([
          { label: "Home",     onClick: undefined,      active: true,  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
          { label: "LookBook", onClick: onOpenLookBook, active: false, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>, highlight: true },
          { label: "Explore",  onClick: undefined,      active: false, icon: <div style={{ width:40,height:40,borderRadius:"50%",background:"#1A1A1A",display:"flex",alignItems:"center",justifyContent:"center",marginTop:-16,boxShadow:"0 4px 12px rgba(0,0,0,0.25)" }}><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div> },
          { label: "Products", onClick: undefined,      active: false, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
          { label: "Stores",   onClick: undefined,      active: false, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><rect x="9" y="15" width="6" height="7"/></svg> },
        ] as { label: string; onClick?: () => void; active: boolean; icon: React.ReactNode; highlight?: boolean }[]).map((item, i) => (
          <div key={i} className={`ls-bnav-item${item.active || item.highlight ? " ls-bnav-item-active" : ""}`} style={{ color: item.active || item.highlight ? T.primary : T.mutedFg }} onClick={item.onClick}>
            {item.icon}{item.label}
          </div>
        ))}
      </nav>
    </div>
  );
}
