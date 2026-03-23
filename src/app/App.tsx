import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { ShoppingCart } from "lucide-react";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import livspaceLogo from "../assets/f810f87e9ffcbb74f9064b2f3494b6b1600fc76e.png";
import { supabase } from "./supabaseClient";
const projectId = import.meta.env.VITE_SUPABASE_URL?.replace("https://", "").replace(".supabase.co", "") ?? "";
const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";
import { CameraOverlayViewer } from "./components/CameraOverlayViewer";
import { DesktopRoomPreview } from "./components/DesktopRoomPreview";
import { SearchPanel } from "./components/SearchPanel";
import { PropertyScreen as PropertyScreenImpl } from "./components/PropertyScreen";
import { Tag } from "./components/Tag";
import { GalleryFilterBar } from "./components/GalleryFilterBar";
import { MobileFilterIcon } from "./components/MobileFilterIcon";
import { computePaletteSwatches, computeTopMaterials, getColorFamily } from "./utils/colorUtils";
import { LivespaceWebsite } from "./components/LivespaceWebsite";
import { LookCarousel } from "./components/LookCarousel";
import { MoodboardScreen } from "./components/MoodboardScreen";

/* ── Design Tokens ── */
const tokens = {
  primaryDefault: "#EB595F",
  primaryVariant: "#FDEEEF",
  primaryHover: "#BC474C",
  primaryVariantHover: "#FBDEDF",
  secondaryDefault: "#5E455A",
  secondaryVariant: "#EFECEF",
  surfaceDefault: "#FFFFFF",
  surfaceVariant: "#E6E6E6",
  surfaceBg: "#F2F2F2",
  onSurfaceDefault: "#1A1A1A",
  onSurfaceSecondary: "#666666",
  onSurfaceDisabled: "#999999",
  onSurfaceBorder: "#CCCCCC",
  inverseDefault: "#333333",
  inversePrimary: "#BC474C",
  extendedBeige: "#F8E3DA",
  extendedBlue: "#DAEBF4",
  extendedGreen: "#CEE4DA",
  extendedMustard: "#FFEBC2",
  tertiaryGreen: "#469E59",
  tertiaryGreenV1: "#DAECDE",
  tertiaryYellow: "#F19E2B",
  tertiaryYellowV2: "#FEF5EA",
};

/* itemDB removed — product data now comes live from lb_products via server */
const _itemDB_STUB: Record<string, any> = {
  sofa: {
    e: "🛋️", name: "Osaka L-Shaped Sofa", brand: "Livspace Originals",
    price: 82000, emi: "₹3,417/mo",
    tags: ["4-seater", "Fabric", "Light Grey", "240cm × 160cm"],
    alts: [{ e: "🛋️", n: "Milano Sectional", p: 68000 }, { e: "🛋️", n: "Nordic 3-Seater", p: 54000 }, { e: "🛋️", n: "Velvet Accent", p: 94000 }],
  },
  table: {
    e: "🪵", name: "Teak Oval Coffee Table", brand: "The Wood Studio",
    price: 28500, emi: "₹1,188/mo",
    tags: ["Solid Teak", "Natural finish", "110cm × 60cm"],
    alts: [{ e: "🪵", n: "Marble Top", p: 42000 }, { e: "🪵", n: "Glass Table", p: 22000 }, { e: "🪵", n: "Nesting Set", p: 18500 }],
  },
  plant: {
    e: "🌿", name: "Monstera + Rattan Stand", brand: "Urban Greens",
    price: 6500, emi: "₹271/mo",
    tags: ["Live plant", "Rattan stand", "120cm", "Low maintenance"],
    alts: [{ e: "🌵", n: "Fiddle Leaf Fig", p: 4500 }, { e: "🌿", n: "Snake Plant", p: 3200 }],
  },
  tv: {
    e: "📺", name: "Walnut TV Unit 1.8m", brand: "CraftHouse India",
    price: 42000, emi: "₹1,750/mo",
    tags: ["Solid Walnut", "180cm", "2 drawers", "Cable mgmt"],
    alts: [{ e: "📺", n: "Floating Unit", p: 38000 }, { e: "📺", n: "White Matte", p: 28000 }],
  },
  rug: {
    e: "🧺", name: "Dhurrie Handwoven Rug", brand: "Craft Collective",
    price: 18000, emi: "₹750/mo",
    tags: ["Cotton", "Handwoven", "200cm × 140cm", "Machine washable"],
    alts: [{ e: "🧺", n: "Jute Rug", p: 12000 }, { e: "🧺", n: "Wool Kilim", p: 24000 }],
  },
  /* ── Bedroom ── */
  bed: {
    e: "🛏️", name: "King Platform Bed", brand: "Livspace Originals",
    price: 95000, emi: "₹3,958/mo",
    tags: ["King size", "Upholstered", "Teak legs", "190×200cm"],
    alts: [{ e: "🛏️", n: "Queen Sleigh Bed", p: 78000 }, { e: "🛏️", n: "Low Platform Bed", p: 62000 }, { e: "🛏️", n: "Canopy Bed", p: 118000 }],
  },
  wardrobe: {
    e: "🚪", name: "4-Door Sliding Wardrobe", brand: "CraftHouse India",
    price: 68000, emi: "₹2,833/mo",
    tags: ["4-door", "Mirrored panels", "220×60×240cm"],
    alts: [{ e: "🚪", n: "2-Door Hinged", p: 42000 }, { e: "🚪", n: "Walk-in Frame", p: 95000 }],
  },
  lamp: {
    e: "🕯️", name: "Brass Arc Floor Lamp", brand: "Studio Beam",
    price: 14500, emi: "₹604/mo",
    tags: ["Brushed brass", "Arc", "E27 bulb", "180cm"],
    alts: [{ e: "🕯️", n: "Rattan Table Lamp", p: 4800 }, { e: "🕯️", n: "Marble Base Lamp", p: 22000 }],
  },
  nightstand: {
    e: "🪵", name: "Walnut Bedside Table", brand: "The Wood Studio",
    price: 18000, emi: "₹750/mo",
    tags: ["Solid Walnut", "1 drawer", "45×40cm"],
    alts: [{ e: "🪵", n: "Cane Bedside", p: 8500 }, { e: "🪵", n: "Floating Shelf", p: 6000 }],
  },
  /* ── Bath ── */
  vanity: {
    e: "🪞", name: "Marble Vanity Counter", brand: "Stone & Co",
    price: 82000, emi: "₹3,417/mo",
    tags: ["Carrara marble", "Double sink", "120cm"],
    alts: [{ e: "🪞", n: "Wooden Vanity", p: 54000 }, { e: "🪞", n: "Concrete Basin", p: 68000 }],
  },
  mirror: {
    e: "🪟", name: "Backlit LED Mirror", brand: "LightLab",
    price: 28000, emi: "₹1,167/mo",
    tags: ["80×60cm", "LED surround", "Touch dimmer", "Anti-fog"],
    alts: [{ e: "🪟", n: "Round Brass Mirror", p: 8500 }, { e: "🪟", n: "Tinted Full-Length", p: 14000 }],
  },
  towelRail: {
    e: "🛁", name: "Heated Towel Rail", brand: "Bathline",
    price: 12000, emi: "₹500/mo",
    tags: ["Stainless steel", "4-bar", "Electric", "60W"],
    alts: [{ e: "🛁", n: "Classic Towel Bar", p: 3200 }, { e: "🛁", n: "Freestanding Rail", p: 8800 }],
  },
  /* ── Kitchen ── */
  counter: {
    e: "🍽️", name: "Quartz Island Counter", brand: "Stone & Co",
    price: 145000, emi: "₹6,042/mo",
    tags: ["Quartz", "Kitchen island", "240×90cm", "Waterfall edge"],
    alts: [{ e: "🍽️", n: "Butcher Block", p: 88000 }, { e: "🍽️", n: "Granite Counter", p: 112000 }],
  },
  cabinet: {
    e: "🗄️", name: "Modular Upper Cabinet", brand: "Livspace Originals",
    price: 52000, emi: "₹2,167/mo",
    tags: ["Modular", "Soft-close", "Lacquered finish", "6 units"],
    alts: [{ e: "🗄️", n: "Open Shelf Unit", p: 32000 }, { e: "🗄️", n: "Glass-front Cabinet", p: 68000 }],
  },
  stool: {
    e: "🪑", name: "Counter Bar Stool", brand: "Urban Craft",
    price: 8500, emi: "₹354/mo",
    tags: ["Set of 2", "Velvet seat", "Metal legs", "65cm height"],
    alts: [{ e: "🪑", n: "Rattan Bar Stool", p: 6200 }, { e: "🪑", n: "Backless Counter Stool", p: 4800 }],
  },
  pendant: {
    e: "💡", name: "Rattan Pendant Light", brand: "Studio Beam",
    price: 9500, emi: "₹396/mo",
    tags: ["Natural rattan", "40cm diameter", "E27", "Set of 3"],
    alts: [{ e: "💡", n: "Industrial Pendant", p: 7200 }, { e: "💡", n: "Ceramic Globe", p: 12000 }],
  },
}; void _itemDB_STUB;

type ScreenId = "splash" | "property" | "quiz" | "dna" | "gallery" | "explorer" | "cart" | "wishlist" | "success" | "matched-looks" | "moodboard" | "orders" | "elevate" | "account";

type OrderStatus = "consultation_scheduled" | "consultation_completed" | "out_for_delivery" | "items_delivered" | "installation_scheduled" | "installation_completed";

interface Order {
  id: string;
  placedAt: number;
  items: CartItem[];
  itemsTotal: number;
  total: number;
  status: OrderStatus;
  lookName?: string;
  lookRoom?: string;
  // Consultation extras
  designPrice?: number;           // full design price (used for BOQ calculations)
  quoteAccepted?: boolean;
  quoteItems?: { label: string; amount: number }[];
  deliveryDate?: string;          // e.g. "Mon, 24 Mar · Morning"
  installDate?: string;
  consultOtp?: string;            // 4-digit string
  installOtp?: string;
  completionPhotos?: string[];
  rating?: number;                // 1–5
  review?: string;
  reviewSubmitted?: boolean;
  finalPaymentDone?: boolean;
}

interface CartItem { key: string; price: number; name: string; emoji: string; category?: string; lookName?: string; lookRoom?: string; }
interface SelectedLook { id: string; img: string; name: string; tag: string; price: string; items: string; room: string; }

/* ── Category → emoji / background colour (replaces emojiMap + itemDB lookups) ── */
const categoryEmoji: Record<string, string> = {
  sofa: "🛋️", table: "🪵", rug: "🧺", tv: "📺", plant: "🌿",
  lamp: "🕯️", bed: "🛏️", wardrobe: "🚪", nightstand: "🪵",
  vanity: "🪞", mirror: "🪟", towelRail: "🛁",
  counter: "🍽️", cabinet: "🗄️", stool: "🪑", pendant: "💡",
};

const categoryBg: Record<string, string> = {
  sofa:      "#F8E3DA", table:     "#FFEBC2", rug:       "#FEF5EA",
  tv:        "#E6E6E6", plant:     "#CEE4DA", lamp:      "#FFEBC2",
  bed:       "#F8E3DA", wardrobe:  "#E6E6E6", nightstand:"#FEF5EA",
  vanity:    "#F8E3DA", mirror:    "#DAEBF4", towelRail: "#E6E6E6",
  counter:   "#F8E3DA", cabinet:   "#E6E6E6", stool:     "#FFEBC2",
  pendant:   "#FEF5EA",
};

/* ── Service vs Ready-to-Ship classification ──
   Existing lb_products use lowercase slugs; the four new service products
   inserted via SQL use Title Case. Both forms are listed here. */
const SERVICE_CATEGORIES = new Set([
  // lowercase (existing seed data)
  "wardrobe", "counter",
  // Title Case (new service products inserted via SQL)
  "Wall Panel", "False Ceiling", "Kitchen Base Unit", "Kitchen Wall Unit",
]);

/* ── Room UI value → API slug ── */
const roomToSlug: Record<string, string> = {
  "Living\nRoom": "living-room",
  "Bedroom":      "bedroom", "Bedroom 2": "bedroom",
  "Bedroom 3":    "bedroom", "Bedroom 4": "bedroom",
  "Bath":         "bath",    "Kitchen":   "kitchen",
  "Balcony":      "balcony", "Study Room":"study-room",
  "Kids Room":    "kids-room",
};

/* ── LookBook website tile label → gallery browse room value ── */
const lookbookTileToRoom: Record<string, string> = {
  "Living\nRoom": "Living\nRoom",
  "Bedroom":      "Bedroom",
  "Kitchen":      "Kitchen",
  "Bathroom":     "Bath",
  "Home\nOffice": "Study Room",
  "Kids\nRoom":   "Kids Room",
  "Balcony":      "Balcony",
};

function fmt(n: number) { return "₹" + n.toLocaleString("en-IN"); }

const STYLE_OPTIONS = [
  "Modern", "Traditional", "Farmhouse", "Minimalist", "Industrial",
  "Scandinavian", "Transitional", "Mediterranean", "Mid-Century Modern", "Bohemian",
];

const COLOR_SCHEME_OPTIONS = [
  "White/Neutral", "Dark/Moody", "Wood Tones", "Earthy/Warm",
  "Cool Tones", "Bold/Colorful", "Black & White", "Two-Tone",
];

const LAYOUT_OPTIONS = [
  "L-Shaped", "U-Shaped", "Galley", "Island",
  "Peninsula", "Open-Plan", "One-Wall", "Parallel",
];

const BUDGET_TIERS: { label: string; range: [number, number] }[] = [
  { label: "Budget-Friendly", range: [0,      100000]   },
  { label: "Mid-Range",       range: [100000, 150000]   },
  { label: "High-End",        range: [150000, 200000]   },
  { label: "Luxury",          range: [200000, 10000000] },
];

const COLOR_SCHEME_FAMILIES: Record<string, string[]> = {
  "White/Neutral": ["white-cream", "beige-sand"],
  "Dark/Moody":    ["dark-charcoal"],
  "Wood Tones":    ["brown-walnut"],
  "Earthy/Warm":   ["terracotta-rust", "yellow-gold", "brown-walnut", "beige-sand"],
  "Cool Tones":    ["blue-teal", "grey-stone"],
  "Bold/Colorful": ["terracotta-rust", "yellow-gold", "green-sage", "blue-teal", "purple-mauve", "pink-blush"],
  "Black & White": ["dark-charcoal", "white-cream"],
  "Two-Tone":      [],
};

/* ── Elevate: Wall Design Data ── */
interface WallDesign {
  id: string;
  name: string;
  room: string; // slug: "living-room" | "bedroom" | "kitchen" etc.
  price: number;
  badge?: "NEW" | "PICK";
  img: string;
  images?: string[]; // additional gallery images
  tag: string;       // Style & Aesthetic
  colorScheme: string;
  material: string;
}

const ELEVATE_ROOMS: { name: string; slug: string; img: string }[] = [
  { name: "All Rooms",   slug: "all",          img: "https://images.unsplash.com/photo-1639663742190-1b3dba2eebcf?w=400&q=80" },
  { name: "Living Room", slug: "living-room",  img: "https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?w=400&q=80" },
  { name: "Bedroom",     slug: "bedroom",      img: "https://images.unsplash.com/photo-1616418928117-4e6d19be2df1?w=400&q=80" },
  { name: "Kitchen",     slug: "kitchen",      img: "https://images.unsplash.com/photo-1668026694348-b73c5eb5e299?w=400&q=80" },
  { name: "Dining Room", slug: "dining-room",  img: "https://images.unsplash.com/photo-1656403002413-2ac6137237d6?w=400&q=80" },
  { name: "Home Office", slug: "home-office",  img: "https://images.unsplash.com/photo-1751200065697-4461cc2b43cb?w=400&q=80" },
  { name: "Kids Room",   slug: "kids-room",    img: "https://images.unsplash.com/photo-1572025442367-756c1e7887a1?w=400&q=80" },
  { name: "Bathroom",    slug: "bathroom",     img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80" },
];

const WALL_DESIGNS: WallDesign[] = [
  // Living Room
  { id: "w1",  name: "Textured Concrete Wall",   room: "living-room",  price: 45000,  badge: "NEW",  img: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&q=80",  images: ["https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&q=80","https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&q=80","https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600&q=80"],  tag: "Industrial",    colorScheme: "White/Neutral",  material: "Metal" },
  { id: "w2",  name: "Fluted Wood Panel",         room: "living-room",  price: 68000,  badge: "PICK", img: "https://images.unsplash.com/photo-1631048499455-4f9e26f23b9f?w=600&q=80",  images: ["https://images.unsplash.com/photo-1631048499455-4f9e26f23b9f?w=600&q=80","https://images.unsplash.com/photo-1615529328331-f8917597711f?w=600&q=80","https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"],  tag: "Modern",         colorScheme: "Wood Tones",     material: "Wood" },
  { id: "w3",  name: "Marble Feature Wall",       room: "living-room",  price: 125000,                img: "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=600&q=80",  images: ["https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=600&q=80","https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80"],  tag: "Minimalist",     colorScheme: "White/Neutral",  material: "Metal" },
  // Bedroom
  { id: "w4",  name: "Velvet Upholstered Panel",  room: "bedroom",      price: 38000,  badge: "NEW",  img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",  images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80","https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80","https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80"],  tag: "Transitional",  colorScheme: "Dark/Moody",     material: "Metal" },
  { id: "w5",  name: "Sage Green Wainscoting",    room: "bedroom",      price: 22000,  badge: "PICK", img: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&q=80",  images: ["https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&q=80","https://images.unsplash.com/photo-1560185127-6a8f3f72f3b8?w=600&q=80","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"],  tag: "Traditional",   colorScheme: "Earthy/Warm",    material: "Wood" },
  { id: "w6",  name: "Micro-cement Finish",       room: "bedroom",      price: 55000,                 img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",  images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80","https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80","https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80"],  tag: "Minimalist",    colorScheme: "White/Neutral",  material: "Metal" },
  // Kitchen
  { id: "w7",  name: "Subway Tile Splashback",    room: "kitchen",      price: 18000,  badge: "NEW",  img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",  images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80","https://images.unsplash.com/photo-1556909190-8c7ab4fea56b?w=600&q=80","https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80"],  tag: "Traditional",   colorScheme: "White/Neutral",  material: "Metal" },
  { id: "w8",  name: "Terracotta Zellige Tiles",  room: "kitchen",      price: 42000,  badge: "PICK", img: "https://images.unsplash.com/photo-1556909195-0cc489df19a0?w=600&q=80",  images: ["https://images.unsplash.com/photo-1556909195-0cc489df19a0?w=600&q=80","https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=80","https://images.unsplash.com/photo-1560185008-b4f9b95d7c0b?w=600&q=80"],  tag: "Bohemian",       colorScheme: "Earthy/Warm",    material: "Metal" },
  // Dining Room
  { id: "w9",  name: "Exposed Brick Cladding",    room: "dining-room",  price: 35000,  badge: "NEW",  img: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80",  images: ["https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80","https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=600&q=80","https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=600&q=80"],  tag: "Industrial",    colorScheme: "Earthy/Warm",    material: "Metal" },
  { id: "w10", name: "Geometric Wallpaper",        room: "dining-room",  price: 14000,                 img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",  images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80","https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=600&q=80"],  tag: "Modern",         colorScheme: "Bold/Colorful",  material: "Wallpaper" },
  // Home Office
  { id: "w11", name: "Woven Cane Panel",           room: "home-office",  price: 28000,  badge: "PICK", img: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",  images: ["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80","https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=600&q=80","https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80"],  tag: "Scandinavian",  colorScheme: "Wood Tones",     material: "Rattan" },
  // Kids Room
  { id: "w12", name: "Pastel Colour Block Wall",   room: "kids-room",    price: 12000,  badge: "NEW",  img: "https://images.unsplash.com/photo-1615800098779-1be32e60cca3?w=600&q=80",  images: ["https://images.unsplash.com/photo-1615800098779-1be32e60cca3?w=600&q=80","https://images.unsplash.com/photo-1576186726115-4d51596775d1?w=600&q=80","https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600&q=80"],  tag: "Bohemian",       colorScheme: "Bold/Colorful",  material: "Wallpaper" },
  // Bathroom
  { id: "w13", name: "Stone Cladding",             room: "bathroom",     price: 85000,  badge: "PICK", img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80",  images: ["https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80","https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=80","https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=600&q=80"],  tag: "Minimalist",    colorScheme: "White/Neutral",  material: "Metal" },
  { id: "w14", name: "Mosaic Glass Tiles",          room: "bathroom",     price: 32000,                 img: "https://images.unsplash.com/photo-1595428773144-3f5e9db17b29?w=600&q=80",  images: ["https://images.unsplash.com/photo-1595428773144-3f5e9db17b29?w=600&q=80","https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&q=80","https://images.unsplash.com/photo-1603825491103-bd638b1873b0?w=600&q=80"],  tag: "Mediterranean", colorScheme: "Cool Tones",     material: "Metal" },
];

const WALL_BUDGET_TIERS: { label: string; range: [number, number] }[] = [
  { label: "Budget-Friendly", range: [0,      25000]    },
  { label: "Mid-Range",       range: [25000,  60000]    },
  { label: "High-End",        range: [60000,  100000]   },
  { label: "Luxury",          range: [100000, 10000000] },
];

const WALL_COLOR_SWATCHES: Record<string, string> = {
  "White/Neutral":  "#F2EFE8",
  "Dark/Moody":     "#2C2C2C",
  "Two-Tone":       "linear-gradient(to right, #B5A89A 50%, #6B8E8E 50%)",
  "Wood Tones":     "#8B5E3C",
  "Bold/Colorful":  "conic-gradient(#E74C3C, #F39C12, #2ECC71, #3498DB, #9B59B6, #E74C3C)",
  "Black & White":  "linear-gradient(to right, #1A1A1A 50%, #F0EFE9 50%)",
  "Earthy/Warm":    "#C4834A",
  "Cool Tones":     "#7BA7C4",
};

const elevateRoomTileToSlug: Record<string, string> = {
  "Living\nRoom":  "living-room",
  "Bedroom":       "bedroom",
  "Kitchen":       "kitchen",
  "Dining\nRoom":  "dining-room",
  "Home\nOffice":  "home-office",
  "Kids\nRoom":    "kids-room",
  "Bathroom":      "bathroom",
};

function generateOrderRef(): string {
  return `LVS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

const ORDER_STATUS_STEPS: { key: OrderStatus; label: string; em: string }[] = [
  { key: "consultation_scheduled",  label: "Consultation Scheduled", em: "📅" },
  { key: "consultation_completed",  label: "Consultation Done",      em: "✅" },
  { key: "out_for_delivery",        label: "Out for Delivery",       em: "🚚" },
  { key: "items_delivered",         label: "Items Delivered",        em: "📦" },
  { key: "installation_scheduled",  label: "Installation Scheduled", em: "🔨" },
  { key: "installation_completed",  label: "Installation Done",      em: "🏠" },
];

function getOrderStatus(placedAt: number): OrderStatus {
  const days = (Date.now() - placedAt) / 86_400_000;
  if (days < 3)  return "consultation_scheduled";
  if (days < 7)  return "consultation_completed";
  if (days < 20) return "out_for_delivery";
  if (days < 30) return "items_delivered";
  if (days < 40) return "installation_scheduled";
  return "installation_completed";
}

/* ── BHK Room Configs ── */
const bhkRooms: Record<string, { label: string; value: string; emoji: string; bg: string }[]> = {
  "1BHK": [
    { label: "Living Room", value: "Living\nRoom", emoji: "🛋️", bg: "#FFF0ED" },
    { label: "Bedroom",     value: "Bedroom",      emoji: "🛏️", bg: "#EDF5FF" },
    { label: "Kitchen",     value: "Kitchen",      emoji: "🍳", bg: "#FFF8E7" },
  ],
  "2BHK": [
    { label: "Living Room",    value: "Living\nRoom", emoji: "🛋️", bg: "#FFF0ED" },
    { label: "Master Bedroom", value: "Bedroom",      emoji: "🛏️", bg: "#EDF5FF" },
    { label: "Bedroom 2",      value: "Bedroom 2",    emoji: "🛏️", bg: "#F5F0FF" },
    { label: "Kitchen",        value: "Kitchen",      emoji: "🍳", bg: "#FFF8E7" },
    { label: "Bathroom",       value: "Bath",         emoji: "🚿", bg: "#F0FFF4" },
    { label: "Balcony",        value: "Balcony",      emoji: "🌿", bg: "#F0F8EF" },
  ],
  "3BHK": [
    { label: "Living Room",    value: "Living\nRoom", emoji: "🛋️", bg: "#FFF0ED" },
    { label: "Master Bedroom", value: "Bedroom",      emoji: "🛏️", bg: "#EDF5FF" },
    { label: "Bedroom 2",      value: "Bedroom 2",    emoji: "🛏️", bg: "#F5F0FF" },
    { label: "Bedroom 3",      value: "Bedroom 3",    emoji: "🛏️", bg: "#FFF5EE" },
    { label: "Kitchen",        value: "Kitchen",      emoji: "🍳", bg: "#FFF8E7" },
    { label: "Bathroom",       value: "Bath",         emoji: "🚿", bg: "#F0FFF4" },
    { label: "Balcony",        value: "Balcony",      emoji: "🌿", bg: "#F0F8EF" },
  ],
  "4BHK": [
    { label: "Living Room",    value: "Living\nRoom", emoji: "🛋️", bg: "#FFF0ED" },
    { label: "Master Bedroom", value: "Bedroom",      emoji: "🛏️", bg: "#EDF5FF" },
    { label: "Bedroom 2",      value: "Bedroom 2",    emoji: "🛏️", bg: "#F5F0FF" },
    { label: "Bedroom 3",      value: "Bedroom 3",    emoji: "🛏️", bg: "#FFF5EE" },
    { label: "Bedroom 4",      value: "Bedroom 4",    emoji: "🛏️", bg: "#FFF0ED" },
    { label: "Kitchen",        value: "Kitchen",      emoji: "🍳", bg: "#FFF8E7" },
    { label: "Bathroom",       value: "Bath",         emoji: "🚿", bg: "#F0FFF4" },
    { label: "Study Room",     value: "Study Room",   emoji: "📚", bg: "#FFF0F5" },
    { label: "Balcony",        value: "Balcony",      emoji: "🌿", bg: "#F0F8EF" },
  ],
};

/* ── Style Profile Lookup ── */
type StyleProfile = { primary: string; secondary: string; primaryPct: number; traits: string[]; tagline: string; description: string; accentColor: string; looksCount: number; };
const styleProfiles: Record<number, StyleProfile> = {
  1: { primary: "Modern Zen", secondary: "Warm Eclectic", primaryPct: 70, tagline: "Quiet luxury, perfectly composed.", description: "You're drawn to spaces that breathe. Every element earns its place — calm, intentional, and effortlessly refined.", accentColor: "rgba(235,89,95,0.22)", looksCount: 14, traits: ["Clean lines", "Neutral palettes", "Calm textures", "Natural light", "Minimal clutter", "Stone & linen"] },
  2: { primary: "Warm Boho", secondary: "Eclectic Soul", primaryPct: 65, tagline: "Soul-first. Story-rich. Entirely yours.", description: "Your home tells a story. Layers of texture, warmth, and character — a space that feels lived-in and deeply personal.", accentColor: "rgba(208,142,66,0.28)", looksCount: 10, traits: ["Earthy tones", "Layered textures", "Woven accents", "Indoor greenery", "Artisan pieces", "Warm wood tones"] },
  3: { primary: "Scandi Nordic", secondary: "Modern Minimal", primaryPct: 75, tagline: "Form follows feeling. Always.", description: "You find beauty in restraint. Natural light, honest materials, and spaces that feel considered — never overcrowded.", accentColor: "rgba(100,160,210,0.22)", looksCount: 18, traits: ["Birch & oak", "Soft whites", "Functional forms", "Cosy textures", "Muted tones", "Natural light"] },
  4: { primary: "Coastal Fresh", secondary: "Airy Luxe", primaryPct: 68, tagline: "Open skies. Open spaces. Open soul.", description: "Breezy, bright, and full of life — your ideal home feels like a long exhale on a clear blue day by the water.", accentColor: "rgba(60,190,180,0.22)", looksCount: 16, traits: ["Ocean blues", "White linen", "Rattan & cane", "Breezy volumes", "Sea glass tones", "Open plan"] },
  0: { primary: "Modern Zen", secondary: "Warm Eclectic", primaryPct: 50, tagline: "A home that simply feels right.", description: "Balanced and grounded — your space blends calm structure with organic warmth. The best of both worlds.", accentColor: "rgba(235,89,95,0.18)", looksCount: 24, traits: ["Neutral palettes", "Organic textures", "Statement pieces", "Warm wood tones", "Clean lines", "Indoor greenery"] },
};

/* ── Quiz Question Data ── */
type QuizOption = { value: number; label: string; sub: string; imgSrc?: string; colors?: string[]; splitImgs?: [string, string]; };
type QuizQuestion = { heading: string; sub: string; options: QuizOption[]; };
const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    heading: "Which living room\nspeaks to you?",
    sub: "Tap the one that feels more you",
    options: [
      { value: 1, label: "Modern Zen", sub: "Clean lines · Calm palette", imgSrc: "https://images.unsplash.com/photo-1765862835193-3c37388a409e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB6ZW4lMjBtaW5pbWFsaXN0JTIwbGl2aW5nJTIwcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc3MTgyMzU5N3ww&ixlib=rb-4.1.0&q=80&w=1080" },
      { value: 2, label: "Warm Boho", sub: "Earthy · Textured · Soulful", imgSrc: "https://images.unsplash.com/photo-1617202074052-fa303398aa00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJtJTIwYm9obyUyMGVhcnRoeSUyMGxpdmluZyUyMHJvb20lMjBpbnRlcmlvciUyMGRlY29yfGVufDF8fHx8MTc3MTgzMDU2OHww&ixlib=rb-4.1.0&q=80&w=1080" },
      { value: 3, label: "Scandi Nordic", sub: "Airy · Natural wood · Cosy", imgSrc: "https://images.unsplash.com/photo-1722348673532-d4814dbf87b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FuZGluYXZpYW4lMjBtaW5pbWFsaXN0JTIwd2hpdGUlMjBiZWRyb29tJTIwY296eXxlbnwxfHx8fDE3NzI3NzYxMDV8MA&ixlib=rb-4.1.0&q=80&w=1080" },
      { value: 4, label: "Coastal Fresh", sub: "Breezy · Light blues · Open", imgSrc: "https://images.unsplash.com/photo-1721045028639-6456efcdab01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2FzdGFsJTIwYmx1ZSUyMHdoaXRlJTIwZnJlc2glMjBsaXZpbmclMjByb29tJTIwYnJpZ2h0fGVufDF8fHx8MTc3Mjc3NjEwNnww&ixlib=rb-4.1.0&q=80&w=1080" },
    ],
  },
  {
    heading: "Pick the palette\nthat feels like home.",
    sub: "Go with your gut — no overthinking",
    options: [
      { value: 1, label: "Stone & Warmth", sub: "Warm whites, taupe & linen", colors: ["#F0EBE3", "#C4B5A0", "#8B7B6B", "#D6CFC8"] },
      { value: 2, label: "Earth & Fire", sub: "Rust, ochre & terracotta", colors: ["#C1440E", "#D4863A", "#8B3A2A", "#E8B87A"] },
      { value: 3, label: "Nordic Cool", sub: "Birch white, sage & grey", colors: ["#EDE9E4", "#8B9E88", "#B0B0AC", "#D4DDD2"] },
      { value: 4, label: "Sea & Sand", sub: "Sky blue, sandy beige & coral", colors: ["#7EC8D0", "#E8D5B0", "#E88870", "#B5E0E4"] },
    ],
  },
  {
    heading: "What would you want\nto reach out and touch?",
    sub: "Texture tells the truth about taste",
    options: [
      { value: 1, label: "Marble & Metal", sub: "Smooth surfaces, cool to touch", splitImgs: ["https://images.unsplash.com/photo-1630756377422-7cfae60dd550?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMG1hcmJsZSUyMHNsYWIlMjBwb2xpc2hlZCUyMGx1eHVyeSUyMHN1cmZhY2V8ZW58MXx8fHwxNzcyNzc4NjAzfDA&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1714548474523-4b075f19ec4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2xpc2hlZCUyMGNocm9tZSUyMG1ldGFsJTIwc3VyZmFjZSUyMHJlZmxlY3Rpb24lMjBpbmR1c3RyaWFsfGVufDF8fHx8MTc3Mjc3ODYwM3ww&ixlib=rb-4.1.0&q=80&w=1080"] },
      { value: 2, label: "Jute & Leather", sub: "Rough weave, warm and aged", splitImgs: ["https://images.unsplash.com/photo-1768102366381-c615ef9d12c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqdXRlJTIwd292ZW4lMjBiYXNrZXQlMjBuYXR1cmFsJTIwZmliZXIlMjBtYWNybyUyMGRldGFpbHxlbnwxfHx8fDE3NzI3Nzg2MDR8MA&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1564842505181-8862a3b9b173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YW4lMjBsZWF0aGVyJTIwZ3JhaW4lMjB0ZXh0dXJlJTIwbHV4dXJ5JTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NzI3Nzg2MDR8MA&ixlib=rb-4.1.0&q=80&w=1080"] },
      { value: 3, label: "Oak & Linen", sub: "Grainy wood, soft raw fabric", splitImgs: ["https://images.unsplash.com/photo-1680538993934-f81adb9e7828?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWdodCUyMG9hayUyMHdvb2QlMjBwbGFuayUyMGdyYWluJTIwbmF0dXJhbCUyMHdhcm18ZW58MXx8fHwxNzcyNzc4NjA1fDA&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1601241773118-9e67091e199e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaW5lbiUyMGZhYnJpYyUyMHdlYXZlJTIwbmF0dXJhbCUyMGJlaWdlJTIwdGV4dHVyZSUyMG1hY3JvfGVufDF8fHx8MTc3Mjc3ODYwNnww&ixlib=rb-4.1.0&q=80&w=1080"] },
      { value: 4, label: "Rattan & Cotton", sub: "Woven and airy, light to touch", splitImgs: ["https://images.unsplash.com/photo-1540180353859-e5395e174a02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXR0YW4lMjBjYW5lJTIwd2lja2VyJTIwd2VhdmUlMjBwYXR0ZXJuJTIwZGV0YWlsfGVufDF8fHx8MTc3Mjc3ODYwNnww&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1666112512232-f763ceeb5ec8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0JTIwd2hpdGUlMjBjb3R0b24lMjBmYWJyaWMlMjBmb2xkcyUyMGNsZWFuJTIwbWluaW1hbHxlbnwxfHx8fDE3NzI3Nzg2MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080"] },
    ],
  },
];

/* ── Style Profile Computation from Quiz Answers ── */
function computeStyleProfile(answers: number[]): { primaryKey: number; secondaryKey: number; primaryPct: number } {
  const weights = [40, 35, 25]; // Q1 strongest signal, Q3 weakest
  const scores: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  answers.forEach((ans, i) => { if (ans >= 1 && ans <= 4) scores[ans] += (weights[i] ?? 0); });
  const sorted = ([1, 2, 3, 4] as const).slice().sort((a, b) => scores[b] - scores[a]);
  const primaryKey = sorted[0];
  const secondaryKey = sorted[1];
  const pScore = scores[primaryKey];
  const sScore = scores[secondaryKey];
  const total = pScore + sScore;
  const rawPct = total === 0 ? 75 : Math.round((pScore / total) * 100);
  return { primaryKey, secondaryKey, primaryPct: Math.max(55, Math.min(88, rawPct)) };
}

/* ── Image Match Modal Component ── */
function ImageMatchModal({
  onClose,
  onCloseAndClear,
  uploadedImageUrl,
  setUploadedImageUrl,
  imageMatchLoading,
  imageMatchResults,
  setImageMatchResults,
  handleImageUpload,
  handleImageUrlSubmit,
  fileInputRef,
  showToast,
  setPrevScreen,
  setScreen,
}: {
  onClose: () => void;
  onCloseAndClear: () => void;
  uploadedImageUrl: string;
  setUploadedImageUrl: (url: string) => void;
  imageMatchLoading: boolean;
  imageMatchResults: any;
  setImageMatchResults: (results: any) => void;
  handleImageUpload: (file: File) => void;
  handleImageUrlSubmit: (url: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  showToast: (msg: string) => void;
  setPrevScreen: (id: ScreenId) => void;
  setScreen: (id: ScreenId) => void;
}) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onCloseAndClear}>
      <div style={{ background: tokens.surfaceDefault, borderRadius: 24, padding: 28, maxWidth: 480, width: "100%", maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: tokens.onSurfaceDefault, fontFamily: "'Playfair Display',serif" }}>Match from Image</h2>
          <button onClick={onCloseAndClear} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: tokens.surfaceBg, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        {!imageMatchResults ? (
          <>
            <p style={{ fontSize: 14, color: tokens.onSurfaceSecondary, marginBottom: 24 }}>Upload an interior image or paste a URL to generate a matching moodboard with AI</p>

            {/* Upload Button */}
            <div style={{ marginBottom: 20 }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={e => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]); }}
                style={{ display: "none" }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={imageMatchLoading}
                style={{
                  width: "100%",
                  padding: "18px",
                  background: tokens.primaryVariant,
                  border: `2px dashed ${tokens.primaryDefault}`,
                  borderRadius: 12,
                  cursor: imageMatchLoading ? "not-allowed" : "pointer",
                  fontSize: 15,
                  fontWeight: 500,
                  color: tokens.primaryDefault,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  opacity: imageMatchLoading ? 0.5 : 1,
                }}
              >
                📁 {imageMatchLoading ? "Processing..." : "Upload Image from Device"}
              </button>
            </div>

            {/* OR Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: tokens.surfaceVariant }} />
              <span style={{ fontSize: 12, color: tokens.onSurfaceDisabled, fontWeight: 500 }}>OR</span>
              <div style={{ flex: 1, height: 1, background: tokens.surfaceVariant }} />
            </div>

            {/* URL Input */}
            <div style={{ marginBottom: 20 }}>
              <input
                type="text"
                placeholder="Paste image URL here..."
                value={uploadedImageUrl}
                onChange={e => setUploadedImageUrl(e.target.value)}
                disabled={imageMatchLoading}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: `1.5px solid ${tokens.surfaceVariant}`,
                  borderRadius: 10,
                  fontSize: 14,
                  fontFamily: "'Roboto',sans-serif",
                  outline: "none",
                  opacity: imageMatchLoading ? 0.5 : 1,
                }}
                onFocus={e => e.target.style.borderColor = tokens.primaryDefault}
                onBlur={e => e.target.style.borderColor = tokens.surfaceVariant}
              />
              <button
                onClick={() => { if (uploadedImageUrl) handleImageUrlSubmit(uploadedImageUrl); }}
                disabled={!uploadedImageUrl || imageMatchLoading}
                style={{
                  width: "100%",
                  marginTop: 10,
                  padding: "14px",
                  background: uploadedImageUrl && !imageMatchLoading ? tokens.primaryDefault : tokens.surfaceVariant,
                  border: "none",
                  borderRadius: 10,
                  cursor: uploadedImageUrl && !imageMatchLoading ? "pointer" : "not-allowed",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "white",
                  fontFamily: "'Roboto',sans-serif",
                }}
              >
                {imageMatchLoading ? "🔄 Analyzing..." : "✨ Generate Moodboard"}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Results */}
            <div style={{ marginBottom: 20 }}>
              {uploadedImageUrl && (
                <img src={uploadedImageUrl} alt="Uploaded" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 12, marginBottom: 16 }} />
              )}
              <h3 style={{ fontSize: 18, fontWeight: 600, color: tokens.onSurfaceDefault, marginBottom: 12 }}>✨ Moodboard Generated</h3>
              
              {/* Display results */}
              {imageMatchResults.palette && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: tokens.onSurfaceSecondary, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Color Palette</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {imageMatchResults.palette.map((color: string, i: number) => (
                      <div key={i} style={{ flex: 1, height: 60, background: color, borderRadius: 8, border: `1px solid ${tokens.surfaceVariant}` }} />
                    ))}
                  </div>
                </div>
              )}

              {imageMatchResults.style && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: tokens.onSurfaceSecondary, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Style</div>
                  <div style={{ fontSize: 15, color: tokens.onSurfaceDefault }}>{imageMatchResults.style}</div>
                </div>
              )}

              {imageMatchResults.materials && imageMatchResults.materials.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: tokens.onSurfaceSecondary, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Materials</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {imageMatchResults.materials.map((mat: string, i: number) => (
                      <span key={i} style={{ background: tokens.surfaceBg, padding: "6px 12px", borderRadius: 8, fontSize: 13, color: tokens.onSurfaceDefault }}>{mat}</span>
                    ))}
                  </div>
                </div>
              )}

              {imageMatchResults.summary && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: tokens.onSurfaceSecondary, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Summary</div>
                  <div style={{ fontSize: 14, color: tokens.onSurfaceSecondary, lineHeight: 1.6 }}>{imageMatchResults.summary}</div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => { 
                  setUploadedImageUrl(""); 
                  setImageMatchResults(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                style={{
                  flex: 1,
                  height: 48,
                  padding: "0 16px",
                  background: "var(--muted)",
                  border: "none",
                  borderRadius: 99,
                  cursor: "pointer",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  fontFamily: "var(--font-gilroy)",
                  color: "var(--on-surface-secondary)",
                }}
              >
                Try Another
              </button>
              <button
                onClick={() => { 
                  console.log('[ImageMatchModal] Browse Looks clicked, imageMatchResults:', imageMatchResults);
                  onClose(); // Close modal but DON'T clear imageMatchResults
                  setPrevScreen("gallery");
                  setScreen("matched-looks");
                }}
                style={{
                  flex: 1,
                  height: 48,
                  padding: "0 16px",
                  background: "var(--primary)",
                  border: "none",
                  borderRadius: 9999,
                  cursor: "pointer",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  fontFamily: "var(--font-gilroy)",
                  color: "var(--primary-foreground)",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                Browse Looks →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ════════════════════��═════════════════
   MATCHED LOOKS SCREEN (from Image Match or View Similar)
════════════════════════════════════�����═ */
function MatchedLooksScreen({ goTo, goBack, imageMatchResults, lookSimilarityData, setSelectedLook, isDesktop, showToast, isActive }: { goTo: (id: ScreenId) => void; goBack: () => void; imageMatchResults: any; lookSimilarityData: any; setSelectedLook: (l: SelectedLook) => void; isDesktop?: boolean; showToast: (m: string) => void; isActive?: boolean }) {
  const [matchedLooks, setMatchedLooks] = useState<{ high: any[]; medium: any[]; low: any[] }>({ high: [], medium: [], low: [] });
  const [sameRoomMatches, setSameRoomMatches] = useState<{ high: any[]; medium: any[] }>({ high: [], medium: [] });
  const [otherRoomMatches, setOtherRoomMatches] = useState<{ high: any[]; medium: any[]; low: any[] }>({ high: [], medium: [], low: [] });
  const [loading, setLoading] = useState(true);
  const [detectedRoomType, setDetectedRoomType] = useState<string>("");
  const [suggestedLooks, setSuggestedLooks] = useState<any[]>([]);

  /* Fetch suggested looks once when no results */
  const hasNoResults = !loading &&
    matchedLooks.high.length === 0 &&
    matchedLooks.medium.length === 0 &&
    matchedLooks.low.length === 0;

  useEffect(() => {
    if (!hasNoResults || suggestedLooks.length > 0) return;
    (async () => {
      try {
        const { data: looks } = await supabase
          .from("lb_looks")
          .select("id, name, image_url, price, is_top_pick, style:lb_styles(name), room:lb_rooms(slug)")
          .eq("is_top_pick", true)
          .limit(4);
        const list = looks ?? [];
        setSuggestedLooks(list.map((l: any) => ({
          id:       l.id,
          img:      l.image_url,
          tag:      (l.style as any)?.name ?? "",
          name:     l.name,
          price:    `₹${(l.price ?? 0).toLocaleString("en-IN")}`,
          items:    "",
          roomSlug: (l.room as any)?.slug ?? "",
        })));
      } catch (err) {
        console.log("[MatchedLooks] suggested fetch error:", err);
      }
    })();
  }, [hasNoResults, suggestedLooks.length]);

  // Color similarity helper - converts hex to RGB and calculates distance
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const colorDistance = (hex1: string, hex2: string) => {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    if (!rgb1 || !rgb2) return 999;
    return Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
    );
  };

  // Check if colors match (similar enough)
  const colorsMatch = (uploadedPalette: string[], lookPalette: {hex: string, name: string}[]) => {
    if (!uploadedPalette || !lookPalette) return false;
    const threshold = 80; // Color distance threshold
    let matchCount = 0;
    for (const uploadedColor of uploadedPalette) {
      for (const lookColor of lookPalette) {
        if (colorDistance(uploadedColor, lookColor.hex) < threshold) {
          matchCount++;
          break;
        }
      }
    }
    return matchCount >= 2; // At least 2 colors should match
  };

  // Check if styles match
  const stylesMatch = (uploadedStyle: string, lookStyleName: string) => {
    if (!uploadedStyle || !lookStyleName) return false;
    const uploaded = uploadedStyle.toLowerCase();
    const lookStyle = lookStyleName.toLowerCase();
    // Check for partial match
    return uploaded.includes(lookStyle) || lookStyle.includes(uploaded) || 
           uploaded.split(' ').some((word: string) => lookStyle.includes(word));
  };

  // Check if materials overlap
  const materialsOverlap = (uploadedMaterials: string[], lookMaterials: string[]) => {
    if (!uploadedMaterials || !lookMaterials) return false;
    const uploadedLower = uploadedMaterials.map(m => m.toLowerCase());
    const lookLower = lookMaterials.map(m => m.toLowerCase());
    let overlapCount = 0;
    for (const uploaded of uploadedLower) {
      for (const look of lookLower) {
        if (uploaded.includes(look) || look.includes(uploaded)) {
          overlapCount++;
          break;
        }
      }
    }
    return overlapCount >= 1;
  };

  useEffect(() => {
    // Support both image matching and look similarity
    const matchData = imageMatchResults || lookSimilarityData;
    const isViewSimilar = !!lookSimilarityData;

    if (!matchData) {
      console.log('[MatchedLooksScreen] No match data, going back');
      if (isActive) goBack();
      return;
    }

    console.log('[MatchedLooksScreen] matchData:', matchData, 'isViewSimilar:', isViewSimilar);

    (async () => {
      setLoading(true);
      try {
        // Fetch all looks from all rooms
        const { data: looks, error } = await supabase
          .from("lb_looks")
          .select("id, name, image_url, price, style:lb_styles(name), room:lb_rooms(name, slug)");
        
        if (error) throw error;

        const lookList = looks ?? [];
        console.log(`[MatchedLooks] Fetched ${lookList.length} looks`);

        // Fetch moodboards for all looks in parallel
        const looksWithMoodboards = await Promise.all(
          lookList.map(async (look: any) => {
            try {
              const resp = await fetch(
                `https://${projectId}.supabase.co/functions/v1/make-server-ef09e2ac/moodboard`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json", "Authorization": `Bearer ${publicAnonKey}` },
                  body: JSON.stringify({
                    look_id: look.id,
                    image_url: look.image_url,
                    look_name: look.name,
                    style_name: look.style?.name ?? ""
                  }),
                }
              );
              const moodboard = await resp.json();
              return { ...look, moodboard };
            } catch (err) {
              console.log(`Error fetching moodboard for look ${look.id}:`, err);
              return { ...look, moodboard: null };
            }
          })
        );

        // Match looks based on matchData (either from image or look similarity)
        const high: any[] = [];
        const medium: any[] = [];
        const low: any[] = [];

        // For room-based filtering (only for image match, not view similar)
        const sameRoomHigh: any[] = [];
        const sameRoomMedium: any[] = [];
        const otherRoomHigh: any[] = [];
        const otherRoomMedium: any[] = [];
        const otherRoomLow: any[] = [];

        // Extract detected room type from image match
        const detectedRoom = !isViewSimilar && matchData.room_type ? matchData.room_type : "";
        setDetectedRoomType(detectedRoom);
        console.log(`[MatchedLooks] Detected room type: "${detectedRoom}"`);

        for (const look of looksWithMoodboards) {
          if (!look.moodboard) continue;

          const colorMatch = colorsMatch(matchData.palette, look.moodboard.palette);
          const styleMatch = stylesMatch(matchData.style, look.style?.name ?? "");
          const materialMatch = materialsOverlap(matchData.materials, look.moodboard.materials);

          const matchCount = [colorMatch, styleMatch, materialMatch].filter(Boolean).length;
          
          console.log(`[Match] Look "${look.name}" (${look.room?.name}): color=${colorMatch}, style=${styleMatch}, material=${materialMatch}, total=${matchCount}`);

          // Count products for this look
          const { data: lps } = await supabase
            .from("lb_look_products")
            .select("look_id")
            .eq("look_id", look.id);

          const lookData = {
            id: look.id,
            img: look.image_url,
            tag: look.style?.name ?? "",
            name: look.name,
            price: `₹${(look.price ?? 0).toLocaleString("en-IN")}`,
            items: `${(lps ?? []).length} items`,
            room: look.room?.name ?? "Living Room",
            matchScore: matchCount,
          };

          // Check if this look matches the detected room type
          const isSameRoom = detectedRoom && look.room?.name?.toLowerCase().includes(detectedRoom.toLowerCase());

          if (matchCount === 3) {
            high.push(lookData);
            if (detectedRoom) {
              if (isSameRoom) sameRoomHigh.push(lookData);
              else otherRoomHigh.push(lookData);
            }
          } else if (matchCount === 2) {
            medium.push(lookData);
            if (detectedRoom) {
              if (isSameRoom) sameRoomMedium.push(lookData);
              else otherRoomMedium.push(lookData);
            }
          } else if (matchCount === 1) {
            low.push(lookData);
            if (detectedRoom && !isSameRoom) {
              otherRoomLow.push(lookData);
            }
          }
        }

        // For "View Similar", only show High and Medium matches (no room filtering)
        if (isViewSimilar) {
          setMatchedLooks({ high, medium, low: [] });
          setSameRoomMatches({ high: [], medium: [] });
          setOtherRoomMatches({ high: [], medium: [], low: [] });
          console.log(`[MatchedLooks] View Similar - High: ${high.length}, Medium: ${medium.length}`);
        } else if (detectedRoom) {
          // Image match with room filtering
          setMatchedLooks({ high: [], medium: [], low: [] }); // Not used in this mode
          setSameRoomMatches({ high: sameRoomHigh, medium: sameRoomMedium });
          setOtherRoomMatches({ high: otherRoomHigh, medium: otherRoomMedium, low: otherRoomLow });
          console.log(`[MatchedLooks] Image Match with room filter - Same Room: ${sameRoomHigh.length + sameRoomMedium.length}, Other Rooms: ${otherRoomHigh.length + otherRoomMedium.length + otherRoomLow.length}`);
        } else {
          // Image match without room filtering (fallback)
          setMatchedLooks({ high, medium, low });
          setSameRoomMatches({ high: [], medium: [] });
          setOtherRoomMatches({ high: [], medium: [], low: [] });
          console.log(`[MatchedLooks] Image Match - High: ${high.length}, Medium: ${medium.length}, Low: ${low.length}`);
        }
      } catch (err: any) {
        console.log("Error matching looks:", err);
        showToast("❌ Error loading matched looks");
      } finally {
        setLoading(false);
      }
    })();
  }, [imageMatchResults, lookSimilarityData]);

  const renderLookCard = (look: any) => (
    <div
      key={look.id}
      onClick={() => {
        setSelectedLook({ ...look, room: look.room });
        goTo("explorer");
      }}
      style={{
        background: tokens.surfaceDefault,
        borderRadius: 18,
        overflow: "hidden",
        border: `1.5px solid ${tokens.surfaceVariant}`,
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e: any) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e: any) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ width: "100%", paddingTop: "100%", position: "relative", overflow: "hidden" }}>
        <img
          src={look.img}
          alt={look.name}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div style={{
          position: "absolute",
          top: 8,
          left: 8,
          background: tokens.surfaceBg,
          borderRadius: 6,
          padding: "3px 8px",
          fontSize: 9,
          fontWeight: 700,
          color: tokens.onSurfaceSecondary,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}>
          {look.tag}
        </div>
      </div>
      <div style={{ padding: 12 }}>
        <div style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: 14,
          fontWeight: 600,
          color: tokens.onSurfaceDefault,
          lineHeight: 1.3,
          marginBottom: 4,
        }}>
          {look.name}
        </div>
        <div style={{ fontSize: 11, color: tokens.onSurfaceSecondary, marginBottom: 8 }}>
          {look.items}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: tokens.onSurfaceDefault }}>
          {look.price}
        </div>
      </div>
    </div>
  );

  const renderSection = (title: string, subtitle: string, looks: any[], badgeColor: string) => {
    if (looks.length === 0) return null;
    
    return (
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingLeft: isDesktop ? 0 : 20 }}>
          <div style={{
            background: badgeColor,
            color: "white",
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: 20,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}>
            {title}
          </div>
          <div style={{ fontSize: 13, color: tokens.onSurfaceSecondary }}>
            {subtitle}
          </div>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: isDesktop ? "repeat(4, 1fr)" : "repeat(2, 1fr)",
          gap: 12,
          padding: isDesktop ? 0 : "0 20px",
        }}>
          {looks.map(renderLookCard)}
        </div>
      </div>
    );
  };

  const isViewSimilar = !!lookSimilarityData;
  
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: tokens.surfaceBg, overflow: "hidden" }}>
      {!isDesktop && <div style={{ background: tokens.surfaceDefault }}><StatusBar /></div>}
      <div style={{ ...(isDesktop ? { maxWidth: 1200, width: "100%", alignSelf: "center", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" } : { display: "contents" }) }}>
        <NavBar title={isViewSimilar ? "Similar Looks" : "Matched Looks"} onBack={goBack} />
        
        <div style={{ flex: 1, overflowY: "auto", paddingTop: 20, paddingBottom: 40 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 24px", color: tokens.onSurfaceSecondary }}>
              {/* Animated Color Swatches */}
              <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                gap: 8, 
                marginBottom: 24,
                perspective: "1000px"
              }}>
                {["#8B7355", "#E8DCC4", "#2C5F4F", "#D4A574", "#4A5568"].map((color, i) => (
                  <div
                    key={i}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: color,
                      animation: `swatchRotate 2s ease-in-out infinite`,
                      animationDelay: `${i * 0.15}s`,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      transformStyle: "preserve-3d",
                    }}
                  />
                ))}
              </div>
              <style>{`
                @keyframes swatchRotate {
                  0%, 100% { 
                    transform: rotateY(0deg) scale(1);
                    opacity: 0.7;
                  }
                  25% { 
                    transform: rotateY(180deg) scale(1.1);
                    opacity: 1;
                  }
                  50% { 
                    transform: rotateY(360deg) scale(1);
                    opacity: 0.7;
                  }
                  75% { 
                    transform: rotateY(180deg) scale(1.1);
                    opacity: 1;
                  }
                }
              `}</style>
              <div style={{ fontSize: 15, fontWeight: 500, color: tokens.onSurfaceDefault, marginBottom: 8 }}>
                Analyzing your moodboard...
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                Matching colors, styles, and materials across our collection
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ padding: isDesktop ? "0 0 24px" : "0 20px 24px", marginBottom: 8 }}>
                <h2 style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: isDesktop ? 28 : 22,
                  fontWeight: 700,
                  color: tokens.onSurfaceDefault,
                  marginBottom: 8,
                }}>
                  {isViewSimilar ? "Similar Looks" : detectedRoomType ? `${detectedRoomType} Looks Matching Your Style` : "Looks Matching Your Style"}
                </h2>
                <p style={{ fontSize: 14, color: tokens.onSurfaceSecondary, lineHeight: 1.6 }}>
                  {isViewSimilar 
                    ? `We've found ${matchedLooks.high.length + matchedLooks.medium.length} similar looks based on color palette, style, and materials`
                    : detectedRoomType
                      ? `We've matched ${sameRoomMatches.high.length + sameRoomMatches.medium.length} ${detectedRoomType.toLowerCase()} looks from your uploaded image`
                      : `We've matched ${matchedLooks.high.length + matchedLooks.medium.length + matchedLooks.low.length} looks based on your uploaded image's color palette, style, and materials`
                  }
                </p>
              </div>

              {/* Room-based matching (when room type is detected) */}
              {detectedRoomType && !isViewSimilar ? (
                <>
                  {/* Same room matches */}
                  {renderSection(
                    "Perfect Match",
                    `${sameRoomMatches.high.length} ${detectedRoomType.toLowerCase()} looks · Color, Style & Materials match`,
                    sameRoomMatches.high,
                    tokens.tertiaryGreen
                  )}
                  
                  {renderSection(
                    "Great Match",
                    `${sameRoomMatches.medium.length} ${detectedRoomType.toLowerCase()} looks · 2 attributes match`,
                    sameRoomMatches.medium,
                    tokens.tertiaryYellow
                  )}

                  {/* Other rooms section */}
                  {(otherRoomMatches.high.length + otherRoomMatches.medium.length + otherRoomMatches.low.length) > 0 && (
                    <>
                      <div style={{ 
                        margin: isDesktop ? "48px 0 24px" : "48px 20px 24px", 
                        paddingTop: 32, 
                        borderTop: `2px solid ${tokens.surfaceVariant}` 
                      }}>
                        <h3 style={{
                          fontFamily: "'Playfair Display',serif",
                          fontSize: isDesktop ? 24 : 20,
                          fontWeight: 700,
                          color: tokens.onSurfaceDefault,
                          marginBottom: 8,
                        }}>
                          Other Rooms Matching Your Palette
                        </h3>
                        <p style={{ fontSize: 14, color: tokens.onSurfaceSecondary, lineHeight: 1.6 }}>
                          Looks from other room types that share your color scheme and style
                        </p>
                      </div>

                      {renderSection(
                        "High Match",
                        `${otherRoomMatches.high.length} looks · Color, Style & Materials match`,
                        otherRoomMatches.high,
                        tokens.tertiaryGreen
                      )}
                      
                      {renderSection(
                        "Medium Match",
                        `${otherRoomMatches.medium.length} looks · 2 attributes match`,
                        otherRoomMatches.medium,
                        tokens.tertiaryYellow
                      )}
                      
                      {renderSection(
                        "Low Match",
                        `${otherRoomMatches.low.length} looks · 1 attribute matches`,
                        otherRoomMatches.low,
                        tokens.onSurfaceDisabled
                      )}
                    </>
                  )}

                  {sameRoomMatches.high.length === 0 && sameRoomMatches.medium.length === 0 && (
                    <div style={{ textAlign: "center", padding: "60px 24px", color: tokens.onSurfaceSecondary }}>
                      <div style={{ fontSize: 52, marginBottom: 12 }}>🔍</div>
                      <div style={{ fontSize: 15, fontWeight: 500, color: tokens.onSurfaceDefault, marginBottom: 8 }}>
                        No matching {detectedRoomType.toLowerCase()} looks found
                      </div>
                      <div style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
                        {otherRoomMatches.high.length + otherRoomMatches.medium.length > 0 
                          ? "Check out the matching looks from other rooms below"
                          : "Try uploading a different image or browse all our looks"
                        }
                      </div>
                      {otherRoomMatches.high.length + otherRoomMatches.medium.length === 0 && (
                        <button
                          onClick={() => goTo("gallery")}
                          style={{
                            background: "var(--primary)",
                            color: "var(--primary-foreground)",
                            border: "none",
                            borderRadius: 9999,
                            padding: "0 24px",
                            height: 48,
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            fontFamily: "var(--font-gilroy)",
                            cursor: "pointer",
                          }}
                        >
                          Browse All Looks
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Standard matching (view similar or no room detected) */}
                  {renderSection(
                    "High Match",
                    `${matchedLooks.high.length} looks · Color, Style & Materials match`,
                    matchedLooks.high,
                    tokens.tertiaryGreen
                  )}
                  
                  {renderSection(
                    "Medium Match",
                    `${matchedLooks.medium.length} looks · 2 attributes match`,
                    matchedLooks.medium,
                    tokens.tertiaryYellow
                  )}
                  
                  {renderSection(
                    "Low Match",
                    `${matchedLooks.low.length} looks · 1 attribute matches`,
                    matchedLooks.low,
                    tokens.onSurfaceDisabled
                  )}

                  {matchedLooks.high.length === 0 && matchedLooks.medium.length === 0 && matchedLooks.low.length === 0 && (
                    <div style={{ padding: "32px 24px 24px", color: tokens.onSurfaceSecondary }}>
                      {/* No results header */}
                      <div style={{ textAlign: "center", marginBottom: 28 }}>
                        <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
                        <div style={{ fontSize: 15, fontWeight: "var(--font-weight-semibold)", fontFamily: "var(--font-gilroy)", color: tokens.onSurfaceDefault, marginBottom: 6 }}>
                          No matching looks found
                        </div>
                        <div style={{ fontSize: 13, fontFamily: "var(--font-gilroy)", lineHeight: 1.6, color: tokens.onSurfaceSecondary }}>
                          Try a different image, or explore some of our popular looks below
                        </div>
                      </div>

                      {/* Suggested looks */}
                      {(() => {
                        return suggestedLooks.length > 0 ? (
                          <>
                            <div style={{ fontSize: 11, fontFamily: "var(--font-gilroy)", fontWeight: "var(--font-weight-semibold)", letterSpacing: "0.1em", textTransform: "uppercase", color: tokens.onSurfaceDisabled, marginBottom: 12 }}>
                              You might like
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                              {suggestedLooks.map((look: any) => renderLookCard(look))}
                            </div>
                          </>
                        ) : null;
                      })()}

                      {/* Browse all button */}
                      <div style={{ textAlign: "center" }}>
                        <button
                          onClick={() => goTo("gallery")}
                          style={{
                            background: "var(--primary)",
                            color: "var(--primary-foreground)",
                            border: "none",
                            borderRadius: "var(--radius-full)",
                            padding: "0 28px",
                            height: 48,
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            fontFamily: "var(--font-gilroy)",
                            cursor: "pointer",
                            width: "100%",
                            maxWidth: 280,
                          }}
                        >
                          Browse All Looks
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   MOODBOARD SCREEN WRAPPER
════════════════════════════════════════ */
function MoodboardScreenWrapper({ 
  selectedLook, 
  goBack, 
  showToast, 
  isDesktop,
  moodboardData,
  lookProducts 
}: { 
  selectedLook: SelectedLook; 
  goBack: () => void; 
  showToast: (msg: string) => void; 
  isDesktop: boolean;
  moodboardData: any;
  lookProducts: any[];
}) {
  // If moodboard data isn't loaded yet, show loading state
  if (!moodboardData) {
    return (
      <div style={{
        position: "fixed",
        inset: 0,
        background: "var(--card)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
      }}>
        <div style={{ 
          width: 48, 
          height: 48, 
          border: "4px solid var(--muted)", 
          borderTop: "4px solid var(--primary)", 
          borderRadius: "50%",
          animation: "spin 1s linear infinite" 
        }} />
        <div style={{
          fontFamily: "var(--font-roboto)",
          fontSize: "var(--text-sm)",
          color: "var(--muted-foreground)",
        }}>
          Loading moodboard...
        </div>
      </div>
    );
  }

  return (
    <MoodboardScreen
      lookName={selectedLook.name}
      roomName={selectedLook.room}
      styleName={selectedLook.tag}
      lookImage={selectedLook.img}
      moodboardData={moodboardData}
      products={lookProducts}
      onClose={goBack}
      onProductClick={(product) => {
        console.log("Product clicked:", product);
        showToast(`📦 ${product.name}`);
      }}
      onBookVisit={() => {
        goBack();
        showToast("📅 Booking feature coming soon!");
      }}
      onSave={() => showToast("💾 Moodboard saved!")}
      isDesktop={isDesktop}
    />
  );
}

/* ════════════════════════════════════════
   ROOT APP
════════════════════════════════════════ */
export default function App() {
  const [showWebsite, setShowWebsite] = useState(true);
  const [screen, setScreen] = useState<ScreenId>("splash");
  const [prevScreen, setPrevScreen] = useState<ScreenId>("gallery");
  const [bhkType, setBhkType] = useState("2BHK");
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [selectedLook, setSelectedLook] = useState<SelectedLook | null>(null);
  const [moodboardData, setMoodboardData] = useState<any>(null);
  const [lookProducts, setLookProducts] = useState<any[]>([]);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const [orders, setOrders] = useState<Order[]>(() => {
    try { const s = localStorage.getItem("lvs_orders"); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });
  const [lastOrderId, setLastOrderId] = useState<string>("");

  // Image Match Modal state
  const [showImageMatchModal, setShowImageMatchModal] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageMatchLoading, setImageMatchLoading] = useState(false);
  const [imageMatchResults, setImageMatchResults] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Look Similarity state (for "View Similar" feature)
  const [lookSimilarityData, setLookSimilarityData] = useState<any>(null);
  const [galleryInitialRoom, setGalleryInitialRoom] = useState<string | null>(null);
  const [galleryInitialBrowseRoom, setGalleryInitialBrowseRoom] = useState<string | null>(null);
  const [elevateInitialRoom, setElevateInitialRoom] = useState<string | null>(null);
  // "browse" = came from Browse All Looks (show room photo grid)
  // "design" = came from Design My Looks flow (show BHK emoji-tile grid)
  const [galleryFlow, setGalleryFlow] = useState<"browse" | "design">("browse");

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2400);
  }, []);

  /* ── Image Match from uploaded image ── */
  const analyzeUploadedImage = useCallback(async (imageUrl: string) => {
    setImageMatchLoading(true);
    try {
      const resp = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ef09e2ac/match-image`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${publicAnonKey}` },
          body: JSON.stringify({ image_url: imageUrl }),
        }
      );
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      setImageMatchResults(data);
      showToast("✨ Moodboard generated!");
    } catch (err: any) {
      console.log("Image match error:", err.message);
      showToast(`❌ ${err.message}`);
    } finally {
      setImageMatchLoading(false);
    }
  }, [showToast]);

  const handleImageUpload = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setUploadedImageUrl(base64);
      await analyzeUploadedImage(base64);
    };
    reader.readAsDataURL(file);
  }, [analyzeUploadedImage]);

  const handleImageUrlSubmit = useCallback(async (url: string) => {
    setUploadedImageUrl(url);
    await analyzeUploadedImage(url);
  }, [analyzeUploadedImage]);

  const goTo = useCallback((id: ScreenId) => {
    if (id === "splash") { setShowWebsite(true); return; }
    setPrevScreen(screen);
    setScreen(id);
  }, [screen]);

  const goBack = useCallback(() => { 
    // Clear match data when leaving matched-looks screen
    if (screen === "matched-looks") {
      setImageMatchResults(null);
      setLookSimilarityData(null);
    }
    setScreen(prevScreen); 
  }, [prevScreen, screen]);

  // Dedicated back handler for WishlistScreen — always returns to Gallery
  // regardless of prevScreen, since wishlist is only ever reachable from Gallery.
  const goBackFromWishlist = useCallback(() => {
    setScreen("gallery");
  }, []);

  const addItem = useCallback((key: string, price: number, name: string, emoji = "📦", category?: string, lookName?: string, lookRoom?: string) => {
    setCart(prev => {
      if (prev.find(i => i.key === key)) { showToast("✓ Already in cart"); return prev; }
      showToast(`✓ ${name} added to cart`);
      return [...prev, { key, price, name, emoji, category, lookName, lookRoom }];
    });
  }, [showToast]);

  const removeItem = useCallback((key: string) => {
    setCart(prev => prev.filter(i => i.key !== key));
  }, []);

  const placeOrder = useCallback((): string => {
    if (cart.length === 0) return "";
    const newOrder: Order = {
      id: generateOrderRef(),
      placedAt: Date.now(),
      items: [...cart],
      itemsTotal: cart.reduce((s, i) => s + i.price, 0),
      total: cart.reduce((s, i) => s + i.price, 0) + 4999,
      status: "consultation_scheduled",
      lookName: selectedLook?.name,
      lookRoom: selectedLook?.room?.replace("\n", " "),
    };
    setOrders(prev => {
      const updated = [newOrder, ...prev];
      try { localStorage.setItem("lvs_orders", JSON.stringify(updated)); } catch {}
      return updated;
    });
    setCart([]);
    return newOrder.id;
  }, [cart, selectedLook]);

  const toggleWishlist = useCallback((look: any) => {
    setWishlist(prev => {
      const exists = prev.find(l => l.name === look.name);
      if (exists) { showToast("Removed from wishlist"); return prev.filter(l => l.name !== look.name); }
      showToast("❤️ Saved to wishlist");
      return [...prev, look];
    });
  }, [showToast]);

  const cartTotal = cart.reduce((s, i) => s + i.price, 0);
  const cartCount = cart.length;
  const wishlistCount = wishlist.length;

  /* ── Responsive breakpoint ── */
  const [isDesktop, setIsDesktop] = useState(typeof window !== "undefined" ? window.innerWidth >= 1024 : false);
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const handleOpenElevate = useCallback((room?: string) => {
    const slug = room ? (elevateRoomTileToSlug[room] ?? null) : null;
    setElevateInitialRoom(slug);
    setShowWebsite(false);
    setScreen("elevate");
  }, []);

  const handleElevateConsultation = useCallback((design: WallDesign) => {
    const dp = design.price; // actual design price (e.g. ₹45,000)
    const gst = Math.round(dp * 0.18);
    const quoteItems = [
      { label: "Design Fee",           amount: Math.round(dp * 0.60) },
      { label: "Material & Panels",    amount: Math.round(dp * 0.25) },
      { label: "Installation Charges", amount: Math.round(dp * 0.15) },
      { label: "GST (18%)",            amount: gst },
      { label: "Site Visit (paid)",    amount: -99 },
    ];
    const totalWithGst = dp + gst - 99;
    // 4-digit OTP strings
    const consultOtp  = String(Math.floor(Math.random() * 9000) + 1000);
    const installOtp  = String(Math.floor(Math.random() * 9000) + 1000);
    // completion photos from the design gallery
    const completionPhotos = design.images ?? [design.img];
    const newOrder: Order = {
      id: generateOrderRef(),
      placedAt: Date.now(),
      items: [{ key: `elev::${design.id}`, price: 99, name: "Wall Design Consultation", emoji: "🎨", category: "consultation", lookName: design.name, lookRoom: design.room }],
      itemsTotal: 99,
      total: totalWithGst,
      status: "confirmed",
      lookName: design.name,
      lookRoom: design.room,
      designPrice: totalWithGst,
      quoteItems,
      consultOtp,
      installOtp,
      completionPhotos,
    };
    setOrders(prev => {
      const updated = [newOrder, ...prev];
      try { localStorage.setItem("lvs_orders", JSON.stringify(updated)); } catch {}
      return updated;
    });
    setLastOrderId(newOrder.id);
    goTo("success");
  }, [goTo]);

  const screens: ScreenId[] = ["splash", "property", "quiz", "dna", "gallery", "explorer", "cart", "wishlist", "success", "matched-looks", "moodboard", "orders", "elevate", "account"];

  /* ── Handle launching LookBook from website ── */
  const handleOpenLookBook = useCallback((room?: string) => {
    if (room === "design") {
      // "Design my looks" CTA — go straight to property selection (Design My Looks flow)
      setGalleryInitialBrowseRoom(null);
      setShowWebsite(false);
      setScreen("property");
    } else if (room) {
      // Room tile tapped — go directly to gallery in browse mode, pre-filtered
      const roomValue = lookbookTileToRoom[room] ?? null;
      setGalleryFlow("browse");
      setGalleryInitialBrowseRoom(roomValue);
      setShowWebsite(false);
      setScreen("gallery");
    } else {
      // "Browse All" tile or nav link — go back to website
      setGalleryInitialBrowseRoom(null);
      setShowWebsite(true);
    }
  }, []);

  return (
    <div style={{ fontFamily: "'Roboto', sans-serif", width: "100vw", height: "100dvh", background: tokens.surfaceBg, overflow: "hidden", position: "relative" }}>
      {/* ── Livspace Website Entry ── */}
      {showWebsite && (
        <div style={{ position: "absolute", inset: 0, zIndex: 200, overflowY: "auto" }}>
          <LivespaceWebsite onOpenLookBook={handleOpenLookBook} onElevate={handleOpenElevate} isDesktop={isDesktop} onAccount={() => { setShowWebsite(false); goTo("account"); }} />
        </div>
      )}
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
        @keyframes fadeSlide { from { opacity:0; transform:translateX(18px); } to { opacity:1; transform:translateX(0); } }
        @keyframes sFloat { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-7px); } }
        @keyframes hsPulse { 0%,100% { box-shadow:0 2px 10px rgba(0,0,0,0.28), 0 0 0 0 rgba(255,255,255,0.4); } 55% { box-shadow:0 2px 10px rgba(0,0,0,0.28), 0 0 0 7px rgba(255,255,255,0); } }
        @keyframes tipBounce { 0%,80%,100% { transform:translateY(0); } 40% { transform:translateY(-4px); } }
        @keyframes popIn { 0% { transform:scale(0); opacity:0; } 70% { transform:scale(1.08); } 100% { transform:scale(1); opacity:1; } }
        .phone-screen { animation: fadeSlide 0.3s ease-out; }
        .s-card-1 { animation: sFloat 5s ease-in-out infinite; }
        .s-card-2 { animation: sFloat 5s ease-in-out infinite; animation-delay: -1.7s; }
        .s-card-3 { animation: sFloat 5s ease-in-out infinite; animation-delay: -3.3s; }
        .hs-dot-anim { animation: hsPulse 2.2s ease-in-out infinite; }
        .tip-anim { animation: tipBounce 3s 2s ease-in-out infinite; }
        .success-ring-anim { animation: popIn 0.5s ease-out; }
        @keyframes shimmer { 0% { background-position:200% 0; } 100% { background-position:-200% 0; } }
        ::-webkit-scrollbar { display: none; }
        @media (min-width: 1024px) { .lb-status-bar { display: none !important; } }
      `}</style>

      {/* Toast */}
      <div style={{
        position: "fixed", top: 72, left: "50%",
        transform: `translateX(-50%) translateY(${toastVisible ? "0" : "-10px"})`,
        background: tokens.inverseDefault, color: "#F2F2F2",
        padding: "10px 18px", borderRadius: 20, fontSize: 13,
        whiteSpace: "nowrap", zIndex: 9999,
        opacity: toastVisible ? 1 : 0, transition: "all 0.25s", pointerEvents: "none",
      }}>{toastMsg}</div>

      {/* Image Match Modal */}
      {showImageMatchModal && (
        <ImageMatchModal
          onClose={() => { setShowImageMatchModal(false); }} // Just close, keep data
          onCloseAndClear={() => { setShowImageMatchModal(false); setUploadedImageUrl(""); setImageMatchResults(null); }} // Clear everything
          uploadedImageUrl={uploadedImageUrl}
          setUploadedImageUrl={setUploadedImageUrl}
          imageMatchLoading={imageMatchLoading}
          imageMatchResults={imageMatchResults}
          setImageMatchResults={setImageMatchResults}
          handleImageUpload={handleImageUpload}
          handleImageUrlSubmit={handleImageUrlSubmit}
          fileInputRef={fileInputRef}
          showToast={showToast}
          setPrevScreen={setPrevScreen}
          setScreen={setScreen}
        />
      )}

      {/* Screens */}
      {screens.map(id => (
        <div key={id} className={id === screen ? "phone-screen" : ""} style={{ position: "absolute", inset: 0, display: id === screen ? "flex" : "none", flexDirection: "column", background: tokens.surfaceBg, overflow: "hidden", zIndex: id === screen ? 1 : 0 }}>
          {id === "splash" && <SplashScreen goTo={goTo} showToast={showToast} isDesktop={isDesktop} setShowImageMatchModal={setShowImageMatchModal} setGalleryFlow={setGalleryFlow} onBackToWebsite={() => setShowWebsite(true)} />}
          {id === "property" && <PropertyScreen goTo={goTo} cartCount={cartCount} showToast={showToast} setBhkType={setBhkType} isDesktop={isDesktop} onBackToWebsite={() => setShowWebsite(true)} />}
          {id === "quiz" && <QuizScreen goTo={goTo} setQuizAnswers={setQuizAnswers} isDesktop={isDesktop} />}
          {id === "dna" && <DnaScreen goTo={goTo} quizAnswers={quizAnswers} bhkType={bhkType} isDesktop={isDesktop} setGalleryFlow={setGalleryFlow} />}
          {id === "gallery" && <GalleryScreen goTo={goTo} goBack={goBack} cartCount={cartCount} showToast={showToast} addItem={addItem} setSelectedLook={setSelectedLook} wishlist={wishlist} wishlistCount={wishlistCount} toggleWishlist={toggleWishlist} fromBrowse={galleryFlow === "browse"} bhkType={bhkType} isDesktop={isDesktop} setShowImageMatchModal={setShowImageMatchModal} initialRoom={galleryInitialRoom} initialBrowseRoom={galleryInitialBrowseRoom} quizAnswers={quizAnswers} onBackToWebsite={() => setShowWebsite(true)} ordersCount={orders.length} onOrdersClick={() => goTo("orders")} />}
          {id === "explorer" && <ExplorerScreen goTo={goTo} goBack={goBack} cartCount={cartCount} showToast={showToast} addItem={addItem} selectedLook={selectedLook} setSelectedLook={setSelectedLook} wishlist={wishlist} toggleWishlist={toggleWishlist} isDesktop={isDesktop} setLookSimilarityData={setLookSimilarityData} setPrevScreen={setPrevScreen} setScreen={setScreen} moodboardData={moodboardData} setMoodboardData={setMoodboardData} lookProducts={lookProducts} setLookProducts={setLookProducts} onPlaceOrder={() => { const id = placeOrder(); setLastOrderId(id); goTo("success"); }} />}
          {id === "cart" && <CartScreen goTo={goTo} goBack={goBack} cart={cart} cartTotal={cartTotal} removeItem={removeItem} selectedLook={selectedLook} isDesktop={isDesktop} setGalleryInitialRoom={setGalleryInitialRoom} onPlaceOrder={() => { const newId = placeOrder(); setLastOrderId(newId); goTo("success"); }} />}
          {id === "wishlist" && <WishlistScreen goTo={goTo} goBack={goBackFromWishlist} wishlist={wishlist} toggleWishlist={toggleWishlist} setSelectedLook={setSelectedLook} isDesktop={isDesktop} />}
          {id === "success" && <SuccessScreen goTo={goTo} showToast={showToast} isDesktop={isDesktop} orderId={lastOrderId} />}
          {id === "orders" && <MyOrdersScreen goTo={goTo} goBack={goBack} orders={orders} isDesktop={isDesktop} onUpdateOrder={(updated: Order) => {
            setOrders(prev => {
              const next = prev.map(o => o.id === updated.id ? updated : o);
              try { localStorage.setItem("lvs_orders", JSON.stringify(next)); } catch {}
              return next;
            });
          }} />}
          {id === "account" && <MyAccountScreen goTo={goTo} goBack={goBack} orders={orders} wishlistCount={wishlistCount} isDesktop={isDesktop} />}
          {id === "elevate" && <ElevateScreen goBack={() => setShowWebsite(true)} cartCount={cartCount} isDesktop={isDesktop} initialRoom={elevateInitialRoom} onBookConsultation={handleElevateConsultation} />}
          {id === "matched-looks" && <MatchedLooksScreen goTo={goTo} goBack={goBack} imageMatchResults={imageMatchResults} lookSimilarityData={lookSimilarityData} setSelectedLook={setSelectedLook} isDesktop={isDesktop} showToast={showToast} isActive={screen === "matched-looks"} />}
          {id === "moodboard" && selectedLook && (
            <MoodboardScreenWrapper 
              selectedLook={selectedLook}
              goBack={goBack}
              showToast={showToast}
              isDesktop={isDesktop}
              moodboardData={moodboardData}
              lookProducts={lookProducts}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Shared: Status Bar ── */
function StatusBar({ dark = false }: { dark?: boolean }) {
  return <div style={{ height: 44, flexShrink: 0 }} />;
}

/* ── Shared: Nav Bar ── */
function NavBar({ title, onBack, cartCount = 0, onCartClick }: { title: string; onBack: () => void; cartCount?: number; onCartClick?: () => void }) {
  return (
    <div style={{ height: 56, display: "flex", alignItems: "center", padding: "0 20px", gap: 14, flexShrink: 0, background: tokens.surfaceDefault, borderBottom: `1px solid ${tokens.surfaceVariant}` }}>
      <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: "50%", background: tokens.surfaceBg, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: tokens.onSurfaceDefault }}>←</button>
      <span style={{ fontSize: 16, fontWeight: 500, color: tokens.onSurfaceDefault, flex: 1 }}>{title}</span>
      {onCartClick && (
        <div style={{ position: "relative" }}>
          <button onClick={onCartClick} style={{ background: tokens.surfaceBg, border: "none", borderRadius: "50%", width: 38, height: 38, cursor: "pointer", fontSize: 16 }}>🛒</button>
          {cartCount > 0 && <CartBadge count={cartCount} />}
        </div>
      )}
    </div>
  );
}

/* ── Shared: Cart Badge ── */
function CartBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <div style={{ position: "absolute", top: -5, right: -5, width: 18, height: 18, background: tokens.primaryDefault, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "white", border: `2px solid ${tokens.surfaceDefault}` }}>{count}</div>
  );
}

/* ── Shared: Progress Strip ── */
function ProgressStrip({ pct }: { pct: number }) {
  return (
    <div style={{ height: 3, background: tokens.surfaceVariant, flexShrink: 0 }}>
      <div style={{ height: "100%", width: `${pct}%`, background: tokens.primaryDefault, borderRadius: "0 2px 2px 0", transition: "width 0.4s ease" }} />
    </div>
  );
}

/* ════════════════════════════════���═════
   SCREEN 1: SPLASH
══════════════════════════════════════ */
function SplashScreen({ goTo, showToast, isDesktop, setShowImageMatchModal, setGalleryFlow, onBackToWebsite }: { goTo: (id: ScreenId) => void; showToast: (m: string) => void; isDesktop?: boolean; setShowImageMatchModal: (show: boolean) => void; setGalleryFlow: (f: "browse" | "design") => void; onBackToWebsite?: () => void }) {
  const cardImgs = [
    "https://images.unsplash.com/photo-1765862835193-3c37388a409e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1698870157085-11632d2ddef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1737724853887-3dbcb7bdd0a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
  ];
  const cardMeta = [
    { cls: "s-card-1", style: "Modern Zen", price: "from ₹1.8L" },
    { cls: "s-card-2", style: "Warm Eclectic", price: "from ₹1.5L" },
    { cls: "s-card-3", style: "Japandi", price: "from ₹2.1L" },
  ];

  if (isDesktop) {
    return (
      <div style={{ flex: 1, display: "flex", background: "#2C2C2C", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 65% at 88% 12%, rgba(180,45,45,0.45) 0%, transparent 55%), radial-gradient(ellipse 40% 50% at 10% 80%, rgba(94,69,90,0.25) 0%, transparent 60%)" }} />
        {/* Left panel */}
        <div style={{ position: "relative", zIndex: 2, width: "45%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 48px 60px 80px" }}>
          {onBackToWebsite && (
            <button onClick={onBackToWebsite} style={{ alignSelf: "flex-start", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 20, padding: "6px 14px", fontSize: 12, color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-gilroy)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Back to Livspace.com
            </button>
          )}
          <img src={livspaceLogo} alt="Livspace" style={{ height: 28, width: "auto", objectFit: "contain", display: "block", marginBottom: 44, alignSelf: "flex-start" }} />
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 80, fontWeight: 700, color: "white", lineHeight: 1.0, marginBottom: 22 }}>
            Look<em className="font-normal" style={{ color: tokens.primaryDefault, fontStyle: "italic" }}>Book</em>
          </div>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, marginBottom: 48 }}>
            Design your dream home, room by room.<br />Shop the complete look you love.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <button onClick={() => goTo("property")} style={{ background: "var(--primary)", color: "var(--primary-foreground)", border: "none", borderRadius: 9999, padding: "0 28px", height: 48, fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", fontFamily: "var(--font-gilroy)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>✦ Design My Looks</button>
            <button onClick={() => { setGalleryFlow("browse"); goTo("gallery"); }} style={{ background: "transparent", color: "rgba(255,255,255,0.65)", border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: 99, padding: "17px 28px", fontSize: 16, fontWeight: 500, fontFamily: "'Roboto',sans-serif", cursor: "pointer" }}>Browse All Looks</button>
            <button onClick={() => setShowImageMatchModal(true)} style={{ background: "transparent", color: "rgba(255,255,255,0.65)", border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: 99, padding: "17px 28px", fontSize: 16, fontWeight: 500, fontFamily: "'Roboto',sans-serif", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>📸 Match from Image</button>
          </div>
        </div>
        {/* Right panel — staggered style cards */}
        <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 20, padding: "40px 60px 40px 20px" }}>
          {cardMeta.map((c, i) => (
            <div key={i} className={c.cls} style={{ flexShrink: 0, width: "28%", maxWidth: 230, height: "68vh", maxHeight: 480, borderRadius: 22, overflow: "hidden", position: "relative", marginTop: i === 0 ? -40 : i === 1 ? 40 : 0, boxShadow: "0 24px 64px rgba(0,0,0,0.45)" }}>
              <img src={cardImgs[i]} alt={c.style} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "48px 18px 20px", background: "linear-gradient(to top,rgba(0,0,0,0.72),transparent)" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{c.style}</div>
                <div style={{ fontSize: 15, color: tokens.extendedMustard, fontWeight: 600, marginTop: 4 }}>{c.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#111" }}>

      {/* ── Full-bleed background: 3 vertical image panels ── */}
      <div style={{ position: "absolute", inset: 0, display: "flex" }}>
        {cardImgs.map((img, i) => (
          <div key={i} style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.7) saturate(1.15)" }} />
            {i < 2 && <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 1.5, background: "rgba(255,255,255,0.12)" }} />}
          </div>
        ))}
      </div>

      {/* ── Gradient overlays ── */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.05) 38%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.82) 75%, rgba(0,0,0,0.97) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 35% at 50% 0%, rgba(220,60,65,0.22) 0%, transparent 70%)" }} />

      {/* ── Content ── */}
      <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", flexDirection: "column" }}>
        <StatusBar dark />

        {/* Logo + Title */}
        <motion.div
          style={{ padding: "20px 28px 0" }}
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
            <img src={livspaceLogo} alt="Livspace" style={{ height: 22, width: "auto", objectFit: "contain", display: "block", opacity: 0.88 }} />
            {onBackToWebsite && (
              <button onClick={onBackToWebsite} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 20, padding: "5px 12px", fontSize: 11, color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-gilroy)", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                livspace.com
              </button>
            )}
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 54, fontWeight: 700, color: "#FFF", lineHeight: 1.0, letterSpacing: "-0.5px" }}>
            Look<em style={{ color: tokens.primaryDefault, fontStyle: "italic" }}>Book</em>
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", fontWeight: 300, lineHeight: 1.7, marginTop: 12, maxWidth: 220 }}>
            Design your dream home.<br />Shop the complete look.
          </div>
        </motion.div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Style labels floating over each panel */}
        <motion.div
          style={{ display: "flex", padding: "0 0 18px" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
        >
          {cardMeta.map((c, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)", fontWeight: 700, textAlign: "center", textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>{c.style}</div>
              <div style={{ fontSize: 11, color: tokens.extendedMustard, fontWeight: 600, textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>{c.price}</div>
            </div>
          ))}
        </motion.div>

        {/* Buttons */}
        <motion.div
          style={{ padding: "0 20px 44px", display: "flex", flexDirection: "column", gap: 10 }}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            onClick={() => goTo("property")}
            style={{ width: "100%", background: "var(--primary)", color: "var(--primary-foreground)", border: "none", borderRadius: 9999, padding: "0 24px", height: 48, fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", fontFamily: "var(--font-gilroy)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >✦ Design My Looks</button>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => { setGalleryFlow("browse"); goTo("gallery"); }}
              style={{ flex: 1, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", color: "rgba(255,255,255,0.88)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 14, padding: "15px 10px", fontSize: 13, fontWeight: 500, fontFamily: "'Roboto',sans-serif", cursor: "pointer" }}
            >Browse Looks</button>
            <button
              onClick={() => setShowImageMatchModal(true)}
              style={{ flex: 1, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", color: "rgba(255,255,255,0.88)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 14, padding: "15px 10px", fontSize: 13, fontWeight: 500, fontFamily: "'Roboto',sans-serif", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}
            >📸 Match Image</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   SCREEN 2: PROPERTY
══════════════════════════════════════ */
function PropertyScreen({ goTo, cartCount, showToast, setBhkType, isDesktop, onBackToWebsite }: { goTo: (id: ScreenId) => void; cartCount: number; showToast: (m: string) => void; setBhkType: (v: string) => void; isDesktop?: boolean; onBackToWebsite?: () => void }) {
  return (
    <PropertyScreenImpl
      goTo={goTo}
      cartCount={cartCount}
      showToast={showToast}
      setBhkType={setBhkType}
      isDesktop={isDesktop}
      onBackToWebsite={onBackToWebsite}
    />
  );
}
/* ══════════════════════════════════════
   SCREEN 3: VIBE QUIZ
══════════════════════════════════════ */
function QuizScreen({ goTo, setQuizAnswers, isDesktop }: { goTo: (id: ScreenId) => void; setQuizAnswers: (v: number[]) => void; isDesktop?: boolean }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [chosen, setChosen] = useState<number | null>(null);

  const q = QUIZ_QUESTIONS[step];

  const handleChoose = (v: number) => {
    setChosen(v);
    const newAnswers = [...answers];
    newAnswers[step] = v;
    setTimeout(() => {
      setChosen(null);
      if (step < 2) {
        setAnswers(newAnswers);
        setStep(step + 1);
      } else {
        setQuizAnswers(newAnswers);
        goTo("dna");
      }
    }, 500);
  };

  const handleBack = () => {
    if (step === 0) goTo("property");
    else { setStep(step - 1); setChosen(null); }
  };

  const qLabels = ["Space", "Colour", "Material"];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: tokens.inverseDefault, overflow: "hidden" }}>
      {!isDesktop && <StatusBar dark />}

      {/* Header */}
      <div style={{ padding: isDesktop ? "20px 40px 0" : "16px 24px 0", flexShrink: 0, maxWidth: isDesktop ? 700 : "none", alignSelf: isDesktop ? "center" : "stretch", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={handleBack} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", color: "white", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>←</button>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-roboto)" }}>Style Quiz · {step + 1} of 3 — {qLabels[step]}</span>
        </div>
        {/* Progress dots */}
        <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ height: 3, borderRadius: 2, flex: 1, background: i < step ? tokens.primaryDefault : i === step ? tokens.extendedMustard : "rgba(255,255,255,0.15)", transition: "background 0.4s ease" }} />
          ))}
        </div>
        {/* Question heading */}
        <div style={{ fontFamily: "var(--font-gilroy)", fontSize: 22, color: "white", fontWeight: 600, marginTop: 16, lineHeight: 1.35, whiteSpace: "pre-line" }}>{q.heading}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4, fontFamily: "var(--font-roboto)" }}>{q.sub}</div>
      </div>

      {/* Cards grid */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: isDesktop ? "20px 40px 24px" : "16px 24px 20px", maxWidth: isDesktop ? 700 : "none", alignSelf: isDesktop ? "center" : "stretch", width: "100%", overflowY: "auto" }}>
        {q.options.map(opt => {
          const isChosen = chosen === opt.value;
          const isDimmed = chosen !== null && chosen !== opt.value;
          return (
            <div
              key={opt.value}
              onClick={() => handleChoose(opt.value)}
              style={{ height: 280, borderRadius: 20, overflow: "hidden", cursor: "pointer", position: "relative", border: `2.5px solid ${isChosen ? tokens.extendedMustard : "transparent"}`, transition: "all 0.28s cubic-bezier(0.4,0,0.2,1)", opacity: isDimmed ? 0.32 : 1, transform: isChosen ? "scale(1.03)" : isDimmed ? "scale(0.95)" : "scale(1)" }}
            >
              {/* Image, colour swatches, or split material images */}
              {opt.colors ? (
                <div style={{ width: "100%", height: "100%", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
                  {opt.colors.map((c, ci) => (
                    <div key={ci} style={{ background: c }} />
                  ))}
                </div>
              ) : opt.splitImgs ? (
                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
                    <img src={opt.splitImgs[0]} alt={opt.label + " material 1"} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>
                  <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
                    <img src={opt.splitImgs[1]} alt={opt.label + " material 2"} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>
                </div>
              ) : (
                <img src={opt.imgSrc} alt={opt.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              )}

              {/* Label overlay */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "44px 14px 14px", background: "linear-gradient(to top,rgba(0,0,0,0.78),transparent)" }}>
                <div style={{ fontFamily: "var(--font-gilroy)", fontSize: 14, color: "white", fontWeight: 600 }}>{opt.label}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginTop: 2, fontFamily: "var(--font-roboto)" }}>{opt.sub}</div>
              </div>

              {/* Tick on selection */}
              {isChosen && (
                <div style={{ position: "absolute", top: 9, right: 9, width: 22, height: 22, borderRadius: "50%", background: tokens.extendedMustard, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "white", fontWeight: 700 }}>✓</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   SCREEN 4: STYLE DNA
══════════════════════════════════════ */
function DnaScreen({ goTo, quizAnswers, bhkType, isDesktop, setGalleryFlow }: { goTo: (id: ScreenId) => void; quizAnswers: number[]; bhkType: string; isDesktop?: boolean; setGalleryFlow: (f: "browse" | "design") => void }) {
  const { primaryKey, secondaryKey, primaryPct } = computeStyleProfile(quizAnswers.length >= 3 ? quizAnswers : [1, 0, 0]);
  const profile = styleProfiles[primaryKey] ?? styleProfiles[1];
  const secondaryProfile = styleProfiles[secondaryKey] ?? styleProfiles[2];
  const [showToastLocal, setShowToast] = useState("");

  const styleMoodImages: Record<string, string[]> = {
    "Modern Zen": [
      "https://images.unsplash.com/photo-1766330977451-de1b64b5e641?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      "https://images.unsplash.com/photo-1753552502151-93914d36ecf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      "https://images.unsplash.com/photo-1762199904077-1c83cebbd205?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
    "Warm Boho": [
      "https://images.unsplash.com/photo-1709544401306-70e0a99ed34f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      "https://images.unsplash.com/photo-1762545112336-646c69e4888b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      "https://images.unsplash.com/photo-1767965171595-a643d5b0feaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
    "Scandi Nordic": [
      "https://images.unsplash.com/photo-1592990379370-f9dab5ff74c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      "https://images.unsplash.com/photo-1712242075310-1d97d8596c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      "https://images.unsplash.com/photo-1762199904077-1c83cebbd205?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
    "Coastal Fresh": [
      "https://images.unsplash.com/photo-1609644124044-94dc4301872e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      "https://images.unsplash.com/photo-1708920326697-b219695c89ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      "https://images.unsplash.com/photo-1759668559041-5925eb01cd83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
  };
  const moodImgs = styleMoodImages[profile.primary] ?? styleMoodImages["Modern Zen"];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: tokens.inverseDefault, overflow: "hidden" }}>
      {!isDesktop && <StatusBar dark />}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ padding: "16px 24px", maxWidth: isDesktop ? 760 : "none", alignSelf: isDesktop ? "center" : "stretch", width: "100%" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: tokens.primaryDefault, fontWeight: 500, fontFamily: "var(--font-roboto)" }}>✦ Your Style DNA is Ready</div>
          <div style={{ fontFamily: "var(--font-gilroy)", fontSize: 28, color: "white", fontWeight: 700, marginTop: 6, lineHeight: 1.2 }}>{profile.tagline}</div>
        </div>

        {/* Moodboard image strip */}
        <div style={{ display: "flex", gap: 6, padding: isDesktop ? "0" : "0 24px", height: isDesktop ? 220 : 152, maxWidth: isDesktop ? 760 : "none", width: isDesktop ? "calc(100% - 80px)" : "auto", margin: isDesktop ? "0 auto" : "0" }}>
          {moodImgs.map((src, i) => (
            <div key={i} style={{ flex: i === 1 ? 1.4 : 0.8, borderRadius: 14, overflow: "hidden", position: "relative" }}>
              <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.45) 100%)" }} />
              {i === 1 && (
                <div style={{ position: "absolute", bottom: 10, left: 12, right: 12 }}>
                  <div style={{ fontFamily: "var(--font-gilroy)", fontSize: 13, fontWeight: 700, color: "white", letterSpacing: "0.02em" }}>{profile.primary}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-roboto)", marginTop: 2 }}>{profile.description.split(".")[0]}.</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* DNA Card */}
        <div style={{ margin: isDesktop ? "16px auto 0" : "16px 24px 0", maxWidth: isDesktop ? 760 : "none", width: isDesktop ? "calc(100% - 80px)" : "auto", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "16px", position: "relative", overflow: "visible" }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, background: `radial-gradient(circle,${profile.accentColor} 0%,transparent 65%)`, borderRadius: "50%" }} />
          <div style={{ position: "absolute", bottom: -40, left: -20, width: 120, height: 120, background: `radial-gradient(circle,${profile.accentColor} 0%,transparent 70%)`, borderRadius: "50%" }} />
          <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: tokens.primaryDefault, fontWeight: 500, fontFamily: "var(--font-roboto)" }}>✦ STYLE PROFILE</div>
          <div style={{ fontFamily: "var(--font-gilroy)", fontSize: 24, color: "white", marginTop: 6, fontWeight: 700, lineHeight: 1.2 }}>
            {profile.primary}<br /><span style={{ color: tokens.extendedMustard, fontStyle: "italic", fontSize: 20 }}>+ {secondaryProfile.primary}</span>
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-roboto)" }}>{profile.primary}</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-roboto)" }}>{secondaryProfile.primary}</span>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.12)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${primaryPct}%`, background: `linear-gradient(to right,${tokens.primaryDefault},${tokens.extendedMustard})`, borderRadius: 3, transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "white", fontFamily: "var(--font-roboto)" }}>{primaryPct}%</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "white", fontFamily: "var(--font-roboto)" }}>{100 - primaryPct}%</span>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
            {profile.traits.slice(0, 4).map(t => (
              <span key={`primary-${t}`} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "5px 12px", fontSize: 12, color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-roboto)" }}>{t}</span>
            ))}
            {secondaryProfile.traits.slice(0, 2).map(t => (
              <span key={`secondary-${t}`} style={{ background: "rgba(255,235,194,0.10)", border: `1px solid ${tokens.extendedMustard}60`, borderRadius: 20, padding: "5px 12px", fontSize: 12, color: tokens.extendedMustard, fontFamily: "var(--font-roboto)", opacity: 0.9 }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 10, margin: isDesktop ? "16px auto 0" : "16px 24px 0", maxWidth: isDesktop ? 760 : "none", width: isDesktop ? "calc(100% - 80px)" : "auto" }}>
          {(() => {
            const roomCount = (bhkRooms[bhkType] ?? bhkRooms["2BHK"]).length;
            const estimatePerBhk: Record<string, string> = { "1BHK": "₹3.5L", "2BHK": "₹8.5L", "3BHK": "₹12L", "4BHK": "₹18L" };
            const estimate = estimatePerBhk[bhkType] ?? "₹8.5L";
            return [
              { num: String(roomCount), lbl: "Rooms to design", icon: "🛋️", small: false },
              { num: String(profile.looksCount), lbl: `${profile.primary} looks`, icon: "✦", small: false },
              { num: estimate, lbl: "Full-home estimate", icon: "💰", small: true },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "12px" }}>
                <div style={{ fontSize: 16, marginBottom: 6, lineHeight: 1 }}>{s.icon}</div>
                <div style={{ fontSize: s.small ? 18 : 22, fontWeight: 700, color: tokens.extendedMustard, fontFamily: "var(--font-gilroy)" }}>{s.num}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 3, lineHeight: 1.4, fontFamily: "var(--font-roboto)" }}>{s.lbl}</div>
              </div>
            ));
          })()}
        </div>

        <div style={{ padding: isDesktop ? "20px 40px 40px" : "20px 24px 40px", maxWidth: isDesktop ? 760 : "none", alignSelf: isDesktop ? "center" : "stretch", width: "100%" }}>
          <button onClick={() => { setGalleryFlow("design"); goTo("gallery"); }} style={{ width: "100%", background: "var(--primary)", color: "var(--primary-foreground)", border: "none", borderRadius: 9999, padding: "0 24px", height: 48, fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", fontFamily: "var(--font-gilroy)", cursor: "pointer" }}>✦ Explore My {profile.primary} LookBook →</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   SCREEN 5: GALLERY
══════════════════════════════════════ */
function GalleryScreen({ goTo, goBack, cartCount, showToast, addItem, setSelectedLook, wishlist, wishlistCount, toggleWishlist, fromBrowse, bhkType, isDesktop, setShowImageMatchModal, initialRoom, initialBrowseRoom, quizAnswers, onBackToWebsite, ordersCount, onOrdersClick }: { goTo: (id: ScreenId) => void; goBack: () => void; cartCount: number; showToast: (m: string) => void; addItem: (k: string, p: number, n: string, emoji?: string) => void; setSelectedLook: (l: SelectedLook) => void; wishlist: any[]; wishlistCount: number; toggleWishlist: (look: any) => void; fromBrowse?: boolean; bhkType: string; isDesktop?: boolean; setShowImageMatchModal: (show: boolean) => void; initialRoom?: string | null; initialBrowseRoom?: string | null; quizAnswers?: number[]; onBackToWebsite?: () => void; ordersCount?: number; onOrdersClick?: () => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [headerTop, setHeaderTop] = useState(0);
  const [seeAllSection, setSeeAllSection] = useState<"looks" | "trending" | "budget" | null>(null);

  /* ── Chip filters ── */
  const [topPicksChip, setTopPicksChip]   = useState("All");
  const [trendingChip, setTrendingChip]   = useState("All");
  const [budgetChip,   setBudgetChip]     = useState("All");

  const TOP_PICKS_CHIPS = ["All", "Grey", "Beige", "Warm", "Minimal", "Japandi", "Coastal"];
  const TRENDING_CHIPS  = ["All", "Grey", "Beige", "Warm", "Minimal", "Japandi", "Nature"];
  const BUDGET_CHIPS    = ["All", "Under ₹1L", "Under ₹1.25L", "Minimal", "Warm", "Japandi", "Beige"];

  const COLOR_TO_STYLES: Record<string, string[]> = {
    "Grey":        ["Minimal","Japandi","Modern","Scandi","Contemporary","Quiet Luxury"],
    "Beige":       ["Warm","Transitional","Natural","Boho","Earthy","Classic"],
    "Warm":        ["Warm","Bohemian","Nature","Terracotta","Forest","Rustic"],
    "Minimal":     ["Minimal","Clean","Simple","Japandi","Scandi"],
    "Japandi":     ["Japandi"],
    "Coastal":     ["Coastal","Blue","Marine","Beach"],
    "Nature":      ["Nature","Forest","Botanical","Green","Earthy"],
  };
  function filterLooks(looks: any[], chip: string, section: "looks" | "trending" | "budget"): any[] {
    if (chip === "All") return looks;
    if (section === "budget" && chip.startsWith("Under")) {
      const limit = chip === "Under ₹1L" ? 100000 : 125000;
      return looks.filter(l => {
        const num = parseInt((l.price ?? "").replace(/[^0-9]/g, ""), 10);
        return !isNaN(num) && num <= limit;
      });
    }
    const matches = COLOR_TO_STYLES[chip] ?? [chip];
    return looks.filter(l =>
      matches.some(m => (l.tag ?? "").toLowerCase().includes(m.toLowerCase()))
    );
  }
  const scrollRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const curr = el.scrollTop;
      const headerH = headerRef.current?.offsetHeight ?? 280;
      if (curr > lastScrollRef.current && curr > 50) {
        setHeaderTop(-headerH);
      } else {
        setHeaderTop(0);
      }
      lastScrollRef.current = curr;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  const [tipVisible, setTipVisible] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsgs, setChatMsgs] = useState([
    { role: "bot", text: "Hi! I'm Livy 🪴 I've analysed your Style DNA and curated 24 looks for your 2BHK. What can I help with?" },
    { role: "bot", text: 'The "Quiet Luxury" look is trending in Whitefield — 47 people added it this week! Want a budget version?' },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(initialRoom ?? "Living\nRoom");
  const chatRef = useRef<HTMLDivElement>(null);

  /* ── Sync selectedRoom when a room chip navigates here ── */
  useEffect(() => {
    if (initialRoom) {
      setSelectedRoom(initialRoom);
    }
  }, [initialRoom]);

  /* ── Live looks fetch ── */
  type LookSection = { looks: any[]; trending: any[]; budget: any[] };
  const [fetchedSections, setFetchedSections] = useState<LookSection | null>(null);
  const [looksLoading, setLooksLoading] = useState(false);
  const balconySeedDoneRef   = useRef(false);
  const kidsRoomSeedDoneRef  = useRef(false);
  const studyRoomSeedDoneRef = useRef(false);
  const browseFetchedRef     = useRef(false);

  /* browse-mode client-side room filter (null = all rooms) */
  const [browseRoomFilter, setBrowseRoomFilter] = useState<string | null>(initialBrowseRoom ?? null);

  /* Sync browseRoomFilter when website navigates here with a pre-selected room */
  useEffect(() => {
    if (initialBrowseRoom !== undefined) {
      setBrowseRoomFilter(initialBrowseRoom);
    }
  }, [initialBrowseRoom]);

  /* ── Gallery filter state (colour, material, search query, style tag) ── */
  const [galleryColorFamily, setGalleryColorFamily] = useState("all");
  const [galleryMaterial,    setGalleryMaterial]    = useState("");
  const [gallerySearchQuery, setGallerySearchQuery] = useState("");
  const [galleryStyleTag,    setGalleryStyleTag]    = useState("");

  /* ── New: price range, multiple colors, multiple themes ── */
  const [galleryPriceRange, setGalleryPriceRange] = useState<[number, number]>([0, 10000000]);
  const [gallerySelectedColors, setGallerySelectedColors] = useState<string[]>([]);
  const [gallerySelectedThemes, setGallerySelectedThemes] = useState<string[]>([]);
  const [galleryColorScheme, setGalleryColorScheme] = useState<string[]>([]);
  const [galleryLayout,      setGalleryLayout]      = useState<string[]>([]);
  const [galleryBudgetTier,  setGalleryBudgetTier]  = useState<string>("");

  /* ── Gemini moodboard data for palette + material filtering ── */
  const [mbData, setMbData] = useState<Record<string, { palette: string[]; materials: string[]; mood_words: string[] }>>({});
  const [mbLoaded, setMbLoaded] = useState(false);

  useEffect(() => {
    if (mbLoaded || !fetchedSections) return; // wait until looks are loaded
    (async () => {
      try {
        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-ef09e2ac/moodboard-materials`,
          { headers: { Authorization: `Bearer ${publicAnonKey}` } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
        const data = await res.json();
        setMbData(data);
        setMbLoaded(true);
        console.log(`[Gallery] Gemini data loaded for ${Object.keys(data).length} looks`);
      } catch (err) {
        console.log("[Gallery] Gemini data load error (colour filters inactive):", err);
        setMbLoaded(true); // don't keep retrying
      }
    })();
  }, [mbLoaded, fetchedSections]);

  useEffect(() => {
    /* ── Browse All Looks: fetch every look once, no room filter ── */
    if (fromBrowse) {
      if (browseFetchedRef.current) return;
      browseFetchedRef.current = true;
      setLooksLoading(true);
      setFetchedSections(null);
      (async () => {
        try {
          const { data: looks, error: looksErr } = await supabase
            .from("lb_looks")
            .select("id, name, image_url, price, is_top_pick, is_trending, is_under_budget, style:lb_styles(name), room:lb_rooms(slug)");
          if (looksErr) throw new Error(`Browse looks fetch: ${looksErr.message}`);
          const lookList = looks ?? [];
          console.log(`[Gallery/browse] all rooms →`, lookList.length, "looks");
          const lookIds = lookList.map((l: any) => l.id);
          const { data: lps } = lookIds.length
            ? await supabase.from("lb_look_products").select("look_id").in("look_id", lookIds)
            : { data: [] };
          const countMap = (lps ?? []).reduce((acc: Record<string, number>, row: any) => {
            acc[row.look_id] = (acc[row.look_id] || 0) + 1; return acc;
          }, {});
          const toUi = (l: any, section: string, idx: number) => ({
            id:       l.id,
            img:      l.image_url,
            tag:      (l.style as any)?.name ?? "",
            name:     l.name,
            price:    `₹${(l.price ?? 0).toLocaleString("en-IN")}`,
            priceNum: l.price ?? 0,
            items:    `${countMap[l.id] ?? 0} items`,
            roomSlug: (l.room as any)?.slug ?? "",
            featured: section === "looks" && l.is_top_pick,
            badge:
              section === "looks" && l.is_top_pick ? { text: "★ TOP PICK", cls: "gold" } :
              section === "trending" && idx === 0   ? { text: "🔥 HOT",     cls: "red"  } :
              undefined,
          });
          const topPicks = lookList.filter((l: any) => !l.is_trending && !l.is_under_budget);
          const trending  = lookList.filter((l: any) =>  l.is_trending);
          const budget    = lookList.filter((l: any) =>  l.is_under_budget && !l.is_trending);
          setFetchedSections({
            looks:    topPicks.map((l: any, i: number) => toUi(l, "looks",    i)),
            trending: trending .map((l: any, i: number) => toUi(l, "trending", i)),
            budget:   budget   .map((l: any, i: number) => toUi(l, "budget",   i)),
          });
        } catch (err: any) {
          console.log("Gallery browse fetch error:", err);
          setFetchedSections({ looks: [], trending: [], budget: [] });
        } finally {
          setLooksLoading(false);
        }
      })();
      return;
    }

    /* ── Design My Looks: fetch per selected room ── */
    const slug = roomToSlug[selectedRoom];
    if (!slug) { setFetchedSections({ looks: [], trending: [], budget: [] }); return; }
    setLooksLoading(true);
    setFetchedSections(null);
    setTopPicksChip("All");
    setTrendingChip("All");
    setBudgetChip("All");

    (async () => {
      try {
        /* 0 — seed room data on first visit (must complete before fetch) */
        const seedMap: Record<string, { ref: React.MutableRefObject<boolean>; endpoint: string }> = {
          "balcony":    { ref: balconySeedDoneRef,   endpoint: "seed-balcony"    },
          "kids-room":  { ref: kidsRoomSeedDoneRef,  endpoint: "seed-kids-room"  },
          "study-room": { ref: studyRoomSeedDoneRef, endpoint: "seed-study-room" },
        };
        const seedEntry = seedMap[slug];
        if (seedEntry && !seedEntry.ref.current) {
          seedEntry.ref.current = true;
          try {
            const seedResp = await fetch(
              `https://${projectId}.supabase.co/functions/v1/make-server-ef09e2ac/${seedEntry.endpoint}`,
              { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${publicAnonKey}` } }
            );
            const seedData = await seedResp.json();
            console.log(`[${seedEntry.endpoint}] result:`, seedData);
          } catch (seedErr: any) {
            console.log(`[${seedEntry.endpoint}] seed error (non-fatal):`, seedErr.message);
          }
        }

        /* 1 — resolve room slug → id */
        const { data: room, error: roomErr } = await supabase
          .from("lb_rooms").select("id").eq("slug", slug).maybeSingle();
        if (roomErr) throw new Error(`Room lookup: ${roomErr.message}`);
        if (!room) { setFetchedSections({ looks: [], trending: [], budget: [] }); return; }

        /* 2 — fetch looks with style join */
        const { data: looks, error: looksErr } = await supabase
          .from("lb_looks")
          .select("id, name, image_url, price, is_top_pick, is_trending, is_under_budget, style:lb_styles(name)")
          .eq("room_id", room.id);
        if (looksErr) throw new Error(`Looks fetch: ${looksErr.message}`);

        const lookList = looks ?? [];
        console.log(`[Gallery] room=${slug} →`, lookList.length, "looks");

        /* 3 — count hotspot products per look */
        const lookIds = lookList.map((l: any) => l.id);
        const { data: lps } = lookIds.length
          ? await supabase.from("lb_look_products").select("look_id").in("look_id", lookIds)
          : { data: [] };
        const countMap = (lps ?? []).reduce((acc: Record<string, number>, row: any) => {
          acc[row.look_id] = (acc[row.look_id] || 0) + 1; return acc;
        }, {});

        /* 4 — shape into UI objects */
        const toUi = (l: any, section: string, idx: number) => ({
          id:       l.id,
          img:      l.image_url,
          tag:      (l.style as any)?.name ?? "",
          name:     l.name,
          price:    `₹${(l.price ?? 0).toLocaleString("en-IN")}`,
          priceNum: l.price ?? 0,
          items:    `${countMap[l.id] ?? 0} items`,
          featured: section === "looks" && l.is_top_pick,
          badge:
            section === "looks" && l.is_top_pick ? { text: "★ TOP PICK", cls: "gold" } :
            section === "trending" && idx === 0   ? { text: "🔥 HOT",     cls: "red"  } :
            undefined,
        });
        const topPicks = lookList.filter((l: any) => !l.is_trending && !l.is_under_budget);
        const trending  = lookList.filter((l: any) =>  l.is_trending);
        const budget    = lookList.filter((l: any) =>  l.is_under_budget && !l.is_trending);
        setFetchedSections({
          looks:    topPicks.map((l: any, i: number) => toUi(l, "looks",    i)),
          trending: trending .map((l: any, i: number) => toUi(l, "trending", i)),
          budget:   budget   .map((l: any, i: number) => toUi(l, "budget",   i)),
        });
      } catch (err: any) {
        console.log("Gallery fetch error:", err);
        setFetchedSections({ looks: [], trending: [], budget: [] });
      } finally {
        setLooksLoading(false);
      }
    })();
  }, [selectedRoom, fromBrowse]);

  const tabs = ["🛋️ Living Room", "🛏️ Master Bed", "🍳 Kitchen", "🧸 Kids Room", "🌿 Balcony"];

  const replies: Record<string, string> = {
    "Show budget version": "Found a budget 'Quiet Luxury' at ₹1.42L — swapping the sofa for a Nordic 3-seater and using glass coffee table. Want me to load it?",
    "Make it warmer": "Done! Switching the grey sofa to warm beige linen, adding amber lighting and a jute rug. Total stays at ₹2.1L ✨",
    "Under ₹1.5L": "Found 3 looks matching your DNA under ₹1.5L: 'Simply Chic' (₹1.24L), 'Soft Minimal' (₹1.38L), 'Forest Breath' (₹1.38L). Want me to show them?",
    "Mix looks": "Love it! The sofa from 'Quiet Luxury' + rug from 'Desert Bloom' pair beautifully. Want me to build a custom look from your favourites?",
  };

  const sendMsg = (msg: string) => {
    setChatMsgs(prev => [...prev, { role: "user", text: msg }]);
    setTimeout(() => {
      setChatMsgs(prev => [...prev, { role: "bot", text: replies[msg] || "Let me find the best options for you… 🔍" }]);
    }, 700);
  };

  const sendFromInput = () => {
    if (!chatInput.trim()) return;
    setChatMsgs(prev => [...prev, { role: "user", text: chatInput }]);
    setChatInput("");
    setTimeout(() => {
      setChatMsgs(prev => [...prev, { role: "bot", text: "Let me search our catalogue for the best match for your Modern Zen DNA… 🪴" }]);
    }, 700);
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatMsgs]);

  /* fetchedSections drives all three look rows */
  const roomSections = fetchedSections ?? { looks: [], trending: [], budget: [] };

  /* ── Style-matched masonry: merge all looks, sort by quiz-derived style ── */
  const { primaryKey: galleryPrimaryKey, secondaryKey: gallerySecondaryKey } = computeStyleProfile(
    (quizAnswers ?? []).length >= 3 ? (quizAnswers ?? []) : [1, 0, 0]
  );
  const galleryProfile = styleProfiles[galleryPrimaryKey] ?? styleProfiles[1];
  const gallerySecondaryProfile = styleProfiles[gallerySecondaryKey] ?? styleProfiles[2];

  const allLooks = (() => {
    const seen = new Set<string>();
    const merged: any[] = [];
    [...roomSections.looks, ...roomSections.trending, ...roomSections.budget].forEach(l => {
      const key = l.id ?? l.name;
      if (!seen.has(key)) { seen.add(key); merged.push(l); }
    });
    // In browse mode: optionally filter by selected room tile (client-side), no DNA sort
    if (fromBrowse) {
      if (!browseRoomFilter) return merged;
      const filterSlug = roomToSlug[browseRoomFilter] ?? "";
      return merged.filter(l => !filterSlug || (l.roomSlug ?? "") === filterSlug);
    }
    // Design mode: Sort by primary style match → secondary → rest
    return merged.sort((a, b) => {
      const scoreA =
        a.tag === galleryProfile.primary ? 2 :
        a.tag === gallerySecondaryProfile.primary ? 1 : 0;
      const scoreB =
        b.tag === galleryProfile.primary ? 2 :
        b.tag === gallerySecondaryProfile.primary ? 1 : 0;
      return scoreB - scoreA;
    });
  })();

  /* ── Gemini-derived filter options ── */
  const paletteSwatches = React.useMemo(() => computePaletteSwatches(mbData), [mbData]);
  const topMaterials    = React.useMemo(() => computeTopMaterials(mbData, 6), [mbData]);

  /* ── Style-tag chips (derived from loaded looks — no Gemini needed, always available) ── */
  const topStyleTags = React.useMemo(() => {
    const seen = new Set<string>();
    const tags: string[] = [];
    for (const l of allLooks) {
      const t = (l.tag ?? "").trim();
      if (t && !seen.has(t)) { seen.add(t); tags.push(t); }
      if (tags.length >= 8) break;
    }
    return tags;
  }, [allLooks]);

  /* ── Enrich allLooks with Gemini palette/materials then apply filters ── */
  const filteredAllLooks = React.useMemo(() => {
    let pool = allLooks.map(l => ({
      ...l,
      palette:   (mbData[l.id]?.palette   ?? []) as string[],
      materials: (mbData[l.id]?.materials ?? []) as string[],
      moodWords: (mbData[l.id]?.mood_words ?? []) as string[],
    }));

    // Price range filter (only apply if range is not default max)
    const [minPrice, maxPrice] = galleryPriceRange;
    if (minPrice > 0 || maxPrice < 10000000) {
      pool = pool.filter(l => {
        const price = l.priceNum ?? 0;
        return price >= minPrice && price <= maxPrice;
      });
    }

    // Multiple color selection filter (match ANY of the selected colors)
    if (gallerySelectedColors.length > 0) {
      pool = pool.filter(l =>
        l.palette.some((hex: string) => 
          gallerySelectedColors.includes(getColorFamily(hex))
        )
      );
    }

    // Legacy single color filter (keep for backward compatibility)
    if (galleryColorFamily !== "all") {
      pool = pool.filter(l =>
        l.palette.some((hex: string) => getColorFamily(hex) === galleryColorFamily)
      );
    }

    // Material filter
    if (galleryMaterial.trim() !== "") {
      const matQ = galleryMaterial.toLowerCase();
      pool = pool.filter(l =>
        l.materials.some((m: string) => m.toLowerCase().includes(matQ))
      );
    }

    // Multiple theme selection filter (match ANY of the selected themes)
    if (gallerySelectedThemes.length > 0) {
      pool = pool.filter(l => 
        gallerySelectedThemes.some(theme => 
          (l.tag ?? "").toLowerCase() === theme.toLowerCase()
        )
      );
    }

    // Legacy single style-tag filter (keep for backward compatibility)
    if (galleryStyleTag.trim() !== "") {
      pool = pool.filter(l => (l.tag ?? "").toLowerCase() === galleryStyleTag.toLowerCase());
    }

    // Color scheme filter (maps to color families from Gemini palette)
    if (galleryColorScheme.length > 0) {
      pool = pool.filter(l => {
        const families = (l.palette ?? []).map((hex: string) => getColorFamily(hex));
        return galleryColorScheme.some(scheme => {
          const mapped = COLOR_SCHEME_FAMILIES[scheme] ?? [];
          if (mapped.length === 0) return true; // Two-Tone: pass through
          return mapped.some(f => families.includes(f));
        });
      });
    }

    // Layout filter (text-match on name and tag)
    if (galleryLayout.length > 0) {
      pool = pool.filter(l => {
        const haystack = `${l.name ?? ""} ${l.tag ?? ""}`.toLowerCase();
        return galleryLayout.some(lay => haystack.includes(lay.toLowerCase()));
      });
    }

    // Text search filter (name, tag, room slug, materials, mood words)
    if (gallerySearchQuery.trim() !== "") {
      const tokens = gallerySearchQuery.toLowerCase().split(/\s+/).filter(w => w.length >= 2);
      pool = pool.filter(l => {
        const haystack = [
          l.name ?? "", l.tag ?? "", l.room ?? "", l.roomSlug ?? "",
          ...l.materials, ...l.moodWords,
        ].join(" ").toLowerCase();
        return tokens.every(t => haystack.includes(t));
      });
    }

    return pool;
  }, [allLooks, mbData, galleryColorFamily, galleryMaterial, gallerySearchQuery, galleryStyleTag, galleryPriceRange, gallerySelectedColors, gallerySelectedThemes, galleryColorScheme, galleryLayout]);

  const clearAllFilters = React.useCallback(() => {
    setGalleryColorFamily("all");
    setGalleryMaterial("");
    setGallerySearchQuery("");
    setGalleryStyleTag("");
    setGalleryPriceRange([0, 10000000]);
    setGallerySelectedColors([]);
    setGallerySelectedThemes([]);
    setGalleryColorScheme([]);
    setGalleryLayout([]);
    setGalleryBudgetTier("");
  }, []);

  const onBudgetTier = React.useCallback((label: string) => {
    if (galleryBudgetTier === label) {
      setGalleryBudgetTier("");
      setGalleryPriceRange([0, 10000000]);
    } else {
      const tier = BUDGET_TIERS.find(t => t.label === label);
      if (tier) { setGalleryBudgetTier(label); setGalleryPriceRange(tier.range); }
    }
  }, [galleryBudgetTier]);

  /* ── kept temporarily so TypeScript doesn't complain on unused vars below ── */
  const roomData_UNUSED: Record<string, { looks: any[]; trending: any[]; budget: any[] }> = {
    "Living\nRoom": {
      looks: [
        { img: "https://images.unsplash.com/photo-1765862835282-cd3d9190d246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB6ZW4lMjBsaXZpbmclMjByb29tJTIwcXVpZXQlMjBsdXh1cnklMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzE4MjU1Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080", badge: { text: "★ TOP PICK", cls: "gold" }, tag: "Modern Zen", name: "Quiet Luxury", price: "₹2,14,000", items: "14 items", featured: true },
        { img: "https://images.unsplash.com/photo-1752643719588-66f0f6fb3086?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJtJTIwYm9obyUyMGRlc2VydCUyMGxpdmluZyUyMHJvb20lMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3NzE4MjU1Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080", tag: "Warm Boho", name: "Desert Bloom", price: "₹1,76,000", items: "11 items" },
        { img: "https://images.unsplash.com/photo-1764445274424-47bbc216073b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmRpJTIwd2FiaSUyMHNhYmklMjBtaW5pbWFsaXN0JTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3NzE4MjU1Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080", tag: "Japandi", name: "Wabi Sabi", price: "₹1,95,000", items: "12 items" },
      ],
      trending: [
        { img: "https://images.unsplash.com/photo-1766007062051-94250e5be2d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2FzdGFsJTIwYmx1ZSUyMGxpdmluZyUyMHJvb20lMjBpbnRlcmlvciUyMGRlY29yfGVufDF8fHx8MTc3MTgyNTUyOHww&ixlib=rb-4.1.0&q=80&w=1080", badge: { text: "🔥 HOT", cls: "red" }, tag: "Coastal", name: "Blue Lagoon", price: "₹1,88,000", items: "13 items" },
        { img: "https://images.unsplash.com/photo-1606202598125-e2077bb5ebcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBncmVlbiUyMGZvcmVzdCUyMGluc3BpcmVkJTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3NzE4MjU1Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080", tag: "Nature", name: "Forest Breath", price: "₹1,38,000", items: "10 items" },
      ],
      budget: [
        { img: "https://images.unsplash.com/photo-1762803842055-de1e5fb14477?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwY2hpYyUyMHdoaXRlJTIwbGl2aW5nJTIwcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc3MTgyNTUyOXww&ixlib=rb-4.1.0&q=80&w=1080", tag: "Minimal", name: "Simply Chic", price: "₹1,24,000", items: "9 items" },
      ],
    },
    "Bedroom": {
      looks: [
        { img: "https://images.unsplash.com/photo-1765862835326-14b5070fdde9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB6ZW4lMjBsdXh1cnklMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcxODI2MDA5fDA&ixlib=rb-4.1.0&q=80&w=1080", badge: { text: "★ TOP PICK", cls: "gold" }, tag: "Modern Zen", name: "Serene Slumber", price: "₹1,92,000", items: "12 items", featured: true },
        { img: "https://images.unsplash.com/photo-1648634158203-199accfd7afc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJtJTIwYm9obyUyMGJlZHJvb20lMjBkZWNvciUyMGRlc2lnbnxlbnwxfHx8fDE3NzE4MjYwMDl8MA&ixlib=rb-4.1.0&q=80&w=1080", tag: "Warm Boho", name: "Dream Weaver", price: "₹1,58,000", items: "10 items" },
        { img: "https://images.unsplash.com/photo-1766733041960-0de62f403e7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmRpJTIwbWluaW1hbGlzdCUyMGJlZHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzE4MjYwMDl8MA&ixlib=rb-4.1.0&q=80&w=1080", tag: "Japandi", name: "Still Waters", price: "₹1,74,000", items: "11 items" },
      ],
      trending: [
        { img: "https://images.unsplash.com/photo-1603072388139-565853396b38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2FzdGFsJTIwYmx1ZSUyMGJlZHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzE4MjYwMTB8MA&ixlib=rb-4.1.0&q=80&w=1080", badge: { text: "🔥 HOT", cls: "red" }, tag: "Coastal", name: "Ocean Lullaby", price: "₹1,65,000", items: "11 items" },
        { img: "https://images.unsplash.com/photo-1632830025328-cce71800b9ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBncmVlbiUyMGx1c2glMjBiZWRyb29tJTIwZGVjb3J8ZW58MXx8fHwxNzcxODI2MDEwfDA&ixlib=rb-4.1.0&q=80&w=1080", tag: "Nature", name: "Green Canopy", price: "₹1,22,000", items: "9 items" },
      ],
      budget: [
        { img: "https://images.unsplash.com/photo-1549388604-817d15aa0110?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwY2hpYyUyMHNpbXBsZSUyMGJlZHJvb20lMjB3aGl0ZXxlbnwxfHx8fDE3NzE4MjYwMTF8MA&ixlib=rb-4.1.0&q=80&w=1080", tag: "Minimal", name: "Pure Rest", price: "₹1,08,000", items: "8 items" },
      ],
    },
    "Bath": {
      looks: [
        { img: "https://images.unsplash.com/photo-1763485957127-5645e9348426?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBiYXRocm9vbSUyMGludGVyaW9yJTIwZGVzaWdufGVufDF8fHx8MTc3MTgyNjAxMXww&ixlib=rb-4.1.0&q=80&w=1080", badge: { text: "★ TOP PICK", cls: "gold" }, tag: "Luxury Spa", name: "Marble Sanctuary", price: "₹1,68,000", items: "10 items", featured: true },
        { img: "https://images.unsplash.com/photo-1701278301488-b550984729c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJtJTIwYm9obyUyMGVhcnRoeSUyMGJhdGhyb29tJTIwZGVjb3J8ZW58MXx8fHwxNzcxODI2MDExfDA&ixlib=rb-4.1.0&q=80&w=1080", tag: "Warm Boho", name: "Earthy Escape", price: "₹1,34,000", items: "9 items" },
        { img: "https://images.unsplash.com/photo-1637563523538-fbcd5b9d1eac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmRpJTIwd2FiaSUyMHNhYmklMjBiYXRocm9vbSUyMHNwYXxlbnwxfHx8fDE3NzE4MjYwMTR8MA&ixlib=rb-4.1.0&q=80&w=1080", tag: "Japandi", name: "Onsen Ritual", price: "₹1,52,000", items: "10 items" },
      ],
      trending: [
        { img: "https://images.unsplash.com/photo-1609946860441-a51ffcf22208?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2FzdGFsJTIwYmx1ZSUyMHdoaXRlJTIwYmF0aHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzE4MjYwMTV8MA&ixlib=rb-4.1.0&q=80&w=1080", badge: { text: "🔥 HOT", cls: "red" }, tag: "Coastal", name: "Shore Wash", price: "₹1,45,000", items: "8 items" },
        { img: "https://images.unsplash.com/photo-1694470611715-a6708f23445f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBpbnNwaXJlZCUyMHN0b25lJTIwYmF0aHJvb20lMjBncmVlbnxlbnwxfHx8fDE3NzE4MjYwMTN8MA&ixlib=rb-4.1.0&q=80&w=1080", tag: "Nature", name: "Stone & Moss", price: "₹1,18,000", items: "7 items" },
      ],
      budget: [
        { img: "https://images.unsplash.com/photo-1628746234554-3bb28b7dfd17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwY2xlYW4lMjB3aGl0ZSUyMGJhdGhyb29tJTIwc2ltcGxlfGVufDF8fHx8MTc3MTgyNjAxNHww&ixlib=rb-4.1.0&q=80&w=1080", tag: "Minimal", name: "Clean Slate", price: "₹92,000", items: "7 items" },
      ],
    },
    "Kitchen": {
      looks: [
        { img: "https://images.unsplash.com/photo-1673687783123-c06a6f70a0d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB6ZW4lMjBsdXh1cnklMjBraXRjaGVuJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcxODI2MDEzfDA&ixlib=rb-4.1.0&q=80&w=1080", badge: { text: "★ TOP PICK", cls: "gold" }, tag: "Modern Zen", name: "Chef's Canvas", price: "₹2,42,000", items: "16 items", featured: true },
        { img: "https://images.unsplash.com/photo-1696454598100-0162fb17d163?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJtJTIwd29vZGVuJTIwYm9obyUyMGtpdGNoZW4lMjBkZWNvcnxlbnwxfHx8fDE3NzE4MjYwMTR8MA&ixlib=rb-4.1.0&q=80&w=1080", tag: "Warm Wood", name: "Harvest Table", price: "₹1,98,000", items: "13 items" },
        { img: "https://images.unsplash.com/photo-1632334994174-d505252a397e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmRpJTIwbWluaW1hbCUyMGtpdGNoZW4lMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3NzE4MjYwMTR8MA&ixlib=rb-4.1.0&q=80&w=1080", tag: "Japandi", name: "Umami Space", price: "₹1,86,000", items: "12 items" },
      ],
      trending: [
        { img: "https://images.unsplash.com/photo-1748752869836-50690850248a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2FzdGFsJTIwYmx1ZSUyMHdoaXRlJTIwa2l0Y2hlbiUyMGludGVyaW9yfGVufDF8fHx8MTc3MTgyNjAxNXww&ixlib=rb-4.1.0&q=80&w=1080", badge: { text: "🔥 HOT", cls: "red" }, tag: "Coastal", name: "Aqua Kitchen", price: "₹1,72,000", items: "12 items" },
        { img: "https://images.unsplash.com/photo-1758565810940-77769e15b957?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcGVuJTIwZ3JlZW4lMjBuYXR1cmUlMjBraXRjaGVuJTIwbW9kZXJufGVufDF8fHx8MTc3MTgyNjAxNXww&ixlib=rb-4.1.0&q=80&w=1080", tag: "Nature", name: "Garden Kitchen", price: "₹1,44,000", items: "10 items" },
      ],
      budget: [
        { img: "https://images.unsplash.com/photo-1546771292-1750288b0f8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwd2hpdGUlMjBzaW1wbGUlMjBraXRjaGVuJTIwYnVkZ2V0fGVufDF8fHx8MTc3MTgyNjAxNXww&ixlib=rb-4.1.0&q=80&w=1080", tag: "Minimal", name: "Clean Cook", price: "₹1,14,000", items: "8 items" },
      ],
    },
  };
  void roomData_UNUSED;

  /* ── Desktop Gallery Layout ── */
  if (isDesktop) {
    const desktopRoomTiles = [
      { label: "Living Room", value: "Living\nRoom", img: "https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { label: "Kitchen", value: "Kitchen", img: "https://images.unsplash.com/photo-1668026694348-b73c5eb5e299?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { label: "Bedroom", value: "Bedroom", img: "https://images.unsplash.com/photo-1616418928117-4e6d19be2df1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { label: "Kid's Room", value: "Kids Room", img: "https://images.unsplash.com/photo-1572025442367-756c1e7887a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { label: "Balcony", value: "Balcony", img: "https://images.unsplash.com/photo-1763741226296-708d30dbfe0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { label: "Study Room", value: "Study Room", img: "https://images.unsplash.com/photo-1751200065697-4461cc2b43cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ];
    const DesktopLookCard = ({ l, idx }: { l: any; idx: number }) => {
      const isWishlisted = wishlist?.some(w => w.name === l.name) ?? false;
      return (
        <div onClick={() => { setSelectedLook({ ...l, room: selectedRoom }); goTo("explorer"); }} style={{ background: tokens.surfaceDefault, borderRadius: 18, overflow: "hidden", cursor: "pointer", border: `1.5px solid ${l.featured ? tokens.extendedMustard : tokens.surfaceVariant}`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", transition: "transform 0.18s, box-shadow 0.18s" }}>
          <div style={{ width: "100%", height: 200, position: "relative", overflow: "hidden" }}>
            {l.img ? <img src={l.img} alt={l.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#E8D8C4,#D4C0A8)" }} />}
            {l.badge && <div style={{ position: "absolute", top: 10, left: 10, padding: "4px 9px", borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", background: l.badge.cls === "gold" ? tokens.extendedMustard : tokens.primaryDefault, color: l.badge.cls === "gold" ? tokens.onSurfaceDefault : "white" }}>{l.badge.text}</div>}
            <button onClick={e => { e.stopPropagation(); toggleWishlist(l); }} style={{ position: "absolute", top: 8, right: 8, width: 32, height: 32, background: isWishlisted ? tokens.primaryDefault : "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>{isWishlisted ? "❤️" : "🤍"}</button>
          </div>
          <div style={{ padding: "14px 16px 16px" }}>
            <span style={{ display: "inline-block", background: tokens.surfaceBg, borderRadius: 5, padding: "3px 8px", fontSize: 9, fontWeight: 600, color: tokens.onSurfaceSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>{l.tag}</span>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600, color: tokens.onSurfaceDefault, marginTop: 6 }}>{l.name}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: tokens.onSurfaceDefault }}>{l.price}</span>
              <span style={{ fontSize: 12, color: tokens.onSurfaceSecondary }}>{l.items}</span>
            </div>
            <button style={{ width: "100%", marginTop: 12, background: tokens.onSurfaceDefault, color: "white", border: "none", borderRadius: 10, padding: "11px 0", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Explore Look</button>
          </div>
        </div>
      );
    };
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: tokens.surfaceBg, overflow: "hidden" }}>
        {/* Desktop header */}
        <div style={{ background: "#FFFFFF", borderBottom: "1px solid #EBEBEB", borderTop: "none", borderLeft: "none", borderRight: "none", padding: "16px 40px", display: "flex", alignItems: "center", gap: "16px", flexShrink: 0, boxShadow: "none", outline: "none" }}>
          <button onClick={() => goTo("splash")} style={{ width: 40, height: 40, background: "#F5F5F5", border: "none", borderRadius: "50%", cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", color: "#1A1A1A" }}>←</button>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 600, color: "#1A1A1A" }}>Your LookBook</div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Desktop Search Bar */}
            <button
              onClick={() => setShowSearch(true)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "#F5F5F5", border: "1.5px solid #E0E0E0",
                borderRadius: 50, padding: "10px 18px", cursor: "pointer",
                fontSize: 13, color: "#888888", fontFamily: "'Roboto',sans-serif",
                fontWeight: 400, minWidth: 220,
              }}
            >
              <span style={{ fontSize: 15 }}>🔍</span>
              <span>Search looks, styles, rooms…</span>
            </button>
            <div style={{ position: "relative" }}>
              <button onClick={() => goTo("wishlist")} style={{ width: 42, height: 42, background: "#F5F5F5", border: "none", borderRadius: "50%", cursor: "pointer", fontSize: 18 }}>{wishlistCount > 0 ? "❤️" : "🤍"}</button>
              {wishlistCount > 0 && <div style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, background: "#6B4FA0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "white" }}>{wishlistCount}</div>}
            </div>
            <div style={{ position: "relative" }}>
              <button onClick={() => goTo("cart")} style={{ width: 42, height: 42, background: "#F5F5F5", border: "none", borderRadius: "50%", cursor: "pointer", fontSize: 18 }}>🛒</button>
              <CartBadge count={cartCount} />
            </div>
            <div style={{ position: "relative" }}>
              <button onClick={onOrdersClick} title="My Orders" style={{ width: 42, height: 42, background: "#F5F5F5", border: "none", borderRadius: "50%", cursor: "pointer", fontSize: 18 }}>📦</button>
              {(ordersCount ?? 0) > 0 && <div style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, background: tokens.primaryDefault, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "white" }}>{ordersCount}</div>}
            </div>
          </div>
        </div>
        {/* Room tiles row — browse flow: photo tiles | design flow: BHK flat config chips */}
        <div style={{ background: tokens.surfaceDefault, borderBottom: `1px solid ${tokens.surfaceVariant}`, padding: "16px 40px", display: "flex", gap: 14, overflowX: "auto", flexShrink: 0, alignItems: "center" }}>
          {fromBrowse ? (
            desktopRoomTiles.map(room => {
              const sel = browseRoomFilter === room.value;
              return (
                <div key={room.value} onClick={() => { setBrowseRoomFilter(prev => prev === room.value ? null : room.value); showToast(browseRoomFilter === room.value ? "🏡 Showing all looks…" : `🏡 Showing ${room.label} looks…`); }} style={{ flexShrink: 0, width: 140, height: 90, borderRadius: 14, overflow: "hidden", position: "relative", cursor: "pointer", border: `2.5px solid ${sel ? tokens.primaryDefault : "transparent"}`, boxShadow: sel ? `0 0 0 3px ${tokens.primaryVariant}` : "none", transition: "all 0.15s" }}>
                  <img src={room.img} alt={room.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 60%)" }} />
                  {sel && <div style={{ position: "absolute", top: 7, right: 7, width: 20, height: 20, borderRadius: "50%", background: tokens.primaryDefault, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "white", fontSize: 10 }}>✓</span></div>}
                  <span style={{ position: "absolute", bottom: 8, left: 10, color: "white", fontSize: 12, fontWeight: 700, textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>{room.label}</span>
                </div>
              );
            })
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: tokens.primaryVariant, borderRadius: 20, padding: "5px 12px", flexShrink: 0 }}>
                <span style={{ fontSize: 13 }}>🏠</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: tokens.primaryHover, letterSpacing: "0.06em", textTransform: "uppercase" as const, fontFamily: "var(--font-roboto)" }}>Your {bhkType}</span>
              </div>
              {(bhkRooms[bhkType] ?? bhkRooms["2BHK"]).map(room => {
                const sel = selectedRoom === room.value;
                return (
                  <div
                    key={room.label}
                    onClick={() => { setSelectedRoom(room.value); showToast(`🏡 Showing ${room.label} looks…`); }}
                    style={{
                      flexShrink: 0,
                      width: 80,
                      height: 80,
                      borderRadius: 12,
                      background: sel ? room.bg : tokens.surfaceBg,
                      border: `${sel ? "2px" : "1px"} solid ${sel ? tokens.primaryDefault : tokens.onSurfaceBorder}`,
                      boxShadow: sel ? `0 0 0 3px ${tokens.primaryVariant}` : "0 1px 4px rgba(0,0,0,0.07)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      position: "relative",
                      transition: "all 0.15s",
                    }}
                  >
                    {sel && (
                      <div style={{ position: "absolute", top: 5, right: 5, width: 16, height: 16, borderRadius: "50%", background: tokens.primaryDefault, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "white", fontSize: 9, lineHeight: 1 }}>✓</span>
                      </div>
                    )}
                    <span style={{ fontSize: 22, lineHeight: 1 }}>{room.emoji}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: sel ? tokens.primaryHover : tokens.onSurfaceSecondary, textAlign: "center", lineHeight: 1.2, padding: "0 4px", fontFamily: "var(--font-roboto)" }}>{room.label}</span>
                  </div>
                );
              })}
            </>
          )}
        </div>
        {/* Scrollable content — editorial grid sorted by style DNA */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {/* Section header */}
          <div style={{ padding: "20px 40px 14px", display: "flex", alignItems: "center", gap: 10, minHeight: 58 }}>
            {/* Title (fixed left) */}
            <div style={{ fontFamily: "var(--font-gilroy)", fontSize: 20, fontWeight: 700, color: "var(--foreground)", flexShrink: 0 }}>
              {fromBrowse
                ? browseRoomFilter
                  ? `✦ ${desktopRoomTiles.find(r => r.value === browseRoomFilter)?.label ?? browseRoomFilter} Looks`
                  : "✦ All Looks"
                : `✦ ${galleryProfile.primary} Looks`}
            </div>
            {!fromBrowse && (
              <span style={{ fontSize: 13, color: "var(--muted-foreground)", fontFamily: "var(--font-gilroy)", flexShrink: 0 }}>
                matched to your DNA
              </span>
            )}

            {/* Filter bar — left of count */}
            <GalleryFilterBar
              searchQuery={gallerySearchQuery}
              onClearSearch={() => setGallerySearchQuery("")}
              colorFamily={galleryColorFamily}
              onColorFamily={setGalleryColorFamily}
              material={galleryMaterial}
              onMaterial={setGalleryMaterial}
              paletteSwatches={paletteSwatches}
              topMaterials={topMaterials}
              styleTags={topStyleTags}
              styleTag={galleryStyleTag}
              onStyleTag={setGalleryStyleTag}
              priceRange={galleryPriceRange}
              onPriceRange={setGalleryPriceRange}
              selectedColors={gallerySelectedColors}
              onSelectedColors={setGallerySelectedColors}
              selectedThemes={gallerySelectedThemes}
              onSelectedThemes={setGallerySelectedThemes}
              onClearAll={clearAllFilters}
              isDesktop
              styleOptions={STYLE_OPTIONS}
              colorScheme={galleryColorScheme}
              onColorScheme={setGalleryColorScheme}
              layout={galleryLayout}
              onLayout={setGalleryLayout}
              budgetTier={galleryBudgetTier}
              onBudgetTier={onBudgetTier}
              budgetTiers={BUDGET_TIERS}
            />

            {/* Count (fixed right) */}
            {!looksLoading && (
              <span style={{ fontSize: 13, color: "var(--muted-foreground)", fontFamily: "var(--font-gilroy)", flexShrink: 0, whiteSpace: "nowrap" }}>
                {filteredAllLooks.length} look{filteredAllLooks.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Shimmer skeleton */}
          {looksLoading && (() => {
            const shimStyle: React.CSSProperties = { background: "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" };
            return (
              <div className="lbk-shim">
                <div className="lbk-shim-hero" style={shimStyle} />
                <div className="lbk-shim-sm lbk-s1" style={shimStyle} />
                <div className="lbk-shim-sm lbk-s2" style={shimStyle} />
                <div className="lbk-shim-sm lbk-s3" style={shimStyle} />
                <div className="lbk-shim-sm lbk-s4" style={shimStyle} />
              </div>
            );
          })()}

          {/* Empty state — no looks in room */}
          {!looksLoading && allLooks.length === 0 && (
            <div style={{ textAlign: "center", padding: "64px 0", color: "var(--muted-foreground)", fontFamily: "var(--font-roboto)", fontSize: 14 }}>
              No looks yet for this room — check back soon.
            </div>
          )}

          {/* Empty state — filters removed all results */}
          {!looksLoading && allLooks.length > 0 && filteredAllLooks.length === 0 && (
            <div style={{ textAlign: "center", padding: "64px 40px", color: "var(--muted-foreground)", fontFamily: "var(--font-roboto)" }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>🔍</div>
              <div style={{ fontSize: 15, fontFamily: "var(--font-gilroy)", fontWeight: 600, color: "var(--foreground)", marginBottom: 8 }}>
                No looks match your filters
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
                Try adjusting your price range, color, theme, or material filters, or clear all to browse everything.
              </div>
              <button
                onClick={clearAllFilters}
                style={{
                  background: "var(--primary)", color: "var(--primary-foreground)",
                  border: "none", borderRadius: "var(--radius)", padding: "10px 24px",
                  fontSize: 13, fontFamily: "var(--font-roboto)", fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Editorial grid */}
          {!looksLoading && filteredAllLooks.length > 0 && (() => {

            /* Full-bleed image card — height is controlled by the CSS class on the parent wrapper */
            const LookCard = ({ l, isHero }: { l: any; isHero?: boolean }) => {
              const isWishlisted = wishlist?.some((w: any) => w.name === l.name) ?? false;
              const isPrimary = l.tag === galleryProfile.primary;
              const isSecondary = l.tag === gallerySecondaryProfile.primary;
              return (
                <div
                  onClick={() => { setSelectedLook({ ...l, room: selectedRoom }); goTo("explorer"); }}
                  style={{ height: "100%", position: "relative", overflow: "hidden", cursor: "pointer" }}
                >
                  {l.img
                    ? <img src={l.img} alt={l.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    : <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#E8D8C4,#D4C0A8)" }} />
                  }
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.15) 48%, rgba(0,0,0,0.02) 70%)" }} />

                  {/* Top: match badge + wishlist */}
                  <div style={{ position: "absolute", top: 12, left: 12, right: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    {isPrimary
                      ? <div style={{ padding: "4px 9px", borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" as const, background: tokens.primaryDefault, color: "white", fontFamily: "var(--font-roboto)" }}>✦ Your Style</div>
                      : isSecondary
                      ? <div style={{ padding: "4px 9px", borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" as const, background: tokens.extendedMustard, color: tokens.onSurfaceDefault, fontFamily: "var(--font-roboto)" }}>Close Match</div>
                      : <div />}
                    <button
                      onClick={e => { e.stopPropagation(); toggleWishlist(l); }}
                      style={{ width: 30, height: 30, background: isWishlisted ? tokens.primaryDefault : "rgba(255,255,255,0.88)", border: "none", borderRadius: "50%", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                    >{isWishlisted ? "❤️" : "🤍"}</button>
                  </div>

                  {/* Bottom: tag + name + price + arrow */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: isHero ? "24px 24px 20px" : "12px 14px 14px" }}>
                    <div style={{ fontFamily: "var(--font-roboto)", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.62)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 3 }}>{l.tag}</div>
                    <div style={{ fontFamily: "var(--font-gilroy)", fontSize: isHero ? 22 : 14, fontWeight: 700, color: "white", lineHeight: 1.2, marginBottom: 8 }}>{l.name}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                        <span style={{ fontFamily: "var(--font-roboto)", fontSize: isHero ? 15 : 13, fontWeight: 700, color: "white" }}>{l.price}</span>
                        <span style={{ fontFamily: "var(--font-roboto)", fontSize: 10, color: "rgba(255,255,255,0.58)" }}>{l.items}</span>
                      </div>
                      <div style={{ width: isHero ? 34 : 28, height: isHero ? 34 : 28, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.52)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: isHero ? 15 : 12, flexShrink: 0 }}>→</div>
                    </div>
                  </div>
                </div>
              );
            };

            /* Build blocks: first block uses editorial image in s1 slot */
            const blocks: any[] = [];
            let li = 0; let bi = 0;
            while (li < filteredAllLooks.length) {
              const hero = filteredAllLooks[li++];
              if (!hero) break;
              const useEditorial = bi === 0;
              const s1 = useEditorial ? null : filteredAllLooks[li++];
              const s2 = filteredAllLooks[li++];
              const s3 = filteredAllLooks[li++];
              const s4 = filteredAllLooks[li++];
              const blank = (cls: string) => <div className={`lbk-slot ${cls}`} style={{ background: tokens.surfaceBg }} />;

              /* Editorial image card — sits in the s1 slot of the first block only */
              const EditorialImageCard = (
                <div className="lbk-slot lbk-s1" style={{ position: "relative", overflow: "hidden" }}>
                  <img
                    src="https://images.unsplash.com/photo-1589163045730-40797c5cdc6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB6ZW4lMjBpbnRlcmlvciUyMGRlc2lnbiUyMG1vb2QlMjBlZGl0b3JpYWx8ZW58MXx8fHwxNzcyNzg3NDIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Style DNA"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.18) 50%, rgba(0,0,0,0.02) 72%)" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 14px 14px" }}>
                    <div style={{ fontFamily: "var(--font-roboto)", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.62)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 3 }}>Your Style DNA</div>
                    <div style={{ fontFamily: "var(--font-gilroy)", fontSize: 14, fontWeight: 700, color: "white", lineHeight: 1.2, marginBottom: 8 }}>{galleryProfile.primary}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--font-roboto)", fontSize: 11, color: "rgba(255,255,255,0.75)" }}>{galleryProfile.tagline}</span>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.52)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, flexShrink: 0, marginLeft: 8 }}>→</div>
                    </div>
                  </div>
                </div>
              );

              blocks.push(
                <div key={bi} className="lbk-block">
                  <div className="lbk-hero"><LookCard l={hero} isHero /></div>
                  {useEditorial
                    ? EditorialImageCard
                    : s1 ? <div className="lbk-slot lbk-s1"><LookCard l={s1} /></div> : blank("lbk-s1")}
                  {s2 ? <div className="lbk-slot lbk-s2"><LookCard l={s2} /></div> : blank("lbk-s2")}
                  {s3 ? <div className="lbk-slot lbk-s3"><LookCard l={s3} /></div> : blank("lbk-s3")}
                  {s4 ? <div className="lbk-slot lbk-s4"><LookCard l={s4} /></div> : blank("lbk-s4")}
                </div>
              );
              bi++;
            }
            return <div style={{ paddingBottom: 48 }}>{blocks}</div>;
          })()}
        </div>
        {/* See All Overlay (reuse mobile version) */}
        {seeAllSection && (() => {
          const sectionMeta: Record<"looks" | "trending" | "budget", { title: string; data: any[]; chips: string[]; activeChip: string; setChip: (c: string) => void }> = {
            looks:    { title: "✦ Top Picks for You", data: roomSections.looks, chips: TOP_PICKS_CHIPS, activeChip: topPicksChip, setChip: setTopPicksChip },
            trending: { title: "📍 Trending in Bengaluru", data: roomSections.trending, chips: TRENDING_CHIPS, activeChip: trendingChip, setChip: setTrendingChip },
            budget:   { title: "💰 Under ₹1.5L", data: roomSections.budget, chips: BUDGET_CHIPS, activeChip: budgetChip, setChip: setBudgetChip },
          };
          const { title, data, chips, activeChip, setChip } = sectionMeta[seeAllSection];
          const filtered = filterLooks(data, activeChip, seeAllSection);
          return (
            <div style={{ position: "absolute", inset: 0, background: tokens.surfaceBg, zIndex: 90, display: "flex", flexDirection: "column" }}>
              <div style={{ background: tokens.surfaceDefault, borderBottom: `1px solid ${tokens.surfaceVariant}`, padding: "20px 40px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                <button onClick={() => setSeeAllSection(null)} style={{ width: 36, height: 36, background: tokens.surfaceBg, border: "none", borderRadius: "50%", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", color: tokens.onSurfaceDefault }}>←</button>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 600, color: tokens.onSurfaceDefault }}>{title}</div>
                <div style={{ marginLeft: "auto", fontSize: 13, color: tokens.onSurfaceSecondary }}>{filtered.length} looks</div>
              </div>
              <div style={{ background: tokens.surfaceDefault, borderBottom: `1px solid ${tokens.surfaceVariant}`, display: "flex", gap: 8, overflowX: "auto", padding: "12px 40px", flexShrink: 0 }}>
                {chips.map(chip => <button key={chip} onClick={() => setChip(chip)} style={{ flexShrink: 0, padding: "6px 16px", borderRadius: 20, fontSize: 13, fontFamily: "'Roboto',sans-serif", cursor: "pointer", border: `1.5px solid ${activeChip === chip ? tokens.primaryDefault : tokens.onSurfaceBorder}`, background: activeChip === chip ? tokens.primaryVariant : tokens.surfaceBg, color: activeChip === chip ? tokens.primaryHover : tokens.onSurfaceSecondary, fontWeight: activeChip === chip ? 600 : 400 }}>{chip}</button>)}
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "24px 40px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
                {filtered.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px 0", color: tokens.onSurfaceSecondary }}>No looks match this filter</div>}
                {filtered.map((l: any, i: number) => <DesktopLookCard key={i} l={l} idx={i} />)}
              </div>
            </div>
          );
        })()}
        {/* Desktop SearchPanel */}
        <SearchPanel
          isOpen={showSearch}
          onClose={() => setShowSearch(false)}
          onSelectLook={(look) => {
            setSelectedLook({ ...look, room: look.room ?? "Living\nRoom" });
            goTo("explorer");
          }}
          onSubmitSearch={(q) => { setGallerySearchQuery(q); setShowSearch(false); }}
          isDesktop={true}
          onMatchLook={() => { setShowSearch(false); setShowImageMatchModal(true); }}
        />
        {/* Livy FAB */}
        {!chatOpen && (
          <div onClick={() => setChatOpen(true)} style={{ position: "absolute", bottom: 32, right: 32, zIndex: 50, cursor: "pointer", width: 52, height: 52, background: `linear-gradient(135deg,${tokens.primaryDefault},${tokens.secondaryDefault})`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: `0 4px 18px rgba(235,89,95,0.38)`, border: "2.5px solid white" }}>🪴</div>
        )}
        {/* Chat Panel */}
        {chatOpen && (
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 380, height: "70vh", background: tokens.surfaceBg, zIndex: 100, display: "flex", flexDirection: "column", borderRadius: "20px 20px 0 0", boxShadow: "0 -8px 40px rgba(0,0,0,0.2)", border: `1px solid ${tokens.surfaceVariant}` }}>
            <div style={{ background: tokens.onSurfaceDefault, padding: "18px 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0, borderRadius: "20px 20px 0 0" }}>
              <div style={{ width: 40, height: 40, background: `linear-gradient(135deg,${tokens.primaryDefault},${tokens.secondaryDefault})`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🪴</div>
              <div><div style={{ fontSize: 14, fontWeight: 500, color: "white" }}>Livy</div><div style={{ fontSize: 11, color: tokens.tertiaryGreenV1 }}>● Design Assistant · Online</div></div>
              <button onClick={() => setChatOpen(false)} style={{ marginLeft: "auto", width: 30, height: 30, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", color: "white", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
            <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              {chatMsgs.map((m, i) => (
                <div key={i} style={{ maxWidth: "80%", alignSelf: m.role === "bot" ? "flex-start" : "flex-end" }}>
                  <div style={{ padding: "10px 13px", borderRadius: 16, fontSize: 13, lineHeight: 1.5, background: m.role === "bot" ? "white" : tokens.primaryDefault, color: m.role === "bot" ? tokens.onSurfaceDefault : "white", borderBottomLeftRadius: m.role === "bot" ? 4 : 16, borderBottomRightRadius: m.role === "user" ? 4 : 16, boxShadow: m.role === "bot" ? "0 1px 4px rgba(0,0,0,0.07)" : "none" }} dangerouslySetInnerHTML={{ __html: m.text }} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, padding: "0 14px 10px", flexWrap: "wrap", flexShrink: 0 }}>
              {["Show budget version","Make it warmer","Under ₹1.5L","Mix looks"].map(q => <button key={q} onClick={() => sendMsg(q)} style={{ background: "var(--surface-variant, #E6E6E6)", border: "none", borderRadius: 99, padding: "6px 12px", fontSize: 12, color: tokens.onSurfaceDefault, cursor: "pointer", fontFamily: "var(--font-roboto)", fontWeight: "var(--font-weight-semibold)" }}>{q}</button>)}
            </div>
            <div style={{ display: "flex", gap: 8, padding: "10px 14px", background: "white", borderTop: `1px solid ${tokens.surfaceVariant}`, flexShrink: 0 }}>
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendFromInput()} placeholder="Ask Livy anything…" style={{ flex: 1, background: tokens.surfaceBg, border: "none", borderRadius: 16, padding: "10px 14px", fontSize: 13, fontFamily: "'Roboto',sans-serif", outline: "none" }} />
              <button onClick={sendFromInput} style={{ width: 38, height: 38, background: tokens.primaryDefault, border: "none", borderRadius: "50%", cursor: "pointer", fontSize: 15, color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>↑</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={scrollRef} style={{ flex: 1, display: "flex", flexDirection: "column", background: tokens.surfaceBg, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
      <div ref={headerRef} style={{ background: tokens.surfaceDefault, borderBottom: `1px solid ${tokens.surfaceVariant}`, position: "sticky", top: headerTop, zIndex: 20, transition: "top 0.32s cubic-bezier(0.4,0,0.2,1)" }}>
        <div style={{ background: tokens.surfaceDefault }}><StatusBar /></div>
        <div style={{ padding: "0 24px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              {!fromBrowse && <div style={{ fontSize: 11, color: tokens.onSurfaceSecondary, letterSpacing: "0.05em" }}>2BHK · Prestige Shantiniketan</div>}
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: tokens.onSurfaceDefault, fontWeight: 600, marginTop: 2, display: "flex", alignItems: "center", gap: 8 }}>
                <span onClick={() => onBackToWebsite ? onBackToWebsite() : goTo("splash")} title="Back to Livspace" style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: tokens.onSurfaceDefault, width: 32, height: 32, borderRadius: "50%", background: tokens.surfaceBg, flexShrink: 0 }}><HomeRoundedIcon style={{ fontSize: 20 }} /></span>
                Your LookBook
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => setShowSearch(true)}
                style={{ width: 40, height: 40, background: tokens.surfaceBg, border: "none", borderRadius: "50%", cursor: "pointer", fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center" }}
                title="Search looks"
              >🔍</button>
              <div style={{ position: "relative" }}>
                <button onClick={() => goTo("wishlist")} style={{ width: 40, height: 40, background: tokens.surfaceBg, border: "none", borderRadius: "50%", cursor: "pointer", fontSize: 17 }}>{wishlistCount > 0 ? "❤️" : "🤍"}</button>
                {wishlistCount > 0 && <div style={{ position: "absolute", top: -5, right: -5, width: 18, height: 18, background: tokens.primaryDefault, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "white", border: `2px solid ${tokens.surfaceDefault}` }}>{wishlistCount}</div>}
              </div>
              <div style={{ position: "relative" }}>
                <button onClick={() => goTo("cart")} style={{ width: 40, height: 40, background: tokens.surfaceBg, border: "none", borderRadius: "50%", cursor: "pointer", fontSize: 17 }}>🛒</button>
                <CartBadge count={cartCount} />
              </div>
              <div style={{ position: "relative" }}>
                <button onClick={onOrdersClick} title="My Orders" style={{ width: 40, height: 40, background: tokens.surfaceBg, border: "none", borderRadius: "50%", cursor: "pointer", fontSize: 17 }}>📦</button>
                {(ordersCount ?? 0) > 0 && <div style={{ position: "absolute", top: -5, right: -5, width: 18, height: 18, background: tokens.primaryDefault, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "white", border: `2px solid ${tokens.surfaceDefault}` }}>{ordersCount}</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Room Photo Grid */}
        <div style={{ margin: "14px 14px 0", borderRadius: 16, overflow: "hidden" }}>
          {fromBrowse ? (
            /* ── Browse All Looks: photo grid ── */
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                { label: "Living Room", value: "Living\nRoom", img: "https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
                { label: "Kitchen", value: "Kitchen", img: "https://images.unsplash.com/photo-1668026694348-b73c5eb5e299?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
                { label: "Bedroom", value: "Bedroom", img: "https://images.unsplash.com/photo-1616418928117-4e6d19be2df1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
                { label: "Kid's Room", value: "Kids Room", img: "https://images.unsplash.com/photo-1572025442367-756c1e7887a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
                { label: "Balcony", value: "Balcony", img: "https://images.unsplash.com/photo-1763741226296-708d30dbfe0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
                { label: "Study Room", value: "Study Room", img: "https://images.unsplash.com/photo-1751200065697-4461cc2b43cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
              ].map((room) => {
                const isSelected = browseRoomFilter === room.value;
                return (
                  <div
                    key={room.value}
                    onClick={() => { setBrowseRoomFilter(prev => prev === room.value ? null : room.value); showToast(browseRoomFilter === room.value ? "🏡 Showing all looks…" : `🏡 Showing ${room.label} looks…`); }}
                    style={{
                      position: "relative", height: 88, borderRadius: 12, overflow: "hidden", cursor: "pointer",
                      border: `2.5px solid ${isSelected ? tokens.primaryDefault : "transparent"}`,
                      boxShadow: isSelected ? `0 0 0 2px ${tokens.primaryVariant}` : "none",
                      transition: "border 0.15s, box-shadow 0.15s",
                    }}
                  >
                    <img src={room.img} alt={room.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.08) 60%)" }} />
                    {isSelected && (
                      <div style={{ position: "absolute", top: 7, right: 7, width: 18, height: 18, borderRadius: "50%", background: tokens.primaryDefault, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "white", fontSize: 10, lineHeight: 1 }}>✓</span>
                      </div>
                    )}
                    <span style={{ position: "absolute", bottom: 8, left: 10, color: "white", fontSize: 11, fontWeight: 700, letterSpacing: "0.02em", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>{room.label}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── Design My Look: BHK emoji-tile grid ── */
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Header pill */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: tokens.primaryVariant, borderRadius: 20, padding: "5px 12px" }}>
                  <span style={{ fontSize: 13 }}>🏠</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: tokens.primaryHover, letterSpacing: "0.06em", textTransform: "uppercase" }}>Tap a room to explore</span>
                </div>
                <span style={{ fontSize: 11, color: tokens.onSurfaceDisabled, fontWeight: 500 }}>{bhkType}</span>
              </div>
              {/* Room tile grid */}
              {(() => {
                const bentoLayout: Record<string, React.CSSProperties[]> = {
                  "1BHK": [
                    { gridColumn: "1 / 2", gridRow: "1 / 3" },   // Living Room — tall
                    { gridColumn: "2 / 4", gridRow: "1 / 2" },   // Bedroom — wide
                    { gridColumn: "2 / 4", gridRow: "2 / 3" },   // Kitchen — wide
                  ],
                  "2BHK": [
                    { gridColumn: "1 / 2", gridRow: "1 / 3" },   // Living Room — tall left
                    { gridColumn: "2 / 3", gridRow: "1 / 2" },   // Master Bedroom
                    { gridColumn: "3 / 4", gridRow: "1 / 2" },   // Bedroom 2
                    { gridColumn: "2 / 3", gridRow: "2 / 3" },   // Kitchen
                    { gridColumn: "3 / 4", gridRow: "2 / 3" },   // Bathroom
                    { gridColumn: "1 / 4", gridRow: "3 / 4" },   // Balcony — full width
                  ],
                  "3BHK": [
                    { gridColumn: "1 / 2", gridRow: "1 / 3" },   // Living Room — tall left
                    { gridColumn: "2 / 3", gridRow: "1 / 2" },   // Master Bedroom
                    { gridColumn: "3 / 4", gridRow: "1 / 2" },   // Bedroom 2
                    { gridColumn: "2 / 4", gridRow: "2 / 3" },   // Bedroom 3 — wide
                    { gridColumn: "1 / 2", gridRow: "3 / 4" },   // Kitchen
                    { gridColumn: "2 / 3", gridRow: "3 / 4" },   // Bathroom
                    { gridColumn: "3 / 4", gridRow: "3 / 4" },   // Balcony
                  ],
                  "4BHK": [
                    { gridColumn: "1 / 2", gridRow: "1 / 3" },   // Living Room — tall left
                    { gridColumn: "2 / 3", gridRow: "1 / 2" },   // Master Bedroom
                    { gridColumn: "3 / 4", gridRow: "1 / 2" },   // Bedroom 2
                    { gridColumn: "2 / 3", gridRow: "2 / 3" },   // Bedroom 3
                    { gridColumn: "3 / 4", gridRow: "2 / 3" },   // Bedroom 4
                    { gridColumn: "1 / 2", gridRow: "3 / 4" },   // Kitchen
                    { gridColumn: "2 / 3", gridRow: "3 / 4" },   // Bathroom
                    { gridColumn: "3 / 4", gridRow: "3 / 4" },   // Study Room
                    { gridColumn: "1 / 4", gridRow: "4 / 5" },   // Balcony — full width
                  ],
                };
                const rooms = bhkRooms[bhkType] ?? bhkRooms["2BHK"];
                const placements = bentoLayout[bhkType] ?? bentoLayout["2BHK"];
                return (
                  <div style={{ display: "flex", flexDirection: "row", gap: 6, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
                    {rooms.map((room, idx) => {
                      const sel = selectedRoom === room.value;
                      const placement = placements[idx] ?? {};
                      return (
                        <div
                          key={room.label}
                          onClick={() => { setSelectedRoom(room.value); showToast(`🏡 Showing ${room.label} looks…`); }}
                          style={{
                            ...placement,
                            flexShrink: 0,
                            width: 72,
                            height: 72,
                            borderRadius: 10,
                            background: sel ? room.bg : tokens.surfaceBg,
                            border: `${sel ? "2px" : "1px"} solid ${sel ? tokens.primaryDefault : tokens.onSurfaceBorder}`,
                            boxShadow: sel ? `0 0 0 3px ${tokens.primaryVariant}` : "0 1px 4px rgba(0,0,0,0.07)",
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 3,
                            position: "relative",
                            transition: "all 0.15s",
                          }}
                        >
                          {sel && (
                            <div style={{ position: "absolute", top: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: tokens.primaryDefault, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ color: "white", fontSize: 8, lineHeight: 1 }}>✓</span>
                            </div>
                          )}
                          <span style={{ fontSize: 20, lineHeight: 1 }}>{room.emoji}</span>
                          <span style={{ fontSize: 10, fontWeight: 600, color: sel ? tokens.primaryHover : tokens.onSurfaceSecondary, textAlign: "center", lineHeight: 1.2, padding: "0 4px" }}>{room.label}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Room Tabs */}
        <div style={{ display: "none", gap: 8, padding: "12px 24px 0", overflowX: "auto" }}>
          {tabs.map((t, i) => (
            <div key={i} onClick={() => { setActiveTab(i); showToast(`🏡 Showing ${t} looks…`); }} style={{ flexShrink: 0, padding: "7px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer", background: i === activeTab ? tokens.onSurfaceDefault : tokens.surfaceBg, color: i === activeTab ? "white" : tokens.onSurfaceSecondary, border: `1.5px solid ${i === activeTab ? "transparent" : tokens.surfaceVariant}`, transition: "all 0.18s" }}>{t}</div>
          ))}
        </div>

        {/* Search bar tap target */}
        <div
          onClick={() => setShowSearch(true)}
          style={{
            margin: "12px 14px 10px",
            display: "none",
            alignItems: "center",
            gap: 10,
            background: tokens.surfaceBg,
            borderRadius: 50,
            padding: "11px 16px",
            cursor: "pointer",
            border: `1.5px solid ${tokens.surfaceVariant}`,
          }}
        >
          <span style={{ fontSize: 15 }}>🔍</span>
          <span style={{ fontSize: 13, color: tokens.onSurfaceDisabled, fontFamily: "'Roboto',sans-serif", userSelect: "none" }}>
            Search looks — "grey wooden kitchen"…
          </span>
        </div>
      </div>

      {/* Mobile gallery — section header: [title] [←filter bar→] [count] in one row */}
      <div style={{ padding: "14px 16px", marginTop: 12, marginBottom: 12, display: "flex", alignItems: "center", gap: 6, overflow: "hidden", minWidth: 0 }}>
        {/* Title — fixed left, truncated if style name is long */}
        <span style={{ fontFamily: "var(--font-gilroy)", fontSize: 17, fontWeight: 700, color: "var(--foreground)", flexShrink: 0, whiteSpace: "nowrap", maxWidth: "42vw", overflow: "hidden", textOverflow: "ellipsis" }}>
          {fromBrowse ? "✦ All Looks" : `✦ ${galleryProfile.primary}`}
        </span>

        {/* Filter icon — opens bottom sheet on mobile */}
        <MobileFilterIcon
          searchQuery={gallerySearchQuery}
          onClearSearch={() => setGallerySearchQuery("")}
          colorFamily={galleryColorFamily}
          onColorFamily={setGalleryColorFamily}
          material={galleryMaterial}
          onMaterial={setGalleryMaterial}
          paletteSwatches={paletteSwatches}
          topMaterials={topMaterials}
          styleTags={topStyleTags}
          styleTag={galleryStyleTag}
          onStyleTag={setGalleryStyleTag}
          priceRange={galleryPriceRange}
          onPriceRange={setGalleryPriceRange}
          selectedColors={gallerySelectedColors}
          onSelectedColors={setGallerySelectedColors}
          selectedThemes={gallerySelectedThemes}
          onSelectedThemes={setGallerySelectedThemes}
          onClearAll={clearAllFilters}
          styleOptions={STYLE_OPTIONS}
          colorScheme={galleryColorScheme}
          onColorScheme={setGalleryColorScheme}
          layout={galleryLayout}
          onLayout={setGalleryLayout}
          budgetTier={galleryBudgetTier}
          onBudgetTier={onBudgetTier}
          budgetTiers={BUDGET_TIERS}
        />

        {/* Count — fixed right */}
        {!looksLoading && (
          <span style={{ fontSize: 12, color: "var(--muted-foreground)", fontFamily: "var(--font-gilroy)", flexShrink: 0, whiteSpace: "nowrap" }}>
            {filteredAllLooks.length} look{filteredAllLooks.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Shimmer — reuses responsive lbk-shim classes */}
      {looksLoading && (
        <div className="lbk-shim">
          <div className="lbk-shim-hero" style={{ background: "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
          <div className="lbk-shim-sm lbk-s1" style={{ background: "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
          <div className="lbk-shim-sm lbk-s2" style={{ background: "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
          <div className="lbk-shim-sm lbk-s3" style={{ background: "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
          <div className="lbk-shim-sm lbk-s4" style={{ background: "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
        </div>
      )}

      {/* Empty state — no looks in room */}
      {!looksLoading && allLooks.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--muted-foreground)", fontFamily: "var(--font-roboto)", fontSize: 13 }}>
          No looks yet for this room — check back soon.
        </div>
      )}

      {/* Empty state — filters removed all results */}
      {!looksLoading && allLooks.length > 0 && filteredAllLooks.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 20px", color: "var(--muted-foreground)", fontFamily: "var(--font-roboto)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 14, fontFamily: "var(--font-gilroy)", fontWeight: 600, color: "var(--foreground)", marginBottom: 6 }}>
            No looks match your filters
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>
            Try adjusting your price range, color, theme, or material filters.
          </div>
          <button
            onClick={clearAllFilters}
            style={{
              background: "var(--primary)", color: "var(--primary-foreground)",
              border: "none", borderRadius: "var(--radius)", padding: "9px 20px",
              fontSize: 13, fontFamily: "var(--font-roboto)", fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Editorial grid — same .lbk-* classes, CSS media query handles mobile layout automatically */}
      {!looksLoading && filteredAllLooks.length > 0 && (() => {
        const MobLookCard = ({ l, isHero }: { l: any; isHero?: boolean }) => {
          const isWishlisted = wishlist?.some((w: any) => w.name === l.name) ?? false;
          const isPrimary = l.tag === galleryProfile.primary;
          const isSecondary = l.tag === gallerySecondaryProfile.primary;
          return (
            <div
              onClick={() => { setSelectedLook({ ...l, room: selectedRoom }); goTo("explorer"); }}
              style={{ height: "100%", position: "relative", overflow: "hidden", cursor: "pointer" }}
            >
              {l.img
                ? <img src={l.img} alt={l.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                : <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#E8D8C4,#D4C0A8)" }} />
              }
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.16) 50%, rgba(0,0,0,0.02) 72%)" }} />
              {/* Badge + wishlist */}
              <div style={{ position: "absolute", top: 10, left: 10, right: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                {isPrimary
                  ? <Tag label="✦ Your Style" variant="filled"  color="primary"  size="xs" />
                  : isSecondary
                  ? <Tag label="Close Match"  variant="tinted"  color="warning"  size="xs" />
                  : <span />}
                <button
                  onClick={e => { e.stopPropagation(); toggleWishlist(l); }}
                  style={{ width: 28, height: 28, background: isWishlisted ? tokens.primaryDefault : "rgba(255,255,255,0.88)", border: "none", borderRadius: "50%", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                >{isWishlisted ? "❤️" : "🤍"}</button>
              </div>
              {/* Bottom text */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: isHero ? "20px 16px 16px" : "10px 12px 12px" }}>
                <div style={{ fontFamily: "var(--font-roboto)", fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.60)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 3 }}>{l.tag}</div>
                <div style={{ fontFamily: "var(--font-gilroy)", fontSize: isHero ? 18 : 13, fontWeight: 700, color: "white", lineHeight: 1.2, marginBottom: 6 }}>{l.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                    <span style={{ fontFamily: "var(--font-roboto)", fontSize: isHero ? 14 : 12, fontWeight: 700, color: "white" }}>{l.price}</span>
                    <span style={{ fontFamily: "var(--font-roboto)", fontSize: 10, color: "rgba(255,255,255,0.55)" }}>{l.items}</span>
                  </div>
                  <div style={{ width: isHero ? 30 : 24, height: isHero ? 30 : 24, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.50)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: isHero ? 13 : 11, flexShrink: 0 }}>→</div>
                </div>
              </div>
            </div>
          );
        };

        const blocks: any[] = [];
        let li = 0; let bi = 0;
        while (li < filteredAllLooks.length) {
          const hero = filteredAllLooks[li++];
          if (!hero) break;
          const useEditorial = bi === 0;
          const s1 = useEditorial ? null : filteredAllLooks[li++];
          const s2 = filteredAllLooks[li++];
          const s3 = filteredAllLooks[li++];
          const s4 = filteredAllLooks[li++];
          const blank = (cls: string) => <div className={`lbk-slot ${cls}`} style={{ background: tokens.surfaceBg }} />;

          const EditorialImgCard = (
            <div
              className="lbk-slot lbk-s1"
              onClick={() => setShowImageMatchModal(true)}
              style={{ position: "relative", overflow: "hidden", cursor: "pointer" }}
            >
              {/* Background image */}
              <img
                src="https://images.unsplash.com/photo-1589163045730-40797c5cdc6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB6ZW4lMjBpbnRlcmlvciUyMGRlc2lnbiUyMG1vb2QlMjBlZGl0b3JpYWx8ZW58MXx8fHwxNzcyNzg3NDIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Match my Look"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.45) saturate(0.7)" }}
              />
              {/* Deep gradient overlay */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(44,24,16,0.72) 0%, rgba(0,0,0,0.55) 60%, rgba(235,89,95,0.18) 100%)" }} />
              {/* Red glow at bottom-right corner */}
              <div style={{ position: "absolute", bottom: -12, right: -12, width: 70, height: 70, borderRadius: "50%", background: "radial-gradient(circle, rgba(235,89,95,0.45) 0%, transparent 72%)", pointerEvents: "none" }} />

              {/* AI badge — top left */}
              <div style={{ position: "absolute", top: 10, left: 10, display: "flex", alignItems: "center", gap: 5, background: "rgba(235,89,95,0.92)", backdropFilter: "blur(6px)", borderRadius: 6, padding: "3px 8px" }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <span style={{ fontFamily: "var(--font-roboto)", fontSize: 8, fontWeight: 700, color: "white", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>Gemini AI</span>
              </div>

              {/* Camera icon — centred in upper half */}
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -68%)", width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.30)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>

              {/* Bottom text */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 12px 12px" }}>
                <div style={{ fontFamily: "var(--font-roboto)", fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.55)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 3 }}>AI-Powered</div>
                <div style={{ fontFamily: "var(--font-gilroy)", fontSize: 13, fontWeight: 700, color: "white", lineHeight: 1.2, marginBottom: 6 }}>Match my Look</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-roboto)", fontSize: 9, color: "rgba(255,255,255,0.60)", lineHeight: 1.4 }}>Upload a photo · Gemini finds your style</span>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(235,89,95,0.85)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 11, flexShrink: 0, marginLeft: 6 }}>→</div>
                </div>
              </div>
            </div>
          );

          blocks.push(
            <div key={bi} className="lbk-block">
              <div className="lbk-hero"><MobLookCard l={hero} isHero /></div>
              {useEditorial
                ? EditorialImgCard
                : s1 ? <div className="lbk-slot lbk-s1"><MobLookCard l={s1} /></div> : blank("lbk-s1")}
              {s2 ? <div className="lbk-slot lbk-s2"><MobLookCard l={s2} /></div> : blank("lbk-s2")}
              {s3 ? <div className="lbk-slot lbk-s3"><MobLookCard l={s3} /></div> : blank("lbk-s3")}
              {s4 ? <div className="lbk-slot lbk-s4"><MobLookCard l={s4} /></div> : blank("lbk-s4")}
            </div>
          );
          bi++;
        }
        return <div style={{ paddingBottom: 100 }}>{blocks}</div>;
      })()}

      {/* See All Overlay */}
      {seeAllSection && (() => {
        const sectionMeta: Record<"looks" | "trending" | "budget", { title: string; data: any[]; chips: string[]; activeChip: string; setChip: (c: string) => void }> = {
          looks:    { title: "✦ Top Picks for You",      data: roomSections.looks,    chips: TOP_PICKS_CHIPS, activeChip: topPicksChip, setChip: setTopPicksChip },
          trending: { title: "📍 Trending in Bengaluru", data: roomSections.trending, chips: TRENDING_CHIPS,  activeChip: trendingChip, setChip: setTrendingChip },
          budget:   { title: "💰 Under ₹1.5L",           data: roomSections.budget,   chips: BUDGET_CHIPS,   activeChip: budgetChip,   setChip: setBudgetChip   },
        };
        const { title, data, chips, activeChip, setChip } = sectionMeta[seeAllSection];
        const filtered = filterLooks(data, activeChip, seeAllSection);
        return (
          <div style={{ position: "absolute", inset: 0, background: tokens.surfaceBg, zIndex: 90, display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ background: tokens.surfaceDefault, borderBottom: `1px solid ${tokens.surfaceVariant}`, padding: "52px 20px 12px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <button onClick={() => setSeeAllSection(null)} style={{ width: 36, height: 36, background: tokens.surfaceBg, border: "none", borderRadius: "50%", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", color: tokens.onSurfaceDefault }}>←</button>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600, color: tokens.onSurfaceDefault }}>{title}</div>
              <div style={{ marginLeft: "auto", fontSize: 12, color: tokens.onSurfaceSecondary }}>{filtered.length} looks</div>
            </div>
            {/* Chip filters */}
            <div style={{ background: tokens.surfaceDefault, borderBottom: `1px solid ${tokens.surfaceVariant}`, display: "flex", gap: 6, overflowX: "auto", padding: "10px 16px 12px", scrollbarWidth: "none", flexShrink: 0 }}>
              {chips.map(chip => (
                <button key={chip} onClick={() => setChip(chip)} style={{ flexShrink: 0, padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: activeChip === chip ? 600 : 400, fontFamily: "'Roboto',sans-serif", cursor: "pointer", border: `1.5px solid ${activeChip === chip ? tokens.primaryDefault : tokens.onSurfaceBorder}`, background: activeChip === chip ? tokens.primaryVariant : tokens.surfaceBg, color: activeChip === chip ? tokens.primaryHover : tokens.onSurfaceSecondary, transition: "all 0.15s" }}>{chip}</button>
              ))}
            </div>
            {/* 2×N grid */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px 120px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {filtered.length === 0 && (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px 0", color: tokens.onSurfaceSecondary, fontSize: 13 }}>No looks match this filter</div>
              )}
              {filtered.map((l: any, i: number) => {
                const isWishlisted = wishlist?.some((w: any) => w.name === l.name) ?? false;
                return (
                  <div key={i} onClick={() => { setSelectedLook({ ...l, room: selectedRoom }); setSeeAllSection(null); goTo("explorer"); }} style={{ background: tokens.surfaceDefault, borderRadius: 16, overflow: "hidden", cursor: "pointer", border: `1.5px solid ${l.featured ? tokens.extendedMustard : tokens.surfaceVariant}`, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", alignSelf: "start" }}>
                    <div style={{ width: "100%", height: 130, position: "relative", overflow: "hidden" }}>
                      {l.img
                        ? <img src={l.img} alt={l.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#E8D8C4,#D4C0A8)" }} />}
                      {l.badge && <div style={{ position: "absolute", top: 8, left: 8, padding: "3px 7px", borderRadius: 5, fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", background: l.badge.cls === "gold" ? tokens.extendedMustard : tokens.primaryDefault, color: l.badge.cls === "gold" ? tokens.onSurfaceDefault : "white" }}>{l.badge.text}</div>}
                      <button onClick={e => { e.stopPropagation(); toggleWishlist(l); }} style={{ position: "absolute", top: 7, right: 7, width: 26, height: 26, background: isWishlisted ? tokens.primaryDefault : "rgba(255,255,255,0.88)", border: "none", borderRadius: "50%", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>{isWishlisted ? "❤️" : "🤍"}</button>
                    </div>
                    <div style={{ padding: "10px 11px 13px" }}>
                      <span style={{ display: "inline-block", background: tokens.surfaceBg, borderRadius: 4, padding: "2px 7px", fontSize: 9, fontWeight: 600, color: tokens.onSurfaceSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>{l.tag}</span>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontWeight: 600, color: tokens.onSurfaceDefault, marginTop: 4, lineHeight: 1.3 }}>{l.name}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 5 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: tokens.onSurfaceDefault }}>{l.price}</span>
                        <span style={{ fontSize: 10, color: tokens.onSurfaceSecondary }}>{l.items}</span>
                      </div>
                      <button style={{ width: "100%", marginTop: 8, background: tokens.onSurfaceDefault, color: "white", border: "none", borderRadius: 8, padding: "8px 0", fontSize: 11, fontWeight: 500, cursor: "pointer" }}>Explore Look</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ── Search Panel ── */}
      <SearchPanel
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onSelectLook={(look) => {
          setSelectedLook({ ...look, room: look.room ?? "Living\nRoom" });
          goTo("explorer");
        }}
        onSubmitSearch={(q) => { setGallerySearchQuery(q); setShowSearch(false); }}
        isDesktop={false}
        onMatchLook={() => { setShowSearch(false); setShowImageMatchModal(true); }}
      />

      {/* Chatbot FAB */}
      {!chatOpen && (
        <div onClick={() => setChatOpen(true)} style={{ position: "absolute", bottom: 96, right: 18, zIndex: 50, cursor: "pointer" }}>
          {tipVisible && (
            <div className="tip-anim" style={{ position: "absolute", bottom: 58, right: 0, background: "white", borderRadius: "14px 14px 4px 14px", padding: "9px 13px", fontSize: 12, color: tokens.onSurfaceDefault, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", maxWidth: 198, lineHeight: 1.4, display: "flex", alignItems: "flex-start", gap: 6 }}>
              <span style={{ flex: 1 }}>💡 "Quiet Luxury" sofa + rug is a bestseller combo!</span>
              <button onClick={e => { e.stopPropagation(); setTipVisible(false); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1, color: tokens.onSurfaceSecondary, fontSize: 13, flexShrink: 0, marginTop: 1 }}>✕</button>
            </div>
          )}
          <div style={{ width: 50, height: 50, background: `linear-gradient(135deg,${tokens.primaryDefault},${tokens.secondaryDefault})`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, boxShadow: `0 4px 18px rgba(235,89,95,0.38)`, border: "2.5px solid white" }}>🪴</div>
        </div>
      )}

      {/* Chat Panel */}
      {chatOpen && (
        <div style={{ position: "absolute", inset: 0, background: tokens.surfaceBg, zIndex: 100, display: "flex", flexDirection: "column" }}>
          <div style={{ background: tokens.onSurfaceDefault, padding: "56px 20px 18px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ width: 42, height: 42, background: `linear-gradient(135deg,${tokens.primaryDefault},${tokens.secondaryDefault})`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🪴</div>
            <div><div style={{ fontSize: 15, fontWeight: 500, color: "white" }}>Livy</div><div style={{ fontSize: 11, color: tokens.tertiaryGreenV1, marginTop: 2 }}>● Design Assistant · Online</div></div>
            <button onClick={() => setChatOpen(false)} style={{ marginLeft: "auto", width: 34, height: 34, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", color: "white", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>
          <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
            {chatMsgs.map((m, i) => (
              <div key={i} style={{ maxWidth: "76%", alignSelf: m.role === "bot" ? "flex-start" : "flex-end" }}>
                <div style={{ padding: "11px 14px", borderRadius: 18, fontSize: 13, lineHeight: 1.5, background: m.role === "bot" ? "white" : tokens.primaryDefault, color: m.role === "bot" ? tokens.onSurfaceDefault : "white", borderBottomLeftRadius: m.role === "bot" ? 5 : 18, borderBottomRightRadius: m.role === "user" ? 5 : 18, boxShadow: m.role === "bot" ? "0 1px 6px rgba(0,0,0,0.07)" : "none" }} dangerouslySetInnerHTML={{ __html: m.text }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", padding: "0 16px 10px", flexShrink: 0 }}>
            {["Show budget version", "Make it warmer", "Under ₹1.5L", "Mix looks"].map(q => (
              <button key={q} onClick={() => sendMsg(q)} style={{ background: "var(--surface-variant, #E6E6E6)", border: "none", borderRadius: 99, padding: "7px 13px", fontSize: 12, color: tokens.onSurfaceDefault, cursor: "pointer", fontFamily: "var(--font-roboto)", fontWeight: "var(--font-weight-semibold)" }}>{q}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 9, padding: "10px 14px", background: "white", borderTop: `1px solid ${tokens.surfaceVariant}`, flexShrink: 0 }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendFromInput()} placeholder="Ask Livy anything…" style={{ flex: 1, background: tokens.surfaceBg, border: "none", borderRadius: 18, padding: "11px 15px", fontSize: 13, fontFamily: "'Roboto',sans-serif", color: tokens.onSurfaceDefault, outline: "none" }} />
            <button onClick={sendFromInput} style={{ width: 42, height: 42, background: tokens.primaryDefault, border: "none", borderRadius: "50%", cursor: "pointer", fontSize: 16, color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>↑</button>
          </div>
        </div>
      )}
    </div>
  );
}

function LooksRow({ looks, goTo, showToast, last, onExplore, wishlist, onToggleWishlist }: { looks: any[]; goTo: (id: ScreenId) => void; showToast: (m: string) => void; last?: boolean; onExplore?: (look: any) => void; wishlist?: any[]; onToggleWishlist?: (look: any) => void }) {
  return (
    <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: `0 24px ${last ? "96px" : "4px"}`, marginBottom: last ? 0 : 24 }}>
      {looks.map((l, i) => {
        const isWishlisted = wishlist?.some(w => w.name === l.name) ?? false;
        return (
          <div key={i} onClick={() => { if (onExplore) onExplore(l); goTo("explorer"); }} style={{ flexShrink: 0, width: 210, background: tokens.surfaceDefault, borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", cursor: "pointer", border: `1.5px solid ${l.featured ? tokens.extendedMustard : tokens.surfaceVariant}`, transition: "all 0.18s" }}>
            <div style={{ width: "100%", height: 142, position: "relative", overflow: "hidden" }}>
              {l.img
                ? <img src={l.img} alt={l.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#E8D8C4,#D4C0A8)" }} />}
              {l.badge && <div style={{ position: "absolute", top: 10, left: 10, padding: "4px 9px", borderRadius: 6, fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", background: l.badge.cls === "gold" ? tokens.extendedMustard : tokens.primaryDefault, color: l.badge.cls === "gold" ? tokens.onSurfaceDefault : "white" }}>{l.badge.text}</div>}
              <button onClick={e => { e.stopPropagation(); onToggleWishlist?.(l); }} style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, background: isWishlisted ? tokens.primaryDefault : "rgba(255,255,255,0.88)", border: "none", borderRadius: "50%", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>{isWishlisted ? "❤️" : "🤍"}</button>
            </div>
            <div style={{ padding: "12px 14px 14px" }}>
              <span style={{ display: "inline-block", background: tokens.surfaceBg, borderRadius: 5, padding: "3px 8px", fontSize: 9, fontWeight: 600, color: tokens.onSurfaceSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>{l.tag}</span>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 600, color: tokens.onSurfaceDefault, marginTop: 5 }}>{l.name}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 7 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: tokens.onSurfaceDefault }}>{l.price}</span>
                <span style={{ fontSize: 11, color: tokens.onSurfaceSecondary }}>{l.items}</span>
              </div>
              <div style={{ display: "flex", gap: 7, marginTop: 9 }}>
                <button style={{ flex: 1, background: tokens.onSurfaceDefault, color: "white", border: "none", borderRadius: 9, padding: 9, fontSize: 11, fontWeight: 500, fontFamily: "'Roboto',sans-serif", cursor: "pointer" }}>Explore Look</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ════��═�����═══════════════════════════════
   SCREEN 6: EXPLORER
══════════════════════════════════════ */

/* lookHotspots removed — hotspot positions now come from lb_look_products in the DB */
const _lookHotspots_REMOVED = null; void _lookHotspots_REMOVED;
/* kept stub so git diff is clear */ const __STUB = {
  "Quiet Luxury": [
    { bottom: "34%", left: "22%", n: 1, key: "sofa" },
    { bottom: "22%", left: "46%", n: 2, key: "table" },
    { top: "30%", right: "14%", n: 3, key: "tv" },
    { bottom: "30%", right: "20%", n: 4, key: "plant" },
  ],
  "Desert Bloom": [
    { bottom: "30%", left: "18%", n: 1, key: "sofa" },
    { bottom: "14%", left: "40%", n: 2, key: "rug" },
    { bottom: "40%", right: "12%", n: 3, key: "plant" },
    { bottom: "20%", left: "54%", n: 4, key: "table" },
  ],
  "Wabi Sabi": [
    { bottom: "28%", left: "20%", n: 1, key: "sofa" },
    { bottom: "16%", left: "42%", n: 2, key: "table" },
    { top: "32%", right: "18%", n: 3, key: "plant" },
    { bottom: "10%", left: "32%", n: 4, key: "rug" },
  ],
  "Blue Lagoon": [
    { bottom: "32%", left: "16%", n: 1, key: "sofa" },
    { bottom: "18%", left: "44%", n: 2, key: "table" },
    { top: "22%", left: "28%", n: 3, key: "tv" },
    { bottom: "36%", right: "14%", n: 4, key: "plant" },
  ],
  "Forest Breath": [
    { bottom: "30%", left: "24%", n: 1, key: "sofa" },
    { bottom: "38%", right: "10%", n: 2, key: "plant" },
    { bottom: "18%", left: "46%", n: 3, key: "table" },
    { bottom: "10%", left: "28%", n: 4, key: "rug" },
  ],
  "Simply Chic": [
    { bottom: "32%", left: "22%", n: 1, key: "sofa" },
    { bottom: "20%", left: "44%", n: 2, key: "table" },
    { top: "24%", left: "30%", n: 3, key: "tv" },
    { bottom: "32%", right: "16%", n: 4, key: "plant" },
  ],
  /* ── Bedroom ── */
  "Serene Slumber": [
    { bottom: "32%", left: "30%", n: 1, key: "bed" },
    { bottom: "28%", left: "10%", n: 2, key: "nightstand" },
    { bottom: "40%", right: "16%", n: 3, key: "lamp" },
    { top: "18%", left: "14%", n: 4, key: "wardrobe" },
  ],
  "Dream Weaver": [
    { bottom: "30%", left: "26%", n: 1, key: "bed" },
    { bottom: "36%", right: "14%", n: 2, key: "lamp" },
    { bottom: "24%", left: "12%", n: 3, key: "nightstand" },
    { bottom: "10%", left: "34%", n: 4, key: "rug" },
  ],
  "Still Waters": [
    { bottom: "28%", left: "28%", n: 1, key: "bed" },
    { bottom: "24%", left: "12%", n: 2, key: "nightstand" },
    { top: "20%", left: "12%", n: 3, key: "wardrobe" },
    { top: "30%", right: "20%", n: 4, key: "plant" },
  ],
  "Ocean Lullaby": [
    { bottom: "32%", left: "22%", n: 1, key: "bed" },
    { bottom: "26%", left: "8%", n: 2, key: "nightstand" },
    { bottom: "38%", right: "18%", n: 3, key: "lamp" },
    { bottom: "10%", left: "32%", n: 4, key: "rug" },
  ],
  "Green Canopy": [
    { bottom: "30%", left: "24%", n: 1, key: "bed" },
    { top: "20%", right: "12%", n: 2, key: "plant" },
    { bottom: "38%", right: "22%", n: 3, key: "lamp" },
    { bottom: "24%", right: "10%", n: 4, key: "nightstand" },
  ],
  "Pure Rest": [
    { bottom: "32%", left: "28%", n: 1, key: "bed" },
    { bottom: "26%", left: "10%", n: 2, key: "nightstand" },
    { top: "22%", right: "20%", n: 3, key: "lamp" },
    { top: "20%", left: "10%", n: 4, key: "wardrobe" },
  ],
  /* ── Bath ── */
  "Marble Sanctuary": [
    { bottom: "22%", left: "28%", n: 1, key: "vanity" },
    { top: "16%", left: "36%", n: 2, key: "mirror" },
    { bottom: "32%", right: "10%", n: 3, key: "towelRail" },
    { top: "12%", right: "22%", n: 4, key: "pendant" },
  ],
  "Earthy Escape": [
    { bottom: "20%", left: "24%", n: 1, key: "vanity" },
    { top: "20%", left: "30%", n: 2, key: "mirror" },
    { bottom: "30%", right: "14%", n: 3, key: "towelRail" },
    { top: "12%", left: "52%", n: 4, key: "pendant" },
  ],
  "Onsen Ritual": [
    { bottom: "18%", left: "26%", n: 1, key: "vanity" },
    { top: "16%", left: "32%", n: 2, key: "mirror" },
    { top: "28%", right: "12%", n: 3, key: "towelRail" },
    { top: "10%", left: "48%", n: 4, key: "pendant" },
  ],
  "Shore Wash": [
    { bottom: "22%", left: "22%", n: 1, key: "vanity" },
    { top: "18%", left: "30%", n: 2, key: "mirror" },
    { bottom: "34%", right: "12%", n: 3, key: "towelRail" },
    { top: "12%", right: "24%", n: 4, key: "pendant" },
  ],
  "Stone & Moss": [
    { bottom: "20%", left: "26%", n: 1, key: "vanity" },
    { top: "20%", left: "34%", n: 2, key: "mirror" },
    { bottom: "30%", right: "10%", n: 3, key: "towelRail" },
    { top: "10%", left: "50%", n: 4, key: "pendant" },
  ],
  "Clean Slate": [
    { bottom: "22%", left: "28%", n: 1, key: "vanity" },
    { top: "18%", left: "36%", n: 2, key: "mirror" },
    { bottom: "32%", right: "12%", n: 3, key: "towelRail" },
    { top: "14%", right: "20%", n: 4, key: "pendant" },
  ],
  /* ── Kitchen ── */
  "Chef's Canvas": [
    { bottom: "24%", left: "32%", n: 1, key: "counter" },
    { top: "18%", left: "22%", n: 2, key: "cabinet" },
    { bottom: "14%", right: "20%", n: 3, key: "stool" },
    { top: "10%", left: "46%", n: 4, key: "pendant" },
  ],
  "Harvest Table": [
    { bottom: "26%", left: "28%", n: 1, key: "counter" },
    { top: "16%", left: "20%", n: 2, key: "cabinet" },
    { bottom: "14%", right: "18%", n: 3, key: "stool" },
    { top: "10%", left: "48%", n: 4, key: "pendant" },
  ],
  "Umami Space": [
    { bottom: "22%", left: "34%", n: 1, key: "counter" },
    { top: "14%", left: "24%", n: 2, key: "cabinet" },
    { bottom: "12%", right: "22%", n: 3, key: "stool" },
    { top: "10%", left: "50%", n: 4, key: "pendant" },
  ],
  "Aqua Kitchen": [
    { bottom: "24%", left: "30%", n: 1, key: "counter" },
    { top: "18%", left: "18%", n: 2, key: "cabinet" },
    { bottom: "14%", right: "16%", n: 3, key: "stool" },
    { top: "12%", left: "44%", n: 4, key: "pendant" },
  ],
  "Garden Kitchen": [
    { bottom: "26%", left: "32%", n: 1, key: "counter" },
    { top: "20%", left: "20%", n: 2, key: "cabinet" },
    { bottom: "34%", right: "14%", n: 3, key: "plant" },
    { top: "10%", left: "46%", n: 4, key: "pendant" },
  ],
  "Clean Cook": [
    { bottom: "22%", left: "30%", n: 1, key: "counter" },
    { top: "18%", left: "22%", n: 2, key: "cabinet" },
    { bottom: "14%", right: "18%", n: 3, key: "stool" },
    { top: "12%", left: "46%", n: 4, key: "pendant" },
  ],
}; void __STUB;

function ExplorerScreen({ goTo, goBack, cartCount, showToast, addItem, selectedLook, setSelectedLook, wishlist, toggleWishlist, isDesktop, setLookSimilarityData, setPrevScreen, setScreen, moodboardData, setMoodboardData, lookProducts, setLookProducts, onPlaceOrder }: { goTo: (id: ScreenId) => void; goBack: () => void; cartCount: number; showToast: (m: string) => void; addItem: (k: string, p: number, n: string, emoji?: string, category?: string) => void; selectedLook?: SelectedLook | null; setSelectedLook: (l: SelectedLook) => void; wishlist?: any[]; toggleWishlist?: (look: any) => void; isDesktop?: boolean; setLookSimilarityData: (data: any) => void; setPrevScreen: (id: ScreenId) => void; setScreen: (id: ScreenId) => void; moodboardData: any; setMoodboardData: (data: any) => void; lookProducts: any[]; setLookProducts: (products: any[]) => void; onPlaceOrder?: () => void }) {
  const [bsItem, setBsItem] = useState<string | null>(null);   // now holds product UUID
  const [selectedAlt, setSelectedAlt] = useState(0);
  const [tappedHsId, setTappedHsId] = useState<string | null>(null);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [showARViewer, setShowARViewer] = useState(false);
  const itemsScrollRef = useRef<HTMLDivElement>(null);
  const [similarLooks, setSimilarLooks] = useState<any[]>([]);
  const [activeTier, setActiveTier] = useState<"eco" | "standard" | "premium">("standard");
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());

  /* ── Moodboard ── */
  const [explorerTab, setExplorerTab] = useState<"items" | "moodboard">("moodboard");
  // Using lifted moodboard state from App level: moodboardData, setMoodboardData
  const [moodboardLoading, setMoodboardLoading] = useState(false);
  const [moodboardError, setMoodboardError] = useState<string | null>(null);
  const moodboardCacheRef = useRef<Map<string, any>>(new Map());

  // Scroll tracking removed - using sticky positioning instead
  const [bookingStep, setBookingStep] = useState<1|2|3>(1);
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [selectedDateIdx, setSelectedDateIdx] = useState<number|null>(null);
  const [selectedTime, setSelectedTime] = useState<string|null>(null);

  const savedAddresses = [
    { label: "Home", full: "13252, Prestige Lakeside Habitat, SH Nagar, Bengaluru - 560037" },
    { label: "Office", full: "Bagmane Tech Park, CV Raman Nagar, Bengaluru - 560093" },
  ];
  const bookingDates = [
    { day: "Mon", date: 23 }, { day: "Tue", date: 24 }, { day: "Wed", date: 25 },
    { day: "Thu", date: 26 }, { day: "Fri", date: 27 },
  ];
  const timeSlots = ["10:00 AM", "01:00 PM", "04:00 PM", "07:00 PM"];
  function closeBooking() { setShowBookingFlow(false); setBookingStep(1); setSelectedDateIdx(null); setSelectedTime(null); }

  /* ── Fetch moodboard from Gemini via server ── */
  const fetchMoodboard = useCallback(async () => {
    if (!selectedLook?.id || !selectedLook?.img) return;
    const cached = moodboardCacheRef.current.get(selectedLook.id);
    if (cached) { setMoodboardData(cached); return; }
    setMoodboardLoading(true);
    setMoodboardError(null);
    try {
      const resp = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ef09e2ac/moodboard`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${publicAnonKey}` },
          body: JSON.stringify({ look_id: selectedLook.id, image_url: selectedLook.img, look_name: selectedLook.name, style_name: selectedLook.tag }),
        }
      );
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      moodboardCacheRef.current.set(selectedLook.id, data);
      setMoodboardData(data);
    } catch (err: any) {
      console.log("Moodboard fetch error:", err.message);
      setMoodboardError(err.message);
    } finally {
      setMoodboardLoading(false);
    }
  }, [selectedLook, setMoodboardData]);

  /* Trigger fetch when tab switches to moodboard */
  useEffect(() => {
    if (explorerTab === "moodboard") fetchMoodboard();
  }, [explorerTab, fetchMoodboard]);

  /* Reset tab when look changes */
  useEffect(() => {
    setExplorerTab("moodboard");
    setMoodboardData(null);
    setMoodboardError(null);
    setActiveTier("standard");
    setSelectedAddons(new Set());
  }, [selectedLook?.id, setMoodboardData]);

  /* ── Fetch similar looks (same room or style) ── */
  useEffect(() => {
    if (!selectedLook?.id) return;
    setSimilarLooks([]);
    (async () => {
      try {
        const { data: looks } = await supabase
          .from("lb_looks")
          .select("id, name, image_url, price, style:lb_styles(name), room:lb_rooms(slug)")
          .neq("id", selectedLook.id)
          .limit(30);
        const roomSlug = (selectedLook as any).roomSlug ?? "";
        const styleTag = selectedLook.tag ?? "";
        const mapped = (looks ?? []).map((l: any) => ({
          id: l.id,
          img: l.image_url,
          name: l.name,
          tag: (l.style as any)?.name ?? "",
          price: `₹${(l.price ?? 0).toLocaleString("en-IN")}`,
          items: "",
          room: (l.room as any)?.slug ?? "",
          roomSlug: (l.room as any)?.slug ?? "",
        }));
        const scored = mapped
          .map(l => ({ ...l, _score: (l.roomSlug === roomSlug ? 1 : 0) + (l.tag === styleTag ? 1 : 0) }))
          .sort((a, b) => b._score - a._score);
        setSimilarLooks(scored.slice(0, 6));
      } catch (err: any) {
        console.log("Similar looks fetch error:", err.message);
      }
    })();
  }, [selectedLook?.id]);

  /* Fetch hotspot products whenever the selected look changes */
  useEffect(() => {
    if (!selectedLook?.id) return;
    setProductsLoading(true);
    setBsItem(null);
    if (itemsScrollRef.current) itemsScrollRef.current.scrollTop = 0;
    (async () => {
      try {
        /* 1 — hotspot rows with product details */
        const { data: lps, error } = await supabase
          .from("lb_look_products")
          .select("x_percent, y_percent, is_featured, product:lb_products(id, name, category, brand, price, description, image_url, in_stock)")
          .eq("look_id", selectedLook.id);
        if (error) throw new Error(`Look products: ${error.message}`);

        const productIds = (lps ?? []).map((lp: any) => lp.product?.id).filter(Boolean);

        /* 2 — alternatives for all products in one shot */
        const { data: alts } = productIds.length
          ? await supabase
              .from("lb_product_alternatives")
              .select("product_id, sort_order, alternative:lb_products!alternative_product_id(id, name, price, category, image_url)")
              .in("product_id", productIds)
              .order("sort_order")
          : { data: [] };

        const altMap = (alts ?? []).reduce((acc: Record<string, any[]>, row: any) => {
          if (!acc[row.product_id]) acc[row.product_id] = [];
          acc[row.product_id].push(row.alternative);
          return acc;
        }, {});

        const result = (lps ?? []).map((lp: any) => {
          const p = lp.product ?? {};
          return {
            id: p.id, name: p.name, category: p.category, brand: p.brand,
            price: p.price, description: p.description, image_url: p.image_url,
            in_stock: p.in_stock, x_percent: lp.x_percent, y_percent: lp.y_percent,
            is_featured: lp.is_featured, alternatives: altMap[p.id] ?? [],
          };
        });
        setLookProducts(result);
      } catch (err: any) {
        console.log("Explorer products fetch error:", err);
      } finally {
        setProductsLoading(false);
      }
    })();
  }, [selectedLook?.id]);

  const room = selectedLook?.room ?? "Living\nRoom";

  /* Items grid — sorted so featured (primary) product appears first */
  const items = [...lookProducts].sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));

  /* ── Tier-adjusted items ── */
  const tierMultiplier = activeTier === "eco" ? 0.65 : activeTier === "premium" ? 1.45 : 1;
  const tieredItems = items.map(it => {
    if (activeTier === "standard") return it;
    const alts: any[] = it.alternatives ?? [];
    if (activeTier === "eco") {
      const alt = alts[0];
      return alt
        ? { ...it, id: alt.id, name: alt.name, price: alt.price, category: alt.category ?? it.category, image_url: alt.image_url ?? it.image_url }
        : { ...it, price: Math.round(((it.price ?? 0) * 0.65) / 500) * 500 };
    }
    // premium — use the last (most expensive) alternative
    const alt = alts[alts.length - 1];
    return alt
      ? { ...it, id: alt.id, name: alt.name, price: alt.price, category: alt.category ?? it.category, image_url: alt.image_url ?? it.image_url }
      : { ...it, price: Math.round(((it.price ?? 0) * 1.45) / 500) * 500 };
  });

  /* ── Tier-adjusted total price ── */
  const basePriceNum = parseInt((selectedLook?.price ?? "").replace(/[₹,\s]/g, ""), 10) || 0;
  const adjustedPriceNum = Math.round((basePriceNum * tierMultiplier) / 1000) * 1000;
  const displayPrice = basePriceNum
    ? `₹${adjustedPriceNum.toLocaleString("en-IN")}`
    : (selectedLook?.price ?? "₹2,14,000");

  /* Hotspots derived from DB x/y percentages */
  const hotspots = lookProducts.map((p, i) => ({
    id: p.id, n: i + 1,
    left: `${p.x_percent}%`, top: `${p.y_percent}%`,
    name: p.name, price: p.price, category: p.category, xPct: p.x_percent,
  }));

  const currentItem = bsItem ? lookProducts.find(p => p.id === bsItem) ?? null : null;

  /* ── Two-flow classification ── */
  const hasServiceItem = lookProducts.some(p => SERVICE_CATEGORIES.has(p.category));

  /* ── Shared hotspot + item render helpers ── */
  const HotspotLayer = () => (
    <>
      {hotspots.map((h) => (
        <div key={h.id} onClick={() => { setBsItem(h.id); setSelectedAlt(0); }} style={{ position: "absolute", left: h.left, top: h.top, transform: "translate(-50%,-50%)", cursor: "pointer", zIndex: 10 }}>
          <div className="hs-dot-anim" onClick={(e) => { e.stopPropagation(); setTappedHsId(prev => prev === h.id ? null : h.id); }} style={{ width: 26, height: 26, background: tappedHsId === h.id ? tokens.primaryDefault : "rgba(255,255,255,0.95)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: tappedHsId === h.id ? "white" : tokens.onSurfaceDefault, transition: "all 0.15s", position: "relative" }}>
            {h.n}
            {tappedHsId === h.id && (
              <div onClick={(e) => { e.stopPropagation(); setBsItem(h.id); setSelectedAlt(0); setTappedHsId(null); }} style={{ position: "absolute", top: "50%", left: (h.xPct ?? 50) > 55 ? "auto" : "calc(100% + 12px)", right: (h.xPct ?? 50) > 55 ? "calc(100% + 12px)" : "auto", transform: "translateY(-50%)", background: "white", borderRadius: 10, padding: "12px 14px", minWidth: 172, boxShadow: "0 6px 28px rgba(0,0,0,0.20)", cursor: "pointer", zIndex: 30, display: "flex", alignItems: "flex-start", gap: 10, whiteSpace: "normal" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, textTransform: "uppercase", letterSpacing: "0.01em", wordBreak: "break-word" }}>{h.name}</div>
                  <div style={{ fontSize: 11, color: "#666666", marginTop: 3, textTransform: "capitalize" }}>{h.category}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>₹{(h.price ?? 0).toLocaleString("en-IN")}</div>
                </div>
                <div style={{ fontSize: 18, color: "#1A1A1A", flexShrink: 0, marginTop: 1 }}>›</div>
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );

  /* ── Moodboard Content ── */
  const MoodboardContent = () => {
    if (moodboardLoading) {
      return (
        <div style={{ padding: "24px 0", display: "flex", flexDirection: "column", gap: 16 }}>
          {[70, 50, 80, 40, 60].map((w, i) => (
            <div key={i} style={{ height: i === 0 ? 56 : i === 2 ? 48 : 28, width: `${w}%`, borderRadius: 10, background: "linear-gradient(90deg,rgba(255,255,255,0.08) 25%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.08) 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
          ))}
          <div style={{ textAlign: "center", paddingTop: 8, color: "rgba(255,255,255,0.3)", fontSize: 12 }}>Analysing look with Gemini Vision…</div>
        </div>
      );
    }
    if (moodboardError) {
      return (
        <div style={{ padding: "32px 0", textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>🎨</div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}>Moodboard generation failed.</div>
          {moodboardError && (
            <div style={{ margin: "0 auto 16px", maxWidth: 280, background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.25)", borderRadius: 8, padding: "10px 14px", textAlign: "left" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,120,120,0.8)", textTransform: "uppercase", marginBottom: 4 }}>Error detail</div>
              <div style={{ fontSize: 11, color: "rgba(255,180,180,0.9)", lineHeight: 1.55, wordBreak: "break-word", fontFamily: "monospace" }}>{moodboardError}</div>
            </div>
          )}
          <button onClick={fetchMoodboard} style={{ background: "var(--primary)", color: "var(--primary-foreground)", border: "none", borderRadius: 9999, padding: "0 22px", height: 48, fontSize: "var(--text-sm)", cursor: "pointer", fontFamily: "var(--font-gilroy)", fontWeight: "var(--font-weight-medium)" }}>↺ Try Again</button>
        </div>
      );
    }
    if (!moodboardData) return null;

    const palette: { hex: string; name: string }[] = moodboardData.palette ?? [];
    const moodWords: string[] = moodboardData.mood_words ?? [];
    const materials: string[] = moodboardData.materials ?? [];
    const ambience: string = moodboardData.ambience ?? "";
    const principles: string[] = moodboardData.design_principles ?? [];

    return (
      <div style={{ paddingBottom: 16 }}>
        {/* Ambience */}
        {ambience && (
          <div style={{ margin: "0 0 20px", padding: "16px 18px", background: "rgba(255,255,255,0.05)", borderRadius: 14, borderLeft: `3px solid ${tokens.primaryDefault}` }}>
            <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: tokens.primaryDefault, fontWeight: 600, marginBottom: 6 }}>✦ AMBIENCE</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, color: "rgba(255,255,255,0.88)", lineHeight: 1.65, fontStyle: "italic" }}>"{ambience}"</div>
          </div>
        )}

        {/* Colour Palette */}
        {palette.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 600, marginBottom: 12 }}>COLOUR PALETTE</div>
            <div style={{ display: "flex", gap: 8 }}>
              {palette.map((c, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ width: "100%", aspectRatio: "1", borderRadius: 12, background: c.hex, boxShadow: "0 2px 12px rgba(0,0,0,0.3)", border: "1.5px solid rgba(255,255,255,0.08)" }} />
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", textAlign: "center", lineHeight: 1.3, fontWeight: 500 }}>{c.name}</div>
                  <div style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", textAlign: "center", fontFamily: "monospace" }}>{c.hex}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mood Words */}
        {moodWords.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 600, marginBottom: 10 }}>MOOD</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {moodWords.map((w, i) => (
                <span key={i} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, background: i % 3 === 0 ? `${tokens.primaryDefault}22` : i % 3 === 1 ? "rgba(255,255,255,0.07)" : `${tokens.extendedMustard}22`, border: `1px solid ${i % 3 === 0 ? tokens.primaryDefault + "55" : i % 3 === 1 ? "rgba(255,255,255,0.14)" : tokens.extendedMustard + "55"}`, color: i % 3 === 0 ? tokens.primaryDefault : i % 3 === 2 ? tokens.extendedMustard : "rgba(255,255,255,0.75)" }}>{w}</span>
              ))}
            </div>
          </div>
        )}

        {/* Materials */}
        {materials.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 600, marginBottom: 10 }}>MATERIALS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {materials.map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)" }}>
                  <span style={{ fontSize: 14 }}>{["🪵","🪨","🧵","🪟","🌿","💡","🔩"][i % 7]}</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.78)", textTransform: "capitalize" }}>{m}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Design Principles */}
        {principles.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 600, marginBottom: 10 }}>DESIGN PRINCIPLES</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {principles.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: tokens.primaryDefault, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <span style={{ color: "white", fontSize: 10, fontWeight: 700 }}>✓</span>
                  </div>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", lineHeight: 1.5 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <button 
            onClick={() => {
              console.log('[View Similar] Clicked for look:', selectedLook?.name);
              // Set the look similarity data from current moodboard
              setLookSimilarityData({
                palette,
                style: selectedLook?.tag || "",
                materials,
                ambience,
                moodWords,
                principles
              });
              setPrevScreen("explorer");
              setScreen("matched-looks");
            }}
            style={{ 
              flex: 1, 
              background: "var(--surface-variant, #E6E6E6)", 
              color: tokens.onSurfaceDefault, 
              border: "none", 
              borderRadius: 99, 
              height: 44, 
              fontSize: 13, 
              fontWeight: "var(--font-weight-semibold)", 
              fontFamily: "var(--font-roboto)", 
              cursor: "pointer",
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              gap: 6
            }}
          >
            🔍 View Similar
          </button>
        </div>

        {/* Full Moodboard Button — hidden */}

        {/* ── Similar Looks ── */}
        {similarLooks.length > 0 && (
          <>
            {/* Divider */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "4px 0 20px" }} />

            {/* Heading row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                fontWeight: "var(--font-weight-semibold)",
                fontFamily: "var(--font-gilroy)",
              }}>
                Similar Looks
              </div>
              <button
                onClick={() => {
                  setLookSimilarityData({
                    palette,
                    style: selectedLook?.tag || "",
                    materials,
                    ambience,
                    moodWords,
                    principles
                  });
                  setPrevScreen("explorer");
                  setScreen("matched-looks");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--primary)",
                  fontSize: 11,
                  fontWeight: "var(--font-weight-medium)",
                  fontFamily: "var(--font-gilroy)",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                See all <span style={{ fontSize: 13 }}>›</span>
              </button>
            </div>

            {/* 3-column grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
              {similarLooks.slice(0, 6).map((look) => (
                <div
                  key={look.id}
                  onClick={() => setSelectedLook(look as SelectedLook)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Thumbnail */}
                  <div style={{
                    aspectRatio: "1",
                    borderRadius: "var(--radius-md, 10px)",
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.06)",
                    marginBottom: 7,
                    border: "1px solid rgba(255,255,255,0.08)",
                    position: "relative",
                  }}>
                    {look.img ? (
                      <img
                        src={look.img}
                        alt={look.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))" }} />
                    )}
                    {/* Style tag pill */}
                    {look.tag && (
                      <div style={{
                        position: "absolute",
                        bottom: 5,
                        left: 5,
                        background: "rgba(0,0,0,0.55)",
                        backdropFilter: "blur(4px)",
                        borderRadius: 4,
                        padding: "2px 5px",
                        fontSize: 8,
                        fontWeight: "var(--font-weight-semibold)",
                        fontFamily: "var(--font-gilroy)",
                        color: "rgba(255,255,255,0.85)",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        maxWidth: "calc(100% - 10px)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}>
                        {look.tag}
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.75)",
                    lineHeight: 1.35,
                    fontFamily: "var(--font-gilroy)",
                    fontWeight: "var(--font-weight-medium)",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    marginBottom: 3,
                  }}>
                    {look.name}
                  </div>

                  {/* Price */}
                  <div style={{
                    fontSize: 11,
                    color: "var(--primary)",
                    fontWeight: "var(--font-weight-semibold)",
                    fontFamily: "var(--font-gilroy)",
                  }}>
                    {look.price}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Gemini attribution */}
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: 0.35 }}>
          <span style={{ fontSize: 10, color: "white" }}>✨ Generated by Gemini Vision</span>
        </div>
      </div>
    );
  };

  /* ── Tab Switcher ── */
  const TabBar = ({ compact = false }: { compact?: boolean }) => (
    <div style={{ display: "flex", background: compact ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.06)", borderRadius: 10, padding: 3, gap: 2, flexShrink: 0 }}>
      {([["moodboard", "🎨 Moodboard"], ["items", "🛒 Items"]] as const).map(([key, label]) => (
        <button key={key} onClick={() => setExplorerTab(key)}
          style={{
            flex: 1,
            height: compact ? 30 : 36,
            background: "transparent",
            border: "none",
            borderBottom: explorerTab === key ? "2.5px solid var(--primary)" : "2.5px solid transparent",
            borderRadius: 0,
            cursor: "pointer",
            fontSize: compact ? 11 : 13,
            fontWeight: explorerTab === key ? "var(--font-weight-semibold)" : "var(--font-weight-regular)",
            fontFamily: "var(--font-gilroy)",
            color: explorerTab === key ? "var(--primary)" : "var(--on-surface-muted, #888)",
            transition: "color 0.18s, border-color 0.18s",
            boxShadow: "none",
            padding: "0 4px",
            letterSpacing: "0.01em"
          }}>
          {label}
        </button>
      ))}
    </div>
  );

  /* ── Desktop Explorer Layout ── */
  if (isDesktop) {
    return (
      <div style={{ flex: 1, display: "flex", background: tokens.onSurfaceDefault, overflow: "hidden", position: "relative" }}>
        {/* Left: Room Carousel */}
        <div style={{ width: "55%", height: "100%", position: "relative", flexShrink: 0, overflow: "hidden" }}>
          <LookCarousel
            mainImage={selectedLook?.img ?? ""}
            lookName={selectedLook?.name}
            room={selectedLook?.room ?? "living"}
            height="100%"
            showArrows
            onSlideChange={() => {}}
          >
            {/* Top bar */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "28px 24px 20px", background: "linear-gradient(to bottom,rgba(0,0,0,0.52),transparent)", zIndex: 6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button onClick={() => goTo("gallery")} style={{ width: 40, height: 40, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "none", borderRadius: "50%", cursor: "pointer", color: "white", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
              <div style={{ display: "flex", gap: 8 }}>
                {(() => { const isWishlisted = wishlist?.some(w => w.name === selectedLook?.name) ?? false; return <button onClick={() => { if (selectedLook) toggleWishlist?.(selectedLook); }} style={{ width: 40, height: 40, background: isWishlisted ? tokens.primaryDefault : "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", border: "none", borderRadius: "50%", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{isWishlisted ? "❤️" : "🤍"}</button>; })()}
                <button onClick={() => showToast("🔗 Link copied!")} style={{ width: 40, height: 40, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", border: "none", borderRadius: "50%", cursor: "pointer", color: "white", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>↗</button>
                <button onClick={() => goTo("cart")} style={{ width: 40, height: 40, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", border: "none", borderRadius: "50%", cursor: "pointer", color: "white", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <ShoppingCart size={18} color="white" strokeWidth={2} />
                  {cartCount > 0 && <div style={{ position: "absolute", top: -2, right: -2, width: 14, height: 14, background: tokens.primaryDefault, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "white" }}>{cartCount}</div>}
                </button>
              </div>
            </div>
            {/* Hotspots — visible only when Items tab is active */}
            {explorerTab === "items" && <div style={{ position: "absolute", inset: 0, zIndex: 5 }}><HotspotLayer /></div>}
            {/* Bottom info overlay */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "88px 28px 28px", background: "linear-gradient(to top,rgba(0,0,0,0.75),transparent)", zIndex: 6, pointerEvents: "none" }}>
              <span style={{ display: "inline-block", background: "rgba(255,255,255,0.18)", backdropFilter: "blur(4px)", borderRadius: 5, padding: "3px 9px", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.85)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>{selectedLook?.tag ?? "Modern Zen"}</span>
              <div style={{ fontFamily: "var(--font-gilroy)", fontSize: 32, fontWeight: "var(--font-weight-semibold)", color: "white", lineHeight: 1.15 }}>{selectedLook?.name ?? "Quiet Luxury"}</div>
              <div style={{ display: "flex", gap: 18, marginTop: 10, alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>📦 {lookProducts.length > 0 ? `${lookProducts.length} items` : (selectedLook?.items ?? "…")}</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>🚚 45-day delivery</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: "white", marginLeft: "auto" }}>{selectedLook?.price ?? "₹2,14,000"}</span>
              </div>
            </div>
          </LookCarousel>
        </div>

        {/* Right: Products + CTA */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#2C2C2C", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px 10px", flexShrink: 0 }}>
            <TabBar />
          </div>
          {explorerTab === "items" && <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 16px" }}>
            {/* Items Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, alignContent: "start" }}>
            {productsLoading && [1,2,3,4].map(i => <div key={i} style={{ height: 160, borderRadius: 14, background: "linear-gradient(90deg,#3a3a3a 25%,#444 50%,#3a3a3a 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />)}
            {items.map(it => {
              const isSvc = SERVICE_CATEGORIES.has(it.category);
              const isSelected = tappedHsId === it.id;
              return (
                <div
                  key={it.id}
                  onClick={() => setTappedHsId(isSelected ? null : it.id)}
                  style={{
                    background: tokens.surfaceDefault,
                    borderRadius: 14,
                    overflow: "hidden",
                    cursor: "pointer",
                    border: isSelected
                      ? `2px solid var(--primary)`
                      : `1.5px solid ${isSvc ? tokens.extendedMustard : tokens.surfaceVariant}`,
                    boxShadow: isSelected ? "0 0 0 3px color-mix(in srgb, var(--primary) 15%, transparent)" : "none",
                    transition: "border 0.15s, box-shadow 0.15s",
                  }}
                >
                  <div style={{ height: 110, background: isSvc ? tokens.extendedMustard : (categoryBg[it.category] ?? tokens.surfaceBg), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, overflow: "hidden", position: "relative" }}>
                    {it.image_url ? <img src={it.image_url} alt={it.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} /> : <span>{categoryEmoji[it.category] ?? "📦"}</span>}
                    {isSvc && <div style={{ position: "absolute", top: 6, left: 6, background: "#F19E2B", color: "white", fontSize: 8, fontWeight: 700, letterSpacing: "0.06em", borderRadius: 4, padding: "2px 5px" }}>SERVICE</div>}
                    {isSelected && (
                      <div style={{ position: "absolute", top: 6, right: 6, width: 20, height: 20, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "10px 12px 12px" }}>
                    <div style={{ fontSize: 12, color: tokens.onSurfaceDefault, lineHeight: 1.35, fontFamily: "var(--font-gilroy)" }}>{it.name}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: tokens.onSurfaceDefault, marginTop: 4, fontFamily: "var(--font-gilroy)" }}>{isSvc ? "~" : ""}{fmt(it.price)}</div>
                    <div style={{ display: "none", gap: 5, marginTop: 8 }}>
                      <button onClick={e => { e.stopPropagation(); addItem(`${selectedLook?.id ?? ''}::${it.id}`, it.price, it.name, categoryEmoji[it.category] ?? "📦", it.category, selectedLook?.name, selectedLook?.room); }} style={{ flex: 1, height: 30, background: "var(--surface-variant, #E6E6E6)", color: "var(--foreground)", border: "none", borderRadius: "var(--radius-full, 9999px)", fontSize: 11, fontWeight: 500, fontFamily: "var(--font-gilroy)", cursor: "pointer" }}>{isSvc ? "📋 Enquire" : "🛒 Add"}</button>
                      <button onClick={e => { e.stopPropagation(); setBsItem(it.id); setSelectedAlt(-1); }} style={{ width: 30, height: 30, background: "var(--surface-variant, #E6E6E6)", border: "none", borderRadius: "var(--radius-full, 9999px)", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>⇄</button>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>

            {/* ── Add-ons Section (Desktop/Tablet) ── */}
            {(() => {
              const ADDONS = [
                { id: "painting",   icon: "🖌️", label: "Wall Painting",       sub: "2 coats, premium emulsion", price: 18000 },
                { id: "electrical", icon: "⚡", label: "Electrical Upgrades",  sub: "Modular switches & concealed wiring", price: 12500 },
                { id: "curtains",   icon: "🪟", label: "Curtains & Blinds",    sub: "Custom-fit, fabric of choice", price: 22000 },
                { id: "lighting",   icon: "💡", label: "Accent Lighting",      sub: "LED coves + pendant fixtures", price: 15000 },
              ];
              const ADDONS_PRICE: Record<string, number> = { painting: 18000, electrical: 12500, curtains: 22000, lighting: 15000 };
              return (
                <>
                  <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "22px 0 18px" }} />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: "var(--font-weight-semibold)", fontFamily: "var(--font-gilroy)" }}>Add-ons</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-gilroy)" }}>Optional extras</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 6 }}>
                    {ADDONS.map(addon => {
                      const checked = selectedAddons.has(addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => setSelectedAddons(prev => { const next = new Set(prev); next.has(addon.id) ? next.delete(addon.id) : next.add(addon.id); return next; })}
                          style={{ display: "flex", alignItems: "center", gap: 12, background: checked ? "rgba(235,89,95,0.10)" : "rgba(255,255,255,0.04)", border: `1.5px solid ${checked ? "var(--primary)" : "rgba(255,255,255,0.10)"}`, borderRadius: "var(--radius, 12px)", padding: "11px 14px", cursor: "pointer", transition: "all 0.16s ease" }}
                        >
                          <div style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, background: checked ? "var(--primary)" : "transparent", border: `2px solid ${checked ? "var(--primary)" : "rgba(255,255,255,0.25)"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.16s ease" }}>
                            {checked && <span style={{ color: "white", fontSize: 11, lineHeight: 1 }}>✓</span>}
                          </div>
                          <span style={{ fontSize: 20, flexShrink: 0 }}>{addon.icon}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: "var(--font-weight-semibold)", color: checked ? "#fff" : "rgba(255,255,255,0.75)", fontFamily: "var(--font-gilroy)", lineHeight: 1.3 }}>{addon.label}</div>
                            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-gilroy)", marginTop: 2, lineHeight: 1.3 }}>{addon.sub}</div>
                          </div>
                          <div style={{ fontSize: 12, fontWeight: "var(--font-weight-semibold)", color: checked ? "var(--primary)" : "rgba(255,255,255,0.5)", fontFamily: "var(--font-gilroy)", flexShrink: 0 }}>+{fmt(addon.price)}</div>
                        </div>
                      );
                    })}
                  </div>
                  {selectedAddons.size > 0 && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(235,89,95,0.08)", border: "1px solid rgba(235,89,95,0.2)", borderRadius: "var(--radius, 12px)", padding: "10px 14px", marginTop: 4 }}>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-gilroy)" }}>{selectedAddons.size} add-on{selectedAddons.size > 1 ? "s" : ""} selected</div>
                      <div style={{ fontSize: 13, fontWeight: "var(--font-weight-bold)", color: "var(--primary)", fontFamily: "var(--font-gilroy)" }}>+{fmt([...selectedAddons].reduce((s, id) => s + (ADDONS_PRICE[id] ?? 0), 0))}</div>
                    </div>
                  )}
                </>
              );
            })()}

            {/* Similar Looks Section (Desktop/Tablet) */}
            {similarLooks.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 18 }} />
                <div style={{ 
                  fontSize: 10, 
                  letterSpacing: "0.12em", 
                  textTransform: "uppercase", 
                  color: "rgba(255,255,255,0.4)", 
                  fontWeight: "var(--font-weight-semibold)", 
                  fontFamily: "var(--font-gilroy)", 
                  marginBottom: 14 
                }}>
                  Similar Looks
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
                  {similarLooks.slice(0, 6).map((look) => (
                    <div
                      key={look.id}
                      onClick={() => setSelectedLook(look as SelectedLook)}
                      style={{ cursor: "pointer" }}
                    >
                      <div style={{
                        aspectRatio: "1",
                        borderRadius: "var(--radius-md, 10px)",
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.06)",
                        marginBottom: 7,
                        border: "1px solid rgba(255,255,255,0.08)",
                        position: "relative",
                      }}>
                        {look.img ? (
                          <img
                            src={look.img}
                            alt={look.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        ) : (
                          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))" }} />
                        )}
                        {look.tag && (
                          <div style={{
                            position: "absolute",
                            bottom: 5,
                            left: 5,
                            background: "rgba(0,0,0,0.55)",
                            backdropFilter: "blur(4px)",
                            borderRadius: "var(--radius-sm, 4px)",
                            padding: "2px 5px",
                            fontSize: 8,
                            color: "rgba(255,255,255,0.85)",
                            fontWeight: "var(--font-weight-medium)",
                            fontFamily: "var(--font-gilroy)",
                            letterSpacing: "0.04em",
                          }}>
                            {look.tag}
                          </div>
                        )}
                      </div>
                      <div style={{
                        fontSize: 10,
                        color: "rgba(255,255,255,0.65)",
                        fontFamily: "var(--font-gilroy)",
                        fontWeight: "var(--font-weight-medium)",
                        lineHeight: 1.3,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}>
                        {look.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>}
          
          {explorerTab === "items" && (
            <div style={{ display: "none", gap: 10, padding: "20px 20px 16px" }}>
              <button 
                onClick={() => setShowARViewer(true)}
                style={{ 
                  flex: 1, 
                  background: "var(--surface-variant, #E6E6E6)", 
                  color: tokens.onSurfaceDefault, 
                  border: "none", 
                  borderRadius: 99, 
                  height: 44, 
                  fontSize: 13, 
                  fontWeight: "var(--font-weight-semibold)", 
                  fontFamily: "var(--font-roboto)", 
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6
                }}
              >
                🛋️ Preview
              </button>
              <button 
                onClick={async () => {
                  if (!selectedLook?.img || !moodboardData) {
                    if (!moodboardData) await fetchMoodboard();
                  }
                  if (moodboardData) {
                    const { palette, materials, principles } = moodboardData;
                    setLookSimilarityData({
                      sourceImage: selectedLook?.img,
                      sourceName: selectedLook?.name,
                      detectedRoom: selectedLook?.room,
                      palette,
                      materials,
                      principles
                    });
                    setPrevScreen("explorer");
                    setScreen("matched-looks");
                  }
                }}
                style={{ 
                  flex: 1, 
                  background: "var(--surface-variant, #E6E6E6)", 
                  color: tokens.onSurfaceDefault, 
                  border: "none", 
                  borderRadius: 99, 
                  height: 44, 
                  fontSize: 13, 
                  fontWeight: "var(--font-weight-semibold)", 
                  fontFamily: "var(--font-roboto)", 
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6
                }}
              >
                🔍 View Similar
              </button>
            </div>
          )}
          {/* Moodboard Tab Content (Desktop) */}
          {explorerTab === "moodboard" && (
            <div style={{ flex: 1, overflowY: "auto", padding: "4px 20px 16px" }}>
              <MoodboardContent />
            </div>
          )}
          {/* Sticky CTA */}
          <div style={{ background: "white", borderTop: "1px solid #EBEBEB", padding: "10px 20px 20px", flexShrink: 0 }}>
            {hasServiceItem
              ? <div style={{ fontSize: 12, color: "#A0620A", fontWeight: 500, textAlign: "center", padding: "8px 0 9px", background: tokens.extendedMustard + "99", borderRadius: 8, marginBottom: 8 }}>🏠 Touch &amp; feel samples · Get your custom quote at home</div>
              : <div style={{ fontSize: 12, color: tokens.tertiaryGreen, fontWeight: 500, textAlign: "center", padding: "8px 0 9px", background: "rgba(218,236,222,0.8)", borderRadius: 8, marginBottom: 8 }}>✓ Ready to ship · 45-day delivery guarantee</div>}
            <div style={{ display: "flex", gap: 10 }}>
              {/* Preview button */}
              <button
                onClick={() => {
                  // Preview functionality - you can customize this behavior
                  showToast("👁️ Preview mode");
                }}
                style={{ flex: 1, background: "var(--muted)", color: "var(--foreground)", border: "none", borderRadius: "var(--radius-full, 9999px)", height: 48, fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", fontFamily: "var(--font-gilroy)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                👁️ Preview
              </button>
              {/* Hidden: add only shoppable (non-service) items to cart */}
              <button
                onClick={() => {
                  const shoppable = items.filter(it => !SERVICE_CATEGORIES.has(it.category));
                  if (shoppable.length === 0) { showToast("ℹ️ No ready-to-ship items in this look"); return; }
                  shoppable.forEach(it => addItem(`${selectedLook?.id ?? ''}::${it.id}`, it.price, it.name, categoryEmoji[it.category] ?? "📦", it.category, selectedLook?.name, selectedLook?.room));
                  showToast(`✓ ${shoppable.length} item${shoppable.length !== 1 ? "s" : ""} added to cart!`);
                  goTo("cart");
                }}
                style={{ flex: 1, background: "var(--surface-variant, #E6E6E6)", color: "var(--foreground)", border: "none", borderRadius: "var(--radius-full, 9999px)", height: 48, fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", fontFamily: "var(--font-gilroy)", cursor: "pointer", display: "none", alignItems: "center", justifyContent: "center", gap: 6 }}>
                🛒 Add all to cart
              </button>
              {/* Primary: Book Site Visit — always shown for all looks */}
              <button
                onClick={() => { setShowBookingFlow(true); setBookingStep(1); }}
                style={{ flex: 1.55, background: "var(--primary)", color: "var(--primary-foreground)", border: "none", borderRadius: "var(--radius-full, 9999px)", height: 48, fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", fontFamily: "var(--font-gilroy)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                Book Site Visit for ₹99
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Sheet (shared) */}
        {bsItem && currentItem && (() => {
          const isSvcItem = SERVICE_CATEGORIES.has(currentItem.category);
          const emi = `₹${Math.round(currentItem.price / 24).toLocaleString("en-IN")}/mo`;
          const tags: string[] = currentItem.description ? currentItem.description.split(" | ") : [];
          const alts: any[] = currentItem.alternatives ?? [];
          return (
            <div onClick={e => { if (e.target === e.currentTarget) setBsItem(null); }} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ background: tokens.surfaceDefault, borderRadius: 24, width: "90%", maxWidth: 560, padding: "28px 28px 36px", maxHeight: "82vh", overflowY: "auto" }}>
                <div style={{ width: 38, height: 4, background: tokens.surfaceVariant, borderRadius: 2, margin: "0 auto 20px" }} />
                {isSvcItem && <div style={{ background: tokens.extendedMustard + "88", border: `1px solid ${tokens.tertiaryYellow}`, borderRadius: 10, padding: "9px 13px", marginBottom: 14, display: "flex", gap: 8, alignItems: "flex-start" }}><span style={{ fontSize: 14 }}>🏠</span><div style={{ fontSize: 11, color: "#7A5200", lineHeight: 1.5 }}>This is a <strong>service item</strong> — price shown is approximate. Your Livspace designer will confirm the final quote after the site visit.</div></div>}
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 96, height: 96, background: isSvcItem ? tokens.extendedMustard : (categoryBg[currentItem.category] ?? tokens.surfaceBg), borderRadius: 16, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, flexShrink: 0, position: "relative" }}>
                    {currentItem.image_url ? <img src={currentItem.image_url} alt={currentItem.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} /> : <span>{categoryEmoji[currentItem.category] ?? "📦"}</span>}
                    {isSvcItem && <div style={{ position: "absolute", top: 5, left: 5, background: "#F19E2B", color: "white", fontSize: 8, fontWeight: 700, letterSpacing: "0.06em", borderRadius: 4, padding: "2px 5px" }}>SERVICE</div>}
                  </div>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 500, color: tokens.onSurfaceDefault, lineHeight: 1.3 }}>{currentItem.name}</div>
                    <div style={{ fontSize: 12, color: tokens.onSurfaceSecondary, marginTop: 3 }}>{currentItem.brand}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: tokens.onSurfaceDefault, marginTop: 7 }}>{isSvcItem ? "~" : ""}{fmt(currentItem.price)}</div>
                    {isSvcItem ? <div style={{ fontSize: 11, color: tokens.tertiaryYellow, fontWeight: 500 }}>Approximate · confirmed after visit</div> : <div style={{ fontSize: 11, color: tokens.tertiaryGreen, fontWeight: 500 }}>or {emi} · 0% EMI</div>}
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 14 }}>{tags.map((t: string) => <span key={t} style={{ background: tokens.surfaceBg, borderRadius: 7, padding: "5px 11px", fontSize: 11, color: tokens.onSurfaceDefault }}>{t}</span>)}</div>
                {alts.length > 0 && <><div style={{ fontSize: 13, fontWeight: 500, color: tokens.onSurfaceDefault, margin: "18px 0 10px" }}>🔄 Replace with Similar</div><div style={{ display: "flex", gap: 9, overflowX: "auto", padding: "0 0 12px" }}>{alts.map((a: any, i: number) => (<div key={a.id ?? i} onClick={() => setSelectedAlt(selectedAlt === i ? -1 : i)} style={{ flexShrink: 0, width: 96, cursor: "pointer" }}><div style={{ width: 96, height: 86, borderRadius: 12, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, border: `2px solid ${selectedAlt === i ? tokens.primaryDefault : "transparent"}`, background: selectedAlt === i ? tokens.primaryVariant : tokens.surfaceBg, transition: "all 0.18s", position: "relative" }}>{a.image_url ? <img src={a.image_url} alt={a.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: selectedAlt === i ? 0.85 : 1 }} /> : <span>{categoryEmoji[a.category] ?? categoryEmoji[currentItem.category] ?? "📦"}</span>}</div><div style={{ fontSize: 10, color: tokens.onSurfaceSecondary, marginTop: 5, textAlign: "center", lineHeight: 1.3 }}>{a.name}</div><div style={{ fontSize: 11, fontWeight: 600, color: tokens.onSurfaceDefault, textAlign: "center", marginTop: 2 }}>{fmt(a.price)}</div></div>))}</div></>}
                <div style={{ display: "flex", gap: 9, marginTop: 18 }}>{(() => { const addTarget = selectedAlt >= 0 && alts[selectedAlt] ? alts[selectedAlt] : currentItem; const targetIsSvc = SERVICE_CATEGORIES.has(addTarget.category ?? currentItem.category); return <button onClick={() => { addItem(`${selectedLook?.id ?? ''}::${addTarget.id}`, addTarget.price, addTarget.name, categoryEmoji[addTarget.category] ?? "📦", addTarget.category ?? currentItem.category, selectedLook?.name, selectedLook?.room); setBsItem(null); }} style={{ flex: 1, background: "#E6E6E6", color: tokens.onSurfaceDefault, border: "none", borderRadius: 24, height: 44, padding: "0 15px", fontSize: 14, fontWeight: 500, fontFamily: "'Roboto',sans-serif", cursor: "pointer" }}>{targetIsSvc ? "📋 Add to Enquiry" : "🛒 Add to Cart"} · {targetIsSvc ? "~" : ""}{fmt(addTarget.price)}</button>; })()}<button onClick={() => showToast("❤️ Saved!")} style={{ width: 44, height: 44, background: "#E6E6E6", border: "none", borderRadius: 24, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>♡</button></div>
              </div>
            </div>
          );
        })()}
        {/* Booking Flow (shared) */}
        {showBookingFlow && (
          <div onClick={e => { if (e.target === e.currentTarget) closeBooking(); }} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {bookingStep === 1 && (
              <div style={{ background: "white", borderRadius: 20, padding: "28px 28px 36px", width: "90%", maxWidth: 480 }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: "#1A1A1A", marginBottom: 4 }}>Select service address</div>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 18 }}>Our designer will visit this location</div>
                {savedAddresses.map((addr, i) => (<div key={i} onClick={() => setSelectedAddress(i)} style={{ display: "flex", alignItems: "flex-start", gap: 13, padding: "13px 0", borderBottom: "1px solid #F2F2F2", cursor: "pointer" }}><div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${selectedAddress === i ? tokens.primaryDefault : "#C8C8C8"}`, background: selectedAddress === i ? tokens.primaryDefault : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>{selectedAddress === i && <div style={{ width: 6, height: 6, background: "white", borderRadius: "50%" }} />}</div><div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{addr.label}</div><div style={{ fontSize: 12, color: "#777", marginTop: 2 }}>{addr.full}</div></div></div>))}
                <button onClick={() => setBookingStep(2)} style={{ width: "100%", background: "var(--primary)", color: "var(--primary-foreground)", border: "none", borderRadius: 9999, height: 48, fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", fontFamily: "var(--font-gilroy)", cursor: "pointer", marginTop: 20 }}>Continue →</button>
              </div>
            )}
            {bookingStep === 2 && (
              <div style={{ background: "white", borderRadius: 20, padding: "28px 28px 36px", width: "90%", maxWidth: 480 }}>
                <button onClick={() => setBookingStep(1)} style={{ background: "none", border: "none", cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", gap: 6, color: "#555", padding: 0 }}><span style={{ fontSize: 18 }}>←</span><span style={{ fontSize: 13 }}>Back</span></button>
                <div style={{ fontSize: 18, fontWeight: 600, color: "#1A1A1A", marginBottom: 4 }}>When should the professional arrive?</div>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 20 }}>Consultation will take approx. 1 hr</div>
                <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>{bookingDates.map((d, i) => (<div key={i} onClick={() => setSelectedDateIdx(i)} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: `2px solid ${selectedDateIdx === i ? tokens.primaryDefault : "#E5E5E5"}`, background: selectedDateIdx === i ? tokens.primaryVariant : "white", textAlign: "center", cursor: "pointer" }}><div style={{ fontSize: 11, color: selectedDateIdx === i ? tokens.primaryDefault : "#888" }}>{d.day}</div><div style={{ fontSize: 20, fontWeight: 700, color: selectedDateIdx === i ? tokens.primaryDefault : "#1A1A1A" }}>{d.date}</div></div>))}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>{timeSlots.map(t => (<div key={t} onClick={() => setSelectedTime(t)} style={{ padding: "14px 0", borderRadius: 12, border: `2px solid ${selectedTime === t ? tokens.primaryDefault : "#E5E5E5"}`, background: selectedTime === t ? tokens.primaryVariant : "white", textAlign: "center", cursor: "pointer", fontSize: 14, fontWeight: selectedTime === t ? 600 : 400, color: selectedTime === t ? tokens.primaryDefault : "#1A1A1A" }}>{t}</div>))}</div>
                <button onClick={() => { if (selectedDateIdx !== null && selectedTime) setBookingStep(3); }} style={{ width: "100%", background: selectedDateIdx !== null && selectedTime ? "var(--primary)" : "var(--muted)", color: selectedDateIdx !== null && selectedTime ? "var(--primary-foreground)" : "var(--muted-foreground)", border: "none", borderRadius: 9999, height: 52, fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)", fontFamily: "var(--font-roboto)", cursor: selectedDateIdx !== null && selectedTime ? "pointer" : "default", letterSpacing: "0.01em" }}>Proceed to checkout</button>
              </div>
            )}
            {bookingStep === 3 && (
              <div style={{ background: "white", borderRadius: 20, padding: "28px 28px 36px", width: "90%", maxWidth: 480 }}>
                <button onClick={() => setBookingStep(2)} style={{ background: "none", border: "none", cursor: "pointer", marginBottom: 16, fontSize: 20, color: "#333", padding: 0 }}>←</button>
                <div style={{ fontSize: 18, fontWeight: 600, color: "#1A1A1A", marginBottom: 16 }}>Book a Site Visit</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>Livspace Site Visit</div>
                {[[" 👤","Expert design advice for your space"],[" 📊","Touch and feel panel samples"],[" 📋","Detailed quote tailored to your needs"]].map(([em, txt], i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderTop: i > 0 ? "1px dashed #EBEBEB" : "none" }}><span style={{ fontSize: 16 }}>{em}</span><span style={{ fontSize: 13, color: "#444" }}>{txt}</span></div>))}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 24 }}>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500, color: "#333" }}>💳 UPI / Card</div></div>
                  <button onClick={() => { closeBooking(); onPlaceOrder?.(); }} style={{ flex: 1.5, background: "var(--primary)", color: "var(--primary-foreground)", border: "none", borderRadius: 9999, height: 48, fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", fontFamily: "var(--font-gilroy)", cursor: "pointer" }}>Pay ₹99</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Preview Viewer */}
        {showARViewer && selectedLook?.img && (
          isDesktop
            ? <DesktopRoomPreview imageUrl={selectedLook.img} lookName={selectedLook.name ?? "Look"} onClose={() => setShowARViewer(false)} />
            : <CameraOverlayViewer imageUrl={selectedLook.img} lookName={selectedLook.name ?? "Look"} onClose={() => setShowARViewer(false)} />
        )}
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: tokens.onSurfaceDefault, overflow: "hidden", position: "relative" }}>
      {/* Scrollable container */}
      <div ref={itemsScrollRef} style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", transform: "translateZ(0)" }}>
        {/* Room Visual — Carousel */}
        <LookCarousel
          mainImage={selectedLook?.img ?? ""}
          lookName={selectedLook?.name}
          room={selectedLook?.room ?? "living"}
          height={406}
          onSlideChange={() => {}}
        >
          {/* Top bar overlay */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "56px 18px 18px", background: "linear-gradient(to bottom,rgba(0,0,0,0.48),transparent)", zIndex: 6, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <button onClick={() => goTo("gallery")} style={{ width: 38, height: 38, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "none", borderRadius: "50%", cursor: "pointer", color: "white", fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
            <div style={{ display: "flex", gap: 7 }}>
              {(() => {
                const isWishlisted = wishlist?.some(w => w.name === selectedLook?.name) ?? false;
                return (
                  <button onClick={() => { if (selectedLook) toggleWishlist?.(selectedLook); }} style={{ width: 38, height: 38, background: isWishlisted ? tokens.primaryDefault : "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", border: "none", borderRadius: "50%", cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>{isWishlisted ? "❤️" : "🤍"}</button>
                );
              })()}
              <button onClick={() => showToast("🔗 Link copied!")} style={{ width: 38, height: 38, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", border: "none", borderRadius: "50%", cursor: "pointer", color: "white", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>↗</button>
              <button onClick={() => goTo("cart")} style={{ width: 38, height: 38, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", border: "none", borderRadius: "50%", cursor: "pointer", color: "white", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <ShoppingCart size={18} color="white" strokeWidth={2} />
                {cartCount > 0 && <div style={{ position: "absolute", top: -2, right: -2, width: 14, height: 14, background: tokens.primaryDefault, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "white", border: `2px solid ${tokens.surfaceDefault}` }}>{cartCount}</div>}
              </button>
            </div>
          </div>
          {/* Hotspots — visible only when Items tab is active and on first slide */}
          {explorerTab === "items" && <div style={{ position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none" }}><div style={{ pointerEvents: "all" }}><HotspotLayer /></div></div>}
        </LookCarousel>

        {/* Info */}
        <div style={{ background: tokens.surfaceDefault, zIndex: 20, padding: "22px 22px 10px", flexShrink: 0 }}>
          {/* Name + Price row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <span style={{ display: "inline-block", background: tokens.surfaceBg, borderRadius: 5, padding: "3px 8px", fontSize: 9, fontWeight: 700, color: tokens.onSurfaceSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>{selectedLook?.tag ?? "Modern Zen"}</span>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600, color: tokens.onSurfaceDefault, marginTop: 5 }}>{selectedLook?.name ?? "Quiet Luxury"}</div>
              <div style={{ display: "flex", gap: 14, marginTop: 7 }}>
                <span style={{ fontSize: 12, color: tokens.onSurfaceSecondary }}>📦 {tieredItems.length > 0 ? `${tieredItems.length} items` : (selectedLook?.items ?? "…")}</span>
                <span style={{ fontSize: 12, color: tokens.onSurfaceSecondary }}>🚚 45-day delivery</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 21, fontWeight: 700, color: tokens.onSurfaceDefault, textAlign: "right" }}>{displayPrice}</div>
              {activeTier !== "standard" && (
                <div style={{ fontSize: 10, color: tokens.onSurfaceSecondary, textAlign: "right", marginTop: 2, fontFamily: "var(--font-poppins)" }}>
                  vs ₹{basePriceNum.toLocaleString("en-IN")} standard
                </div>
              )}
            </div>
          </div>

          {/* Tier selector */}
          <div style={{ display: "flex", gap: 8, paddingBottom: 4 }}>
            {(["eco", "standard", "premium"] as const).map((tier) => {
              const isActive = activeTier === tier;
              const labels: Record<string, string> = { eco: "🌿 Eco", standard: "⚡ Standard", premium: "✨ Premium" };
              return (
                <button
                  key={tier}
                  onClick={() => setActiveTier(tier)}
                  style={{
                    flex: 1,
                    height: 34,
                    border: isActive ? "none" : `1.5px solid var(--border-default, #E0E0E0)`,
                    borderRadius: "var(--radius-full, 99px)",
                    background: isActive
                      ? tier === "eco" ? "var(--color-success, #2E7D32)" : tier === "premium" ? "var(--primary)" : tokens.onSurfaceDefault
                      : "transparent",
                    color: isActive ? "#fff" : tokens.onSurfaceSecondary,
                    fontSize: 11,
                    fontWeight: isActive ? "var(--font-weight-semibold)" : "var(--font-weight-medium)",
                    fontFamily: "var(--font-poppins)",
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                    letterSpacing: "0.01em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {labels[tier]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab bar + content */}
        <div style={{ minHeight: "calc(100vh - 180px)", background: "#333333", paddingBottom: 160 }}>
          {/* Tab switcher pinned at top */}
          <div style={{ position: "sticky", top: 0, zIndex: 15, background: "#333333", padding: "12px 22px 8px" }}>
          <TabBar compact />
        </div>

          {/* Items tab */}
          {explorerTab === "items" && (
            <div style={{ padding: "0 22px" }}>
              <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: tokens.onSurfaceDisabled, padding: "12px 0 8px", fontWeight: 500 }}>Tap ● on room or browse items</div>
            {productsLoading && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[1,2,3,4].map(i => <div key={i} style={{ height: 140, borderRadius: 14, background: "linear-gradient(90deg,#3a3a3a 25%,#444 50%,#3a3a3a 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />)}
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {tieredItems.map(it => {
            const isSvc = SERVICE_CATEGORIES.has(it.category);
            return (
              <div key={it.id} style={{ background: tokens.surfaceDefault, borderRadius: 14, overflow: "hidden", border: `1.5px solid ${isSvc ? tokens.extendedMustard : tokens.surfaceVariant}` }}>
                {/* Image / icon */}
                <div style={{ height: 86, background: isSvc ? tokens.extendedMustard : (categoryBg[it.category] ?? tokens.surfaceBg), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, overflow: "hidden", position: "relative" }}>
                  {it.image_url
                    ? <img src={it.image_url} alt={it.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span>{categoryEmoji[it.category] ?? "📦"}</span>}
                  {activeTier !== "standard" && (
                    <div style={{ position: "absolute", top: 6, right: 6, background: activeTier === "eco" ? "rgba(46,125,50,0.88)" : "rgba(235,89,95,0.88)", color: "white", fontSize: 8, fontWeight: "var(--font-weight-bold)", letterSpacing: "0.06em", borderRadius: 4, padding: "2px 5px", fontFamily: "var(--font-gilroy)" }}>
                      {activeTier === "eco" ? "ECO" : "PREMIUM"}
                    </div>
                  )}
                  {isSvc && (
                    <div style={{ position: "absolute", top: 6, left: 6, background: "#F19E2B", color: "white", fontSize: 8, fontWeight: "var(--font-weight-bold)", letterSpacing: "0.06em", borderRadius: 4, padding: "2px 5px", fontFamily: "var(--font-gilroy)" }}>SERVICE</div>
                  )}
                </div>
                {/* Text */}
                <div style={{ padding: "9px 11px 12px" }}>
                  <div style={{ fontSize: 11, color: tokens.onSurfaceDefault, lineHeight: 1.35, fontFamily: "var(--font-gilroy)", fontWeight: "var(--font-weight-medium)" }}>{it.name}</div>
                  <div style={{ fontSize: 13, fontWeight: "var(--font-weight-semibold)", color: tokens.onSurfaceDefault, marginTop: 4, fontFamily: "var(--font-gilroy)" }}>{isSvc ? "~" : ""}{fmt(it.price)}</div>
                  {isSvc && <div style={{ fontSize: 9, color: tokens.tertiaryYellow, marginTop: 2, fontFamily: "var(--font-gilroy)" }}>Approx · quote after visit</div>}
                </div>
              </div>
            );
          })}
              </div>

              {/* ── Add-ons ── */}
              {(() => {
                const ADDONS = [
                  { id: "painting",   icon: "🖌️", label: "Wall Painting",       sub: "2 coats, premium emulsion", price: 18000 },
                  { id: "electrical", icon: "⚡", label: "Electrical Upgrades",  sub: "Modular switches & concealed wiring", price: 12500 },
                  { id: "curtains",   icon: "🪟", label: "Curtains & Blinds",    sub: "Custom-fit, fabric of choice", price: 22000 },
                  { id: "lighting",   icon: "💡", label: "Accent Lighting",      sub: "LED coves + pendant fixtures", price: 15000 },
                ];
                const ADDONS_PRICE: Record<string, number> = { painting: 18000, electrical: 12500, curtains: 22000, lighting: 15000 };
                return (
                  <>
                    <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "22px 0 18px" }} />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: "var(--font-weight-semibold)", fontFamily: "var(--font-gilroy)" }}>Add-ons</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-gilroy)" }}>Optional extras</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 6 }}>
                      {ADDONS.map(addon => {
                        const checked = selectedAddons.has(addon.id);
                        return (
                          <div
                            key={addon.id}
                            onClick={() => setSelectedAddons(prev => { const next = new Set(prev); next.has(addon.id) ? next.delete(addon.id) : next.add(addon.id); return next; })}
                            style={{ display: "flex", alignItems: "center", gap: 12, background: checked ? "rgba(235,89,95,0.10)" : "rgba(255,255,255,0.04)", border: `1.5px solid ${checked ? "var(--primary)" : "rgba(255,255,255,0.10)"}`, borderRadius: "var(--radius, 12px)", padding: "11px 14px", cursor: "pointer", transition: "all 0.16s ease" }}
                          >
                            <div style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, background: checked ? "var(--primary)" : "transparent", border: `2px solid ${checked ? "var(--primary)" : "rgba(255,255,255,0.25)"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.16s ease" }}>
                              {checked && <span style={{ color: "white", fontSize: 11, lineHeight: 1 }}>✓</span>}
                            </div>
                            <span style={{ fontSize: 20, flexShrink: 0 }}>{addon.icon}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12, fontWeight: "var(--font-weight-semibold)", color: checked ? "#fff" : "rgba(255,255,255,0.75)", fontFamily: "var(--font-gilroy)", lineHeight: 1.3 }}>{addon.label}</div>
                              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-gilroy)", marginTop: 2, lineHeight: 1.3 }}>{addon.sub}</div>
                            </div>
                            <div style={{ fontSize: 12, fontWeight: "var(--font-weight-semibold)", color: checked ? "var(--primary)" : "rgba(255,255,255,0.5)", fontFamily: "var(--font-gilroy)", flexShrink: 0 }}>+{fmt(addon.price)}</div>
                          </div>
                        );
                      })}
                    </div>
                    {selectedAddons.size > 0 && (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(235,89,95,0.08)", border: "1px solid rgba(235,89,95,0.2)", borderRadius: "var(--radius, 12px)", padding: "10px 14px", marginTop: 4 }}>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-gilroy)" }}>{selectedAddons.size} add-on{selectedAddons.size > 1 ? "s" : ""} selected</div>
                        <div style={{ fontSize: 13, fontWeight: "var(--font-weight-bold)", color: "var(--primary)", fontFamily: "var(--font-gilroy)" }}>+{fmt([...selectedAddons].reduce((s, id) => s + (ADDONS_PRICE[id] ?? 0), 0))}</div>
                      </div>
                    )}
                  </>
                );
              })()}

              {/* ── Similar Looks Section (Mobile) ── */}
              {similarLooks.length > 0 && (
                <>
                  <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "22px 0 18px" }} />
                  {/* Heading row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{
                      fontSize: 10,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.4)",
                      fontWeight: "var(--font-weight-semibold)",
                      fontFamily: "var(--font-gilroy)",
                    }}>
                      Similar Looks
                    </div>
                    <button
                      onClick={async () => {
                        if (!moodboard) await fetchMoodboard();
                        setLookSimilarityData({
                          sourceImage: selectedLook?.img,
                          sourceName: selectedLook?.name,
                          detectedRoom: selectedLook?.room,
                          palette: moodboard?.palette ?? [],
                          materials: moodboard?.materials ?? [],
                          principles: moodboard?.principles ?? [],
                        });
                        setPrevScreen("explorer");
                        setScreen("matched-looks");
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--primary)",
                        fontSize: 11,
                        fontWeight: "var(--font-weight-medium)",
                        fontFamily: "var(--font-gilroy)",
                        cursor: "pointer",
                        padding: 0,
                        display: "none",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      See all <span style={{ fontSize: 13 }}>›</span>
                    </button>
                  </div>

                  {/* 3-column grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
                    {similarLooks.slice(0, 6).map((look) => (
                      <div
                        key={look.id}
                        onClick={() => setSelectedLook(look as SelectedLook)}
                        style={{ cursor: "pointer" }}
                      >
                        <div style={{
                          aspectRatio: "1",
                          borderRadius: "var(--radius-md, 10px)",
                          overflow: "hidden",
                          background: "rgba(255,255,255,0.06)",
                          marginBottom: 7,
                          border: "1px solid rgba(255,255,255,0.08)",
                          position: "relative",
                        }}>
                          {look.img ? (
                            <img
                              src={look.img}
                              alt={look.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                          ) : (
                            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))" }} />
                          )}
                          {look.tag && (
                            <div style={{
                              position: "absolute",
                              bottom: 5,
                              left: 5,
                              background: "rgba(0,0,0,0.55)",
                              backdropFilter: "blur(4px)",
                              borderRadius: "var(--radius-sm, 4px)",
                              padding: "2px 5px",
                              fontSize: 8,
                              color: "rgba(255,255,255,0.85)",
                              fontWeight: "var(--font-weight-medium)",
                              fontFamily: "var(--font-gilroy)",
                              letterSpacing: "0.04em",
                            }}>
                              {look.tag}
                            </div>
                          )}
                        </div>
                        <div style={{
                          fontSize: 10,
                          color: "rgba(255,255,255,0.65)",
                          fontFamily: "var(--font-gilroy)",
                          fontWeight: "var(--font-weight-medium)",
                          lineHeight: 1.3,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}>
                          {look.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

            </div>
          )}

          {/* Moodboard Tab Content (Mobile) */}
          {explorerTab === "moodboard" && (
            <div style={{ padding: "4px 22px" }}>
              <MoodboardContent />
              
              {/* Action Buttons - removed duplicate (buttons already shown in Items tab) */}
              <div style={{ display: "none" }}>
                <button 
                  onClick={() => setShowARViewer(true)}
                  style={{ 
                    flex: 1, 
                    background: "var(--surface-variant, #E6E6E6)", 
                    color: tokens.onSurfaceDefault, 
                    border: "none",
                    borderRadius: 99, 
                    height: 44, 
                    fontSize: 13, 
                    fontWeight: "var(--font-weight-semibold)", 
                    fontFamily: "var(--font-roboto)", 
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6
                  }}
                >
                  🛋️ Preview
                </button>
                <button 
                  onClick={async () => {
                    if (!selectedLook?.img || !moodboard) {
                      if (!moodboard) await fetchMoodboard();
                    }
                    if (moodboard) {
                      const { palette, materials, principles } = moodboard;
                      setLookSimilarityData({
                        sourceImage: selectedLook?.img,
                        sourceName: selectedLook?.name,
                        detectedRoom: selectedLook?.room,
                        palette,
                        materials,
                        principles
                      });
                      setPrevScreen("explorer");
                      setScreen("matched-looks");
                    }
                  }}
                  style={{ 
                    flex: 1, 
                    background: "var(--surface-variant, #E6E6E6)", 
                    color: tokens.onSurfaceDefault, 
                    border: "none", 
                    borderRadius: 99, 
                    height: 44, 
                    fontSize: 13, 
                    fontWeight: "var(--font-weight-semibold)", 
                    fontFamily: "var(--font-roboto)", 
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6
                  }}
                >
                  🔍 View Similar
                </button>
              </div>
            </div>
          )}
        </div>
      {/* End scrollable container */}
      </div>

      {/* Sticky CTA — adapts to service vs ready-to-ship flow */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 30, background: "white", borderTop: "1px solid #EBEBEB", padding: "10px 14px 16px", display: "flex", flexDirection: "column", gap: 0 }}>
        {hasServiceItem ? (
          <div style={{ fontSize: 12, color: "#A0620A", fontWeight: 500, textAlign: "center", padding: "8px 0 9px", letterSpacing: "0.01em", background: tokens.extendedMustard + "99", borderRadius: 8, marginBottom: 2 }}>🏠 Touch &amp; feel samples · Get your custom quote at home</div>
        ) : (
          <div style={{ fontSize: 12, color: tokens.tertiaryGreen, fontWeight: 500, textAlign: "center", padding: "8px 0 9px", letterSpacing: "0.01em", background: "rgba(218,236,222,0.8)", borderRadius: 8, marginBottom: 2 }}>✓ Ready to ship · 45-day delivery guarantee</div>
        )}
        <div style={{ display: "flex", gap: 10, alignItems: "stretch", paddingTop: 4 }}>
          {/* Secondary: add only shoppable (non-service) items to cart */}
          {/* Add all to cart — hidden */}
          {/* Preview button */}
          <button
            onClick={() => {
              setPrevScreen("explorer");
              setScreen("moodboard");
            }}
            style={{ flex: 1, background: "var(--surface-variant, #E6E6E6)", color: "var(--foreground)", border: "none", borderRadius: "var(--radius-full, 9999px)", height: 48, fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", fontFamily: "var(--font-gilroy)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            👁️ Preview
          </button>
          {/* Primary: Book Site Visit — always shown for all looks */}
          <button
            onClick={() => { setShowBookingFlow(true); setBookingStep(1); }}
            style={{ flex: 1.55, background: "var(--primary)", color: "var(--primary-foreground)", border: "none", borderRadius: "var(--radius-full, 9999px)", height: 48, fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", fontFamily: "var(--font-gilroy)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            Book Site Visit for ₹99
          </button>
        </div>
      </div>

      {/* Bottom Sheet */}
      {bsItem && currentItem && (() => {
        const isSvcItem = SERVICE_CATEGORIES.has(currentItem.category);
        const emi = `₹${Math.round(currentItem.price / 24).toLocaleString("en-IN")}/mo`;
        const tags: string[] = currentItem.description ? currentItem.description.split(" | ") : [];
        const alts: any[] = currentItem.alternatives ?? [];
        return (
          <div onClick={e => { if (e.target === e.currentTarget) setBsItem(null); }} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 20, display: "flex", alignItems: "flex-end" }}>
            <div style={{ background: tokens.surfaceDefault, borderRadius: "24px 24px 0 0", width: "100%", padding: "0 22px 140px", maxHeight: "74%", overflowY: "auto" }}>
              <div style={{ width: 38, height: 4, background: tokens.surfaceVariant, borderRadius: 2, margin: "12px auto 18px" }} />
              {/* Service disclaimer banner */}
              {isSvcItem && (
                <div style={{ background: tokens.extendedMustard + "88", border: `1px solid ${tokens.tertiaryYellow}`, borderRadius: 10, padding: "9px 13px", marginBottom: 14, display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 14 }}>🏠</span>
                  <div style={{ fontSize: 11, color: "#7A5200", lineHeight: 1.5 }}>This is a <strong>service item</strong> — price shown is approximate. Your Livspace designer will confirm the final quote after the site visit.</div>
                </div>
              )}
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 86, height: 86, background: isSvcItem ? tokens.extendedMustard : (categoryBg[currentItem.category] ?? tokens.surfaceBg), borderRadius: 14, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, flexShrink: 0, position: "relative" }}>
                  {currentItem.image_url
                    ? <img src={currentItem.image_url} alt={currentItem.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span>{categoryEmoji[currentItem.category] ?? "📦"}</span>}
                  {isSvcItem && <div style={{ position: "absolute", top: 5, left: 5, background: "#F19E2B", color: "white", fontSize: 8, fontWeight: 700, letterSpacing: "0.06em", borderRadius: 4, padding: "2px 5px" }}>SERVICE</div>}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: tokens.onSurfaceDefault, lineHeight: 1.3 }}>{currentItem.name}</div>
                  <div style={{ fontSize: 12, color: tokens.onSurfaceSecondary, marginTop: 3 }}>{currentItem.brand}</div>
                  <div style={{ fontSize: 21, fontWeight: 700, color: tokens.onSurfaceDefault, marginTop: 7 }}>{isSvcItem ? "~" : ""}{fmt(currentItem.price)}</div>
                  {isSvcItem
                    ? <div style={{ fontSize: 11, color: tokens.tertiaryYellow, fontWeight: 500 }}>Approximate · confirmed after visit</div>
                    : <div style={{ fontSize: 11, color: tokens.tertiaryGreen, fontWeight: 500 }}>or {emi} · 0% EMI</div>}
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 14 }}>
                {tags.map((t: string) => <span key={t} style={{ background: tokens.surfaceBg, borderRadius: 7, padding: "5px 11px", fontSize: 11, color: tokens.onSurfaceDefault }}>{t}</span>)}
              </div>
              {alts.length > 0 && <>
                <div style={{ fontSize: 13, fontWeight: 500, color: tokens.onSurfaceDefault, margin: "18px 0 10px" }}>��� Replace with Similar</div>
                <div style={{ display: "flex", gap: 9, overflowX: "auto", margin: "0 -22px", padding: "0 22px 12px" }}>
                  {alts.map((a: any, i: number) => (
                    <div key={a.id ?? i} onClick={() => setSelectedAlt(selectedAlt === i ? -1 : i)} style={{ flexShrink: 0, width: 96, cursor: "pointer" }}>
                      <div style={{ width: 96, height: 86, borderRadius: 12, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, border: `2px solid ${selectedAlt === i ? tokens.primaryDefault : "transparent"}`, background: selectedAlt === i ? tokens.primaryVariant : tokens.surfaceBg, transition: "all 0.18s", position: "relative" }}>
                        {a.image_url
                          ? <img src={a.image_url} alt={a.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: selectedAlt === i ? 0.85 : 1 }} />
                          : <span>{categoryEmoji[a.category] ?? categoryEmoji[currentItem.category] ?? "📦"}</span>}
                      </div>
                      <div style={{ fontSize: 10, color: tokens.onSurfaceSecondary, marginTop: 5, textAlign: "center", lineHeight: 1.3 }}>{a.name}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: tokens.onSurfaceDefault, textAlign: "center", marginTop: 2 }}>{fmt(a.price)}</div>
                    </div>
                  ))}
                </div>
              </>}
              <div style={{ display: "flex", gap: 9, marginTop: 18 }}>
                {(() => {
                  const addTarget = selectedAlt >= 0 && alts[selectedAlt] ? alts[selectedAlt] : currentItem;
                  const targetIsSvc = SERVICE_CATEGORIES.has(addTarget.category ?? currentItem.category);
                  return (
                    <button onClick={() => { addItem(`${selectedLook?.id ?? ''}::${addTarget.id}`, addTarget.price, addTarget.name, categoryEmoji[addTarget.category] ?? "📦", addTarget.category ?? currentItem.category, selectedLook?.name, selectedLook?.room); setBsItem(null); }}
                      style={{ flex: 1, background: "#E6E6E6", color: tokens.onSurfaceDefault, border: "none", borderRadius: 24, height: 36, padding: "0 15px", fontSize: 14, fontWeight: 500, fontFamily: "'Roboto',sans-serif", cursor: "pointer" }}>
                      {targetIsSvc ? "📋 Add to Enquiry" : "🛒 Add to Cart"} · {targetIsSvc ? "~" : ""}{fmt(addTarget.price)}
                    </button>
                  );
                })()}
                <button onClick={() => showToast("❤️ Saved!")} style={{ width: 36, height: 36, background: "#E6E6E6", border: "none", borderRadius: 24, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>♡</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Booking Flow Overlay ── */}
      {showBookingFlow && (
        <div onClick={e => { if (e.target === e.currentTarget) closeBooking(); }} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 60, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>

          {/* STEP 1 — Select Address */}
          {bookingStep === 1 && (
            <div style={{ background: "white", borderRadius: "20px 20px 0 0", padding: "0 0 36px" }}>
              <div style={{ width: 36, height: 4, background: "#E0E0E0", borderRadius: 2, margin: "12px auto 0" }} />
              <div style={{ padding: "18px 22px 0" }}>
                <div style={{ fontSize: 17, fontWeight: 600, color: "#1A1A1A" }}>Select service address</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 3, marginBottom: 16 }}>Our designer will visit this location</div>
                {savedAddresses.map((addr, i) => (
                  <div key={i} onClick={() => setSelectedAddress(i)} style={{ display: "flex", alignItems: "flex-start", gap: 13, padding: "13px 0", borderBottom: "1px solid #F2F2F2", cursor: "pointer" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${selectedAddress === i ? tokens.primaryDefault : "#C8C8C8"}`, background: selectedAddress === i ? tokens.primaryDefault : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      {selectedAddress === i && <div style={{ width: 6, height: 6, background: "white", borderRadius: "50%" }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{addr.label}</div>
                      <div style={{ fontSize: 12, color: "#777", marginTop: 2, lineHeight: 1.45 }}>{addr.full}</div>
                    </div>
                    <div style={{ fontSize: 15, color: "#BBBBBB", marginTop: 2 }}>✎</div>
                  </div>
                ))}
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 0", cursor: "pointer" }} onClick={() => showToast("📍 Add address coming soon!")}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: `1.5px dashed ${tokens.primaryDefault}`, display: "flex", alignItems: "center", justifyContent: "center", color: tokens.primaryDefault, fontSize: 14, flexShrink: 0 }}>+</div>
                  <div style={{ fontSize: 14, color: tokens.primaryDefault, fontWeight: 500 }}>Add new address</div>
                </div>
                <button onClick={() => setBookingStep(2)} style={{ width: "100%", background: "var(--primary)", color: "var(--primary-foreground)", border: "none", borderRadius: 9999, height: 48, fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", fontFamily: "var(--font-gilroy)", cursor: "pointer", marginTop: 6 }}>Continue →</button>
              </div>
            </div>
          )}

          {/* STEP 2 — Date + Time */}
          {bookingStep === 2 && (
            <div style={{ background: "white", borderRadius: "20px 20px 0 0", maxHeight: "86%", display: "flex", flexDirection: "column" }}>
              <div style={{ width: 36, height: 4, background: "#E0E0E0", borderRadius: 2, margin: "12px auto 0", flexShrink: 0 }} />
              <div style={{ flex: 1, overflowY: "auto", padding: "14px 22px 0" }}>
                <button onClick={() => setBookingStep(1)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 14, display: "flex", alignItems: "center", gap: 6, color: "#555" }}>
                  <span style={{ fontSize: 18 }}>←</span><span style={{ fontSize: 13 }}>Back</span>
                </button>
                <div style={{ fontSize: 17, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.3 }}>When should the professional arrive?</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 4, marginBottom: 20 }}>Consultation will take approx. 1 hr</div>

                {/* Date pills */}
                <div style={{ display: "flex", gap: 10, marginBottom: 18, overflowX: "auto", paddingBottom: 4 }}>
                  {bookingDates.map((d, i) => (
                    <div key={i} onClick={() => setSelectedDateIdx(i)} style={{ flexShrink: 0, width: 68, padding: "12px 0", borderRadius: 12, border: `2px solid ${selectedDateIdx === i ? tokens.primaryDefault : "#E5E5E5"}`, background: selectedDateIdx === i ? tokens.primaryVariant : "white", textAlign: "center", cursor: "pointer", transition: "all 0.15s" }}>
                      <div style={{ fontSize: 11, color: selectedDateIdx === i ? tokens.primaryDefault : "#888" }}>{d.day}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: selectedDateIdx === i ? tokens.primaryDefault : "#1A1A1A", marginTop: 2 }}>{d.date}</div>
                    </div>
                  ))}
                </div>

                {/* Payment notice */}
                <div style={{ background: "#F5F5F5", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
                  <span style={{ fontSize: 16 }}>💳</span>
                  <span style={{ fontSize: 12, color: "#555" }}>Online payment only for selected date</span>
                </div>

                <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 14 }}>Select start time of consultation</div>

                {/* Time slots grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 6 }}>
                  {timeSlots.map(t => (
                    <div key={t} onClick={() => setSelectedTime(t)} style={{ padding: "14px 0", borderRadius: 12, border: `2px solid ${selectedTime === t ? tokens.primaryDefault : "#E5E5E5"}`, background: selectedTime === t ? tokens.primaryVariant : "white", textAlign: "center", cursor: "pointer", fontSize: 14, fontWeight: selectedTime === t ? 600 : 400, color: selectedTime === t ? tokens.primaryDefault : "#1A1A1A", transition: "all 0.15s" }}>{t}</div>
                  ))}
                </div>
              </div>

              {/* Sticky CTA */}
              <div style={{ padding: "12px 22px 36px", background: "white", borderTop: "1px solid #F0F0F0", flexShrink: 0 }}>
                <button onClick={() => { if (selectedDateIdx !== null && selectedTime) setBookingStep(3); }} style={{ width: "100%", background: selectedDateIdx !== null && selectedTime ? "var(--primary)" : "var(--muted)", color: selectedDateIdx !== null && selectedTime ? "var(--primary-foreground)" : "var(--muted-foreground)", border: "none", borderRadius: 9999, height: 52, fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)", fontFamily: "var(--font-roboto)", cursor: selectedDateIdx !== null && selectedTime ? "pointer" : "default", transition: "background 0.2s", letterSpacing: "0.01em" }}>
                  Proceed to checkout
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Payment Summary */}
          {bookingStep === 3 && (
            <div style={{ background: "#F4F4F4", borderRadius: "20px 20px 0 0", maxHeight: "92%", display: "flex", flexDirection: "column" }}>
              {/* Header */}
              <div style={{ background: "white", borderRadius: "20px 20px 0 0", padding: "14px 22px", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid #F0F0F0", flexShrink: 0 }}>
                <button onClick={() => setBookingStep(2)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#333", padding: 0, lineHeight: 1 }}>←</button>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#1A1A1A" }}>Book a Site Visit</div>
              </div>

              <div style={{ flex: 1, overflowY: "auto" }}>
                {/* Item row */}
                <div style={{ background: "white", padding: "16px 22px", marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 12 }}>Livspace Site Visit</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 13, color: "#555" }}>Design consultation at home</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", border: `1px solid ${tokens.primaryDefault}`, borderRadius: 8, overflow: "hidden" }}>
                        <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: tokens.primaryDefault, cursor: "pointer" }}>−</div>
                        <div style={{ width: 22, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600 }}>1</div>
                        <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: tokens.primaryDefault, cursor: "pointer" }}>+</div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>₹99</div>
                    </div>
                  </div>
                </div>

                {/* What happens */}
                <div style={{ background: "white", padding: "16px 22px", marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 12 }}>What happens during consultation</div>
                  {[["👤","Get expert design advice for your space"],["📊","Touch and feel panel samples before you decide"],["📋","Receive a detailed quote tailored to your needs"]].map(([em, txt], i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: i > 0 ? "1px dashed #EBEBEB" : "none" }}>
                      <span style={{ fontSize: 17 }}>{em}</span>
                      <span style={{ fontSize: 13, color: "#444", lineHeight: 1.4 }}>{txt}</span>
                    </div>
                  ))}
                </div>

                {/* Coupons */}
                <div style={{ background: "white", padding: "14px 22px", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} onClick={() => showToast("🏷️ 5 offers available at checkout!")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: tokens.tertiaryGreen, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 14, color: "white" }}>%</span></div>
                    <span style={{ fontSize: 13, color: "#333" }}>Coupons and offers</span>
                  </div>
                  <div style={{ fontSize: 13, color: tokens.primaryDefault, fontWeight: 500 }}>5 offers ›</div>
                </div>

                {/* Contact */}
                <div style={{ background: "white", padding: "14px 22px", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>📞</span>
                    <span style={{ fontSize: 13, color: "#333" }}>Priya Zutshi Anoop, +91-9986806222</span>
                  </div>
                  <div style={{ color: tokens.primaryDefault, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Change</div>
                </div>

                {/* Payment summary */}
                <div style={{ background: "white", padding: "16px 22px", marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 14 }}>Payment summary</div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, paddingBottom: 13, borderBottom: "1px solid #F0F0F0", cursor: "pointer" }}>
                    <span style={{ fontSize: 17, marginTop: 1 }}>🏠</span>
                    <div style={{ flex: 1, fontSize: 13, color: "#333", lineHeight: 1.4 }}>
                      <span style={{ fontWeight: 500 }}>{savedAddresses[selectedAddress].label}</span> – {savedAddresses[selectedAddress].full.substring(0, 38)}...
                    </div>
                    <span style={{ fontSize: 14, color: "#AAAAAA" }}>✎</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 13, cursor: "pointer" }} onClick={() => setBookingStep(2)}>
                    <span style={{ fontSize: 17 }}>🕐</span>
                    <div style={{ flex: 1, fontSize: 13, color: "#333" }}>
                      {selectedDateIdx !== null ? `${bookingDates[selectedDateIdx].day}, Feb ${bookingDates[selectedDateIdx].date}` : "—"}{selectedTime ? ` · ${selectedTime}` : ""}
                    </div>
                    <span style={{ fontSize: 14, color: "#AAAAAA" }}>✎</span>
                  </div>
                </div>
              </div>

              {/* Pay bar */}
              <div style={{ background: "white", borderTop: "1px solid #EBEBEB", padding: "12px 22px 30px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "#999", marginBottom: 3 }}>Pay via</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#333", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 20 }}>💳</span> UPI / Card <span style={{ fontSize: 10, color: "#999" }}>▾</span>
                  </div>
                </div>
                <button onClick={() => { closeBooking(); onPlaceOrder?.(); }} style={{ flex: 1.5, background: "var(--primary)", color: "var(--primary-foreground)", border: "none", borderRadius: 9999, height: 48, fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", fontFamily: "var(--font-gilroy)", cursor: "pointer" }}>Pay ₹99</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AR Viewer */}
      {showARViewer && selectedLook?.img && (
        isDesktop
          ? <DesktopRoomPreview imageUrl={selectedLook.img} lookName={selectedLook.name ?? "Look"} onClose={() => setShowARViewer(false)} />
          : <CameraOverlayViewer imageUrl={selectedLook.img} lookName={selectedLook.name ?? "Look"} onClose={() => setShowARViewer(false)} />
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   SCREEN 7: WISHLIST
══════════════════════════════════════ */
function WishlistScreen({ goTo, goBack: _goBack, wishlist, toggleWishlist, setSelectedLook, isDesktop }: { goTo: (id: ScreenId) => void; goBack: () => void; wishlist: any[]; toggleWishlist: (look: any) => void; setSelectedLook: (l: any) => void; isDesktop?: boolean }) {
  // Always go back to gallery — wishlist is only ever reachable from gallery
  const handleBack = () => goTo("gallery");
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: tokens.surfaceBg, overflow: "hidden" }}>
      {!isDesktop && <div style={{ background: tokens.surfaceDefault }}><StatusBar /></div>}
      <div style={{ ...(isDesktop ? { maxWidth: 720, width: "100%", alignSelf: "center", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" } : { display: "contents" }) }}>
      <NavBar title="My Wishlist" onBack={handleBack} />
      <ProgressStrip pct={75} />

      <div style={{ flex: 1, overflowY: "auto" }}>
        {wishlist.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px", color: tokens.onSurfaceSecondary }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🤍</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: tokens.onSurfaceDefault }}>Your wishlist is empty</div>
            <div style={{ fontSize: 12, marginTop: 5, lineHeight: 1.6 }}>Heart a look while browsing to save it here</div>
            <button onClick={() => goTo("gallery")} style={{ marginTop: 16, background: tokens.onSurfaceDefault, color: "white", border: "none", borderRadius: 11, padding: "12px 22px", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "'Roboto',sans-serif" }}>Browse Looks →</button>
          </div>
        ) : (
          <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 12, color: tokens.onSurfaceSecondary, marginBottom: 2 }}>{wishlist.length} saved look{wishlist.length !== 1 ? "s" : ""}</div>
            {wishlist.map((look, i) => (
              <div key={i} style={{ background: tokens.surfaceDefault, borderRadius: 18, overflow: "hidden", border: `1.5px solid ${tokens.surfaceVariant}`, display: "flex", gap: 0, cursor: "pointer" }}
                onClick={() => { setSelectedLook({ ...look, room: look.room ?? "Living\nRoom" }); goTo("explorer"); }}>
                <div style={{ width: 110, height: 110, flexShrink: 0, position: "relative", overflow: "hidden" }}>
                  <img src={look.img} alt={look.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", top: 7, left: 7, background: tokens.surfaceBg, borderRadius: 5, padding: "2px 7px", fontSize: 8, fontWeight: 700, color: tokens.onSurfaceSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>{look.tag}</div>
                </div>
                <div style={{ flex: 1, padding: "14px 14px 14px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 600, color: tokens.onSurfaceDefault, lineHeight: 1.3 }}>{look.name}</div>
                    <div style={{ fontSize: 12, color: tokens.onSurfaceSecondary, marginTop: 3 }}>{look.items} · {look.room?.replace("\n", " ") ?? "Living Room"}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: tokens.onSurfaceDefault }}>{look.price}</span>
                    <div style={{ display: "flex", gap: 7 }}>
                      <button onClick={e => { e.stopPropagation(); setSelectedLook({ ...look, room: look.room ?? "Living\nRoom" }); goTo("explorer"); }} style={{ background: tokens.onSurfaceDefault, color: "white", border: "none", borderRadius: 8, padding: "7px 11px", fontSize: 11, fontWeight: 500, fontFamily: "'Roboto',sans-serif", cursor: "pointer" }}>Explore</button>
                      <button onClick={e => { e.stopPropagation(); toggleWishlist(look); }} style={{ width: 32, height: 32, background: tokens.primaryVariant, border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>❤️</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {wishlist.length > 0 && (
          <div style={{ margin: "0 20px 20px", background: tokens.surfaceDefault, borderRadius: 18, padding: 18, border: `1px solid ${tokens.surfaceVariant}` }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: tokens.onSurfaceDefault }}>💡 Curate your selection</div>
            <div style={{ fontSize: 12, color: tokens.onSurfaceSecondary, marginTop: 4, lineHeight: 1.5 }}>Add your favourite items to cart and get a full home quote from a Livspace designer.</div>
            <button onClick={() => goTo("gallery")} style={{ marginTop: 12, background: tokens.surfaceBg, color: tokens.onSurfaceDefault, border: `1.5px solid ${tokens.surfaceVariant}`, borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'Roboto',sans-serif" }}>Discover more looks →</button>
          </div>
        )}
      </div>

      {wishlist.length > 0 && (
        <div style={{ padding: "14px 20px", background: tokens.surfaceDefault, borderTop: `1px solid ${tokens.surfaceVariant}`, flexShrink: 0 }}>
          <button onClick={() => goTo("gallery")} style={{ width: "100%", background: tokens.primaryDefault, color: "white", border: "none", borderRadius: 12, padding: "16px 20px", fontSize: 15, fontWeight: 500, fontFamily: "'Roboto',sans-serif", cursor: "pointer" }}>
            Explore All Looks
          </button>
        </div>
      )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   SCREEN 8: CART
════════════════════════════════����════ */
function CartScreen({ goTo, goBack, cart, cartTotal, removeItem, selectedLook, isDesktop, setGalleryInitialRoom, onPlaceOrder }: { goTo: (id: ScreenId) => void; goBack: () => void; cart: CartItem[]; cartTotal: number; removeItem: (k: string) => void; selectedLook?: SelectedLook | null; isDesktop?: boolean; setGalleryInitialRoom?: (room: string) => void; onPlaceOrder?: () => void }) {
  /* Two-flow classification */
  const hasServiceItems = cart.some(i => i.category && SERVICE_CATEGORIES.has(i.category));
  const serviceItems = cart.filter(i => i.category && SERVICE_CATEGORIES.has(i.category));
  const readyItems = cart.filter(i => !i.category || !SERVICE_CATEGORIES.has(i.category));
  const readyTotal = readyItems.reduce((s, i) => s + i.price, 0);
  const serviceTotal = serviceItems.reduce((s, i) => s + i.price, 0);

  const furniture = cart.filter(i => ["sofa", "tv", "table"].includes(i.key)).reduce((s, i) => s + i.price, 0);
  const decor = cart.filter(i => !["sofa", "tv", "table"].includes(i.key)).reduce((s, i) => s + i.price, 0);
  const total = cartTotal + 4999;
  const roomLabel = selectedLook ? `${selectedLook.room?.replace("\n", " ")} · ${selectedLook.name}` : "Living Room · Quiet Luxury Look";
  const roomName = selectedLook?.room?.replace("\n", " ") ?? "Living Room";
  const lookName = selectedLook?.name ?? "Quiet Luxury Look";

  const [showDesignerSheet, setShowDesignerSheet] = useState(false);
  const [dcDate, setDcDate] = useState<string>("");
  const [dcTime, setDcTime] = useState<string>("");
  const [dcBooked, setDcBooked] = useState(false);

  const dcDays: { label: string; sub: string; val: string }[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2026, 1, 23 + i);
    return {
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-IN", { weekday: "short" }),
      sub: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      val: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }),
    };
  });
  const dcSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: tokens.surfaceBg, overflow: "hidden" }}>
      {!isDesktop && <div style={{ background: tokens.surfaceDefault }}><StatusBar /></div>}
      <div style={{ ...(isDesktop ? { maxWidth: 760, width: "100%", alignSelf: "center", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" } : { display: "contents" }) }}>
      <NavBar title="My Cart" onBack={goBack} />
      <ProgressStrip pct={90} />

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Room Card */}
        <div style={{ margin: "14px 20px", background: tokens.surfaceDefault, borderRadius: 18, overflow: "hidden", border: `1px solid ${tokens.surfaceVariant}` }}>
          <div style={{ height: 110, position: "relative" }}>
            {selectedLook?.img ? (
              <img src={selectedLook.img} alt={lookName} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "linear-gradient(180deg,#C8B4A0 0%,#DCC8B0 30%,#D0B898 60%,#BCA480 100%)", position: "relative" }}>
                <div style={{ position: "absolute", bottom: "28%", left: "10%", width: "50%", height: "20%", background: "rgba(107,80,72,0.8)", borderRadius: "8px 8px 3px 3px" }} />
              </div>
            )}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "7px 13px", background: "linear-gradient(to top,rgba(0,0,0,0.62),transparent)", color: "white", fontSize: 11 }}>{roomLabel}</div>
          </div>
          <div style={{ padding: "13px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: tokens.onSurfaceDefault }}>{roomName}</div>
              <div style={{ fontSize: 12, color: tokens.onSurfaceSecondary, marginTop: 2 }}>{cart.length} items selected</div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: tokens.primaryDefault }}>{fmt(cartTotal)}</div>
          </div>
        </div>

        {/* Cart Items */}
        <div style={{ padding: "0 20px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: tokens.onSurfaceSecondary }}>
              <div style={{ fontSize: 46, marginBottom: 10 }}>🛒</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: tokens.onSurfaceDefault }}>Your cart is empty</div>
              <div style={{ fontSize: 12, marginTop: 5 }}>Explore a Look and add items</div>
              <button onClick={() => goTo("gallery")} style={{ marginTop: 14, background: tokens.onSurfaceDefault, color: "white", border: "none", borderRadius: 11, padding: "12px 22px", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "'Roboto',sans-serif" }}>Browse Looks →</button>
            </div>
          ) : (<>
            {/* Service disclaimer */}
            {hasServiceItems && (
              <div style={{ background: tokens.extendedMustard + "66", border: `1px solid ${tokens.tertiaryYellow}`, borderRadius: 12, padding: "11px 14px", marginBottom: 10, display: "flex", gap: 9, alignItems: "flex-start" }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>🏠</span>
                <div style={{ fontSize: 11, color: "#7A5200", lineHeight: 1.55 }}>
                  <strong>Service items included.</strong> Prices shown are approximate — your Livspace designer will confirm the final quote after the site visit. Book a site visit to lock in your design.
                </div>
              </div>
            )}
            {cart.map(item => {
              const isSvc = item.category ? SERVICE_CATEGORIES.has(item.category) : false;
              return (
                <div key={item.key} style={{ background: isSvc ? (tokens.extendedMustard + "33") : tokens.surfaceDefault, borderRadius: 14, padding: 13, display: "flex", gap: 13, alignItems: "center", marginBottom: 9, border: `1px solid ${isSvc ? tokens.tertiaryYellow : tokens.surfaceVariant}` }}>
                  <div style={{ width: 56, height: 56, background: isSvc ? tokens.extendedMustard : tokens.surfaceBg, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0, position: "relative" }}>
                    {item.emoji}
                    {isSvc && <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)", background: "#F19E2B", color: "white", fontSize: 7, fontWeight: 700, borderRadius: 3, padding: "1px 4px", whiteSpace: "nowrap" }}>SERVICE</div>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: tokens.onSurfaceDefault, lineHeight: 1.3 }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: tokens.onSurfaceSecondary, marginTop: 2 }}>{item.lookName ?? lookName} · {item.lookRoom?.replace("\n", " ") ?? roomName}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: tokens.onSurfaceDefault }}>{isSvc ? "~" : ""}{fmt(item.price)}</span>
                      {isSvc && <span style={{ fontSize: 9, color: tokens.tertiaryYellow, fontWeight: 600 }}>APPROX</span>}
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.key)} style={{ width: 26, height: 26, background: tokens.surfaceBg, border: "none", borderRadius: "50%", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", color: tokens.onSurfaceSecondary, flexShrink: 0 }}>✕</button>
                </div>
              );
            })}
          </>)}
        </div>

        {/* Budget Widget */}
        {cart.length > 0 && (
          <div style={{ margin: "0 20px 14px", background: tokens.surfaceDefault, borderRadius: 18, padding: 18, border: `1px solid ${tokens.surfaceVariant}` }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: tokens.onSurfaceDefault }}>💰 Budget Breakdown</div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 9 }}>
              {hasServiceItems ? (<>
                {readyItems.length > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: tokens.onSurfaceSecondary }}>Ready-to-ship items</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: tokens.onSurfaceDefault }}>{fmt(readyTotal)}</span>
                  </div>
                )}
                {serviceItems.length > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: tokens.onSurfaceSecondary }}>Service items <span style={{ fontSize: 10, color: tokens.tertiaryYellow }}>APPROX</span></span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: tokens.onSurfaceDefault }}>~{fmt(serviceTotal)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: tokens.onSurfaceSecondary }}>Installation</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: tokens.onSurfaceDefault }}>₹4,999</span>
                </div>
                <div style={{ height: 1, background: tokens.surfaceVariant, margin: "3px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: tokens.onSurfaceDefault }}>Est. Total *</span>
                  <span style={{ fontSize: 17, fontWeight: 700, color: tokens.tertiaryYellow }}>~{fmt(total)}</span>
                </div>
                <div style={{ fontSize: 10, color: tokens.onSurfaceSecondary, marginTop: 2 }}>* Final quote confirmed after site visit</div>
              </>) : (<>
                {[["Furniture", fmt(furniture)], ["Décor & Lighting", fmt(decor)], ["Installation", "₹4,999"]].map(([l, v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: tokens.onSurfaceSecondary }}>{l}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: tokens.onSurfaceDefault }}>{v}</span>
                  </div>
                ))}
                <div style={{ height: 1, background: tokens.surfaceVariant, margin: "3px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: tokens.onSurfaceDefault }}>Total</span>
                  <span style={{ fontSize: 17, fontWeight: 700, color: tokens.primaryDefault }}>{fmt(total)}</span>
                </div>
              </>)}
            </div>
            {!hasServiceItems && (
              <div style={{ marginTop: 12, background: tokens.tertiaryGreenV1, borderRadius: 11, padding: 11, display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ fontSize: 18 }}>🏦</span>
                <div style={{ fontSize: 12, color: tokens.onSurfaceDefault, lineHeight: 1.4, flex: 1 }}>Or pay as low as <span style={{ fontSize: 13, fontWeight: 700, color: tokens.tertiaryGreen }}>₹{Math.round(total / 24).toLocaleString("en-IN")}/mo</span> · 0% EMI · 24 months</div>
              </div>
            )}
          </div>
        )}

        {/* Designer Call Card */}
        <div onClick={() => !dcBooked && setShowDesignerSheet(true)} style={{ margin: "0 20px 14px", background: dcBooked ? "#1B4332" : tokens.secondaryDefault, borderRadius: 18, padding: 18, display: "flex", gap: 13, alignItems: "center", cursor: dcBooked ? "default" : "pointer", transition: "background 0.3s" }}>
          <div style={{ width: 46, height: 46, background: tokens.primaryDefault, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>👩‍🎨</div>
          <div style={{ flex: 1 }}>
            {dcBooked ? (
              <>
                <div style={{ fontSize: 14, fontWeight: 500, color: "white" }}>✅ Call Scheduled!</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 3 }}>{dcDate} · {dcTime}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>Your designer will call you at this time</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 14, fontWeight: 500, color: "white" }}>Book a call with designer</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>Pick a time · Designer calls you to help with doubts</div>
              </>
            )}
          </div>
          {!dcBooked && <div style={{ fontSize: 12, color: tokens.extendedMustard, fontWeight: 500, flexShrink: 0 }}>Book →</div>}
        </div>

        {/* Rooms Nudge */}
        <div style={{ margin: "0 20px 20px", background: tokens.surfaceDefault, borderRadius: 18, padding: 18, border: `1px solid ${tokens.surfaceVariant}` }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: tokens.onSurfaceDefault }}>🏠 Complete your home</div>
          <div style={{ fontSize: 12, color: tokens.onSurfaceSecondary, marginTop: 4 }}>Design 5 more rooms · Save 15% on full-home package</div>
          <div style={{ display: "flex", gap: 8, marginTop: 13, overflowX: "auto" }}>
            {[
              { label: "🛏️ Bedroom",  room: "Bedroom"   },
              { label: "🍳 Kitchen",  room: "Kitchen"   },
              { label: "🧸 Kids Room", room: "Kids Room" },
              { label: "🌿 Balcony",  room: "Balcony"   },
            ].map(({ label, room }) => (
              <div
                key={label}
                onClick={() => { setGalleryInitialRoom?.(room); goTo("gallery"); }}
                style={{ flexShrink: 0, background: tokens.surfaceBg, border: `1px solid ${tokens.surfaceVariant}`, borderRadius: 10, padding: "9px 13px", fontSize: 12, color: tokens.onSurfaceDefault, cursor: "pointer" }}
              >{label}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "14px 20px", background: tokens.surfaceDefault, borderTop: `1px solid ${tokens.surfaceVariant}`, flexShrink: 0 }}>
        {hasServiceItems ? (
          <button onClick={() => onPlaceOrder?.()} style={{ width: "100%", background: tokens.primaryDefault, color: "white", border: "none", borderRadius: 12, padding: "16px 20px", fontSize: 15, fontWeight: 600, fontFamily: "'Roboto',sans-serif", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>🏠 Book Site Visit</span>
            <span>₹99 →</span>
          </button>
        ) : (
          <button onClick={() => onPlaceOrder?.()} style={{ width: "100%", background: "var(--primary)", color: "var(--primary-foreground)", border: "none", borderRadius: 9999, padding: "0 20px", height: 48, fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", fontFamily: "var(--font-gilroy)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>Place Order</span>
            
          </button>
        )}
      </div>

      {/* Designer Call Scheduler Sheet */}
      {showDesignerSheet && (
        <div onClick={e => { if (e.target === e.currentTarget) setShowDesignerSheet(false); }} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40, display: "flex", alignItems: "flex-end" }}>
          <div style={{ background: tokens.surfaceDefault, borderRadius: "24px 24px 0 0", width: "100%", padding: "0 22px 36px", maxHeight: "80%" }}>
            {/* Handle */}
            <div style={{ width: 38, height: 4, background: tokens.surfaceVariant, borderRadius: 2, margin: "12px auto 20px" }} />

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: tokens.onSurfaceDefault }}>Schedule a Call</div>
                <div style={{ fontSize: 12, color: tokens.onSurfaceSecondary, marginTop: 3 }}>Our designer will call you at your chosen time</div>
              </div>
              <button onClick={() => setShowDesignerSheet(false)} style={{ width: 30, height: 30, border: "none", background: tokens.surfaceBg, borderRadius: "50%", cursor: "pointer", fontSize: 14, color: tokens.onSurfaceSecondary, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>

            {/* Date Picker */}
            <div style={{ fontSize: 13, fontWeight: 500, color: tokens.onSurfaceDefault, marginBottom: 11 }}>Select a date</div>
            <div style={{ display: "flex", gap: 9, overflowX: "auto", paddingBottom: 4, marginBottom: 22 }}>
              {dcDays.map(day => {
                const sel = dcDate === day.val;
                return (
                  <div key={day.val} onClick={() => setDcDate(day.val)} style={{ flexShrink: 0, minWidth: 62, background: sel ? tokens.primaryDefault : tokens.surfaceBg, border: `1.5px solid ${sel ? tokens.primaryDefault : tokens.surfaceVariant}`, borderRadius: 14, padding: "10px 8px", textAlign: "center", cursor: "pointer", transition: "all 0.18s" }}>
                    <div style={{ fontSize: 11, color: sel ? "rgba(255,255,255,0.75)" : tokens.onSurfaceSecondary }}>{day.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: sel ? "white" : tokens.onSurfaceDefault, marginTop: 3 }}>{day.sub}</div>
                  </div>
                );
              })}
            </div>

            {/* Time Slots */}
            <div style={{ fontSize: 13, fontWeight: 500, color: tokens.onSurfaceDefault, marginBottom: 11 }}>Select a time slot</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 9, marginBottom: 24 }}>
              {dcSlots.map(slot => {
                const sel = dcTime === slot;
                return (
                  <div key={slot} onClick={() => setDcTime(slot)} style={{ background: sel ? tokens.primaryDefault : tokens.surfaceBg, border: `1.5px solid ${sel ? tokens.primaryDefault : tokens.surfaceVariant}`, borderRadius: 11, padding: "9px 4px", textAlign: "center", cursor: "pointer", fontSize: 12, fontWeight: sel ? 600 : 400, color: sel ? "white" : tokens.onSurfaceDefault, transition: "all 0.18s" }}>
                    {slot}
                  </div>
                );
              })}
            </div>

            {/* Confirm Button */}
            <button
              disabled={!dcDate || !dcTime}
              onClick={() => {
                setDcBooked(true);
                setShowDesignerSheet(false);
              }}
              style={{ width: "100%", background: dcDate && dcTime ? tokens.primaryDefault : tokens.surfaceVariant, color: dcDate && dcTime ? "white" : tokens.onSurfaceSecondary, border: "none", borderRadius: 14, padding: "15px 20px", fontSize: 15, fontWeight: 600, fontFamily: "'Roboto',sans-serif", cursor: dcDate && dcTime ? "pointer" : "not-allowed", transition: "background 0.2s" }}
            >
              {dcDate && dcTime ? `Confirm · ${dcDate} at ${dcTime}` : "Pick a date & time"}
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   SCREEN 8: SUCCESS
══════════════════════════════════════ */
function SuccessScreen({ goTo, showToast, isDesktop, orderId }: { goTo: (id: ScreenId) => void; showToast: (m: string) => void; isDesktop?: boolean; orderId?: string }) {
  const steps = [
    { em: "📞", title: "Designer will call you", meta: "Within 2 hours · Finalise the look", active: true },
    { em: "📐", title: "Site measurement visit", meta: "Within 3 days · Free of charge", active: false },
    { em: "🏭", title: "Manufacturing begins", meta: "Day 5–30 · Bengaluru facility", active: false },
    { em: "🏠", title: "Move-in ready!", meta: "45-day guarantee", active: false },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: tokens.inverseDefault, overflow: "hidden" }}>
      {!isDesktop && <StatusBar dark />}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", padding: isDesktop ? "60px 40px" : "40px 28px", textAlign: "center", maxWidth: isDesktop ? 640 : "none", alignSelf: isDesktop ? "center" : "stretch", width: "100%" }}>
        <div className="success-ring-anim" style={{ width: 96, height: 96, borderRadius: "50%", background: "radial-gradient(circle,rgba(235,89,95,0.2) 0%,transparent 70%)", border: "2px solid rgba(235,89,95,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46 }}>🏠</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: "white", fontWeight: 700, marginTop: 22, lineHeight: 1.2 }}>Your dream<br /><em style={{ color: tokens.primaryDefault, fontStyle: "italic" }}>home awaits!</em></div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", marginTop: 10, lineHeight: 1.6 }}>Order confirmed! Our team will call you within 2 hours to schedule a site visit and finalise installations.</div>

        <div style={{ width: "100%", marginTop: 22, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Order Reference</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 21, fontWeight: 700, color: tokens.extendedMustard, marginTop: 4 }}>#{orderId || "LVS-0000-0000"}</div>
        </div>

        <div style={{ width: "100%", marginTop: 22, textAlign: "left" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 12, fontWeight: 500 }}>What happens next</div>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "10px 0", position: "relative" }}>
              {i < steps.length - 1 && <div style={{ position: "absolute", left: 14, top: 42, bottom: 0, width: 1, background: "rgba(255,255,255,0.08)" }} />}
              <div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, background: s.active ? tokens.primaryDefault : "rgba(255,255,255,0.1)" }}>{s.em}</div>
              <div><div style={{ fontSize: 13, fontWeight: 500, color: "white" }}>{s.title}</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{s.meta}</div></div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 9, width: "100%", marginTop: 26 }}>
          <button onClick={() => showToast("📱 AR mode — point phone at your room!")} style={{ flex: 1, padding: 14, borderRadius: 12, fontSize: 13, fontWeight: 500, fontFamily: "'Roboto',sans-serif", cursor: "pointer", border: "none", background: tokens.primaryDefault, color: "white" }}>📱 View in AR</button>
          <button onClick={() => goTo("orders")} style={{ flex: 1, padding: 14, borderRadius: 12, fontSize: 13, fontWeight: 500, fontFamily: "'Roboto',sans-serif", cursor: "pointer", background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.15)" }}>Track Order</button>
        </div>
        <button onClick={() => goTo("splash")} style={{ marginTop: 14, width: "100%", background: "none", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 12, padding: 13, color: "rgba(255,255,255,0.55)", fontSize: 13, fontFamily: "'Roboto',sans-serif", cursor: "pointer" }}>← Back to Home</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   SCREEN 9: MY ORDERS
══════════════════════════════════════ */
/* ════════════════════════════════════════
   ELEVATE SCREEN — Wall Designs Gallery
════════════════════════════════════════ */
const ELEVATE_STYLE_OPTIONS = ["Modern","Traditional","Farmhouse","Minimalist","Industrial","Scandinavian","Transitional","Mediterranean","Mid-Century Modern","Bohemian"] as const;
const ELEVATE_COLOR_OPTIONS  = ["White/Neutral","Dark/Moody","Two-Tone","Wood Tones","Bold/Colorful","Black & White","Earthy/Warm","Cool Tones"] as const;
const ELEVATE_MATERIAL_OPTIONS = ["Wood","Wallpaper","Rattan","Metal"] as const;

const INSTALL_STEPS = [
  { num: 1, title: "Site Inspection",     desc: "Our team visits to assess and measure your space",         img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&q=80" },
  { num: 2, title: "Design Approval",     desc: "Review and approve the final design plan",                  img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=700&q=80" },
  { num: 3, title: "Professional Install", desc: "Expert installation with quality craftsmanship",           img: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=700&q=80" },
  { num: 4, title: "Final Walkthrough",   desc: "Ensure everything meets your expectations",                 img: "https://images.unsplash.com/photo-1631048499455-4f9e26f23b9f?w=700&q=80" },
];

const REVIEWS = [
  { name: "Priya Sharma", rating: 5, text: "Absolutely stunning! The team was professional and the installation was seamless. Highly recommend." },
  { name: "Rajesh Kumar", rating: 5, text: "Transformed my living room completely. The quality is outstanding and worth every penny." },
  { name: "Anita Desai",  rating: 4, text: "Great design and great service. Installation took a bit longer than expected but the result is fantastic." },
];

const FAQS = [
  { q: "Is the consultation fee refundable?",  a: "Yes, the ₹99 fee is fully adjustable against your project cost." },
  { q: "What's included in the warranty?",      a: "Our warranty covers material defects and workmanship issues for the specified period." },
  { q: "Can I customize the design?",           a: "Absolutely! Our team can customize sizes, materials, and dimensions to suit your space." },
  { q: "How long does installation take?",      a: "Installation time varies by design complexity, typically ranging from 1–5 days." },
];

const ADDON_MAP: Record<string, { id: string; name: string; price: number; icon: string }[]> = {
  Wood:      [{ id: "a0", name: "Floating Shelf (4ft)", price: 2599, icon: "🪵" }, { id: "a1", name: "LED Strip Light", price: 1799, icon: "💡" }],
  Rattan:    [{ id: "a0", name: "Rattan Frame Shelf",   price: 2199, icon: "🪵" }, { id: "a1", name: "Warm Glow Light",  price: 1599, icon: "💡" }],
  Wallpaper: [{ id: "a0", name: "Accent Frame",         price: 1499, icon: "🖼️" }, { id: "a1", name: "Ambient Light",   price: 1299, icon: "💡" }],
  Metal:     [{ id: "a0", name: "Wall Shelf",           price: 2399, icon: "🪵" }, { id: "a1", name: "Spotlight",        price: 2199, icon: "💡" }],
};

const SWATCH_MAP: Record<string, { name: string; hex: string }[]> = {
  "Wood Tones":    [{ name: "Oak Natural", hex: "#C4955A" }, { name: "Walnut Brown", hex: "#6B3F2A" }, { name: "Ash White",   hex: "#F0EDE8" }],
  "White/Neutral": [{ name: "Pure White",  hex: "#F8F8F8" }, { name: "Warm Cream",   hex: "#F2EFE8" }, { name: "Soft Grey",   hex: "#D8D8D8" }],
  "Dark/Moody":    [{ name: "Charcoal",    hex: "#2C2C2C" }, { name: "Slate Grey",   hex: "#5A6070" }, { name: "Midnight",    hex: "#1A1A2E" }],
  "Earthy/Warm":   [{ name: "Terracotta",  hex: "#C4834A" }, { name: "Sage Dust",    hex: "#8FAF8F" }, { name: "Sand Beige",  hex: "#D4B896" }],
  "Cool Tones":    [{ name: "Steel Blue",  hex: "#7BA7C4" }, { name: "Mist Green",   hex: "#98B4A0" }, { name: "Dusty Lilac", hex: "#B0A0C0" }],
  "Bold/Colorful": [{ name: "Coral",       hex: "#E74C3C" }, { name: "Mustard",      hex: "#F39C12" }, { name: "Teal",        hex: "#2ECC71" }],
  "Black & White": [{ name: "Jet Black",   hex: "#1A1A1A" }, { name: "Pure White",   hex: "#F5F5F5" }, { name: "Mid Grey",    hex: "#888888" }],
  "Two-Tone":      [{ name: "Taupe",       hex: "#B5A89A" }, { name: "Slate Teal",   hex: "#6B8E8E" }, { name: "Off White",   hex: "#F2EFE8" }],
};

function WallDesignDetail({ design, allDesigns, onBack, isDesktop, onBookConsultation }: {
  design: WallDesign;
  allDesigns: WallDesign[];
  onBack: () => void;
  isDesktop?: boolean;
  onBookConsultation?: () => void;
}) {
  const [openFaq,        setOpenFaq]        = React.useState<number | null>(null);
  const [selectedAddons, setSelectedAddons] = React.useState<Set<string>>(new Set(["a0"]));
  const [activeImg,      setActiveImg]      = React.useState(0);

  /* ── Booking flow state ── */
  const [showBookingFlow, setShowBookingFlow] = React.useState(false);
  const [bookingStep,     setBookingStep]     = React.useState<1|2|3>(1);
  const [selectedAddress, setSelectedAddress] = React.useState(0);
  const [selectedDateIdx, setSelectedDateIdx] = React.useState<number|null>(null);
  const [selectedTime,    setSelectedTime]    = React.useState<string|null>(null);

  const savedAddresses = [
    { label: "Home",   full: "13252, Prestige Lakeside Habitat, SH Nagar, Bengaluru - 560037" },
    { label: "Office", full: "Bagmane Tech Park, CV Raman Nagar, Bengaluru - 560093" },
  ];
  const bookingDates = [
    { day: "Mon", date: 23 }, { day: "Tue", date: 24 }, { day: "Wed", date: 25 },
    { day: "Thu", date: 26 }, { day: "Fri", date: 27 },
  ];
  const timeSlots = ["10:00 AM", "01:00 PM", "04:00 PM", "07:00 PM"];

  const closeBooking = () => { setShowBookingFlow(false); setBookingStep(1); setSelectedDateIdx(null); setSelectedTime(null); };
  const openBooking  = () => { setShowBookingFlow(true);  setBookingStep(1); };

  const images = design.images && design.images.length > 0 ? design.images : [design.img];

  const addons   = ADDON_MAP[design.material] ?? ADDON_MAP.Metal;
  const swatches = SWATCH_MAP[design.colorScheme] ?? SWATCH_MAP["White/Neutral"];
  const similar  = allDesigns.filter(d => d.id !== design.id && (d.room === design.room || d.tag === design.tag)).slice(0, 5);

  const addonsTotal = addons.filter(a => selectedAddons.has(a.id)).reduce((s, a) => s + a.price, 0);

  const toggleAddon = (id: string) => setSelectedAddons(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const KEY_PROPS_MAP: Record<string, { icon: string; label: string }[]> = {
    Metal:   [{ icon: "💧", label: "Rust Resistant" }, { icon: "✨", label: "High Gloss" }, { icon: "🧹", label: "Easy Clean" }, { icon: "🔥", label: "Heat Resistant" }],
    Wood:    [{ icon: "🌿", label: "Natural Look" }, { icon: "🌱", label: "Eco-Friendly" }, { icon: "🔨", label: "Easy Install" }, { icon: "🛡️", label: "Termite Resistant" }],
    Fabric:  [{ icon: "🤲", label: "Soft Texture" }, { icon: "☀️", label: "Fade Resistant" }, { icon: "🧹", label: "Easy Clean" }, { icon: "🔥", label: "Fire Retardant" }],
    Glass:   [{ icon: "✨", label: "High Gloss" }, { icon: "💧", label: "Waterproof" }, { icon: "🧹", label: "Easy Clean" }, { icon: "🌟", label: "UV Resistant" }],
    default: [{ icon: "🌟", label: "Premium Quality" }, { icon: "💧", label: "Waterproof" }, { icon: "🧹", label: "Easy Clean" }, { icon: "🛡️", label: "UV Resistant" }],
  };
  const keyProps = KEY_PROPS_MAP[design.material] ?? KEY_PROPS_MAP.default;

  const IDEAL_ROOMS: Record<string, string[]> = {
    "Living Room": ["Living Room", "Bedroom", "Hallway"],
    "Bedroom":     ["Bedroom", "Living Room", "Study"],
    "Kitchen":     ["Kitchen", "Dining", "Utility"],
    "Bathroom":    ["Bathroom", "Laundry"],
    "Office":      ["Office", "Study", "Library"],
    "Kids Room":   ["Kids Room", "Playroom", "Nursery"],
  };
  const idealRooms = IDEAL_ROOMS[design.room] ?? [design.room];

  const offers = [
    { tag: "NEW", code: "ELEV5",    title: "5% off",  desc: "On your first Elevate order", color: "#E8F5E9", border: "#A5D6A7", text: "#2E7D32" },
    { tag: "HOT", code: "ELEV500",  title: "₹500 off", desc: "On orders above ₹15,000",    color: "#FFF8E1", border: "#FFD54F", text: "#E65100" },
    { tag: "TOP", code: "DESIGN10", title: "10% off", desc: "On full room makeover bundle", color: "#F3E5F5", border: "#CE93D8", text: "#6A1B9A" },
  ];

  /* ── Booking modal ── */
  const sheetRadius = isDesktop ? 20 : "20px 20px 0 0";
  const sheetWidth  = isDesktop ? "90%" : "100%";
  const sheetMaxW   = isDesktop ? 480 : undefined;
  const DragHandle  = () => !isDesktop ? <div style={{ width: 36, height: 4, borderRadius: 2, background: "#D8D8D8", margin: "0 auto 20px" }} /> : null;

  const BookingModal = () => (
    <div
      onClick={e => { if (e.target === e.currentTarget) closeBooking(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 200, display: "flex", alignItems: isDesktop ? "center" : "flex-end", justifyContent: "center" }}
    >
      {bookingStep === 1 && (
        <div style={{ background: "white", borderRadius: sheetRadius, padding: "20px 24px 36px", width: sheetWidth, maxWidth: sheetMaxW }}>
          <DragHandle />
          <div style={{ fontSize: 18, fontWeight: 600, color: "#1A1A1A", marginBottom: 4 }}>Select service address</div>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 18 }}>Our designer will visit this location</div>
          {savedAddresses.map((addr, i) => (
            <div key={i} onClick={() => setSelectedAddress(i)} style={{ display: "flex", alignItems: "flex-start", gap: 13, padding: "13px 0", borderBottom: "1px solid #F2F2F2", cursor: "pointer" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${selectedAddress === i ? tokens.primaryDefault : "#C8C8C8"}`, background: selectedAddress === i ? tokens.primaryDefault : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                {selectedAddress === i && <div style={{ width: 6, height: 6, background: "white", borderRadius: "50%" }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{addr.label}</div>
                <div style={{ fontSize: 12, color: "#777", marginTop: 2 }}>{addr.full}</div>
              </div>
            </div>
          ))}
          <button onClick={() => setBookingStep(2)} style={{ width: "100%", background: tokens.primaryDefault, color: "white", border: "none", borderRadius: 9999, height: 48, fontSize: 14, fontWeight: 600, fontFamily: "var(--font-gilroy)", cursor: "pointer", marginTop: 20 }}>Continue →</button>
        </div>
      )}
      {bookingStep === 2 && (
        <div style={{ background: "white", borderRadius: sheetRadius, padding: "20px 24px 36px", width: sheetWidth, maxWidth: sheetMaxW }}>
          <DragHandle />
          <button onClick={() => setBookingStep(1)} style={{ background: "none", border: "none", cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", gap: 6, color: "#555", padding: 0 }}>
            <span style={{ fontSize: 18 }}>←</span><span style={{ fontSize: 13 }}>Back</span>
          </button>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#1A1A1A", marginBottom: 4 }}>When should the professional arrive?</div>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 20 }}>Consultation will take approx. 1 hr</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {bookingDates.map((d, i) => (
              <div key={i} onClick={() => setSelectedDateIdx(i)} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: `2px solid ${selectedDateIdx === i ? tokens.primaryDefault : "#E5E5E5"}`, background: selectedDateIdx === i ? "#FFF0F0" : "white", textAlign: "center", cursor: "pointer" }}>
                <div style={{ fontSize: 11, color: selectedDateIdx === i ? tokens.primaryDefault : "#888" }}>{d.day}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: selectedDateIdx === i ? tokens.primaryDefault : "#1A1A1A" }}>{d.date}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {timeSlots.map(t => (
              <div key={t} onClick={() => setSelectedTime(t)} style={{ padding: "14px 0", borderRadius: 12, border: `2px solid ${selectedTime === t ? tokens.primaryDefault : "#E5E5E5"}`, background: selectedTime === t ? "#FFF0F0" : "white", textAlign: "center", cursor: "pointer", fontSize: 14, fontWeight: selectedTime === t ? 600 : 400, color: selectedTime === t ? tokens.primaryDefault : "#1A1A1A" }}>
                {t}
              </div>
            ))}
          </div>
          <button
            onClick={() => { if (selectedDateIdx !== null && selectedTime) setBookingStep(3); }}
            style={{ width: "100%", background: selectedDateIdx !== null && selectedTime ? tokens.primaryDefault : "#E0E0E0", color: selectedDateIdx !== null && selectedTime ? "white" : "#999", border: "none", borderRadius: 9999, height: 52, fontSize: 15, fontWeight: 600, fontFamily: "var(--font-roboto)", cursor: selectedDateIdx !== null && selectedTime ? "pointer" : "default" }}
          >Proceed to checkout</button>
        </div>
      )}
      {bookingStep === 3 && (
        <div style={{ background: "white", borderRadius: sheetRadius, width: sheetWidth, maxWidth: sheetMaxW, display: "flex", flexDirection: "column", maxHeight: "90vh" }}>
          <DragHandle />
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "4px 20px 16px", borderBottom: "1px solid #F0F0F0", flexShrink: 0 }}>
            <button onClick={() => setBookingStep(2)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#333", padding: 0, display: "flex", alignItems: "center" }}>←</button>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#1A1A1A", fontFamily: "var(--font-gilroy)" }}>Book a Site Visit</span>
          </div>

          {/* Scrollable body */}
          <div style={{ flex: 1, overflowY: "auto" }}>

            {/* Service item row */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #F0F0F0" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 3 }}>Livspace Site Visit</div>
                  <div style={{ fontSize: 12, color: "#888" }}>Design consultation at home</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 0, border: `1.5px solid ${tokens.primaryDefault}`, borderRadius: 8, overflow: "hidden" }}>
                    <button style={{ width: 30, height: 30, background: "none", border: "none", cursor: "pointer", fontSize: 16, color: tokens.primaryDefault, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                    <span style={{ width: 26, textAlign: "center", fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>1</span>
                    <button style={{ width: 30, height: 30, background: "none", border: "none", cursor: "pointer", fontSize: 16, color: tokens.primaryDefault, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", minWidth: 36, textAlign: "right" }}>₹99</span>
                </div>
              </div>
            </div>

            {/* What happens */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #F0F0F0" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 14 }}>What happens during consultation</div>
              {([["👤","Get expert design advice for your space"],["📊","Touch and feel panel samples before you decide"],["📋","Receive a detailed quote tailored to your needs"]] as [string,string][]).map(([em, txt], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 0", borderTop: i > 0 ? "1px solid #F0F0F0" : "none" }}>
                  <span style={{ fontSize: 20, width: 28, textAlign: "center", flexShrink: 0 }}>{em}</span>
                  <span style={{ fontSize: 13, color: "#444", lineHeight: 1.4 }}>{txt}</span>
                </div>
              ))}
            </div>

            {/* Coupons row */}
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #F0F0F0", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#2E7D32", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 14, color: "white" }}>%</span>
              </div>
              <span style={{ flex: 1, fontSize: 14, color: "#1A1A1A" }}>Coupons and offers</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: tokens.primaryDefault }}>5 offers ›</span>
            </div>

            {/* Contact row */}
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #F0F0F0", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>📞</span>
              <span style={{ flex: 1, fontSize: 13, color: "#444" }}>Priya Zutshi Anoop, +91-9986806222</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: tokens.primaryDefault, cursor: "pointer" }}>Change</span>
            </div>

            {/* Payment summary */}
            <div style={{ padding: "16px 20px 24px" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 14 }}>Payment summary</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 12, borderBottom: "1px solid #F0F0F0" }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>🏠</span>
                <span style={{ flex: 1, fontSize: 13, color: "#444" }}><strong>Home</strong> – {savedAddresses[selectedAddress]?.full.substring(0, 36)}...</span>
                <span style={{ fontSize: 14, color: "#BBB" }}>📎</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 12 }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>🕐</span>
                <span style={{ flex: 1, fontSize: 13, color: "#444" }}>{bookingDates[selectedDateIdx ?? 0]?.day}, Feb {bookingDates[selectedDateIdx ?? 0]?.date} · {selectedTime}</span>
                <span style={{ fontSize: 14, color: "#BBB" }}>📎</span>
              </div>
            </div>
          </div>

          {/* Sticky pay bar */}
          <div style={{ padding: "12px 20px 28px", borderTop: "1px solid #F0F0F0", display: "flex", alignItems: "center", gap: 16, background: "white", flexShrink: 0 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 11, color: "#888" }}>Pay via</span>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                <span style={{ fontSize: 16 }}>💳</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#333" }}>UPI / Card</span>
                <span style={{ fontSize: 10, color: "#888" }}>▾</span>
              </div>
            </div>
            <button
              onClick={() => { closeBooking(); onBookConsultation?.(); }}
              style={{ flex: 1, background: tokens.primaryDefault, color: "white", border: "none", borderRadius: 9999, height: 48, fontSize: 15, fontWeight: 700, fontFamily: "var(--font-gilroy)", cursor: "pointer" }}
            >Pay ₹99</button>
          </div>
        </div>
      )}
    </div>
  );

  /* ── Image gallery ── */
  const SPECS_SLIDE = images.length; // virtual slide index
  const totalSlides = images.length + 1;
  const isSpecsSlide = activeImg === SPECS_SLIDE;
  const specRows = [
    { label: "FINISH",        value: design.tag },
    { label: "BASE MATERIAL", value: design.material },
    { label: "SIZE",          value: "14ft × 9ft" },
    { label: "SURFACE",       value: design.room },
  ];

  const ImageGallery = ({ thumbsBelow }: { thumbsBelow?: boolean }) => (
    <div style={{ position: "relative" }}>
      {/* Main image */}
      <div style={{ width: "100%", aspectRatio: "4/3", position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#E8D8C4,#D4C0A8)", ...(thumbsBelow ? { borderRadius: 16 } : {}) }}>
        <img
          key={activeImg}
          src={images[isSpecsSlide ? 0 : activeImg]}
          alt={design.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        {/* Key Features overlay on specs slide */}
        {isSpecsSlide && (
          <div style={{ position: "absolute", inset: 0, display: "flex" }}>
            {/* Left dark overlay with specs */}
            <div style={{ width: "46%", background: "linear-gradient(to right, rgba(0,0,0,0.82) 70%, rgba(0,0,0,0))", padding: "28px 24px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "white", fontFamily: "var(--font-gilroy)", marginBottom: 20 }}>Key Features</div>
              {specRows.map((row, ri) => (
                <div key={ri}>
                  {ri > 0 && <div style={{ borderTop: "1px dashed rgba(255,255,255,0.25)", margin: "12px 0" }} />}
                  <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", marginBottom: 4 }}>{row.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "white" }}>{row.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {design.badge && !isSpecsSlide && (
          <div style={{ position: "absolute", top: 12, left: 12, padding: "4px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", background: design.badge === "PICK" ? tokens.extendedMustard : tokens.primaryDefault, color: design.badge === "PICK" ? tokens.onSurfaceDefault : "white" }}>
            {design.badge}
          </div>
        )}
        {/* Prev / Next arrows */}
        <button
          onClick={() => setActiveImg(i => (i - 1 + totalSlides) % totalSlides)}
          style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.85)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: tokens.onSurfaceDefault, boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }}
        >‹</button>
        <button
          onClick={() => setActiveImg(i => (i + 1) % totalSlides)}
          style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.85)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: tokens.onSurfaceDefault, boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }}
        >›</button>
        {/* Dot indicators (mobile / no thumbs) */}
        {!thumbsBelow && (
          <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5 }}>
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button key={i} onClick={() => setActiveImg(i)} style={{ width: i === activeImg ? 16 : 6, height: 6, borderRadius: 3, background: i === activeImg ? "white" : "rgba(255,255,255,0.5)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.2s" }} />
            ))}
          </div>
        )}
        {/* Image counter badge */}
        <div style={{ position: "absolute", bottom: 10, right: 12, padding: "3px 8px", borderRadius: 12, background: "rgba(0,0,0,0.45)", fontSize: 11, color: "white" }}>
          {activeImg + 1} / {totalSlides}
        </div>
      </div>
      {/* Thumbnail strip (desktop) */}
      {thumbsBelow && (
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              style={{ flex: "0 0 auto", height: 80, aspectRatio: "4/3", borderRadius: 10, overflow: "hidden", border: `2px solid ${i === activeImg ? tokens.primaryDefault : tokens.surfaceVariant}`, cursor: "pointer", padding: 0, background: "none", transition: "border-color 0.15s" }}
            >
              <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </button>
          ))}
          {/* Key Features thumbnail */}
          <button
            onClick={() => setActiveImg(SPECS_SLIDE)}
            style={{ flex: "0 0 auto", height: 80, aspectRatio: "4/3", borderRadius: 10, overflow: "hidden", border: `2px solid ${isSpecsSlide ? tokens.primaryDefault : tokens.surfaceVariant}`, cursor: "pointer", padding: 0, background: "none", transition: "border-color 0.15s", position: "relative" }}
          >
            <img src={images[0]} alt="specs" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "white", textAlign: "center", lineHeight: 1.3 }}>KEY{"\n"}FEATURES</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );

  /* ── Shared section blocks (used in both layouts) ── */
  const CostBreakdown = () => (
    <div style={{ padding: "0 20px 4px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${tokens.surfaceVariant}` }}>
        <span style={{ fontSize: 18 }}>🏗️</span>
        <span style={{ flex: 1, fontSize: 13, color: tokens.onSurfaceDefault }}>Base wall design</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: tokens.onSurfaceDefault }}>₹{design.price.toLocaleString("en-IN")}</span>
      </div>
      {addons.map(a => (
        <div key={a.id} onClick={() => toggleAddon(a.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${tokens.surfaceVariant}`, cursor: "pointer" }}>
          <div style={{ width: 20, height: 20, borderRadius: 4, border: `1.5px solid ${selectedAddons.has(a.id) ? tokens.primaryDefault : tokens.onSurfaceBorder}`, background: selectedAddons.has(a.id) ? tokens.primaryDefault : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
            {selectedAddons.has(a.id) && <span style={{ color: "white", fontSize: 9, lineHeight: 1 }}>✓</span>}
          </div>
          <span style={{ flex: 1, fontSize: 13, color: tokens.onSurfaceDefault }}>{a.name}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: tokens.primaryDefault }}>+ ₹{a.price.toLocaleString("en-IN")}</span>
        </div>
      ))}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: tokens.onSurfaceDefault }}>Total estimate</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: tokens.primaryDefault }}>₹{(design.price + addonsTotal).toLocaleString("en-IN")}</span>
      </div>
    </div>
  );

  const ProductsRow = () => (
    <div style={{ padding: isDesktop ? "16px 20px" : "16px 0 16px 16px" }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: tokens.onSurfaceDefault, fontFamily: "var(--font-gilroy)", marginBottom: 12, ...(isDesktop ? {} : {}) }}>Products &amp; accessories used</div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", ...(isDesktop ? {} : { paddingRight: 16 }), scrollbarWidth: "none" } as React.CSSProperties}>
        {swatches.map((s, i) => (
          <div key={i} style={{ flexShrink: 0, width: 82, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{ width: 82, height: 70, borderRadius: 10, overflow: "hidden", border: `2px solid ${i === 0 ? tokens.primaryDefault : tokens.surfaceVariant}`, position: "relative", background: s.hex }}>
              {i < 2 && <div style={{ position: "absolute", top: 4, left: 4, width: 15, height: 15, background: tokens.primaryDefault, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "white" }}>✓</div>}
            </div>
            <span style={{ fontSize: 10, color: tokens.onSurfaceSecondary, textAlign: "center", lineHeight: 1.3 }}>{s.name}</span>
          </div>
        ))}
        {addons.map(a => (
          <div key={a.id} style={{ flexShrink: 0, width: 82, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{ width: 82, height: 70, borderRadius: 10, overflow: "hidden", border: `2px solid ${selectedAddons.has(a.id) ? tokens.primaryDefault : tokens.surfaceVariant}`, background: tokens.surfaceBg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <span style={{ fontSize: 28 }}>{a.icon}</span>
              {selectedAddons.has(a.id) && <div style={{ position: "absolute", top: 4, left: 4, width: 15, height: 15, background: tokens.primaryDefault, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "white" }}>✓</div>}
            </div>
            <span style={{ fontSize: 10, color: tokens.onSurfaceSecondary, textAlign: "center", lineHeight: 1.3 }}>{a.name}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const SimilarLooks = () => similar.length === 0 ? null : (
    <div style={{ background: "transparent", borderRadius: 0, border: "none", padding: isDesktop ? "0" : "20px 0 20px 16px" }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: tokens.onSurfaceDefault, fontFamily: "var(--font-gilroy)", marginBottom: 14 }}>Explore similar looks</div>
      {isDesktop ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
          {similar.map(s => (
            <div key={s.id} style={{ background: tokens.surfaceBg, borderRadius: 12, overflow: "hidden", border: `1px solid ${tokens.surfaceVariant}` }}>
              <div style={{ width: "100%", aspectRatio: "4/3", overflow: "hidden", background: "linear-gradient(135deg,#E8D8C4,#D4C0A8)" }}>
                <img src={s.img} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ padding: "9px 12px 12px" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: tokens.onSurfaceDefault, lineHeight: 1.3, marginBottom: 4 }}>{s.name}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: tokens.primaryDefault }}>₹{s.price.toLocaleString("en-IN")}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingRight: 16, paddingBottom: 16, scrollbarWidth: "none" } as React.CSSProperties}>
          {similar.map(s => (
            <div key={s.id} style={{ flexShrink: 0, width: 140, background: tokens.surfaceBg, borderRadius: 12, overflow: "hidden", border: `1px solid ${tokens.surfaceVariant}` }}>
              <div style={{ width: "100%", height: 96, overflow: "hidden", background: "linear-gradient(135deg,#E8D8C4,#D4C0A8)" }}>
                <img src={s.img} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ padding: "7px 9px 9px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: tokens.onSurfaceDefault, lineHeight: 1.3, marginBottom: 3 }}>{s.name}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: tokens.primaryDefault }}>₹{s.price.toLocaleString("en-IN")}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );


  const InstallProcess = () => (
    <div style={{ background: isDesktop ? "white" : "transparent", borderRadius: isDesktop ? 12 : 0, border: isDesktop ? `1px solid ${tokens.surfaceVariant}` : "none", padding: isDesktop ? "20px" : "20px 16px 20px" }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: tokens.onSurfaceDefault, fontFamily: "var(--font-gilroy)", marginBottom: 20 }}>Installation Process</div>
      <div style={{ display: isDesktop ? "grid" : "block", gridTemplateColumns: isDesktop ? "1fr 1fr" : undefined, gap: isDesktop ? 20 : undefined }}>
        {INSTALL_STEPS.map((step, i) => (
          <div key={i} style={{ display: "flex", gap: 14, marginBottom: isDesktop ? 0 : (i < INSTALL_STEPS.length - 1 ? 0 : 0) }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: tokens.primaryDefault, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "white", flexShrink: 0 }}>{step.num}</div>
              {!isDesktop && i < INSTALL_STEPS.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 20, background: tokens.surfaceVariant, marginTop: 4 }} />}
            </div>
            <div style={{ flex: 1, paddingBottom: !isDesktop && i < INSTALL_STEPS.length - 1 ? 20 : 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: tokens.onSurfaceDefault, marginBottom: 3 }}>{step.title}</div>
              <div style={{ fontSize: 11, color: tokens.onSurfaceSecondary, lineHeight: 1.5, marginBottom: 10 }}>{step.desc}</div>
              <div style={{ width: "100%", height: isDesktop ? 140 : 170, borderRadius: 12, overflow: "hidden", background: "linear-gradient(135deg,#E8D8C4,#D4C0A8)" }}>
                <img src={step.img} alt={step.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const CustomerReviews = () => (
    <div style={{ background: "transparent", padding: isDesktop ? "0" : "20px 16px 16px" }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: tokens.onSurfaceDefault, fontFamily: "var(--font-gilroy)", marginBottom: 16 }}>Customer Reviews</div>
      <div style={isDesktop
        ? { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }
        : { display: "flex", gap: 12, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4 } as React.CSSProperties}>
        {REVIEWS.map((r, i) => (
          <div key={i} style={{ background: "white", border: `1px solid ${tokens.surfaceVariant}`, borderRadius: 12, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 8, ...(isDesktop ? {} : { flexShrink: 0, width: 240 }) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: tokens.onSurfaceDefault }}>{r.name}</span>
              <span style={{ fontSize: 13, color: "#F59E0B", flexShrink: 0 }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
            </div>
            <p style={{ fontSize: 12, color: tokens.onSurfaceSecondary, lineHeight: 1.55, margin: 0 }}>{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const FaqSection = () => (
    <div style={{ background: "transparent", padding: isDesktop ? "0" : "20px 16px 28px" }}>
      <div style={{ fontSize: isDesktop ? 28 : 16, fontWeight: 700, color: tokens.onSurfaceDefault, fontFamily: "var(--font-gilroy)", marginBottom: isDesktop ? 6 : 4 }}>Frequently Asked Questions</div>
      <div style={{ fontSize: 12, color: tokens.onSurfaceSecondary, marginBottom: isDesktop ? 20 : 14 }}>Everything you need to know about our wall designs</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {FAQS.map((faq, i) => (
          <div key={i} style={{ background: "#F2F2F2", border: "none", borderRadius: 10, overflow: "hidden" }}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 18px", background: "transparent", border: "none", cursor: "pointer", gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: tokens.onSurfaceDefault, textAlign: "left", flex: 1, lineHeight: 1.4 }}>{faq.q}</span>
              <span style={{ fontSize: 18, color: tokens.onSurfaceSecondary, flexShrink: 0, lineHeight: 1, transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>+</span>
            </button>
            {openFaq === i && <div style={{ padding: "0 18px 16px", fontSize: 12, color: tokens.onSurfaceSecondary, lineHeight: 1.65 }}>{faq.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );

  const KeyProperties = () => (
    <div style={{ padding: isDesktop ? "18px 20px" : "20px 16px" }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: tokens.onSurfaceDefault, fontFamily: "var(--font-gilroy)", marginBottom: 16 }}>Key Properties</div>
      <div style={{ display: "flex", gap: isDesktop ? 20 : 16, justifyContent: "space-around" }}>
        {keyProps.map((p, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ width: isDesktop ? 52 : 44, height: isDesktop ? 52 : 44, borderRadius: 13, background: "#C0504D", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isDesktop ? 24 : 20 }}>{p.icon}</div>
            <span style={{ fontSize: 11, fontWeight: 600, color: tokens.onSurfaceDefault, textAlign: "center", lineHeight: 1.3 }}>{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const SpecsAccordion = () => {
    const [openSpec, setOpenSpec] = React.useState<string | null>(null);
    const specs = [
      { key: "specs", title: "Product Specifications", rows: [
        ["Material", design.material], ["Finish", design.tag], ["Color Scheme", design.colorScheme],
        ["Ideal For", idealRooms.join(", ")], ["Coverage", "14ft × 9ft (standard)"], ["Thickness", "6–12mm"],
      ]},
      { key: "material", title: "Material Details", rows: [
        ["Surface", "Premium " + design.material], ["Texture", design.tag], ["Weight", "Light to Medium"],
        ["Maintenance", "Wipe clean with dry cloth"], ["Installation", "Professional recommended"],
      ]},
    ];
    return (
      <div>
        {specs.map(s => (
          <div key={s.key}>
            <button onClick={() => setOpenSpec(openSpec === s.key ? null : s.key)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 20px", background: "none", border: "none", borderBottom: `1px solid ${tokens.surfaceVariant}`, cursor: "pointer" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: tokens.onSurfaceDefault }}>{s.title}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={tokens.onSurfaceSecondary} strokeWidth="2.5" style={{ transform: openSpec === s.key ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}><path d="M6 9l6 6 6-6"/></svg>
            </button>
            {openSpec === s.key && (
              <div style={{ padding: "14px 20px 16px", borderBottom: `1px solid ${tokens.surfaceVariant}` }}>
                {s.rows.map(([k, v], ri) => (
                  <div key={ri} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "6px 0", borderBottom: ri < s.rows.length - 1 ? `1px solid ${tokens.surfaceVariant}` : "none" }}>
                    <span style={{ color: tokens.onSurfaceSecondary }}>{k}</span>
                    <span style={{ color: tokens.onSurfaceDefault, fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const AvailableOffers = () => (
    <div style={{ padding: isDesktop ? "20px" : "20px 0 20px 16px" }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: tokens.onSurfaceDefault, fontFamily: "var(--font-gilroy)", marginBottom: 14, ...(isDesktop ? {} : { paddingRight: 16 }) }}>Available Offers</div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", ...(isDesktop ? { flexWrap: "wrap" as any } : { paddingRight: 16 }), scrollbarWidth: "none" } as React.CSSProperties}>
        {offers.map((o, i) => (
          <div key={i} style={{ flexShrink: 0, width: isDesktop ? "calc(33% - 8px)" : 170, background: o.color, border: `1px solid ${o.border}`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 9, fontWeight: 700, background: o.text, color: "white", borderRadius: 4, padding: "2px 6px" }}>{o.tag}</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: o.text }}>{o.title}</span>
            </div>
            <div style={{ fontSize: 11, color: tokens.onSurfaceSecondary, marginBottom: 8, lineHeight: 1.35 }}>{o.desc}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "white", border: `1px dashed ${o.border}`, borderRadius: 6, padding: "5px 10px" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: o.text, letterSpacing: "0.05em" }}>{o.code}</span>
              <button style={{ fontSize: 10, fontWeight: 700, color: o.text, background: "none", border: "none", cursor: "pointer", padding: 0 }}>COPY</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TrustBadges = () => (
    <div style={{ display: "flex", gap: 8, padding: isDesktop ? "14px 0 0" : "14px 16px 12px", background: isDesktop ? "transparent" : tokens.surfaceDefault, flexWrap: "wrap" as any }}>
      {[
        { icon: "⚡", text: "Quick Install" },
        { icon: "🛡️", text: "2yr Warranty" },
        { icon: "✓", text: "Free Site Visit" },
      ].map((b, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, background: "#F0FAF0", border: "1px solid #C8E6C9", borderRadius: 20, padding: "5px 12px" }}>
          <span style={{ fontSize: 13 }}>{b.icon}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#2E7D32" }}>{b.text}</span>
        </div>
      ))}
    </div>
  );

  const IdealFor = () => (
    <div style={{ padding: isDesktop ? "0" : "0 16px 14px", background: isDesktop ? "transparent" : tokens.surfaceDefault }}>
      <span style={{ fontSize: 12, color: tokens.onSurfaceSecondary, marginRight: 8 }}>Ideal for</span>
      {idealRooms.map((r, i) => (
        <span key={i} style={{ display: "inline-block", padding: "3px 10px", background: tokens.surfaceBg, border: `1px solid ${tokens.surfaceVariant}`, borderRadius: 20, fontSize: 11, color: tokens.onSurfaceDefault, fontWeight: 500, marginRight: 6 }}>{r}</span>
      ))}
    </div>
  );

  const WHY_ITEMS = [
    { icon: "⏱️", title: "60 Minute Delivery",    desc: "Get your order delivered within an hour" },
    { icon: "👥", title: "50,000+",               desc: "Customers served" },
    { icon: "😊", title: "99%",                   desc: "Satisfaction rate" },
    { icon: "✅", title: "Livspace Assured",       desc: "Quality guaranteed by trusted experts" },
    { icon: "🔧", title: "Installation Services", desc: "Professional installation available" },
  ];

  const WhyLivspace = () => (
    <div style={{ background: "transparent", borderRadius: 0, border: "none", padding: isDesktop ? "0" : "24px 16px" }}>
      <div style={{ fontSize: isDesktop ? 22 : 16, fontWeight: 700, color: tokens.onSurfaceDefault, fontFamily: "var(--font-gilroy)", marginBottom: isDesktop ? 28 : 20 }}>Why Choose Livspace</div>

      {/* Icons row (desktop) / list (mobile) */}
      {isDesktop ? (
        <div style={{ display: "flex", gap: 0, justifyContent: "space-between", marginBottom: 28 }}>
          {WHY_ITEMS.map((item, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 12px" }}>
              <div style={{ width: 60, height: 60, borderRadius: 14, background: "#C0504D", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 14, flexShrink: 0 }}>{item.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: tokens.onSurfaceDefault, marginBottom: 5, lineHeight: 1.3 }}>{item.title}</div>
              <div style={{ fontSize: 11, color: tokens.onSurfaceSecondary, lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 20 }}>
          {WHY_ITEMS.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: i < WHY_ITEMS.length - 1 ? 16 : 0, marginBottom: i < WHY_ITEMS.length - 1 ? 16 : 0, borderBottom: i < WHY_ITEMS.length - 1 ? `1px solid ${tokens.surfaceVariant}` : "none" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "#C0504D", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: tokens.onSurfaceDefault, marginBottom: 2 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: tokens.onSurfaceSecondary }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom: Summary + Google rating */}
      <div style={{ display: isDesktop ? "grid" : "flex", gridTemplateColumns: isDesktop ? "1fr 1fr" : undefined, flexDirection: isDesktop ? undefined : "column" as any, gap: 16 }}>
        {/* Summary card */}
        <div style={{ background: "white", border: `1px solid ${tokens.surfaceVariant}`, borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: tokens.onSurfaceDefault, marginBottom: 10 }}>Summary</div>
          <div style={{ fontSize: 12, color: tokens.onSurfaceSecondary, lineHeight: 1.7, marginBottom: 16 }}>Customers frequently commend our swift delivery and the attentive nature of our service, which clearly reflects their overall satisfaction. They often express a strong inclination to recommend us to their friends and family. Additionally, many customers are enthusiastic about returning.</div>
          <div style={{ borderTop: `1px solid ${tokens.surfaceVariant}`, paddingTop: 10, fontSize: 11, color: tokens.onSurfaceSecondary, fontStyle: "italic" }}>Generated by Livspace AI</div>
        </div>
        {/* Google rating card */}
        <div style={{ background: "white", border: `1px solid ${tokens.surfaceVariant}`, borderRadius: 12, padding: "18px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: tokens.onSurfaceSecondary }}>Average Ratings</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Google G */}
            <svg width="42" height="42" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.36 17.77 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: tokens.onSurfaceDefault, lineHeight: 1 }}>4.7</div>
              <div style={{ fontSize: 18, color: "#F59E0B", margin: "4px 0" }}>★★★★<span style={{ color: "#D0D0D0" }}>★</span></div>
              <div style={{ fontSize: 13, color: tokens.onSurfaceSecondary }}>3,640 reviews</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── DESKTOP layout ── */
  if (isDesktop) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: tokens.surfaceBg, overflow: "hidden", position: "relative" }}>
        {showBookingFlow && <BookingModal />}
        {/* Header */}
        <div style={{ background: tokens.surfaceDefault, borderBottom: `1px solid ${tokens.surfaceVariant}`, padding: "0 40px", height: 64, display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: "50%", background: tokens.surfaceBg, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: tokens.onSurfaceDefault, flexShrink: 0 }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-gilroy)", color: tokens.onSurfaceDefault }}>{design.name}</div>
            <div style={{ fontSize: 11, color: tokens.onSurfaceSecondary }}>✨ Elevate · Wall Designs</div>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", background: "#F5F5F5" }}>

          {/* ── White hero band ── */}
          <div style={{ background: "white" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 40px 40px" }}>

            {/* Top 2-col: image + right panel */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 440px", gap: 32 }}>
              {/* Left: hero image gallery */}
              <div>
                <ImageGallery thumbsBelow />
                {/* Info note under image */}
                <div style={{ marginTop: 12, padding: "10px 14px", background: tokens.extendedBlue, borderRadius: 10, display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>ℹ️</span>
                  <span style={{ fontSize: 12, color: tokens.onSurfaceSecondary, lineHeight: 1.5 }}>Price covers just the wall panels area, not the entire wall</span>
                </div>
              </div>

              {/* Right: single continuous details panel */}
              <div style={{ background: "transparent", alignSelf: "start" }}>
                {/* 1. Name + price */}
                <div style={{ padding: "20px 20px 16px" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: tokens.onSurfaceDefault, fontFamily: "var(--font-gilroy)", marginBottom: 6 }}>{design.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 2 }}>
                    <span style={{ fontSize: 20, fontWeight: 700, color: tokens.primaryDefault }}>₹{design.price.toLocaleString("en-IN")}</span>
                    <span style={{ fontSize: 13, color: tokens.onSurfaceSecondary, textDecoration: "line-through" }}>₹{Math.round(design.price * 1.25).toLocaleString("en-IN")}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#2E7D32", background: "#E8F5E9", borderRadius: 4, padding: "2px 7px" }}>20% OFF</span>
                  </div>
                  <div style={{ fontSize: 11, color: tokens.onSurfaceSecondary, marginBottom: 14 }}>Starts at ₹{design.price.toLocaleString("en-IN")} for 14ft × 9ft · Add-ons extra</div>

                  {/* 2. Calculate how much you need */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${tokens.surfaceVariant}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16 }}>📐</span>
                      <span style={{ fontSize: 13, color: tokens.onSurfaceDefault, fontWeight: 500 }}>Calculate how much you need</span>
                    </div>
                    <span style={{ fontSize: 14, color: tokens.onSurfaceSecondary }}>›</span>
                  </div>

                  {/* 3. Deliver to */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16 }}>📍</span>
                      <span style={{ fontSize: 13, color: tokens.onSurfaceDefault }}>Deliver to <span style={{ fontWeight: 600 }}>Bengaluru</span></span>
                    </div>
                    <span style={{ fontSize: 12, color: tokens.primaryDefault, fontWeight: 600, cursor: "pointer" }}>Change</span>
                  </div>

                  {/* 4. Ideal For */}
                  <IdealFor />

                  {/* 5. CTA button */}
                  <button onClick={openBooking} style={{ width: "100%", height: 46, background: tokens.primaryDefault, border: "none", borderRadius: 10, fontFamily: "var(--font-gilroy)", fontSize: 14, fontWeight: 700, color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, margin: "14px 0 12px" }}>
                    <span>🗓️</span> Book Consultation · ₹99
                  </button>

                  {/* 6. Trust badges */}
                  <TrustBadges />
                </div>

                {/* 7. Cost Breakdown */}
                <div style={{ borderTop: `1px solid ${tokens.surfaceVariant}` }} />
                <CostBreakdown />

                {/* 8. Available Offers */}
                <div style={{ borderTop: `1px solid ${tokens.surfaceVariant}` }} />
                <AvailableOffers />

                {/* 9. Key Properties */}
                <div style={{ borderTop: `1px solid ${tokens.surfaceVariant}` }} />
                <KeyProperties />

                {/* 10. Specs Accordion */}
                <div style={{ borderTop: `1px solid ${tokens.surfaceVariant}` }} />
                <SpecsAccordion />

                {/* 11. Products & accessories */}
                <div style={{ borderTop: `1px solid ${tokens.surfaceVariant}` }} />
                <ProductsRow />
              </div>
            </div>
            </div>{/* end maxWidth */}
          </div>{/* end white hero band */}

          {/* ── Gray section: Similar looks ── */}
          <div style={{ background: "#F5F5F5", padding: "32px 0" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
              <SimilarLooks />
            </div>
          </div>

          {/* ── Install Process ── */}
          <div style={{ background: "#EDEEF7", padding: "32px 0" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
              <InstallProcess />
            </div>
          </div>

          {/* ── Customer Reviews ── */}
          <div style={{ background: "white", padding: "32px 0" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
              <CustomerReviews />
            </div>
          </div>

          {/* ── Gray section: Why Choose Livspace (full-bleed, no card border) ── */}
          <div style={{ background: "#F5F5F5", padding: "40px 0" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
              <WhyLivspace />
            </div>
          </div>

          {/* ── FAQ ── */}
          <div style={{ background: "white", padding: "40px 0 60px" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
              <FaqSection />
            </div>
          </div>

        </div>
      </div>
    );
  }

  /* ── MOBILE layout ── */
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: tokens.surfaceBg, overflow: "hidden", position: "relative" }}>
      {showBookingFlow && <BookingModal />}
      <div style={{ background: tokens.surfaceDefault }}><StatusBar /></div>

      {/* Sticky header */}
      <div style={{ background: tokens.surfaceDefault, borderBottom: `1px solid ${tokens.surfaceVariant}`, padding: "0 16px", height: 50, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <button onClick={onBack} style={{ width: 32, height: 32, borderRadius: "50%", background: tokens.surfaceBg, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: tokens.onSurfaceDefault, flexShrink: 0 }}>←</button>
        <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: tokens.onSurfaceDefault, fontFamily: "var(--font-gilroy)" }}>✨ Elevate</span>
        <button onClick={onBack} style={{ width: 28, height: 28, borderRadius: "50%", background: tokens.surfaceBg, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: tokens.onSurfaceSecondary, flexShrink: 0 }}>×</button>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 88 }}>

        {/* Hero image gallery */}
        <ImageGallery />

        {/* White: Name + price + IdealFor + TrustBadges */}
        <div style={{ padding: "16px 16px 0", background: "white" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: tokens.onSurfaceDefault, fontFamily: "var(--font-gilroy)", marginBottom: 4 }}>{design.name}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 2 }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: tokens.primaryDefault }}>₹{design.price.toLocaleString("en-IN")}</span>
            <span style={{ fontSize: 13, color: tokens.onSurfaceSecondary, textDecoration: "line-through" }}>₹{Math.round(design.price * 1.25).toLocaleString("en-IN")}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#2E7D32", background: "#E8F5E9", borderRadius: 4, padding: "2px 6px" }}>20% OFF</span>
          </div>
          <div style={{ fontSize: 12, color: tokens.onSurfaceSecondary, marginBottom: 12 }}>Starts at ₹{design.price.toLocaleString("en-IN")} for 14ft × 9ft · Add-ons extra</div>
          <IdealFor />
          <TrustBadges />
        </div>

        {/* White: Cost breakdown + Offers + Products + Info note + Specs + Key Props */}
        <div style={{ background: "white" }}>
          <CostBreakdown />
          <AvailableOffers />
          <ProductsRow />
          <div style={{ margin: "0 16px 16px", padding: "10px 12px", background: tokens.extendedBlue, borderRadius: 10, display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>ℹ️</span>
            <span style={{ fontSize: 11, color: tokens.onSurfaceSecondary, lineHeight: 1.5 }}>Price covers just the wall panels area, not the entire wall</span>
          </div>
          <SpecsAccordion />
          <KeyProperties />
        </div>

        {/* Gray: Similar Looks */}
        <div style={{ background: "#F5F5F5" }}>
          <SimilarLooks />
        </div>

        {/* #EDEEF7: Installation Process */}
        <div style={{ background: "#EDEEF7" }}>
          <InstallProcess />
        </div>

        {/* White: Customer Reviews */}
        <div style={{ background: "white" }}>
          <CustomerReviews />
        </div>

        {/* Gray: Why Choose Livspace */}
        <div style={{ background: "#F5F5F5" }}>
          <WhyLivspace />
        </div>

        {/* White: FAQ */}
        <div style={{ background: "white" }}>
          <FaqSection />
        </div>

      </div>

      {/* Fixed Book CTA */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 16px 20px", background: tokens.surfaceDefault, borderTop: `1px solid ${tokens.surfaceVariant}` }}>
        <button onClick={openBooking} style={{ width: "100%", height: 48, background: tokens.primaryDefault, border: "none", borderRadius: 14, fontFamily: "var(--font-gilroy)", fontSize: 15, fontWeight: 700, color: "white", cursor: "pointer", letterSpacing: "0.01em" }}>
          Book Consultation · ₹99
        </button>
      </div>
    </div>
  );
}

function ElevateScreen({ goBack, cartCount, isDesktop, initialRoom, onBookConsultation }: {
  goBack: () => void;
  cartCount: number;
  isDesktop?: boolean;
  initialRoom?: string | null;
  onBookConsultation?: (d: WallDesign) => void;
}) {
  const [selectedRoom,      setSelectedRoom]      = React.useState<string>(initialRoom ?? "all");
  const [wishlisted,        setWishlisted]        = React.useState<Set<string>>(new Set());
  const [showFilters,       setShowFilters]       = React.useState(false);
  const [selectedWallDesign, setSelectedWallDesign] = React.useState<WallDesign | null>(null);
  const [filterStyles,    setFilterStyles]    = React.useState<string[]>([]);
  const [filterColors,    setFilterColors]    = React.useState<string[]>([]);
  const [filterMaterials, setFilterMaterials] = React.useState<string[]>([]);
  const [filterBudget,    setFilterBudget]    = React.useState<string>("");

  const toggleWishlist = (id: string) => setWishlisted(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const clearFilters = () => { setFilterStyles([]); setFilterColors([]); setFilterMaterials([]); setFilterBudget(""); };
  const activeFilterCount = filterStyles.length + filterColors.length + filterMaterials.length + (filterBudget ? 1 : 0);
  const hasActiveFilters = activeFilterCount > 0;

  /* Lock body scroll when filter sheet open */
  React.useEffect(() => {
    document.body.style.overflow = showFilters ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showFilters]);

  /* ── Filter logic ── */
  let filtered = selectedRoom === "all" ? WALL_DESIGNS : WALL_DESIGNS.filter(d => d.room === selectedRoom);
  if (filterStyles.length > 0)    filtered = filtered.filter(d => filterStyles.includes(d.tag));
  if (filterColors.length > 0)    filtered = filtered.filter(d => filterColors.includes(d.colorScheme));
  if (filterMaterials.length > 0) filtered = filtered.filter(d => filterMaterials.includes(d.material));
  if (filterBudget) {
    const tier = WALL_BUDGET_TIERS.find(t => t.label === filterBudget);
    if (tier) filtered = filtered.filter(d => d.price >= tier.range[0] && d.price < tier.range[1]);
  }

  const selectedRoomLabel = ELEVATE_ROOMS.find(r => r.slug === selectedRoom)?.name ?? "All Rooms";
  const sectionTitle = selectedRoom === "all" ? "All Wall Designs" : `${selectedRoomLabel} · Wall Designs`;

  /* ── Wall design detail ── */
  if (selectedWallDesign) {
    return <WallDesignDetail design={selectedWallDesign} allDesigns={WALL_DESIGNS} onBack={() => setSelectedWallDesign(null)} isDesktop={isDesktop} onBookConsultation={onBookConsultation ? () => onBookConsultation(selectedWallDesign) : undefined} />;
  }

  /* ── Chip helper (reusable inside filter sheet) ── */
  const EChip = ({ label, selected, onToggle, swatch }: { label: string; selected: boolean; onToggle: () => void; swatch?: string }) => (
    <button
      onClick={onToggle}
      style={{
        flexShrink: 0, height: 32, padding: swatch ? "0 12px 0 8px" : "0 12px",
        borderRadius: 99, display: "flex", alignItems: "center", gap: 6,
        border: `1.5px solid ${selected ? tokens.primaryDefault : tokens.onSurfaceBorder}`,
        background: selected ? tokens.primaryDefault : "transparent",
        color: selected ? "white" : tokens.onSurfaceDefault,
        fontSize: 12, fontFamily: "var(--font-roboto)", fontWeight: selected ? 600 : 400,
        cursor: "pointer", whiteSpace: "nowrap" as const, outline: "none", transition: "all 0.15s",
      }}
      aria-pressed={selected}
    >
      {swatch && (
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: swatch, flexShrink: 0, border: selected ? "1.5px solid rgba(255,255,255,0.5)" : `1.5px solid ${tokens.onSurfaceBorder}`, display: "inline-block" }} />
      )}
      {label}
    </button>
  );

  /* ── Filter bottom sheet ── */
  const FilterSheet = () => (
    <>
      {/* Backdrop */}
      <div onClick={() => setShowFilters(false)} style={{ position: "fixed", inset: 0, zIndex: 1100, background: "rgba(0,0,0,0.38)", backdropFilter: "blur(2px)" }} />
      {/* Sheet */}
      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 1101, background: tokens.surfaceDefault, borderRadius: "20px 20px 0 0", boxShadow: "0 -4px 32px rgba(0,0,0,0.18)", maxHeight: "85dvh", display: "flex", flexDirection: "column" }}>
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10, paddingBottom: 4, flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: tokens.surfaceVariant }} />
        </div>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px 10px", flexShrink: 0, borderBottom: `1px solid ${tokens.surfaceVariant}` }}>
          <span style={{ fontFamily: "var(--font-gilroy)", fontSize: 15, fontWeight: 700, color: tokens.onSurfaceDefault }}>Filter Wall Designs</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {hasActiveFilters && (
              <button onClick={clearFilters} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontFamily: "var(--font-roboto)", fontWeight: 500, color: tokens.onSurfaceSecondary, textDecoration: "underline", textDecorationColor: tokens.onSurfaceBorder, textUnderlineOffset: 2, padding: "2px 4px" }}>Clear all</button>
            )}
            <button onClick={() => setShowFilters(false)} style={{ width: 28, height: 28, borderRadius: "50%", background: tokens.surfaceBg, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: tokens.onSurfaceSecondary, flexShrink: 0 }}>×</button>
          </div>
        </div>
        {/* Scrollable body */}
        <div style={{ overflowY: "auto", flex: 1, padding: "16px 20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Budget Range */}
          <div>
            <p style={{ fontFamily: "var(--font-roboto)", fontSize: 10, fontWeight: 600, color: tokens.onSurfaceSecondary, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 10 }}>Budget Range</p>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
              {WALL_BUDGET_TIERS.map(t => (
                <EChip key={t.label} label={t.label} selected={filterBudget === t.label} onToggle={() => setFilterBudget(filterBudget === t.label ? "" : t.label)} />
              ))}
            </div>
          </div>

          {/* Style & Aesthetic */}
          <div>
            <p style={{ fontFamily: "var(--font-roboto)", fontSize: 10, fontWeight: 600, color: tokens.onSurfaceSecondary, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 10 }}>Style & Aesthetic <span style={{ fontWeight: 400, fontSize: 9 }}>(tap multiple)</span></p>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
              {ELEVATE_STYLE_OPTIONS.map(s => (
                <EChip key={s} label={s} selected={filterStyles.includes(s)} onToggle={() => setFilterStyles(filterStyles.includes(s) ? filterStyles.filter(x => x !== s) : [...filterStyles, s])} />
              ))}
            </div>
          </div>

          {/* Color Scheme */}
          <div>
            <p style={{ fontFamily: "var(--font-roboto)", fontSize: 10, fontWeight: 600, color: tokens.onSurfaceSecondary, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 10 }}>Color Scheme <span style={{ fontWeight: 400, fontSize: 9 }}>(tap multiple)</span></p>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
              {ELEVATE_COLOR_OPTIONS.map(c => (
                <EChip key={c} label={c} selected={filterColors.includes(c)} onToggle={() => setFilterColors(filterColors.includes(c) ? filterColors.filter(x => x !== c) : [...filterColors, c])} swatch={WALL_COLOR_SWATCHES[c]} />
              ))}
            </div>
          </div>

          {/* Material */}
          <div>
            <p style={{ fontFamily: "var(--font-roboto)", fontSize: 10, fontWeight: 600, color: tokens.onSurfaceSecondary, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 10 }}>Material <span style={{ fontWeight: 400, fontSize: 9 }}>(tap multiple)</span></p>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
              {ELEVATE_MATERIAL_OPTIONS.map(m => (
                <EChip key={m} label={m} selected={filterMaterials.includes(m)} onToggle={() => setFilterMaterials(filterMaterials.includes(m) ? filterMaterials.filter(x => x !== m) : [...filterMaterials, m])} />
              ))}
            </div>
          </div>
        </div>
        {/* Done button */}
        <div style={{ flexShrink: 0, padding: "12px 20px 16px", borderTop: `1px solid ${tokens.surfaceVariant}` }}>
          <button
            onClick={() => setShowFilters(false)}
            style={{ width: "100%", height: 44, borderRadius: 14, background: tokens.primaryDefault, border: "none", cursor: "pointer", fontFamily: "var(--font-gilroy)", fontSize: 14, fontWeight: 700, color: "white", letterSpacing: "0.01em" }}
          >
            {hasActiveFilters ? `Show ${filtered.length} design${filtered.length !== 1 ? "s" : ""}` : "Done"}
          </button>
        </div>
      </div>
    </>
  );

  /* ── Filters button ── */
  const FiltersBtn = () => (
    <button
      onClick={() => setShowFilters(true)}
      style={{ display: "flex", alignItems: "center", gap: 6, background: hasActiveFilters ? tokens.primaryDefault : tokens.surfaceDefault, border: `1.5px solid ${hasActiveFilters ? tokens.primaryDefault : tokens.surfaceVariant}`, borderRadius: 99, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontWeight: hasActiveFilters ? 600 : 500, color: hasActiveFilters ? "white" : tokens.onSurfaceDefault, fontFamily: "var(--font-roboto)", flexShrink: 0 }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
      Filters {hasActiveFilters && `(${activeFilterCount})`}
    </button>
  );

  /* ── Room photo tile ── */
  const RoomTile = ({ room }: { room: typeof ELEVATE_ROOMS[0] }) => {
    const sel = selectedRoom === room.slug;
    return (
      <button
        onClick={() => setSelectedRoom(room.slug)}
        style={{ flexShrink: 0, position: "relative", width: isDesktop ? 120 : 96, height: isDesktop ? 76 : 62, borderRadius: 10, overflow: "hidden", border: sel ? `2.5px solid ${tokens.primaryDefault}` : `1.5px solid ${tokens.surfaceVariant}`, cursor: "pointer", background: tokens.surfaceVariant, padding: 0, transition: "border-color 0.15s" }}
      >
        <img src={room.img} alt={room.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.58) 0%, transparent 55%)" }} />
        {sel && <div style={{ position: "absolute", top: 5, right: 5, width: 16, height: 16, background: tokens.primaryDefault, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "white" }}>✓</div>}
        <span style={{ position: "absolute", bottom: 4, left: 0, right: 0, textAlign: "center", fontSize: 9, fontWeight: 600, color: "white", textShadow: "0 1px 3px rgba(0,0,0,0.7)", fontFamily: "var(--font-gilroy)", lineHeight: 1.2, padding: "0 3px" }}>
          {room.name}
        </span>
      </button>
    );
  };

  /* ── Wall design card ── */
  const WallCard = ({ d }: { d: WallDesign }) => {
    const isFav = wishlisted.has(d.id);
    const roomLabel = ELEVATE_ROOMS.find(r => r.slug === d.room)?.name ?? d.room;
    const origPrice = Math.round(d.price * 1.25);
    const sqftPrice = Math.round(d.price / 126);
    const badgeStyle: Record<string, React.CSSProperties> = {
      NEW:  { background: tokens.primaryDefault, color: "white" },
      PICK: { background: "#5B2D8E", color: "white" },
    };
    return (
      <div onClick={() => setSelectedWallDesign(d)} style={{ background: "transparent", borderRadius: 14, overflow: "hidden", border: "none", cursor: "pointer", display: "flex", flexDirection: "column" }}>
        <div style={{ width: "100%", aspectRatio: "4/3", position: "relative", overflow: "hidden", borderRadius: 14, background: "linear-gradient(135deg,#E8D8C4,#D4C0A8)", flexShrink: 0 }}>
          <img src={d.img} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
          {d.badge && (
            <div style={{ position: "absolute", top: 10, left: 10, padding: "4px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", ...(badgeStyle[d.badge] ?? badgeStyle.NEW) }}>
              {d.badge === "PICK" ? "Top Pick" : d.badge}
            </div>
          )}
          <button onClick={e => { e.stopPropagation(); toggleWishlist(d.id); }} style={{ position: "absolute", top: 8, right: 8, width: 32, height: 32, background: isFav ? tokens.primaryDefault : "rgba(255,255,255,0.92)", border: isFav ? "none" : "1.5px solid #DDD", borderRadius: "50%", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.12)" }}>
            {isFav ? "❤️" : "♡"}
          </button>
        </div>
        <div style={{ padding: "10px 2px 14px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 10, color: tokens.onSurfaceSecondary, letterSpacing: "0.04em" }}>{roomLabel}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: tokens.onSurfaceDefault, fontFamily: "var(--font-gilroy)", lineHeight: 1.3 }}>{d.name}</div>
          <div style={{ fontSize: 11, color: tokens.onSurfaceSecondary }}>{d.tag}, {d.material}, {d.colorScheme}</div>
          <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: tokens.primaryDefault }}>₹{d.price.toLocaleString("en-IN")}</span>
            <span style={{ fontSize: 12, color: tokens.onSurfaceSecondary, textDecoration: "line-through" }}>₹{origPrice.toLocaleString("en-IN")}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#2E7D32" }}>(20% OFF)</span>
          </div>
          <div style={{ fontSize: 11, color: tokens.onSurfaceSecondary }}>₹{sqftPrice.toLocaleString("en-IN")}/sqft</div>
        </div>
      </div>
    );
  };

  /* ── Desktop filter sidebar (left) ── */
  const DesktopFilters = () => {
    const section = (title: string, content: React.ReactNode) => (
      <div style={{ borderBottom: `1px solid ${tokens.surfaceVariant}`, paddingBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: tokens.onSurfaceDefault, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {title}
          <span style={{ fontSize: 16, color: tokens.onSurfaceSecondary, lineHeight: 1 }}>−</span>
        </div>
        {content}
      </div>
    );
    return (
      <div style={{ width: 276, flexShrink: 0, background: "white", overflowY: "auto", padding: "24px 20px 40px 0", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 12, borderBottom: `1px solid ${tokens.surfaceVariant}` }}>
          <span style={{ fontFamily: "var(--font-gilroy)", fontSize: 15, fontWeight: 700, color: tokens.onSurfaceDefault }}>Filters</span>
          {hasActiveFilters && (
            <button onClick={clearFilters} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: tokens.primaryDefault, fontWeight: 600, padding: 0 }}>Clear all</button>
          )}
        </div>
        {section("Budget Range",
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {WALL_BUDGET_TIERS.map(t => (
              <label key={t.label} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12, color: tokens.onSurfaceDefault }}>
                <input type="checkbox" checked={filterBudget === t.label} onChange={() => setFilterBudget(filterBudget === t.label ? "" : t.label)} style={{ accentColor: tokens.primaryDefault, width: 14, height: 14 }} />
                {t.label}
              </label>
            ))}
          </div>
        )}
        {section("Style",
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {ELEVATE_STYLE_OPTIONS.map(s => (
              <label key={s} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12, color: tokens.onSurfaceDefault }}>
                <input type="checkbox" checked={filterStyles.includes(s)} onChange={() => setFilterStyles(filterStyles.includes(s) ? filterStyles.filter(x => x !== s) : [...filterStyles, s])} style={{ accentColor: tokens.primaryDefault, width: 14, height: 14 }} />
                {s}
              </label>
            ))}
          </div>
        )}
        {section("Color Scheme",
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {ELEVATE_COLOR_OPTIONS.map(c => (
              <label key={c} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12, color: tokens.onSurfaceDefault }}>
                <input type="checkbox" checked={filterColors.includes(c)} onChange={() => setFilterColors(filterColors.includes(c) ? filterColors.filter(x => x !== c) : [...filterColors, c])} style={{ accentColor: tokens.primaryDefault, width: 14, height: 14 }} />
                {WALL_COLOR_SWATCHES[c] && <span style={{ width: 12, height: 12, borderRadius: "50%", background: WALL_COLOR_SWATCHES[c], border: "1px solid #DDD", flexShrink: 0 }} />}
                {c}
              </label>
            ))}
          </div>
        )}
        {section("Material",
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {ELEVATE_MATERIAL_OPTIONS.map(m => (
              <label key={m} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12, color: tokens.onSurfaceDefault }}>
                <input type="checkbox" checked={filterMaterials.includes(m)} onChange={() => setFilterMaterials(filterMaterials.includes(m) ? filterMaterials.filter(x => x !== m) : [...filterMaterials, m])} style={{ accentColor: tokens.primaryDefault, width: 14, height: 14 }} />
                {m}
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  /* ── Installation video scroll section ── */
  const INSTALL_VIDEOS = [
    { img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80", label: "Surface Prep" },
    { img: "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=400&q=80", label: "Panel Fitting" },
    { img: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&q=80", label: "Grouting & Finish" },
    { img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", label: "Final Reveal" },
    { img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80", label: "Quality Check" },
    { img: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=400&q=80", label: "Complete Look" },
  ];

  const VideoScrollSection = () => (
    <div style={{ margin: "28px -52px 28px -52px", background: "#3A2640", padding: "36px 52px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ fontFamily: "var(--font-gilroy)", fontSize: 26, fontWeight: 700, color: "white", lineHeight: 1.25 }}>
          Your wall, transformed —<br />watch it happen
        </div>
        <button style={{ background: "none", border: "1.5px solid rgba(255,255,255,0.5)", borderRadius: 24, padding: "8px 20px", fontSize: 13, fontWeight: 600, color: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" as const }}>
          Watch More <span style={{ fontSize: 15 }}>›</span>
        </button>
      </div>
      <div style={{ display: "flex", gap: 14, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4 } as React.CSSProperties}>
        {INSTALL_VIDEOS.map((v, i) => (
          <div key={i} style={{ flexShrink: 0, width: 210, borderRadius: 16, overflow: "hidden", position: "relative", cursor: "pointer" }}>
            <div style={{ width: "100%", aspectRatio: "9/14", background: "#1E1428", position: "relative", overflow: "hidden" }}>
              <img src={v.img} alt={v.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: 0.88 }} onError={e => { (e.target as HTMLImageElement).style.opacity = "0"; }} />
              {/* Play button */}
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.22)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid rgba(255,255,255,0.4)" }}>
                  <span style={{ fontSize: 16, color: "white", marginLeft: 3 }}>▶</span>
                </div>
              </div>
              {/* Label overlay at bottom */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 14px 14px", background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{v.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ── Promo banner ── */
  const PromoBanner = () => (
    <div style={{ borderRadius: 14, overflow: "hidden", background: "linear-gradient(105deg, #3D2C1E 0%, #7B3F1A 60%, #C0504D 100%)", padding: "22px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0" }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 6 }}>Wall Designs · Limited Offer</div>
        <div style={{ fontFamily: "var(--font-gilroy)", fontSize: 22, fontWeight: 800, color: "white", lineHeight: 1.2 }}>Book a consult for ₹99</div>
        <div style={{ fontFamily: "var(--font-gilroy)", fontSize: 22, fontWeight: 800, color: "#FFD580", lineHeight: 1.2 }}>get <span style={{ fontSize: 28 }}>15% off</span></div>
      </div>
      <button style={{ background: "white", border: "none", borderRadius: 10, padding: "10px 22px", fontFamily: "var(--font-gilroy)", fontSize: 13, fontWeight: 700, color: "#3D2C1E", cursor: "pointer", whiteSpace: "nowrap" as const }}>Book Now →</button>
    </div>
  );

  /* ── Desktop layout ── */
  if (isDesktop) {
    const firstBatch = filtered.slice(0, 6);
    const restBatch  = filtered.slice(6);
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "white", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ background: "white", borderBottom: `1px solid ${tokens.surfaceVariant}`, flexShrink: 0 }}>
          <div style={{ height: 64, display: "flex", alignItems: "center", padding: "0 80px", gap: 20 }}>
            <button onClick={goBack} style={{ width: 36, height: 36, borderRadius: "50%", background: tokens.surfaceBg, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: tokens.onSurfaceDefault, flexShrink: 0 }}>←</button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-gilroy)", color: tokens.onSurfaceDefault }}>✨ Elevate</div>
              <div style={{ fontSize: 11, color: tokens.onSurfaceSecondary }}>Premium wall designs for every room</div>
            </div>
          </div>
        </div>

        {/* Full-width room category tiles row */}
        <div style={{ background: "white", borderBottom: `1px solid ${tokens.surfaceVariant}`, flexShrink: 0, padding: "16px 80px" }}>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", scrollbarWidth: "none" } as React.CSSProperties}>
            {ELEVATE_ROOMS.map(r => <RoomTile key={r.slug} room={r} />)}
          </div>
        </div>

        {/* Body: left filters + main content */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden", paddingLeft: 80 }}>
          <DesktopFilters />

          {/* Main scrollable area */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 80px 48px 52px" }}>

            {/* Sort bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${tokens.surfaceVariant}` }}>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-gilroy)", color: tokens.onSurfaceDefault }}>{sectionTitle} <span style={{ fontSize: 12, fontWeight: 400, color: tokens.onSurfaceSecondary, marginLeft: 6 }}>({filtered.length} results)</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: tokens.onSurfaceSecondary }}>Sort by:</span>
                <select style={{ fontSize: 12, fontWeight: 600, color: tokens.onSurfaceDefault, border: `1px solid ${tokens.surfaceVariant}`, borderRadius: 8, padding: "5px 10px", background: tokens.surfaceDefault, cursor: "pointer", outline: "none" }}>
                  <option>Popularity</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: tokens.onSurfaceSecondary, fontSize: 14 }}>No wall designs match your filters — try clearing some.</div>
            ) : (
              <>
                {/* First 6 cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 296px)", gap: 20 }}>
                  {firstBatch.map(d => <WallCard key={d.id} d={d} />)}
                </div>

                {/* Installation video scroll section after row 2 */}
                {filtered.length > 3 && <VideoScrollSection />}

                {/* Remaining cards */}
                {restBatch.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 296px)", gap: 20 }}>
                    {restBatch.map(d => <WallCard key={d.id} d={d} />)}
                  </div>
                )}
              </>
            )}

            {/* You may also like — horizontal scroll */}
            {filtered.length > 0 && (
              <div style={{ marginTop: 40 }}>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-gilroy)", color: tokens.onSurfaceDefault, marginBottom: 16 }}>You May Also Like</div>
                <div style={{ display: "flex", gap: 16, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 8 } as React.CSSProperties}>
                  {WALL_DESIGNS.filter(d => !filtered.find(f => f.id === d.id)).slice(0, 6).map(d => (
                    <div key={d.id} onClick={() => setSelectedWallDesign(d)} style={{ flexShrink: 0, width: 180, cursor: "pointer" }}>
                      <div style={{ width: "100%", height: 130, borderRadius: 12, overflow: "hidden", background: "#E8E0D8", marginBottom: 8 }}>
                        <img src={d.img} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                      <div style={{ fontSize: 10, color: tokens.onSurfaceSecondary }}>{ELEVATE_ROOMS.find(r => r.slug === d.room)?.name ?? d.room}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: tokens.onSurfaceDefault, fontFamily: "var(--font-gilroy)", lineHeight: 1.3, marginBottom: 3 }}>{d.name}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: tokens.primaryDefault }}>₹{d.price.toLocaleString("en-IN")}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  /* ── Mobile layout ── */
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: tokens.surfaceBg, overflow: "hidden" }}>
      {showFilters && <FilterSheet />}
      <div style={{ background: tokens.surfaceDefault }}><StatusBar /></div>
      <div style={{ background: tokens.surfaceDefault, borderBottom: `1px solid ${tokens.surfaceVariant}`, padding: "0 20px", height: 56, display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <button onClick={goBack} style={{ width: 36, height: 36, borderRadius: "50%", background: tokens.surfaceBg, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: tokens.onSurfaceDefault, flexShrink: 0 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700, fontFamily: "var(--font-gilroy)", color: tokens.onSurfaceDefault }}>✨ Elevate</div>
          <div style={{ fontSize: 11, color: tokens.onSurfaceSecondary }}>Premium wall designs</div>
        </div>
      </div>
      {/* Room selector */}
      <div style={{ background: tokens.surfaceDefault, borderBottom: `1px solid ${tokens.surfaceVariant}`, flexShrink: 0 }}>
        <div style={{ padding: "10px 0 10px 16px", overflowX: "auto", display: "flex", gap: 8, scrollbarWidth: "none" } as React.CSSProperties}>
          {ELEVATE_ROOMS.map(r => <RoomTile key={r.slug} room={r} />)}
          <div style={{ width: 16, flexShrink: 0 }} />
        </div>
      </div>
      {/* Section header with filters button */}
      <div style={{ padding: "12px 16px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-gilroy)", color: tokens.onSurfaceDefault }}>{sectionTitle}</div>
        <FiltersBtn />
      </div>
      {/* Cards masonry */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 24px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: tokens.onSurfaceSecondary, fontSize: 14 }}>No wall designs match your filters — try clearing some.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map(d => <WallCard key={d.id} d={d} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function MyAccountScreen({ goTo, goBack, orders, wishlistCount, isDesktop }: { goTo: (id: ScreenId) => void; goBack: () => void; orders: Order[]; wishlistCount: number; isDesktop?: boolean }) {
  const [activeSection, setActiveSection] = React.useState<"profile"|"addresses">("profile");

  const USER = { name: "Abhishek Kasina", phone: "+91 98765 43210", email: "abhishek.kasina@demo.com" };

  /* ── Shared hero ── */
  const Hero = () => (
    <div style={{ background: "linear-gradient(160deg, #1C4A5A 0%, #122030 60%, #0A1520 100%)", padding: isDesktop ? "28px 40px 32px" : "20px 20px 28px" }}>
      {/* breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,0.55)", marginBottom: isDesktop ? 22 : 16 }}>
        <button onClick={goBack} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.55)", fontSize: 12, cursor: "pointer", padding: 0 }}>Home</button>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
        <span style={{ color: "rgba(255,255,255,0.85)" }}>My Account</span>
      </div>
      {/* avatar */}
      <div style={{ width: isDesktop ? 88 : 72, height: isDesktop ? 88 : 72, borderRadius: 18, background: "white", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isDesktop ? 48 : 38, overflow: "hidden", flexShrink: 0 }}>🧑‍💻</div>
      <div style={{ fontSize: isDesktop ? 34 : 26, fontWeight: 800, color: "white", letterSpacing: "-0.5px", marginBottom: 8, fontFamily: "'Roboto',sans-serif" }}>{USER.name}</div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", marginBottom: 4 }}>{USER.phone}</div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)" }}>{USER.email}</div>
    </div>
  );

  /* Chevron icon */
  const Chev = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AAAAAA" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>;
  /* External link icon */
  const Ext = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#AAAAAA" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;

  /* Row used in sidebar / mobile list */
  const MenuRow = ({ icon, label, sub, active, onClick, rightEl }: { icon: React.ReactNode; label: string; sub?: string; active?: boolean; onClick?: () => void; rightEl?: React.ReactNode }) => (
    <button onClick={onClick} style={{ width: "100%", background: active ? "#FFF1EF" : "transparent", border: "none", padding: "13px 18px", display: "flex", alignItems: "center", gap: 14, cursor: onClick ? "pointer" : "default", textAlign: "left" }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: active ? "#FFE5E0" : "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: active ? tokens.primaryDefault : "#555" }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: active ? tokens.primaryDefault : "#1A1A1A" }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: "#999", marginTop: 1 }}>{sub}</div>}
      </div>
      {rightEl ?? (onClick ? <Chev /> : null)}
    </button>
  );

  /* Section divider */
  const SectionHead = ({ label }: { label: string }) => (
    <div style={{ padding: "10px 18px 6px", fontSize: 13, fontWeight: 700, color: "#1A1A1A", background: "#F8F8F8", borderTop: "1px solid #F0F0F0", borderBottom: "1px solid #F0F0F0" }}>{label}</div>
  );

  /* ── Desktop left sidebar ── */
  const LeftSidebar = () => (
    <div style={{ width: 280, flexShrink: 0 }}>
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #E8E8E8", overflow: "hidden" }}>
        <MenuRow icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M3 6h18v16H3z"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="12" y2="16"/></svg>} label="Orders" onClick={() => goTo("orders")} />
        <div style={{ borderTop: "1px solid #F5F5F5" }} />
        <MenuRow icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>} label="Wishlist" onClick={() => goTo("wishlist")} rightEl={<Ext />} />
        <div style={{ borderTop: "1px solid #F5F5F5" }} />
        <MenuRow icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>} label="Track interior project" sub="Briefing call completed" rightEl={<Ext />} />
        <SectionHead label="Your information" />
        <MenuRow icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} label="My profile" sub="Full name, phone & more" active={activeSection === "profile"} onClick={() => setActiveSection("profile")} />
        <div style={{ borderTop: "1px solid #F5F5F5" }} />
        <MenuRow icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>} label="My addresses" sub="2 addresses" active={activeSection === "addresses"} onClick={() => setActiveSection("addresses")} />
        <SectionHead label="Payments" />
        <MenuRow icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>} label="Gift cards" sub="1 gift card" onClick={() => {}} />
        <div style={{ borderTop: "1px solid #F5F5F5" }} />
        <MenuRow icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>} label="Download the app" onClick={() => {}} />
        <div style={{ borderTop: "1px solid #F0F0F0", padding: "14px 0", textAlign: "center" }}>
          <button style={{ background: "none", border: "none", textDecoration: "underline", fontSize: 14, color: "#333", cursor: "pointer", fontFamily: "'Roboto',sans-serif" }}>Logout</button>
        </div>
      </div>
    </div>
  );

  /* ── Desktop right panel: My Profile ── */
  const ProfilePanel = () => (
    <div style={{ flex: 1, minWidth: 0, background: "white", borderRadius: 16, border: "1px solid #E8E8E8", padding: "28px 32px" }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", marginBottom: 28, fontFamily: "'Roboto',sans-serif" }}>My profile</div>
      {/* avatar with edit */}
      <div style={{ position: "relative", display: "inline-block", marginBottom: 32 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>🧑‍💻</div>
        <button style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderRadius: "50%", background: "white", border: "1px solid #DDD", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
      </div>
      {/* Fields */}
      {[
        { label: "Name",     value: USER.name,  verified: false },
        { label: "Mobile",   value: USER.phone,  verified: true  },
        { label: "Email ID", value: USER.email,  verified: false },
      ].map(f => (
        <div key={f.label} style={{ border: "1px solid #E0E0E0", borderRadius: 10, padding: "10px 14px", marginBottom: 12, position: "relative" }}>
          <div style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>{f.label}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ flex: 1, fontSize: 15, color: "#1A1A1A", fontFamily: "'Roboto',sans-serif" }}>{f.value}</span>
            {f.verified && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            )}
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  /* ── Desktop right panel: Addresses placeholder ── */
  const AddressesPanel = () => (
    <div style={{ flex: 1, minWidth: 0, background: "white", borderRadius: 16, border: "1px solid #E8E8E8", padding: "28px 32px" }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", marginBottom: 28 }}>My addresses</div>
      {[
        { tag: "HOME",   addr: "13252, Prestige Lakeside Habitat, SH Nagar, Bengaluru – 560037" },
        { tag: "OFFICE", addr: "WeWork Galaxy, 43, Residency Rd, Bengaluru – 560025" },
      ].map((a, i) => (
        <div key={i} style={{ border: "1px solid #E8E8E8", borderRadius: 12, padding: "16px 18px", marginBottom: 12, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <span style={{ display: "inline-block", background: "#1A1A1A", color: "white", fontSize: 10, fontWeight: 700, borderRadius: 4, padding: "2px 8px", marginBottom: 8, letterSpacing: "0.05em" }}>{a.tag}</span>
            <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>{a.addr}</div>
          </div>
          <button style={{ flexShrink: 0, background: "none", border: "1px solid #DDD", borderRadius: 8, padding: "5px 12px", fontSize: 12, color: "#555", cursor: "pointer" }}>Edit</button>
        </div>
      ))}
      <button style={{ marginTop: 6, background: "none", border: `1.5px dashed ${tokens.primaryDefault}`, borderRadius: 12, padding: "12px 0", width: "100%", fontSize: 13, fontWeight: 600, color: tokens.primaryDefault, cursor: "pointer" }}>+ Add new address</button>
    </div>
  );

  /* ── Mobile card group ── */
  const MobileSection = ({ title, children }: { title?: string; children: React.ReactNode }) => (
    <div style={{ background: "white", borderRadius: 16, border: "1px solid #EBEBEB", overflow: "hidden", marginBottom: 12 }}>
      {title && <div style={{ padding: "14px 18px 10px", fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>{title}</div>}
      {children}
    </div>
  );

  const MobileRow = ({ icon, label, sub, onClick }: { icon: React.ReactNode; label: string; sub?: string; onClick?: () => void }) => (
    <button onClick={onClick} style={{ width: "100%", background: "none", border: "none", padding: "13px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", textAlign: "left", borderTop: "1px solid #F5F5F5" }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: "#999", marginTop: 1 }}>{sub}</div>}
      </div>
      <Chev />
    </button>
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#F2F2F2", overflow: "hidden" }}>
      {!isDesktop && <div style={{ background: "white" }}><StatusBar /></div>}

      <div style={{ flex: 1, overflowY: "auto" }}>
        <Hero />

        {isDesktop ? (
          /* ── DESKTOP: sidebar + right panel ── */
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 40px 48px", display: "flex", gap: 24, alignItems: "flex-start" }}>
            <LeftSidebar />
            {activeSection === "profile" ? <ProfilePanel /> : <AddressesPanel />}
          </div>
        ) : (
          /* ── MOBILE: stacked cards ── */
          <div style={{ padding: "16px 12px 32px" }}>

            {/* Quick actions: Orders + Wishlist side by side */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <button onClick={() => goTo("orders")} style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: 16, padding: "20px 16px", display: "flex", flexDirection: "column", gap: 8, cursor: "pointer", textAlign: "left" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8"><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M3 6h18v16H3z"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="12" y2="16"/></svg>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>Orders</span>
              </button>
              <button onClick={() => goTo("wishlist")} style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: 16, padding: "20px 16px", display: "flex", flexDirection: "column", gap: 8, cursor: "pointer", textAlign: "left" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>Wishlist</span>
              </button>
            </div>

            {/* Track interior project */}
            <MobileSection>
              <MobileRow
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>}
                label="Track my interior project"
                sub="Briefing call completed"
              />
            </MobileSection>

            {/* Your information */}
            <MobileSection title="Your information">
              <MobileRow
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                label="My profile"
                sub="Full name, phone & more"
              />
              <MobileRow
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>}
                label="My addresses"
                sub="3 addresses"
              />
            </MobileSection>

            {/* Payments */}
            <MobileSection title="Payments">
              <MobileRow
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>}
                label="Gift cards"
                sub="1 gift card"
              />
            </MobileSection>

            {/* Download the app */}
            <MobileSection>
              <MobileRow
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>}
                label="Download the app"
              />
            </MobileSection>

            {/* Logout */}
            <div style={{ textAlign: "center", paddingTop: 8, paddingBottom: 16 }}>
              <button style={{ background: "none", border: "none", textDecoration: "underline", fontSize: 15, color: "#333", cursor: "pointer", fontFamily: "'Roboto',sans-serif" }}>Logout</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   CONSULTATION STAGES
───────────────────────────────────────────────────── */
type ConsultStage = "scheduled"|"partner_assigned"|"partner_on_way"|"partner_reached"|"consultation_done"|"boq_shared"|"payment_made"|"delivery_booked"|"installation_booked"|"delivery_on_way"|"delivered"|"install_partner_assigned"|"install_partner_on_way"|"install_partner_reached"|"installation_started"|"installation_done"|"order_complete";

const INSTALLATION_SUB_STATES: ConsultStage[] = ["installation_started", "installation_done"];

// partner_assigned / partner_on_way / partner_reached are merged into one visual step
const PARTNER_SUB_STATES: ConsultStage[] = ["partner_assigned", "partner_on_way", "partner_reached"];
// install partner sub-states are also merged into one visual step
const INSTALL_PARTNER_SUB_STATES: ConsultStage[] = ["install_partner_assigned", "install_partner_on_way", "install_partner_reached"];
// consultation_done / boq_shared / payment_made are merged into one visual step
const QUOTE_SUB_STATES: ConsultStage[] = ["consultation_done", "boq_shared", "payment_made"];
// delivery_on_way / delivered are merged into one visual step
const DELIVERY_SUB_STATES: ConsultStage[] = ["delivery_on_way", "delivered"];

const CONSULT_STAGES: { key: ConsultStage; label: string; icon: string; desc: string }[] = [
  { key: "scheduled",            label: "Consultation Scheduled", icon: "📅", desc: "Your consultation has been scheduled" },
  { key: "partner_assigned",     label: "Partner Assigned",       icon: "👤", desc: "A design expert has been assigned" },        // merged visual step
  { key: "boq_shared",           label: "Quote & Payment",        icon: "📋", desc: "Review your design quote and confirm payment" }, // merged visual step
  { key: "delivery_booked",      label: "Delivery Slot Booked",   icon: "📦", desc: "Delivery has been scheduled" },
  { key: "installation_booked",  label: "Installation Booked",    icon: "🔧", desc: "Installation slot confirmed" },
  { key: "delivered",            label: "Items Delivered",        icon: "🏠", desc: "All items have been delivered" },             // merged visual step (delivery_on_way + delivered)
  { key: "install_partner_assigned", label: "Partner Assigned",   icon: "👤", desc: "An installation partner has been assigned" }, // merged visual step
  { key: "installation_started",     label: "Installation",       icon: "🔨", desc: "Installation complete" },    // merged visual step
  { key: "order_complete",       label: "Order Complete",         icon: "🎉", desc: "Your home is ready. Enjoy your new space!" },
];

// Maps a ConsultStage to its visual index in CONSULT_STAGES
function consultStageIndex(stage: ConsultStage): number {
  if (PARTNER_SUB_STATES.includes(stage)) return 1;
  if (QUOTE_SUB_STATES.includes(stage)) return CONSULT_STAGES.findIndex(s => s.key === "boq_shared");
  if (DELIVERY_SUB_STATES.includes(stage)) return CONSULT_STAGES.findIndex(s => s.key === "delivered");
  if (INSTALL_PARTNER_SUB_STATES.includes(stage)) return CONSULT_STAGES.findIndex(s => s.key === "install_partner_assigned");
  if (INSTALLATION_SUB_STATES.includes(stage)) return CONSULT_STAGES.findIndex(s => s.key === "installation_started");
  return CONSULT_STAGES.findIndex(s => s.key === stage);
}

// Dynamic label/desc/icon for the merged consultation partner step
const PARTNER_SUB_LABEL: Record<string, { label: string; icon: string; desc: string }> = {
  partner_assigned: { label: "Partner Assigned",         icon: "👤", desc: "A design expert has been assigned to you" },
  partner_on_way:   { label: "Partner on the Way",       icon: "🚗", desc: "Your design expert is heading to your location" },
  partner_reached:  { label: "Partner at Your Location", icon: "📍", desc: "Your design expert has arrived" },
};

// Dynamic label/desc/icon for the merged installation step
const INSTALLATION_SUB_LABEL: Record<string, { label: string; icon: string; desc: string }> = {
  installation_started: { label: "Installation Started", icon: "🔨", desc: "Installation is currently in progress" },
  installation_done:    { label: "Installation Done",    icon: "✅", desc: "Installation completed successfully" },
};

// Dynamic label/desc/icon for the merged installation partner step
const INSTALL_PARTNER_SUB_LABEL: Record<string, { label: string; icon: string; desc: string }> = {
  install_partner_assigned: { label: "Partner Assigned",         icon: "👤", desc: "An installation partner has been assigned" },
  install_partner_on_way:   { label: "Partner on the Way",       icon: "🚗", desc: "Your installation partner is on the way" },
  install_partner_reached:  { label: "Partner at Your Location", icon: "📍", desc: "Your installation partner has arrived" },
};

// Dynamic label/desc/icon for the merged Items Delivered step
const DELIVERY_SUB_LABEL: Record<string, { label: string; icon: string; desc: string }> = {
  delivery_on_way: { label: "Delivery On the Way", icon: "🚚", desc: "Your items are on the way — track below" },
  delivered:       { label: "Items Delivered",     icon: "🏠", desc: "All items have been delivered successfully" },
};

// Dynamic label/desc/icon for the merged Quote & Payment step
const QUOTE_SUB_LABEL: Record<string, { label: string; icon: string; desc: string }> = {
  consultation_done: { label: "Consultation Done",  icon: "✅", desc: "Consultation completed — your quote is being prepared" },
  boq_shared:        { label: "Quote Shared",        icon: "📋", desc: "Your design quote is ready to review" },
  payment_made:      { label: "Payment Confirmed",   icon: "💳", desc: "65% payment received — delivery being arranged" },
};

function getConsultStage(placedAt: number): ConsultStage {
  const d = (Date.now() - placedAt) / 86_400_000;
  if (d < 1)    return "scheduled";
  if (d < 1.5)  return "partner_assigned";
  if (d < 3)    return "partner_on_way";
  if (d < 4)    return "partner_reached";
  if (d < 8)    return "consultation_done";
  if (d < 15)   return "boq_shared";
  if (d < 25)   return "payment_made";
  if (d < 35)   return "delivery_booked";
  if (d < 50)   return "installation_booked";
  if (d < 52.5) return "delivery_on_way";
  if (d < 55)   return "delivered";
  if (d < 56)   return "install_partner_assigned";
  if (d < 57)   return "install_partner_on_way";
  if (d < 58)   return "install_partner_reached";
  if (d < 60)   return "installation_started";
  if (d < 65)   return "installation_done";
  return "order_complete";
}

/* ─────────────────────────────────────────────────────
   ORDER DETAIL VIEW
───────────────────────────────────────────────────── */
function OrderDetailView({ order, onBack, isDesktop, onUpdateOrder }: { order: Order; onBack: () => void; isDesktop?: boolean; onUpdateOrder: (updated: Order) => void }) {
  const isConsult = order.items.some(i => i.category === "consultation");
  const dateStr = new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const expectedDate = new Date(order.placedAt + 5 * 86_400_000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const status = isConsult ? getConsultStage(order.placedAt) : (order.status as OrderStatus);
  const consultIdx = consultStageIndex(status as ConsultStage);
  const productStepIdx = ORDER_STATUS_STEPS.findIndex(s => s.key === (status as OrderStatus));

  const PARTNERS = [
    { name: "Vinay Kumar",  role: "Interior Design Consultant", initials: "VK", color: "#E8975A", phone: "+91 98450 12345", rating: 4.8, reviews: 142, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80" },
    { name: "Deepak Kumar", role: "Senior Design Consultant",   initials: "DK", color: "#5A8EE8", phone: "+91 97400 67890", rating: 4.9, reviews: 218, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80" },
  ];
  const partner = PARTNERS[parseInt(order.id, 36) % PARTNERS.length];

  const designTotal = order.designPrice ?? order.total;
  const boqAmount = Math.round(designTotal * 0.65);
  const remainingAmount = designTotal - boqAmount;

  // Local UI state
  const [quoteExpanded, setQuoteExpanded] = React.useState(false);
  const [showPaymentModal, setShowPaymentModal] = React.useState<"boq"|"final"|null>(null);
  const [otpRevealed, setOtpRevealed] = React.useState(false);
  const [installOtpRevealed, setInstallOtpRevealed] = React.useState(false);
  const [selectedDeliveryDate, setSelectedDeliveryDate] = React.useState<string|null>(null);
  const [selectedDeliverySlot, setSelectedDeliverySlot] = React.useState<string|null>(null);
  const [selectedInstallDate, setSelectedInstallDate] = React.useState<string|null>(null);
  const [selectedInstallSlot, setSelectedInstallSlot] = React.useState<string|null>(null);
  const [showDeliverySheet, setShowDeliverySheet] = React.useState(false);
  const [showInstallSheet, setShowInstallSheet] = React.useState(false);
  const [lightboxPhoto, setLightboxPhoto] = React.useState<number|null>(null);
  const [selectedRating, setSelectedRating] = React.useState(order.rating ?? 0);
  const [reviewText, setReviewText] = React.useState(order.review ?? "");
  const [consultOtpState, setConsultOtpState] = React.useState(order.consultOtp ?? "");
  const [installOtpState, setInstallOtpState] = React.useState(order.installOtp ?? "");

  const updateOrder = (patch: Partial<Order>) => onUpdateOrder({ ...order, ...patch });

  // Generate available dates (next ~14 days, skip Sunday)
  const availableDates = React.useMemo(() => {
    const dates: string[] = [];
    const now = new Date();
    for (let i = 2; dates.length < 10; i++) {
      const d = new Date(now.getTime() + i * 86400000);
      if (d.getDay() === 0) continue;
      dates.push(d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }));
    }
    return dates;
  }, []);
  const timeSlots = ["Morning (9–12)", "Afternoon (12–4)", "Evening (4–7)"];

  const LeftPanel = () => (
    <div style={{ flex: "1 1 0", minWidth: 0, width: "100%" }}>
      {/* Order details card */}
      <div style={{ background: "white", borderRadius: isDesktop ? 12 : 0, border: isDesktop ? "1px solid #E8E8E8" : "none", borderBottom: "1px solid #E8E8E8", padding: isDesktop ? "24px" : "20px 16px", marginBottom: isDesktop ? 16 : 8 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A", margin: "0 0 12px", fontFamily: "'Roboto',sans-serif" }}>Order details</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 14, color: tokens.primaryDefault, fontWeight: 600, textDecoration: "underline", cursor: "pointer" }}>#{order.id}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </div>
        <div style={{ fontSize: 13, color: "#666", marginBottom: 20 }}>Ordered online on {dateStr}</div>

        {/* Status banner */}
        <div style={{ background: "#F0FAF0", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#2E7D32" }}>
            {isConsult ? "Your consultation is confirmed" : "Your order is confirmed"}
          </span>
        </div>

        {isConsult ? (
          /* ── Consultation stage timeline ── */
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 16 }}>Progress</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {(() => { const visibleStages = CONSULT_STAGES.filter(s => s.key !== "order_complete"); return visibleStages.map((stage, _fi) => {
                const i = CONSULT_STAGES.findIndex(s2 => s2.key === stage.key);
                const isLastVisible = _fi === visibleStages.length - 1;
                const done = i < consultIdx;
                const current = i === consultIdx;
                const future = i > consultIdx;
                // For merged steps, use dynamic sub-label
                const isPartnerStep = stage.key === "partner_assigned";
                const isQuoteStep = stage.key === "boq_shared";
                const isDeliveryStep = stage.key === "delivered";
                const isInstallPartnerStep = stage.key === "install_partner_assigned";
                const isInstallationStep = stage.key === "installation_started";
                const partnerSub = isPartnerStep && current ? PARTNER_SUB_LABEL[status as string] : null;
                const quoteSub = isQuoteStep && current ? QUOTE_SUB_LABEL[status as string] : null;
                const deliverySub = isDeliveryStep && current ? DELIVERY_SUB_LABEL[status as string] : null;
                const installPartnerSub = isInstallPartnerStep && current ? INSTALL_PARTNER_SUB_LABEL[status as string] : null;
                const installationSub = isInstallationStep && current ? INSTALLATION_SUB_LABEL[status as string] : null;
                const activeSub = partnerSub ?? quoteSub ?? deliverySub ?? installPartnerSub ?? installationSub;
                const displayLabel = activeSub ? activeSub.label : stage.label;
                const displayIcon  = activeSub ? activeSub.icon  : stage.icon;
                const displayDesc  = activeSub ? activeSub.desc  : stage.desc;
                return (
                  <div key={stage.key} style={{ display: "flex", gap: 14 }}>
                    {/* Dot + line */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24, flexShrink: 0 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: done ? "#2E7D32" : current ? tokens.primaryDefault : "#E0E0E0", border: `2px solid ${done ? "#2E7D32" : current ? tokens.primaryDefault : "#E0E0E0"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0 }}>
                        {done ? <span style={{ color: "white", fontSize: 9, fontWeight: 700 }}>✓</span> : <span style={{ fontSize: 10 }}>{current ? displayIcon : ""}</span>}
                      </div>
                      {!isLastVisible && (
                        <div style={{ width: 2, flex: 1, minHeight: 28, background: done ? "#2E7D32" : "#E8E8E8" }} />
                      )}
                    </div>
                    {/* Content */}
                    <div style={{ paddingBottom: !isLastVisible ? 20 : 0, flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: current ? 700 : 500, color: future ? "#AAAAAA" : "#1A1A1A" }}>{displayLabel}</div>
                      {(done || current) && (
                        <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{displayDesc}</div>
                      )}
                      {/* ── Completed / current stage summaries ── */}
                      {done && isQuoteStep && order.quoteAccepted && (
                        <div style={{ marginTop: 8 }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#F0FAF0", border: "1px solid #C8E6C9", borderRadius: 6, padding: "4px 10px", marginBottom: 6 }}>
                            <span style={{ fontSize: 11, color: "#2E7D32" }}>✓ Quote accepted</span>
                            <span style={{ fontSize: 11, color: "#AAA" }}>·</span>
                            <span style={{ fontSize: 11, color: "#2E7D32", fontWeight: 600 }}>{fmt(boqAmount)} paid (65%)</span>
                          </div>
                          {/* Expandable BOQ details */}
                          <div style={{ background: "#F8F8F8", border: "1px solid #E8E8E8", borderRadius: 8, overflow: "hidden" }}>
                            <button onClick={() => setQuoteExpanded(v => !v)} style={{ width: "100%", background: "none", border: "none", padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                              <span style={{ fontSize: 11, fontWeight: 600, color: "#555" }}>View BOQ details</span>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" style={{ transform: quoteExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><path d="M6 9l6 6 6-6"/></svg>
                            </button>
                            {quoteExpanded && (
                              <div style={{ borderTop: "1px solid #E8E8E8", padding: "10px 12px" }}>
                                {(order.quoteItems ?? []).map((item, qi) => (
                                  <div key={qi} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 6, color: item.amount < 0 ? "#2E7D32" : "#555" }}>
                                    <span>{item.label}</span>
                                    <span style={{ fontWeight: 600 }}>{item.amount < 0 ? `-${fmt(-item.amount)}` : fmt(item.amount)}</span>
                                  </div>
                                ))}
                                <div style={{ borderTop: "1px dashed #DDD", paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "#1A1A1A", marginTop: 2 }}>
                                  <span>Total</span><span>{fmt(designTotal)}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {done && stage.key === "delivery_booked" && order.deliveryDate && (
                        <div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 6, background: "#F0FAF0", border: "1px solid #C8E6C9", borderRadius: 6, padding: "4px 10px" }}>
                          <span style={{ fontSize: 11, color: "#2E7D32" }}>📦</span>
                          <span style={{ fontSize: 11, color: "#2E7D32", fontWeight: 600 }}>{order.deliveryDate}</span>
                        </div>
                      )}
                      {(done || current) && stage.key === "installation_booked" && (order.installDate || done) && (
                        <div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 6, background: "#F0FAF0", border: "1px solid #C8E6C9", borderRadius: 6, padding: "4px 10px" }}>
                          <span style={{ fontSize: 11, color: "#2E7D32" }}>🔧</span>
                          <span style={{ fontSize: 11, color: "#2E7D32", fontWeight: 600 }}>{order.installDate ?? new Date(order.placedAt + 7 * 86400000).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) + " · Morning (10–1)"}</span>
                        </div>
                      )}
                      {current && stage.key === "installation_booked" && !order.installDate && (
                        <div style={{ marginTop: 10 }}>
                          <button onClick={() => setShowInstallSheet(true)} style={{ width: "100%", padding: "10px", background: "#FFF8F0", border: "1px solid #FFD9A0", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#B45309", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                            🔧 Schedule your installation
                          </button>
                          {showInstallSheet && (
                            <>
                              <div onClick={() => setShowInstallSheet(false)} style={{ position: "fixed", inset: 0, zIndex: 1200, background: "rgba(0,0,0,0.4)" }} />
                              <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 1201, background: "white", borderRadius: "20px 20px 0 0", padding: "20px 20px 36px", boxShadow: "0 -4px 32px rgba(0,0,0,0.15)" }}>
                                <div style={{ width: 36, height: 4, borderRadius: 99, background: "#E0E0E0", margin: "0 auto 20px" }} />
                                <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginBottom: 16 }}>Schedule your installation</div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 8 }}>Choose a date</div>
                                <div style={{ overflowX: "auto", display: "flex", gap: 8, paddingBottom: 4, scrollbarWidth: "none" as any } as React.CSSProperties}>
                                  {availableDates.map(d => (
                                    <button key={d} onClick={() => setSelectedInstallDate(d)} style={{ flexShrink: 0, padding: "8px 14px", borderRadius: 20, border: `1px solid ${selectedInstallDate === d ? tokens.primaryDefault : "#DDD"}`, background: selectedInstallDate === d ? tokens.primaryDefault : "white", color: selectedInstallDate === d ? "white" : "#333", fontSize: 12, fontWeight: selectedInstallDate === d ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap" as const }}>{d}</button>
                                  ))}
                                </div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#555", margin: "16px 0 8px" }}>Choose a time slot</div>
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                                  {timeSlots.map(s => (
                                    <button key={s} onClick={() => setSelectedInstallSlot(s)} style={{ padding: "8px 14px", borderRadius: 20, border: `1px solid ${selectedInstallSlot === s ? tokens.primaryDefault : "#DDD"}`, background: selectedInstallSlot === s ? tokens.primaryDefault : "white", color: selectedInstallSlot === s ? "white" : "#333", fontSize: 12, fontWeight: selectedInstallSlot === s ? 700 : 400, cursor: "pointer" }}>{s}</button>
                                  ))}
                                </div>
                                <button disabled={!selectedInstallDate || !selectedInstallSlot} onClick={() => { updateOrder({ installDate: `${selectedInstallDate} · ${selectedInstallSlot}` }); setShowInstallSheet(false); }} style={{ marginTop: 20, width: "100%", background: selectedInstallDate && selectedInstallSlot ? "#1A1A1A" : "#CCC", color: "white", border: "none", borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 700, cursor: selectedInstallDate && selectedInstallSlot ? "pointer" : "not-allowed" }}>Confirm Installation Date</button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                      {done && isInstallationStep && order.finalPaymentDone && (
                        <div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 6, background: "#F0FAF0", border: "1px solid #C8E6C9", borderRadius: 6, padding: "4px 10px" }}>
                          <span style={{ fontSize: 11, color: "#2E7D32" }}>✅</span>
                          <span style={{ fontSize: 11, color: "#2E7D32", fontWeight: 600 }}>Installation Complete · Full payment received</span>
                        </div>
                      )}
                      {/* ── FEATURE 1: Quote/BOQ at boq_shared sub-state ── */}
                      {current && isQuoteStep && (status as ConsultStage) === "boq_shared" && (
                        <div style={{ marginTop: 10 }}>
                          {/* Expandable quote card */}
                          <div style={{ background: "#FFFBF0", border: "1px solid #FFD9A0", borderRadius: 10, overflow: "hidden" }}>
                            <button onClick={() => setQuoteExpanded(v => !v)} style={{ width: "100%", background: "none", border: "none", padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 15 }}>📋</span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>Your Quote</span>
                                {!order.quoteAccepted && <span style={{ fontSize: 10, fontWeight: 700, color: "#B45309", background: "#FFE0B2", borderRadius: 4, padding: "2px 6px" }}>ACTION REQUIRED</span>}
                                {order.quoteAccepted && <span style={{ fontSize: 10, fontWeight: 700, color: "#2E7D32", background: "#E8F5E9", borderRadius: 4, padding: "2px 6px" }}>ACCEPTED ✓</span>}
                              </div>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" style={{ transform: quoteExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><path d="M6 9l6 6 6-6"/></svg>
                            </button>
                            {quoteExpanded && (
                              <div style={{ borderTop: "1px solid #FFD9A0", padding: "12px 14px" }}>
                                {(order.quoteItems ?? []).map((item, qi) => (
                                  <div key={qi} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8, color: item.amount < 0 ? "#2E7D32" : "#333" }}>
                                    <span>{item.label}</span>
                                    <span style={{ fontWeight: 600 }}>{item.amount < 0 ? `-${fmt(-item.amount)}` : fmt(item.amount)}</span>
                                  </div>
                                ))}
                                <div style={{ borderTop: "1px dashed #FFD9A0", paddingTop: 10, display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>
                                  <span>Total</span>
                                  <span>{fmt(designTotal)}</span>
                                </div>
                                <div style={{ fontSize: 11, color: "#888", marginTop: 4, marginBottom: 12 }}>65% ({fmt(boqAmount)}) payable now · 35% ({fmt(remainingAmount)}) on completion</div>
                                {!order.quoteAccepted && (
                                  <button onClick={() => updateOrder({ quoteAccepted: true })} style={{ width: "100%", background: tokens.primaryDefault, color: "white", border: "none", borderRadius: 8, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Accept & Proceed</button>
                                )}
                              </div>
                            )}
                          </div>
                          {/* Payment CTA — visible only after quote accepted */}
                          {order.quoteAccepted && (
                            <div style={{ marginTop: 10, background: "#FFF8F0", border: "1px solid #FFD9A0", borderRadius: 10, padding: "12px 14px" }}>
                              <div style={{ fontSize: 12, color: "#B45309", fontWeight: 600, marginBottom: 4 }}>Payment required to proceed</div>
                              <div style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>Pay 65% ({fmt(boqAmount)}) now. Remaining {fmt(remainingAmount)} on completion.</div>
                              <button onClick={() => setShowPaymentModal("boq")} style={{ background: tokens.primaryDefault, color: "white", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Pay {fmt(boqAmount)}</button>
                            </div>
                          )}
                        </div>
                      )}
                      {/* ── FEATURE 2: Delivery date picker at payment_made sub-state ── */}
                      {current && isQuoteStep && (status as ConsultStage) === "payment_made" && (
                        <>
                          <button onClick={() => setShowDeliverySheet(true)} style={{ marginTop: 10, width: "100%", padding: "10px", background: "#FFF8F0", border: "1px solid #FFD9A0", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#B45309", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                            📅 Schedule your delivery
                          </button>
                          {showDeliverySheet && (
                            <>
                              <div onClick={() => setShowDeliverySheet(false)} style={{ position: "fixed", inset: 0, zIndex: 1200, background: "rgba(0,0,0,0.4)" }} />
                              <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 1201, background: "white", borderRadius: "20px 20px 0 0", padding: "20px 20px 36px", boxShadow: "0 -4px 32px rgba(0,0,0,0.15)" }}>
                                <div style={{ width: 36, height: 4, borderRadius: 99, background: "#E0E0E0", margin: "0 auto 20px" }} />
                                <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginBottom: 16 }}>Schedule your delivery</div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 8 }}>Choose a date</div>
                                <div style={{ overflowX: "auto", display: "flex", gap: 8, paddingBottom: 4, scrollbarWidth: "none" as any } as React.CSSProperties}>
                                  {availableDates.map(d => (
                                    <button key={d} onClick={() => setSelectedDeliveryDate(d)} style={{ flexShrink: 0, padding: "8px 14px", borderRadius: 20, border: `1px solid ${selectedDeliveryDate === d ? tokens.primaryDefault : "#DDD"}`, background: selectedDeliveryDate === d ? tokens.primaryDefault : "white", color: selectedDeliveryDate === d ? "white" : "#333", fontSize: 12, fontWeight: selectedDeliveryDate === d ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap" as const }}>{d}</button>
                                  ))}
                                </div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#555", margin: "16px 0 8px" }}>Choose a time slot</div>
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                                  {timeSlots.map(s => (
                                    <button key={s} onClick={() => setSelectedDeliverySlot(s)} style={{ padding: "8px 14px", borderRadius: 20, border: `1px solid ${selectedDeliverySlot === s ? tokens.primaryDefault : "#DDD"}`, background: selectedDeliverySlot === s ? tokens.primaryDefault : "white", color: selectedDeliverySlot === s ? "white" : "#333", fontSize: 12, fontWeight: selectedDeliverySlot === s ? 700 : 400, cursor: "pointer" }}>{s}</button>
                                  ))}
                                </div>
                                <button disabled={!selectedDeliveryDate || !selectedDeliverySlot} onClick={() => { updateOrder({ deliveryDate: `${selectedDeliveryDate} · ${selectedDeliverySlot}`, placedAt: Date.now() - 35.1 * 86400000 }); setShowDeliverySheet(false); }} style={{ marginTop: 20, width: "100%", background: selectedDeliveryDate && selectedDeliverySlot ? "#1A1A1A" : "#CCC", color: "white", border: "none", borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 700, cursor: selectedDeliveryDate && selectedDeliverySlot ? "pointer" : "not-allowed" }}>Confirm Delivery Date</button>
                              </div>
                            </>
                          )}
                        </>
                      )}
                      {/* ── FEATURE 2: Installation date picker at delivery_booked ── */}
                      {current && stage.key === "delivery_booked" && (
                        <div style={{ marginTop: 10 }}>
                          {order.installDate ? (
                            <div style={{ background: "#F0FAF0", border: "1px solid #A0D9A0", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 16 }}>✅</span>
                              <div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#2E7D32" }}>Installation Scheduled</div>
                                <div style={{ fontSize: 12, color: "#555" }}>{order.installDate}</div>
                              </div>
                            </div>
                          ) : (
                            <>
                              <button onClick={() => setShowInstallSheet(true)} style={{ marginTop: 8, width: "100%", padding: "10px", background: "#FFF8F0", border: "1px solid #FFD9A0", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#B45309", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                🔧 Schedule your installation
                              </button>
                              {showInstallSheet && (
                                <>
                                  <div onClick={() => setShowInstallSheet(false)} style={{ position: "fixed", inset: 0, zIndex: 1200, background: "rgba(0,0,0,0.4)" }} />
                                  <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 1201, background: "white", borderRadius: "20px 20px 0 0", padding: "20px 20px 36px", boxShadow: "0 -4px 32px rgba(0,0,0,0.15)" }}>
                                    <div style={{ width: 36, height: 4, borderRadius: 99, background: "#E0E0E0", margin: "0 auto 20px" }} />
                                    <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginBottom: 16 }}>Schedule your installation</div>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 8 }}>Choose a date</div>
                                    <div style={{ overflowX: "auto", display: "flex", gap: 8, paddingBottom: 4, scrollbarWidth: "none" as any } as React.CSSProperties}>
                                      {availableDates.map(d => (
                                        <button key={d} onClick={() => setSelectedInstallDate(d)} style={{ flexShrink: 0, padding: "8px 14px", borderRadius: 20, border: `1px solid ${selectedInstallDate === d ? tokens.primaryDefault : "#DDD"}`, background: selectedInstallDate === d ? tokens.primaryDefault : "white", color: selectedInstallDate === d ? "white" : "#333", fontSize: 12, fontWeight: selectedInstallDate === d ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap" as const }}>{d}</button>
                                      ))}
                                    </div>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: "#555", margin: "16px 0 8px" }}>Choose a time slot</div>
                                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                                      {timeSlots.map(s => (
                                        <button key={s} onClick={() => setSelectedInstallSlot(s)} style={{ padding: "8px 14px", borderRadius: 20, border: `1px solid ${selectedInstallSlot === s ? tokens.primaryDefault : "#DDD"}`, background: selectedInstallSlot === s ? tokens.primaryDefault : "white", color: selectedInstallSlot === s ? "white" : "#333", fontSize: 12, fontWeight: selectedInstallSlot === s ? 700 : 400, cursor: "pointer" }}>{s}</button>
                                      ))}
                                    </div>
                                    <button disabled={!selectedInstallDate || !selectedInstallSlot} onClick={() => { updateOrder({ installDate: `${selectedInstallDate} · ${selectedInstallSlot}`, placedAt: Date.now() - 55.1 * 86400000 }); setShowInstallSheet(false); }} style={{ marginTop: 20, width: "100%", background: selectedInstallDate && selectedInstallSlot ? "#1A1A1A" : "#CCC", color: "white", border: "none", borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 700, cursor: selectedInstallDate && selectedInstallSlot ? "pointer" : "not-allowed" }}>Confirm Installation Date</button>
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      )}
                      {/* ── Partner card (shown for all partner sub-states) ── */}
                      {current && isPartnerStep && (
                        <div style={{ marginTop: 10, background: "white", border: "1px solid #E8E8E8", borderRadius: 12, padding: "14px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                          {/* Photo */}
                          <div style={{ width: 52, height: 52, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid #F0F0F0" }}>
                            <img src={partner.photo} alt={partner.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 2 }}>{partner.name}</div>
                            <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>{partner.role}</div>
                            {/* Rating */}
                            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
                              <div style={{ display: "flex", gap: 1 }}>
                                {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 11, color: s <= Math.round(partner.rating) ? "#FF6B00" : "#DDD" }}>★</span>)}
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}>{partner.rating}</span>
                              <span style={{ fontSize: 11, color: "#999" }}>({partner.reviews} reviews)</span>
                            </div>
                            {/* Phone */}
                            <a href={`tel:${partner.phone}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#F5F5F5", border: "1px solid #E0E0E0", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, color: "#1A1A1A", textDecoration: "none" }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 4.07a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L10.91 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                              {partner.phone}
                            </a>
                          </div>
                        </div>
                      )}
                      {/* ── FEATURE 3: OTP card at partner_reached ── */}
                      {current && isPartnerStep && (status as ConsultStage) === "partner_reached" && (
                        <div style={{ marginTop: 10, background: "#F0F4FF", border: "1px solid #C5D4FF", borderRadius: 10, padding: "14px" }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#1A3A8F", marginBottom: 4 }}>Share this code with your designer to begin</div>
                          <div style={{ fontSize: 11, color: "#666", marginBottom: 14 }}>Your designer needs this OTP to start the consultation session</div>
                          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 14 }}>
                            {(otpRevealed ? consultOtpState.split("") : ["●","●","●","●"]).map((c, ci) => (
                              <div key={ci} style={{ width: 44, height: 52, borderRadius: 10, background: "white", border: "1.5px solid #C5D4FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: otpRevealed ? 22 : 18, fontWeight: 700, color: "#1A3A8F", letterSpacing: 0 }}>{c}</div>
                            ))}
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => setOtpRevealed(v => !v)} style={{ flex: 1, padding: "9px", border: "1px solid #C5D4FF", borderRadius: 8, background: "white", color: "#1A3A8F", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{otpRevealed ? "Hide OTP" : "Tap to Reveal"}</button>
                            <button onClick={() => { const otp = String(Math.floor(Math.random()*9000)+1000); setConsultOtpState(otp); updateOrder({ consultOtp: otp }); }} style={{ flex: 1, padding: "9px", border: "1px solid #C5D4FF", borderRadius: 8, background: "white", color: "#1A3A8F", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Resend OTP</button>
                          </div>
                        </div>
                      )}
                      {/* ── FEATURE 3: OTP card at install_partner_reached ── */}
                      {current && isInstallPartnerStep && (status as ConsultStage) === "install_partner_reached" && (
                        <div style={{ marginTop: 10, background: "#F0F4FF", border: "1px solid #C5D4FF", borderRadius: 10, padding: "14px" }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#1A3A8F", marginBottom: 4 }}>Share this code with your installation team</div>
                          <div style={{ fontSize: 11, color: "#666", marginBottom: 14 }}>Your installer needs this OTP to begin the installation</div>
                          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 14 }}>
                            {(installOtpRevealed ? installOtpState.split("") : ["●","●","●","●"]).map((c, ci) => (
                              <div key={ci} style={{ width: 44, height: 52, borderRadius: 10, background: "white", border: "1.5px solid #C5D4FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: installOtpRevealed ? 22 : 18, fontWeight: 700, color: "#1A3A8F" }}>{c}</div>
                            ))}
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => setInstallOtpRevealed(v => !v)} style={{ flex: 1, padding: "9px", border: "1px solid #C5D4FF", borderRadius: 8, background: "white", color: "#1A3A8F", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{installOtpRevealed ? "Hide OTP" : "Tap to Reveal"}</button>
                            <button onClick={() => { const otp = String(Math.floor(Math.random()*9000)+1000); setInstallOtpState(otp); updateOrder({ installOtp: otp }); }} style={{ flex: 1, padding: "9px", border: "1px solid #C5D4FF", borderRadius: 8, background: "white", color: "#1A3A8F", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Resend OTP</button>
                          </div>
                        </div>
                      )}
                      {/* ── Install partner card (shown for all install partner sub-states) ── */}
                      {current && isInstallPartnerStep && (
                        <div style={{ marginTop: 10, background: "white", border: "1px solid #E8E8E8", borderRadius: 12, padding: "14px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                          <div style={{ width: 52, height: 52, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid #F0F0F0" }}>
                            <img src={partner.photo} alt={partner.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 2 }}>{partner.name}</div>
                            <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>{partner.role}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
                              <div style={{ display: "flex", gap: 1 }}>
                                {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 11, color: s <= Math.round(partner.rating) ? "#FF6B00" : "#DDD" }}>★</span>)}
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}>{partner.rating}</span>
                              <span style={{ fontSize: 11, color: "#999" }}>({partner.reviews} reviews)</span>
                            </div>
                            <a href={`tel:${partner.phone}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#F5F5F5", border: "1px solid #E0E0E0", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, color: "#1A1A1A", textDecoration: "none" }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 4.07a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L10.91 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                              {partner.phone}
                            </a>
                          </div>
                        </div>
                      )}
                      {/* ── FEATURE 4: Tracking card at delivery_on_way sub-state ── */}
                      {current && isDeliveryStep && (status as ConsultStage) === "delivery_on_way" && (
                        <div style={{ marginTop: 10, background: "white", border: "1px solid #E8E8E8", borderRadius: 10, overflow: "hidden" }}>
                          <div style={{ background: "#1A1A2E", padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#E8975A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "white" }}>RK</div>
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 600, color: "white" }}>Ravi Kumar · Delivery Partner</div>
                              <div style={{ fontSize: 10, color: "#AAA" }}>Maruti Eco Van · KA-03 X 1234</div>
                            </div>
                            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, background: "#FF6B00", borderRadius: 6, padding: "4px 10px" }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: "white" }}>En Route</span>
                            </div>
                          </div>
                          {/* Map placeholder */}
                          <div style={{ height: 100, background: "#E8EDF0", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 19px,#D0D8E0 20px),repeating-linear-gradient(90deg,transparent,transparent 19px,#D0D8E0 20px)", opacity: 0.6 }} />
                            <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF4444" stroke="white" strokeWidth="1"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>
                              <div style={{ background: "white", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600, color: "#333", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }}>Arriving in ~20 min</div>
                            </div>
                          </div>
                          <div style={{ padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ fontSize: 12, color: "#666" }}>2.3 km away</div>
                            <button style={{ display: "flex", alignItems: "center", gap: 6, background: "#F0F0FF", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, color: "#1A3A8F", cursor: "pointer" }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 4.07a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L10.91 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                              Call Partner
                            </button>
                          </div>
                        </div>
                      )}
                      {/* ── Delivered confirmation at delivered sub-state ── */}
                      {current && isDeliveryStep && (status as ConsultStage) === "delivered" && (
                        <div style={{ marginTop: 10, background: "#F0FAF0", border: "1px solid #A0D9A0", borderRadius: 10, padding: "14px", display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ fontSize: 28 }}>🏠</span>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#2E7D32" }}>All items delivered!</div>
                            <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>Your items have arrived. Installation partner will be assigned shortly.</div>
                          </div>
                        </div>
                      )}
                      {/* ── FEATURE 5: Photos + rating at installation_done ── */}
                      {current && isInstallationStep && (status as ConsultStage) === "installation_done" && (
                        <div style={{ marginTop: 10 }}>
                          {/* Success banner */}
                          <div style={{ background: "#F0FAF0", border: "1px solid #A0D9A0", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                            <span style={{ fontSize: 22 }}>🎉</span>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: "#2E7D32" }}>Your space is ready!</div>
                              <div style={{ fontSize: 12, color: "#555" }}>The installation is complete. See below for photos.</div>
                            </div>
                          </div>
                          {/* Completion photos */}
                          {(order.completionPhotos ?? []).length > 0 && (
                            <div style={{ marginBottom: 12 }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>Completion photos</div>
                              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" as any }}>
                                {(order.completionPhotos ?? []).map((url, pi) => (
                                  <button key={pi} onClick={() => setLightboxPhoto(pi)} style={{ flexShrink: 0, width: 90, height: 90, borderRadius: 8, overflow: "hidden", border: "none", padding: 0, cursor: "pointer" }}>
                                    <img src={url} alt="completion" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          {/* Rating & review */}
                          {!order.reviewSubmitted ? (
                            <div style={{ background: "#FFFBF0", border: "1px solid #FFD9A0", borderRadius: 12, padding: "16px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", marginBottom: 2 }}>Rate your experience</div>
                                <div style={{ fontSize: 11, color: "#888" }}>How was your Livspace Elevate experience?</div>
                              </div>
                              <button style={{ flexShrink: 0, background: "#F5A623", color: "white", border: "none", borderRadius: 24, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" as const }}>Rate &amp; Review</button>
                            </div>
                          ) : (
                            <div style={{ background: "#F0FAF0", border: "1px solid #A0D9A0", borderRadius: 10, padding: "12px 14px" }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: "#2E7D32", marginBottom: 4 }}>Review submitted! ✅</div>
                              <div style={{ display: "flex", gap: 2, marginBottom: 4 }}>{[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 14, color: s <= (order.rating ?? 0) ? "#FF6B00" : "#DDD" }}>★</span>)}</div>
                              {order.review && <div style={{ fontSize: 12, color: "#555", fontStyle: "italic" }}>"{order.review}"</div>}
                            </div>
                          )}
                          {/* ── FEATURE 6: Final payment at installation_done ── */}
                          {!order.finalPaymentDone && (
                            <div style={{ marginTop: 10, background: "#FFF8F0", border: "1px solid #FFD9A0", borderRadius: 10, padding: "14px" }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: "#B45309", marginBottom: 4 }}>Complete your payment</div>
                              <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>Final 35% balance due on completion</div>
                              {[
                                { label: "Total order value", value: fmt(designTotal) },
                                { label: "Paid (65%)",        value: fmt(boqAmount) },
                              ].map((r, ri) => (
                                <div key={ri} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6, color: "#555" }}>
                                  <span>{r.label}</span><span>{r.value}</span>
                                </div>
                              ))}
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, color: "#1A1A1A", borderTop: "1px solid #FFD9A0", paddingTop: 8, marginBottom: 12 }}>
                                <span>Remaining</span><span>{fmt(remainingAmount)}</span>
                              </div>
                              <button onClick={() => setShowPaymentModal("final")} style={{ width: "100%", background: tokens.primaryDefault, color: "white", border: "none", borderRadius: 8, padding: "11px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Pay {fmt(remainingAmount)} to Complete</button>
                            </div>
                          )}
                          {order.finalPaymentDone && (
                            <div style={{ marginTop: 10, background: "#F0FAF0", border: "1px solid #A0D9A0", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 22 }}>✅</span>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "#2E7D32" }}>Order Complete!</div>
                                <div style={{ fontSize: 12, color: "#555" }}>Full payment received. Enjoy your new space!</div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }); })()}
            </div>
          </div>
        ) : (
          /* ── Product order: status + items ── */
          <div>
            <div style={{ background: "#F8F8F8", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#888", letterSpacing: "0.07em", marginBottom: 4 }}>
                {ORDER_STATUS_STEPS.find(s => s.key === status)?.label.toUpperCase() ?? "STATUS"}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 14 }}>
                {status === "consultation_scheduled" && `Scheduled: ${expectedDate}, 10–11 AM`}
                {status === "consultation_completed" && `Completed on ${dateStr}`}
                {status === "out_for_delivery" && "Arriving in ~2 days"}
                {status === "items_delivered" && `Delivered on ${dateStr}`}
                {status === "installation_scheduled" && `Scheduled: ${expectedDate}`}
                {status === "installation_completed" && `Completed on ${dateStr}`}
              </div>
              {/* Item thumbnails */}
              <div style={{ display: "flex", gap: 8 }}>
                {order.items.slice(0, 3).map((item, i) => (
                  <div key={i} style={{ width: 72, height: 72, borderRadius: 8, background: "#F0EBE3", border: "1px solid #E8E8E8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{item.emoji}</div>
                ))}
              </div>
              <button style={{ marginTop: 10, background: "none", border: "none", padding: 0, fontSize: 13, color: tokens.primaryDefault, fontWeight: 600, textDecoration: "underline", cursor: "pointer" }}>View all item details</button>
            </div>
            {/* Progress bar */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
              {ORDER_STATUS_STEPS.map((step, i) => {
                const done = i < productStepIdx; const cur = i === productStepIdx;
                const col = done ? "#2E7D32" : cur ? tokens.primaryDefault : "#E0E0E0";
                return (
                  <React.Fragment key={step.key}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: col, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {done ? <span style={{ color: "white", fontSize: 9 }}>✓</span> : <span style={{ fontSize: 9 }}>{cur ? step.em : ""}</span>}
                    </div>
                    {i < ORDER_STATUS_STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: done ? "#2E7D32" : "#E0E0E0" }} />}
                  </React.Fragment>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              {ORDER_STATUS_STEPS.map((s, i) => <div key={s.key} style={{ fontSize: 9, color: i <= productStepIdx ? "#333" : "#AAA", textAlign: "center", flex: 1 }}>{s.label.split(" ")[0]}</div>)}
            </div>
            {/* Demo: advance to next stage */}
            {status !== "installation_completed" && (() => {
              const idx = ORDER_STATUS_STEPS.findIndex(s => s.key === status);
              const next = ORDER_STATUS_STEPS[idx + 1];
              return next ? (
                <button onClick={() => updateOrder({ status: next.key })}
                  style={{ width: "100%", background: "none", border: "1px dashed #CCC", borderRadius: 8, padding: "9px", fontSize: 12, color: "#888", cursor: "pointer" }}>
                  [Demo] Advance → {next.label}
                </button>
              ) : null;
            })()}
          </div>
        )}
      </div>

      {/* Manage your order */}
      <div style={{ background: "white", borderRadius: isDesktop ? 12 : 0, border: isDesktop ? "1px solid #E8E8E8" : "none", borderBottom: "1px solid #E8E8E8", padding: isDesktop ? "20px 24px" : "16px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>Manage your order</span>
        </div>
        {[
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>, label: "Cancel order items" },
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>, label: "Download invoice" },
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, label: "Need help?" },
        ].map((item, i) => (
          <button key={i} style={{ width: "100%", background: "none", border: "none", padding: "10px 0", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", borderBottom: i < 2 ? "1px solid #F0F0F0" : "none", color: "#333", fontSize: 13, textDecoration: "underline", textAlign: "left" }}>
            <span style={{ color: "#555" }}>{item.icon}</span>{item.label}
          </button>
        ))}
      </div>
    </div>
  );

  const RightPanel = () => (
    <div style={{ width: isDesktop ? 300 : "100%", flexShrink: 0 }}>
      {/* Address */}
      <div style={{ background: "white", borderRadius: isDesktop ? 12 : 0, border: isDesktop ? "1px solid #E8E8E8" : "none", borderBottom: "1px solid #E8E8E8", padding: isDesktop ? "20px" : "16px", marginBottom: isDesktop ? 14 : 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>Address</span>
        </div>
        <div style={{ display: "inline-block", background: "#1A1A1A", color: "white", fontSize: 10, fontWeight: 700, borderRadius: 4, padding: "2px 8px", marginBottom: 8, letterSpacing: "0.05em" }}>HOME</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 4 }}>+91 98765 43210</div>
        <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>13252, Prestige Lakeside Habitat,<br/>SH Nagar, Bengaluru – 560037</div>
      </div>

      {/* Price details */}
      <div style={{ background: "white", borderRadius: isDesktop ? 12 : 0, border: isDesktop ? "1px solid #E8E8E8" : "none", borderBottom: "1px solid #E8E8E8", padding: isDesktop ? "20px" : "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>Price details</span>
        </div>
        {[
          { label: "Items subtotal",   value: fmt(order.itemsTotal), color: "#333" },
          { label: "Delivery charges", value: "FREE",                color: "#2E7D32" },
          ...(!isConsult ? [{ label: "Installation", value: fmt(4999), color: "#333" }] : []),
        ].map((row, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13 }}>
            <span style={{ color: "#666" }}>{row.label}</span>
            <span style={{ color: row.color, fontWeight: row.color === "#2E7D32" ? 600 : 400 }}>{row.value}</span>
          </div>
        ))}
        <div style={{ borderTop: "1px solid #EBEBEB", paddingTop: 12, display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>Total Amount</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>{fmt(order.total)}</span>
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#999", letterSpacing: "0.06em", marginBottom: 8 }}>PAYMENT METHOD</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span style={{ color: "#666" }}>UPI Payment</span>
          <span style={{ color: "#333" }}>{fmt(order.total)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#F5F5F5", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #E8E8E8", padding: isDesktop ? "16px 40px" : "12px 16px", flexShrink: 0 }}>
        <div style={{ maxWidth: isDesktop ? 1100 : "100%", margin: "0 auto" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#888", marginBottom: 12 }}>
            <button onClick={onBack} style={{ background: "none", border: "none", padding: 0, color: "#888", fontSize: 12, cursor: "pointer" }}>Orders</button>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#CCC" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            <span style={{ color: "#1A1A1A", fontWeight: 500 }}>#{order.id}</span>
            {isConsult && (() => {
              // Dev helper: jump to next stage
              const STAGE_DAYS: Record<ConsultStage, number> = { scheduled:0, partner_assigned:1, partner_on_way:1.5, partner_reached:3, consultation_done:4, boq_shared:8, payment_made:15, delivery_booked:25, installation_booked:35, delivery_on_way:50, delivered:52.5, install_partner_assigned:55, install_partner_on_way:56, install_partner_reached:57, installation_started:58, installation_done:60, order_complete:65 };
              const stageOrder: ConsultStage[] = ["scheduled","partner_assigned","partner_on_way","partner_reached","consultation_done","boq_shared","payment_made","delivery_booked","installation_booked","delivery_on_way","delivered","install_partner_assigned","install_partner_on_way","install_partner_reached","installation_started","installation_done","order_complete"];
              const curIdx = stageOrder.indexOf(status as ConsultStage);
              const nextStage = stageOrder[curIdx + 1];
              if (!nextStage) return null;
              const nextDays = STAGE_DAYS[nextStage] + 0.1;
              return (
                <button onClick={() => updateOrder({ placedAt: Date.now() - nextDays * 86400000 })} style={{ marginLeft: "auto", background: "#1A1A2E", color: "white", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  ⚡ Next stage
                </button>
              );
            })()}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            </button>
            <span style={{ fontSize: isDesktop ? 20 : 17, fontWeight: 700, color: "#1A1A1A", fontFamily: "'Roboto',sans-serif" }}>Order details</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: isDesktop ? 1100 : "100%", margin: "0 auto", padding: isDesktop ? "24px 40px" : "0", display: "flex", flexDirection: isDesktop ? "row" : "column", gap: isDesktop ? 16 : 0, alignItems: "flex-start" }}>
          <LeftPanel />
          <RightPanel />
        </div>
      </div>

      {/* ── Payment modal overlay ── */}
      {showPaymentModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: "20px 20px 0 0", padding: "24px 20px 32px", width: "100%", maxWidth: 480 }}>
            <div style={{ width: 40, height: 4, background: "#DDD", borderRadius: 2, margin: "0 auto 20px" }} />
            <div style={{ fontSize: 17, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>
              {showPaymentModal === "boq" ? "Pay 65% to Proceed" : "Pay Remaining Balance"}
            </div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>
              {showPaymentModal === "boq"
                ? `${fmt(boqAmount)} · 65% of ${fmt(designTotal)}`
                : `${fmt(remainingAmount)} · Remaining 35%`}
            </div>
            <div style={{ background: "#F8F8F8", borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 10 }}>Pay via</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["💳 UPI", "🏦 Net Banking", "💰 Cards"].map((m, mi) => (
                  <button key={m} style={{ flex: 1, padding: "8px 4px", border: `1px solid ${mi === 0 ? tokens.primaryDefault : "#DDD"}`, borderRadius: 8, fontSize: 11, background: mi === 0 ? "#F0F4FF" : "white", color: "#333", cursor: "pointer", fontWeight: mi === 0 ? 600 : 400 }}>{m}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowPaymentModal(null)} style={{ flex: 1, padding: "12px", border: "1px solid #DDD", borderRadius: 10, fontSize: 14, fontWeight: 600, background: "white", color: "#333", cursor: "pointer" }}>Cancel</button>
              <button onClick={() => {
                if (showPaymentModal === "final") {
                  updateOrder({ finalPaymentDone: true, placedAt: Date.now() - 65.1 * 86400000 });
                }
                setShowPaymentModal(null);
              }} style={{ flex: 2, padding: "12px", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, background: tokens.primaryDefault, color: "white", cursor: "pointer" }}>
                Pay {fmt(showPaymentModal === "boq" ? boqAmount : remainingAmount)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Photo lightbox overlay ── */}
      {lightboxPhoto !== null && (
        <div onClick={() => setLightboxPhoto(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 1001, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <button onClick={() => setLightboxPhoto(null)} style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <img src={(order.completionPhotos ?? [])[lightboxPhoto]} alt="completion" style={{ maxWidth: "90vw", maxHeight: "80vh", objectFit: "contain", borderRadius: 8 }} onClick={e => e.stopPropagation()} />
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            {(order.completionPhotos ?? []).map((_, pi) => (
              <button key={pi} onClick={e => { e.stopPropagation(); setLightboxPhoto(pi); }} style={{ width: 8, height: 8, borderRadius: "50%", background: pi === lightboxPhoto ? "white" : "rgba(255,255,255,0.35)", border: "none", cursor: "pointer", padding: 0 }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MyOrdersScreen({ goTo, goBack, orders, isDesktop, onUpdateOrder }: { goTo: (id: ScreenId) => void; goBack: () => void; orders: Order[]; isDesktop?: boolean; onUpdateOrder: (updated: Order) => void }) {
  const [activeTab, setActiveTab] = React.useState<"all"|"products"|"services">("all");
  const [search, setSearch] = React.useState("");
  const [detailOrderId, setDetailOrderId] = React.useState<string|null>(null);
  const [showFiltersModal, setShowFiltersModal] = React.useState(false);
  const [showAll, setShowAll] = React.useState(false);

  const detailOrder = detailOrderId ? orders.find(o => o.id === detailOrderId) : null;
  if (detailOrder) {
    return <OrderDetailView order={detailOrder} onBack={() => setDetailOrderId(null)} isDesktop={isDesktop} onUpdateOrder={onUpdateOrder} />;
  }

  const isConsultation = (o: Order) => o.items.some(i => i.category === "consultation");

  const filtered = orders.filter(o => {
    if (activeTab === "products" && isConsultation(o)) return false;
    if (activeTab === "services" && !isConsultation(o)) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !(o.lookName || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const tabs = [
    { key: "all",      label: "All" },
    { key: "products", label: "Products" },
    { key: "services", label: "Services" },
  ] as const;

  const PARTNERS = [
    { name: "Vinay Kumar",  role: "Partner Consultant",  initials: "VK", color: "#E8975A" },
    { name: "Deepak Kumar", role: "Partner Supervisor",  initials: "DK", color: "#5A8EE8" },
    { name: "Priya Sharma", role: "Design Expert",       initials: "PS", color: "#7E5AE8" },
  ];

  const MOBILE_SHOW_COUNT = 3;
  const displayedOrders = (!isDesktop && !showAll) ? filtered.slice(0, MOBILE_SHOW_COUNT) : filtered;

  const filterGroups = [
    { label: "Order Status", items: ["Ordered","Booked","Delivered","Confirmed","Cancelled","Ongoing","Returned","Completed"] },
    { label: "Order type",   items: ["Online","Store"] },
    { label: "Order time",   items: ["Last 30 days","Last 3 months","Last 6 months"] },
    { label: "Order category", items: ["Product","Service","Material"] },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#F5F5F5", overflow: "hidden" }}>
      {!isDesktop && <div style={{ background: "white" }}><StatusBar /></div>}

      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #E8E8E8", padding: isDesktop ? "20px 40px 0" : "14px 16px 0", flexShrink: 0 }}>
        <div style={{ maxWidth: isDesktop ? 1100 : "100%", margin: "0 auto" }}>

          {/* Title row */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: isDesktop ? 16 : 12 }}>
            <button onClick={goBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            </button>
            <h1 style={{ fontSize: isDesktop ? 26 : 20, fontWeight: 700, color: "#1A1A1A", fontFamily: "'Roboto',sans-serif", margin: 0, flex: 1 }}>Orders</h1>

            {isDesktop ? (
              /* Desktop: inline search in header */
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F5F5F5", border: "1px solid #E0E0E0", borderRadius: 8, padding: "8px 14px", width: 220 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders" style={{ border: "none", background: "transparent", fontSize: 13, color: "#333", outline: "none", width: "100%" }} />
              </div>
            ) : (
              /* Mobile: Filters button */
              <button onClick={() => setShowFiltersModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid #DDD", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, color: "#333", cursor: "pointer", flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/></svg>
                Filters
              </button>
            )}
          </div>

          {/* Mobile: full-width search bar */}
          {!isDesktop && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F5F5F5", border: "1px solid #E0E0E0", borderRadius: 10, padding: "10px 14px", marginBottom: 4 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID or product" style={{ border: "none", background: "transparent", fontSize: 14, color: "#333", outline: "none", width: "100%" }} />
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, overflowX: "auto", WebkitOverflowScrolling: "touch" as any, scrollbarWidth: "none" as any }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ padding: "10px 20px", fontSize: 13, fontWeight: 500, fontFamily: "'Roboto',sans-serif", background: "none", border: "none", borderBottom: `2px solid ${activeTab === t.key ? tokens.primaryDefault : "transparent"}`, color: activeTab === t.key ? tokens.primaryDefault : "#666", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: isDesktop ? 1100 : "100%", margin: "0 auto", padding: isDesktop ? "24px 40px" : "12px 12px 20px", display: "flex", gap: 24, alignItems: "flex-start" }}>

          {/* Filters sidebar — desktop only */}
          {isDesktop && (
            <div style={{ width: 200, flexShrink: 0, background: "white", borderRadius: 12, padding: "18px 16px", border: "1px solid #E8E8E8" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#999", letterSpacing: "0.08em", marginBottom: 14 }}>FILTERS</div>
              {filterGroups.map(group => (
                <div key={group.label} style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>{group.label}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {group.items.map(item => (
                      <label key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#444", cursor: "pointer" }}>
                        <input type="checkbox" defaultChecked style={{ accentColor: tokens.primaryDefault, width: 13, height: 13 }} />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button style={{ flex: 1, padding: "8px 0", fontSize: 12, fontWeight: 600, color: tokens.primaryDefault, background: "white", border: `1px solid ${tokens.primaryDefault}`, borderRadius: 8, cursor: "pointer" }}>Reset</button>
                <button style={{ flex: 1, padding: "8px 0", fontSize: 12, fontWeight: 600, color: "white", background: tokens.primaryDefault, border: "none", borderRadius: 8, cursor: "pointer" }}>Apply</button>
              </div>
            </div>
          )}

          {/* Orders list */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {filtered.length === 0 ? (
              <div style={{ background: "white", borderRadius: 12, padding: "60px 24px", textAlign: "center", border: "1px solid #E8E8E8" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: "#1A1A1A", marginBottom: 6 }}>No orders yet</div>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Place your first order to start tracking it here.</div>
                <button onClick={() => goTo("gallery")} style={{ background: tokens.primaryDefault, color: "white", border: "none", borderRadius: 10, padding: "11px 26px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Browse Looks</button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: isDesktop ? 12 : 10 }}>
                  {displayedOrders.map((order, oi) => {
                    const consultation = isConsultation(order);
                    const status = consultation ? getConsultStage(order.placedAt) as string : order.status as string;
                    const dateStr = new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
                    const partner = PARTNERS[oi % PARTNERS.length];
                    const firstItem = order.items[0];
                    const extraItems = order.items.length - 1;
                    const visitDate = new Date(order.placedAt + 3 * 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
                    const consultStatus = consultation ? getConsultStage(order.placedAt) : null;
                    const consultStageObj = consultStatus ? CONSULT_STAGES.find(s => s.key === consultStatus) ?? null : null;
                    const statusCard = (() => {
                      if (consultation && order.finalPaymentDone)
                        return { label: "COMPLETE", value: "Installation done" + (order.rating ? ` · ${order.rating}★` : ""), btnLabel: "View", labelColor: "#2E7D32", bg: "#F0FAF0" };
                      if (consultation && consultStageObj)
                        return { label: "CURRENT STATUS", value: `${consultStageObj.icon} ${consultStageObj.label}`, btnLabel: "View", labelColor: "#888", bg: "#F5F5F5" };
                      if (status === "installation_completed")
                        return { label: "INSTALLATION COMPLETE", value: dateStr, btnLabel: "Rate & Review", labelColor: "#2E7D32", bg: "#F0FAF0" };
                      if (status === "installation_scheduled")
                        return { label: "INSTALLATION SCHEDULED", value: visitDate, btnLabel: "", labelColor: "#B45309", bg: "#FFF8E7" };
                      if (status === "items_delivered")
                        return { label: "ITEMS DELIVERED", value: dateStr, btnLabel: "", labelColor: "#888", bg: "#F5F5F5" };
                      if (status === "out_for_delivery")
                        return { label: "OUT FOR DELIVERY", value: "Arriving in ~2 days", btnLabel: "Track", labelColor: "#B45309", bg: "#FFF8E7" };
                      if (status === "consultation_completed")
                        return { label: "CONSULTATION COMPLETED", value: dateStr, btnLabel: "", labelColor: "#888", bg: "#F5F5F5" };
                      return { label: "CONSULTATION SCHEDULED", value: `${visitDate}, 10–11 AM`, btnLabel: "", labelColor: "#888", bg: "#F5F5F5" };
                    })();

                    if (!isDesktop) {
                      /* ── MOBILE CARD ── */
                      return (
                        <div key={order.id} style={{ background: "white", borderRadius: 12, border: "1px solid #E8E8E8", overflow: "hidden" }}>
                          {/* Card top: order meta */}
                          <div style={{ padding: "11px 14px", borderBottom: "1px solid #F0F0F0", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 12, color: "#888" }}>Order ID <span style={{ color: tokens.primaryDefault, fontWeight: 600 }}>#{order.id}</span></span>
                            <span style={{ fontSize: 11, color: "#CCC" }}>·</span>
                            <span style={{ fontSize: 12, color: "#888" }}>{dateStr}</span>
                            <span style={{ fontSize: 11, color: "#CCC" }}>·</span>
                            <span style={{ fontSize: 12, color: "#888" }}>Online</span>
                            <button onClick={() => setDetailOrderId(order.id)} style={{ marginLeft: "auto", background: "none", border: "none", fontSize: 12, color: tokens.primaryDefault, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 3, padding: 0 }}>
                              {consultation ? "View booking" : "View details"}
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                            </button>
                          </div>

                          {/* Item row */}
                          <div style={{ padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <div style={{ width: 56, height: 56, borderRadius: 8, background: "#F5F0E8", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, border: "1px solid #EEE" }}>
                              {firstItem?.emoji || "📦"}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 2, lineHeight: 1.3 }}>{firstItem?.name || "Order"}</div>
                              <div style={{ fontSize: 12, color: "#555" }}>{fmt(firstItem?.price || order.total)} · 1 Qty</div>
                              {extraItems > 0 && (
                                <div style={{ marginTop: 5, display: "inline-block", background: "#F5F5F5", borderRadius: 6, padding: "2px 7px", fontSize: 11, color: "#666" }}>+{extraItems} more item{extraItems > 1 ? "s" : ""}</div>
                              )}
                              {order.lookName && (
                                <div style={{ fontSize: 11, color: "#999", marginTop: 3 }}>{order.lookRoom} · {order.lookName}</div>
                              )}
                            </div>
                          </div>

                          {/* Status footer */}
                          <div style={{ padding: "10px 14px", borderTop: "1px solid #F0F0F0", background: statusCard.bg, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                              <div style={{ fontSize: 10, fontWeight: 700, color: statusCard.labelColor, letterSpacing: "0.06em" }}>{statusCard.label}</div>
                              <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", marginTop: 2 }}>{statusCard.value}</div>
                            </div>
                            {statusCard.btnLabel ? (
                              <button onClick={() => setDetailOrderId(order.id)} style={{ background: "white", color: "#333", border: "1px solid #DDD", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                                {statusCard.btnLabel}
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                              </button>
                            ) : null}
                          </div>
                        </div>
                      );
                    }

                    /* ── DESKTOP CARD ── */
                    return (
                      <div key={order.id} style={{ background: "white", borderRadius: 12, border: "1px solid #E8E8E8", overflow: "hidden" }}>
                        <div style={{ padding: "12px 16px", borderBottom: "1px solid #F0F0F0", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 12, color: "#888", fontFamily: "'Roboto',sans-serif" }}>Order ID <span style={{ color: tokens.primaryDefault, fontWeight: 600 }}>#{order.id}</span></span>
                          <span style={{ fontSize: 11, color: "#aaa" }}>|</span>
                          <span style={{ fontSize: 12, color: "#888" }}>{dateStr}</span>
                          <span style={{ fontSize: 11, color: "#aaa" }}>|</span>
                          <span style={{ fontSize: 12, color: "#888" }}>Online</span>
                          <div style={{ marginLeft: "auto" }}>
                            <button onClick={() => setDetailOrderId(order.id)} style={{ background: "none", border: "none", fontSize: 12, color: tokens.primaryDefault, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                              {consultation ? "View booking details" : "View order details"}
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                            </button>
                          </div>
                        </div>
                        <div style={{ padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                          <div style={{ width: 64, height: 64, borderRadius: 8, background: "#F5F0E8", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, border: "1px solid #EEE" }}>
                            {firstItem?.emoji || "📦"}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 3, lineHeight: 1.3 }}>{firstItem?.name || "Order"}</div>
                            <div style={{ fontSize: 13, color: "#333" }}>{fmt(firstItem?.price || order.total)} &nbsp;·&nbsp; 1 Qty</div>
                            {extraItems > 0 && (
                              <div style={{ marginTop: 6, display: "inline-block", background: "#F5F5F5", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: "#666" }}>+{extraItems} item{extraItems > 1 ? "s" : ""}</div>
                            )}
                            {order.lookName && (
                              <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>{order.lookRoom} · {order.lookName}</div>
                            )}
                          </div>
                        </div>
                        {/* Status footer */}
                        <div style={{ padding: "10px 16px", borderTop: "1px solid #F0F0F0", background: statusCard.bg, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: statusCard.labelColor, letterSpacing: "0.06em" }}>{statusCard.label}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", marginTop: 2 }}>{statusCard.value}</div>
                          </div>
                          {statusCard.btnLabel ? (
                            <button onClick={() => setDetailOrderId(order.id)} style={{ background: "white", color: "#333", border: "1px solid #DDD", borderRadius: 8, padding: "6px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                              {statusCard.btnLabel}
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                            </button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* View more orders — mobile only */}
                {!isDesktop && !showAll && filtered.length > MOBILE_SHOW_COUNT && (
                  <button onClick={() => setShowAll(true)} style={{ width: "100%", marginTop: 12, padding: "14px", background: "white", border: "1px solid #E0E0E0", borderRadius: 10, fontSize: 14, fontWeight: 600, color: "#333", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    View more orders
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile footer */}
        {!isDesktop && (
          <div style={{ background: "#1A1A2E", padding: "32px 20px 20px", marginTop: 8 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 6 }}>Livspace</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 20 }}>India's leading home interior platform</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
              {["About Us","Careers","Press","Partners","Privacy Policy","Terms of Use"].map(l => (
                <span key={l} style={{ fontSize: 11, color: "#AAA", cursor: "pointer" }}>{l}</span>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "#666", borderTop: "1px solid #333", paddingTop: 14 }}>© 2024 Livspace. All rights reserved.</div>
          </div>
        )}
      </div>

      {/* Mobile filters modal */}
      {!isDesktop && showFiltersModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, background: "rgba(0,0,0,0.5)" }} onClick={() => setShowFiltersModal(false)} />
          <div style={{ background: "white", borderRadius: "20px 20px 0 0", padding: "20px 20px 40px", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", flex: 1 }}>Filters</div>
              <button onClick={() => setShowFiltersModal(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            {filterGroups.map(group => (
              <div key={group.label} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", marginBottom: 10 }}>{group.label}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {group.items.map(item => (
                    <label key={item} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#444", background: "#F5F5F5", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>
                      <input type="checkbox" defaultChecked style={{ accentColor: tokens.primaryDefault, width: 13, height: 13 }} />
                      {item}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button style={{ flex: 1, padding: "12px 0", fontSize: 14, fontWeight: 600, color: tokens.primaryDefault, background: "white", border: `1.5px solid ${tokens.primaryDefault}`, borderRadius: 10, cursor: "pointer" }} onClick={() => setShowFiltersModal(false)}>Reset</button>
              <button style={{ flex: 1, padding: "12px 0", fontSize: 14, fontWeight: 600, color: "white", background: tokens.primaryDefault, border: "none", borderRadius: 10, cursor: "pointer" }} onClick={() => setShowFiltersModal(false)}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
