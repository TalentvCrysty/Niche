import { verifySession } from "../../actions/auth";
import { redirect } from "next/navigation";
import { getConfig } from "../../actions/config";
import ConfigEditor from "./components/ConfigEditor";

export default async function Dashboard() {
  const session = await verifySession();

  if (!session) {
    redirect("/admin");
  }

  // Fetch all configurations
  const configs = await Promise.all([
    getConfig("hero"),
    getConfig("navbar"),
    getConfig("partners"),
    getConfig("impact"),
    getConfig("whyUs"),
    getConfig("services"),
    getConfig("comparison"),
    getConfig("workflow"),
    getConfig("caseStudies"),
    getConfig("reviews"),
    getConfig("faq"),
    getConfig("footer"),
    getConfig("careers"),
    getConfig("team")
  ]);

  const [
    heroConfig,
    navbarConfig,
    partnersConfig,
    impactConfig,
    whyUsConfig,
    servicesConfig,
    comparisonConfig,
    workflowConfig,
    caseStudiesConfig,
    reviewsConfig,
    faqConfig,
    footerConfig,
    careersConfig,
    teamConfig
  ] = configs;

  /* Default Team Data (Migration from hardcoded) */
  const defaultTeam = {
    headline: "Meet the *Minds*",
    subheadline: "Thousands of projects successfully delivered thanks to the passion, precision, and dedication of our expert team.",
    members: [
      {
        slug: "levan",
        name: "Levan",
        role: "Founder & CEO",
        image: "/levan.jpeg",
        blurb: "Visionary leader driving innovation and growth.",
        bio: "Leads strategy and delivery across growth, product, and brand.\n\n- Launches end-to-end growth systems\n- Sets measurement and reporting\n- Oversees senior specialists",
        tags: ["Strategy", "Leadership", "Growth"],
        highlights: ["Scaled multiple brands to 7-figure monthly revenue", "Built full-funnel systems across paid + organic", "Executive partner for founders and GTM teams"],
        rateType: "hour",
        rateValue: "120",
        rateCurrency: "$",
        rateNote: "Project packages available",
        hireLabel: "Hire Levan",
        hireLink: "/#contact"
      },
      {
        slug: "migre",
        name: "Migre",
        role: "Co-Founder & CTO",
        image: "/migre.jpeg",
        blurb: "Technical mastermind behind our scalable solutions.",
        bio: "Owns architecture, performance, and reliability for production systems.\n\n- Scalable web apps\n- API design\n- Infrastructure & deployments",
        tags: ["Engineering", "Architecture", "DevOps"],
        highlights: ["Designed scalable systems and data pipelines", "Optimized performance for high-traffic products", "Shipped production-grade web apps end-to-end"],
        rateType: "hour",
        rateValue: "100",
        rateCurrency: "$",
        rateNote: "Weekly retainer available",
        hireLabel: "Hire Migre",
        hireLink: "/#contact"
      },
      {
        slug: "sarah",
        name: "Sarah",
        role: "Head of Design",
        image: "/1.jpeg",
        blurb: "Crafting intuitive and beautiful user experiences.",
        bio: "Designs modern interfaces and systems that convert.\n\n- UX flows\n- UI kits\n- Design systems",
        tags: ["UI/UX", "Design Systems", "Brand"],
        highlights: ["Built design systems across multiple products", "Improved conversion with UX + CRO iterations", "Shipped mobile + web UI for growth funnels"],
        rateType: "hour",
        rateValue: "75",
        rateCurrency: "$",
        rateNote: "Fixed-price sprints available",
        hireLabel: "Hire Sarah",
        hireLink: "/#contact"
      },
      {
        slug: "david",
        name: "David",
        role: "Lead Developer",
        image: "/3.jpeg",
        blurb: "Architecting robust systems for global scale.",
        bio: "Builds fast, reliable features and clean integrations.\n\n- Next.js & APIs\n- Integrations\n- Performance",
        tags: ["Next.js", "Backend", "Integrations"],
        highlights: ["Delivered production features with high velocity", "Built secure auth and admin tooling", "Integrated payments, analytics, and marketing tools"],
        rateType: "hour",
        rateValue: "85",
        rateCurrency: "$",
        rateNote: "Available for MVP builds",
        hireLabel: "Hire David",
        hireLink: "/#contact"
      },
      {
        slug: "michael",
        name: "Michael",
        role: "Product Strategy",
        image: "/5.jpeg",
        blurb: "Aligning market needs with product vision.",
        bio: "Turns customer needs into clear roadmaps and execution plans.\n\n- Discovery\n- Positioning\n- Roadmaps",
        tags: ["Product", "GTM", "Research"],
        highlights: ["Led discovery and positioning for launches", "Defined roadmaps and experiment backlogs", "Aligned teams across stakeholders and delivery"],
        rateType: "hour",
        rateValue: "90",
        rateCurrency: "$",
        rateNote: "Engagements start from 10h/week",
        hireLabel: "Hire Michael",
        hireLink: "/#contact"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900">
      {/* Mobile: Full height flow (no overflow hidden). Desktop: Fixed height dashboard (overflow hidden). */}
      <div className="lg:h-screen lg:p-6 lg:overflow-hidden w-full">
        <ConfigEditor
          initialHero={heroConfig || {}}
          initialNavbar={navbarConfig || {}}
          initialPartners={partnersConfig || {}}
          initialImpact={impactConfig || {}}
          initialWhyUs={whyUsConfig || {}}
          initialServices={servicesConfig || {}}
          initialComparison={comparisonConfig || {}}
          initialWorkflow={workflowConfig || {}}
          initialCaseStudies={caseStudiesConfig || {}}
          initialReviews={reviewsConfig || {}}
          initialFaq={faqConfig || {}}
          initialFooter={footerConfig || {}}
          initialCareers={careersConfig || {}}
          initialTeam={teamConfig || defaultTeam}
        />
      </div>
    </div>
  );
}
