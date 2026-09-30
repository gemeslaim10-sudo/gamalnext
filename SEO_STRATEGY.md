# GTech — SEO, GEO & entity strategy

Site: https://gamaltech.info · Brand: **GTech** · Owner: **Gamal Abdelaty** (founder) · Stack: Next.js 16 (App Router, static pages + no-expiry cache), Firestore, dashboard at `/admin`.

---

## 1. Problems found (audit, 2026-09-30)

| Area | Finding |
|---|---|
| Indexing | A web search for `site:gamaltech.info` returned **no pages at all**. The site is barely indexed, so no keyword can rank yet. Google's status must be read in Search Console. |
| Brand ambiguity | "Gamal Tech" is already used by YouTube tech channels; "GTech"/"G-Tech" is a generic name used by several companies (e.g. GAM Tech in Canada). The brand query alone can't be won soon. |
| Owner identity | The owner's name appeared in three forms: **Gamal Abdelaty** (site settings, articles), **Gamal Selim** (Google account, LinkedIn URL `gamalselim10`, the member page `/users/…`) and **Gamal Sabeh** (the CV builder). Search engines couldn't connect them. |
| Commercial intent | No page targeted what clients search ("custom ERP Egypt", «برمجة نظام ERP»). Services existed only as cards on `/skills`, whose title started with "Services…" (competing with any future services page). |
| Home page | The only H1 was the owner's name; nothing said what the business does. |
| Language | Public content was English only, while the market (Egypt) searches mostly in Arabic. |
| URLs | Articles lived at database ids (`/articles/OOKByZsC5ejBnosHNGX7`). |
| Projects | 12 of 13 projects have no description; all shared one generic meta description. The projects page title promised "ERP, CRM" projects that don't exist in the portfolio. |
| Author entity | The owner's articles linked to `/users/{uid}` titled "Gamal Selim", not to the person page. |
| Facts | Business summary, AI intro, hero, bio and a service card still offered "WordPress sites", which the current offer no longer includes. |
| Hosting config | `www.gamaltech.info` redirects with **307** (temporary). It should be 308/301 (Vercel domain setting). |
| Off-site | No backlinks found and no Google Business Profile, the two biggest ranking factors for a young local business. |

Already fine before this work (from earlier rounds): HTTPS and http→https 308, robots.txt with private paths blocked, dynamic XML sitemap, canonical URLs, 404 status on unknown pages, Search Console verification meta, JSON-LD LocalBusiness/Person/WebSite graph, `llms.txt`/`llms-full.txt`, RSS, IndexNow, fast static pages with a no-expiry cache, noindex on the CV builder.

## 2. What was fixed

- **Service landing pages**: `/services` + 6 service pages, and the same in Arabic under `/ar/services`, with `hreflang` pairs, unique titles, descriptions, H1s, FAQ, prices and internal links. All texts live in Firestore (`site_content/services`) and are edited at **/admin/services** (seeded with the content below).
- **Entity**: "GTech by Gamal Abdelaty" in the home title; `/profile` is the person page (H1 = the owner's name); `Person.alternateName` lists the other real forms of the name (editable in /admin/seo → Business → Identity); the owner's articles credit the Person entity and link to `/profile`; the owner's member page is `noindex` and out of the sitemap.
- **Home page**: a real H1 ("Custom ERP, CRM and business software, built around how your company works"), an answer-first line, and links to every service page (editable in /admin/copy → Home).
- **Navigation**: "Services" added to the main menu; service cards on `/skills` and `/profile` link to their pages; each priced item on `/pricing` links to its service page ("Learn more").
- **Articles**: readable slugs (`/articles/before-you-buy-an-erp`); old id links 308-redirect to them; a "How GTech can help" box links each article to its service pages; a slug field in the dashboard article editor.
- **Projects**: optional case-study fields in the project editor (challenge, solution, key features, real results) rendered as sections; a factual meta description per project from its own data; "Related services" links; `CreativeWork.about` → the services.
- **Page intents fixed**: `/skills` → "Skills & Technologies"; `/projects` → "Projects: Websites, Web Apps & Online Stores"; `/pricing` H1 → "Prices for websites, apps and business software".
- **Facts made consistent**: WordPress removed from the business summary, AI intro, hero, bio and the "Websites" card; AI facts updated (USD prices, service pages).
- **GEO**: `llms.txt` lists every service page (English + Arabic links); `llms-full.txt` includes each service's intro and FAQ.

## 3. Entity strategy

One organization, one person, consistently linked:

- **Organization** (`LocalBusiness`, `@id` …/#organization): name "GTech", alternate names "G Tech, GTech Egypt", founder → Person, Cairo/Egypt, phone/WhatsApp, `sameAs` (GitHub, LinkedIn + profiles added in /admin/seo), `knowsAbout` = the service names, offer catalog from `/pricing`.
- **Person** (`@id` …/#person): "Gamal Abdelaty", `alternateName` = "Gamal Selim", «جمال عبد العاطي», «جمال سليم», job title, bio, `worksFor` → GTech, `sameAs` → GitHub/LinkedIn.
- **Where the relationship shows**: home title (`GTech by Gamal Abdelaty: …`), home intro line, `/profile` H1 + title (`Gamal Abdelaty: Business Analyst & Software Engineer | GTech`), service intros ("GTech, run by Gamal Abdelaty…"), article bylines and BlogPosting author, llms.txt intro.
- **Rule**: use "Gamal Abdelaty" as the public name everywhere; other spellings only as `alternateName`. Don't rename project/client data.

## 4. Keyword and topic clusters

| Cluster | English focus | Arabic focus |
|---|---|---|
| Custom ERP | custom ERP development Egypt, custom ERP system, ERP for trading/distribution | برمجة نظام ERP، نظام ERP مخصص، برنامج إدارة شركة، نظام مخزون ومبيعات |
| CRM | custom CRM development, sales pipeline system, WhatsApp CRM | برمجة نظام CRM، نظام إدارة العملاء، متابعة العملاء |
| Custom software | custom business software, web application development Egypt, internal dashboard, booking system | برمجة أنظمة للشركات، تطبيقات ويب مخصصة، نظام حجوزات |
| Business analysis | business analysis for software projects, software requirements | تحليل الأعمال، تحليل متطلبات الأنظمة |
| Websites | company website development Egypt, landing page, portfolio website | تصميم مواقع شركات، برمجة مواقع للشركات، صفحة هبوط |
| Shopify | Shopify store setup, Shopify theme development, Arabic Shopify theme | إنشاء متجر Shopify، تصميم ثيم Shopify، متجر شوبيفاي بالعربي |
| Brand/person | GTech Egypt, Gamal Abdelaty, Gamal Selim | جمال عبد العاطي، جمال سليم |

These are directions, not strings to repeat: each page uses its cluster naturally in the H1, intro, headings and FAQ.

## 5–6. Search intent per page and service architecture

| Page / URL | Primary search intent | Secondary topics | Title | H1 | Index | Schema | Internal links |
|---|---|---|---|---|---|---|---|
| `/` | Brand + "custom business software" | ERP, CRM, websites, Shopify | GTech by Gamal Abdelaty: Custom ERP, CRM & Business Software | Custom ERP, CRM and business software, built around how your company works | index | LocalBusiness, Person, WebSite | all 6 services, /services, feed → projects/articles |
| `/services` | "software development services Egypt" | list of services | Software Development Services: ERP, CRM, Web & Shopify \| GTech | Business software, websites and Shopify development | index, hreflang en/ar | CollectionPage + ItemList(Service), Breadcrumb | each service, /ar/services |
| `/services/custom-erp-development` | custom ERP development Egypt | ERP vs ready-made, ERP cost, Arabic ERP | Custom ERP Development in Egypt \| GTech | Custom ERP development for growing companies | index, hreflang | WebPage, Service(+Offer), FAQPage, Breadcrumb | pricing, ERP article, other services, contact |
| `/services/crm-development` | custom CRM development | WhatsApp CRM, pipeline, follow-ups | Custom CRM Development in Egypt \| GTech | Custom CRM development for sales teams | index, hreflang | same | pricing, CRM article, other services |
| `/services/custom-software-development` | custom software / web app development Egypt | dashboards, booking systems, mobile apps, WhatsApp API | Custom Software & Web App Development in Egypt \| GTech | Custom software and web applications for your business | index, hreflang | same | related projects (dashboards), pricing |
| `/services/business-analysis` | business analysis for software projects | requirements, scope, discovery | Business Analysis for Software Projects in Egypt \| GTech | Business analysis before you build software | index, hreflang | same | BA article, ERP/CRM pages |
| `/services/website-development` | company website development Egypt | landing pages, portfolios, custom stores | Company Website Development in Egypt \| GTech | Website development for companies and professionals | index, hreflang | same | website projects, website + hosting articles, packages |
| `/services/shopify-development` | Shopify store setup / theme development | Arabic Shopify, custom theme | Shopify Store & Theme Development in Egypt \| GTech | Shopify store setup and theme development | index, hreflang | same | Shopify article, Shopify prices |
| `/ar/services` + `/ar/services/*` | the same intents in Arabic (see §4) | — | Arabic titles (e.g. برمجة نظام ERP مخصص للشركات في مصر \| GTech) | Arabic H1s | index, hreflang ar↔en | same, `inLanguage: ar` | Arabic service pages, English version |
| `/profile` | the owner (name queries) | founder of GTech, reviews | Gamal Abdelaty: Business Analyst & Software Engineer \| GTech | Gamal Abdelaty | index | ProfilePage → Person | services, projects, articles |
| `/projects` | portfolio / "GTech projects" | websites, web apps, stores | Projects: Websites, Web Apps & Online Stores \| GTech | Projects | index | CollectionPage + ItemList | each project |
| `/projects/{slug}` | the project name + its type | its technologies | {Project} \| GTech | {Project} | index | CreativeWork (about → services), Breadcrumb | related services, related projects |
| `/skills` | skills / tech stack | tools, software | Skills & Technologies \| GTech | Skills | index | WebPage, Service list | service pages via cards |
| `/articles` | blog about business software | ERP, CRM, websites | Blog — Business Systems, ERP, CRM & Web Development \| GTech | Blog | index | Blog, Breadcrumb | each article |
| `/articles/{slug}` | the article's question | its tags | article title | article title | index | BlogPosting (author → Person, about → services) | related services, related articles |
| `/pricing` | "website/ERP/CRM prices" | packages, mobile apps | Prices — Websites, Online Stores, Hosting, ERP & CRM \| GTech | Prices for websites, apps and business software | index | WebPage, Service+Offer, FAQPage | service pages ("Learn more") |
| `/contact` | contact GTech | phone, WhatsApp | Contact — Call or WhatsApp … \| GTech | Contact | index | ContactPage | — |
| `/users/{id}` | member author pages | — | member name | member name | index (owner's own: noindex) | — | their articles |
| `/gamal-cv`, `/admin/*`, `/write`, `/settings`, `/api/*` | private/tools | — | — | — | noindex / disallowed | — | — |

**Service page structure** (one template, unique content per service): breadcrumb → H1 → answer-first intro → who it's for → problems it solves → what's included → process steps → FAQ → (side) starting prices from `/pricing` + request button → related projects (matched by keywords) → related articles (matched by tags) → CTA → other services. Adding a service = /admin/services → "إضافة خدمة" (created hidden, published when its texts are written).

## 7. Case-study strategy

Projects already have their own crawlable URLs. To turn them into case studies, fill the new optional fields in **/admin/projects → project → دراسة الحالة**: the challenge, the solution, key features (one per line) and results (real numbers only). Each filled field becomes an H2 section. Priority: projects with real business workflows (e.g. **Ashbal Academy** — academies/coaches management, **Almotaheda**, **Insight Design**), then the stores. Never invent outcomes; a clear problem → solution → features story ranks well for long-tail searches ("sports academy management system", «نظام إدارة أكاديمية رياضية»).

## 8. Internal linking

Home → every service page (chips) + /services. Menu → /services. Service → related projects, related articles, other services, pricing, contact. Article → its service pages ("How GTech can help") + related articles. Project → related services + related projects. Skills/profile cards → service pages. Pricing items → service pages. Anchors are descriptive service names, not repeated exact-match phrases.

## 9. Structured data

Site-wide: `LocalBusiness` (+ ContactPoint, OfferCatalog), `Person` (+ alternateName, sameAs), `WebSite`. Per page: `WebPage`/`CollectionPage`/`ProfilePage`/`ContactPage`, `BreadcrumbList`, `Service` with `Offer` (`priceSpecification.minPrice` for "from" prices), `FAQPage` (service pages, pricing), `BlogPosting` (author → Person, about → Service), `CreativeWork` (projects, about → Service), `ItemList`. All JSON-LD validated in the local build (0 parse errors, one graph per page, shared `@id`s, no duplicates).

## 10. Technical SEO changes

Sitemap: service pages in both languages with `xhtml:link` alternates; article slug URLs; owner member page removed. Metadata: `alternates.languages` (en, ar, x-default) on service pages, `og:locale` ar_EG on Arabic pages. Redirects: article id → slug (308). Every indexable page: 200, one H1, unique title (≤ 60–65 chars incl. "| GTech" for service pages), description, canonical. Crawled every sitemap URL plus test pages (42 URLs, 40 of them indexable) and 45 internal links: 0 errors, 0 broken links, 0 duplicate titles. Pages stay static (SSG) and cached; no new client JavaScript on public pages except the existing request button.

## 11. GEO (AI search)

Answer-first intros ("A custom ERP is…"), question headings and concise FAQ answers on every service page; consistent facts (who, what, where, prices in USD, contact) across structured data, `llms.txt`, `llms-full.txt` and page copy; services have stable URLs in both languages; the owner entity has one name plus declared alternates.

## 12. Recommended future articles (quality over quantity)

1. What is a custom ERP system? (EN + AR)
2. Custom ERP vs ready-made ERP (Odoo & co.): how to decide
3. ERP vs CRM: what's the difference and which comes first
4. How much does custom ERP development cost in Egypt?
5. When does a company need custom software instead of SaaS?
6. How to choose a clinic / academy management system
7. WhatsApp Business API for sales teams: what it can automate
8. Arabic (RTL) Shopify stores: common problems and fixes

Write the Arabic ones as real Arabic articles (not translations), 800–1,500 words, one question per article, each linking to its service page.

## 13. Manual actions (need the owner)

1. **Merge the branch** so the new pages go live.
2. **Google Search Console**: submit `https://gamaltech.info/sitemap.xml`; URL Inspection → request indexing for `/`, `/services`, the 6 service pages, `/ar/services` and the Arabic pages.
3. **Bing Webmaster Tools**: sign in, import the site from Search Console, submit the sitemap (Bing feeds ChatGPT search and Copilot). Then use /admin/seo → Indexing → IndexNow to push all URLs.
4. **Google Business Profile**: create "GTech" (service-area business, Cairo), category "Software company", same phone and website, services list. This is the strongest local signal.
5. **One name everywhere**: use "Gamal Abdelaty" (or decide on one) on LinkedIn, GitHub, Facebook/Instagram and the CV (`/gamal-cv` shows "Gamal Sabeh"); every profile should link to gamaltech.info. Edit the other names in /admin/seo → Business → Identity.
6. **Backlinks**: ask each client to add "Website by GTech" linking to gamaltech.info in their footer; list GTech on directories (Clutch, GoodFirms, DesignRush, Egyptian business directories), LinkedIn company page, GitHub profile README.
7. **Vercel → Domains**: make `www.gamaltech.info` redirect permanently (308) to `gamaltech.info` (it's 307 now).
8. **Project case studies**: fill the case-study fields for your best 3–4 projects.
9. **Firestore rules** (from the previous round) are still not published.

## 14. Search Console after deployment

Verification is already in place (meta tag `google-site-verification` is set in /admin/seo → Verification). After merge: Sitemaps → add `sitemap.xml` → check "Success"; Pages report → watch "Discovered/Crawled – currently not indexed" shrink; URL Inspection on each service page (EN + AR) → "Request indexing"; Enhancements → check Breadcrumbs/FAQ are valid; International targeting is handled by hreflang (no manual setting).

## 15. How to evaluate (next 1–3 months)

- **Weeks 1–2**: pages indexed (Pages report), brand + name queries start showing impressions; Bing `site:` search returns pages.
- **Month 1**: impressions for service queries (Performance → Queries filtered by "erp", "crm", "shopify", «نظام»); average position under 50 is progress for a new site.
- **Months 2–3**: clicks on service pages, leads with source "صفحات الخدمات" in /admin/leads, Arabic queries growing.
- Track per page: impressions, clicks, CTR, average position; improve the titles/descriptions (in /admin/services) of pages with impressions but low CTR; add FAQs for real questions people search.
