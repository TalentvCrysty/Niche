import React from "react";
export const dynamic = "force-dynamic";
import { getConfig } from "../actions/config";
import { CareersContent } from "./CareersContent";

// We need to fetch config on the server side for the initial render.
// This is a server component (no "use client" at top)
// interactive parts are in CareersContent (which has "use client")

export default async function CareersPage() {
  const config = await getConfig("careers") || {};
  const navbarConfig = await getConfig("navbar") || {};
  const footerConfig = await getConfig("footer") || {};

  // Default Fallbacks
  const headline = config.headline || "Join the \nCollective.";
  const subheadline = config.subheadline || "We hire and train exceptional marketing talent to become industry leaders.";
  const heroButtonText = config.heroButtonText || "Apply now";
  const heroButtonLink = config.heroButtonLink || "/#apply";
  const checklist = config.checklist || [
    "Gain global experience",
    "Refine your skillset",
    "Drive results for top brands",
    "Earn 3x market average"
  ];
  const benefits = config.benefits || [
    { title: "Autonomy", description: "Work on your terms. Choose your projects, schedule, and workload." },
    { title: "Compensation", description: "Top-tier earning potential. Our specialists earn up to $9k/month." },
    { title: "Stability", description: "Consistent income without the hassle of finding clients." },
    { title: "Focus", description: "Pure marketing. No client management. We handle the rest." },
  ];
  const process = config.process || [
    { id: "01", title: "Apply", desc: "Complete the short application form." },
    { id: "02", title: "Evaluate", desc: "Paid marketing campaign test." },
    { id: "03", title: "Connect", desc: "Call to discuss terms and schedule." },
    { id: "04", title: "Earn", desc: "Start working and getting paid." },
  ];
  const cta = config.cta || {
    headline: "Ready to level up?",
    subheadline: "Start earning $1000-$9000+ consistently. Work on your terms.",
    buttonText: "Start Application",
    buttonLink: "/#apply"
  };

  return (
    <CareersContent
      headline={headline}
      subheadline={subheadline}
      heroButtonText={heroButtonText}
      heroButtonLink={heroButtonLink}
      checklist={checklist}
      benefits={benefits}
      process={process}
      cta={cta}
      navbarConfig={navbarConfig}
      footerConfig={footerConfig}
    />
  );
}
