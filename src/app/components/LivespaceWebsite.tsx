import { useState, useEffect, useRef } from "react";
import iconLookBook from "@/assets/icon_lookbook.png";
import iconElevate  from "@/assets/icon_elevate.png";

interface Props {
  onOpenLookBook: (room?: string) => void;
  onElevate?: (room?: string) => void;
  isDesktop?: boolean;
  onAccount?: () => void;
}

const T = {
  primary:   "#EB595F",
  primaryFg: "#FFFFFF",
  fg:        "#1A1A1A",
  mutedFg:   "#888888",
  border:    "#EBEBEB",
  card:      "#FFFFFF",
  bg:        "#F2F2F2",
  font:      "'Poppins', 'Gill Sans', sans-serif",
  roboto:    "'Roboto', sans-serif",
};

// ─── Figma assets (valid 7 days) ───────────────────────────────────────────
const IMG_BANNER     = "https://www.figma.com/api/mcp/asset/83a1c9a6-0e39-48cb-9048-f0ebde6cd440";
const IMG_CAT_INT    = "https://www.figma.com/api/mcp/asset/d0ddf77f-1362-4098-a7b7-49d169282d89";
const IMG_CAT_PROD   = "https://www.figma.com/api/mcp/asset/817b7c7a-2615-497e-b7b4-045a8b889478";
const IMG_CAT_SVC    = "https://www.figma.com/api/mcp/asset/4c06f0d3-30d5-44a2-b2a3-104db83b9e6a";
const IMG_CAT_MAT    = "https://www.figma.com/api/mcp/asset/538d6c80-0d77-440a-bd36-35f03092ede1";
const IMG_SUB_1      = "https://www.figma.com/api/mcp/asset/cf6163c1-c10b-4821-9431-785fbe7904dc";
const IMG_SUB_2      = "https://www.figma.com/api/mcp/asset/89199c51-89a6-4d40-b17c-03f9838f2cb4";
const IMG_SUB_3      = "https://www.figma.com/api/mcp/asset/171c4ef5-9269-4f37-b2b6-b7b54c968329";
const IMG_SUB_4      = "https://www.figma.com/api/mcp/asset/c85a42a6-0057-4bee-ab00-bbbce38cee7d";
const IMG_SUB_5      = "https://www.figma.com/api/mcp/asset/00a4515d-4331-497c-8160-ea587f6ecd4b";
const IMG_SUB_6      = "https://www.figma.com/api/mcp/asset/e1bb2ad0-0dbc-4167-b19b-bf0a97f323df";
const IMG_SUB_7      = "https://www.figma.com/api/mcp/asset/b56efda1-cf07-442b-9743-79c23b1113c5";
const IMG_WHY_1      = "https://www.figma.com/api/mcp/asset/19482d5e-8e7c-4fae-8c20-280fbab2bb98";
const IMG_WHY_2      = "https://www.figma.com/api/mcp/asset/c037d4a6-4da3-41dd-a88e-3e2037ce70f7";
const IMG_WHY_3      = "https://www.figma.com/api/mcp/asset/d5435e40-a0ab-4a35-9370-2a60ec8123da";
const IMG_CALC       = "https://www.figma.com/api/mcp/asset/23985ef5-3006-47ae-a068-183f321b6121";

// ─── Shared helpers ────────────────────────────────────────────────────────
function SectionHeader({ title, ctas }: { title: string; ctas?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
      <h2 style={{ margin: 0, fontSize: 36, fontWeight: 600, fontFamily: T.font, color: T.fg, lineHeight: "44px" }}>{title}</h2>
      {ctas && <div style={{ display: "flex", gap: 8, alignItems: "center" }}>{ctas}</div>}
    </div>
  );
}

function PillBtn({ label, filled = false, onClick }: { label: string; filled?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 20px", borderRadius: 9999, cursor: "pointer", fontSize: 14, fontWeight: 500, fontFamily: T.font,
      background: filled ? T.primary : T.card,
      color: filled ? "white" : T.primary,
      border: `1.5px solid ${T.primary}`,
    }}>{label}</button>
  );
}

function StarRating({ value = 4.3, count = 548 }: { value?: number; count?: number }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.45)", borderRadius: 4, padding: "2px 6px" }}>
      <span style={{ color: "#F59E0B", fontSize: 11 }}>★</span>
      <span style={{ color: "white", fontSize: 11, fontFamily: T.roboto }}>{value} ({count})</span>
    </div>
  );
}

// ─── Product card (Best selling / Services / Materials) ────────────────────
function ProductCard({ img, category, name, price, origPrice, discount, unit, badge, wishlisted, onWishlist }: {
  img: string; category: string; name: string; price: string; origPrice: string; discount: string;
  unit?: string; badge?: string; wishlisted?: boolean; onWishlist?: () => void;
}) {
  return (
    <div style={{ background: T.card, borderRadius: 12, border: `1px solid ${T.border}`, overflow: "hidden", display: "flex", flexDirection: "column", flex: "0 0 296px" }}>
      <div style={{ position: "relative", height: 200, background: "#F0EBE3", overflow: "hidden" }}>
        <img src={img} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        {badge && (
          <div style={{ position: "absolute", top: 10, left: 10, background: "#5B2D8E", color: "white", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 4, fontFamily: T.roboto }}>{badge}</div>
        )}
        <button onClick={onWishlist} style={{ position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: "50%", background: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
          {wishlisted ? "❤️" : "🤍"}
        </button>
        <div style={{ position: "absolute", bottom: 8, left: 8 }}><StarRating /></div>
      </div>
      <div style={{ padding: "12px 14px 14px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 11, color: T.mutedFg, fontFamily: T.roboto, marginBottom: 4 }}>{category}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.fg, fontFamily: T.font, lineHeight: 1.4, marginBottom: 4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>{name}</div>
        <div style={{ fontSize: 11, color: T.mutedFg, fontFamily: T.roboto, marginBottom: 8 }}>(Variant 1), (Variant 2), (Variant 3),...</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: unit ? 2 : 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: T.fg, fontFamily: T.font }}>{price}</span>
          <span style={{ fontSize: 12, color: T.mutedFg, textDecoration: "line-through", fontFamily: T.roboto }}>{origPrice}</span>
          <span style={{ fontSize: 12, color: T.primary, fontWeight: 600, fontFamily: T.roboto }}>({discount})</span>
        </div>
        {unit && <div style={{ fontSize: 11, color: T.mutedFg, fontFamily: T.roboto, marginBottom: 10 }}>{unit}</div>}
        <button style={{ alignSelf: "flex-start", padding: "6px 20px", border: `1px solid #CCCCCC`, borderRadius: 6, background: "white", fontSize: 13, fontFamily: T.font, cursor: "pointer", color: T.fg }}>Add</button>
      </div>
    </div>
  );
}

// ─── Carousel arrow button ─────────────────────────────────────────────────
function CarouselArrow({ direction, onClick }: { direction: "left" | "right"; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{ width: 36, height: 36, borderRadius: "50%", background: T.card, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.fg} strokeWidth="2.5">
        {direction === "right" ? <path d="M9 18l6-6-6-6"/> : <path d="M15 18l-6-6 6-6"/>}
      </svg>
    </button>
  );
}

// ─── Desktop Homepage ──────────────────────────────────────────────────────
function DesktopHome({ onOpenLookBook, onElevate, onAccount }: Omit<Props, "isDesktop">) {
  const [activeTab, setActiveTab] = useState<"Interiors" | "Products" | "Elevate" | "LookBook">("Interiors");
  const [shopTab, setShopTab] = useState<"Living room" | "Bedroom" | "Kitchen" | "Balcony">("Living room");
  const [countdown, setCountdown] = useState({ h: 7, m: 17, s: 17 });

  // countdown tick
  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(prev => {
        let { h, m, s } = prev;
        s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) { h = 0; m = 0; s = 0; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  const SUB_CATS: { label: string; img?: string; isExplore?: boolean }[] = [
    { label: "Full home\ninteriors",  img: IMG_SUB_1 },
    { label: "Luxury\ninteriors",     img: IMG_SUB_2 },
    { label: "Budget\ninteriors",     img: IMG_SUB_3 },
    { label: "Modular\nkitchen",      img: IMG_SUB_4 },
    { label: "Modular\nwardrobe",     img: IMG_SUB_5 },
    { label: "Modular\nstorage",      img: IMG_SUB_6 },
    { label: "Renovation",            img: IMG_SUB_7 },
    { label: "Explore All",           isExplore: true },
  ];

  const LOOKBOOK_ROOMS: { label: string; img: string; isAll?: boolean }[] = [
    { label: "Living\nRoom",  img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80" },
    { label: "Bedroom",       img: "https://images.unsplash.com/photo-1616418928117-4e6d19be2df1?w=400&q=80" },
    { label: "Kitchen",       img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80" },
    { label: "Bathroom",      img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80" },
    { label: "Dining\nRoom",  img: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&q=80" },
    { label: "Home\nOffice",  img: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80" },
    { label: "Kids\nRoom",    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80" },
    { label: "Browse\nAll",   img: "", isAll: true },
  ];

  const ELEVATE_CATS: { label: string; img: string; comingSoon?: boolean }[] = [
    { label: "Wall Solutions", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
    { label: "Painting",       img: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&q=80", comingSoon: true },
    { label: "Curtains",       img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80", comingSoon: true },
  ];

  const INTERIORS = [
    { label: "Full Home Interiors", sub: "Get the complete home interior experience", img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80" },
    { label: "Modular Interiors",   sub: "Kitchens, wardrobes and storage",            img: "https://images.unsplash.com/photo-1556909195-0cc489df19a0?w=600&q=80" },
    { label: "Luxury Interiors",    sub: "Tailored interiors that redefine elegance",  img: "https://images.unsplash.com/photo-1616137466211-f939a420be84?w=600&q=80" },
    { label: "Budget Interiors",    sub: "Get your dream home at pocket-friendly prices", img: "https://images.unsplash.com/photo-1631048499455-4f9e26f23b9f?w=600&q=80" },
  ];

  const PRODUCTS = [
    { img: "https://images.unsplash.com/photo-1593136596203-7212b076f4d2?w=400&q=80", category: "Occasional Seating", name: "Avery Wingback Modern Accent Chair", price: "₹28,799", origPrice: "₹39,999", discount: "25% OFF" },
    { img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80", category: "Bed Linen",          name: "Fergana | 250TC Artistic Bohemian Printed Cotton Bedsheet Set | Pillo...", price: "₹2,999",  origPrice: "₹4,999",  discount: "40% OFF" },
    { img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80",    category: "Curtain",            name: "De Jacquard - Classic Set Of 2 Jacquard Readymade Curtains | Ti...",    price: "₹4,499",  origPrice: "₹8,999",  discount: "50% OFF" },
    { img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",    category: "Bed Linen",          name: "Hayden Home Premium Grove Paradise Sofa Cum Bed",                        price: "₹79,999", origPrice: "₹1,29,999", discount: "15% OFF", badge: undefined },
  ];

  const SERVICES = [
    { img: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&q=80", category: "Painting",      name: "Full home painting",       price: "₹3,999", origPrice: "₹7,999", discount: "40% OFF" },
    { img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80", category: "Deep Cleaning", name: "Kitchen deep cleaning",   price: "₹2,999", origPrice: "₹3,999", discount: "20% OFF" },
    { img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80", category: "Pest control",  name: "Termite protection",       price: "₹2,999", origPrice: "₹4,999", discount: "40% OFF" },
    { img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80", category: "Deep Cleaning", name: "Chimney deep cleaning",    price: "₹1,999", origPrice: "₹3,999", discount: "50% OFF", badge: "Top seller" },
  ];

  const MATERIALS = [
    { img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", category: "Wall Panels",        name: "Timbre Autumn",        price: "₹7,999/roll", origPrice: "₹9,999", discount: "20% OFF", unit: "₹805/sqft" },
    { img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80", category: "Living Wall Panels", name: "Arboris Natural Wood", price: "₹8,499/roll", origPrice: "₹12,999", discount: "25% OFF", unit: "₹950/sqft" },
    { img: "https://images.unsplash.com/photo-1615971677499-5467cbab01b0?w=400&q=80", category: "Wall Panels",        name: "Petralis Acacia",      price: "₹7,999/roll", origPrice: "₹9,999", discount: "20% OFF", unit: "₹805/sqft" },
    { img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80", category: "Bed Wall Panels",    name: "Octavia 3D Circula",   price: "₹8,499/roll", origPrice: "₹12,999", discount: "25% OFF", unit: "₹950/sqft", badge: "Top seller" },
  ];

  const VIDEOS = [
    { img: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=300&q=80", label: "What Kitchen does she prefer?" },
    { img: "https://images.unsplash.com/photo-1616418928117-4e6d19be2df1?w=300&q=80", label: "Inside Farah Khan's Bedroom" },
    { img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80", label: "SOFAS BASED ON YOUR ZODIAC SIGNS" },
    { img: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=300&q=80", label: "Inside Farah Khan's Bedroom" },
  ];

  const INSPIRE = [
    { img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80", label: "LIVING ROOM", wide: true },
    { img: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80",  label: "HOME WORKOUT" },
    { img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",     label: "LIVING ROOM" },
    { img: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&q=80",  label: "OFFICE ROOM", wide: true },
    { img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",     label: "KITCHEN" },
    { img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80",     label: "BATHROOM" },
  ];

  const REVIEWS = [
    { name: "Aishwarya & Harsh", initials: "AH", color: "#9B59B6", service: "Deep cleaning",      stars: 5, text: "Choosing Livspace to redesign our living room was a great decision. The team was professional, and we enjoyed every moment!" },
    { name: "Riya & John",        initials: "RJ", color: "#2ECC71", service: "Pest Control",       stars: 5, text: "Livspace transformed our bedroom into a cozy haven. Their attention to detail and innovative ideas made our dream a reality. Highly recommended!" },
    { name: "Anita & Nikhil",     initials: "AN", color: "#3498DB", service: "Chimney Cleaning",   stars: 5, text: "We were impressed by Livspace's ability to blend style with functionality in our home office. Their designs are both beautiful and practical!" },
    { name: "Meera & Karan",      initials: "MK", color: "#E67E22", service: "Kitchen deep cleaning", stars: 5, text: "From start to finish, Livspace made our entire renovation process seamless. Their team was attentive to our needs and delivered beyond expectations!" },
  ];

  const SHOP_ROOMS = {
    "Living room": {
      img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      items: ["1", "2", "3", "4", "5", "6"],
    },
    "Bedroom": {
      img: "https://images.unsplash.com/photo-1616418928117-4e6d19be2df1?w=800&q=80",
      items: ["1", "2", "3", "4", "5", "6"],
    },
    "Kitchen": {
      img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
      items: ["1", "2", "3", "4", "5", "6"],
    },
    "Balcony": {
      img: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=80",
      items: ["1", "2", "3", "4", "5", "6"],
    },
  };

  const W = 1280; // content width
  const PX = 80;  // side padding

  return (
    <div style={{ fontFamily: T.font, background: "white", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        .ls-hide-scroll { scrollbar-width: none; }
        .ls-hide-scroll::-webkit-scrollbar { display: none; }
        .ls-card-hover { transition: box-shadow 0.2s, transform 0.2s; }
        .ls-card-hover:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.12); transform: translateY(-2px); }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{ background: "white", borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: W + PX * 2, margin: "0 auto", height: 64, display: "flex", alignItems: "center", gap: 32, padding: `0 ${PX}px` }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${T.primary}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: T.primary, opacity: 0.7 }} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "0.06em", color: T.fg }}>LIVSPACE</span>
          </div>
          {/* Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 28, flex: 1 }}>
            {[
              { label: "Interiors", onClick: undefined },
              { label: "LookBook",  onClick: () => onOpenLookBook?.("design") },
              { label: "Elevate",   onClick: () => onElevate?.() },
              { label: "Products",  onClick: undefined },
            ].map(({ label, onClick }) => (
              <span key={label} onClick={onClick} style={{ fontSize: 14, color: T.fg, cursor: "pointer", fontWeight: 500, fontFamily: T.font }}>{label}</span>
            ))}
          </nav>
          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F5F5F5", borderRadius: 9999, padding: "9px 16px", width: 200, flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.mutedFg} strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <span style={{ fontSize: 13, color: T.mutedFg }}>Search...</span>
          </div>
          {/* Location */}
          <div style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.fg} strokeWidth="2"><path d="M20 10c0 6-8 13-8 13S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.fg }}>Bengaluru</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={T.fg} strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
          </div>
          {/* Icons */}
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.fg} strokeWidth="1.8" style={{ cursor: "pointer" }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.fg} strokeWidth="1.8" style={{ cursor: "pointer" }}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <div onClick={onAccount} style={{ width: 32, height: 32, borderRadius: "50%", background: "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.fg} strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <section style={{ padding: `24px ${PX}px`, background: "white" }}>
        <div style={{ width: W, margin: "0 auto", height: 220, borderRadius: 16, overflow: "hidden", position: "relative", background: "linear-gradient(213.9deg, #EB595F 2.27%, #4E58B4 97.53%)" }}>
          <img src={IMG_BANNER} alt="banner" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        {/* Carousel dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 12 }}>
          <div style={{ width: 24, height: 4, borderRadius: 8, background: T.fg }} />
          <div style={{ width: 4, height: 4, borderRadius: 8, background: "rgba(0,0,0,0.3)" }} />
          <div style={{ width: 4, height: 4, borderRadius: 8, background: "rgba(0,0,0,0.3)" }} />
        </div>
      </section>

      {/* ── CATEGORY SECTION ── */}
      <section style={{ padding: `20px ${PX}px 80px`, background: "white" }}>
        <div style={{ width: W, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Heading */}
          <h1 style={{ margin: 0, textAlign: "center", fontSize: 44, fontWeight: 600, fontFamily: T.font, color: T.fg, lineHeight: "52px" }}>
            Your one-stop home shop.
          </h1>
          {/* Tab pills — order: Interiors, LookBook, Elevate, Products */}
          <div style={{ display: "flex", gap: 20 }}>
            {/* Interiors */}
            {([{ id: "Interiors" as const, img: IMG_CAT_INT }]).map(({ id, img }) => (
              <div key={id} onClick={() => setActiveTab(id)} style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                padding: "12px 16px", borderRadius: 16, cursor: "pointer",
                background: activeTab === id ? "white" : "#F5F5F5",
                border: activeTab === id ? `2px solid ${T.primary}` : "2px solid transparent",
                boxShadow: activeTab === id ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
                position: "relative",
              }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                  <img src={img} alt={id} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <span style={{ fontSize: 20, fontWeight: 600, fontFamily: T.font, color: T.fg }}>{id}</span>
                {activeTab === id && (
                  <div style={{ position: "absolute", bottom: -12, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderTop: `10px solid ${T.primary}` }} />
                )}
              </div>
            ))}
            {/* LookBook — tab */}
            <div onClick={() => setActiveTab("LookBook")} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              padding: "12px 16px", borderRadius: 16, cursor: "pointer",
              background: activeTab === "LookBook" ? "white" : "#F5F5F5",
              border: activeTab === "LookBook" ? `2px solid ${T.primary}` : "2px solid transparent",
              boxShadow: activeTab === "LookBook" ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
              position: "relative",
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                <img src={iconLookBook} alt="LookBook" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <span style={{ fontSize: 20, fontWeight: 600, fontFamily: T.font, color: activeTab === "LookBook" ? T.primary : T.fg }}>LookBook</span>
              {activeTab === "LookBook" && (
                <div style={{ position: "absolute", bottom: -12, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderTop: `10px solid ${T.primary}` }} />
              )}
            </div>
            {/* Elevate — tab */}
            <div onClick={() => setActiveTab("Elevate")} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              padding: "12px 16px", borderRadius: 16, cursor: "pointer",
              background: activeTab === "Elevate" ? "white" : "#F5F5F5",
              border: activeTab === "Elevate" ? `2px solid ${T.primary}` : "2px solid transparent",
              boxShadow: activeTab === "Elevate" ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
              position: "relative",
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                <img src={iconElevate} alt="Elevate" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <span style={{ fontSize: 20, fontWeight: 600, fontFamily: T.font, color: T.fg }}>Elevate</span>
              {activeTab === "Elevate" && (
                <div style={{ position: "absolute", bottom: -12, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderTop: `10px solid ${T.primary}` }} />
              )}
            </div>
            {/* Products */}
            {([{ id: "Products" as const, img: IMG_CAT_PROD }]).map(({ id, img }) => (
              <div key={id} onClick={() => setActiveTab(id)} style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                padding: "12px 16px", borderRadius: 16, cursor: "pointer",
                background: activeTab === id ? "white" : "#F5F5F5",
                border: activeTab === id ? `2px solid ${T.primary}` : "2px solid transparent",
                boxShadow: activeTab === id ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
                position: "relative",
              }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                  <img src={img} alt={id} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <span style={{ fontSize: 20, fontWeight: 600, fontFamily: T.font, color: T.fg }}>{id}</span>
                {activeTab === id && (
                  <div style={{ position: "absolute", bottom: -12, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderTop: `10px solid ${T.primary}` }} />
                )}
              </div>
            ))}
          </div>
          {/* Sub-category grid */}
          {activeTab === "LookBook" ? (
            <div style={{ display: "flex", gap: 20 }}>
              {LOOKBOOK_ROOMS.map((s, i) => (
                <div key={i} onClick={() => s.isAll ? onOpenLookBook?.("design") : onOpenLookBook?.(s.label)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <div style={{ width: "100%", height: 142, borderRadius: 16, overflow: "hidden", background: s.isAll ? "#FBDEDF" : T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {s.isAll ? (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#BC474C" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
                        <span style={{ fontSize: 14, color: "#BC474C", fontWeight: 500, fontFamily: T.roboto }}>Browse All</span>
                      </div>
                    ) : (
                      <img src={s.img} alt={s.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                  </div>
                  <span style={{ fontSize: 14, color: T.fg, fontFamily: T.font, fontWeight: 500, textAlign: "center", lineHeight: 1.4, whiteSpace: "pre-line" }}>{s.label}</span>
                </div>
              ))}
            </div>
          ) : activeTab !== "Elevate" ? (
            <div style={{ display: "flex", gap: 20 }}>
              {SUB_CATS.map((s, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <div style={{ width: "100%", height: 142, borderRadius: 16, overflow: "hidden", background: s.isExplore ? "#FBDEDF" : T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {s.isExplore ? (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#BC474C" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
                        </div>
                        <span style={{ fontSize: 14, color: "#BC474C", fontWeight: 500, fontFamily: T.roboto }}>Explore All</span>
                      </div>
                    ) : (
                      <img src={s.img} alt={s.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                  </div>
                  <span style={{ fontSize: 14, color: T.fg, fontFamily: T.font, fontWeight: 500, textAlign: "center", lineHeight: 1.4, whiteSpace: "pre-line" }}>{s.label}</span>
                </div>
              ))}
            </div>
          ) : (
            /* Elevate sub-categories */
            <div style={{ display: "flex", gap: 20 }}>
              {ELEVATE_CATS.map((s, i) => (
                <div key={i} onClick={() => s.comingSoon ? undefined : onElevate?.()} style={{ flex: "0 0 calc((100% - 7 * 20px) / 8)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: s.comingSoon ? "default" : "pointer" }}>
                  <div style={{ width: "100%", height: 142, borderRadius: 16, overflow: "hidden", background: T.bg, position: "relative" }}>
                    <img src={s.img} alt={s.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {s.comingSoon && (
                      <div style={{ position: "absolute", top: 8, right: 8, background: "#1A1A2E", color: "white", fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 20, letterSpacing: "0.06em" }}>
                        COMING SOON
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 14, color: T.fg, fontFamily: T.font, fontWeight: 500, textAlign: "center", lineHeight: 1.4 }}>{s.label}</span>
                </div>
              ))}
            </div>
          )}
          {/* CTA */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            {activeTab === "LookBook" ? (
              <button onClick={() => onOpenLookBook?.("design")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 32px", borderRadius: 32, background: "linear-gradient(135deg, #3D1F5E 0%, #7B3F6E 100%)", border: "none", cursor: "pointer" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                <span style={{ fontSize: 15, fontWeight: 600, color: "white", fontFamily: T.font }}>Design my looks</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            ) : activeTab === "Elevate" ? (
              <button onClick={() => onElevate?.()} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 8, background: "linear-gradient(135deg, #5E455A 0%, #EB595F 100%)", border: "none", cursor: "pointer" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "white", fontFamily: T.font }}>Browse All Designs</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            ) : (
              <button onClick={() => onOpenLookBook?.("design")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px 8px 8px", borderRadius: 8, background: "linear-gradient(54.55deg, #5E455A 5.75%, #EB6162 102.56%)", border: "none", cursor: "pointer" }}>
                <img src={IMG_CALC} alt="" style={{ width: 24, height: 24 }} />
                <span style={{ fontSize: 14, fontWeight: 500, color: "white", fontFamily: T.font }}>Estimate your home interiors cost!</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section style={{ padding: `80px ${PX}px`, background: T.bg }}>
        <div style={{ width: W, margin: "0 auto" }}>
          <SectionHeader title="Why choose us" />
          <div style={{ display: "flex", gap: 20 }}>
            {[
              { img: IMG_WHY_1, label: "11+ years of\nexperience" },
              { img: IMG_WHY_2, label: "3,500+\ndesigners" },
              { img: IMG_WHY_3, label: "146 quality\nchecks" },
              { img: IMG_WHY_1, label: "1,00,000+\nhappy homes" },
            ].map((w, i) => (
              <div key={i} style={{ flex: 1, background: "white", borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", overflow: "hidden" }}>
                  <img src={w.img} alt={w.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <p style={{ margin: 0, fontSize: 16, fontFamily: T.roboto, textAlign: "center", color: T.fg, lineHeight: 1.5, whiteSpace: "pre-line" }}>{w.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERIORS ── */}
      <section style={{ padding: `80px ${PX}px`, background: "white" }}>
        <div style={{ width: W, margin: "0 auto" }}>
          <SectionHeader title="Interiors" ctas={
            <>
              <PillBtn label="Book free consultation" filled onClick={() => onOpenLookBook?.()} />
              <PillBtn label="Explore Interiors ›" />
            </>
          } />
          <div style={{ display: "flex", gap: 20 }}>
            {INTERIORS.map((s, i) => (
              <div key={i} className="ls-card-hover" style={{ flex: 1, background: "white", borderRadius: 12, border: `1px solid ${T.border}`, overflow: "hidden", cursor: "pointer" }}>
                <div style={{ height: 200, overflow: "hidden", background: "#E8E0D8" }}>
                  <img src={s.img} alt={s.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ padding: "14px 16px 18px" }}>
                  <div style={{ fontSize: 18, fontWeight: 600, fontFamily: T.font, color: T.fg, marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 13, color: T.mutedFg, fontFamily: T.roboto, lineHeight: 1.5 }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEST SELLING PRODUCTS ── */}
      <section style={{ padding: `80px ${PX}px`, background: T.bg }}>
        <div style={{ width: W, margin: "0 auto" }}>
          <SectionHeader title="Best selling products" ctas={<PillBtn label="Explore Products ›" />} />
          <div style={{ display: "flex", gap: 24, overflowX: "auto", position: "relative" }} className="ls-hide-scroll">
            {PRODUCTS.map((p, i) => (
              <div key={i} className="ls-card-hover" style={{ flex: "0 0 296px" }}>
                <ProductCard {...p} />
              </div>
            ))}
            <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
              <CarouselArrow direction="right" />
            </div>
          </div>
        </div>
      </section>

      {/* ── OFFERS OF THE DAY ── */}
      <section style={{ padding: `80px ${PX}px`, background: "#FFF9E8" }}>
        <div style={{ width: W, margin: "0 auto", display: "flex", gap: 40, alignItems: "flex-start" }}>
          {/* Left: offer badge + countdown */}
          <div style={{ width: 260, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 20 }}>
            <div style={{ position: "relative", marginBottom: 20 }}>
              {/* Ribbon */}
              <div style={{ position: "relative", background: "#F5C800", borderRadius: "0 0 4px 4px", padding: "12px 24px 8px", textAlign: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#5B2D8E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px", fontSize: 18 }}>📢</div>
                <div style={{ fontSize: 24, fontWeight: 700, fontFamily: T.font, color: "#1A1A1A", lineHeight: 1.2 }}>Offers<br />of the day</div>
                {/* Ribbon tails */}
                <div style={{ position: "absolute", bottom: -8, left: 0, width: 0, height: 0, borderRight: "8px solid transparent", borderTop: "8px solid #C9A500" }} />
                <div style={{ position: "absolute", bottom: -8, right: 0, width: 0, height: 0, borderLeft: "8px solid transparent", borderTop: "8px solid #C9A500" }} />
              </div>
            </div>
            <div style={{ fontSize: 12, color: T.mutedFg, fontFamily: T.roboto, marginBottom: 8 }}>ends in</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#5B2D8E", borderRadius: 20, padding: "8px 20px" }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "white", fontFamily: T.font }}>{pad(countdown.h)} : {pad(countdown.m)} : {pad(countdown.s)}</span>
            </div>
          </div>
          {/* Right: product cards */}
          <div style={{ flex: 1, display: "flex", gap: 20, overflow: "hidden", position: "relative" }}>
            {[0, 1, 2].map(i => (
              <div key={i} className="ls-card-hover" style={{ flex: "0 0 296px" }}>
                <ProductCard
                  img="https://images.unsplash.com/photo-1593136596203-7212b076f4d2?w=400&q=80"
                  category="Bed Linen"
                  name="Bloomshire Luxe | Romantic Flora Printed Cotton Bedsheet Set | Pillo..."
                  price="₹88,999" origPrice="₹99,999" discount="20% OFF"
                />
              </div>
            ))}
            <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
              <CarouselArrow direction="right" />
            </div>
          </div>
        </div>
      </section>

      {/* ── TOP SERVICES ── */}
      <section style={{ padding: `80px ${PX}px`, background: "white" }}>
        <div style={{ width: W, margin: "0 auto" }}>
          <SectionHeader title="Top services" ctas={<PillBtn label="Explore Services ›" />} />
          <div style={{ display: "flex", gap: 24, position: "relative" }}>
            {SERVICES.map((s, i) => (
              <div key={i} className="ls-card-hover" style={{ flex: "0 0 296px" }}>
                <ProductCard {...s} />
              </div>
            ))}
            <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
              <CarouselArrow direction="right" />
            </div>
          </div>
        </div>
      </section>

      {/* ── BEST SELLING MATERIALS ── */}
      <section style={{ padding: `80px ${PX}px`, background: T.bg }}>
        <div style={{ width: W, margin: "0 auto" }}>
          <SectionHeader title="Best selling materials" ctas={
            <>
              <PillBtn label="Visit Store" filled />
              <PillBtn label="Explore Materials ›" />
            </>
          } />
          <div style={{ display: "flex", gap: 24, position: "relative" }}>
            {MATERIALS.map((m, i) => (
              <div key={i} className="ls-card-hover" style={{ flex: "0 0 296px" }}>
                <ProductCard {...m} />
              </div>
            ))}
            <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
              <CarouselArrow direction="right" />
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT MAKES YOUR HOME "HOME" ── */}
      <section style={{ padding: `80px ${PX}px`, background: "#3D2340" }}>
        <div style={{ width: W, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <h2 style={{ margin: 0, fontSize: 36, fontWeight: 600, fontFamily: T.font, color: "white", lineHeight: "44px" }}>
              What makes your home "Home"
            </h2>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 9999, border: "1.5px solid rgba(255,255,255,0.4)", background: "transparent", color: "white", fontSize: 14, fontFamily: T.font, cursor: "pointer" }}>
              View All <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
          <div style={{ display: "flex", gap: 20, position: "relative" }}>
            {VIDEOS.map((v, i) => (
              <div key={i} style={{ flex: "0 0 280px", borderRadius: 16, overflow: "hidden", height: 400, position: "relative", cursor: "pointer" }}>
                <img src={v.img} alt={v.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />
                <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: "white", fontFamily: T.font, lineHeight: 1.35 }}>{v.label}</div>
                </div>
                <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>
              </div>
            ))}
            <div style={{ position: "absolute", right: -18, top: "50%", transform: "translateY(-50%)" }}>
              <CarouselArrow direction="right" />
            </div>
          </div>
        </div>
      </section>

      {/* ── SHOP THE ROOM ── */}
      <section style={{ padding: `80px ${PX}px`, background: "#FDF8F4" }}>
        <div style={{ width: W, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: 36, fontWeight: 600, fontFamily: T.font, color: T.fg }}>Shop the room</h2>
              <p style={{ margin: 0, fontSize: 16, color: T.mutedFg, fontFamily: T.roboto }}>Explore our curated collections of products and shop the complete look!</p>
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 9999, border: `1.5px solid ${T.primary}`, background: "transparent", color: T.primary, fontSize: 14, fontFamily: T.font, cursor: "pointer", marginTop: 6 }}>
              View All Rooms <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
          {/* Room tabs */}
          <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${T.border}`, marginBottom: 24 }}>
            {(["Living room", "Bedroom", "Kitchen", "Balcony"] as const).map(tab => (
              <button key={tab} onClick={() => setShopTab(tab)} style={{
                padding: "10px 20px", border: "none", borderBottom: `2px solid ${shopTab === tab ? T.primary : "transparent"}`,
                background: "transparent", cursor: "pointer", fontSize: 15, fontFamily: T.font,
                color: shopTab === tab ? T.primary : T.fg, fontWeight: shopTab === tab ? 600 : 400, marginBottom: -1,
              }}>{tab}</button>
            ))}
          </div>
          {/* Room content */}
          <div style={{ display: "flex", gap: 32 }}>
            {/* Big room image */}
            <div style={{ flex: "0 0 480px", borderRadius: 16, overflow: "hidden", position: "relative", background: "#E8E0D8", aspectRatio: "1/1.1" }}>
              <img src={SHOP_ROOMS[shopTab].img} alt={shopTab} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <button style={{ position: "absolute", top: 12, right: 12, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.85)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.fg} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
            </div>
            {/* Product grid */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: T.mutedFg, fontFamily: T.roboto, marginBottom: 16 }}>Items in this room</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[0,1,2,3,4,5].map(i => (
                  <div key={i} style={{ background: "white", borderRadius: 12, border: `1px solid ${T.border}`, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    <div style={{ position: "relative", height: 130, background: "#F0EBE3" }}>
                      <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80" alt="item" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      <div style={{ position: "absolute", top: 8, left: 8, width: 22, height: 22, borderRadius: "50%", background: "#1A1A1A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "white", fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                      </div>
                      <button style={{ position: "absolute", top: 8, right: 8, width: 26, height: 26, borderRadius: "50%", background: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🤍</button>
                      <div style={{ position: "absolute", bottom: 6, left: 6 }}><StarRating /></div>
                    </div>
                    <div style={{ padding: "10px 12px 12px" }}>
                      <div style={{ fontSize: 11, color: T.mutedFg, fontFamily: T.roboto, marginBottom: 2 }}>Bed Linen</div>
                      <div style={{ fontSize: 13, fontWeight: 600, fontFamily: T.font, color: T.fg, lineHeight: 1.3, marginBottom: 4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>
                        Hayden Home Premium Grove Paradise Sofa Cum Bed
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: T.fg, fontFamily: T.font }}>₹79,999</span>
                        <span style={{ fontSize: 11, color: T.mutedFg, textDecoration: "line-through", fontFamily: T.roboto }}>₹1,29,999</span>
                        <span style={{ fontSize: 11, color: T.primary, fontFamily: T.roboto }}>(15% OFF)</span>
                      </div>
                      <button style={{ padding: "5px 18px", border: `1px solid #CCC`, borderRadius: 6, background: "white", fontSize: 12, fontFamily: T.font, cursor: "pointer", color: T.fg }}>Add</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GET INSPIRED ── */}
      <section style={{ padding: `80px ${PX}px`, background: "white" }}>
        <div style={{ width: W, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: 36, fontWeight: 600, fontFamily: T.font, color: T.fg }}>Get inspired</h2>
              <p style={{ margin: 0, fontSize: 16, color: T.mutedFg, fontFamily: T.roboto }}>Give your home a new look with these interior design ideas curated for you.</p>
            </div>
            <PillBtn label="View All ›" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "240px 240px", gap: 12 }}>
            {INSPIRE.map((img, i) => (
              <div key={i} style={{ position: "relative", borderRadius: 12, overflow: "hidden", background: "#E8E0D8", ...(img.wide ? { gridRow: "span 2" } : {}) }}>
                <img src={img.img} alt={img.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", bottom: 10, left: 12, background: "rgba(0,0,0,0.55)", borderRadius: 4, padding: "3px 8px" }}>
                  <span style={{ fontSize: 11, color: "white", fontWeight: 600, fontFamily: T.roboto, letterSpacing: "0.05em" }}>{img.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT CUSTOMERS SAY ── */}
      <section style={{ padding: `80px ${PX}px`, background: T.bg }}>
        <div style={{ width: W, margin: "0 auto" }}>
          <SectionHeader title="What customers say" ctas={<PillBtn label="View All ›" />} />
          {/* Summary + rating */}
          <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
            <div style={{ flex: 2, background: "white", borderRadius: 16, padding: "24px 28px" }}>
              <div style={{ fontSize: 16, fontWeight: 600, fontFamily: T.font, color: T.fg, marginBottom: 10 }}>Summary</div>
              <p style={{ margin: 0, fontSize: 14, color: T.mutedFg, fontFamily: T.roboto, lineHeight: 1.7 }}>
                Customers frequently commend our swift delivery and the attentive nature of our service, which clearly reflects their overall satisfaction. They often express a strong inclination to recommend us to their friends and family. Additionally, many customers are enthusiastic about returning.
              </p>
              <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${T.border}`, fontSize: 12, color: T.mutedFg, fontStyle: "italic", fontFamily: T.roboto }}>Generated by Livspace AI</div>
            </div>
            <div style={{ flex: 1, background: "white", borderRadius: 16, padding: "24px 28px", display: "flex", gap: 20 }}>
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontSize: 48, fontWeight: 700, fontFamily: T.font, color: T.fg, lineHeight: 1 }}>4.7</div>
                <div style={{ fontSize: 22, color: "#F59E0B", marginTop: 4 }}>★★★★½</div>
                <div style={{ fontSize: 13, color: T.mutedFg, fontFamily: T.roboto, marginTop: 4 }}>548 reviews</div>
              </div>
              <div style={{ flex: 1 }}>
                {[5,4,3,2,1].map((star, i) => (
                  <div key={star} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: T.mutedFg, fontFamily: T.roboto, width: 8 }}>{star}</span>
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: "#EEE", overflow: "hidden" }}>
                      <div style={{ height: "100%", background: "#F59E0B", width: [81,15,2,2,0][i] + "%" }} />
                    </div>
                    <span style={{ fontSize: 12, color: T.mutedFg, fontFamily: T.roboto, width: 28 }}>{[81,15,2,2,0][i]}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Review cards */}
          <div style={{ display: "flex", gap: 16 }}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{ flex: 1, background: "white", borderRadius: 16, padding: "20px 20px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: r.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "white", fontWeight: 700, flexShrink: 0, fontFamily: T.font }}>{r.initials}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.fg, fontFamily: T.font }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: T.mutedFg, fontFamily: T.roboto }}>{r.service}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>
                  {"★★★★★".split("").map((s, j) => <span key={j} style={{ color: "#F59E0B", fontSize: 16 }}>{s}</span>)}
                </div>
                <p style={{ margin: "0 0 12px", fontSize: 13, color: T.fg, fontFamily: T.roboto, lineHeight: 1.6 }}>{r.text}</p>
                <span style={{ fontSize: 13, color: T.primary, fontFamily: T.font, fontWeight: 600, cursor: "pointer" }}>Read More</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#1A1A1A", padding: `48px ${PX}px 32px` }}>
        <div style={{ maxWidth: W, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 11, height: 11, borderRadius: "50%", background: "white", opacity: 0.7 }} />
                </div>
                <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "0.06em", color: "white" }}>LIVSPACE</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: T.roboto, lineHeight: 1.7, marginBottom: 20 }}>India's leading home interior platform. Transforming houses into beautiful homes since 2014.</p>
              <div style={{ display: "flex", gap: 10 }}>
                {["f","in","𝕏","▶","📷"].map((s, i) => (
                  <div key={i} style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, color: "white" }}>{s}</div>
                ))}
              </div>
            </div>
            {/* Links */}
            {[
              { heading: "Interiors", links: ["Full Home Interiors", "Modular Interiors", "Luxury Interiors", "Budget Interiors", "Renovation"] },
              { heading: "Products", links: ["Sofas", "Beds", "Dining Tables", "Wardrobes", "TV Units"] },
              { heading: "Services", links: ["Home Painting", "Deep Cleaning", "Pest Control", "Carpentry", "Plumbing"] },
              { heading: "Company", links: ["About Us", "Careers", "Press", "Blog", "Contact Us"] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "white", fontFamily: T.font, marginBottom: 16 }}>{col.heading}</div>
                {col.links.map((l, j) => (
                  <div key={j} style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: T.roboto, marginBottom: 10, cursor: "pointer" }}>{l}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: T.roboto }}>© 2025 Livspace. All rights reserved.</div>
            <div style={{ display: "flex", gap: 20 }}>
              {["Privacy Policy", "Terms of Use", "Cookie Policy"].map((l, i) => (
                <span key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: T.roboto, cursor: "pointer" }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Mobile Homepage ────────────────────────────────────────────────────────
function MobileHome({ onOpenLookBook, onElevate, onAccount }: Omit<Props, "isDesktop">) {
  const [activeTab, setActiveTab] = useState<"Interiors" | "LookBook" | "Elevate" | "Products">("Interiors");
  const [shopTab, setShopTab] = useState<"Living room" | "Bedroom" | "Kitchen" | "Balcony">("Living room");
  const [countdown, setCountdown] = useState({ h: 7, m: 17, s: 17 });

  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(prev => {
        let { h, m, s } = prev;
        s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) { h = 0; m = 0; s = 0; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  /* ── Data ── */
  const INTERIORS_TILES = [
    { label: "Full home\ninteriors", img: IMG_SUB_1 },
    { label: "Luxury\ninteriors",    img: IMG_SUB_2 },
    { label: "Budget\ninteriors",    img: IMG_SUB_3 },
    { label: "Modular\nkitchen",     img: IMG_SUB_4 },
    { label: "Modular\nwardrobe",    img: IMG_SUB_5 },
    { label: "Modular\nstorage",     img: IMG_SUB_6 },
    { label: "Renovation",           img: IMG_SUB_7 },
    { label: "Explore All",          isExplore: true },
  ];
  const LOOKBOOK_TILES = [
    { label: "Living\nRoom",  img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80" },
    { label: "Bedroom",       img: "https://images.unsplash.com/photo-1616418928117-4e6d19be2df1?w=300&q=80" },
    { label: "Kitchen",       img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80" },
    { label: "Bathroom",      img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=300&q=80" },
    { label: "Dining\nRoom",  img: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=300&q=80" },
    { label: "Home\nOffice",  img: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=300&q=80" },
    { label: "Kids\nRoom",    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&q=80" },
    { label: "Browse\nAll",   isExplore: true },
  ];
  const ELEVATE_TILES = [
    { label: "Wall Solutions", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80" },
    { label: "Painting",       img: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300&q=80", comingSoon: true },
    { label: "Curtains",       img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&q=80", comingSoon: true },
  ];
  const PRODUCTS_TILES = [
    { label: "Sofas",          img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80" },
    { label: "Beds",           img: "https://images.unsplash.com/photo-1616418928117-4e6d19be2df1?w=300&q=80" },
    { label: "Dining\nTables", img: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=300&q=80" },
    { label: "Wardrobes",      img: IMG_SUB_5 },
    { label: "TV Units",       img: IMG_SUB_6 },
    { label: "Chairs",         img: "https://images.unsplash.com/photo-1593136596203-7212b076f4d2?w=300&q=80" },
    { label: "Lighting",       img: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=300&q=80" },
    { label: "Explore All",    isExplore: true },
  ];

  const M_PRODUCTS = [
    { img: "https://images.unsplash.com/photo-1593136596203-7212b076f4d2?w=300&q=80", category: "Occasional Seating", name: "Avery Wingback Modern Accent Chair", price: "₹28,799", origPrice: "₹39,999", discount: "25% OFF" },
    { img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&q=80", category: "Bed Linen",          name: "Fergana Bohemian Printed Bedsheet Set", price: "₹2,999", origPrice: "₹4,999", discount: "40% OFF" },
    { img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&q=80",    category: "Curtain",            name: "De Jacquard Classic Jacquard Curtains", price: "₹4,499", origPrice: "₹8,999", discount: "50% OFF" },
    { img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80",    category: "Sofa",               name: "Hayden Home Premium Grove Sofa", price: "₹79,999", origPrice: "₹1,29,999", discount: "15% OFF" },
  ];
  const M_OFFERS = [
    { img: "https://images.unsplash.com/photo-1593136596203-7212b076f4d2?w=300&q=80", name: "Avery Wingback Chair",    price: "₹28,799", origPrice: "₹39,999", discount: "25% OFF" },
    { img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&q=80", name: "Bohemian Bedsheet Set",   price: "₹2,999",  origPrice: "₹4,999",  discount: "40% OFF" },
    { img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&q=80",    name: "Jacquard Curtain Pair",   price: "₹4,499",  origPrice: "₹8,999",  discount: "50% OFF" },
  ];
  const M_SERVICES = [
    { img: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300&q=80", category: "Painting",      name: "Full home painting",    price: "₹3,999", origPrice: "₹7,999", discount: "40% OFF" },
    { img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80", category: "Deep Cleaning", name: "Kitchen deep cleaning", price: "₹2,999", origPrice: "₹3,999", discount: "20% OFF" },
    { img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80", category: "Chimney",       name: "Chimney deep cleaning", price: "₹1,999", origPrice: "₹3,999", discount: "50% OFF" },
  ];
  const M_MATERIALS = [
    { img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80", category: "Wall Panels", name: "Timbre Autumn",        price: "₹7,999/roll", origPrice: "₹9,999",  discount: "20% OFF", unit: "₹805/sqft" },
    { img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&q=80", category: "Wall Panels", name: "Arboris Natural Wood", price: "₹8,499/roll", origPrice: "₹12,999", discount: "25% OFF", unit: "₹950/sqft" },
    { img: "https://images.unsplash.com/photo-1615971677499-5467cbab01b0?w=300&q=80", category: "Wall Panels", name: "Petralis Acacia",      price: "₹7,999/roll", origPrice: "₹9,999",  discount: "20% OFF", unit: "₹805/sqft" },
  ];
  const M_INTERIORS_CARDS = [
    { label: "Full Home\nInteriors", sub: "Complete home interior", img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80" },
    { label: "Modular\nInteriors",   sub: "Kitchens & wardrobes",    img: "https://images.unsplash.com/photo-1556909195-0cc489df19a0?w=400&q=80" },
    { label: "Luxury\nInteriors",    sub: "Redefine elegance",        img: "https://images.unsplash.com/photo-1616137466211-f939a420be84?w=400&q=80" },
    { label: "Budget\nInteriors",    sub: "Dream home, less cost",    img: "https://images.unsplash.com/photo-1631048499455-4f9e26f23b9f?w=400&q=80" },
  ];
  const M_VIDEOS = [
    { img: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=300&q=80", label: "What Kitchen does she prefer?" },
    { img: "https://images.unsplash.com/photo-1616418928117-4e6d19be2df1?w=300&q=80", label: "Inside Farah Khan's Bedroom" },
    { img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80", label: "Sofas Based On Your Zodiac" },
  ];
  const M_INSPIRE = [
    { img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80", label: "Living Room", tall: true },
    { img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80",     label: "Kitchen" },
    { img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&q=80",  label: "Bedroom" },
    { img: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=300&q=80",  label: "Dining Room", tall: true },
    { img: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=300&q=80",  label: "Home Office" },
    { img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=300&q=80",     label: "Bathroom" },
  ];
  const M_REVIEWS = [
    { name: "Aishwarya & Harsh", initials: "AH", color: "#9B59B6", service: "Deep cleaning",    stars: 5, text: "Choosing Livspace was a great decision. Professional and detailed!" },
    { name: "Riya & John",       initials: "RJ", color: "#2ECC71", service: "Pest Control",     stars: 5, text: "Livspace transformed our bedroom into a cozy haven. Highly recommended!" },
    { name: "Anita & Nikhil",    initials: "AN", color: "#3498DB", service: "Chimney Cleaning",  stars: 5, text: "Impressive blend of style and functionality. Beautiful and practical!" },
    { name: "Meera & Karan",     initials: "MK", color: "#E67E22", service: "Kitchen cleaning",  stars: 5, text: "Seamless renovation experience. Delivered beyond expectations!" },
  ];

  /* ── Small product card ── */
  function MCard({ img, category, name, price, origPrice, discount, unit }: { img: string; category?: string; name: string; price: string; origPrice: string; discount: string; unit?: string }) {
    return (
      <div style={{ flexShrink: 0, width: 160, background: T.card, borderRadius: 12, border: `1px solid ${T.border}`, overflow: "hidden" }}>
        <div style={{ height: 140, background: "#F0EBE3", overflow: "hidden", position: "relative" }}>
          <img src={img} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <button style={{ position: "absolute", top: 6, right: 6, width: 26, height: 26, borderRadius: "50%", background: "white", border: "none", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>🤍</button>
        </div>
        <div style={{ padding: "8px 10px 10px" }}>
          {category && <div style={{ fontSize: 9, color: T.mutedFg, fontFamily: T.roboto, marginBottom: 2 }}>{category}</div>}
          <div style={{ fontSize: 11, fontWeight: 600, color: T.fg, fontFamily: T.font, lineHeight: 1.35, marginBottom: 4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>{name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" as const }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: T.fg }}>{price}</span>
            <span style={{ fontSize: 9, color: T.mutedFg, textDecoration: "line-through" }}>{origPrice}</span>
            <span style={{ fontSize: 9, color: T.primary, fontWeight: 600 }}>{discount}</span>
          </div>
          {unit && <div style={{ fontSize: 9, color: T.mutedFg, marginTop: 2 }}>{unit}</div>}
        </div>
      </div>
    );
  }

  /* ── Section heading ── */
  function MSection({ title, cta, ctaAction, children }: { title: string; cta?: string; ctaAction?: () => void; children: React.ReactNode }) {
    return (
      <section style={{ padding: "24px 0 0", background: "white" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: T.fg, fontFamily: T.font }}>{title}</h3>
          {cta && <span onClick={ctaAction} style={{ fontSize: 13, color: T.primary, fontWeight: 600, cursor: "pointer" }}>{cta} ›</span>}
        </div>
        {children}
      </section>
    );
  }

  const SHOP_ROOMS_M = {
    "Living room": { img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80" },
    "Bedroom":     { img: "https://images.unsplash.com/photo-1616418928117-4e6d19be2df1?w=600&q=80" },
    "Kitchen":     { img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80" },
    "Balcony":     { img: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&q=80" },
  };

  /* ── Tile click handler ── */
  function onTileClick(tile: { label: string; isExplore?: boolean; comingSoon?: boolean }) {
    if (tile.comingSoon) return;
    if (activeTab === "LookBook") {
      tile.isExplore ? onOpenLookBook?.("design") : onOpenLookBook?.(tile.label);
    } else if (activeTab === "Elevate") {
      tile.isExplore ? onElevate?.() : onElevate?.(tile.label);
    }
  }

  return (
    <div style={{ fontFamily: T.font, background: T.bg, minHeight: "100dvh", overflowX: "hidden", paddingBottom: 80 }}>
      <style>{`.ls-scroll-hide{scrollbar-width:none}.ls-scroll-hide::-webkit-scrollbar{display:none}`}</style>

      {/* ── HEADER ── */}
      <header style={{ background: T.card, borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ padding: "10px 16px 10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            {/* Location */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.fg} strokeWidth="2"><path d="M20 10c0 6-8 13-8 13S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span style={{ fontSize: 12, fontWeight: 600, color: T.fg, fontFamily: T.font }}>Indiranagar / Bengaluru</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={T.fg} strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
            </div>
            {/* Icons */}
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.fg} strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.fg} strokeWidth="1.8"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <svg onClick={onAccount} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.fg} strokeWidth="1.8" style={{ cursor: "pointer" }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
          </div>
          {/* Search bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F5F5F5", borderRadius: 9999, padding: "9px 14px" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.mutedFg} strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <span style={{ fontSize: 13, color: T.mutedFg }}>Search for products, services...</span>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <section style={{ padding: "12px 16px 0" }}>
        <div style={{ borderRadius: 16, overflow: "hidden", height: 174, background: "linear-gradient(213.9deg, #EB595F 2.27%, #4E58B4 97.53%)", position: "relative" }}>
          <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80" alt="hero" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 8 }}>
          <div style={{ width: 20, height: 4, borderRadius: 4, background: T.fg }} />
          <div style={{ width: 4,  height: 4, borderRadius: 4, background: "rgba(0,0,0,0.25)" }} />
          <div style={{ width: 4,  height: 4, borderRadius: 4, background: "rgba(0,0,0,0.25)" }} />
        </div>
      </section>

      {/* ── CATEGORY SECTION ── */}
      <section style={{ padding: "20px 16px 0", background: "white", marginTop: 12 }}>
        <h2 style={{ textAlign: "center", fontSize: 20, fontWeight: 700, color: T.fg, fontFamily: T.font, margin: "0 0 16px" }}>Your one-stop home shop.</h2>

        {/* Tab pills */}
        <div className="ls-scroll-hide" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {([
            { id: "Interiors" as const, img: IMG_CAT_INT },
            { id: "LookBook"  as const, img: iconLookBook },
            { id: "Elevate"   as const, img: iconElevate },
            { id: "Products"  as const, img: IMG_CAT_PROD },
          ]).map(({ id, img }) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{
              display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 9999, flexShrink: 0,
              border: `1.5px solid ${activeTab === id ? T.primary : T.border}`,
              background: activeTab === id ? "#FFF5F5" : "white", cursor: "pointer", fontFamily: T.font,
              fontSize: 13, fontWeight: activeTab === id ? 600 : 500,
              color: activeTab === id ? T.primary : T.fg,
            }}>
              <img src={img} alt={id} style={{ width: 18, height: 18, objectFit: "cover", borderRadius: 3 }} />
              {id}
            </button>
          ))}
        </div>

        {/* Sub-category tiles */}
        <div style={{ marginTop: 16, paddingBottom: 4 }}>
          {activeTab === "Elevate" ? (
            /* Elevate: 3 tiles in a row */
            <div style={{ display: "flex", gap: 12 }}>
              {ELEVATE_TILES.map((tile, i) => (
                <div key={i} onClick={() => onTileClick(tile)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: tile.comingSoon ? "default" : "pointer" }}>
                  <div style={{ width: "100%", aspectRatio: "1", borderRadius: 14, overflow: "hidden", background: T.bg, position: "relative" }}>
                    <img src={tile.img} alt={tile.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {tile.comingSoon && (
                      <div style={{ position: "absolute", top: 6, right: 6, background: "#1A1A2E", color: "white", fontSize: 7, fontWeight: 700, padding: "2px 6px", borderRadius: 10, letterSpacing: "0.05em" }}>COMING SOON</div>
                    )}
                  </div>
                  <span style={{ textAlign: "center", fontSize: 11, color: T.fg, fontFamily: T.font, fontWeight: 500, lineHeight: 1.35 }}>{tile.label}</span>
                </div>
              ))}
            </div>
          ) : (
            /* Interiors / LookBook / Products: 4x2 grid */
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px 10px" }}>
              {(activeTab === "Interiors" ? INTERIORS_TILES : activeTab === "LookBook" ? LOOKBOOK_TILES : PRODUCTS_TILES).map((tile, i) => (
                <div key={i} onClick={() => onTileClick(tile)} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}>
                  <div style={{ width: "100%", aspectRatio: "1", borderRadius: 14, overflow: "hidden", background: tile.isExplore ? "#FDEAEA" : T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {tile.isExplore ? (
                      <div style={{ width: 28, height: 28, borderRadius: "50%", border: `1.5px solid ${T.primary}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2.5"><path d="M12 8v8M8 12h8"/></svg>
                      </div>
                    ) : (
                      <img src={tile.img} alt={tile.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    )}
                  </div>
                  <div style={{ textAlign: "center", fontSize: 10, color: tile.isExplore ? T.primary : T.fg, fontFamily: T.font, fontWeight: tile.isExplore ? 600 : 400, marginTop: 6, lineHeight: 1.35, whiteSpace: "pre-line" }}>{tile.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 20px" }}>
          {activeTab === "LookBook" ? (
            <button onClick={() => onOpenLookBook?.("design")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 32, background: "linear-gradient(135deg, #3D1F5E 0%, #7B3F6E 100%)", border: "none", cursor: "pointer" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              <span style={{ fontSize: 14, fontWeight: 600, color: "white", fontFamily: T.font }}>Design my looks</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          ) : activeTab === "Elevate" ? (
            <button onClick={() => onElevate?.()} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 8, background: "linear-gradient(135deg, #5E455A 0%, #EB595F 100%)", border: "none", cursor: "pointer" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "white", fontFamily: T.font }}>Browse All Designs</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          ) : (
            <button onClick={() => onOpenLookBook?.("design")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px 10px 14px", borderRadius: 8, background: "linear-gradient(54.55deg, #5E455A 5.75%, #EB6162 102.56%)", border: "none", cursor: "pointer" }}>
              <img src={IMG_CALC} alt="" style={{ width: 22, height: 22 }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: "white", fontFamily: T.font }}>Estimate your home interiors cost!</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          )}
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section style={{ padding: "20px 16px", background: T.bg, marginTop: 8 }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 18, fontWeight: 700, color: T.fg, fontFamily: T.font }}>Why choose us</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { img: IMG_WHY_1, label: "11+ years of experience" },
            { img: IMG_WHY_2, label: "3,500+ designers" },
            { img: IMG_WHY_3, label: "146 quality checks" },
            { img: IMG_WHY_1, label: "1,00,000+ happy homes" },
          ].map((w, i) => (
            <div key={i} style={{ background: "white", borderRadius: 14, padding: "14px 12px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                <img src={w.img} alt={w.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: T.fg, fontFamily: T.font, lineHeight: 1.4 }}>{w.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── INTERIORS ── */}
      <MSection title="Interiors" cta="Explore">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 16px" }}>
          {M_INTERIORS_CARDS.map((c, i) => (
            <div key={i} style={{ borderRadius: 12, overflow: "hidden", background: "white", border: `1px solid ${T.border}` }}>
              <div style={{ height: 120, background: "#E8E0D8", overflow: "hidden" }}>
                <img src={c.img} alt={c.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "10px 10px 12px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.fg, fontFamily: T.font, lineHeight: 1.3, whiteSpace: "pre-line" }}>{c.label}</div>
                <div style={{ fontSize: 10, color: T.mutedFg, fontFamily: T.roboto, marginTop: 3 }}>{c.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 16px 20px", display: "flex", flexDirection: "column" as const, gap: 8 }}>
          <button onClick={() => onOpenLookBook?.()} style={{ padding: "13px", borderRadius: 8, background: T.primary, border: "none", color: "white", fontFamily: T.font, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Book free consultation</button>
          <button style={{ padding: "9px", borderRadius: 8, background: "white", border: `1px solid ${T.border}`, color: T.fg, fontFamily: T.font, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Explore Interiors</button>
        </div>
      </MSection>

      {/* ── BEST SELLING PRODUCTS ── */}
      <MSection title="Best selling products" cta="Explore">
        <div className="ls-scroll-hide" style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 16px 20px" }}>
          {M_PRODUCTS.map((p, i) => <MCard key={i} {...p} />)}
        </div>
      </MSection>

      {/* ── OFFERS OF THE DAY ── */}
      <section style={{ background: "#FFF9E8", padding: "20px 16px", marginTop: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: T.fg, fontFamily: T.font }}>Offers of the day</h3>
          <div style={{ background: "#1A1A2E", borderRadius: 8, padding: "4px 10px", display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", fontFamily: T.roboto }}>ends in</span>
            {[pad(countdown.h), pad(countdown.m), pad(countdown.s)].map((v, i) => (
              <span key={i} style={{ fontSize: 13, fontWeight: 700, color: "white", fontFamily: T.roboto }}>{i > 0 ? ":" : ""}{v}</span>
            ))}
          </div>
        </div>
        <div className="ls-scroll-hide" style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
          {M_OFFERS.map((p, i) => <MCard key={i} {...p} />)}
        </div>
      </section>

      {/* ── TOP SERVICES ── */}
      <MSection title="Top services" cta="Explore">
        <div className="ls-scroll-hide" style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 16px 20px" }}>
          {M_SERVICES.map((s, i) => <MCard key={i} {...s} />)}
        </div>
      </MSection>

      {/* ── BEST SELLING MATERIALS ── */}
      <MSection title="Best selling materials" cta="Explore">
        <div className="ls-scroll-hide" style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 16px 4px" }}>
          {M_MATERIALS.map((m, i) => <MCard key={i} {...m} />)}
        </div>
        <div style={{ padding: "12px 16px 20px", display: "flex", flexDirection: "column" as const, gap: 8 }}>
          <button style={{ padding: "13px", borderRadius: 8, background: T.primary, border: "none", color: "white", fontFamily: T.font, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Explore Materials</button>
          <button style={{ padding: "9px", borderRadius: 8, background: "white", border: `1px solid ${T.border}`, color: T.fg, fontFamily: T.font, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>View All</button>
        </div>
      </MSection>

      {/* ── WHAT MAKES YOUR HOME ── */}
      <section style={{ background: "#3D2340", padding: "20px 0 24px", marginTop: 8 }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 18, fontWeight: 700, color: "white", fontFamily: T.font, padding: "0 16px", lineHeight: 1.3 }}>What makes your<br />home "Home"</h3>
        <div className="ls-scroll-hide" style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 16px 4px" }}>
          {M_VIDEOS.map((v, i) => (
            <div key={i} style={{ flexShrink: 0, width: 140, borderRadius: 12, overflow: "hidden", position: "relative" }}>
              <div style={{ height: 220, background: "#2A1A2E" }}>
                <img src={v.img} alt={v.label} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }} />
              </div>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />
              <div style={{ position: "absolute", bottom: 10, left: 10, right: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "white", lineHeight: 1.3 }}>{v.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SHOP THE ROOM ── */}
      <MSection title="Shop the room">
        <p style={{ margin: "0 16px 14px", fontSize: 12, color: T.mutedFg, fontFamily: T.roboto, lineHeight: 1.5 }}>Explore curated collections and shop the complete look!</p>
        <div className="ls-scroll-hide" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "0 16px 12px" }}>
          {(["Living room", "Bedroom", "Kitchen", "Balcony"] as const).map(tab => (
            <button key={tab} onClick={() => setShopTab(tab)} style={{ flexShrink: 0, padding: "7px 14px", borderRadius: 9999, border: `1.5px solid ${shopTab === tab ? T.primary : T.border}`, background: shopTab === tab ? "#FFF5F5" : "white", fontSize: 12, fontWeight: shopTab === tab ? 600 : 400, color: shopTab === tab ? T.primary : T.fg, cursor: "pointer", fontFamily: T.font }}>{tab}</button>
          ))}
        </div>
        <div style={{ margin: "0 16px", borderRadius: 12, overflow: "hidden", height: 200 }}>
          <img src={SHOP_ROOMS_M[shopTab].img} alt={shopTab} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div className="ls-scroll-hide" style={{ display: "flex", gap: 12, overflowX: "auto", padding: "12px 16px 20px" }}>
          {M_PRODUCTS.slice(0, 2).map((p, i) => <MCard key={i} {...p} />)}
        </div>
      </MSection>

      {/* ── GET INSPIRED ── */}
      <MSection title="Get inspired" cta="View all">
        <p style={{ margin: "-4px 16px 12px", fontSize: 12, color: T.mutedFg, fontFamily: T.roboto, lineHeight: 1.5 }}>Interior design ideas curated for you.</p>
        <div style={{ padding: "0 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, paddingBottom: 20 }}>
          {M_INSPIRE.map((item, i) => (
            <div key={i} style={{ borderRadius: 12, overflow: "hidden", gridRow: item.tall ? "span 2" : "span 1", position: "relative", height: item.tall ? 220 : 104, background: T.bg }}>
              <img src={item.img} alt={item.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,0.5)", borderRadius: 6, padding: "2px 8px" }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: "white", fontFamily: T.roboto, textTransform: "uppercase" as const }}>{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </MSection>

      {/* ── WHAT CUSTOMERS SAY ── */}
      <section style={{ background: T.bg, padding: "20px 16px", marginTop: 8 }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 18, fontWeight: 700, color: T.fg, fontFamily: T.font }}>What customers say</h3>
        {/* AI Summary */}
        <div style={{ background: "white", borderRadius: 14, padding: "14px 16px", marginBottom: 12 }}>
          <p style={{ margin: "0 0 10px", fontSize: 12, color: T.fg, fontFamily: T.roboto, lineHeight: 1.6 }}>
            Customers frequently commend our swift delivery and the attentive nature of our service, clearly reflecting overall satisfaction. Many express strong inclination to recommend us to friends and family.
          </p>
          <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 8, fontSize: 11, color: T.mutedFg, fontStyle: "italic", fontFamily: T.roboto }}>Generated by Livspace AI</div>
        </div>
        {/* Rating */}
        <div style={{ background: "white", borderRadius: 14, padding: "14px 16px", marginBottom: 12, display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: T.fg, fontFamily: T.font, lineHeight: 1 }}>4.7</div>
            <div style={{ fontSize: 16, color: "#F59E0B", marginTop: 4 }}>★★★★½</div>
            <div style={{ fontSize: 10, color: T.mutedFg, marginTop: 4 }}>548 reviews</div>
          </div>
          <div style={{ flex: 1 }}>
            {[5,4,3,2,1].map((star, i) => (
              <div key={star} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: T.mutedFg, width: 7 }}>{star}</span>
                <div style={{ flex: 1, height: 5, borderRadius: 3, background: "#EEE", overflow: "hidden" }}>
                  <div style={{ height: "100%", background: "#F59E0B", width: [81,15,2,2,0][i] + "%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Review cards */}
        <div className="ls-scroll-hide" style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
          {M_REVIEWS.map((r, i) => (
            <div key={i} style={{ flexShrink: 0, width: 260, background: "white", borderRadius: 14, padding: "14px 14px 12px", border: `1px solid ${T.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: r.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "white", fontWeight: 700 }}>{r.initials}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.fg, fontFamily: T.font }}>{r.name}</div>
                  <div style={{ fontSize: 10, color: T.mutedFg }}>{r.service}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>{"★★★★★".split("").map((s,j) => <span key={j} style={{ color: "#F59E0B", fontSize: 13 }}>{s}</span>)}</div>
              <p style={{ margin: 0, fontSize: 11, color: T.fg, fontFamily: T.roboto, lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#1A1A1A", padding: "24px 16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: "white", opacity: 0.7 }} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.06em", color: "white" }}>LIVSPACE</span>
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {["f","in","𝕏","▶","📷"].map((s, i) => (
            <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "white", cursor: "pointer" }}>{s}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px", marginBottom: 20 }}>
          {["Interiors","Products","LookBook","Elevate","About Us","Careers","Privacy Policy","Terms"].map((l, i) => (
            <span key={i} style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", cursor: "pointer", padding: "4px 0" }}>{l}</span>
          ))}
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>© 2025 Livspace. All rights reserved.</div>
      </footer>

      {/* ── BOTTOM NAV ── */}
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: T.card, borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-around", alignItems: "flex-end", paddingBottom: 16, zIndex: 200, height: 72 }}>
        {/* Livspace (active home) */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flex: 1, paddingTop: 10, cursor: "pointer" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7v4a9 9 0 0 0 9 9 9 9 0 0 0 9-9V7L12 2z" stroke={T.primary} strokeWidth="1.6" fill="none"/>
            <path d="M9 12l2 2 4-4" stroke={T.primary} strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 9, fontWeight: 600, color: T.primary, fontFamily: T.font }}>Livspace</span>
        </div>
        {/* Looks → LookBook flow */}
        <div onClick={() => onOpenLookBook?.("design")} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flex: 1, paddingTop: 10, cursor: "pointer" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.mutedFg} strokeWidth="1.6">
            <rect x="3" y="3" width="7" height="18" rx="1.5"/>
            <rect x="13" y="3" width="8" height="8" rx="1.5"/>
            <rect x="13" y="13" width="8" height="8" rx="1.5"/>
          </svg>
          <span style={{ fontSize: 9, fontWeight: 500, color: T.mutedFg, fontFamily: T.font }}>Looks</span>
        </div>
        {/* Explore — center elevated */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flex: 1, cursor: "pointer" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#1A1A2E", display: "flex", alignItems: "center", justifyContent: "center", marginTop: -24, boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6">
              <path d="M5 3h4v4H5zM15 3h4v4h-4zM5 13h4v4H5zM15 13l3 3-3 3M15 16h4"/>
            </svg>
          </div>
          <span style={{ fontSize: 9, fontWeight: 500, color: T.mutedFg, fontFamily: T.font, marginTop: 2 }}>Explore</span>
        </div>
        {/* Estimator */}
        <div onClick={() => onOpenLookBook?.("design")} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flex: 1, paddingTop: 10, cursor: "pointer" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.mutedFg} strokeWidth="1.6">
            <rect x="4" y="2" width="16" height="20" rx="2"/>
            <path d="M8 6h8M8 10h2M12 10h2M16 10h0M8 14h2M12 14h2M16 14h0M8 18h2M12 18h2M16 18h0"/>
          </svg>
          <span style={{ fontSize: 9, fontWeight: 500, color: T.mutedFg, fontFamily: T.font }}>Estimator</span>
        </div>
        {/* Stores */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flex: 1, paddingTop: 10, cursor: "pointer" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.mutedFg} strokeWidth="1.6">
            <path d="M3 9l1-5h16l1 5"/>
            <path d="M3 9h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9z"/>
            <path d="M9 21V12h6v9"/>
          </svg>
          <span style={{ fontSize: 9, fontWeight: 500, color: T.mutedFg, fontFamily: T.font }}>Stores</span>
        </div>
      </nav>
    </div>
  );
}

// ─── Exported component ────────────────────────────────────────────────────
export function LivespaceWebsite({ onOpenLookBook, onElevate, isDesktop, onAccount }: Props) {
  if (isDesktop) {
    return <DesktopHome onOpenLookBook={onOpenLookBook} onElevate={onElevate} onAccount={onAccount} />;
  }
  return <MobileHome onOpenLookBook={onOpenLookBook} onElevate={onElevate} onAccount={onAccount} />;
}
