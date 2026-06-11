# CorridorWork — Public Visual Premium Audit
**Date:** 2026-06-12  
**Scope:** All public-facing pages  
**Goal:** Identify and eliminate visual elements that reduce perceived product quality.  
**Standard:** Modern B2B SaaS — clean, minimal, premium, trust-first.

---

## Design Language — Target State

| Principle | Applied As |
|-----------|-----------|
| Dark, premium base | `bg-slate-950` everywhere (no `gray-950`, no `gray-50`) |
| Cards | `bg-slate-900 border border-slate-800` or `bg-slate-800/40 border border-slate-700/80` |
| Section dividers | `border-t border-slate-800` |
| Section labels | Uppercase, tracked, `text-slate-500 text-xs` |
| Typography | Bold H1/H2, relaxed body (`text-slate-400`) |
| Icons | Geometric dots, numbered circles, accent bars — no emoji |
| Buttons | Clean text CTAs only — no emoji prefixes |
| Backgrounds | Flat dark surfaces — no cheap colorful gradients |
| Emojis | Flag emojis only where functionally meaningful (corridor flags) |

---

## Page-by-Page Audit

---

### `/` — Homepage
**Current state:** ✅ Already premium  
**Issues:** None significant  
**Elements to keep:**
- Split-layout hero with real photography ✅
- Numbered step process ✅
- Trust compliance grid ✅
- Audience path cards with photo overlays ✅
**Decision:** No changes needed.

---

### `/for-employers`
**Current state:** ⚠️ Needs cleanup  

**Problematic elements:**

| Element | Problem | Decision |
|---------|---------|----------|
| `bg-gray-950` base | Inconsistent with slate-950 standard | → Replace with `bg-slate-950` |
| `🏢`, `💼`, `📊`, `🎯`, `📈`, `🔒` icon emojis in cards | Generic, clip-art feeling, not premium | → Replace with geometric indicator dots |
| `🏢 Direkt registrieren` button emoji | Cheap, unprofessional CTA | → Remove emoji, clean text only |
| `📋 Als Pilot-Arbeitgeber anfragen` button emoji | Same issue | → Remove emoji |
| `bg-gradient-to-r from-green-900/10 to-blue-900/10` hero section | Generic gradient, no visual value | → Remove, use flat `bg-slate-900/20` or nothing |
| `bg-gradient-to-r from-green-900/20 to-blue-900/20` CTA section | Same issue | → Remove |
| `⚠️ Zahlungen sind in dieser MVP-Version noch nicht aktiviert` | Emoji warning, visually noisy | → Clean styled notice without emoji |
| `🚀 Kommende Premium-Funktionen` heading | Emoji in section heading | → Remove emoji |
| `✅`, `🆓`, `💬`, `👤` in feature cards | Cheap emoji icons | → Replace with minimal dots |
| Pilot section `🏢 Jetzt gesucht` badge | Emoji in badge | → Remove emoji from badge |
| Purple tag pills `bg-purple-900/20` | Random accent color, not brand-consistent | → Use `bg-slate-800` |

**New direction:** Clean slate-950 base, dot indicators, text-only CTAs, no gradients.

---

### `/for-candidates`
**Current state:** ⚠️ Needs cleanup  

**Problematic elements:**

| Element | Problem | Decision |
|---------|---------|----------|
| `bg-gray-950` base | Inconsistent with slate-950 | → `bg-slate-950` |
| `👤 Für internationale Fachkräfte` badge emoji | Emoji in eyebrow badge | → Remove emoji |
| `📝`, `🤖`, `🎯` step icons | Generic emoji icons | → Numbered circles only |
| `🆓`, `📊`, `🌍`, `🔒`, `⚡`, `📱` card icons | Cheap clip-art emoji | → Remove, dot indicator |
| `💡 Hinweis: MVP-Phase` callout | Emoji in notice heading | → Remove emoji |
| `👤 Als Kandidat registrieren →` button | Emoji CTA | → Clean text |
| `bg-gradient-to-r from-blue-900/20 to-purple-900/20` CTA | Cheap gradient | → Remove |

**New direction:** Same as employers — clean, consistent, emoji-free.

---

### `/for-buyers`
**Current state:** ⚠️ Needs improvement  

**Problematic elements:**

| Element | Problem | Decision |
|---------|---------|----------|
| Uses `NavBar` not `PublicNavBar` | Wrong navigation component (auth-aware public nav not used) | → Switch to `PublicNavBar` |
| `bg-gray-950` base | Inconsistent | → `bg-slate-950` |
| `🌐`, `💻`, `🗄️`, `🚀`, `🧠`, `🔧`, `📄`, `🔄` asset icons | Cheap emoji decorations | → Remove emoji, use styled label |
| `✅` emoji in compliance items | Emoji checkmarks | → Dot indicators |
| `gray-900`, `gray-800`, `gray-700` everywhere | Inconsistent with brand palette | → Align to `slate` equivalents |

**New direction:** Align to brand palette, clean asset table, remove emoji icons.

---

### `/demo/sandbox`
**Current state:** 🔴 CRITICAL — Most problematic page  

**Problematic elements:**

| Element | Problem | Decision |
|---------|---------|----------|
| `bg-gray-50` base | **Light background** — completely opposite to brand. Looks like a dev prototype | → `bg-slate-950` dark theme |
| `bg-gradient-to-r from-indigo-900 to-blue-900` header | Generic gradient hero, looks like a template | → Clean dark section with accent typography |
| `🌍 Global Talent Corridor Platform` heading | Emoji in H1 — unprofessional | → Remove emoji |
| `🏢 Employer Intake →`, `👤 Candidate Interest →`, `🎯 Strategic Partnership →` CTAs | Emoji buttons | → Clean text CTAs |
| `bg-white border border-gray-200` cards | Light cards on light background — completely wrong theme | → Dark card system |
| `bg-green-50 border border-green-200` revenue section | Bright green background — childish, off-brand | → Dark slate card |
| `💰 Top 5 Revenue Segments` heading | Emoji + "Revenue Segments" framing for public demo = unprofessional | → Rename or remove |
| `bg-amber-50 border-2 border-amber-300` disclaimer | Bright amber disclaimer box — visually noisy | → Refined dark styled notice |
| `🧪 Demo Disclaimer` with red/green ✓/✗ lists | Looks like a dev checklist, not a premium product | → Clean trust notice |
| `bg-amber-50 border-b-2 border-amber-300` top banner | Harsh amber on light background — unprofessional | → Subtle dark banner |
| `font-black` on H1 | Too heavy, casual | → `font-bold` |
| `🏭`, `💰`, `✅` in metric cards | Emoji metric icons | → Remove |
| CTA cards `bg-blue-50`, `bg-green-50`, `bg-amber-50` | Pastel backgrounds — toy-like | → Dark themed CTA cards |
| `text-2134+ Tests Passing` stat | Outdated test count, wrong framing for public demo | → Remove |

**New direction:** Full dark theme (slate-950), clean header section, emoji-free cards, refined disclaimer, professional CTA section.

---

### `/demo`
**Current state:** ✅ Already clean  
**Minor notes:**
- Flag emojis for corridors — acceptable (functional, internationally recognized)
- Industry emojis from config — acceptable (data-driven, consistent)
**Decision:** No changes needed.

---

### `/partners`
**Current state:** ✅ Already premium  
**Elements:** Hero photo, accent bars, clean typography — all good.  
**Decision:** No changes needed.

---

### `/buyer-snapshot`
**Current state:** ✅ Mostly clean  
**Minor issue:** `bg-gray-950` base → should align to `slate-950`  
**Decision:** Minor color alignment only.

---

### `PublicNavBar`
**Current state:** ✅ Already premium  
**Decision:** No changes.

### `PublicFooter`
**Current state:** ✅ Already premium  
**Decision:** No changes.

---

## Implementation Priority

| Priority | Page | Work |
|----------|------|------|
| 🔴 Critical | `/demo/sandbox` | Full dark-theme overhaul |
| 🟠 High | `/for-employers` | Emoji cleanup, gradient removal |
| 🟠 High | `/for-candidates` | Emoji cleanup, gradient removal |
| 🟡 Medium | `/for-buyers` | NavBar fix, color alignment |
| 🟢 Low | `/buyer-snapshot` | Color alignment only |

---

## Elements Never to Use

- Emoji in headings or section titles
- Emoji in buttons or CTAs
- Light backgrounds (`bg-white`, `bg-gray-50`, `bg-*-50`) in main sections
- Colorful gradient backgrounds (`from-green-900/10 to-blue-900/10`)
- Bright colored section backgrounds (`bg-green-50`, `bg-amber-50`, `bg-blue-50`)
- `font-black` typography weight
- Random purple/green/amber accent colors not part of the brand system
- ✅ / ✗ emoji checkmarks in prose

## Elements That Are Acceptable

- Flag emojis for corridor origin/destination (functional context)
- Industry emojis from `INDUSTRY_CONFIGS` (config-driven, consistent)
- `text-emerald-400` dot indicators (subtle, non-distracting)
- `text-indigo-400` / `text-amber-400` accent text (brand-consistent)
- Real photography with dark overlays (already used correctly)
