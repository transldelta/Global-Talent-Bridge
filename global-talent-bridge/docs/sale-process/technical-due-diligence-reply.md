# Technical Due Diligence Reply — CorridorWork

*Sale Process · Buyer Response Kit · Admin use only*

---

## When to use this

Use this template when a buyer or technical evaluator asks about the stack, codebase
quality, test coverage, or transfer process.

**Before sending:** answer only what is factually true at the time of sending.
Do not share credentials, API keys, or direct database access before a proper process
(NDA or escrow step) is in place.

---

## Template — General Technical Overview

---

**Subject:** Re: CorridorWork — technical overview

Hi [Name],

Happy to walk you through the technical picture.

**Stack:**
- Framework: Next.js App Router, React, TypeScript (strict mode)
- Database: Supabase PostgreSQL 17, EU-Frankfurt region, GDPR compliant
- Deployment: Vercel, serverless, auto-deploy from GitHub
- Authentication: Supabase Auth
- Code quality: latest lint, TypeScript, build, and test suite all passed — zero errors

**What is documented:**
- Full technical architecture (`docs/buyer-package/technical-architecture.md`)
- Security and RLS overview (`docs/buyer-package/security-rls-overview.md`)
- Deployment and transfer checklist (`docs/buyer-package/deployment-transfer-checklist.md`)
- Admin toolset overview accessible from the buyer room documentation

**Transfer process:**
The transfer involves four independently transferable assets:
1. Domain (corridorwork.com) — registrar transfer
2. GitHub repository — transfer to buyer's GitHub account
3. Vercel project — transfer to buyer's Vercel account
4. Supabase project — transfer to buyer's Supabase account

Actual transfer timing depends on registrar processing, GitHub transfer acceptance,
Vercel project migration, and buyer-side account setup. Documented handover steps are
included. I will not commit to a fixed number of days as it depends on variables outside
my control, but the steps are straightforward for a technically experienced buyer.

**Credentials policy:**
I do not share Supabase connection strings, API keys, or admin credentials until a
payment-in-escrow confirmation is received. This protects both parties.

If you would like to review the public codebase structure or the buyer documentation
before making a decision, I can provide read-only access to specific documentation.

Happy to answer specific technical questions in writing.

Kind regards,
[Your name]
CorridorWork

---

## Template — Code Review Request

---

**Subject:** Re: CorridorWork — code access

Hi [Name],

For code review purposes, I can share:

- The public repository (read-only access) — after you confirm your GitHub username
  and we agree on the scope of the review
- The technical architecture and security docs from the buyer package

I will not provide:
- Database credentials or Supabase service role keys before escrow payment
- Admin panel login credentials before escrow payment
- Write access to any production resource

Once a formal process is agreed (NDA or escrow step initiated), I am happy to
arrange a time-limited read-only review of the full codebase.

Does that work for you?

Kind regards,
[Your name]
CorridorWork

---

## Notes for the founder

- Answer technical questions in writing only — do not do live screen shares that
  expose admin credentials or Supabase connection strings.
- If asked about test count: say "latest test suite passed" — do not cite a specific
  number that may become outdated.
- If asked about performance: the site is live at corridorwork.com — they can
  evaluate it directly.
- See `red-lines.md` for what not to share and when.
