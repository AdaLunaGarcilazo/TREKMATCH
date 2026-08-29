import React, { useEffect, useState } from "react";
import {
  Mountain, Menu, X, Star, ShieldCheck, MapPin, Clock, Users,
  CreditCard, CheckCircle2, ChevronRight, ChevronLeft, Camera,
  Phone, Mail, Award, Heart,
  AlertCircle, Eye, EyeOff, Backpack, Droplet, Thermometer,
  Lock, HelpCircle, Compass, Tent, Footprints, Snowflake,
  ClipboardCheck, UserCircle2, ArrowRight, Plus, Minus,
  LayoutDashboard, Settings, LogOut, ClipboardList, Inbox,
  BadgeCheck, XCircle, PenSquare, ShieldAlert
} from "lucide-react";

/* ============================= DESIGN TOKENS =============================
   Colors sampled directly from the original TrekMatch screens so every new
   page matches exactly instead of approximating the palette.
============================================================================ */
const C = {
  forest: "#243307",       // near-black green — header/footer/primary text-on-light buttons
  forestSoft: "#2f4310",
  olive: "#4a5c14",        // mid olive — section backgrounds, secondary tags
  oliveLight: "#5c7018",
  mustard: "#FED346",      // mustard yellow — feature card backgrounds
  amber: "#F5A623",        // amber — primary CTAs, badges
  amberDeep: "#D9891A",
  cream: "#FAF8F5",        // page background
  brown: "#673903",        // rustic brown — login hero background
  sage: "#D9E0C8",         // checkout card background
  sageDeep: "#c3cdaa",
  terracotta: "#733D00",   // confirmation page background
  white: "#FFFFFF",
  ink: "#20290f",
  inkSoft: "#5b6b3f",
  line: "#e3ddcc",
  danger: "#7a2e0a",
  dangerBg: "#f6c9b0",
};

const FONTS = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600..800&family=Manrope:wght@400;500;600;700;800&display=swap');
    .tm-display { font-family: 'Fraunces', serif; letter-spacing: -0.01em; }
    .tm-body { font-family: 'Manrope', sans-serif; }
    .tm-focus:focus-visible { outline: 3px solid ${C.amber}; outline-offset: 2px; }
    @media (prefers-reduced-motion: reduce) {
      * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
    }
  `}</style>
);

const uid = (base) =>
  `${base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Date.now().toString(36).slice(-4)}`;

const initialsOf = (name) =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || "").join("") || "??";

/* ============================= MOCK DATA ============================= */

const INITIAL_EXPEDITIONS = [
  {
    id: "lanin", guideId: "carlos", status: "approved",
    name: "Ascenso al Volcán Lanín", zone: "Patagonia", duration: "3D / 2N",
    difficulty: "Alta", tags: ["Refugio + Carpa"], price: 150000,
    meetingPoint: "Terminal de San Martín de los Andes — 08:00 hs.",
    food: "Viandas de marcha e hidratación incluidas.",
    guide: { name: "Carlos Gómez", rating: 4.9, reviews: 121, initials: "CG" },
    description: "Una expedición mítica que te llevará a la cumbre de este coloso de la cordillera. Disfrutá de vistas espectaculares con logística médica y técnica garantizada.",
    itinerary: [
      { day: "Día 1", detail: "Traslado a base de volcán, aclimatación y charla de seguridad." },
      { day: "Día 2", detail: "Ascenso a refugio de altura, entrenamiento de crampones y piolet." },
      { day: "Día 3", detail: "Cumbre al amanecer y descenso completo hasta el punto de encuentro." },
    ],
    equipment: ["Crampones", "Piolet", "Botas de doble capa", "Casco", "Bolsa de dormir -10°C", "Bastones de trekking"],
    mountains: "peak",
  },
  {
    id: "fitzroy", guideId: "lucia", status: "approved",
    name: "Trekking El Chaltén & Fitz Roy", zone: "Patagonia", duration: "2D / 1N",
    difficulty: "Media", tags: ["Hostel"], price: 95000,
    meetingPoint: "Oficina TrekMatch El Chaltén — 07:30 hs.",
    food: "Desayuno y viandas de marcha incluidas.",
    guide: { name: "Lucía Torres", rating: 5.0, reviews: 89, initials: "LT" },
    description: "Una travesía espectacular que recorre los pies del imponente Fitz Roy hasta llegar a la deslumbrante Laguna de los Tres. Alojamiento confortable incluido.",
    itinerary: [
      { day: "Día 1", detail: "Sendero hasta Laguna Capri y campamento base con vistas al macizo." },
      { day: "Día 2", detail: "Ascenso final a Laguna de los Tres y regreso a El Chaltén." },
    ],
    equipment: ["Botas de trekking", "Campera impermeable", "Botella térmica", "Protector solar", "Bastones de trekking"],
    mountains: "twin",
  },
  {
    id: "tronador", guideId: "milena", status: "approved",
    name: "Glaciares del Monte Tronador", zone: "Patagonia", duration: "4D / 3N",
    difficulty: "Alta", tags: ["Refugio"], price: 210000,
    meetingPoint: "Terminal de Bariloche — 07:00 hs.",
    food: "Pensión completa en refugio de montaña.",
    guide: { name: "Milena Rossi", rating: 5.0, reviews: 189, initials: "MR" },
    description: "Cuatro días recorriendo senderos de bosque andino patagónico hasta los ventisqueros del Tronador, con travesía sobre hielo asistida por guías de alta montaña.",
    itinerary: [
      { day: "Día 1", detail: "Ingreso a Parque Nacional Nahuel Huapi y caminata a refugio Otto Meiling." },
      { day: "Día 2", detail: "Travesía de glaciar con arnés y técnica de cuerdas." },
      { day: "Día 3", detail: "Circuito de miradores de ventisqueros y noche en refugio." },
      { day: "Día 4", detail: "Descenso completo hasta el punto de encuentro." },
    ],
    equipment: ["Arnés", "Crampones", "Casco", "Guantes técnicos", "Bolsa de dormir -15°C", "Gafas de glaciar"],
    mountains: "glacier",
  },
  {
    id: "chalten2", guideId: "tomas", status: "approved",
    name: "Circuito Huemul & Lagunas", zone: "Cuyo", duration: "1D",
    difficulty: "Baja", tags: ["Sin pernocte"], price: 42000,
    meetingPoint: "Plaza central de San Martín de los Andes — 08:30 hs.",
    food: "Almuerzo tipo trail incluido.",
    guide: { name: "Tomás Benítez", rating: 4.9, reviews: 96, initials: "TB" },
    description: "Salida de día completo ideal para iniciarse en el trekking de montaña, con miradores de lagunas andinas y ritmo pensado para todo nivel.",
    itinerary: [{ day: "Día único", detail: "Circuito de 14km con paradas fotográficas y almuerzo junto a la laguna." }],
    equipment: ["Calzado de trekking", "Mochila de día", "Repelente", "Agua 2L"],
    mountains: "hill",
  },
];

const INITIAL_GUIDES = [
  {
    id: "carlos", status: "approved", name: "Carlos Gómez", rating: 4.9, reviews: 142, initials: "CG",
    zone: "San Martín de los Andes", specialty: "Escalada invernal y contención psicológica en climas extremos.",
    certs: ["AAGM Nivel III", "Primeros Auxilios en Montaña", "Rescate en Glaciar"], years: 12,
    bio: "Guía de alta montaña especializado en ascensos técnicos y volcanes activos. Prioriza el ritmo del grupo por sobre el cronograma.",
  },
  {
    id: "milena", status: "approved", name: "Milena Rossi", rating: 5.0, reviews: 189, initials: "MR",
    zone: "Bariloche", specialty: "Escalada invernal y contención psicológica en climas extremos.",
    certs: ["AAGM Nivel III", "Guía de Glaciar UIAGM", "RCP Avanzado"], years: 15,
    bio: "Formada en travesías de hielo patagónico. Reconocida por su comunicación clara antes y durante cada ascenso.",
  },
  {
    id: "tomas", status: "approved", name: "Tomás Benítez", rating: 4.9, reviews: 96, initials: "TB",
    zone: "San Martín de los Andes", specialty: "Especialista en escalada invernal y contención psicológica en climas extremos.",
    certs: ["AAGM Nivel II", "Primeros Auxilios en Montaña"], years: 7,
    bio: "Ideal para caminantes que se inician en la montaña: paciente, didáctico y muy atento a las señales del grupo.",
  },
  {
    id: "lucia", status: "approved", name: "Lucía Torres", rating: 5.0, reviews: 89, initials: "LT",
    zone: "El Chaltén", specialty: "Interpretación de fauna y trekking de resistencia en autonomía.",
    certs: ["AAGM Nivel II", "Guía de Parques Nacionales"], years: 6,
    bio: "Vive en El Chaltén desde hace seis años. Conoce cada variante de clima del macizo Fitz Roy mejor que nadie.",
  },
];

/* ============================= SMALL PRIMITIVES ============================= */

function StarRating({ value, size = 14, showValue = true }) {
  return (
    <span className="inline-flex items-center gap-1">
      <Star size={size} fill={C.amber} color={C.amber} />
      {showValue && <span className="tm-body font-semibold" style={{ color: C.ink }}>{value.toFixed(1)}</span>}
    </span>
  );
}

function Tag({ children, tone = "dark" }) {
  const styles =
    tone === "dark" ? { background: C.forest, color: C.mustard } :
    tone === "light" ? { background: C.white, color: C.forest } :
    { background: C.oliveLight, color: C.white };
  return <span className="tm-body text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full" style={styles}>{children}</span>;
}

function StatusPill({ status }) {
  const map = {
    approved: { bg: C.mustard, color: C.forest, label: "Aprobada", icon: BadgeCheck },
    pending: { bg: "#fde3b8", color: C.amberDeep, label: "En revisión", icon: ClipboardList },
    rejected: { bg: C.dangerBg, color: C.danger, label: "Rechazada", icon: XCircle },
  };
  const s = map[status] || map.pending;
  const Icon = s.icon;
  return (
    <span className="tm-body text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1" style={{ background: s.bg, color: s.color }}>
      <Icon size={12} /> {s.label}
    </span>
  );
}

function PrimaryButton({ children, onClick, full, type = "button", icon: Icon, disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`tm-focus tm-body font-bold rounded-xl px-6 py-3.5 transition-transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 ${full ? "w-full" : ""}`}
      style={{ background: C.forest, color: C.mustard, opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
    >
      {children}
      {Icon && <Icon size={18} />}
    </button>
  );
}

function SecondaryButton({ children, onClick, full, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className={`tm-focus tm-body font-bold rounded-xl px-6 py-3.5 border-2 transition-colors flex items-center justify-center gap-2 ${full ? "w-full" : ""}`}
      style={{ borderColor: C.forest, color: C.forest, background: "transparent" }}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}

function MountainScene({ variant = "peak", className = "" }) {
  const peaks = {
    peak: [{ d: "M0,220 L110,60 L180,140 L260,30 L340,150 L420,90 L500,220 Z", fill: C.oliveLight }, { d: "M-20,220 L70,120 L150,190 L230,90 L320,220 Z", fill: C.forest }],
    twin: [{ d: "M0,220 L90,50 L140,110 L200,30 L260,110 L320,50 L410,220 Z", fill: C.oliveLight }, { d: "M-20,220 L60,150 L130,200 L210,130 L300,200 L370,150 L420,220 Z", fill: C.forest }],
    glacier: [{ d: "M0,220 L100,80 L160,150 L240,40 L300,150 L380,70 L460,220 Z", fill: "#dbe6ea" }, { d: "M-20,220 L80,140 L160,200 L250,110 L340,200 L420,220 Z", fill: C.forest }],
    hill: [{ d: "M0,220 L120,120 L220,180 L340,100 L460,220 Z", fill: C.oliveLight }, { d: "M-20,220 L100,170 L220,220 Z", fill: C.forest }],
  };
  const set = peaks[variant] || peaks.peak;
  return (
    <svg viewBox="0 0 460 220" className={className} preserveAspectRatio="xMidYMax slice" role="presentation">
      <circle cx="380" cy="55" r="26" fill={C.amber} opacity="0.85" />
      {set.map((p, i) => <path key={i} d={p.d} fill={p.fill} />)}
    </svg>
  );
}

function DifficultyTag({ level }) {
  const map = { Baja: { bg: C.white, color: C.forest }, Media: { bg: C.forest, color: C.mustard }, Alta: { bg: "#5a2a0f", color: "#ffd9b3" } };
  const s = map[level] || map.Media;
  const label = level === "Baja" ? "Dificultad Baja" : level === "Media" ? "Dificultad Moderada" : "Dificultad Exigente";
  return <span className="tm-body text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>{label}</span>;
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="tm-body text-sm font-bold block mb-1.5" style={{ color: C.ink }}>{label}</span>
      {children}
      {hint && <span className="tm-body text-xs block mt-1" style={{ color: C.inkSoft }}>{hint}</span>}
    </label>
  );
}

const inputStyle = { borderColor: C.line, color: C.ink };
const trackEvent = (eventName, parameters) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, parameters);
  }
};

/* ============================= HEADERS ============================= */

function Header({ page, go }) {
  const [open, setOpen] = useState(false);
  const links = [
    { id: "landing", label: "Inicio" }, { id: "expeditions", label: "Travesías" },
    { id: "guides", label: "Guías" }, { id: "medical", label: "Ficha Médica" },
  ];
  return (
    <header className="w-full bg-white border-b sticky top-0 z-40" style={{ borderColor: C.line }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <button onClick={() => go("landing")} className="tm-focus flex items-center gap-2 rounded-lg">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.forest }}><Mountain size={18} color={C.mustard} /></span>
          <span className="tm-display text-lg font-bold" style={{ color: C.forest }}>TrekMatch</span>
        </button>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <button key={l.id} onClick={() => go(l.id)} className="tm-focus tm-body text-sm font-semibold pb-1 border-b-2 rounded-sm"
              style={{ color: page === l.id ? C.amberDeep : C.forest, borderColor: page === l.id ? C.amberDeep : "transparent" }}>
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => go("portal")} className="tm-focus tm-body text-xs font-semibold underline" style={{ color: C.inkSoft }}>
            Acceso Guías / Admin
          </button>
          <button onClick={() => go("login")} className="tm-focus tm-body text-sm font-bold rounded-lg px-5 py-2.5 border-2" style={{ borderColor: C.forest, color: C.forest }}>
            Iniciar Sesión
          </button>
        </div>

        <button className="md:hidden tm-focus" onClick={() => setOpen(!open)} aria-label="Abrir menú">
          {open ? <X size={24} color={C.forest} /> : <Menu size={24} color={C.forest} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t px-5 py-4 flex flex-col gap-3 bg-white" style={{ borderColor: C.line }}>
          {links.map((l) => (
            <button key={l.id} onClick={() => { go(l.id); setOpen(false); }} className="tm-focus tm-body text-left text-sm font-semibold py-1" style={{ color: page === l.id ? C.amberDeep : C.forest }}>
              {l.label}
            </button>
          ))}
          <button onClick={() => { go("portal"); setOpen(false); }} className="tm-focus tm-body text-left text-sm font-semibold py-1 underline" style={{ color: C.inkSoft }}>
            Acceso Guías / Admin
          </button>
          <button onClick={() => { go("login"); setOpen(false); }} className="tm-focus tm-body text-sm font-bold rounded-lg px-5 py-2.5 border-2 mt-1" style={{ borderColor: C.forest, color: C.forest }}>
            Iniciar Sesión
          </button>
        </div>
      )}
    </header>
  );
}

function MiniHeader({ go }) {
  return (
    <header className="w-full bg-white border-b" style={{ borderColor: C.line }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <button onClick={() => go("landing")} className="tm-focus flex items-center gap-2 rounded-lg">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.forest }}><Mountain size={18} color={C.mustard} /></span>
          <div className="text-left leading-tight">
            <div className="tm-display text-base font-bold" style={{ color: C.forest }}>TrekMatch</div>
            <div className="tm-body text-[10px] font-bold uppercase tracking-wide" style={{ color: C.amberDeep }}>Guías Registrados</div>
          </div>
        </button>
        <div className="flex items-center gap-5">
          <span className="hidden sm:flex items-center gap-1.5 tm-body text-sm font-semibold" style={{ color: C.forest }}><Lock size={14} /> Pago 100% Seguro</span>
          <button className="tm-focus tm-body text-sm font-semibold flex items-center gap-1" style={{ color: C.forest }}><HelpCircle size={16} /> Ayuda</button>
        </div>
      </div>
    </header>
  );
}

/* Shared header for the Guide Portal and Admin Panel — visually distinct so
   it's always obvious you've left the public traveler-facing site. */
function RoleHeader({ role, go, onExit, guideName }) {
  const isGuide = role === "guide";
  const links = isGuide
    ? [{ id: "guide-dashboard", label: "Panel", icon: LayoutDashboard }]
    : [{ id: "admin-dashboard", label: "Moderación", icon: ShieldAlert }];
  return (
    <header className="w-full sticky top-0 z-40" style={{ background: C.forest }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.mustard }}><Mountain size={18} color={C.forest} /></span>
          <div className="leading-tight">
            <div className="tm-display text-base font-bold text-white">TrekMatch</div>
            <div className="tm-body text-[10px] font-bold uppercase tracking-wide" style={{ color: C.mustard }}>
              {isGuide ? `Modo Guía${guideName ? " · " + guideName : ""}` : "Modo Administrador"}
            </div>
          </div>
        </div>
        <nav className="flex items-center gap-5">
          {links.map((l) => (
            <button key={l.id} onClick={() => go(l.id)} className="tm-focus tm-body text-sm font-semibold text-white/90 hover:text-white flex items-center gap-1.5">
              <l.icon size={15} /> <span className="hidden sm:inline">{l.label}</span>
            </button>
          ))}
          <button onClick={onExit} className="tm-focus tm-body text-sm font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.1)", color: C.mustard }}>
            <LogOut size={15} /> <span className="hidden sm:inline">Salir</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ background: C.forest }} className="text-white">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10"><Mountain size={18} color={C.mustard} /></span>
            <span className="tm-display font-bold">TrekMatch</span>
          </div>
          <p className="tm-body text-sm opacity-75 leading-relaxed">
            La plataforma líder de reservas de trekking en la Patagonia Argentina. Conectando caminantes entusiastas con profesionales de montaña certificados bajo estrictas normas de seguridad y empatía humana.
          </p>
        </div>
        <div>
          <h4 className="tm-body text-xs font-bold uppercase tracking-wide mb-4 opacity-80">Explorar</h4>
          <ul className="tm-body text-sm space-y-2.5 opacity-90"><li>El Chaltén</li><li>Bariloche</li><li>Ushuaia</li><li>San Martín de los Andes</li></ul>
        </div>
        <div>
          <h4 className="tm-body text-xs font-bold uppercase tracking-wide mb-4 opacity-80">Comunidad</h4>
          <ul className="tm-body text-sm space-y-2.5 opacity-90"><li>Nuestros Guías</li><li>Testimonios</li><li>Seguridad Médica</li><li>Blog de Montaña</li></ul>
        </div>
        <div>
          <h4 className="tm-body text-xs font-bold uppercase tracking-wide mb-4 opacity-80">Contacto</h4>
          <ul className="tm-body text-sm space-y-2.5 opacity-90">
            <li className="flex items-center gap-2"><Mail size={14} /> info@trekmatch.com.ar</li>
            <li className="flex items-center gap-2"><Phone size={14} /> +54 (294) 445-9821</li>
            <li>San Carlos de Bariloche, Río Negro, Argentina.</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="tm-body text-xs opacity-70">© 2026 TrekMatch. Todos los derechos reservados. Miembro adherente de la AAGM.</p>
          <div className="flex items-center gap-3">
            {[Camera, Users, Heart].map((Icon, i) => <span key={i} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><Icon size={15} /></span>)}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================= LANDING ============================= */

function LandingPage({ go, guides }) {
  const approvedGuides = guides.filter((g) => g.status === "approved").slice(0, 3);
  return (
    <div>
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${C.forest} 0%, ${C.forestSoft} 100%)` }}>
        <div className="max-w-6xl mx-auto px-5 md:px-8 pt-16 pb-0 relative z-10">
          <div className="max-w-xl">
            <span className="tm-body text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: C.mustard, color: C.forest }}>Temporada 2026</span>
            <h1 className="tm-display text-4xl md:text-5xl font-bold text-white mt-4 leading-[1.05]">Descubrí y reservá travesías de trekking con guías certificados</h1>
            <p className="tm-body text-white/80 mt-4 text-base leading-relaxed">Experiencias de montaña adaptadas a tu nivel con confiabilidad, seguridad y contención humana constante.</p>
            <div className="mt-7"><PrimaryButton onClick={() => go("expeditions")} icon={ArrowRight}>Explorar Expediciones</PrimaryButton></div>
          </div>
        </div>
        <div className="mt-10"><MountainScene variant="glacier" className="w-full h-40 md:h-56" /></div>
      </section>

      <section className="max-w-6xl mx-auto px-5 md:px-8 py-16 grid md:grid-cols-[1fr_1.4fr] gap-6">
        <div className="rounded-2xl p-7 border-2" style={{ background: C.mustard, borderColor: C.amberDeep }}>
          <span className="tm-body text-xs font-bold uppercase tracking-wide" style={{ color: C.amberDeep }}>Seguridad Empática</span>
          <h2 className="tm-display text-2xl font-bold mt-2 mb-3" style={{ color: C.forest }}>Guías evaluados por la comunidad</h2>
          <p className="tm-body text-sm leading-relaxed" style={{ color: C.ink }}>No solo medimos la capacidad técnica; valoramos la empatía, el manejo de grupo y la contención en el sendero. Caminá con profesionales que entienden tus tiempos y priorizan tu bienestar integral.</p>
          <div className="flex gap-6 mt-6 mb-6">
            <div><div className="tm-display text-2xl font-bold" style={{ color: C.forest }}>100%</div><div className="tm-body text-xs" style={{ color: C.inkSoft }}>Guías registrados en AAGM</div></div>
            <div><div className="tm-display text-2xl font-bold" style={{ color: C.forest }}>4.9★</div><div className="tm-body text-xs" style={{ color: C.inkSoft }}>Calificación promedio</div></div>
          </div>
          <button onClick={() => go("guides")} className="tm-focus tm-body font-bold text-sm rounded-lg px-5 py-2.5 flex items-center gap-1.5" style={{ background: C.forest, color: C.mustard }}>
            Ver perfil y reseñas de guías <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {approvedGuides.map((g) => (
            <button key={g.id} onClick={() => go("guides")} className="tm-focus text-left bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border" style={{ borderColor: C.line }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center tm-display font-bold text-white shrink-0" style={{ background: C.oliveLight }}>{g.initials}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="tm-display font-bold" style={{ color: C.ink }}>{g.name}</span>
                  <Tag>Certificado AAGM</Tag>
                </div>
                <div className="flex items-center gap-2 mt-1"><StarRating value={g.rating} /><span className="tm-body text-xs" style={{ color: C.inkSoft }}>· {g.reviews} guiados</span></div>
                <p className="tm-body text-sm mt-1 truncate" style={{ color: C.inkSoft }}>{g.specialty}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section style={{ background: C.olive }} className="py-16">
        <div className="max-w-6xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-10 items-center">
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4"><ShieldCheck size={18} color={C.forest} /><span className="tm-display font-bold" style={{ color: C.forest }}>Ficha Médica Digital</span></div>
            <div className="space-y-3">
              {[{ icon: Droplet, label: "Grupo Sanguíneo", value: "O Positivo (O+)" }, { icon: AlertCircle, label: "Alergias Conocidas", value: "Ninguna declarada" }, { icon: Phone, label: "Contacto de Emergencia", value: "Elena Rossi (Hermana) · +54 9 11 5543-…" }].map((row, i) => (
                <div key={i} className="rounded-xl p-4 flex items-center gap-3" style={{ background: C.amber }}>
                  <row.icon size={18} color={C.forest} />
                  <div><div className="tm-body text-[10px] font-bold uppercase tracking-wide" style={{ color: C.forest }}>{row.label}</div><div className="tm-body text-sm font-semibold" style={{ color: C.forest }}>{row.value}</div></div>
                </div>
              ))}
            </div>
            <p className="tm-body text-xs mt-4 flex items-center gap-1.5" style={{ color: C.inkSoft }}><Lock size={12} /> Tus datos están encriptados y solo serán visibles por tu guía elegido.</p>
          </div>
          <div>
            <span className="tm-body text-xs font-bold uppercase tracking-widest" style={{ color: C.mustard }}>Pre-Viaje Inteligente</span>
            <h2 className="tm-display text-3xl font-bold text-white mt-2 mb-4">Tu salud y seguridad son prioridad</h2>
            <p className="tm-body text-white/85 leading-relaxed mb-5">Completá tu ficha médica digital una sola vez y usala para todas tus expediciones. Nuestro sistema integra los requisitos preventivos de la Asociación Argentina de Guías de Montaña para que solo te preocupes por disfrutar del sendero.</p>
            <ul className="space-y-2 mb-6">
              {["Declaración jurada digital compatible con Parques Nacionales", "Actualización instantánea antes de cada salida", "Acceso offline para guías en zonas sin señal celular"].map((t, i) => (
                <li key={i} className="tm-body text-sm text-white flex items-start gap-2"><CheckCircle2 size={16} color={C.mustard} className="mt-0.5 shrink-0" /> {t}</li>
              ))}
            </ul>
            <button onClick={() => go("medical")} className="tm-focus tm-body font-bold text-sm rounded-lg px-5 py-3 flex items-center gap-2" style={{ background: C.forest, color: C.mustard }}>
              Cargar mi Ficha Médica <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================= LOGIN (traveler) ============================= */

function LoginPage({ go, setLoggedIn }) {
  const [showPw, setShowPw] = useState(false);
  return (
    <div style={{ background: C.brown }} className="min-h-[calc(100vh-64px)] py-16">
      <div className="max-w-4xl mx-auto px-5">
        <div className="rounded-3xl overflow-hidden grid md:grid-cols-2" style={{ background: C.amber }}>
          <div className="p-8 md:p-10">
            <h1 className="tm-display text-3xl font-bold mb-2" style={{ color: C.forest }}>Ingresá a TrekMatch</h1>
            <p className="tm-body text-sm mb-6" style={{ color: "#5a3d0a" }}>Gestioná tus reservas y fichas médicas en un solo lugar.</p>
            <form onSubmit={(e) => {
  e.preventDefault();
  trackEvent("sign_up", { method: "Formulario" });
  setLoggedIn(true);
  go("landing"); className="space-y-4">
              <div>
                <label className="tm-body text-sm font-bold block mb-1.5" style={{ color: C.forest }}>Correo electrónico</label>
                <input type="email" placeholder="ejemplo@correo.com" className="tm-focus tm-body w-full rounded-lg px-4 py-3 border-0" style={{ background: "#fff6e2", color: C.forest }} />
              </div>
              <div>
                <label className="tm-body text-sm font-bold block mb-1.5" style={{ color: C.forest }}>Contraseña</label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} placeholder="Ingresá tu contraseña" className="tm-focus tm-body w-full rounded-lg px-4 py-3 pr-11 border-0" style={{ background: "#fff6e2", color: C.forest }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="tm-focus absolute right-3 top-1/2 -translate-y-1/2" aria-label="Mostrar contraseña">
                    {showPw ? <EyeOff size={18} color={C.forest} /> : <Eye size={18} color={C.forest} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="tm-focus tm-body font-bold w-full rounded-lg py-3.5 mt-2" style={{ background: C.forest, color: C.mustard }}>Iniciar Sesión</button>
              <button type="button" onClick={() => { setLoggedIn(true); go("landing"); }} className="tm-focus tm-body text-sm font-semibold underline block mx-auto" style={{ color: C.forest }}>Continuar como invitado</button>
            </form>
            <button onClick={() => go("portal")} className="tm-focus tm-body text-xs font-semibold underline block mt-6" style={{ color: "#5a3d0a" }}>¿Sos guía o administrador? Ingresá acá</button>
          </div>
          <div className="hidden md:flex relative p-6 items-end" style={{ background: `linear-gradient(180deg, ${C.forestSoft}, #0d1806)` }}>
            <MountainScene variant="peak" className="absolute inset-0 w-full h-full opacity-80" />
            <p className="relative tm-display text-white text-lg font-semibold leading-snug">
              "Caminar por la montaña no es solo entrenar, es encontrarse en cada paso."
              <span className="block tm-body text-xs font-normal opacity-70 mt-2">— Refugio Frey, Bariloche</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================= EXPEDITIONS LIST ============================= */

function ExpeditionsPage({ go, setSelectedId, expeditions }) {
  const [difficulty, setDifficulty] = useState("Media");
  const [duration, setDuration] = useState("1-3");
  const [zone, setZone] = useState("Patagonia");

  const filtered = expeditions.filter((e) => {
    if (e.status !== "approved") return false;
    const durOk = duration === "1-3" ? !e.duration.startsWith("4") : e.duration.startsWith("4");
    return e.zone === zone && durOk;
  });

  return (
    <div style={{ background: C.cream }} className="min-h-[calc(100vh-64px)]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-12">
        <span className="tm-body text-xs font-bold uppercase tracking-widest" style={{ color: C.amberDeep }}>Temporada 2026</span>
        <h1 className="tm-display text-4xl font-bold mt-2 mb-2" style={{ color: C.ink }}>Explorá Travesías de Trekking</h1>
        <p className="tm-body mb-7" style={{ color: C.inkSoft }}>Reservá experiencias de montaña certificadas con la seguridad y el respaldo médico de la AAGM.</p>

        <div className="rounded-2xl p-6 mb-9 grid sm:grid-cols-3 gap-6" style={{ background: C.amber }}>
          <FilterGroup label="Dificultad" options={["Baja", "Media", "Alta"]} value={difficulty} onChange={setDifficulty} />
          <FilterGroup label="Duración" options={[{ v: "1-3", l: "1-3 días" }, { v: "4+", l: "+4 días" }]} value={duration} onChange={setDuration} />
          <FilterGroup label="Zona" options={["Patagonia", "Cuyo", "Norte"]} value={zone} onChange={setZone} />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border-2 border-dashed" style={{ borderColor: C.line }}>
            <Compass size={32} className="mx-auto mb-3" color={C.inkSoft} />
            <p className="tm-body font-semibold" style={{ color: C.ink }}>No hay travesías con estos filtros todavía.</p>
            <p className="tm-body text-sm" style={{ color: C.inkSoft }}>Probá otra zona o duración — sumamos salidas cada semana.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-7">
            {filtered.map((exp) => (
              <div key={exp.id} className="rounded-2xl overflow-hidden border" style={{ background: C.mustard, borderColor: "#e0b93a" }}>
                <button onClick={() => { setSelectedId(exp.id); go("detail"); }} className="tm-focus w-full text-left">
                  <div style={{ background: C.forest }}><MountainScene variant={exp.mountains} className="w-full h-40" /></div>
                </button>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Tag tone="light">{exp.duration}</Tag>
                    <DifficultyTag level={exp.difficulty} />
                    {exp.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                  </div>
                  <button onClick={() => { setSelectedId(exp.id); go("detail"); }} className="tm-focus text-left"><h3 className="tm-display text-xl font-bold mb-1.5" style={{ color: C.ink }}>{exp.name}</h3></button>
                  <p className="tm-body text-sm mb-4 leading-relaxed" style={{ color: C.inkSoft }}>{exp.description}</p>
                  <div className="rounded-xl p-3.5 flex items-center justify-between mb-4" style={{ background: "#e0b93a" }}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center tm-display font-bold text-white text-sm" style={{ background: C.oliveLight }}>{exp.guide.initials}</div>
                      <div><div className="tm-body text-[10px] font-bold uppercase tracking-wide" style={{ color: C.forest }}>Guía Asignado</div><div className="tm-body text-sm font-bold" style={{ color: C.forest }}>{exp.guide.name}</div></div>
                    </div>
                    <StarRating value={exp.guide.rating} />
                  </div>
                  <div className="flex items-end justify-between mb-4">
                    <div><div className="tm-body text-xs" style={{ color: C.inkSoft }}>Precio por persona</div><div className="tm-display text-2xl font-bold" style={{ color: C.ink }}>${exp.price.toLocaleString("es-AR")} ARS</div></div>
                    <div className="tm-body text-xs" style={{ color: C.inkSoft }}>Incluye fee del 5%</div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { setSelectedId(exp.id); go("checkout"); }} className="tm-focus tm-body font-bold flex-1 rounded-xl py-3" style={{ background: C.forest, color: C.mustard }}>Reservar / Sumar al Carrito</button>
                    <button onClick={() => { setSelectedId(exp.id); go("detail"); }} className="tm-focus tm-body font-bold rounded-xl py-3 px-4 border-2" style={{ borderColor: C.forest, color: C.forest }}>Ver Equipo</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }) {
  const norm = options.map((o) => (typeof o === "string" ? { v: o, l: o } : o));
  return (
    <div>
      <div className="tm-body text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.forest }}>{label}</div>
      <div className="flex gap-2 flex-wrap">
        {norm.map((o) => (
          <button key={o.v} onClick={() => onChange(o.v)} className="tm-focus tm-body text-sm font-bold px-4 py-1.5 rounded-full transition-colors"
            style={value === o.v ? { background: C.forest, color: C.mustard } : { background: C.white, color: C.forest }}>
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================= EXPEDITION DETAIL ============================= */

function ExpeditionDetailPage({ go, selectedId, setSelectedId, expeditions }) {
  const exp = expeditions.find((e) => e.id === selectedId) || expeditions[0];
  useEffect(() => {
  trackEvent("view_item", {
    item_name: exp.name,
  });
}, [exp.name]);
  return (
    <div style={{ background: C.cream }} className="min-h-[calc(100vh-64px)]">
      <div style={{ background: C.forest }}><MountainScene variant={exp.mountains} className="w-full h-56 md:h-72" /></div>
      <div className="max-w-5xl mx-auto px-5 md:px-8 -mt-10 relative z-10">
        <button onClick={() => go("expeditions")} className="tm-focus tm-body text-sm font-bold flex items-center gap-1 mb-4 bg-white rounded-full px-4 py-2 shadow-sm w-fit" style={{ color: C.forest }}>
          <ChevronLeft size={16} /> Volver a Travesías
        </button>
        <div className="grid md:grid-cols-[1.6fr_1fr] gap-8 pb-16">
          <div>
            <div className="flex flex-wrap gap-2 mb-3"><Tag tone="light">{exp.duration}</Tag><DifficultyTag level={exp.difficulty} /><Tag tone="olive">{exp.zone}</Tag></div>
            <h1 className="tm-display text-3xl md:text-4xl font-bold mb-3" style={{ color: C.ink }}>{exp.name}</h1>
            <p className="tm-body leading-relaxed mb-8" style={{ color: C.inkSoft }}>{exp.description}</p>
            <section className="mb-8">
              <h2 className="tm-display text-xl font-bold mb-4 flex items-center gap-2" style={{ color: C.ink }}><Footprints size={20} color={C.amberDeep} /> Itinerario</h2>
              <div className="space-y-3">
                {exp.itinerary.map((it, i) => (
                  <div key={i} className="rounded-xl p-4 bg-white border" style={{ borderColor: C.line }}>
                    <div className="tm-body text-xs font-bold uppercase tracking-wide mb-1" style={{ color: C.amberDeep }}>{it.day}</div>
                    <div className="tm-body text-sm" style={{ color: C.ink }}>{it.detail}</div>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="tm-display text-xl font-bold mb-4 flex items-center gap-2" style={{ color: C.ink }}><Backpack size={20} color={C.amberDeep} /> Equipo Requerido</h2>
              <div className="flex flex-wrap gap-2">
                {exp.equipment.map((item) => <span key={item} className="tm-body text-sm font-semibold px-4 py-2 rounded-full border" style={{ borderColor: C.line, color: C.ink, background: "white" }}>{item}</span>)}
              </div>
            </section>
          </div>
          <aside className="space-y-4">
            <div className="rounded-2xl p-6 bg-white border shadow-sm sticky top-20" style={{ borderColor: C.line }}>
              <div className="flex items-center gap-3 pb-4 mb-4 border-b" style={{ borderColor: C.line }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center tm-display font-bold text-white" style={{ background: C.oliveLight }}>{exp.guide.initials}</div>
                <div><div className="tm-body font-bold text-sm" style={{ color: C.ink }}>{exp.guide.name}</div><div className="flex items-center gap-1"><StarRating value={exp.guide.rating} size={12} /><span className="tm-body text-xs" style={{ color: C.inkSoft }}>({exp.guide.reviews})</span></div></div>
              </div>
              <div className="space-y-3 mb-5 tm-body text-sm" style={{ color: C.inkSoft }}>
                <div className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0" color={C.amberDeep} /> {exp.meetingPoint}</div>
                <div className="flex items-start gap-2"><Clock size={16} className="mt-0.5 shrink-0" color={C.amberDeep} /> {exp.food}</div>
              </div>
              <div className="mb-5">
                <div className="tm-body text-xs" style={{ color: C.inkSoft }}>Precio por persona</div>
                <div className="tm-display text-3xl font-bold" style={{ color: C.ink }}>${exp.price.toLocaleString("es-AR")} ARS</div>
                <div className="tm-body text-xs" style={{ color: C.inkSoft }}>Incluye fee de gestión del 5%</div>
              </div>
              <PrimaryButton full onClick={() => { setSelectedId(exp.id); go("checkout"); }} icon={ArrowRight}>Reservar Ahora</PrimaryButton>
              <div className="tm-body text-xs mt-3 flex items-center gap-1.5 justify-center" style={{ color: C.inkSoft }}><ShieldCheck size={14} /> Cancelación gratuita hasta 15 días antes</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ============================= GUIDES (public directory) ============================= */

function GuidesPage({ guides }) {
  const [open, setOpen] = useState(null);
  const approved = guides.filter((g) => g.status === "approved");
  return (
    <div style={{ background: C.cream }} className="min-h-[calc(100vh-64px)]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-12">
        <span className="tm-body text-xs font-bold uppercase tracking-widest" style={{ color: C.amberDeep }}>Seguridad Empática</span>
        <h1 className="tm-display text-4xl font-bold mt-2 mb-2" style={{ color: C.ink }}>Nuestros Guías</h1>
        <p className="tm-body mb-9 max-w-2xl" style={{ color: C.inkSoft }}>Todos nuestros guías están certificados por la Asociación Argentina de Guías de Montaña (AAGM) y son evaluados por la comunidad en base a su técnica, empatía y manejo de grupo.</p>
        <div className="grid sm:grid-cols-2 gap-6">
          {approved.map((g) => {
            const isOpen = open === g.id;
            return (
              <div key={g.id} className="rounded-2xl bg-white border overflow-hidden" style={{ borderColor: C.line }}>
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center tm-display font-bold text-white text-lg shrink-0" style={{ background: C.oliveLight }}>{g.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap"><h3 className="tm-display text-lg font-bold" style={{ color: C.ink }}>{g.name}</h3><Tag>Certificado AAGM</Tag></div>
                      <div className="flex items-center gap-2 mt-1"><StarRating value={g.rating} /><span className="tm-body text-xs" style={{ color: C.inkSoft }}>· {g.reviews} guiados · {g.years} años de experiencia</span></div>
                      <div className="tm-body text-xs flex items-center gap-1 mt-1" style={{ color: C.inkSoft }}><MapPin size={12} /> {g.zone}</div>
                    </div>
                  </div>
                  <p className="tm-body text-sm mt-4 leading-relaxed" style={{ color: C.inkSoft }}>{g.specialty}</p>
                  <button onClick={() => setOpen(isOpen ? null : g.id)} className="tm-focus tm-body text-sm font-bold flex items-center gap-1 mt-4" style={{ color: C.amberDeep }}>
                    {isOpen ? "Ver menos" : "Ver certificaciones y perfil completo"} {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </button>
                  {isOpen && (
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: C.line }}>
                      <p className="tm-body text-sm mb-4 leading-relaxed" style={{ color: C.ink }}>{g.bio}</p>
                      <div className="flex flex-wrap gap-2">
                        {g.certs.map((c) => <span key={c} className="tm-body text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: C.mustard, color: C.forest }}><Award size={12} /> {c}</span>)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================= FICHA MÉDICA ============================= */

function MedicalFormPage({ go, medical, setMedical, setMedicalDone }) {
  const update = (field) => (e) => setMedical({ ...medical, [field]: e.target.value });
  const handleSubmit = (e) => {
  e.preventDefault();
// ------------------------------------------------------------------
    // 1. RASTREO GA4: Evento KR2 (Compleción de Ficha Médica Pre-Viaje)
    // ------------------------------------------------------------------
    const tieneAlergias = Boolean(medical.allergies && medical.allergies.trim().toLowerCase() !== "ninguna declarada" && medical.allergies.trim() !== "");
    const tieneCondiciones = Boolean(medical.conditions && medical.conditions.trim().toLowerCase() !== "ninguna" && medical.conditions.trim() !== "");

    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "submit_medical_form", {
        has_allergies: tieneAlergias,
        has_conditions: tieneCondiciones,
        blood_type: medical.bloodType || "No especificado"
      });
    }
    setMedicalDone(true);
    go("landing");
};
  return (
    <div style={{ background: C.cream }} className="min-h-[calc(100vh-64px)]">
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-12">
        <div className="flex items-center gap-2 mb-2"><ShieldCheck size={22} color={C.amberDeep} /><span className="tm-body text-xs font-bold uppercase tracking-widest" style={{ color: C.amberDeep }}>Pre-Viaje Inteligente</span></div>
        <h1 className="tm-display text-4xl font-bold mb-2" style={{ color: C.ink }}>Ficha Médica Digital</h1>
        <p className="tm-body mb-9 max-w-xl" style={{ color: C.inkSoft }}>Completala una sola vez y valé para todas tus expediciones. Es un requisito obligatorio de la AAGM antes de confirmar cualquier travesía.</p>
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white border p-7 md:p-9 space-y-7" style={{ borderColor: C.line }}>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Nombre completo"><input required value={medical.name} onChange={update("name")} placeholder="Santiago M. Rojo" className="tm-focus tm-body w-full rounded-lg px-4 py-3 border" style={inputStyle} /></Field>
            <Field label="Grupo sanguíneo">
              <select required value={medical.bloodType} onChange={update("bloodType")} className="tm-focus tm-body w-full rounded-lg px-4 py-3 border" style={inputStyle}>
                <option value="">Seleccioná una opción</option>
                {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Alergias conocidas" hint="Escribí 'Ninguna declarada' si no tenés."><textarea value={medical.allergies} onChange={update("allergies")} rows={2} placeholder="Ej: penicilina, picaduras de abeja..." className="tm-focus tm-body w-full rounded-lg px-4 py-3 border resize-none" style={inputStyle} /></Field>
          <Field label="Condiciones médicas preexistentes" hint="Asma, cardiopatías, presión arterial, etc."><textarea value={medical.conditions} onChange={update("conditions")} rows={2} placeholder="Ej: ninguna" className="tm-focus tm-body w-full rounded-lg px-4 py-3 border resize-none" style={inputStyle} /></Field>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Contacto de emergencia"><input required value={medical.emergencyName} onChange={update("emergencyName")} placeholder="Nombre y relación" className="tm-focus tm-body w-full rounded-lg px-4 py-3 border" style={inputStyle} /></Field>
            <Field label="Teléfono de emergencia"><input required value={medical.emergencyPhone} onChange={update("emergencyPhone")} placeholder="+54 9 11 ...." className="tm-focus tm-body w-full rounded-lg px-4 py-3 border" style={inputStyle} /></Field>
          </div>
          <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: C.mustard }}>
            <input type="checkbox" required checked={medical.consent} onChange={(e) => setMedical({ ...medical, consent: e.target.checked })} className="tm-focus mt-1 w-4 h-4 shrink-0" />
            <p className="tm-body text-sm" style={{ color: C.forest }}>Declaro que la información brindada es verídica y autorizo a que sea compartida únicamente con el guía asignado a mi expedición, conforme al reglamento de la AAGM.</p>
          </div>
          <div className="flex items-center justify-between gap-4 pt-2">
            <p className="tm-body text-xs flex items-center gap-1.5" style={{ color: C.inkSoft }}><Lock size={12} /> Encriptado y visible solo para tu guía elegido.</p>
            <PrimaryButton type="submit" icon={CheckCircle2}>Guardar Ficha Médica</PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================= CHECKOUT ============================= */

function CheckoutPage({ go, selectedId, medicalDone, expeditions }) {
  const exp = expeditions.find((e) => e.id === selectedId) || expeditions[0];
  const fee = Math.round((exp.price * 0.05) / 1.05);
  const service = exp.price - fee;

  const handlePayment = () => {
    if (!medicalDone) return;
    // ------------------------------------------------------------------
    // RASTREO GA4: Evento KR3 (Purchase - Transacción Exitosa)
    // ------------------------------------------------------------------
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "purchase", {
        transaction_id: `TM-${exp.id.toUpperCase().slice(0, 5)}-${Date.now()}`,
        value: exp.price,
        currency: "ARS",
        items: [{
          item_id: exp.id,
          item_name: exp.name,
          price: exp.price,
          item_category: exp.zone,
          item_variant: exp.difficulty
        }]
      });
    }

    go("confirmation");
  };

  return (
    <div style={{ background: C.cream }} className="min-h-[calc(100vh-64px)]">
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-12">
        <h1 className="tm-display text-4xl font-bold mb-2" style={{ color: C.ink }}>Confirmá tu travesía</h1>
        <p className="tm-body mb-9" style={{ color: C.inkSoft }}>Completá la información requerida y realizá el pago para asegurar tu lugar junto a tu guía certificado.</p>
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="rounded-2xl p-7" style={{ background: C.sage }}>
            <h2 className="tm-display font-bold text-lg mb-5 flex items-center gap-2" style={{ color: C.forest }}><MapPin size={18} /> Resumen de tu Reserva</h2>
            <div style={{ background: C.forest }} className="rounded-xl overflow-hidden mb-5"><MountainScene variant={exp.mountains} className="w-full h-32" /></div>
            <div className="space-y-4">
              <SummaryRow label="Travesía seleccionada" full={exp.name} />
              <SummaryRow label="Punto de encuentro" full={exp.meetingPoint} />
              <SummaryRow label="Alimentación incluida" full={exp.food} />
            </div>
            <div className="mt-5 pt-5 border-t space-y-2" style={{ borderColor: C.sageDeep }}>
              <div className="tm-body text-xs font-bold uppercase tracking-wide mb-1" style={{ color: C.forest }}>Detalle de costos (ARS)</div>
              <div className="flex justify-between tm-body text-sm" style={{ color: "#3a4a1f" }}><span>Servicio de Guía Certificado</span><span>${service.toLocaleString("es-AR")} ARS</span></div>
              <div className="flex justify-between tm-body text-sm" style={{ color: "#3a4a1f" }}><span>Fee de Gestión TrekMatch (5%)</span><span>${fee.toLocaleString("es-AR")} ARS</span></div>
              <div className="flex justify-between tm-body font-bold pt-2 border-t" style={{ color: C.forest, borderColor: C.sageDeep }}><span>Total a Pagar</span><span>${exp.price.toLocaleString("es-AR")} ARS</span></div>
            </div>
          </div>
          <div>
            <div className="rounded-2xl p-7 mb-4" style={{ background: C.sage }}>
              <h2 className="tm-display font-bold text-lg mb-4" style={{ color: C.forest }}>Requisitos de Seguridad</h2>
              <div className="rounded-xl p-4 flex items-start gap-3 mb-6" style={{ background: medicalDone ? C.mustard : C.dangerBg }}>
                {medicalDone ? <CheckCircle2 size={20} color={C.forest} className="shrink-0 mt-0.5" /> : <AlertCircle size={20} color={C.danger} className="shrink-0 mt-0.5" />}
                <div>
                  <div className="tm-body text-sm font-bold" style={{ color: medicalDone ? C.forest : C.danger }}>{medicalDone ? "Ficha Médica completada" : "Ficha Médica pendiente"}</div>
                  <div className="tm-body text-xs" style={{ color: medicalDone ? C.forest : C.danger }}>Requisito obligatorio para participar con seguridad de cada expedición.</div>
                  {!medicalDone && <button onClick={() => go("medical")} className="tm-focus tm-body text-xs font-bold underline mt-1" style={{ color: C.danger }}>Completar ahora</button>}
                </div>
              </div>
              <h3 className="tm-display font-bold mb-4" style={{ color: C.forest }}>Datos de Pago</h3>
              <div className="space-y-4">
                <Field label="Número de tarjeta"><div className="relative"><input defaultValue="4540 •••• •••• 9820" className="tm-focus tm-body w-full rounded-lg px-4 py-3 pr-11" style={{ background: "#eef1e6", color: C.forest }} /><CreditCard size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2" color={C.amberDeep} /></div></Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Vencimiento"><input defaultValue="11 / 29" className="tm-focus tm-body w-full rounded-lg px-4 py-3" style={{ background: "#eef1e6", color: C.forest }} /></Field>
                  <Field label="CVC"><div className="relative"><input defaultValue="•••" className="tm-focus tm-body w-full rounded-lg px-4 py-3 pr-9" style={{ background: "#eef1e6", color: C.forest }} /><HelpCircle size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2" color={C.amberDeep} /></div></Field>
                </div>
                <Field label="Nombre del titular"><input defaultValue="SANTIAGO M. ROJO" className="tm-focus tm-body w-full rounded-lg px-4 py-3 uppercase" style={{ background: "#eef1e6", color: C.forest }} /></Field>
              </div>
              <button 
                onClick={handlePayment} 
                disabled={!medicalDone} 
                className="tm-focus tm-body font-bold w-full rounded-xl py-4 mt-6" 
                style={{ 
                  background: C.forest, 
                  color: C.mustard, 
                  opacity: medicalDone ? 1 : 0.5, 
                  cursor: medicalDone ? "pointer" : "not-allowed" 
                }}
              >
                Confirmar y Pagar ${exp.price.toLocaleString("es-AR")} ARS
              </button>
              <p className="tm-body text-xs text-center mt-3" style={{ color: "#3a4a1f" }}>Al proceder aceptás nuestros Términos de Servicio y Reglamento de Parques Nacionales.</p>
            </div>
            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: C.amber }}>
              <ShieldCheck size={20} color={C.forest} className="shrink-0 mt-0.5" />
              <div><div className="tm-body text-sm font-bold" style={{ color: C.forest }}>Cancelación Gratuita</div><div className="tm-body text-xs" style={{ color: C.forest }}>Cancelá hasta 15 días antes del inicio con devolución del 100%.</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================= CONFIRMATION ============================= */

function ConfirmationPage({ go, selectedId, expeditions }) {
  const exp = expeditions.find((e) => e.id === selectedId) || expeditions[0];
  const [rating, setRating] = useState(5);
  const [sent, setSent] = useState(false);
  const handleReviewSubmit = () => {
  // ------------------------------------------------------------------
  // RASTREO GA4: North Star Metric (Trip Completed con Rating)
  // ------------------------------------------------------------------
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "trip_completed", {
      expedition_id: exp.id,
      expedition_name: exp.name,
      guide_name: exp.guide?.name || "Desconocido",
      rating: rating // Valor numérico de 1 a 5
    });
  }

  setSent(true);
};
  return (
    <div style={{ background: C.terracotta }} className="min-h-[calc(100vh-64px)] py-14">
      <div className="max-w-2xl mx-auto px-5 text-center">
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center border-2 mb-6" style={{ borderColor: C.mustard }}><Mountain size={28} color={C.mustard} /></div>
        <h1 className="tm-display text-3xl md:text-4xl font-bold text-white mb-3">¡Reserva Confirmada! Nos vemos en la montaña.</h1>
        <p className="tm-body text-white/80 mb-9">Te enviamos los detalles del punto de encuentro y el contacto directo de tu guía a tu casilla de correo.</p>
        <div className="rounded-2xl p-5 grid grid-cols-2 divide-x mb-8" style={{ background: C.olive }}>
          <div className="text-left pr-4"><div className="tm-body text-xs uppercase tracking-wide opacity-70 text-white">Guía Asignado</div><div className="tm-body font-bold text-white">{exp.guide.name} (Guía de Montaña AAGM)</div></div>
          <div className="text-left pl-4" style={{ borderColor: "rgba(255,255,255,0.2)" }}><div className="tm-body text-xs uppercase tracking-wide opacity-70 text-white">Número de Reserva</div><div className="tm-body font-bold text-white">#TM-{exp.id.toUpperCase().slice(0, 5)}-{Math.floor(10000 + Math.random() * 89999)}</div></div>
        </div>
        <div className="rounded-2xl p-7 text-left" style={{ background: C.olive }}>
          {sent ? (
            <div className="text-center py-6"><CheckCircle2 size={32} color={C.mustard} className="mx-auto mb-3" /><p className="tm-display text-white font-bold text-lg">¡Gracias por tu reseña!</p><p className="tm-body text-white/70 text-sm mt-1">Ayuda a que otros montañistas elijan con seguridad.</p></div>
          ) : (
            <>
              <h2 className="tm-display text-white font-bold text-xl mb-2">¿Ya realizaste una travesía con nosotros?</h2>
              <p className="tm-body text-white/75 text-sm mb-5">Ayudá a la comunidad evaluando la empatía y contención de tu guía. Tu experiencia ayuda a que otros montañistas elijan con seguridad.</p>
              <div className="border-t pt-5" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
                <p className="tm-body text-white text-sm font-semibold mb-2">Calificá la experiencia general</p>
                <div className="flex items-center gap-2 mb-5">
                  {[1, 2, 3, 4, 5].map((n) => <button key={n} onClick={() => setRating(n)} className="tm-focus" aria-label={`${n} estrellas`}><Star size={26} fill={n <= rating ? C.mustard : "none"} color={C.mustard} /></button>)}
                  <span className="tm-body text-white text-sm font-semibold ml-1">Excelente ({rating}/5)</span>
                </div>
                <label className="tm-body text-white text-sm font-semibold block mb-2">Escribí tu reseña</label>
                <textarea rows={3} placeholder="Contanos qué tal te pareció el liderazgo del guía, el ritmo de marcha y la seguridad…" className="tm-focus tm-body w-full rounded-lg px-4 py-3 mb-4 border resize-none" style={{ background: C.olive, borderColor: "rgba(255,255,255,0.3)", color: "white" }} />
                <div className="flex gap-3">
                  <button className="tm-focus tm-body text-sm font-bold rounded-lg px-4 py-3 border flex items-center gap-2 text-white" style={{ borderColor: "rgba(255,255,255,0.4)" }}><Camera size={16} /> Subir Fotos de Montaña</button>
                  <button 
  onClick={handleReviewSubmit} 
  className="tm-focus tm-body text-sm font-bold rounded-lg px-4 py-3 flex-1" 
  style={{ background: C.forest, color: C.mustard }}
>
  Enviar Reseña
</button>
                </div>
              </div>
            </>
          )}
        </div>
        <button onClick={() => go("expeditions")} className="tm-focus tm-body text-sm mt-8 font-semibold" style={{ color: C.mustard }}>¿Buscás nuevos desafíos? <span className="underline">Explorar otras travesías activas →</span></button>
      </div>
    </div>
  );
}

/* ============================= PORTAL GATEWAY (guide / admin sign-in) ============================= */

function PortalGatewayPage({ go, guides, onEnterAsGuide, onEnterAsAdmin, onStartNewGuide }) {
  const [selectedGuideId, setSelectedGuideId] = useState(guides[0]?.id || "");
  return (
    <div style={{ background: C.forest }} className="min-h-[calc(100vh-64px)] py-16">
      <div className="max-w-3xl mx-auto px-5">
        <div className="text-center mb-10">
          <span className="tm-body text-xs font-bold uppercase tracking-widest" style={{ color: C.mustard }}>Acceso Interno</span>
          <h1 className="tm-display text-3xl md:text-4xl font-bold text-white mt-2">Panel de Guías y Administración</h1>
          <p className="tm-body text-white/70 mt-2">Este acceso es distinto al de viajeros — gestioná tu perfil, tus travesías o moderá el catálogo de TrekMatch.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="rounded-2xl p-7 bg-white">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: C.mustard }}><Compass size={20} color={C.forest} /></div>
            <h2 className="tm-display text-xl font-bold mb-1" style={{ color: C.ink }}>Soy Guía</h2>
            <p className="tm-body text-sm mb-5" style={{ color: C.inkSoft }}>Publicá y gestioná tus travesías, y mantené tu perfil al día.</p>

            <label className="tm-body text-xs font-bold uppercase tracking-wide block mb-1.5" style={{ color: C.inkSoft }}>Continuar como (demo)</label>
            <select value={selectedGuideId} onChange={(e) => setSelectedGuideId(e.target.value)} className="tm-focus tm-body w-full rounded-lg px-4 py-3 border mb-4" style={inputStyle}>
              {guides.map((g) => <option key={g.id} value={g.id}>{g.name} {g.status !== "approved" ? `(${g.status === "pending" ? "en revisión" : "rechazado"})` : ""}</option>)}
            </select>
            <PrimaryButton full onClick={() => onEnterAsGuide(selectedGuideId)} icon={ArrowRight}>Ingresar a mi Panel</PrimaryButton>
            <button onClick={onStartNewGuide} className="tm-focus tm-body text-sm font-semibold underline block mx-auto mt-4" style={{ color: C.forest }}>Registrarme como guía nuevo</button>
          </div>

          <div className="rounded-2xl p-7 bg-white">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: C.mustard }}><ShieldAlert size={20} color={C.forest} /></div>
            <h2 className="tm-display text-xl font-bold mb-1" style={{ color: C.ink }}>Soy Administrador</h2>
            <p className="tm-body text-sm mb-5" style={{ color: C.inkSoft }}>Revisá y moderá los perfiles de guías y las travesías antes de que se publiquen.</p>
            <div className="rounded-xl p-4 mb-5 tm-body text-sm flex items-center gap-2" style={{ background: C.cream, color: C.inkSoft }}>
              <ClipboardList size={16} color={C.amberDeep} /> {guides.filter(g=>g.status==="pending").length + INITIAL_EXPEDITIONS.length - INITIAL_EXPEDITIONS.length} elementos esperan revisión
            </div>
            <PrimaryButton full onClick={onEnterAsAdmin} icon={ArrowRight}>Ingresar como Administrador</PrimaryButton>
          </div>
        </div>

        <button onClick={() => go("landing")} className="tm-focus tm-body text-sm text-white/70 underline block mx-auto mt-10">Volver al sitio de viajeros</button>
      </div>
    </div>
  );
}

/* ============================= GUIDE DASHBOARD ============================= */

function GuideDashboardPage({ guide, expeditions, go, onNewExpedition, onEditExpedition, onEditProfile }) {
  const mine = expeditions.filter((e) => e.guideId === guide.id);
  const approvedCount = mine.filter((e) => e.status === "approved").length;
  return (
    <div style={{ background: C.cream }} className="min-h-[calc(100vh-64px)]">
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-12">
        {guide.status === "pending" && (
          <div className="rounded-xl p-4 mb-6 flex items-start gap-3" style={{ background: "#fde3b8" }}>
            <ClipboardList size={20} color={C.amberDeep} className="shrink-0 mt-0.5" />
            <div><div className="tm-body text-sm font-bold" style={{ color: C.amberDeep }}>Tu perfil está en revisión</div><div className="tm-body text-xs" style={{ color: C.amberDeep }}>El equipo de TrekMatch lo va a aprobar en las próximas 24-48hs. Mientras tanto podés cargar tus travesías.</div></div>
          </div>
        )}
        {guide.status === "rejected" && (
          <div className="rounded-xl p-4 mb-6 flex items-start gap-3" style={{ background: C.dangerBg }}>
            <XCircle size={20} color={C.danger} className="shrink-0 mt-0.5" />
            <div><div className="tm-body text-sm font-bold" style={{ color: C.danger }}>Tu perfil fue rechazado</div><div className="tm-body text-xs" style={{ color: C.danger }}>Revisá tus datos y volvé a enviarlo para su aprobación.</div></div>
          </div>
        )}

        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center tm-display font-bold text-white text-lg" style={{ background: C.oliveLight }}>{guide.initials}</div>
            <div>
              <h1 className="tm-display text-2xl font-bold" style={{ color: C.ink }}>Hola, {guide.name.split(" ")[0]}</h1>
              <div className="flex items-center gap-2 mt-1"><StatusPill status={guide.status} /><span className="tm-body text-xs" style={{ color: C.inkSoft }}>{guide.zone}</span></div>
            </div>
          </div>
          <button onClick={onEditProfile} className="tm-focus tm-body text-sm font-bold rounded-lg px-4 py-2.5 border-2 flex items-center gap-2" style={{ borderColor: C.forest, color: C.forest }}>
            <PenSquare size={15} /> Editar mi Perfil
          </button>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="rounded-xl p-5 bg-white border" style={{ borderColor: C.line }}><div className="tm-display text-2xl font-bold" style={{ color: C.ink }}>{guide.rating.toFixed(1)}★</div><div className="tm-body text-xs" style={{ color: C.inkSoft }}>Calificación</div></div>
          <div className="rounded-xl p-5 bg-white border" style={{ borderColor: C.line }}><div className="tm-display text-2xl font-bold" style={{ color: C.ink }}>{guide.reviews}</div><div className="tm-body text-xs" style={{ color: C.inkSoft }}>Total guiados</div></div>
          <div className="rounded-xl p-5 bg-white border" style={{ borderColor: C.line }}><div className="tm-display text-2xl font-bold" style={{ color: C.ink }}>{approvedCount}</div><div className="tm-body text-xs" style={{ color: C.inkSoft }}>Travesías activas</div></div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="tm-display text-xl font-bold" style={{ color: C.ink }}>Mis Travesías</h2>
          <button onClick={onNewExpedition} className="tm-focus tm-body text-sm font-bold rounded-lg px-4 py-2.5 flex items-center gap-1.5" style={{ background: C.forest, color: C.mustard }}>
            <Plus size={16} /> Nueva Travesía
          </button>
        </div>

        {mine.length === 0 ? (
          <div className="text-center py-14 rounded-2xl border-2 border-dashed" style={{ borderColor: C.line }}>
            <Tent size={28} className="mx-auto mb-3" color={C.inkSoft} />
            <p className="tm-body font-semibold" style={{ color: C.ink }}>Todavía no cargaste ninguna travesía.</p>
            <p className="tm-body text-sm mb-4" style={{ color: C.inkSoft }}>Creá tu primera salida para empezar a recibir reservas.</p>
            <SecondaryButton onClick={onNewExpedition} icon={Plus}>Nueva Travesía</SecondaryButton>
          </div>
        ) : (
          <div className="space-y-3">
            {mine.map((e) => (
              <div key={e.id} className="rounded-xl bg-white border p-5 flex flex-wrap items-center justify-between gap-4" style={{ borderColor: C.line }}>
                <div className="flex items-center gap-4 min-w-0">
                  <div style={{ background: C.forest }} className="w-16 h-16 rounded-lg overflow-hidden shrink-0"><MountainScene variant={e.mountains} className="w-full h-full" /></div>
                  <div className="min-w-0">
                    <div className="tm-body font-bold truncate" style={{ color: C.ink }}>{e.name}</div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap"><StatusPill status={e.status} /><span className="tm-body text-xs" style={{ color: C.inkSoft }}>{e.duration} · ${e.price.toLocaleString("es-AR")} ARS</span></div>
                  </div>
                </div>
                <button onClick={() => onEditExpedition(e.id)} className="tm-focus tm-body text-sm font-bold rounded-lg px-4 py-2 border-2 flex items-center gap-1.5 shrink-0" style={{ borderColor: C.forest, color: C.forest }}>
                  <PenSquare size={14} /> Editar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================= GUIDE PROFILE FORM ============================= */

function GuideProfileFormPage({ guide, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: guide?.name || "", zone: guide?.zone || "", years: guide?.years || "",
    specialty: guide?.specialty || "", bio: guide?.bio || "",
    certs: guide?.certs?.join(", ") || "",
  });
  const update = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...(guide || {}),
      name: form.name, zone: form.zone, years: Number(form.years) || 0,
      specialty: form.specialty, bio: form.bio,
      certs: form.certs.split(",").map((c) => c.trim()).filter(Boolean),
      initials: initialsOf(form.name),
      rating: guide?.rating ?? 5.0, reviews: guide?.reviews ?? 0,
    });
  };

  return (
    <div style={{ background: C.cream }} className="min-h-[calc(100vh-64px)]">
      <div className="max-w-2xl mx-auto px-5 md:px-8 py-12">
        <h1 className="tm-display text-3xl font-bold mb-2" style={{ color: C.ink }}>{guide ? "Editar mi Perfil" : "Crear mi Perfil de Guía"}</h1>
        <p className="tm-body mb-8" style={{ color: C.inkSoft }}>Cada cambio pasa por una breve revisión del equipo de TrekMatch antes de publicarse.</p>
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white border p-7 md:p-9 space-y-6" style={{ borderColor: C.line }}>
          <Field label="Nombre completo"><input required value={form.name} onChange={update("name")} placeholder="Ej: Ana Salgado" className="tm-focus tm-body w-full rounded-lg px-4 py-3 border" style={inputStyle} /></Field>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Zona / base de operaciones"><input required value={form.zone} onChange={update("zone")} placeholder="Ej: Ushuaia" className="tm-focus tm-body w-full rounded-lg px-4 py-3 border" style={inputStyle} /></Field>
            <Field label="Años de experiencia"><input required type="number" min="0" value={form.years} onChange={update("years")} className="tm-focus tm-body w-full rounded-lg px-4 py-3 border" style={inputStyle} /></Field>
          </div>
          <Field label="Especialidad" hint="Una línea que resuma tu enfoque como guía."><input required value={form.specialty} onChange={update("specialty")} placeholder="Ej: Travesías de resistencia en clima frío" className="tm-focus tm-body w-full rounded-lg px-4 py-3 border" style={inputStyle} /></Field>
          <Field label="Biografía"><textarea required rows={3} value={form.bio} onChange={update("bio")} className="tm-focus tm-body w-full rounded-lg px-4 py-3 border resize-none" style={inputStyle} /></Field>
          <Field label="Certificaciones" hint="Separadas por coma. Ej: AAGM Nivel II, Primeros Auxilios"><input required value={form.certs} onChange={update("certs")} className="tm-focus tm-body w-full rounded-lg px-4 py-3 border" style={inputStyle} /></Field>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onCancel} className="tm-focus tm-body text-sm font-bold px-5 py-3" style={{ color: C.inkSoft }}>Cancelar</button>
            <PrimaryButton type="submit" icon={CheckCircle2}>Enviar a Revisión</PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================= GUIDE EXPEDITION FORM ============================= */

function GuideExpeditionFormPage({ expedition, guide, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: expedition?.name || "", zone: expedition?.zone || "Patagonia",
    duration: expedition?.duration || "", difficulty: expedition?.difficulty || "Media",
    tags: expedition?.tags?.join(", ") || "", price: expedition?.price || "",
    meetingPoint: expedition?.meetingPoint || "", food: expedition?.food || "",
    description: expedition?.description || "", mountains: expedition?.mountains || "peak",
  });
  const [itinerary, setItinerary] = useState(expedition?.itinerary?.length ? expedition.itinerary : [{ day: "Día 1", detail: "" }]);
  const [equipment, setEquipment] = useState(expedition?.equipment || []);
  const [newItem, setNewItem] = useState("");

  const update = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const updateItinerary = (i, key, value) => {
    const next = [...itinerary];
    next[i] = { ...next[i], [key]: value };
    setItinerary(next);
  };
  const addDay = () => setItinerary([...itinerary, { day: `Día ${itinerary.length + 1}`, detail: "" }]);
  const removeDay = (i) => setItinerary(itinerary.filter((_, idx) => idx !== i));

  const addEquipment = () => {
    if (newItem.trim()) { setEquipment([...equipment, newItem.trim()]); setNewItem(""); }
  };
  const removeEquipment = (item) => setEquipment(equipment.filter((e) => e !== item));

  const handleSubmit = (e) => {
    e.preventDefault();
    // ------------------------------------------------------------------
    // 1. RASTREO GA4: Evento KR1 (Publicación de Expedición por Guía)
    // ------------------------------------------------------------------
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "publish_expedition", {
        guide_id: guide?.id || "desconocido",
        guide_name: guide?.name || "desconocido",
        expedition_name: form.name,
        zone: form.zone,
        difficulty: form.difficulty,
        price: Number(form.price) || 0,
        duration: form.duration
      });
    }
    onSave({
      ...(expedition || {}),
      name: form.name, zone: form.zone, duration: form.duration, difficulty: form.difficulty,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      price: Number(form.price) || 0, meetingPoint: form.meetingPoint, food: form.food,
      description: form.description, mountains: form.mountains,
      itinerary: itinerary.filter((it) => it.detail.trim()),
      equipment,
      guideId: guide.id,
      guide: { name: guide.name, rating: guide.rating, reviews: guide.reviews, initials: guide.initials },
    });
  };

  return (
    <div style={{ background: C.cream }} className="min-h-[calc(100vh-64px)]">
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-12">
        <h1 className="tm-display text-3xl font-bold mb-2" style={{ color: C.ink }}>{expedition ? "Editar Travesía" : "Nueva Travesía"}</h1>
        <p className="tm-body mb-8" style={{ color: C.inkSoft }}>Se publica en el catálogo público apenas el equipo de TrekMatch la revise y apruebe.</p>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-white border p-7 md:p-9 space-y-7" style={{ borderColor: C.line }}>
          <Field label="Nombre de la travesía"><input required value={form.name} onChange={update("name")} placeholder="Ej: Travesía Cerro Catedral" className="tm-focus tm-body w-full rounded-lg px-4 py-3 border" style={inputStyle} /></Field>

          <div className="grid sm:grid-cols-3 gap-5">
            <Field label="Zona">
              <select value={form.zone} onChange={update("zone")} className="tm-focus tm-body w-full rounded-lg px-4 py-3 border" style={inputStyle}>
                {["Patagonia", "Cuyo", "Norte"].map((z) => <option key={z} value={z}>{z}</option>)}
              </select>
            </Field>
            <Field label="Duración" hint="Ej: 2D / 1N"><input required value={form.duration} onChange={update("duration")} placeholder="2D / 1N" className="tm-focus tm-body w-full rounded-lg px-4 py-3 border" style={inputStyle} /></Field>
            <Field label="Dificultad">
              <select value={form.difficulty} onChange={update("difficulty")} className="tm-focus tm-body w-full rounded-lg px-4 py-3 border" style={inputStyle}>
                {["Baja", "Media", "Alta"].map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Precio por persona (ARS)"><input required type="number" min="0" value={form.price} onChange={update("price")} className="tm-focus tm-body w-full rounded-lg px-4 py-3 border" style={inputStyle} /></Field>
            <Field label="Etiquetas" hint="Separadas por coma. Ej: Refugio, Sin pernocte"><input value={form.tags} onChange={update("tags")} className="tm-focus tm-body w-full rounded-lg px-4 py-3 border" style={inputStyle} /></Field>
          </div>

          <Field label="Punto de encuentro"><input required value={form.meetingPoint} onChange={update("meetingPoint")} placeholder="Ej: Terminal de Bariloche — 08:00 hs." className="tm-focus tm-body w-full rounded-lg px-4 py-3 border" style={inputStyle} /></Field>
          <Field label="Alimentación incluida"><input required value={form.food} onChange={update("food")} placeholder="Ej: Viandas de marcha incluidas" className="tm-focus tm-body w-full rounded-lg px-4 py-3 border" style={inputStyle} /></Field>
          <Field label="Descripción"><textarea required rows={3} value={form.description} onChange={update("description")} className="tm-focus tm-body w-full rounded-lg px-4 py-3 border resize-none" style={inputStyle} /></Field>

          <Field label="Estilo de ilustración de portada">
            <div className="flex gap-2 flex-wrap">
              {[{ v: "peak", l: "Cumbre" }, { v: "twin", l: "Picos Gemelos" }, { v: "glacier", l: "Glaciar" }, { v: "hill", l: "Colina" }].map((m) => (
                <button key={m.v} type="button" onClick={() => setForm({ ...form, mountains: m.v })} className="tm-focus rounded-lg overflow-hidden border-2" style={{ borderColor: form.mountains === m.v ? C.amberDeep : C.line, width: 96 }}>
                  <div style={{ background: C.forest }}><MountainScene variant={m.v} className="w-full h-12" /></div>
                  <div className="tm-body text-[10px] font-semibold py-1" style={{ color: C.ink }}>{m.l}</div>
                </button>
              ))}
            </div>
          </Field>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="tm-body text-sm font-bold" style={{ color: C.ink }}>Itinerario</span>
              <button type="button" onClick={addDay} className="tm-focus tm-body text-xs font-bold flex items-center gap-1" style={{ color: C.amberDeep }}><Plus size={14} /> Agregar día</button>
            </div>
            <div className="space-y-3">
              {itinerary.map((it, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <input value={it.day} onChange={(e) => updateItinerary(i, "day", e.target.value)} className="tm-focus tm-body rounded-lg px-3 py-2.5 border w-28 shrink-0 text-sm" style={inputStyle} />
                  <input value={it.detail} onChange={(e) => updateItinerary(i, "detail", e.target.value)} placeholder="Descripción del día..." className="tm-focus tm-body flex-1 rounded-lg px-3 py-2.5 border text-sm" style={inputStyle} />
                  {itinerary.length > 1 && <button type="button" onClick={() => removeDay(i)} className="tm-focus p-2.5" aria-label="Quitar día"><X size={16} color={C.inkSoft} /></button>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="tm-body text-sm font-bold block mb-3" style={{ color: C.ink }}>Equipo requerido</span>
            <div className="flex flex-wrap gap-2 mb-3">
              {equipment.map((item) => (
                <span key={item} className="tm-body text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5" style={{ background: C.mustard, color: C.forest }}>
                  {item} <button type="button" onClick={() => removeEquipment(item)} aria-label={`Quitar ${item}`}><X size={12} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newItem} onChange={(e) => setNewItem(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addEquipment(); } }} placeholder="Ej: Bastones de trekking" className="tm-focus tm-body flex-1 rounded-lg px-4 py-2.5 border text-sm" style={inputStyle} />
              <button type="button" onClick={addEquipment} className="tm-focus tm-body text-sm font-bold rounded-lg px-4 border-2" style={{ borderColor: C.forest, color: C.forest }}>Agregar</button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t" style={{ borderColor: C.line }}>
            <button type="button" onClick={onCancel} className="tm-focus tm-body text-sm font-bold px-5 py-3" style={{ color: C.inkSoft }}>Cancelar</button>
            <PrimaryButton type="submit" icon={CheckCircle2}>Enviar a Revisión</PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================= ADMIN DASHBOARD ============================= */

function AdminDashboardPage({ guides, expeditions, onApproveGuide, onRejectGuide, onApproveExpedition, onRejectExpedition }) {
  const pendingGuides = guides.filter((g) => g.status === "pending");
  const pendingExpeditions = expeditions.filter((e) => e.status === "pending");
  const approvedGuides = guides.filter((g) => g.status === "approved").length;
  const approvedExpeditions = expeditions.filter((e) => e.status === "approved").length;

  return (
    <div style={{ background: C.cream }} className="min-h-[calc(100vh-64px)]">
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-12">
        <span className="tm-body text-xs font-bold uppercase tracking-widest" style={{ color: C.amberDeep }}>Moderación</span>
        <h1 className="tm-display text-4xl font-bold mt-2 mb-2" style={{ color: C.ink }}>Panel de Administración</h1>
        <p className="tm-body mb-9" style={{ color: C.inkSoft }}>Revisá los perfiles de guías y las travesías antes de que se publiquen en el catálogo.</p>

        <div className="grid sm:grid-cols-4 gap-4 mb-10">
          <StatCard label="Guías pendientes" value={pendingGuides.length} icon={Inbox} highlight={pendingGuides.length > 0} />
          <StatCard label="Travesías pendientes" value={pendingExpeditions.length} icon={Inbox} highlight={pendingExpeditions.length > 0} />
          <StatCard label="Guías activos" value={approvedGuides} icon={Users} />
          <StatCard label="Travesías activas" value={approvedExpeditions} icon={Compass} />
        </div>

        <h2 className="tm-display text-xl font-bold mb-4 flex items-center gap-2" style={{ color: C.ink }}>
          <ClipboardList size={20} color={C.amberDeep} /> Pendientes de Revisión
        </h2>

        {pendingGuides.length === 0 && pendingExpeditions.length === 0 ? (
          <div className="text-center py-14 rounded-2xl border-2 border-dashed mb-12" style={{ borderColor: C.line }}>
            <CheckCircle2 size={28} className="mx-auto mb-3" color={C.inkSoft} />
            <p className="tm-body font-semibold" style={{ color: C.ink }}>Todo al día — no hay nada esperando revisión.</p>
          </div>
        ) : (
          <div className="space-y-4 mb-12">
            {pendingGuides.map((g) => (
              <div key={g.id} className="rounded-xl bg-white border p-5" style={{ borderColor: C.line }}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center tm-display font-bold text-white shrink-0" style={{ background: C.oliveLight }}>{g.initials}</div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap"><Tag tone="olive">Perfil de Guía</Tag><span className="tm-body font-bold" style={{ color: C.ink }}>{g.name}</span></div>
                      <p className="tm-body text-sm mt-1" style={{ color: C.inkSoft }}>{g.specialty}</p>
                      <p className="tm-body text-xs mt-1" style={{ color: C.inkSoft }}>{g.zone} · {g.years} años de experiencia · Certs: {g.certs.join(", ")}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => onRejectGuide(g.id)} className="tm-focus tm-body text-sm font-bold rounded-lg px-4 py-2 border-2 flex items-center gap-1.5" style={{ borderColor: C.danger, color: C.danger }}><XCircle size={15} /> Rechazar</button>
                    <button onClick={() => onApproveGuide(g.id)} className="tm-focus tm-body text-sm font-bold rounded-lg px-4 py-2 flex items-center gap-1.5" style={{ background: C.forest, color: C.mustard }}><CheckCircle2 size={15} /> Aprobar</button>
                  </div>
                </div>
              </div>
            ))}
            {pendingExpeditions.map((e) => (
              <div key={e.id} className="rounded-xl bg-white border p-5" style={{ borderColor: C.line }}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <div style={{ background: C.forest }} className="w-14 h-14 rounded-lg overflow-hidden shrink-0"><MountainScene variant={e.mountains} className="w-full h-full" /></div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap"><Tag>Travesía</Tag><span className="tm-body font-bold" style={{ color: C.ink }}>{e.name}</span></div>
                      <p className="tm-body text-sm mt-1" style={{ color: C.inkSoft }}>{e.description}</p>
                      <p className="tm-body text-xs mt-1" style={{ color: C.inkSoft }}>{e.zone} · {e.duration} · Guía: {e.guide.name} · ${e.price.toLocaleString("es-AR")} ARS</p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => onRejectExpedition(e.id)} className="tm-focus tm-body text-sm font-bold rounded-lg px-4 py-2 border-2 flex items-center gap-1.5" style={{ borderColor: C.danger, color: C.danger }}><XCircle size={15} /> Rechazar</button>
                    <button onClick={() => onApproveExpedition(e.id)} className="tm-focus tm-body text-sm font-bold rounded-lg px-4 py-2 flex items-center gap-1.5" style={{ background: C.forest, color: C.mustard }}><CheckCircle2 size={15} /> Aprobar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 className="tm-display text-xl font-bold mb-4" style={{ color: C.ink }}>Catálogo completo</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl bg-white border p-5" style={{ borderColor: C.line }}>
            <h3 className="tm-body text-xs font-bold uppercase tracking-wide mb-3" style={{ color: C.inkSoft }}>Guías ({guides.length})</h3>
            <div className="space-y-2.5">
              {guides.map((g) => (
                <div key={g.id} className="flex items-center justify-between gap-3">
                  <span className="tm-body text-sm truncate" style={{ color: C.ink }}>{g.name}</span>
                  <StatusPill status={g.status} />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-white border p-5" style={{ borderColor: C.line }}>
            <h3 className="tm-body text-xs font-bold uppercase tracking-wide mb-3" style={{ color: C.inkSoft }}>Travesías ({expeditions.length})</h3>
            <div className="space-y-2.5">
              {expeditions.map((e) => (
                <div key={e.id} className="flex items-center justify-between gap-3">
                  <span className="tm-body text-sm truncate" style={{ color: C.ink }}>{e.name}</span>
                  <StatusPill status={e.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, highlight }) {
  return (
    <div className="rounded-xl p-5 border" style={{ background: highlight ? C.mustard : "white", borderColor: highlight ? C.amberDeep : C.line }}>
      <Icon size={16} color={highlight ? C.forest : C.inkSoft} />
      <div className="tm-display text-2xl font-bold mt-2" style={{ color: C.ink }}>{value}</div>
      <div className="tm-body text-xs" style={{ color: C.inkSoft }}>{label}</div>
    </div>
  );
}

/* ============================= APP ROOT ============================= */

export default function App() {
  const [page, setPage] = useState("landing");
  const [selectedId, setSelectedId] = useState("lanin");
  const [loggedIn, setLoggedIn] = useState(false);
  const [medicalDone, setMedicalDone] = useState(false);
  const [medical, setMedical] = useState({ name: "", bloodType: "", allergies: "", conditions: "", emergencyName: "", emergencyPhone: "", consent: false });

  const [guides, setGuides] = useState(INITIAL_GUIDES);
  const [expeditions, setExpeditions] = useState(INITIAL_EXPEDITIONS);
  const [role, setRole] = useState("traveler"); // traveler | guide | admin
  const [activeGuideId, setActiveGuideId] = useState(null);
  const [editingExpeditionId, setEditingExpeditionId] = useState(undefined); // undefined = new

  const go = (p) => { setPage(p); window.scrollTo?.(0, 0); };
  const activeGuide = guides.find((g) => g.id === activeGuideId);

  const upsertGuide = (data) => {
    setGuides((prev) => {
      const exists = prev.some((g) => g.id === data.id);
      const record = { ...data, id: data.id || uid(data.name), status: "pending" };
      if (exists) return prev.map((g) => (g.id === record.id ? record : g));
      return [...prev, record];
    });
  };

  const upsertExpedition = (data) => {
    setExpeditions((prev) => {
      const exists = prev.some((e) => e.id === data.id);
      const record = { ...data, id: data.id || uid(data.name), status: "pending" };
      if (exists) return prev.map((e) => (e.id === record.id ? record : e));
      return [...prev, record];
    });
  };

  const exitPortal = () => { setRole("traveler"); setActiveGuideId(null); go("landing"); };

  const showRolePage = role === "guide" ? page.startsWith("guide-") : role === "admin" ? page.startsWith("admin-") : true;

  return (
    <div className="tm-body" style={{ minHeight: "100vh" }}>
      {FONTS}

      {page === "checkout" || page === "confirmation" ? (
        <MiniHeader go={go} />
      ) : role === "guide" || role === "admin" ? (
        <RoleHeader role={role} go={go} onExit={exitPortal} guideName={activeGuide?.name} />
      ) : (
        <Header page={page} go={go} />
      )}

      {page === "landing" && <LandingPage go={go} guides={guides} />}
      {page === "login" && <LoginPage go={go} setLoggedIn={setLoggedIn} />}
      {page === "expeditions" && <ExpeditionsPage go={go} setSelectedId={setSelectedId} expeditions={expeditions} />}
      {page === "detail" && <ExpeditionDetailPage go={go} selectedId={selectedId} setSelectedId={setSelectedId} expeditions={expeditions} />}
      {page === "guides" && <GuidesPage guides={guides} />}
      {page === "medical" && <MedicalFormPage go={go} medical={medical} setMedical={setMedical} setMedicalDone={setMedicalDone} />}
      {page === "checkout" && <CheckoutPage go={go} selectedId={selectedId} medicalDone={medicalDone} expeditions={expeditions} />}
      {page === "confirmation" && <ConfirmationPage go={go} selectedId={selectedId} expeditions={expeditions} />}

      {page === "portal" && (
        <PortalGatewayPage
          go={go}
          guides={guides}
          onEnterAsGuide={(id) => { trackEvent("login_guide"); setRole("guide"); setActiveGuideId(id); go("guide-dashboard"); }}
          onEnterAsAdmin={() => { setRole("admin"); go("admin-dashboard"); }}
          onStartNewGuide={() => { setRole("guide"); setActiveGuideId(null); go("guide-profile-form"); }}
        />
      )}

      {page === "guide-dashboard" && activeGuide && (
        <GuideDashboardPage
          guide={activeGuide}
          expeditions={expeditions}
          go={go}
          onNewExpedition={() => { setEditingExpeditionId(undefined); go("guide-expedition-form"); }}
          onEditExpedition={(id) => { setEditingExpeditionId(id); go("guide-expedition-form"); }}
          onEditProfile={() => go("guide-profile-form")}
        />
      )}

      {page === "guide-profile-form" && (
        <GuideProfileFormPage
          guide={activeGuide}
          onCancel={() => go(activeGuide ? "guide-dashboard" : "portal")}
          onSave={(data) => {
            const wasNew = !activeGuide;
            upsertGuide(data);
            if (wasNew) {
              const newId = data.id || uid(data.name);
              setActiveGuideId(newId);
            }
            go("guide-dashboard");
          }}
        />
      )}

      {page === "guide-expedition-form" && activeGuide && (
        <GuideExpeditionFormPage
          expedition={editingExpeditionId ? expeditions.find((e) => e.id === editingExpeditionId) : null}
          guide={activeGuide}
          onCancel={() => go("guide-dashboard")}
          onSave={(data) => {
  upsertExpedition(data);

  if (!editingExpeditionId) {
    trackEvent("publish_expedition", {
      item_name: data.name,
      value: data.price,
      currency: "ARS",
    });
  }

  go("guide-dashboard");
}}
        />
      )}

      {page === "admin-dashboard" && (
        <AdminDashboardPage
          guides={guides}
          expeditions={expeditions}
          onApproveGuide={(id) => setGuides((prev) => prev.map((g) => (g.id === id ? { ...g, status: "approved" } : g)))}
          onRejectGuide={(id) => setGuides((prev) => prev.map((g) => (g.id === id ? { ...g, status: "rejected" } : g)))}
          onApproveExpedition={(id) => setExpeditions((prev) => prev.map((e) => (e.id === id ? { ...e, status: "approved" } : e)))}
          onRejectExpedition={(id) => setExpeditions((prev) => prev.map((e) => (e.id === id ? { ...e, status: "rejected" } : e)))}
        />
      )}

      {role === "traveler" && page !== "checkout" && page !== "confirmation" && page !== "portal" && <Footer />}
    </div>
  );
}
