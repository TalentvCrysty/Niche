const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const bcrypt = require('bcrypt');
const path = require('path');

let db;

async function initDb() {
  if (db) return db;

  db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password_hash TEXT
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS configurations (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE,
      title TEXT,
      description TEXT,
      content TEXT,
      cover_image TEXT,
      category TEXT,
      read_time TEXT,
      published_date TEXT,
      redirect_url TEXT,
      seo_title TEXT,
      seo_description TEXT,
      is_featured INTEGER DEFAULT 0
    )
  `);



  await db.exec(`
    CREATE TABLE IF NOT EXISTS portfolio_projects(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE,
    title TEXT,
    short_description TEXT,
    full_description TEXT,
    thumbnail_image TEXT,
    category TEXT,
    before_image TEXT,
    after_image TEXT,
    gallery_images TEXT,
    technologies TEXT,
    live_url TEXT,
    github_url TEXT,
    completion_date TEXT,
    status TEXT DEFAULT 'draft',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      phone TEXT,
      company TEXT,
      budget_range TEXT,
      problem TEXT,
      preferred_contact_time TEXT,
      source TEXT,
      status TEXT DEFAULT 'new',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS lead_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER,
      type TEXT,
      to_email TEXT,
      subject TEXT,
      body TEXT,
      status TEXT DEFAULT 'scheduled',
      scheduled_at TEXT,
      sent_at TEXT,
      error TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS referral_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      role TEXT,
      password_hash TEXT,
      referral_code TEXT UNIQUE,
      commission_rate REAL DEFAULT 0.1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS referral_clicks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      referral_code TEXT,
      ip TEXT,
      user_agent TEXT,
      path TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS referral_conversions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      referral_code TEXT,
      lead_id INTEGER,
      amount REAL,
      currency TEXT,
      commission_amount REAL,
      status TEXT DEFAULT 'lead',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE,
      name TEXT,
      type TEXT,
      short_description TEXT,
      long_description TEXT,
      price_amount REAL,
      price_currency TEXT,
      price_period TEXT,
      badge TEXT,
      is_featured INTEGER DEFAULT 0,
      tags TEXT,
      includes TEXT,
      best_for TEXT,
      image TEXT,
      purchase_url TEXT,
      status TEXT DEFAULT 'active',
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migrations for portfolio_projects
  try {
    const tableInfo = await db.all("PRAGMA table_info(portfolio_projects)");
    const columns = tableInfo.map(c => c.name);

    if (!columns.includes('category')) {
      await db.exec('ALTER TABLE portfolio_projects ADD COLUMN category TEXT');
      console.log('Migrated: Added category to portfolio_projects');
    }
    if (!columns.includes('before_image')) {
      await db.exec('ALTER TABLE portfolio_projects ADD COLUMN before_image TEXT');
      console.log('Migrated: Added before_image to portfolio_projects');
    }
    if (!columns.includes('after_image')) {
      await db.exec('ALTER TABLE portfolio_projects ADD COLUMN after_image TEXT');
      console.log('Migrated: Added after_image to portfolio_projects');
    }
    const rcInfo = await db.all("PRAGMA table_info(referral_clicks)");
    const rcColumns = rcInfo.map(c => c.name);
    if (!rcColumns.includes('path')) {
      await db.exec('ALTER TABLE referral_clicks ADD COLUMN path TEXT');
      console.log('Migrated: Added path to referral_clicks');
    }
  } catch (error) {
    console.warn('Migration warning:', error.message);
  }

  // Check if admin exists
  const admin = await db.get('SELECT * FROM users WHERE username = ?', 'admin');

  if (!admin) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('Reab@112', salt);
    await db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', 'admin', hash);
    console.log('Admin user created');
  }

  // Initialize default configurations
  const defaults = {
    navbar: {
      logo: null,
      title: "Niche",
      links: [
        { label: "Case studies", href: "/#case-studies" },
        { label: "Portfolio", href: "/portfolio" },
        { label: "Store", href: "/store" },
        { label: "Services", href: "/#services" },
        { label: "Careers", href: "/careers" },
        { label: "How it works", href: "/#how-it-works" },
        { label: "Testimonials", href: "/#testimonials" },
        { label: "Blog", href: "/blog" },
        { label: "FAQ", href: "/#faq" }
      ]
    },
    hero: {
      headline: "Performance marketing that grows your revenue",
      subheadline: "We help D2C brands scale with data-driven creative and media buying.",
      ctaText: "View our work",
      ctaLink: "/portfolio",
      backgroundImage: null
    },
    partners: {
      title: "Trusted by forward-thinking companies",
      items: [
        { type: "text", value: "Forbes" },
        { type: "text", value: "CEO Weekly" },
        { type: "text", value: "Marketers Media" },
        { type: "text", value: "Arkle" },
        { type: "text", value: "Y Combinator" },
        { type: "text", value: "Apytel" },
        { type: "text", value: "Fil Rouge Capital" },
        { type: "text", value: "Salesfocus" }
      ]
    },
    impact: {
      stats: [
        { value: "4.7", suffix: "/5", label: "Average Satisfaction Score", sublabel: "Based on 840+ verified reviews" },
        { value: "1.3k", suffix: "+", label: "Happy Customers", sublabel: "Scaling revenue globally" },
        { value: "97", suffix: "", label: "Countries", sublabel: "Global Reach" }
      ]
    },
    whyUs: {
      headline_prefix: "Not another one‑channel shop.",
      headline_suffix: "We’re your full‑funnel growth partner.",
      features: [
        { id: "01", title: "Top 1% Global Talent", description: "We don't outsource to juniors. Your growth is managed by battle-tested strategists who have scaled unicorns." },
        { id: "02", title: "Launch Fast, Iterate Faster", description: "Speed is our unfair advantage. We launch full-funnel campaigns in days, not months, and optimize daily." },
        { id: "03", title: "Unbeatable ROI & Transparency", description: "No black boxes. You get a live dashboard with real-time attribution, so you know exactly where every dollar goes." }
      ]
    },
    services: {
      label: "Services",
      headline: "Digital Product Design & Development Services",
      subheadline: "Complete product development from concept to scale. Senior team, full ownership, blazing fast.",
      categories: [
        {
          title: "Branding",
          items: ["Brand Strategy & Positioning", "Brand Identity Design", "Brand Naming & Messaging", "Brand Architecture", "Rebranding & Brand Transformation", "Employee Branding"]
        },
        {
          title: "Design",
          items: ["UX Research & Experience Strategy", "UI Design Web & Mobile", "Design Systems (3+ Platforms)", "Marketing & Campaign Design", "Motion & Visual Storytelling", "Packaging & Print Design"]
        },
        {
          title: "Development",
          items: ["Website Development", "Web Application Development", "Mobile App Development", "E-commerce Development", "CMS & Headless Solutions", "API & Integrations", "Maintenance & Technical Support"]
        }
      ],
      cta: {
        title: "What you get",
        description: "Included in the Performance Marketing plan.",
        tags: ["Brand book", "Social media kit", "Stationery", "Source files"]
      }
    },
    comparison: {
      headline: "Why invest in a \n performance marketing partner?",
      niche: {
        title: "With Niche",
        items: [
          "Full‑funnel growth: SEO, paid media, content, email, and CRO working together.",
          "Fast launch, continuous optimization, measurable ROI.",
          "Transparent reporting and compounding results."
        ]
      },
      competitor1: {
        title: "Freelancers / Agencies",
        items: [
          "Unpredictable, high-cost agencies.",
          "Unreliable freelancers and poor communication, often bad designs.",
          "Slow work, can take weeks to get the work done."
        ]
      },
      competitor2: {
        title: "DIY Tools",
        items: [
          "Limited control and data; no strategic direction.",
          "Poor quality, no customer trust, and you’ll come second to your competitors.",
          "You lose time you could be putting into your business."
        ]
      }
    },
    workflow: {
      label: "How we work",
      headline: "Our marketing process",
      steps: [
        { title: "Goals & diagnostics", desc: "Clarify targets and audit tracking, offers, and channels to establish a baseline." },
        { title: "Market & ICP research", desc: "Map ICP pain points and competitive landscape to inform messaging and channel mix." },
        { title: "Launch & iterate", desc: "Stand up campaigns, creatives, and content. Test hypotheses and double down on winners." },
        { title: "Scale & systemize", desc: "Improve CAC/ROAS with ongoing experiments, CRO, and automation—repeat monthly." }
      ],
      cta: {
        title: "Schedule Your Free Consultation",
        description: "Let's discuss how we can help grow your business.",
        buttonText: "Schedule Call"
      }
    },
    caseStudies: {
      label: "Selected Work",
      headline: "Proven results across \n diverse industries.",
      items: [
        { title: "Scaling Fintech to $10M ARR", category: "Fintech • SEO & PPC", image: null, description: "How we helped a neobank reduce CAC by 40% while tripling monthly active users through targeted acquisition channels.", stat: "+210% Growth" },
        { title: "E-commerce Global Expansion", category: "Retail • Paid Social", image: null, description: "Launching a D2C fashion brand into 5 new European markets with a localized full-funnel strategy.", stat: "4.5x ROAS" },
        { title: "B2B SaaS Lead Generation", category: "SaaS • Content Marketing", image: null, description: "Building an organic growth engine that generated 500+ qualified enterprise leads in 6 months.", stat: "-35% CPL" },
        { title: "Healthcare Digital Transformation", category: "HealthTech • CRO", image: null, description: "Revamping the patient booking flow to increase conversion rates and streamline appointment scheduling.", stat: "+85% Conv. Rate" }
      ]
    },
    reviews: {
      headline: "Testimonials",
      featured: {
        text: "Niche became our growth arm. They rebuilt tracking, launched paid and SEO the right way, and cut our CAC while increasing qualified demos. If you want a partner obsessed with results, work with Niche.",
        author: "John Danes",
        role: "Marketing Agency Founder - USA",
        rating: 5
      },
      items: [
        { name: "thomasvgilst", date: "March 18, 2025", rating: 5, text: "I recommend Niche to everyone!" },
        { name: "ben_makansi", date: "April 12, 2025", rating: 5, text: "With something creative like logo design it's always difficult to find someone who strikes the right balance between taking my input and applying expertise (because I don't know the best practices and don't know what I don't know). Niche was very responsive to my input but helped guide the final product in a direction I never would have come up with on my own. Ultimately extremely happy with my logo" },
        { name: "zpur32", date: "May 8, 2025", rating: 5, text: "Couldn't be happier with the result in coming up with a professional and modern logo for our business!" },
        { name: "smaschmeier", date: "June 3, 2025", rating: 5, text: "Amazing to work with; really understood what I was going for and took my alterations/suggestions seriously and without being territorial as some agencies can be. Very quick and professional; I will work with this group again!" },
        { name: "sabahkw20", date: "July 22, 2025", rating: 5, text: "10/10 extremely professional and passionate" },
        { name: "bisonbranding", date: "August 15, 2025", rating: 5, text: "Loius was very patient with me and got this over the finish line. Thank you!" }
      ]
    },
    faq: {
      headline: "Frequently Asked Questions",
      description: "Everything you need to know about our marketing services and how we can help grow your business.",
      items: [
        { id: "01", question: "Who is this for?", answer: "B2B and B2C companies that want measurable growth from SEO, paid media, content, email, and CRO." },
        { id: "02", question: "Do I own the ad accounts and data?", answer: "Yes. You retain ownership of ad accounts (Google, Meta, LinkedIn), analytics, and all creatives and reports." },
        { id: "03", question: "What's your growth philosophy?", answer: "Hypothesis-driven experimentation, fast feedback loops, and compounding assets. We focus budgets on what works." },
        { id: "04", question: "How are you different?", answer: "We're full-funnel and channel-agnostic. Strategy, creative, media, and analytics all under one roof with transparent reporting." },
        { id: "05", question: "Which channels do you manage?", answer: "SEO, Google Ads, Meta Ads, LinkedIn Ads, email marketing, content marketing, and conversion rate optimization (CRO)." },
        { id: "06", question: "How fast do we launch?", answer: "Typically within 7 days after kickoff and access. First insights arrive in 2–4 weeks; SEO compounds over months." },
        { id: "07", question: "Why not run this in-house?", answer: "We augment your team with senior specialists, faster setup, and proven playbooks—often lowering CAC while moving quicker." },
        { id: "08", question: "What's included in reporting?", answer: "Weekly updates, KPI dashboards (spend, CAC, ROAS, pipeline), experiment logs, and monthly planning." },
        { id: "09", question: "When will I see results?", answer: "Paid media shows momentum in 2–8 weeks depending on ticket size and data; SEO and content compound over 3–6+ months." },
        { id: "10", question: "Who manages my account?", answer: "We're a team of 30+ growth specialists across strategy, media buying, content, design, and analytics—led by a senior growth lead." },
        { id: "11", question: "What industries do you serve?", answer: "Every industry. From small shops to global disruptive healthcare startups." },
        { id: "12", question: "What if performance isn't improving?", answer: "We iterate weekly and reallocate budgets to winning channels. If we're not on track, we reset the plan and focus on highest-impact opportunities." }
      ]
    },
    footer: {
      contact: { phone: "+995 555 317 927" },
      socials: { twitter: "#", instagram: "#", linkedin: "#", facebook: "#" },
      addresses: [
        { title: "Dubai", lines: ["Dubai Design District,", "Floor 3, Building 3,", "Dubai, UAE"] },
        { title: "United Kingdom", lines: ["6 Giles Building,", "Upper Hampstead Walk,", "London, United Kingdom"] },
        { title: "Stepantsminda", lines: ["Street 31"] }
      ]
    }
  };

  for (const [key, value] of Object.entries(defaults)) {
    const existing = await db.get('SELECT * FROM configurations WHERE key = ?', key);
    if (!existing) {
      await db.run('INSERT INTO configurations (key, value) VALUES (?, ?)', key, JSON.stringify(value));
      console.log(`Initialized default config for ${key}`);
    }
  }

  return db;
}

module.exports = { initDb };
