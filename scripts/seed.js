require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Insight = require('../models/Insight');
const SiteSettings = require('../models/SiteSettings');
const PageHero = require('../models/PageHero');
const ContentItem = require('../models/ContentItem');

// ─── HEROES ────────────────────────────────────────────────────────────────────
const HEROES = [
  {
    page: 'home',
    label: "India's Leading Franchise Expansion & Advisory Platform",
    title: 'Good businesses deserve',
    titleHighlight: 'more than random expansion.',
    subtitle: 'XPAND helps brands become investor-ready, scale through structured franchising, and align with commercially serious investors looking for profitable franchise opportunities in India.',
    backgroundImage: '',
    ctaText: 'Discuss Your Requirement',
    ctaLink: '/contact',
  },
  {
    page: 'for-brands',
    label: 'For Brands',
    title: 'Expand with structure.',
    titleHighlight: 'Scale with clarity.',
    subtitle: 'XPAND helps brands grow through strategic expansion planning, market alignment, operational structure, and on-ground execution support.',
    backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80',
    ctaText: 'Start Expanding',
    ctaLink: '/contact',
  },
  {
    page: 'for-investors',
    label: 'Investor Intelligence',
    title: 'Why Investors Work With',
    titleHighlight: 'XPAND Bharat',
    subtitle: "India's franchise sector is growing fast. Most platforms throw opportunities at investors and hope something sticks. XPAND Bharat does the opposite — we curate, structure, and align franchise businesses with investors who are commercially serious about long-term growth across India.",
    backgroundImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'Explore Opportunities',
    ctaLink: '/growth-opportunities',
  },
  {
    page: 'growth-opportunities',
    label: 'Growth Opportunities',
    title: 'Businesses built',
    titleHighlight: 'to scale.',
    subtitle: "Curated, expansion-ready business opportunities across India's fastest-growing sectors — screened for commercial viability and structural readiness.",
    backgroundImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    ctaText: '',
    ctaLink: '',
  },
  {
    page: 'our-approach',
    label: 'Our Approach',
    title: 'Good businesses deserve',
    titleHighlight: 'more than random expansion.',
    subtitle: 'XPAND helps brands become investor-ready, scale through structured franchising, and align with commercially serious investors looking for profitable franchise opportunities in India.',
    backgroundImage: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&q=80',
    ctaText: '',
    ctaLink: '',
  },
  {
    page: 'industries',
    label: 'Industries',
    title: 'Industries we help scale',
    titleHighlight: 'through expansion.',
    subtitle: 'Whether you are exploring how to expand your brand through franchising or looking for investor-ready franchise opportunities in India, XPAND provides structured franchise business advisory, franchise expansion support, investor alignment, and execution-led growth strategy under one framework.',
    backgroundImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
    ctaText: '',
    ctaLink: '',
  },
  {
    page: 'about',
    label: 'About XPAND Bharat',
    title: 'Built around one belief.',
    titleHighlight: 'Growth must be structured.',
    subtitle: 'XPAND Bharat is a premium franchise expansion and investment consulting company that connects brands with investors through disciplined systems, commercial clarity, and execution-led movement.',
    backgroundImage: 'https://images.unsplash.com/photo-1497366754035-f200968a677a?auto=format&fit=crop&w=1600&q=80',
    ctaText: '',
    ctaLink: '',
  },
  {
    page: 'insights',
    label: 'Growth Insights',
    title: 'Perspectives on growth,',
    titleHighlight: 'expansion and execution.',
    subtitle: 'Franchise growth, market trends, investor perspectives, and strategic content for serious business professionals.',
    backgroundImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80',
    ctaText: '',
    ctaLink: '',
  },
  {
    page: 'contact',
    label: 'Start a Conversation',
    title: "Let's start the right",
    titleHighlight: 'business conversation.',
    subtitle: 'Whether you are exploring expansion, investment opportunities, or strategic partnerships — XPANDBHARAT is ready to move the conversation forward.',
    backgroundImage: 'https://images.unsplash.com/photo-1497366754035-f200968a677a?auto=format&fit=crop&w=1600&q=80',
    ctaText: '',
    ctaLink: '',
  },
];

// ─── CONTENT ITEMS — mirrors the live frontend exactly ──────────────────────────
const CONTENT = [
  // ── HOME: pillars (Our Philosophy)
  { page: 'home', section: 'pillars', order: 1, title: 'Diagnose',  description: 'Before businesses scale, they need clarity.' },
  { page: 'home', section: 'pillars', order: 2, title: 'Structure', description: 'Good businesses often fail at expansion because they are not structured for franchising.' },
  { page: 'home', section: 'pillars', order: 3, title: 'Align',     description: 'The right investors matter more than a larger database.' },
  { page: 'home', section: 'pillars', order: 4, title: 'Execute',   description: 'Franchise growth rarely scales through introductions alone.' },
  { page: 'home', section: 'pillars', order: 5, title: 'Scale',     description: 'Opening more outlets is easy.' },

  // ── HOME: photo-cards
  { page: 'home', section: 'photo-cards', order: 1, tag: 'For Brands',    title: 'Expand with Structure', subtitle: 'Franchise and market expansion',  imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=700&q=80', link: '/for-brands' },
  { page: 'home', section: 'photo-cards', order: 2, tag: 'For Investors', title: 'Invest with Clarity',   subtitle: 'Curated business opportunities',   imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=700&q=80', link: '/for-investors' },
  { page: 'home', section: 'photo-cards', order: 3, tag: 'Opportunities', title: 'Growth at Scale',       subtitle: 'Scalable business models',         imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=80', link: '/growth-opportunities' },
  { page: 'home', section: 'photo-cards', order: 4, tag: 'Our Approach',  title: 'Structured Execution',  subtitle: 'Five-stage growth framework',      imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=700&q=80', link: '/our-approach' },

  // ── FOR-BRANDS: services
  { page: 'for-brands', section: 'services', order: 1, tag: 'Franchise Ready', title: 'Franchise Expansion', description: 'Structured franchise expansion designed for scalable and sustainable business growth across India.',                          imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=300&q=80' },
  { page: 'for-brands', section: 'services', order: 2, tag: 'Market Mapping',  title: 'Territory Planning',  description: 'Identifying the right cities, markets, and geographies for disciplined, data-backed expansion.',                              imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80' },
  { page: 'for-brands', section: 'services', order: 3, tag: 'Multi-Channel',   title: 'Channel Development', description: 'Building organised channel and distribution frameworks for stronger market reach and brand presence.',                       imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=300&q=80' },
  { page: 'for-brands', section: 'services', order: 4, tag: 'Partner Network', title: 'Partner Acquisition', description: 'Connecting brands with commercially aligned franchise and business partners across tier-1 and tier-2 cities.',                imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=300&q=80' },
  { page: 'for-brands', section: 'services', order: 5, tag: 'Growth Planning', title: 'Expansion Strategy',  description: 'Growth-focused expansion plans built around real scalability, unit economics, and operational clarity.',                      imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=300&q=80' },
  { page: 'for-brands', section: 'services', order: 6, tag: 'Full Support',    title: 'Rollout Support',     description: 'End-to-end support for onboarding, coordination, and execution from day one through full rollout.',                          imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=300&q=80' },

  // ── FOR-BRANDS: why-us
  { page: 'for-brands', section: 'why-us', order: 1, badge: '01', title: 'We Do Not Just Generate Franchise Leads. We Help Close Expansion Opportunities.', description: 'Most franchise consulting firms stop at introductions. XPAND helps businesses move from investor interest to commercially aligned expansion through investor counseling, follow-ups, franchise alignment, and execution support.' },
  { page: 'for-brands', section: 'why-us', order: 2, badge: '02', title: 'Qualified Investors Matter More Than Large Databases.', description: 'A business does not need 500 random inquiries. It needs the right investors. XPAND focuses on franchise investor alignment through structured lead generation, investor mapping, CRM-led tracking, and commercially relevant franchise opportunities designed around actual business scalability.' },
  { page: 'for-brands', section: 'why-us', order: 3, badge: '03', title: 'Good Businesses Often Fail At Expansion Because They Are Not Investor-Ready.', intro: 'Many businesses are operationally successful but commercially unstructured for franchising. XPAND helps brands with:', items: ['franchise business structuring', 'investor-ready proposals', 'franchise rollout strategy', 'expansion planning', 'market positioning', 'franchise growth systems before investor conversations even begin.'] },
  { page: 'for-brands', section: 'why-us', order: 4, badge: '04', title: 'Franchising Is Not Just Expansion. It Is Controlled Expansion.', description: 'Opening multiple locations without operational structure creates inconsistency very quickly. XPAND helps businesses scale through structured franchise expansion systems designed around operational scalability, franchise governance, investor alignment, and commercially sustainable growth across India.' },
  { page: 'for-brands', section: 'why-us', order: 5, badge: '05', title: 'We Understand Investor Psychology, Not Just Franchise Consulting.', intro: 'A 40+ business owner investing ₹50 lakh to ₹2 crore is not casually "exploring opportunities." They are comparing:', items: ['franchise investments', 'real estate', 'mutual funds', 'independent businesses', 'expansion risk', 'long-term scalability.'], closing: "XPAND's investor counseling and telesales-driven approach helps businesses communicate stronger commercial clarity to serious investors looking for structured franchise investment opportunities in India." },

  // ── FOR-INVESTORS: offerings
  { page: 'for-investors', section: 'offerings', order: 1, tag: 'Curated Access',  title: 'Business opportunities built for serious investors.',  description: 'Handpicked, commercially verified opportunities across scalable sectors and expansion-ready business models.',                                  imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=80' },
  { page: 'for-investors', section: 'offerings', order: 2, tag: 'Market Clarity',  title: 'Understand the model before you commit.',              description: 'We give you a clear picture of unit economics, market direction, and expansion potential — before any decision is made.',                     imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=700&q=80' },
  { page: 'for-investors', section: 'offerings', order: 3, tag: 'Strategic Match', title: 'The right opportunity matched to the right investor.', description: 'We align business opportunities with investors who share the same commercial direction and long-term growth mindset.',                        imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=700&q=80' },
  { page: 'for-investors', section: 'offerings', order: 4, tag: 'Proven Models',   title: 'Expansion-ready businesses with real fundamentals.',   description: 'Every business we present is screened for scalability, operational structure, and genuine growth readiness.',                                imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=700&q=80' },
  { page: 'for-investors', section: 'offerings', order: 5, tag: 'Growth Sectors',  title: 'Sectors chosen for their expansion trajectory.',       description: "F&B, retail, services, EdTech, health — opportunities in India's fastest-growing industries with proven demand.",                          imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=700&q=80' },
  { page: 'for-investors', section: 'offerings', order: 6, tag: 'Full Support',    title: 'We stay involved until the investment moves forward.', description: 'From initial conversation to final commitment, our team ensures every investor-brand engagement is handled with structure and accountability.', imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=700&q=80' },

  // ── FOR-INVESTORS: stats
  { page: 'for-investors', section: 'stats', order: 1, title: 'India',    description: 'Franchise economy being built right now. Are you positioned inside it?' },
  { page: 'for-investors', section: 'stats', order: 2, title: '#1',       description: 'Franchise Advisory Partner in India' },
  { page: 'for-investors', section: 'stats', order: 3, title: '500+',     description: 'Expansion-ready franchise businesses evaluated' },
  { page: 'for-investors', section: 'stats', order: 4, title: 'PanIndia', description: 'Tier-1, Tier-2 & emerging market coverage' },

  // ── FOR-INVESTORS: why-us
  { page: 'for-investors', section: 'why-us', order: 1, badge: '01', title: 'We Only Bring You Businesses Built To Last', subtitle: 'Not every business deserves your capital. After decades of building wealth, you know the difference between a business with energy and a business with systems. XPAND works exclusively with franchise businesses that demonstrate operational structure, market-proven demand, scalability across locations, and commercially sustainable growth — before they ever reach you.' },
  { page: 'for-investors', section: 'why-us', order: 2, badge: '02', title: 'Your Goals Come First. Opportunities Come Second.', subtitle: "A 500-option listing is not an alignment. It's homework. XPAND doesn't hand you a catalogue and walk away. We understand your investment goals, sector preference, capital appetite, and growth horizon; then align you with franchise opportunities built around your commercial intent. Right sector. Right model. Right market. Right fit. Because at this stage of your journey, your time is the most valuable asset in the room." },
  { page: 'for-investors', section: 'why-us', order: 3, badge: '03', title: 'Why Franchise Over Stocks, Real Estate, or Mutual Funds?', subtitle: "The question every sharp investor is already asking. Franchise businesses offer something most asset classes can't — an operational system you don't have to build from scratch, a brand customers already trust, and a scalable growth model designed for multi-location expansion. XPAND helps you navigate India's franchise investment landscape with clarity — comparing models, evaluating structures, and identifying opportunities with real commercial depth." },
  { page: 'for-investors', section: 'why-us', order: 4, badge: '04', title: 'We Stay In The Room Until The Deal Is Done', subtitle: "Not a platform. A partner. Most portals stop at the introduction. XPAND stays involved through investor counselling, business alignment, commercial discussions, follow-ups, and execution support — every step of the franchise expansion journey. We don't disappear after the first meeting. Because the real work begins after hello." },
  { page: 'for-investors', section: 'why-us', order: 5, badge: '05', title: 'Built For Investors Who Think In Decades, Not Quarters', subtitle: "Food. Retail. Lifestyle. Electronics. Emerging Categories. Whether you're looking at food franchise expansion in Tier-1 cities, retail franchise opportunities across India, or emerging consumer category businesses built for the next decade; XPAND focuses on one thing: helping serious investors participate in commercially scalable franchise businesses backed by structure, planning, and execution-led growth." },

  // ── GROWTH-OPPORTUNITIES: categories
  { page: 'growth-opportunities', section: 'categories', order: 1, tag: 'Food and Beverage',    title: 'F&B Expansion',            description: 'From QSR chains to cloud kitchens — high-velocity expansion opportunities with proven models and strong unit economics.', imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80' },
  { page: 'growth-opportunities', section: 'categories', order: 2, tag: 'Retail and Lifestyle', title: 'Retail Formats',           description: 'Brand-driven retail scaling across tier-1 and tier-2 cities with hybrid models and strong brand loyalty.',                imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80' },
  { page: 'growth-opportunities', section: 'categories', order: 3, tag: 'Service Businesses',    title: 'Service Sector',           description: 'Recurring revenue, low capex, and strong scalability across defensible service business categories.',                     imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80' },
  { page: 'growth-opportunities', section: 'categories', order: 4, tag: 'Emerging Brands',       title: 'Growth Stage',             description: 'Growth-ready businesses with proven models seeking strategic alignment, capital, and expansion support.',                  imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80' },
  { page: 'growth-opportunities', section: 'categories', order: 5, tag: 'Franchise',             title: 'Franchise Models',         description: 'Structured franchise systems with defined operations, proven replication, and disciplined rollout support.',              imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80' },
  { page: 'growth-opportunities', section: 'categories', order: 6, tag: 'Multi-Market',          title: 'Expansion-Led Businesses', description: 'Businesses positioned for pan-India multi-market growth with long-term operational scalability.',                        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80' },

  // ── GROWTH-OPPORTUNITIES: differentiators
  { page: 'growth-opportunities', section: 'differentiators', order: 1, badge: '01', title: 'Commercially aligned models',  description: 'Every opportunity is positioned around real commercial logic — not just market potential.' },
  { page: 'growth-opportunities', section: 'differentiators', order: 2, badge: '02', title: 'Scalable business structure',   description: 'Built to replicate across markets without losing operational discipline or brand integrity.' },
  { page: 'growth-opportunities', section: 'differentiators', order: 3, badge: '03', title: 'Growth-focused from day one',   description: 'We only present businesses that are genuinely positioned for expansion — not just growth-stage hopefuls.' },
  { page: 'growth-opportunities', section: 'differentiators', order: 4, badge: '04', title: 'Expansion readiness verified',  description: 'Operational, financial, and structural readiness is assessed before any opportunity reaches an investor.' },
  { page: 'growth-opportunities', section: 'differentiators', order: 5, badge: '05', title: 'Execution support included',    description: 'We stay involved after the match — from initial conversations to final commitment and rollout.' },

  // ── OUR-APPROACH: steps (The XPAND Franchise Expansion Framework)
  { page: 'our-approach', section: 'steps', order: 1, badge: '01', title: 'Understand', description: 'We understand the brand, category, operational model, expansion ambitions, funding needs, and target market.' },
  { page: 'our-approach', section: 'steps', order: 2, badge: '02', title: 'Structure',  description: 'Once onboarded, XPAND helps your brand become a successful franchise business by helping you with structured proposals and expansion documentation.', quote: 'Structure is everything. It cuts through ambiguity.' },
  { page: 'our-approach', section: 'steps', order: 3, badge: '03', title: 'Align',      description: 'Once we have your needs mapped, we align you with qualified investors from our database that match your investor expectations and brand requirements because the goal is to create trusted long-term partnerships.' },
  { page: 'our-approach', section: 'steps', order: 4, badge: '04', title: 'Execute',    description: 'Our job does not end at matching your franchise goals with investors. Rather, we support you throughout the deal by taking care of legal compliance, deal alignment, follow-ups, and closure assistance.' },
  { page: 'our-approach', section: 'steps', order: 5, badge: '05', title: 'Scale',      description: 'We map out how many outlets you can open now and in the future with investor assistance, supporting long-term growth through helping your franchise business scale sustainably.' },

  // ── OUR-APPROACH: principles (Five principles. One direction. → Our Expansion Framework)
  { page: 'our-approach', section: 'principles', order: 1, badge: '01', title: 'Diagnose',  intro: 'Before businesses scale, they need clarity.', lead: 'We understand:', items: ['the business model', 'operational strengths', 'expansion ambitions', 'market positioning', 'funding requirements', 'franchise scalability potential'], closing: 'because expansion decisions work better when the fundamentals are understood properly.' },
  { page: 'our-approach', section: 'principles', order: 2, badge: '02', title: 'Structure', intro: 'Good businesses often fail at expansion because they are not structured for franchising.', lead: 'XPAND helps build:', items: ['investor-ready proposals', 'franchise growth frameworks', 'rollout strategies', 'expansion positioning', 'commercial narratives', 'scalable business systems'], closing: 'designed for long-term franchise expansion across India.' },
  { page: 'our-approach', section: 'principles', order: 3, badge: '03', title: 'Align',     paras: ['The right investors matter more than a larger database.', 'Through franchise lead generation systems, CRM-led investor management, investor counseling, and commercially relevant alignment, XPAND helps businesses connect with qualified investors actively exploring franchise investment opportunities.'] },
  { page: 'our-approach', section: 'principles', order: 4, badge: '04', title: 'Execute',   paras: ['Franchise growth rarely scales through introductions alone.', 'From investor conversations and follow-ups to commercial coordination, onboarding support, and expansion movement, XPAND remains involved throughout the execution journey.', 'Because operational discipline matters once the real work begins.'] },
  { page: 'our-approach', section: 'principles', order: 5, badge: '05', title: 'Scale',     intro: 'Opening more outlets is easy.', lead: 'Building a commercially scalable franchise business across multiple cities requires:', items: ['operational consistency', 'expansion structure', 'investor clarity', 'disciplined rollout systems', 'long-term market scalability'], closing: 'which is exactly what XPAND Bharat focuses on building.' },

  // ── INDUSTRIES: sectors (flip cards)
  { page: 'industries', section: 'sectors', order: 1, badge: '01', title: 'Food & Beverage Franchises',     subtitle: 'QSR · Cloud Kitchens · Cafés · Restaurant Brands',           frontDesc: 'Helping cafés, QSRs, cloud kitchens, and restaurant brands scale through structured franchise expansion and investor-ready growth systems.', backStat: "McDonald's India is targeting nearly 600+ outlets across the country through aggressive franchise-led expansion, proving how scalable structured food franchise systems can become in India's growing consumer market.", backDesc: 'XPAND helps cafés, QSRs, cloud kitchens, and regional food brands structure investor-ready franchise opportunities designed for scalable expansion across Indian cities.' },
  { page: 'industries', section: 'sectors', order: 2, badge: '02', title: 'Electronics & Consumer Retail',   subtitle: 'Consumer Electronics · Retail Chains · Multi-brand Outlets',  frontDesc: 'Supporting electronics and retail businesses looking to expand across cities through commercially aligned franchise opportunities.', backStat: 'Croma has already scaled to 540+ stores across 200+ Indian cities through structured retail expansion and multi-market growth systems backed by operational consistency and brand trust.', backDesc: 'XPAND helps electronics and retail businesses structure franchise expansion, investor alignment, and scalable rollout planning designed for long-term market growth.' },
  { page: 'industries', section: 'sectors', order: 3, badge: '03', title: 'Salon & Lifestyle Businesses',     subtitle: 'Salons · Wellness · Personal Care · Lifestyle Services',      frontDesc: 'Helping salon, wellness, and lifestyle brands structure scalable franchise growth models backed by investor alignment and expansion strategy.', backStat: 'Green Trends has expanded to 375+ salons across 50+ cities, showing how service-led franchise businesses continue scaling rapidly across India through repeat consumer demand and operational scalability.', backDesc: 'XPAND supports salon, wellness, and lifestyle brands through franchise business structuring, investor-ready positioning, and expansion-focused growth systems.' },
  { page: 'industries', section: 'sectors', order: 4, badge: '04', title: 'Fashion & Lifestyle Brands',       subtitle: 'Apparel · Accessories · Lifestyle Retail · Fashion Formats',  frontDesc: 'Helping fashion and lifestyle businesses structure scalable franchise growth models backed by investor alignment and expansion strategy.', backStat: 'Max Fashion has scaled to 510+ stores across 200+ Indian cities through structured retail growth, strong operational systems, and expansion-focused market penetration.', backDesc: 'XPAND helps fashion and retail brands expand through franchising by supporting franchise rollout strategy, investor alignment, expansion planning, and scalable business structuring across Indian markets.' },
  { page: 'industries', section: 'sectors', order: 5, badge: '05', title: 'Retail & Consumer Businesses',     subtitle: 'Regional Brands · Emerging Consumer · Specialty Retail',      frontDesc: 'From regional brands to emerging consumer businesses, XPAND supports expansion through franchising, market mapping, and investor connectivity.', backStat: 'Reliance SMART Bazaar operates 260 stores across 100+ Indian cities, demonstrating how structured retail expansion, operational standardization, and market-led growth can create a scalable national footprint.', backDesc: 'XPAND supports regional and consumer businesses through franchise expansion, market mapping, and investor connectivity across Indian markets.' },

  // ── INDUSTRIES: roadmap (Expansion Readiness Roadmap)
  { page: 'industries', section: 'roadmap', order: 1, badge: '01', tag: 'FOUNDATION',        title: 'Proven Business Model',            description: 'The business should already demonstrate operational consistency, customer demand, and market validation before expansion begins.' },
  { page: 'industries', section: 'roadmap', order: 2, badge: '02', tag: 'SYSTEMS',           title: 'Scalable Operations',              description: 'A business must be capable of replicating its operational systems, customer experience, and commercial performance across multiple locations.' },
  { page: 'industries', section: 'roadmap', order: 3, badge: '03', tag: 'MARKETS',           title: 'Market Expansion Potential',       description: 'We evaluate whether the business has the ability to scale across tier-1, tier-2, and emerging Indian markets through franchising.' },
  { page: 'industries', section: 'roadmap', order: 4, badge: '04', tag: 'VIABILITY',         title: 'Investor Viability',               lead: 'Businesses are assessed around:', items: ['investment attractiveness', 'operational sustainability', 'commercial clarity', 'franchise scalability', 'long-term growth potential'] },
  { page: 'industries', section: 'roadmap', order: 5, badge: '05', tag: 'EXECUTION',         title: 'Structured Franchise Expansion',   lead: 'XPAND helps structure:', items: ['franchise rollout strategy', 'investor-ready proposals', 'franchise positioning', 'market mapping', 'investor alignment', 'expansion planning'] },
  { page: 'industries', section: 'roadmap', order: 6, badge: '06', tag: 'EXECUTION SUPPORT', title: 'Expansion With Execution Support', paras: ['Growth is not just about finding investors. It is about building operationally scalable systems capable of sustaining long-term expansion across markets.', 'XPAND supports businesses through investor alignment, coordination, franchise expansion support, and commercially structured growth execution.'] },

  // ── INDUSTRIES: why-us (Why Businesses Choose XPAND Bharat)
  { page: 'industries', section: 'why-us', order: 1, badge: '01', title: 'We Do Not Just Generate Franchise Leads. We Help Close Expansion Opportunities.', description: 'Most franchise consulting firms stop at introductions. XPAND helps businesses move from investor interest to commercially aligned expansion through investor counseling, follow-ups, franchise alignment, and execution support.' },
  { page: 'industries', section: 'why-us', order: 2, badge: '02', title: 'Qualified Investors Matter More Than Large Databases.', description: 'A business does not need 500 random inquiries. It needs the right investors. XPAND focuses on franchise investor alignment through structured lead generation, investor mapping, CRM-led tracking, and commercially relevant franchise opportunities designed around actual business scalability.' },
  { page: 'industries', section: 'why-us', order: 3, badge: '03', title: 'Good Businesses Often Fail At Expansion Because They Are Not Investor-Ready.', intro: 'Many businesses are operationally successful but commercially unstructured for franchising. XPAND helps brands with:', items: ['franchise business structuring', 'investor-ready proposals', 'franchise rollout strategy', 'expansion planning', 'market positioning', 'franchise growth systems before investor conversations even begin.'] },
  { page: 'industries', section: 'why-us', order: 4, badge: '04', title: 'Franchising Is Not Just Expansion. It Is Controlled Expansion.', description: 'Opening multiple locations without operational structure creates inconsistency very quickly. XPAND helps businesses scale through structured franchise expansion systems designed around operational scalability, franchise governance, investor alignment, and commercially sustainable growth across India.' },
  { page: 'industries', section: 'why-us', order: 5, badge: '05', title: 'We Understand Investor Psychology, Not Just Franchise Consulting.', intro: 'A 40+ business owner investing ₹50 lakh to ₹2 crore is not casually "exploring opportunities." They are comparing:', items: ['franchise investments', 'real estate', 'mutual funds', 'independent businesses', 'expansion risk', 'long-term scalability.'], closing: "XPAND's investor counseling and telesales-driven approach helps businesses communicate stronger commercial clarity to serious investors looking for structured franchise investment opportunities in India." },

  // ── ABOUT: focus-areas (How We Work process)
  { page: 'about', section: 'focus-areas', order: 1, tag: 'YOU COME TO US', title: 'You Come to XPAND Bharat',             lead: 'We understand your:', items: ['business model', 'expansion vision', 'funding requirements', 'target cities', 'scalability potential'] },
  { page: 'about', section: 'focus-areas', order: 2, tag: 'WE MAP',         title: 'We Map Your Expansion Needs',         lead: 'Our team helps evaluate:', items: ['market opportunities', 'city-wise expansion potential', 'investor fit', 'commercial viability', 'rollout strategy'], closing: '…so the business is positioned for structured franchise growth.' },
  { page: 'about', section: 'focus-areas', order: 3, tag: 'WE PREPARE',     title: 'We Help You Become Investor-Ready',   lead: 'We create:', items: ['investor-ready business proposals', 'franchise growth frameworks', 'expansion positioning', 'commercial narratives', 'structured business presentations'], closing: '…designed to attract serious franchise investors.' },
  { page: 'about', section: 'focus-areas', order: 4, tag: 'WE CONNECT',     title: 'We Connect You With Qualified Investors', paras: ['Using our lead-generation systems, investor network, and telesales-driven investor counseling process, we help align your business with commercially relevant investors actively looking for profitable franchise opportunities.'] },
  { page: 'about', section: 'focus-areas', order: 5, tag: 'WE CLOSE',       title: 'We Support the Deal Till Closure',    paras: ['From investor alignment and coordination to execution support and commercial discussions, XPAND remains involved throughout the expansion journey to help move opportunities toward closure.'] },
];

// ─── INSIGHTS ──────────────────────────────────────────────────────────────────
const INSIGHTS = [
  { tag: 'Franchise Growth',       title: 'Why structure matters more than speed in franchise expansion.',                slug: 'why-structure-matters-more-than-speed-in-franchise-expansion',            excerpt: 'Most franchise failures stem not from poor products but from poor systems. The difference between a brand that scales and one that stalls is almost always structural.',             readTime: '6 min read', displayDate: 'May 2025',      img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80', status: 'published', order: 6 },
  { tag: 'Business Expansion',     title: 'The five signals that tell you a brand is expansion-ready.',                   slug: 'the-five-signals-that-tell-you-a-brand-is-expansion-ready',               excerpt: 'Not every business that wants to scale is ready to scale. Before expansion, a brand must pass five critical readiness tests that determine whether growth will be sustainable.',   readTime: '5 min read', displayDate: 'April 2025',    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', status: 'published', order: 5 },
  { tag: 'Investor Perspectives',  title: 'What smart investors look for before entering a franchise opportunity.',        slug: 'what-smart-investors-look-for-before-entering-a-franchise-opportunity',    excerpt: 'Investment in franchise businesses has surged, but so have the failures. Here is what distinguishes the opportunities worth backing from the ones worth walking away from.',       readTime: '7 min read', displayDate: 'April 2025',    img: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80', status: 'published', order: 4 },
  { tag: 'Market Trends',          title: 'Tier-2 India: the next frontier for brand expansion.',                         slug: 'tier-2-india-the-next-frontier-for-brand-expansion',                      excerpt: "The story of India's consumption growth is no longer just a metro story. Brands still ignoring tier-2 and tier-3 cities are missing the most significant opportunity.",          readTime: '8 min read', displayDate: 'March 2025',    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80', status: 'published', order: 3 },
  { tag: 'Execution & Governance', title: 'Building operational systems that scale without breaking.',                     slug: 'building-operational-systems-that-scale-without-breaking',                 excerpt: 'Operational systems are the backbone of every scalable business. Most businesses hit a ceiling not because of market limits but because of internal system limits.',               readTime: '5 min read', displayDate: 'March 2025',    img: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80', status: 'published', order: 2 },
  { tag: 'Business Expansion',     title: 'Commercial clarity: the most underrated competitive advantage.',                slug: 'commercial-clarity-the-most-underrated-competitive-advantage',             excerpt: 'When businesses have genuine commercial clarity — about their model, margins, unit economics, and customer — expansion becomes a structured movement, not a gamble.',              readTime: '6 min read', displayDate: 'February 2025', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', status: 'published', order: 1 },
];

// Pages whose content is fully managed by this seed. On reseed we replace these
// pages' items entirely so the DB always matches the live frontend exactly.
const SEEDED_PAGES = ['home', 'for-brands', 'for-investors', 'growth-opportunities', 'our-approach', 'industries', 'about'];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
  console.log('Connected to MongoDB\n');

  // Admin
  if (!(await Admin.findOne({ email: process.env.ADMIN_EMAIL }))) {
    await Admin.create({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, name: 'Xpand Bharat Admin' });
    console.log(`✓ Admin: ${process.env.ADMIN_EMAIL} / ${process.env.ADMIN_PASSWORD}`);
  } else { console.log('✓ Admin already exists'); }

  // Site Settings
  if (!(await SiteSettings.findOne())) {
    await SiteSettings.create({});
    console.log('✓ SiteSettings created');
  } else { console.log('✓ SiteSettings already exists'); }

  // Heroes — upsert (keeps any admin-uploaded background image untouched if present)
  for (const h of HEROES) {
    await PageHero.findOneAndUpdate({ page: h.page }, h, { upsert: true, new: true });
  }
  console.log(`✓ Heroes: ${HEROES.length} synced`);

  // Content — full replace for seeded pages so DB == frontend exactly
  await ContentItem.deleteMany({ page: { $in: SEEDED_PAGES } });
  await ContentItem.insertMany(CONTENT);
  console.log(`✓ Content items: ${CONTENT.length} synced across ${SEEDED_PAGES.length} pages`);

  // Insights — additive (don't clobber admin-authored posts)
  let insAdded = 0;
  for (const ins of INSIGHTS) {
    if (!(await Insight.findOne({ slug: ins.slug }))) { await Insight.create(ins); insAdded++; }
  }
  console.log(`✓ Insights: ${insAdded} added`);

  console.log('\n✅ Seed complete.');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
