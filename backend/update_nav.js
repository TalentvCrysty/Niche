const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function updateNav() {
  const db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  const row = await db.get('SELECT value FROM configurations WHERE key = ?', 'navbar');
  let config = {};
  if (row) {
    try {
      config = JSON.parse(row.value);
    } catch (e) {
      console.error("Error parsing current config", e);
    }
  }

  // Update links to match the user's customized order + "Home" text change
  config.links = [
    { label: "Home", href: "/" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Services", href: "/#services" },
    { label: "Careers", href: "/careers" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Testimonials", href: "/#testimonials" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/#faq" },
    { label: "Case Studies", href: "/#case-studies" }
  ];

  // Ensure other fields exist
  if (!config.title) config.title = "Niche";
  if (config.logo === undefined) config.logo = null;

  await db.run('INSERT OR REPLACE INTO configurations (key, value) VALUES (?, ?)', 'navbar', JSON.stringify(config));

  console.log('Navbar links updated successfully');
}

updateNav().catch(console.error);
