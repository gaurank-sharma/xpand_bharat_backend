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
    label: 'Business Expansion Platform',
    title: 'Where brands meet investors.',
    titleHighlight: 'Structured growth, executed.',
    subtitle: 'XPANDBHARAT connects expansion-ready brands with aligned investors — through commercial clarity, disciplined structure, and real execution.',
    backgroundImage: '',
    ctaText: 'Start a Conversation',
    ctaLink: '/contact',
  },
  {
    page: 'for-brands',
    label: 'For Brands',
    title: 'Expand with structure.',
    titleHighlight: 'Scale with clarity.',
    subtitle: 'XPANDBHARAT helps brands grow through strategic expansion planning, market alignment, operational structure, and on-ground execution support.',
    backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80',
    ctaText: 'Start Expanding',
    ctaLink: '/contact',
  },
  {
    page: 'for-investors',
    label: 'For Investors',
    title: 'Invest with clarity.',
    titleHighlight: 'Grow with conviction.',
    subtitle: 'XPANDBHARAT gives investors access to commercially sound, expansion-ready business opportunities — pre-screened, structured, and execution-ready.',
    backgroundImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=900&q=80',
    ctaText: 'Explore Opportunities',
    ctaLink: '/contact',
  },
  {
    page: 'growth-opportunities',
    label: 'Growth Opportunities',
    title: 'Businesses built',
    titleHighlight: 'to scale.',
    subtitle: 'Curated, expansion-ready business opportunities across India\'s fastest-growing sectors — screened for commercial viability and structural readiness.',
    backgroundImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    ctaText: '',
    ctaLink: '',
  },
  {
    page: 'our-approach',
    label: 'Our Approach',
    title: 'Structure before speed.',
    titleHighlight: 'Clarity before commitment.',
    subtitle: 'Every engagement at XPANDBHARAT follows a disciplined, five-stage approach built around commercial clarity, structured alignment, and execution-led delivery.',
    backgroundImage: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&q=80',
    ctaText: '',
    ctaLink: '',
  },
  {
    page: 'industries',
    label: 'Industries',
    title: 'Sectors built for',
    titleHighlight: 'expansion.',
    subtitle: 'XPANDBHARAT operates across India\'s most scalable, commercially validated industries — each selected for proven growth fundamentals and real expansion potential.',
    backgroundImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    ctaText: '',
    ctaLink: '',
  },
  {
    page: 'about',
    label: 'About XPANDBHARAT',
    title: 'Built around one belief.',
    titleHighlight: 'Growth must be structured.',
    subtitle: 'XPANDBHARAT is a premium business expansion platform that connects brands with investors through disciplined systems, commercial clarity, and execution-led movement.',
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
    title: 'Let\'s start the right',
    titleHighlight: 'business conversation.',
    subtitle: 'Whether you are exploring expansion, investment opportunities, or strategic partnerships — XPANDBHARAT is ready to move the conversation forward.',
    backgroundImage: 'https://images.unsplash.com/photo-1497366754035-f200968a677a?auto=format&fit=crop&w=1600&q=80',
    ctaText: '',
    ctaLink: '',
  },
];

// ─── CONTENT ITEMS ─────────────────────────────────────────────────────────────
const CONTENT = [
  // ── HOME: stats
  { page: 'home', section: 'stats', order: 1, badge: '', title: '250+', subtitle: 'Projects Supported' },
  { page: 'home', section: 'stats', order: 2, badge: '', title: '15+',  subtitle: 'Years of Experience' },
  { page: 'home', section: 'stats', order: 3, badge: '', title: '180+', subtitle: 'Satisfied Partners' },
  { page: 'home', section: 'stats', order: 4, badge: '', title: '25+',  subtitle: 'Expert Team' },

  // ── HOME: pillars
  { page: 'home', section: 'pillars', order: 1, title: 'Alignment',   description: 'Bringing the right brands and investors together around shared commercial direction.' },
  { page: 'home', section: 'pillars', order: 2, title: 'Structure',   description: 'Creating organised frameworks for scalable and disciplined business growth.' },
  { page: 'home', section: 'pillars', order: 3, title: 'Clarity',     description: 'Removing noise so opportunities and decisions move with sharper direction.' },
  { page: 'home', section: 'pillars', order: 4, title: 'Execution',   description: 'Turning strategy into real business movement through operational discipline.' },
  { page: 'home', section: 'pillars', order: 5, title: 'Governance',  description: 'Maintaining standards, processes, and accountability across all engagements.' },

  // ── HOME: offerings
  { page: 'home', section: 'offerings', order: 1, badge: '◈', title: 'Expansion Strategy',  description: 'Structured plans for entering new markets, territories, and geographies — built to scale without losing operational control.' },
  { page: 'home', section: 'offerings', order: 2, badge: '◉', title: 'Investor Alignment',  description: 'Commercially sound opportunities matched to investors who understand long-term business growth over short-term noise.' },
  { page: 'home', section: 'offerings', order: 3, badge: '◎', title: 'Execution Support',   description: 'On-ground discipline that turns strategy into real movement — deals closed, systems built, brands launched.' },

  // ── HOME: photo-cards
  { page: 'home', section: 'photo-cards', order: 1, tag: 'For Brands',     title: 'Expand with Structure', subtitle: 'Franchise and market expansion',      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=700&q=80', link: '/for-brands' },
  { page: 'home', section: 'photo-cards', order: 2, tag: 'For Investors',  title: 'Invest with Clarity',   subtitle: 'Curated business opportunities',       imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=700&q=80', link: '/for-investors' },
  { page: 'home', section: 'photo-cards', order: 3, tag: 'Growth',         title: 'Structured Growth',     subtitle: 'Sector-led expansion opportunities',    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=80', link: '/growth-opportunities' },
  { page: 'home', section: 'photo-cards', order: 4, tag: 'Industries',     title: 'Proven Sectors',        subtitle: 'Scalable industry opportunities',        imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=700&q=80', link: '/industries' },

  // ── FOR-BRANDS: services
  { page: 'for-brands', section: 'services', order: 1, tag: 'Franchise Ready', title: 'Franchise Expansion',  description: 'Structured franchise expansion designed for scalable and sustainable business growth across India.',                                                     imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=300&q=80' },
  { page: 'for-brands', section: 'services', order: 2, tag: 'Market Mapping',  title: 'Territory Planning',   description: 'Identifying the right cities, markets, and geographies for disciplined, data-backed expansion.',                                                     imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80' },
  { page: 'for-brands', section: 'services', order: 3, tag: 'Multi-Channel',   title: 'Channel Development',  description: 'Building organised channel and distribution frameworks for stronger market reach and brand presence.',                                               imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=300&q=80' },
  { page: 'for-brands', section: 'services', order: 4, tag: 'Partner Network', title: 'Partner Acquisition',  description: 'Connecting brands with commercially aligned franchise and business partners across tier-1 and tier-2 cities.',                                       imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=300&q=80' },
  { page: 'for-brands', section: 'services', order: 5, tag: 'Growth Planning', title: 'Expansion Strategy',   description: 'Growth-focused expansion plans built around real scalability, unit economics, and operational clarity.',                                              imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=300&q=80' },
  { page: 'for-brands', section: 'services', order: 6, tag: 'Full Support',    title: 'Rollout Support',      description: 'End-to-end support for onboarding, coordination, and execution from day one through full rollout.',                                                  imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=300&q=80' },

  // ── FOR-BRANDS: why-us
  { page: 'for-brands', section: 'why-us', order: 1, badge: '01', title: 'Structured expansion approach',  description: 'We build frameworks that hold when markets get complicated — not just plans that look good on paper.' },
  { page: 'for-brands', section: 'why-us', order: 2, badge: '02', title: 'Commercial clarity at every stage', description: 'Every decision is grounded in real business logic. No guesswork, no assumptions.' },
  { page: 'for-brands', section: 'why-us', order: 3, badge: '03', title: 'Execution-focused support',     description: 'We stay involved until the work moves forward. Strategy without execution is noise.' },
  { page: 'for-brands', section: 'why-us', order: 4, badge: '04', title: 'Pan-India expansion reach',     description: 'Proven networks across tier-1 and tier-2 cities with on-ground partner and channel access.' },
  { page: 'for-brands', section: 'why-us', order: 5, badge: '05', title: 'Long-term scalability mindset', description: 'We build for the next five years, not just the next quarter. Sustainable growth over quick wins.' },

  // ── FOR-INVESTORS: offerings
  { page: 'for-investors', section: 'offerings', order: 1, tag: 'Curated Access',   title: 'Business opportunities built for serious investors.',        description: 'Handpicked, commercially verified opportunities across scalable sectors and expansion-ready business models.',                                  imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=80' },
  { page: 'for-investors', section: 'offerings', order: 2, tag: 'Market Clarity',   title: 'Understand the model before you commit.',                    description: 'We give you a clear picture of unit economics, market direction, and expansion potential — before any decision is made.',                     imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=700&q=80' },
  { page: 'for-investors', section: 'offerings', order: 3, tag: 'Strategic Match',  title: 'The right opportunity matched to the right investor.',       description: 'We align business opportunities with investors who share the same commercial direction and long-term growth mindset.',                        imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=700&q=80' },
  { page: 'for-investors', section: 'offerings', order: 4, tag: 'Proven Models',    title: 'Expansion-ready businesses with real fundamentals.',         description: 'Every business we present is screened for scalability, operational structure, and genuine growth readiness.',                              imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=700&q=80' },
  { page: 'for-investors', section: 'offerings', order: 5, tag: 'Growth Sectors',   title: 'Sectors chosen for their expansion trajectory.',             description: 'F&B, retail, services, EdTech, health — opportunities in India\'s fastest-growing industries with proven demand.',                          imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=700&q=80' },
  { page: 'for-investors', section: 'offerings', order: 6, tag: 'Full Support',     title: 'We stay involved until the investment moves forward.',        description: 'From initial conversation to final commitment, our team ensures every investor-brand engagement is handled with structure and accountability.', imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=700&q=80' },

  // ── FOR-INVESTORS: why-us
  { page: 'for-investors', section: 'why-us', order: 1, badge: '01', title: 'Structured opportunities across sectors',       subtitle: 'Pre-screened for scalability, not just potential.' },
  { page: 'for-investors', section: 'why-us', order: 2, badge: '02', title: 'Commercial clarity built into every deal',      subtitle: 'Unit economics, market fit, and expansion logic — all packaged upfront.' },
  { page: 'for-investors', section: 'why-us', order: 3, badge: '03', title: 'Growth-focused from the first conversation',    subtitle: 'We only present what is genuinely positioned to grow.' },
  { page: 'for-investors', section: 'why-us', order: 4, badge: '04', title: 'The right match, not the nearest available',    subtitle: 'Investor–brand alignment based on commercial direction, not coincidence.' },
  { page: 'for-investors', section: 'why-us', order: 5, badge: '05', title: 'We stay until the deal actually moves',         subtitle: 'Execution and follow-through until your investment is committed and in motion.' },

  // ── GROWTH-OPPORTUNITIES: categories
  { page: 'growth-opportunities', section: 'categories', order: 1, tag: 'Food and Beverage',   title: 'F&B Expansion',            description: 'From QSR chains to cloud kitchens — high-velocity expansion opportunities with proven models and strong unit economics.',          imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80' },
  { page: 'growth-opportunities', section: 'categories', order: 2, tag: 'Retail and Lifestyle', title: 'Retail Formats',           description: 'Brand-driven retail scaling across tier-1 and tier-2 cities with hybrid models and strong brand loyalty.',                          imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80' },
  { page: 'growth-opportunities', section: 'categories', order: 3, tag: 'Service Businesses',   title: 'Service Sector',           description: 'Recurring revenue, low capex, and strong scalability across defensible service business categories.',                              imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80' },
  { page: 'growth-opportunities', section: 'categories', order: 4, tag: 'Emerging Brands',      title: 'Growth Stage',             description: 'Growth-ready businesses with proven models seeking strategic alignment, capital, and expansion support.',                            imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80' },
  { page: 'growth-opportunities', section: 'categories', order: 5, tag: 'Franchise',            title: 'Franchise Models',         description: 'Structured franchise systems with defined operations, proven replication, and disciplined rollout support.',                        imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80' },
  { page: 'growth-opportunities', section: 'categories', order: 6, tag: 'Multi-Market',         title: 'Expansion-Led Businesses', description: 'Businesses positioned for pan-India multi-market growth with long-term operational scalability.',                                   imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80' },

  // ── GROWTH-OPPORTUNITIES: differentiators
  { page: 'growth-opportunities', section: 'differentiators', order: 1, badge: '01', title: 'Commercially aligned models',        description: 'Every opportunity is positioned around real commercial logic — not just market potential.' },
  { page: 'growth-opportunities', section: 'differentiators', order: 2, badge: '02', title: 'Scalable business structure',         description: 'Built to replicate across markets without losing operational discipline or brand integrity.' },
  { page: 'growth-opportunities', section: 'differentiators', order: 3, badge: '03', title: 'Growth-focused from day one',         description: 'We only present businesses that are genuinely positioned for expansion — not just growth-stage hopefuls.' },
  { page: 'growth-opportunities', section: 'differentiators', order: 4, badge: '04', title: 'Expansion readiness verified',        description: 'Operational, financial, and structural readiness is assessed before any opportunity reaches an investor.' },
  { page: 'growth-opportunities', section: 'differentiators', order: 5, badge: '05', title: 'Execution support included',          description: 'We stay involved after the match — from initial conversations to final commitment and rollout.' },

  // ── OUR-APPROACH: steps
  { page: 'our-approach', section: 'steps', order: 1, badge: '01', title: 'Understand', description: 'We begin by understanding the business, growth requirement, expansion goals, and commercial direction behind the opportunity. No assumptions — just clarity.' },
  { page: 'our-approach', section: 'steps', order: 2, badge: '02', title: 'Structure',  description: 'We help organise the opportunity through clearer positioning, scalable planning, and stronger operational direction that creates the foundation for real growth.' },
  { page: 'our-approach', section: 'steps', order: 3, badge: '03', title: 'Align',      description: 'We focus on bringing the right businesses, investors, and opportunities together through commercially aligned conversations and shared commercial direction.' },
  { page: 'our-approach', section: 'steps', order: 4, badge: '04', title: 'Execute',    description: 'From coordination and follow-ups to onboarding and rollout support, we focus on disciplined business movement that turns strategy into tangible outcomes.' },
  { page: 'our-approach', section: 'steps', order: 5, badge: '05', title: 'Scale',      description: 'We support long-term growth through operational structure, execution discipline, and scalable business systems that sustain momentum beyond the initial push.' },

  // ── OUR-APPROACH: principles
  { page: 'our-approach', section: 'principles', order: 1, title: 'Alignment',   description: 'Right businesses, right partners, right direction.' },
  { page: 'our-approach', section: 'principles', order: 2, title: 'Structure',   description: 'Organised frameworks that scale with you.' },
  { page: 'our-approach', section: 'principles', order: 3, title: 'Clarity',     description: 'Remove noise, sharpen decision-making.' },
  { page: 'our-approach', section: 'principles', order: 4, title: 'Execution',   description: 'Disciplined movement over scattered activity.' },
  { page: 'our-approach', section: 'principles', order: 5, title: 'Governance',  description: 'Standards and accountability at every stage.' },

  // ── INDUSTRIES: sectors
  { page: 'industries', section: 'sectors', order: 1, badge: '01', title: 'Food and Beverage',           subtitle: 'QSR · Cloud Kitchens · Cafés · Fine Dining · Specialty F&B',        description: "One of India's fastest-scaling sectors. From quick-service chains to cloud kitchen networks, F&B presents high-velocity opportunities with proven models and strong unit economics.",            metrics: ['High repeat business', 'Scalable operations', 'Multi-format potential'] },
  { page: 'industries', section: 'sectors', order: 2, badge: '02', title: 'Retail and Lifestyle',        subtitle: 'Fashion · Beauty · Wellness · Home · Specialty Retail',              description: 'Brand-driven retail formats scaling across tier-1 and tier-2 cities — evolving rapidly with hybrid models, curated experiences, and strong brand loyalty driving expansion velocity.',        metrics: ['Brand differentiation', 'Omnichannel ready', 'High footfall potential'] },
  { page: 'industries', section: 'sectors', order: 3, badge: '03', title: 'Service Businesses',          subtitle: 'Education · Healthcare · Logistics · Professional Services',          description: 'Recurring revenue, low capex, and strong scalability. This sector offers structured expansion pathways with defensible positions once established in a market.',                                metrics: ['Recurring revenue', 'Low capex model', 'High scalability'] },
  { page: 'industries', section: 'sectors', order: 4, badge: '04', title: 'Health and Wellness',         subtitle: 'Fitness · Nutrition · Mental Health · Alternative Medicine',          description: "India's wellness economy is growing at pace. From fitness studios to nutraceutical brands, health businesses are scaling rapidly with strong consumer demand fundamentals.",                  metrics: ['Growing demand', 'Premium positioning', 'Franchise-ready models'] },
  { page: 'industries', section: 'sectors', order: 5, badge: '05', title: 'Technology and EdTech',       subtitle: 'EdTech · SaaS · B2B Tech · Digital Services',                        description: 'Asset-light models with strong geographic expansion potential. EdTech and SaaS businesses scale across markets with minimal physical infrastructure requirements.',                            metrics: ['Asset-light model', 'High margin potential', 'Cross-market scalable'] },
  { page: 'industries', section: 'sectors', order: 6, badge: '06', title: 'Real Estate and Infrastructure', subtitle: 'Co-working · Managed Spaces · Real Estate Services',              description: "The managed real estate and co-working sector continues to expand across India's tier-1 and emerging tier-2 markets, driven by changing work patterns and commercial demand.",              metrics: ['Long-term revenue', 'Institutional demand', 'Pan-India expansion'] },

  // ── ABOUT: focus-areas
  { page: 'about', section: 'focus-areas', order: 1, tag: 'Expansion',  title: 'Business Expansion',    description: 'Helping brands grow through structured, scalable, and execution-led expansion systems across India.',                                         imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=700&q=80' },
  { page: 'about', section: 'focus-areas', order: 2, tag: 'Investors',  title: 'Investor Alignment',    description: 'Connecting investors with commercially verified, growth-ready opportunities backed by real due diligence.',                                   imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=700&q=80' },
  { page: 'about', section: 'focus-areas', order: 3, tag: 'Clarity',    title: 'Commercial Clarity',    description: 'Creating clear commercial frameworks so every business decision is backed by structured, data-driven thinking.',                               imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=700&q=80' },
  { page: 'about', section: 'focus-areas', order: 4, tag: 'Execution',  title: 'Execution Support',     description: 'Operational discipline and on-ground coordination to ensure strategy becomes tangible progress.',                                             imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=700&q=80' },
  { page: 'about', section: 'focus-areas', order: 5, tag: 'Growth',     title: 'Scalable Growth',       description: 'Building systems, processes, and governance structures that sustain momentum at every stage of growth.',                                      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=80' },

  // ── ABOUT: why-us
  { page: 'about', section: 'why-us', order: 1, badge: '01', title: 'Structured business approach',    description: 'Everything we do is built on a framework, not instinct.' },
  { page: 'about', section: 'why-us', order: 2, badge: '02', title: 'Commercially aligned movement',   description: 'Growth decisions are anchored in commercial reality.' },
  { page: 'about', section: 'why-us', order: 3, badge: '03', title: 'Execution-focused support',       description: 'We stay involved until the opportunity moves forward.' },
  { page: 'about', section: 'why-us', order: 4, badge: '04', title: 'Organised growth planning',       description: 'No shortcuts — disciplined planning at every stage.' },
  { page: 'about', section: 'why-us', order: 5, badge: '05', title: 'Long-term scalability mindset',   description: 'Built for the next 10 years, not just the next quarter.' },
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

  // Heroes
  for (const h of HEROES) {
    await PageHero.findOneAndUpdate({ page: h.page }, h, { upsert: true, new: true });
    console.log(`✓ Hero: ${h.page}`);
  }

  // Content items (only insert missing ones)
  let added = 0;
  for (const item of CONTENT) {
    const exists = await ContentItem.findOne({ page: item.page, section: item.section, title: item.title });
    if (!exists) { await ContentItem.create(item); added++; }
  }
  console.log(`✓ Content items: ${added} added (${CONTENT.length - added} already existed)`);

  // Insights
  let insAdded = 0;
  for (const ins of INSIGHTS) {
    if (!(await Insight.findOne({ slug: ins.slug }))) { await Insight.create(ins); insAdded++; }
  }
  console.log(`✓ Insights: ${insAdded} added`);

  console.log('\n✅ Seed complete.');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
