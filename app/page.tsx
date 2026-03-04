import dynamicImport from "next/dynamic";
export const dynamic = "force-dynamic";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Partners } from "@/components/Partners";
import { Technologies } from "@/components/Technologies";
import { Team } from "@/components/Team";
import { PageWrapper } from "@/components/PageWrapper";
import { getConfig } from "./actions/config";
import { LeadCaptureSection } from "@/components/LeadCaptureSection";

// Dynamically import below-the-fold components for faster initial load
const FullFunnelMarketing = dynamicImport(() => import("@/components/FullFunnelMarketing").then(mod => ({ default: mod.FullFunnelMarketing })), {
  loading: () => <div className="w-full py-32 bg-black" />,
});
const Impact = dynamicImport(() => import("@/components/Impact").then(mod => ({ default: mod.Impact })), {
  loading: () => <div className="w-full py-32 bg-[#0a0a0a]" />,
});
const WhyUs = dynamicImport(() => import("@/components/WhyUs").then(mod => ({ default: mod.WhyUs })), {
  loading: () => <div className="w-full py-32 bg-[#0a0a0a]" />,
});
const Services = dynamicImport(() => import("@/components/Services").then(mod => ({ default: mod.Services })), {
  loading: () => <div className="w-full py-32 bg-[#0a0a0a]" />,
});
const Comparison = dynamicImport(() => import("@/components/Comparison").then(mod => ({ default: mod.Comparison })), {
  loading: () => <div className="w-full py-32 bg-[#0a0a0a]" />,
});
const Workflow = dynamicImport(() => import("@/components/Workflow").then(mod => ({ default: mod.Workflow })), {
  loading: () => <div className="w-full py-32 bg-[#0a0a0a]" />,
});
const OurWorks = dynamicImport(() => import("@/components/CaseStudies").then(mod => ({ default: mod.OurWorks })), {
  loading: () => <div className="w-full py-32 bg-[#0a0a0a]" />,
});
const Reviews = dynamicImport(() => import("@/components/Reviews").then(mod => ({ default: mod.Reviews })), {
  loading: () => <div className="w-full py-32 bg-[#0a0a0a]" />,
});
const FAQ = dynamicImport(() => import("@/components/FAQ").then(mod => ({ default: mod.FAQ })), {
  loading: () => <div className="w-full py-32 bg-[#0a0a0a]" />,
});
const CalendlySection = dynamicImport(() => import("@/components/CalendlySection").then(mod => ({ default: mod.CalendlySection })), {
  loading: () => <div className="w-full py-32 bg-[#0a0a0a]" />,
});
const Footer = dynamicImport(() => import("@/components/Footer").then(mod => ({ default: mod.Footer })), {
  loading: () => <div className="w-full py-16 bg-black" />,
});

export default async function Home() {
  const [
    heroConfig,
    navbarConfig,
    partnersConfig,
    fullFunnelConfig,
    impactConfig,
    whyUsConfig,
    servicesConfig,
    comparisonConfig,
    workflowConfig,
    caseStudiesConfig,
    reviewsConfig,
    faqConfig,
    footerConfig,
    teamConfig
  ] = await Promise.all([
    getConfig("hero"),
    getConfig("navbar"),
    getConfig("partners"),
    getConfig("fullFunnel"),
    getConfig("impact"),
    getConfig("whyUs"),
    getConfig("services"),
    getConfig("comparison"),
    getConfig("workflow"),
    getConfig("caseStudies"),
    getConfig("reviews"),
    getConfig("faq"),
    getConfig("footer"),
    getConfig("team")
  ]);

  return (
    <PageWrapper
      heroConfig={heroConfig}
      navbarConfig={navbarConfig}
      partnersConfig={partnersConfig}
      caseStudiesConfig={caseStudiesConfig}
    >
      <main className="w-full min-h-screen bg-black overflow-x-hidden">
        <Navbar config={navbarConfig} theme="dark" alwaysSolid={true} />
        <Hero config={heroConfig} />
        <Partners config={{ variant: 'hero' }} />

        <FullFunnelMarketing config={fullFunnelConfig} />
        <Impact config={impactConfig} />
        <WhyUs config={whyUsConfig} />
        <Team config={teamConfig} />
        <Services config={servicesConfig} />
        <Technologies />
        <Comparison config={comparisonConfig} />
        <Workflow config={workflowConfig} />
        <OurWorks config={caseStudiesConfig} />
        <Reviews config={reviewsConfig} />
        <FAQ config={faqConfig} />
        <LeadCaptureSection />
        <CalendlySection />
        <Footer config={footerConfig} />
      </main>
    </PageWrapper>
  );
}
