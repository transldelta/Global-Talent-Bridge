# CorridorWork — Human Footage Asset List
# docs/video/HUMAN_FOOTAGE_ASSET_LIST.md

> **Status: PIPELINE READY — Clips needed**
> Drop licensed clips into `public/promo-video/source-clips/` then run `scripts/build-human-promo-video.sh`

---

## Safety Constraints (always apply)

- No fake clients · No fake revenue · No fake jobs · No job guarantee · No visa guarantee
- No Stripe · No email sending · No scraping · No illegal media
- Only clips with clear, documented licenses

---

## Required Clips

Each clip: **MP4 or MOV, min 1280×720, min 3 seconds, landscape orientation**

| Filename (save as) | Scene | Content Description | Duration | Priority |
|--------------------|-------|---------------------|----------|----------|
| `01-empty-office.mp4` | Scene 1 — The Problem | Empty office desks, open chairs, unfilled workstations — HR context | 4–6s | 🔴 Must-have |
| `02-hr-team.mp4` | Scene 1 — The Problem | HR team in meeting, reviewing CVs, looking at screens | 4–6s | 🔴 Must-have |
| `03-candidates-global.mp4` | Scene 2 — Global Talent | Diverse professionals: South Asian, African, Filipino, Arab, Latin — in work context | 5–8s | 🔴 Must-have |
| `04-healthcare-worker.mp4` | Scene 2 + 4 — Sectors | Nurse or healthcare worker in scrubs, hospital/clinic setting | 3–5s | 🔴 Must-have |
| `05-it-developer.mp4` | Scene 4 — Sectors | Software developer / IT professional at laptop, code on screen | 3–5s | 🔴 Must-have |
| `06-construction-worker.mp4` | Scene 4 — Sectors | Skilled tradesperson / construction worker / engineer on site | 3–5s | 🟡 Recommended |
| `07-candidate-laptop.mp4` | Scene 2 + 5 | Candidate at laptop, filling form, looking engaged | 4–6s | 🔴 Must-have |
| `08-employer-interview.mp4` | Scene 5 — For Whom | Employer or HR in interview/video call setting | 4–6s | 🔴 Must-have |
| `09-world-map-globe.mp4` | Scene 3 — CorridorWork | Globe animation, world map, flight paths, global connectivity | 4–6s | 🟡 Recommended |
| `10-diverse-team.mp4` | Scene 5 — Teamwork | International team working together, diversity, collaboration | 4–6s | 🟡 Recommended |
| `11-airport-mobility.mp4` | Scene 3 — Global | Airport terminal, travel, global mobility | 3–5s | 🟢 Optional |
| `12-logistics-worker.mp4` | Scene 4 — Sectors | Logistics / warehouse / delivery worker | 3–5s | 🟢 Optional |
| `13-hospitality-worker.mp4` | Scene 4 — Sectors | Hotel / restaurant / hospitality professional | 3–5s | 🟢 Optional |
| `14-corridorwork-logo.mp4` | Scene 6 — CTA | CorridorWork logo or brand screen with website | 3–5s | 🔴 Must-have |

---

## License Requirements

**ALL clips must meet one of the following:**

### ✅ Accepted Licenses

| Source Type | Acceptable? | Notes |
|-------------|-------------|-------|
| Own footage (filmed by CorridorWork team) | ✅ Yes | Preferred. Keep releases for any people shown. |
| Pexels.com — Free License | ✅ Yes | pexels.com/license — no attribution required for video |
| Pixabay.com — Content License | ✅ Yes | pixabay.com/service/license-summary/ |
| Unsplash (video) | ✅ Yes | unsplash.com/license |
| Mixkit.co — Free License | ✅ Yes | mixkit.co/license/ |
| Coverr.co — Free License | ✅ Yes | coverr.co/license |
| Storyblocks (if licensed seat) | ✅ Yes | Must have active subscription |
| Envato Elements (if licensed seat) | ✅ Yes | Must have active subscription |
| Pond5 (if purchased) | ✅ Yes | Must have purchase receipt |

### ❌ Not Accepted

| Source Type | Acceptable? | Reason |
|-------------|-------------|--------|
| YouTube clips | ❌ No | Copyright retained by creator |
| Social media (TikTok, Instagram, LinkedIn) | ❌ No | Platform ToS + copyright |
| Other brands' advertisements | ❌ No | Copyright + trademark |
| Competitor footage | ❌ No | Copyright |
| AI-generated faces/people (without disclosure) | ❌ No | Misleading in commercial context |

---

## Recommended Free Sources (start here)

### 🎬 Pexels Video (free, no attribution required)
Search these terms:
- "international workforce" → https://www.pexels.com/search/videos/international%20workforce/
- "healthcare worker" → https://www.pexels.com/search/videos/healthcare%20worker/
- "software developer" → https://www.pexels.com/search/videos/software%20developer/
- "diverse team office" → https://www.pexels.com/search/videos/diverse%20team%20office/
- "construction worker" → https://www.pexels.com/search/videos/construction%20worker/
- "candidate interview" → https://www.pexels.com/search/videos/job%20interview/
- "world map globe" → https://www.pexels.com/search/videos/world%20map/

### 🎬 Mixkit.co (free, no attribution required)
- https://mixkit.co/free-stock-video/people/
- https://mixkit.co/free-stock-video/business/
- https://mixkit.co/free-stock-video/technology/

### 🎬 Coverr.co (free, no attribution required)
- https://coverr.co/search?q=diverse+team
- https://coverr.co/search?q=office

---

## After Downloading

1. Save clips using the filenames in the table above
2. Place all clips in: `public/promo-video/source-clips/`
3. Run the build pipeline: `bash scripts/build-human-promo-video.sh`
4. Final video output: `public/promo-video/final/corridorwork-promo-human-en.mp4`

---

## License Documentation Template

For each clip used, fill in:

```
Clip: [filename]
Source: [URL]
License: [license name + URL]
Downloaded: [date]
Modifications: [trimmed to Xs / color graded / none]
```

Save this as `docs/video/CLIP_LICENSES.md`.

---

## Model/Person Releases

If any clip shows recognizable faces:
- Ensure platform license covers commercial use of depicted persons
- Pexels, Mixkit, Coverr free licenses cover this for their content
- Own footage: collect signed release from every visible person

---

*CorridorWork · docs/video/HUMAN_FOOTAGE_ASSET_LIST.md*
*Safety: No fake revenue · No job guarantee · No visa guarantee · No Stripe · No scraping*
