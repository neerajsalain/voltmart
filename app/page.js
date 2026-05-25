"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  ShoppingCart,
  Search,
  Zap,
  Star,
  Plus,
  Minus,
  Trash2,
  Truck,
  Shield,
  RotateCcw,
  CheckCircle2,
  Lightbulb,
  Fan,
  ToggleLeft,
  Cable,
  ShieldCheck,
  Wrench,
  Sparkles,
  ChevronRight,
  X,
  Menu,
  ArrowRight,
  Package,
  Bolt,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Twitter,
  Facebook,
  LogIn,
  UserCircle2,
  Tag,
  TrendingUp,
  Award,
  Flame,
} from "lucide-react";

const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");
const pct = (p, m) => Math.round(((m - p) / m) * 100);

const CAT_ICONS = {
  All: Sparkles,
  Lighting: Lightbulb,
  Fans: Fan,
  "Switches & Sockets": ToggleLeft,
  "Wires & Cables": Cable,
  "Circuit Protection": ShieldCheck,
  Tools: Wrench,
};

// Category hero images — using actual uploaded product images
const CAT_IMAGES = {
  Lighting: "/products/l1.webp",
  Fans: "/products/f1.webp",
  "Switches & Sockets": "/products/s1.webp",
  "Wires & Cables": "/products/w1.webp",
  "Circuit Protection": "/products/c1.webp",
  Tools: "/products/t1.webp",
};

const CAT_COLORS = {
  Lighting: {
    from: "#fef9c3",
    to: "#fde68a",
    accent: "#d97706",
    text: "#92400e",
  },
  Fans: { from: "#dbeafe", to: "#bfdbfe", accent: "#2563eb", text: "#1e3a8a" },
  "Switches & Sockets": {
    from: "#f3e8ff",
    to: "#e9d5ff",
    accent: "#7c3aed",
    text: "#4c1d95",
  },
  "Wires & Cables": {
    from: "#fce7f3",
    to: "#fbcfe8",
    accent: "#db2777",
    text: "#831843",
  },
  "Circuit Protection": {
    from: "#dcfce7",
    to: "#bbf7d0",
    accent: "#16a34a",
    text: "#14532d",
  },
  Tools: { from: "#ffedd5", to: "#fed7aa", accent: "#ea580c", text: "#7c2d12" },
};

/* ── Stars ── */
function Stars({ value, size = "sm" }) {
  const s = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${s} ${i <= Math.round(value) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

/* ── HEADER ── */
function Header({
  cartCount,
  onOpenCart,
  search,
  setSearch,
  onSearch,
  mobileMenuOpen,
  setMobileMenuOpen,
  user,
  onLogout,
}) {
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "glass shadow-sm border-b border-border" : "bg-white border-b border-border"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-3 sm:gap-4">
          <a href="#" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl volt-gradient grid place-items-center shadow-md shadow-orange-400/30 group-hover:scale-105 transition-transform">
              <Zap className="h-4.5 w-4.5 text-white" fill="white" size={18} />
            </div>
            <div className="hidden sm:block">
              <div
                className="font-bold text-lg leading-none tracking-tight"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                VoltMart
              </div>
              <div className="text-[10px] text-muted-foreground leading-none mt-0.5 tracking-wide uppercase">
                Electrical Store
              </div>
            </div>
            <div
              className="sm:hidden font-bold text-base"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              VoltMart
            </div>
          </a>

          <div className="flex-1 max-w-lg mx-auto hidden md:flex items-center relative">
            <Input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (onSearch(), inputRef.current?.blur())
              }
              placeholder="Search bulbs, fans, switches…"
              className="pl-10 pr-24 h-10 bg-muted/50 border-border focus-visible:ring-2 focus-visible:ring-amber-400 rounded-xl"
            />
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <button
              type="button"
              onClick={onSearch}
              className="absolute right-1 z-10 h-8 px-3 volt-gradient text-white border-0 rounded-lg text-xs font-semibold hover:opacity-90 cursor-pointer"
            >
              Search
            </button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 h-10 px-3 rounded-xl bg-muted/60 hover:bg-muted transition-colors">
                  <UserCircle2 size={18} className="text-amber-600" />
                  <span className="hidden sm:inline text-sm font-medium max-w-[80px] truncate">
                    {user.name}
                  </span>
                </button>
                <div className="absolute right-0 top-12 bg-white border border-border rounded-xl shadow-xl p-2 w-44 hidden group-hover:block z-50">
                  <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border mb-1 truncate">
                    {user.email}
                  </div>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted text-red-500 font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <a
                href="/login"
                className="flex items-center gap-2 h-10 px-3 rounded-xl bg-muted/60 hover:bg-muted transition-colors"
              >
                <LogIn size={18} />
                <span className="hidden sm:inline text-sm font-medium">
                  Login
                </span>
              </a>
            )}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 h-10 px-3 rounded-xl bg-muted/60 hover:bg-muted transition-colors group"
            >
              <ShoppingCart
                className="group-hover:text-amber-600 transition-colors"
                size={18}
              />
              <span className="hidden sm:inline text-sm font-medium">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 volt-gradient text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 px-1 grid place-items-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden h-10 w-10 rounded-xl bg-muted/60 hover:bg-muted grid place-items-center"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <div
          className={`md:hidden pb-3 ${mobileMenuOpen ? "block" : "hidden"}`}
        >
          <div className="relative flex items-center">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              placeholder="Search products…"
              className="pl-10 pr-24 h-10 bg-muted/50 border-border rounded-xl focus-visible:ring-2 focus-visible:ring-amber-400"
            />
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <button
              type="button"
              onClick={onSearch}
              className="absolute right-1 z-10 h-8 px-3 volt-gradient text-white border-0 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ── HERO ── */
/* ── HERO ── */
function Hero({ onShopNow }) {
  const HERO_CATEGORIES = [
    {
      label: "Lighting",
      stat: "10 products",
      headline: ["Power Up", "Your Home"],
      sub: "Premium LED lighting from Philips, Syska & Havells. Energy-saving. Up to 60% off.",
      cta: "Shop Lighting",
      bg: "linear-gradient(135deg, #1a0e00 0%, #2d1500 50%, #1a0a00 100%)",
      accent: "#f97316",
      shimmer: "rgba(249,115,22,0.18)",
      badge: "Monsoon Sale",
      badgeColor: "#f97316",
      // Use actual product images from the store
      images: [
        { src: "/products/l1.webp", label: "LED Bulb" },
        { src: "/products/l4.webp", label: "Tube Light" },
        { src: "/products/l8.webp", label: "Panel Light" },
        { src: "/products/l10.webp", label: "Flood Light" },
      ],
    },
    {
      label: "Fans",
      stat: "10 products",
      headline: ["Beat the", "Heat in Style"],
      sub: "BLDC fans that save 65% electricity. Remote-controlled, whisper-quiet motors.",
      cta: "Shop Fans",
      bg: "linear-gradient(135deg, #00101a 0%, #001a2d 50%, #000f1a 100%)",
      accent: "#38bdf8",
      shimmer: "rgba(56,189,248,0.15)",
      badge: "BLDC Technology",
      badgeColor: "#38bdf8",
      images: [
        { src: "/products/f1.webp", label: "Ceiling Fan" },
        { src: "/products/f2.webp", label: "BLDC Fan" },
        { src: "/products/f4.webp", label: "Table Fan" },
        { src: "/products/f6.webp", label: "Stealth Fan" },
      ],
    },
    {
      label: "Safety",
      stat: "30+ products",
      headline: ["Wire Safe,", "Live Safe"],
      sub: "ISI-certified copper wires, MCBs & circuit breakers from Polycab, Legrand & Havells.",
      cta: "Shop Wires & Protection",
      bg: "linear-gradient(135deg, #001a0a 0%, #002d15 50%, #001a0a 100%)",
      accent: "#4ade80",
      shimmer: "rgba(74,222,128,0.15)",
      badge: "ISI Certified",
      badgeColor: "#4ade80",
      images: [
        { src: "/products/w1.webp", label: "House Wire" },
        { src: "/products/w2.webp", label: "FR Wire" },
        { src: "/products/c1.webp", label: "MCB Pack" },
        { src: "/products/c4.webp", label: "DB Box" },
      ],
    },
  ];

  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setPrev(active);
      setActive((a) => (a + 1) % HERO_CATEGORIES.length);
      setAnimKey((k) => k + 1);
    }, 5500);
    return () => clearInterval(t);
  }, [active]);

  const goTo = (i) => {
    if (i === active) return;
    setPrev(active);
    setActive(i);
    setAnimKey((k) => k + 1);
  };

  const s = HERO_CATEGORIES[active];

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: s.bg,
        minHeight: 540,
        transition: "background 1s ease",
      }}
    >
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px",
        }}
      />

      {/* Accent glow */}
      <div
        className="absolute pointer-events-none transition-all duration-1000"
        style={{
          top: "-20%",
          right: "-8%",
          width: "50%",
          height: "140%",
          borderRadius: "50%",
          filter: "blur(80px)",
          background: `radial-gradient(circle, ${s.shimmer} 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-30%",
          left: "-5%",
          width: "35%",
          height: "80%",
          borderRadius: "50%",
          filter: "blur(60px)",
          background: `radial-gradient(circle, ${s.shimmer} 0%, transparent 70%)`,
        }}
      />

      <div className="max-w-7xl mx-auto relative" style={{ padding: "0" }}>
        <div className="flex flex-col lg:flex-row min-h-[540px]">
          {/* ── LEFT PANEL — text ── */}
          <div
            className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-12 lg:py-0"
            key={`left-${animKey}`}
            style={{
              animation: "heroSlideIn 0.6s cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            {/* Badge */}
            <div className="flex items-center gap-2 mb-6">
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full"
                style={{
                  background: `${s.accent}22`,
                  border: `1px solid ${s.accent}44`,
                  color: s.accent,
                }}
              >
                <Bolt size={10} fill={s.accent} /> {s.badge}
              </span>
              <span className="text-slate-600 text-xs font-medium">
                Up to 60% off today
              </span>
            </div>

            {/* Headline — large editorial */}
            <h1
              style={{
                fontFamily: "Syne, sans-serif",
                lineHeight: 1.0,
                letterSpacing: "-0.02em",
                marginBottom: "1.25rem",
              }}
            >
              {s.headline.map((line, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: "clamp(2.8rem, 6vw, 4.6rem)",
                    fontWeight: 800,
                  }}
                >
                  {i === 0 ? (
                    <span className="text-white">{line}</span>
                  ) : (
                    <span
                      style={{
                        background: `linear-gradient(95deg, ${s.accent} 0%, #fbbf24 100%)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {line}
                    </span>
                  )}
                </div>
              ))}
            </h1>

            <p
              className="text-slate-400 leading-relaxed mb-8 max-w-sm"
              style={{ fontSize: "1rem" }}
            >
              {s.sub}
            </p>

            {/* CTA row */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <button
                onClick={onShopNow}
                className="inline-flex items-center gap-2 font-bold text-sm text-white px-6 py-3.5 rounded-2xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  background: `linear-gradient(135deg, ${s.accent}, #fbbf24)`,
                  boxShadow: `0 6px 24px ${s.shimmer}`,
                }}
              >
                {s.cta} <ArrowRight size={14} />
              </button>
              <button
                onClick={onShopNow}
                className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3.5 rounded-2xl transition-all border hover:scale-[1.02]"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  borderColor: "rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                View Deals
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-5">
              {[
                { icon: Truck, text: "Free delivery", sub: "above ₹499" },
                {
                  icon: ShieldCheck,
                  text: "ISI Genuine",
                  sub: "certified brands",
                },
                { icon: RotateCcw, text: "7-day returns", sub: "easy policy" },
              ].map(({ icon: Icon, text, sub }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon size={14} style={{ color: s.accent, opacity: 0.85 }} />
                  <div>
                    <div className="text-xs font-semibold text-white leading-tight">
                      {text}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#64748b",
                        lineHeight: "1.2",
                      }}
                    >
                      {sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT PANEL — hero illustration ── */}
          <div
            className="lg:w-[52%] relative flex items-stretch overflow-hidden"
            style={{ minHeight: 380 }}
          >
            {/* Gradient edge bleed from left */}
            <div
              className="absolute inset-y-0 left-0 w-20 pointer-events-none z-10"
              style={{
                background: `linear-gradient(to right, ${s.bg.match(/#[0-9a-f]{6}/i)?.[0] || "#0a0a0f"}, transparent)`,
              }}
            />

            {/* Hero SVG illustration */}
            <div
              className="w-full flex items-center justify-center relative"
              key={`grid-${animKey}`}
              style={{
                animation: "heroGridIn 0.7s cubic-bezier(0.22,1,0.36,1) both",
                padding: "12px 16px 12px 8px",
              }}
            >
              <img
                src="/hero-banner.svg"
                alt="VoltMart — Premium Electrical Products"
                className="w-full h-full object-contain"
                style={{
                  maxHeight: 460,
                  filter: `drop-shadow(0 0 40px ${s.shimmer})`,
                }}
              />
              {/* Accent tint overlay to match current category color */}
              <div
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  background: `radial-gradient(ellipse at 60% 40%, ${s.shimmer} 0%, transparent 65%)`,
                  mixBlendMode: "screen",
                }}
              />
            </div>

            {/* Floating stat pill */}
            <div
              className="absolute bottom-6 right-6 z-20 flex items-center gap-3 px-4 py-2.5 rounded-2xl shadow-2xl"
              style={{
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="w-9 h-9 rounded-xl grid place-items-center volt-gradient shrink-0">
                <Package size={16} className="text-white" />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "9px",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "#94a3b8",
                    fontWeight: 600,
                  }}
                >
                  in stock now
                </div>
                <div
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: "13px",
                    fontWeight: 800,
                    color: "#1e293b",
                  }}
                >
                  60+ Products
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Slide selector tabs ── */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center lg:justify-start lg:left-10 pb-5 gap-2 z-20">
          {HERO_CATEGORIES.map((cat, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300"
              style={
                i === active
                  ? {
                      background: `${s.accent}22`,
                      border: `1.5px solid ${s.accent}55`,
                      color: s.accent,
                    }
                  : {
                      background: "rgba(255,255,255,0.05)",
                      border: "1.5px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.45)",
                    }
              }
            >
              {i === active && (
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: s.accent,
                    boxShadow: `0 0 6px ${s.accent}`,
                  }}
                />
              )}
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── PROMO STRIP ── */
function PromoStrip() {
  const items = [
    { icon: Truck, text: "Free delivery above ₹499" },
    { icon: Shield, text: "ISI certified products" },
    { icon: Tag, text: "Up to 60% off today" },
    { icon: RotateCcw, text: "7-day easy returns" },
    { icon: Award, text: "Top brands only" },
    { icon: Phone, text: "24×7 support" },
  ];
  return (
    <div className="bg-[#0d0d12] text-slate-300 overflow-hidden">
      <div className="flex items-center animate-marquee whitespace-nowrap py-2.5">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 mx-8 text-xs font-medium shrink-0"
          >
            <item.icon size={13} className="text-amber-400" />
            {item.text}
            <span className="text-amber-500/40 ml-8">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── CATEGORY SHOWCASE ── */
function CategoryShowcase({ categories, onSelect }) {
  const cats = categories.filter((c) => c !== "All");
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-end justify-between mb-7">
        <div>
          <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">
            Browse
          </p>
          <h2
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Shop by Category
          </h2>
        </div>
        <button
          onClick={() => onSelect("All")}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          View all <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {cats.map((cat) => {
          const Icon = CAT_ICONS[cat] || Sparkles;
          const img = CAT_IMAGES[cat];
          const col = CAT_COLORS[cat] || {
            from: "#f3f4f6",
            to: "#e5e7eb",
            accent: "#374151",
            text: "#111827",
          };
          return (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className="group relative overflow-hidden rounded-2xl border border-border hover:border-amber-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-100 text-left"
              style={{
                background: `linear-gradient(135deg, ${col.from}, ${col.to})`,
              }}
            >
              <div className="p-4 pb-2">
                <div
                  className="w-10 h-10 rounded-xl grid place-items-center mb-3 shadow-sm"
                  style={{
                    background: col.accent + "22",
                    border: `1px solid ${col.accent}33`,
                  }}
                >
                  <Icon size={18} style={{ color: col.accent }} />
                </div>
                <div
                  className="font-bold text-sm leading-tight"
                  style={{ color: col.text }}
                >
                  {cat}
                </div>
              </div>
              <div className="px-4 pb-3">
                <div
                  className="text-[10px] font-semibold flex items-center gap-1"
                  style={{ color: col.accent }}
                >
                  Shop now <ChevronRight size={10} />
                </div>
              </div>
              {/* Product thumbnail at bottom right */}
              {img && (
                <div className="absolute bottom-0 right-0 w-16 h-16 overflow-hidden rounded-tl-2xl opacity-60 group-hover:opacity-90 transition-opacity">
                  <img
                    src={img}
                    alt={cat}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ── DEALS BANNER ── */
function DealsBanner({ products, onAdd, onView }) {
  const deals = products
    .filter((p) => p.tags?.includes("deal") || p.tags?.includes("bestseller"))
    .slice(0, 4);
  if (deals.length === 0) return null;
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0d0d12 0%, #1c1022 50%, #0d1a12 100%)",
        }}
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-400/30">
              <Flame size={13} className="text-red-400" />
              <span className="text-red-300 text-xs font-bold tracking-wide uppercase">
                Hot Deals
              </span>
            </div>
            <p className="text-slate-400 text-sm">Limited time offers</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {deals.map((product) => {
              const discount = pct(product.price, product.mrp);
              return (
                <div
                  key={product.id}
                  className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/30 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
                  onClick={() => onView(product)}
                >
                  <div className="relative aspect-square overflow-hidden bg-white/5">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {discount}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="text-[10px] text-amber-400/80 font-semibold uppercase">
                      {product.brand}
                    </div>
                    <div className="text-white text-xs font-semibold mt-0.5 line-clamp-2 leading-snug min-h-[2rem]">
                      {product.name}
                    </div>
                    <div className="flex items-baseline gap-1.5 mt-2">
                      <span
                        className="text-amber-400 font-bold text-sm"
                        style={{ fontFamily: "Syne, sans-serif" }}
                      >
                        {fmt(product.price)}
                      </span>
                      {discount > 0 && (
                        <span className="text-slate-500 text-[10px] line-through">
                          {fmt(product.mrp)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAdd(product);
                      }}
                      className="w-full mt-2.5 h-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus size={12} /> Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── CATEGORY BAR (sticky) ── */
function CategoryBar({ categories, active, setActive }) {
  const scrollRef = useRef(null);
  return (
    <div className="bg-white border-b border-border sticky top-16 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={scrollRef}
          className="flex gap-1 overflow-x-auto no-scrollbar py-2.5"
        >
          {categories.map((cat) => {
            const Icon = CAT_ICONS[cat] || Sparkles;
            const isActive = active === cat;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "volt-gradient text-white shadow-md shadow-orange-400/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <Icon
                  size={15}
                  className={isActive ? "text-white" : "text-amber-500"}
                />
                <span className="whitespace-nowrap">{cat}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── PRODUCT CARD ── */
function ProductCard({ product, onAdd, onView, index }) {
  const discount = pct(product.price, product.mrp);
  return (
    <div
      className="animate-fade-up"
      style={{
        animationDelay: `${Math.min(index * 40, 300)}ms`,
        animationFillMode: "both",
      }}
    >
      <div className="group overflow-hidden rounded-2xl border border-border card-hover bg-white cursor-pointer flex flex-col h-full">
        {/* Image */}
        <div
          className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100"
          style={{ aspectRatio: "1/1" }}
          onClick={() => onView(product)}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Badges */}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {discount}% OFF
            </span>
          )}
          {product.tags?.includes("bestseller") && (
            <span className="absolute top-2 right-2 volt-gradient text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              Bestseller
            </span>
          )}
          {product.tags?.includes("new") &&
            !product.tags?.includes("bestseller") && (
              <span className="absolute top-2 right-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                New
              </span>
            )}
          {product.tags?.includes("deal") &&
            !product.tags?.includes("bestseller") &&
            !product.tags?.includes("new") && (
              <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Deal
              </span>
            )}
        </div>

        <div className="p-3 sm:p-4 flex flex-col flex-1">
          <div className="text-[11px] text-amber-600 font-bold uppercase tracking-wider">
            {product.brand}
          </div>
          <h3
            className="font-semibold text-sm mt-1 line-clamp-2 min-h-[2.5rem] leading-snug hover:text-amber-600 transition-colors cursor-pointer"
            onClick={() => onView(product)}
          >
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-2">
            <Stars value={product.rating} />
            <span className="text-[11px] text-muted-foreground">
              ({product.reviews.toLocaleString("en-IN")})
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span
              className="text-base font-bold"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              {fmt(product.price)}
            </span>
            {discount > 0 && (
              <span className="text-xs text-muted-foreground line-through">
                {fmt(product.mrp)}
              </span>
            )}
          </div>
          <button
            onClick={() => onAdd(product)}
            className="w-full mt-auto pt-3 h-9 rounded-xl bg-foreground text-background text-sm font-semibold flex items-center justify-center gap-1.5 hover:volt-gradient hover:text-white hover:shadow-md hover:shadow-orange-400/20 transition-all duration-200"
          >
            <Plus size={14} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── PRODUCT DETAIL DIALOG ── */
function ProductDetailDialog({ product, open, onOpenChange, onAdd }) {
  if (!product) return null;
  const discount = pct(product.price, product.mrp);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl">
        <div className="grid sm:grid-cols-2">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 aspect-square">
            {/* Exact matching product image */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-5 sm:p-6 overflow-y-auto max-h-[80vh] styled-scroll flex flex-col gap-3">
            <div className="text-xs font-bold text-amber-600 uppercase tracking-widest">
              {product.brand} · {product.category}
            </div>
            <DialogHeader>
              <DialogTitle className="text-lg leading-snug text-left">
                {product.name}
              </DialogTitle>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <Stars value={product.rating} size="md" />
              <span className="text-sm text-muted-foreground">
                {product.rating} · {product.reviews.toLocaleString("en-IN")}{" "}
                reviews
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span
                className="text-2xl font-extrabold"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                {fmt(product.price)}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-sm text-muted-foreground line-through">
                    {fmt(product.mrp)}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {discount}% off
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
            {product.features?.length > 0 && (
              <div>
                <div className="text-sm font-semibold mb-2">Key Features</div>
                <ul className="space-y-1.5">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2
                        size={15}
                        className="text-emerald-500 mt-0.5 shrink-0"
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-auto pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onAdd(product);
                  onOpenChange(false);
                }}
                className="w-full h-11 rounded-xl volt-gradient text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md shadow-orange-400/25"
              >
                <ShoppingCart size={16} /> Add to Cart
              </button>
              <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Truck size={12} className="text-amber-500" /> Free delivery
                </div>
                <div className="flex items-center gap-1">
                  <Shield size={12} className="text-amber-500" /> 100% genuine
                </div>
                <div className="flex items-center gap-1">
                  <RotateCcw size={12} className="text-amber-500" /> 7-day
                  returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── CART SHEET ── */
function CartSheet({
  open,
  onOpenChange,
  cart,
  updateQty,
  removeItem,
  onCheckout,
}) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 499 || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
        {/* Header */}
        <SheetHeader className="px-5 py-4 border-b border-border bg-white">
          <SheetTitle
            className="flex items-center gap-2 font-bold"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            <ShoppingCart size={18} className="text-amber-600" />
            Your Cart
            {cart.length > 0 && (
              <span className="ml-auto text-xs font-normal text-muted-foreground">
                {cart.length} {cart.length === 1 ? "item" : "items"}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Items */}
        <div className="flex-1 overflow-y-auto styled-scroll px-4 py-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-muted grid place-items-center">
                <ShoppingCart size={32} className="text-muted-foreground/30" />
              </div>
              <div>
                <p className="font-semibold">Your cart is empty</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Add items to get started
                </p>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="px-5 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-2xl border border-border bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Product image — matched exactly */}
                  <div
                    className="shrink-0 w-18 h-18 rounded-xl overflow-hidden bg-slate-50 border border-border"
                    style={{ width: 72, height: 72 }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/products/l1.webp";
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Brand + name */}
                    <div className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">
                      {item.brand}
                    </div>
                    <div className="text-sm font-semibold leading-snug line-clamp-2 mt-0.5">
                      {item.name}
                    </div>
                    {/* Unit price */}
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {fmt(item.price)} each
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Qty controls */}
                      <div className="flex items-center border border-border rounded-lg overflow-hidden bg-muted/20">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="h-7 w-7 grid place-items-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="text-sm font-bold w-7 text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="h-7 w-7 grid place-items-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                      {/* Line total */}
                      <span
                        className="font-bold text-sm"
                        style={{ fontFamily: "Syne, sans-serif" }}
                      >
                        {fmt(item.price * item.qty)}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-red-500 transition-colors mt-0.5 shrink-0 p-1 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-border px-5 py-4 bg-white space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>
                  Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)
                </span>
                <span className="text-foreground font-medium">
                  {fmt(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span
                  className={
                    shipping === 0
                      ? "text-emerald-600 font-semibold"
                      : "text-foreground font-medium"
                  }
                >
                  {shipping === 0 ? "FREE ✓" : fmt(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-100 px-3 py-2 rounded-xl flex items-center gap-1.5">
                  <Truck size={11} /> Add {fmt(500 - subtotal)} more for free
                  shipping
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span
                  className="text-amber-600"
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  {fmt(total)}
                </span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="w-full h-12 rounded-xl volt-gradient text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-orange-400/25 text-sm"
            >
              <ShoppingCart size={15} /> Proceed to Checkout{" "}
              <ArrowRight size={14} />
            </button>

            <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield size={10} className="text-amber-500" /> Secure payment
              </span>
              <span className="flex items-center gap-1">
                <RotateCcw size={10} className="text-amber-500" /> 7-day returns
              </span>
              <span className="flex items-center gap-1">
                <Truck size={10} className="text-amber-500" /> Fast delivery
              </span>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* ── FIELD ── */
function Field({ label, required, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
    </div>
  );
}

/* ── CHECKOUT DIALOG ── */
function CheckoutDialog({ open, onOpenChange, cart, onPlaced }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [placing, setPlacing] = useState(false);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 499 ? 0 : 49;
  const total = subtotal + shipping;
  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.address || !form.pincode) {
      toast.error("Please fill all required fields");
      return;
    }
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((i) => ({
            id: i.id,
            name: i.name,
            qty: i.qty,
            price: i.price,
          })),
          customer: form,
          total,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onPlaced(data);
        onOpenChange(false);
      } else toast.error(data.error || "Order failed");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "Syne, sans-serif" }}>
            Complete Your Order
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full Name" required>
              <Input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="h-10 rounded-xl"
                placeholder="Rahul Sharma"
              />
            </Field>
            <Field label="Phone" required>
              <Input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="h-10 rounded-xl"
                placeholder="9876543210"
              />
            </Field>
          </div>
          <Field label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className="h-10 rounded-xl"
              placeholder="rahul@example.com"
            />
          </Field>
          <Field label="Address" required>
            <Input
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              className="h-10 rounded-xl"
              placeholder="House no, Street, Area"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City">
              <Input
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                className="h-10 rounded-xl"
                placeholder="Mumbai"
              />
            </Field>
            <Field label="Pincode" required>
              <Input
                value={form.pincode}
                onChange={(e) => set("pincode", e.target.value)}
                className="h-10 rounded-xl"
                placeholder="400001"
              />
            </Field>
          </div>

          {/* Order summary with product images */}
          <div className="bg-muted/40 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
              Order Summary
            </div>
            <div className="space-y-2 max-h-36 overflow-y-auto styled-scroll">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-2.5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover shrink-0 border border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Qty: {item.qty}
                    </div>
                  </div>
                  <div className="text-xs font-bold shrink-0">
                    {fmt(item.price * item.qty)}
                  </div>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex justify-between text-sm font-bold">
              <span>Total</span>
              <span style={{ fontFamily: "Syne, sans-serif" }}>
                {fmt(total)}
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Shield size={12} className="text-amber-500" /> Cash on Delivery ·
            Secure checkout
          </p>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <button
            onClick={handleSubmit}
            disabled={placing}
            className="flex-1 h-10 rounded-xl volt-gradient text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60"
          >
            {placing ? (
              <>
                <span className="animate-spin w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />{" "}
                Placing…
              </>
            ) : (
              <>
                <CheckCircle2 size={15} /> Place Order
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── ORDER CONFIRMATION ── */
function OrderConfirmation({ order, onClose }) {
  if (!order) return null;
  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-2xl text-center">
        <div className="py-4 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 grid place-items-center">
            <CheckCircle2 size={36} className="text-emerald-500" />
          </div>
          <div>
            <DialogTitle
              className="text-2xl"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Order Confirmed!
            </DialogTitle>
            <p className="text-muted-foreground text-sm mt-1">
              Thanks for shopping with VoltMart 🎉
            </p>
          </div>
          <div className="w-full bg-muted/50 rounded-xl p-4 text-sm text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono font-semibold">
                {order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span
                className="font-bold"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                {fmt(order.total)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items</span>
              <span>{order.items.length}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Expected delivery in 3–5 business days
          </p>
          <button
            onClick={onClose}
            className="w-full h-11 rounded-xl volt-gradient text-white font-semibold hover:opacity-90"
          >
            Continue Shopping
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── SKELETON ── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <div className="aspect-square skeleton-shimmer" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-16 skeleton-shimmer rounded" />
        <div className="h-4 skeleton-shimmer rounded" />
        <div className="h-4 w-3/4 skeleton-shimmer rounded" />
        <div className="h-8 mt-3 skeleton-shimmer rounded-xl" />
      </div>
    </div>
  );
}

/* ── FOOTER ── */
function Footer() {
  return (
    <footer className="bg-[#0d0d12] text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl volt-gradient grid place-items-center">
                <Zap size={16} className="text-white" fill="white" />
              </div>
              <span
                className="font-extrabold text-white text-lg"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                VoltMart
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-[18rem]">
              Your trusted partner for premium electrical items. Quality
              products, fast delivery.
            </p>
            <div className="flex gap-3 mt-5">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-lg bg-white/8 hover:bg-amber-500/20 hover:text-amber-400 transition-colors grid place-items-center text-slate-400"
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">
              Shop
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {[
                "Lighting",
                "Fans",
                "Switches",
                "Wires & Cables",
                "Circuit Protection",
                "Tools",
              ].map((item) => (
                <li key={item}>
                  <button
                    className="hover:text-amber-400 transition-colors text-left"
                    onClick={() =>
                      document
                        .getElementById("shop")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">
              Support
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {[
                "Contact Us",
                "FAQs",
                "Returns Policy",
                "Shipping Info",
                "Track Order",
              ].map((item) => (
                <li key={item}>
                  <span className="hover:text-amber-400 transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <Mail size={14} className="mt-0.5 text-amber-500 shrink-0" />{" "}
                neerajsalain05@gmail.com
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={14} className="mt-0.5 text-amber-500 shrink-0" />{" "}
                9901018360
              </li>
            </ul>
          </div>
        </div>
        <Separator className="my-8 bg-white/10" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>© 2025 VoltMart. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <Shield size={12} className="text-amber-500" />
            <span>100% Secure Payments · ISI Certified Products</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── APP ROOT ── */
export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem("voltmart_user");
      if (s) setUser(JSON.parse(s));
    } catch {}
  }, []);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
    try {
      const s = localStorage.getItem("voltmart_cart");
      if (s) setCart(JSON.parse(s));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("voltmart_cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products],
  );

  const filtered = useMemo(() => {
    const q = activeSearch.toLowerCase();
    return products.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !p.brand.toLowerCase().includes(q) &&
        !p.category.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [products, category, activeSearch]);

  const addToCart = useCallback((product) => {
    const u = (() => {
      try {
        const s = localStorage.getItem("voltmart_user");
        return s ? JSON.parse(s) : null;
      } catch {
        return null;
      }
    })();
    if (!u) {
      toast.error("Please login to add items to cart");
      setTimeout(() => {
        window.location.href = "/login?redirect=/";
      }, 1200);
      return;
    }
    // Store FULL product image path so cart always shows correct image
    setCart((prev) => {
      const found = prev.find((i) => i.id === product.id);
      if (found)
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i,
        );
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          brand: product.brand,
          image: product.image, // exact image path from product data
          price: product.price,
          qty: 1,
        },
      ];
    });
    toast.success("Added to cart", { description: product.name });
  }, []);

  const updateQty = useCallback((id, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  }, []);

  const removeItem = useCallback(
    (id) => setCart((prev) => prev.filter((i) => i.id !== id)),
    [],
  );
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const handleSearch = useCallback(() => {
    setActiveSearch(search);
    setMobileMenuOpen(false);
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  }, [search]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setActiveSearch("");
    setSearch("");
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  };

  const openCheckout = () => {
    const u = (() => {
      try {
        const s = localStorage.getItem("voltmart_user");
        return s ? JSON.parse(s) : null;
      } catch {
        return null;
      }
    })();
    if (!u) {
      setCartOpen(false);
      toast.error("Please login to place an order");
      setTimeout(() => {
        window.location.href = "/login?redirect=/";
      }, 1200);
      return;
    }
    setCartOpen(false);
    setTimeout(() => setCheckoutOpen(true), 300);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        search={search}
        setSearch={setSearch}
        onSearch={handleSearch}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        user={user}
        onLogout={() => {
          localStorage.removeItem("voltmart_user");
          setUser(null);
        }}
      />

      {/* Hero with auto-sliding product photos */}
      <Hero
        onShopNow={() =>
          document
            .getElementById("shop")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      />

      {/* Scrolling promo strip */}
      <PromoStrip />

      {/* Category showcase with product thumbnails */}
      <CategoryShowcase
        categories={categories}
        onSelect={handleCategoryChange}
      />

      {/* Hot deals section */}
      <DealsBanner
        products={products}
        onAdd={addToCart}
        onView={setDetailProduct}
      />

      {/* Main shop section */}
      <div id="shop">
        <CategoryBar
          categories={categories}
          active={category}
          setActive={handleCategoryChange}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-end justify-between mb-6 gap-4">
            <div>
              <h2
                className="text-2xl sm:text-3xl font-extrabold tracking-tight"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                {activeSearch
                  ? `Results for "${activeSearch}"`
                  : category === "All"
                    ? "All Products"
                    : category}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {loading
                  ? "Loading…"
                  : `${filtered.length} product${filtered.length !== 1 ? "s" : ""} available`}
              </p>
            </div>
            {(activeSearch || category !== "All") && !loading && (
              <button
                onClick={() => {
                  setCategory("All");
                  setActiveSearch("");
                  setSearch("");
                }}
                className="shrink-0 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground rounded-xl px-3 py-1.5 border border-border hover:bg-muted transition-colors"
              >
                <X size={14} /> Clear
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-muted grid place-items-center">
                <Search size={32} className="text-muted-foreground/30" />
              </div>
              <div>
                <p className="font-semibold">No products found</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Try a different search or category
                </p>
              </div>
              <button
                onClick={() => {
                  setCategory("All");
                  setActiveSearch("");
                  setSearch("");
                }}
                className="px-5 py-2 rounded-xl border border-border text-sm hover:bg-muted transition-colors"
              >
                Show all products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAdd={addToCart}
                  onView={setDetailProduct}
                  index={i}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />

      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        cart={cart}
        updateQty={updateQty}
        removeItem={removeItem}
        onCheckout={openCheckout}
      />
      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        cart={cart}
        onPlaced={(order) => {
          setConfirmedOrder(order);
          setCart([]);
        }}
      />
      <OrderConfirmation
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
      />
      <ProductDetailDialog
        product={detailProduct}
        open={!!detailProduct}
        onOpenChange={(o) => !o && setDetailProduct(null)}
        onAdd={addToCart}
      />
    </div>
  );
}
