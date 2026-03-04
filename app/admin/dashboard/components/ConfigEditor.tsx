"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
   Save, Layout, Type, Image as ImageIcon, Link as LinkIcon,
   Plus, Trash2, Loader2, Menu, Upload, X, Users,
   BarChart, Target, Layers, GitCompare, Workflow, Briefcase,
   Star, HelpCircle, MapPin, ChevronRight, Settings, LogOut,
   Megaphone, FileText, Video, Smile
} from "lucide-react";
import { updateConfig } from "@/app/actions/config";
import { logoutAction } from "@/app/actions/auth";
import { ImageUploader } from "@/app/admin/components/ui/ImageUploader";
import { MediaUploader } from "@/app/admin/components/ui/MediaUploader";

// --- Reusable UI Components ---

const SectionCard = ({ children, title, description, className = "" }: any) => (
   <div className={`bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden ${className}`}>
      {(title || description) && (
         <div className="px-6 py-5 border-b border-zinc-50 bg-zinc-50/30">
            {title && <h3 className="text-base font-semibold text-zinc-900">{title}</h3>}
            {description && <p className="text-sm text-zinc-500 mt-1">{description}</p>}
         </div>
      )}
      <div className="p-6">{children}</div>
   </div>
);

const Label = ({ children, icon: Icon, className = "" }: any) => (
   <label className={`block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1.5 ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
   </label>
);

const Input = ({ label, icon, className = "", ...props }: any) => (
   <div className={`group ${className}`}>
      {label && <Label icon={icon}>{label}</Label>}
      <div className="relative">
         <input
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-zinc-400 transition-all placeholder:text-zinc-400 hover:border-zinc-300"
            {...props}
         />
      </div>
   </div>
);

const TextArea = ({ label, icon, className = "", ...props }: any) => (
   <div className={`group ${className}`}>
      {label && <Label icon={icon}>{label}</Label>}
      <textarea
         className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-zinc-400 transition-all placeholder:text-zinc-400 min-h-[100px] resize-y hover:border-zinc-300"
         {...props}
      />
   </div>
);

const IconButton = ({ icon: Icon, onClick, className = "", variant = "default", ...props }: any) => {
   const variants: any = {
      default: "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100",
      danger: "text-zinc-400 hover:text-red-600 hover:bg-red-50",
      primary: "text-white bg-black hover:bg-zinc-800 shadow-sm",
   };
   return (
      <button
         onClick={onClick}
         className={`p-2 rounded-lg transition-all active:scale-95 ${variants[variant]} ${className}`}
         {...props}
      >
         <Icon className="w-4 h-4" />
      </button>
   );
};

const Badge = ({ children, onRemove }: any) => (
   <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
      {children}
      {onRemove && (
         <button onClick={onRemove} className="text-zinc-400 hover:text-red-500 transition-colors">
            <X className="w-3 h-3" />
         </button>
      )}
   </span>
);

export default function ConfigEditor({
   initialHero = {},
   initialNavbar = {},
   initialPartners = {},
   initialImpact = {},
   initialWhyUs = {},
   initialServices = {},
   initialComparison = {},
   initialWorkflow = {},
   initialCaseStudies = {},
   initialReviews = {},
   initialFaq = {},
   initialFooter = {},
   initialCareers = {},
   initialTeam = {}
}: any) {
   const [activeTab, setActiveTab] = useState<string>("hero");
   const [isSidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile, logic handles desktop

   // Config States
   const [heroConfig, setHeroConfig] = useState(initialHero || {});
   const [navbarConfig, setNavbarConfig] = useState(initialNavbar || {});
   const [partnersConfig, setPartnersConfig] = useState(initialPartners || {});
   const [impactConfig, setImpactConfig] = useState(initialImpact || {});
   const [whyUsConfig, setWhyUsConfig] = useState(initialWhyUs || {});
   const [servicesConfig, setServicesConfig] = useState(initialServices || {});
   const [comparisonConfig, setComparisonConfig] = useState(initialComparison || {});
   const [workflowConfig, setWorkflowConfig] = useState(initialWorkflow || {});
   const [caseStudiesConfig, setCaseStudiesConfig] = useState(initialCaseStudies || {});
   const [reviewsConfig, setReviewsConfig] = useState(initialReviews || {});
   const [faqConfig, setFaqConfig] = useState(initialFaq || {});
   const [footerConfig, setFooterConfig] = useState(initialFooter || {});
   const [careersConfig, setCareersConfig] = useState(initialCareers || {});
   const [teamConfig, setTeamConfig] = useState(initialTeam || {});

   const [isSaving, setIsSaving] = useState(false);
   const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

   // Auto-hide message
   useEffect(() => {
      if (message) {
         const timer = setTimeout(() => setMessage(null), 3000);
         return () => clearTimeout(timer);
      }
   }, [message]);

   const handleSave = async () => {
      setIsSaving(true);
      setMessage(null);
      try {
         let result;
         switch (activeTab) {
            case "hero": result = await updateConfig("hero", heroConfig); break;
            case "navbar": result = await updateConfig("navbar", navbarConfig); break;
            case "partners": result = await updateConfig("partners", partnersConfig); break;
            case "impact": result = await updateConfig("impact", impactConfig); break;
            case "whyUs": result = await updateConfig("whyUs", whyUsConfig); break;
            case "services": result = await updateConfig("services", servicesConfig); break;
            case "comparison": result = await updateConfig("comparison", comparisonConfig); break;
            case "workflow": result = await updateConfig("workflow", workflowConfig); break;
            case "caseStudies": result = await updateConfig("caseStudies", caseStudiesConfig); break;
            case "reviews": result = await updateConfig("reviews", reviewsConfig); break;
            case "faq": result = await updateConfig("faq", faqConfig); break;
            case "footer": result = await updateConfig("footer", footerConfig); break;
            case "careers": result = await updateConfig("careers", careersConfig); break;
            case "team": result = await updateConfig("team", teamConfig); break;
         }

         if (result && result.success) {
            setMessage({ type: "success", text: "Changes saved successfully" });
         } else {
            setMessage({ type: "error", text: result?.error || "Failed to save" });
         }
      } catch {
         setMessage({ type: "error", text: "An unexpected error occurred" });
      } finally {
         setIsSaving(false);
      }
   };

   const navItems = [
      { id: "hero", label: "Hero Section", icon: Layout },
      { id: "navbar", label: "Navigation", icon: Menu },
      { id: "partners", label: "Partners", icon: Users },
      { id: "impact", label: "Impact Stats", icon: BarChart },
      { id: "whyUs", label: "Why Us", icon: Target },
      { id: "services", label: "Services", icon: Layers },
      { id: "comparison", label: "Comparison", icon: GitCompare },
      { id: "workflow", label: "Workflow", icon: Workflow },
      { id: "caseStudies", label: "Case Studies", icon: Briefcase },
      { id: "reviews", label: "Testimonials", icon: Star },
      { id: "faq", label: "FAQ", icon: HelpCircle },
      { id: "footer", label: "Footer", icon: MapPin },
      { id: "careers", label: "Careers", icon: Megaphone },
      { id: "blogs", label: "Blog Posts", icon: FileText },
      { id: "products", label: "Products", icon: FileText },
      { id: "leads", label: "Leads", icon: FileText },
      { id: "team", label: "Team", icon: Smile },
      { id: "portfolio", label: "Portfolio", icon: ImageIcon },
   ];

   return (
      <div className="flex flex-col lg:flex-row h-full gap-0 lg:gap-6 max-w-[1800px] mx-auto relative">

         {/* Mobile Sidebar Overlay */}
         <AnimatePresence>
            {isSidebarOpen && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
               />
            )}
         </AnimatePresence>

         {/* Sidebar - Mobile: Fixed drawer. Desktop: Static sidebar */}
         <motion.aside
            className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r lg:border border-zinc-100 shadow-xl lg:shadow-sm flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:rounded-3xl lg:h-full lg:z-auto ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
               }`}
         >
            <div className="p-6 border-b border-zinc-50 flex items-center justify-between">
               <div className="flex items-center gap-2 text-zinc-900 font-bold text-lg tracking-tight">
                  <Settings className="w-5 h-5" />
                  <span>Admin Panel</span>
               </div>
               <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-zinc-400"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-zinc-200">
               <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 mt-2">Sections</p>
               {navItems.map((item) => (
                  <button
                     key={item.id}
                     onClick={() => {
                        if (item.id === "blogs") {
                           window.location.href = "/admin/blogs";
                           return;
                        }
                        if (item.id === "products") {
                           window.location.href = "/admin/products";
                           return;
                        }
                        if (item.id === "leads") {
                           window.location.href = "/admin/leads";
                           return;
                        }
                        if (item.id === "portfolio") {
                           window.location.href = "/admin/portfolio";
                           return;
                        }
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                     }}
                     className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${activeTab === item.id
                        ? "bg-black text-white shadow-md shadow-zinc-900/10"
                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                        }`}
                  >
                     <div className="flex items-center gap-3">
                        <item.icon className={`w-4 h-4 ${activeTab === item.id ? "text-white" : "text-zinc-400 group-hover:text-zinc-600"}`} />
                        {item.label}
                     </div>
                     {activeTab === item.id && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
                  </button>
               ))}
            </div>

            <div className="p-4 border-t border-zinc-50">
               <div className="flex items-center justify-between bg-zinc-50 rounded-xl p-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                     <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">AD</div>
                     <div className="overflow-hidden">
                        <div className="text-xs font-semibold text-zinc-900 truncate">Administrator</div>
                        <div className="text-[10px] text-zinc-500 truncate">Manage Content</div>
                     </div>
                  </div>
                  <form action={logoutAction}>
                     <button type="submit" className="text-zinc-400 hover:text-red-500 transition-colors p-1" title="Sign Out">
                        <LogOut className="w-4 h-4" />
                     </button>
                  </form>
               </div>
            </div>
         </motion.aside>

         {/* Main Content */}
         <main className="flex-1 flex flex-col min-w-0 lg:h-full bg-[#FAFAFA] lg:bg-transparent">
            {/* Top Bar - Sticky on Mobile, Fixed/Sticky on Desktop inside container */}
            <div className="sticky top-0 z-30 bg-[#FAFAFA]/90 backdrop-blur-md px-4 py-3 lg:px-0 lg:pt-0 lg:pb-4 flex items-center justify-between lg:justify-end border-b lg:border-none border-zinc-200/50">
               <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-zinc-600 hover:bg-white rounded-lg"><Menu className="w-6 h-6" /></button>

               <div className="flex items-center gap-3 ml-auto lg:bg-white lg:p-1.5 lg:pr-2 lg:rounded-2xl lg:border lg:border-zinc-100 lg:shadow-sm">
                  <span className="text-xs font-medium text-zinc-400 px-3 hidden sm:block">
                     {isSaving ? "Saving..." : "Unsaved changes?"}
                  </span>
                  <button
                     onClick={handleSave}
                     disabled={isSaving}
                     className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg lg:rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all disabled:opacity-50 shadow-lg shadow-zinc-900/20 active:translate-y-0.5"
                  >
                     {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                     <span className="hidden sm:inline">Save Changes</span>
                     <span className="sm:hidden">Save</span>
                  </button>
               </div>
            </div>

            <AnimatePresence mode="wait">
               {message && (
                  <motion.div
                     initial={{ opacity: 0, y: -20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                     className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-medium ${message.type === 'success' ? 'bg-white text-green-700 border border-green-100' : 'bg-white text-red-700 border border-red-100'
                        }`}
                  >
                     <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                     {message.text}
                  </motion.div>
               )}
            </AnimatePresence>

            {/* Scrollable Area for Desktop (Window scroll for mobile) */}
            <div className="flex-1 lg:overflow-y-auto lg:pr-2 scrollbar-thin scrollbar-thumb-zinc-200">
               <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 lg:p-0 pb-32 lg:pb-10 space-y-6"
               >
                  {/* Header for Section */}
                  <div className="mb-2">
                     <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">{navItems.find(i => i.id === activeTab)?.label}</h1>
                     <p className="text-zinc-500 mt-1">Manage content and settings for this section.</p>
                  </div>

                  {/* HERO */}
                  {activeTab === "hero" && (
                     <div className="space-y-6 max-w-3xl">
                        <SectionCard title="Badge Text">
                           <Input label="Badge" icon={Type} value={heroConfig.badge || ""} onChange={(e: any) => setHeroConfig({ ...heroConfig, badge: e.target.value })} placeholder="Hey there 👋" />
                        </SectionCard>
                        <SectionCard title="Text Content" description="Use *asterisks* around text to make it blue (e.g., *any niche.*)">
                           <div className="space-y-4">
                              <Input label="Headline" icon={Type} value={heroConfig.headline || ""} onChange={(e: any) => setHeroConfig({ ...heroConfig, headline: e.target.value })} placeholder="We help you dominate *any niche.*" />
                              <TextArea label="Subheadline" icon={Type} value={heroConfig.subheadline || ""} onChange={(e: any) => setHeroConfig({ ...heroConfig, subheadline: e.target.value })} placeholder="A full-service Digital Agency..." />
                           </div>
                        </SectionCard>
                        <SectionCard title="Primary Call to Action">
                           <div className="grid grid-cols-2 gap-4">
                              <Input label="Button Text" value={heroConfig.ctaText || ""} onChange={(e: any) => setHeroConfig({ ...heroConfig, ctaText: e.target.value })} placeholder="Contact" />
                              <Input label="Button Link" icon={LinkIcon} value={heroConfig.ctaLink || ""} onChange={(e: any) => setHeroConfig({ ...heroConfig, ctaLink: e.target.value })} placeholder="/#contact" />
                           </div>
                        </SectionCard>
                        <SectionCard title="Secondary Call to Action">
                           <div className="grid grid-cols-2 gap-4">
                              <Input label="Button Text" value={heroConfig.secondaryCtaText || ""} onChange={(e: any) => setHeroConfig({ ...heroConfig, secondaryCtaText: e.target.value })} placeholder="Services" />
                              <Input label="Button Link" icon={LinkIcon} value={heroConfig.secondaryCtaLink || ""} onChange={(e: any) => setHeroConfig({ ...heroConfig, secondaryCtaLink: e.target.value })} placeholder="/services" />
                           </div>
                        </SectionCard>
                     </div>
                  )}

                  {/* NAVBAR */}
                  {activeTab === "navbar" && (
                     <div className="space-y-6">
                        <SectionCard title="Branding" className="max-w-3xl">
                           <div className="flex flex-col sm:flex-row gap-6">
                              <div className="flex-1">
                                 <Input label="Site Title" icon={Type} value={navbarConfig.title || ""} onChange={(e: any) => setNavbarConfig({ ...navbarConfig, title: e.target.value })} />
                              </div>
                              <div className="w-full sm:w-40">
                                 <ImageUploader label="Logo" value={navbarConfig.logo} onChange={(res: string) => setNavbarConfig({ ...navbarConfig, logo: res })} className="h-32" />
                              </div>
                           </div>
                        </SectionCard>

                        <SectionCard title="Navigation Links" className="max-w-3xl">
                           <div className="space-y-3">
                              {navbarConfig.links?.map((link: any, index: number) => (
                                 <div key={index} className="flex gap-3 items-center group bg-zinc-50 p-2 rounded-xl border border-zinc-100 hover:border-zinc-300 transition-colors">
                                    <div className="flex-1">
                                       <input placeholder="Label" value={link.label} onChange={(e) => { const n = [...navbarConfig.links]; n[index].label = e.target.value; setNavbarConfig({ ...navbarConfig, links: n }) }} className="w-full bg-transparent text-sm font-medium focus:outline-none px-2" />
                                    </div>
                                    <div className="w-px h-6 bg-zinc-200" />
                                    <div className="flex-1">
                                       <input placeholder="/path" value={link.href} onChange={(e) => { const n = [...navbarConfig.links]; n[index].href = e.target.value; setNavbarConfig({ ...navbarConfig, links: n }) }} className="w-full bg-transparent text-sm text-zinc-500 font-mono focus:outline-none px-2" />
                                    </div>
                                    <IconButton icon={X} variant="danger" onClick={() => { const n = navbarConfig.links.filter((_: any, i: number) => i !== index); setNavbarConfig({ ...navbarConfig, links: n }) }} />
                                 </div>
                              ))}
                              <button onClick={() => setNavbarConfig({ ...navbarConfig, links: [...(navbarConfig.links || []), { label: "", href: "" }] })} className="w-full py-3 border-2 border-dashed border-zinc-200 rounded-xl text-zinc-400 text-sm font-medium hover:bg-zinc-50 hover:border-zinc-300 transition-all flex items-center justify-center gap-2">
                                 <Plus className="w-4 h-4" /> Add Link
                              </button>
                           </div>
                        </SectionCard>

                        <SectionCard title="Booking Button" className="max-w-3xl">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <Input label="Button Text" value={navbarConfig.bookingText} onChange={(e: any) => setNavbarConfig({ ...navbarConfig, bookingText: e.target.value })} placeholder="Book a call" />
                              <Input label="Button Link" icon={LinkIcon} value={navbarConfig.bookingLink} onChange={(e: any) => setNavbarConfig({ ...navbarConfig, bookingLink: e.target.value })} placeholder="/#contact" />
                           </div>
                        </SectionCard>
                     </div>
                  )}

                  {/* PARTNERS */}
                  {activeTab === "partners" && (
                     <div className="space-y-6 max-w-4xl">
                        <SectionCard>
                           <Input label="Section Title" value={partnersConfig.title || ""} onChange={(e: any) => setPartnersConfig({ ...partnersConfig, title: e.target.value })} />
                        </SectionCard>

                        <SectionCard title="Partner Logos">
                           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {partnersConfig.items?.map((item: any, index: number) => (
                                 <div key={index} className="relative group bg-zinc-50 rounded-xl border border-zinc-100 p-4 flex flex-col items-center justify-center min-h-[140px]">
                                    <button onClick={() => { const n = partnersConfig.items.filter((_: any, i: number) => i !== index); setPartnersConfig({ ...partnersConfig, items: n }) }} className="absolute top-2 right-2 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-4 h-4" /></button>
                                    {item.type === 'text' ? (
                                       <input value={item.value} onChange={(e) => { const n = [...partnersConfig.items]; n[index].value = e.target.value; setPartnersConfig({ ...partnersConfig, items: n }) }} className="text-center bg-transparent font-bold text-zinc-800 w-full focus:outline-none border-b border-transparent focus:border-zinc-300" placeholder="Name" />
                                    ) : (
                                       <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                          {item.value ? <img src={item.value} className={`h-10 object-contain ${item.filter === 'invert' ? 'invert' : item.filter === 'brightness' ? 'brightness-0' : ''}`} /> : <ImageIcon className="w-8 h-8 text-zinc-300" />}
                                          <label className="text-[10px] text-blue-600 cursor-pointer hover:underline">
                                             Upload
                                             <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                   const reader = new FileReader();
                                                   reader.onloadend = () => {
                                                      if (typeof reader.result === 'string') {
                                                         const n = [...partnersConfig.items];
                                                         n[index].value = reader.result;
                                                         setPartnersConfig({ ...partnersConfig, items: n });
                                                      }
                                                   };
                                                   reader.readAsDataURL(file);
                                                }
                                             }} />
                                          </label>
                                          {item.value && (
                                             <select
                                                value={item.filter || 'none'}
                                                onChange={(e) => { const n = [...partnersConfig.items]; n[index].filter = e.target.value; setPartnersConfig({ ...partnersConfig, items: n }) }}
                                                className="text-[10px] bg-white border border-zinc-200 rounded-lg px-2 py-1 text-zinc-600 focus:outline-none focus:border-zinc-400"
                                             >
                                                <option value="none">No Filter</option>
                                                <option value="invert">Invert (Black → White)</option>
                                                <option value="brightness">Force Black</option>
                                             </select>
                                          )}
                                       </div>
                                    )}
                                    <span className="absolute bottom-2 left-2 text-[10px] font-bold text-zinc-300 uppercase">{item.type}</span>
                                 </div>
                              ))}
                              <div className="flex flex-col gap-2 min-h-[140px]">
                                 <button onClick={() => setPartnersConfig({ ...partnersConfig, items: [...(partnersConfig.items || []), { type: "image", value: "", filter: "none" }] })} className="flex-1 border-2 border-dashed border-zinc-200 rounded-xl flex items-center justify-center gap-2 text-zinc-500 hover:bg-zinc-50 hover:border-zinc-300 transition-all font-medium text-xs"><ImageIcon className="w-4 h-4" /> Add Image</button>
                                 <button onClick={() => setPartnersConfig({ ...partnersConfig, items: [...(partnersConfig.items || []), { type: "text", value: "" }] })} className="flex-1 border-2 border-dashed border-zinc-200 rounded-xl flex items-center justify-center gap-2 text-zinc-500 hover:bg-zinc-50 hover:border-zinc-300 transition-all font-medium text-xs"><Type className="w-4 h-4" /> Add Text</button>
                              </div>
                           </div>
                        </SectionCard>
                     </div>
                  )}

                  {/* IMPACT */}
                  {activeTab === "impact" && (
                     <div className="space-y-6 max-w-5xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                           {impactConfig.stats?.map((stat: any, index: number) => (
                              <div key={index} className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm relative group space-y-3">
                                 <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <IconButton icon={Trash2} variant="danger" onClick={() => { const n = impactConfig.stats.filter((_: any, i: number) => i !== index); setImpactConfig({ ...impactConfig, stats: n }) }} />
                                 </div>
                                 <div className="flex gap-2">
                                    <div className="flex-1"><Input label="Value" value={stat.value} onChange={(e: any) => { const n = [...impactConfig.stats]; n[index].value = e.target.value; setImpactConfig({ ...impactConfig, stats: n }) }} className="text-lg font-bold" /></div>
                                    <div className="w-20"><Input label="Suffix" value={stat.suffix} onChange={(e: any) => { const n = [...impactConfig.stats]; n[index].suffix = e.target.value; setImpactConfig({ ...impactConfig, stats: n }) }} /></div>
                                 </div>
                                 <Input label="Label" value={stat.label} onChange={(e: any) => { const n = [...impactConfig.stats]; n[index].label = e.target.value; setImpactConfig({ ...impactConfig, stats: n }) }} />
                                 <Input label="Sublabel" value={stat.sublabel} onChange={(e: any) => { const n = [...impactConfig.stats]; n[index].sublabel = e.target.value; setImpactConfig({ ...impactConfig, stats: n }) }} />
                              </div>
                           ))}
                           <button onClick={() => setImpactConfig({ ...impactConfig, stats: [...(impactConfig.stats || []), { value: "0", suffix: "", label: "New Stat", sublabel: "Description" }] })} className="border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-zinc-400 hover:bg-zinc-50 hover:border-zinc-300 transition-all min-h-[200px]">
                              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center"><Plus className="w-5 h-5" /></div>
                              <span className="font-medium text-sm">Add Statistic</span>
                           </button>
                        </div>
                     </div>
                  )}

                  {/* WHY US */}
                  {activeTab === "whyUs" && (
                     <div className="space-y-6 max-w-4xl">
                        <SectionCard>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <Input label="Headline Prefix (Strikethrough)" value={whyUsConfig.headline_prefix} onChange={(e: any) => setWhyUsConfig({ ...whyUsConfig, headline_prefix: e.target.value })} />
                              <Input label="Headline Main" value={whyUsConfig.headline_suffix} onChange={(e: any) => setWhyUsConfig({ ...whyUsConfig, headline_suffix: e.target.value })} />
                           </div>
                        </SectionCard>

                        <div className="space-y-4">
                           <Label>Features</Label>
                           {whyUsConfig.features?.map((feature: any, index: number) => (
                              <div key={index} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex flex-col md:flex-row gap-6 group relative">
                                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <IconButton icon={Trash2} variant="danger" onClick={() => { const n = whyUsConfig.features.filter((_: any, i: number) => i !== index); setWhyUsConfig({ ...whyUsConfig, features: n }) }} />
                                 </div>
                                 <div className="w-full md:w-24 flex-shrink-0">
                                    <Input label="ID" value={feature.id} onChange={(e: any) => { const n = [...whyUsConfig.features]; n[index].id = e.target.value; setWhyUsConfig({ ...whyUsConfig, features: n }) }} />
                                 </div>
                                 <div className="flex-1 space-y-4">
                                    <Input label="Title" value={feature.title} onChange={(e: any) => { const n = [...whyUsConfig.features]; n[index].title = e.target.value; setWhyUsConfig({ ...whyUsConfig, features: n }) }} />
                                    <TextArea label="Description" value={feature.description} onChange={(e: any) => { const n = [...whyUsConfig.features]; n[index].description = e.target.value; setWhyUsConfig({ ...whyUsConfig, features: n }) }} className="min-h-[80px]" />
                                 </div>
                              </div>
                           ))}
                           <button onClick={() => setWhyUsConfig({ ...whyUsConfig, features: [...(whyUsConfig.features || []), { id: "04", title: "New Feature", description: "Description here." }] })} className="w-full py-4 border-2 border-dashed border-zinc-200 rounded-2xl flex items-center justify-center gap-2 text-zinc-400 hover:bg-zinc-50 hover:border-zinc-300 transition-all font-medium">
                              <Plus className="w-5 h-5" /> Add Feature
                           </button>
                        </div>
                     </div>
                  )}

                  {/* SERVICES */}
                  {activeTab === "services" && (
                     <div className="space-y-8 max-w-4xl">
                        <SectionCard title="Header">
                           <div className="space-y-4">
                              <Input label="Section Label" value={servicesConfig.label} onChange={(e: any) => setServicesConfig({ ...servicesConfig, label: e.target.value })} />
                              <Input label="Headline" value={servicesConfig.headline} onChange={(e: any) => setServicesConfig({ ...servicesConfig, headline: e.target.value })} />
                              <TextArea label="Subheadline" value={servicesConfig.subheadline} onChange={(e: any) => setServicesConfig({ ...servicesConfig, subheadline: e.target.value })} />
                           </div>
                        </SectionCard>

                        <div className="space-y-6">
                           <Label>Service Categories</Label>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {servicesConfig.categories?.map((cat: any, index: number) => (
                                 <div key={index} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                       <input
                                          className="text-lg font-bold text-zinc-900 bg-transparent border-none p-0 focus:ring-0 w-full"
                                          value={cat.title}
                                          onChange={(e) => { const n = [...servicesConfig.categories]; n[index].title = e.target.value; setServicesConfig({ ...servicesConfig, categories: n }) }}
                                          placeholder="Category Title"
                                       />
                                       <IconButton icon={Trash2} variant="danger" onClick={() => { const n = servicesConfig.categories.filter((_: any, i: number) => i !== index); setServicesConfig({ ...servicesConfig, categories: n }) }} />
                                    </div>
                                    <div className="space-y-2 flex-1">
                                       {cat.items.map((item: string, idx: number) => (
                                          <div key={idx} className="flex items-center gap-2 group">
                                             <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                                             <input className="w-full bg-transparent border-b border-transparent hover:border-zinc-100 focus:border-zinc-300 text-sm text-zinc-600 focus:outline-none py-1" value={item} onChange={(e) => { const n = [...servicesConfig.categories]; n[index].items[idx] = e.target.value; setServicesConfig({ ...servicesConfig, categories: n }) }} />
                                             <button onClick={() => { const n = [...servicesConfig.categories]; n[index].items = n[index].items.filter((_: any, ii: number) => ii !== idx); setServicesConfig({ ...servicesConfig, categories: n }) }} className="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-red-500 transition-opacity"><X className="w-3 h-3" /></button>
                                          </div>
                                       ))}
                                       <button onClick={() => { const n = [...servicesConfig.categories]; n[index].items.push("New Service Item"); setServicesConfig({ ...servicesConfig, categories: n }) }} className="text-xs font-semibold text-blue-600 hover:text-blue-700 mt-3 flex items-center gap-1"><Plus className="w-3 h-3" /> Add Item</button>
                                    </div>
                                 </div>
                              ))}
                              <button onClick={() => setServicesConfig({ ...servicesConfig, categories: [...(servicesConfig.categories || []), { title: "New Category", items: ["Item 1"] }] })} className="border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-zinc-400 hover:bg-zinc-50 hover:border-zinc-300 transition-all min-h-[200px]">
                                 <Plus className="w-6 h-6" /> <span className="font-medium">Add Category</span>
                              </button>
                           </div>
                        </div>

                        <SectionCard title="Bottom Call to Action">
                           <div className="space-y-4">
                              <Input label="Title" value={servicesConfig.cta?.title || ""} onChange={(e: any) => setServicesConfig({ ...servicesConfig, cta: { ...servicesConfig.cta, title: e.target.value } })} />
                              <Input label="Description" value={servicesConfig.cta?.description || ""} onChange={(e: any) => setServicesConfig({ ...servicesConfig, cta: { ...servicesConfig.cta, description: e.target.value } })} />
                              <div>
                                 <Label>Tags</Label>
                                 <div className="flex flex-wrap gap-2 mt-2">
                                    {servicesConfig.cta?.tags?.map((tag: string, i: number) => (
                                       <Badge key={i} onRemove={() => { const n = [...servicesConfig.cta.tags]; n.splice(i, 1); setServicesConfig({ ...servicesConfig, cta: { ...servicesConfig.cta, tags: n } }) }}>{tag}</Badge>
                                    ))}
                                    <button onClick={() => { const t = prompt("Enter tag:"); if (t) { const n = [...(servicesConfig.cta?.tags || [])]; n.push(t); setServicesConfig({ ...servicesConfig, cta: { ...servicesConfig.cta, tags: n } }) } }} className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-700 flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
                                 </div>
                              </div>
                           </div>
                        </SectionCard>
                     </div>
                  )}

                  {/* COMPARISON */}
                  {activeTab === "comparison" && (
                     <div className="space-y-8 max-w-5xl">
                        <SectionCard>
                           <Input label="Main Headline" value={comparisonConfig?.headline} onChange={(e: any) => setComparisonConfig({ ...comparisonConfig, headline: e.target.value })} />
                        </SectionCard>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           {['niche', 'competitor1', 'competitor2'].map((key) => (
                              <div key={key} className={`p-6 rounded-2xl border relative ${key === 'niche' ? 'bg-zinc-900 text-white border-zinc-800' : 'bg-white text-zinc-900 border-zinc-100'}`}>
                                 <div className="mb-4">
                                    <Label className={key === 'niche' ? 'text-zinc-500' : ''}>{key === 'niche' ? 'Us (Niche)' : 'Competitor'}</Label>
                                    <input
                                       value={comparisonConfig?.[key]?.title}
                                       onChange={(e: any) => setComparisonConfig({ ...comparisonConfig, [key]: { ...(comparisonConfig?.[key] || {}), title: e.target.value } })}
                                       className={`w-full bg-transparent text-lg font-bold outline-none border-b ${key === 'niche' ? 'border-zinc-700 focus:border-white' : 'border-zinc-200 focus:border-black'}`}
                                    />
                                 </div>
                                 <div className="space-y-3">
                                    {comparisonConfig?.[key]?.items?.map((item: string, idx: number) => (
                                       <div key={idx} className="flex gap-2">
                                          <input
                                             value={item}
                                             onChange={(e) => { const n = [...(comparisonConfig[key].items || [])]; n[idx] = e.target.value; setComparisonConfig({ ...comparisonConfig, [key]: { ...comparisonConfig[key], items: n } }) }}
                                             className={`w-full bg-transparent text-sm outline-none py-1 border-b border-transparent focus:border-current opacity-90`}
                                          />
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* WORKFLOW */}
                  {activeTab === "workflow" && (
                     <div className="space-y-6 max-w-4xl">
                        <SectionCard>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <Input label="Label" value={workflowConfig?.label} onChange={(e: any) => setWorkflowConfig({ ...workflowConfig, label: e.target.value })} />
                              <Input label="Headline" value={workflowConfig?.headline} onChange={(e: any) => setWorkflowConfig({ ...workflowConfig, headline: e.target.value })} />
                           </div>
                        </SectionCard>

                        <div className="space-y-4">
                           <Label>Workflow Steps</Label>
                           {workflowConfig?.steps?.map((step: any, idx: number) => (
                              <div key={idx} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex gap-4 items-start">
                                 <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-500 text-xs shrink-0">{idx + 1}</div>
                                 <div className="flex-1 space-y-4">
                                    <Input label="Step Title" value={step.title} onChange={(e: any) => { const n = [...(workflowConfig.steps || [])]; n[idx].title = e.target.value; setWorkflowConfig({ ...workflowConfig, steps: n }) }} />
                                    <TextArea label="Description" value={step.desc} onChange={(e: any) => { const n = [...(workflowConfig.steps || [])]; n[idx].desc = e.target.value; setWorkflowConfig({ ...workflowConfig, steps: n }) }} className="min-h-[80px]" />
                                 </div>
                              </div>
                           ))}
                        </div>

                        <SectionCard title="Workflow CTA">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <Input label="CTA Title" value={workflowConfig?.cta?.title} onChange={(e: any) => setWorkflowConfig({ ...workflowConfig, cta: { ...(workflowConfig.cta || {}), title: e.target.value } })} />
                              <Input label="Button Text" value={workflowConfig?.cta?.buttonText} onChange={(e: any) => setWorkflowConfig({ ...workflowConfig, cta: { ...(workflowConfig.cta || {}), buttonText: e.target.value } })} />
                              <div className="md:col-span-2">
                                 <Input label="Button Link" icon={LinkIcon} value={workflowConfig?.cta?.buttonLink} onChange={(e: any) => setWorkflowConfig({ ...workflowConfig, cta: { ...(workflowConfig.cta || {}), buttonLink: e.target.value } })} />
                              </div>
                           </div>
                        </SectionCard>
                     </div>
                  )}

                  {/* CASE STUDIES */}
                  {activeTab === "caseStudies" && (
                     <div className="space-y-6 max-w-5xl">
                        <SectionCard>
                           <Input label="Section Headline" value={caseStudiesConfig?.headline} onChange={(e: any) => setCaseStudiesConfig({ ...caseStudiesConfig, headline: e.target.value })} />
                        </SectionCard>

                        <div className="space-y-6">
                           {caseStudiesConfig?.items?.map((item: any, idx: number) => (
                              <div key={idx} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex flex-col md:flex-row gap-8 relative group">
                                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <IconButton icon={Trash2} variant="danger" onClick={() => { const n = caseStudiesConfig.items.filter((_: any, i: number) => i !== idx); setCaseStudiesConfig({ ...caseStudiesConfig, items: n }) }} />
                                 </div>
                                 <div className="w-full md:w-64 flex-shrink-0">
                                    <ImageUploader label="Cover Image" value={item.image} onChange={(res: string) => { const n = [...(caseStudiesConfig.items || [])]; n[idx].image = res; setCaseStudiesConfig({ ...caseStudiesConfig, items: n }) }} className="h-40" />
                                 </div>
                                 <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input label="Client / Title" value={item.title} onChange={(e: any) => { const n = [...(caseStudiesConfig.items || [])]; n[idx].title = e.target.value; setCaseStudiesConfig({ ...caseStudiesConfig, items: n }) }} />
                                    <Input label="Category" value={item.category} onChange={(e: any) => { const n = [...(caseStudiesConfig.items || [])]; n[idx].category = e.target.value; setCaseStudiesConfig({ ...caseStudiesConfig, items: n }) }} />
                                    <div className="md:col-span-2"><TextArea label="Description" value={item.description} onChange={(e: any) => { const n = [...(caseStudiesConfig.items || [])]; n[idx].description = e.target.value; setCaseStudiesConfig({ ...caseStudiesConfig, items: n }) }} /></div>
                                    <div className="md:col-span-2"><Input label="Slug (URL path)" value={item.slug} onChange={(e: any) => { const n = [...(caseStudiesConfig.items || [])]; n[idx].slug = e.target.value; setCaseStudiesConfig({ ...caseStudiesConfig, items: n }) }} placeholder="e.g. scaling-fintech" /></div>
                                    <div className="md:col-span-2"><TextArea label="Full Content (Markdown)" value={item.content} onChange={(e: any) => { const n = [...(caseStudiesConfig.items || [])]; n[idx].content = e.target.value; setCaseStudiesConfig({ ...caseStudiesConfig, items: n }) }} className="min-h-[200px]" placeholder="# Project Overview..." /></div>
                                    <Input label="Stat Badge" value={item.stat} onChange={(e: any) => { const n = [...(caseStudiesConfig.items || [])]; n[idx].stat = e.target.value; setCaseStudiesConfig({ ...caseStudiesConfig, items: n }) }} />
                                    <Input label="Link" icon={LinkIcon} value={item.link} onChange={(e: any) => { const n = [...(caseStudiesConfig.items || [])]; n[idx].link = e.target.value; setCaseStudiesConfig({ ...caseStudiesConfig, items: n }) }} />
                                 </div>
                              </div>
                           ))}
                           <button onClick={() => setCaseStudiesConfig({ ...caseStudiesConfig, items: [...(caseStudiesConfig.items || []), { title: "New Case", category: "Category", description: "Desc", stat: "+100%", link: "#" }] })} className="w-full py-4 border-2 border-dashed border-zinc-200 rounded-2xl flex items-center justify-center gap-2 text-zinc-400 hover:bg-zinc-50 hover:border-zinc-300 transition-all font-medium">
                              <Plus className="w-5 h-5" /> Add Case Study
                           </button>
                        </div>
                     </div>
                  )}

                  {/* REVIEWS */}
                  {activeTab === "reviews" && (
                     <div className="space-y-6 max-w-4xl">
                        <SectionCard>
                           <Input label="Section Headline" value={reviewsConfig?.headline} onChange={(e: any) => setReviewsConfig({ ...reviewsConfig, headline: e.target.value })} />
                        </SectionCard>

                        <div className="bg-zinc-900 rounded-2xl p-6 md:p-8 text-white">
                           <div className="flex items-center gap-2 mb-4 text-zinc-400 font-bold text-xs uppercase tracking-widest"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> Featured Review</div>
                           <textarea
                              value={reviewsConfig?.featured?.text}
                              onChange={(e: any) => setReviewsConfig({ ...reviewsConfig, featured: { ...(reviewsConfig.featured || {}), text: e.target.value } })}
                              className="w-full bg-transparent text-xl md:text-2xl font-medium text-white placeholder:text-zinc-600 outline-none resize-none mb-6"
                              placeholder="Quote text..."
                           />
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                 <label className="text-xs text-zinc-500 uppercase font-bold">Author</label>
                                 <input className="w-full bg-transparent border-b border-zinc-700 focus:border-white outline-none py-1" value={reviewsConfig?.featured?.author} onChange={(e: any) => setReviewsConfig({ ...reviewsConfig, featured: { ...(reviewsConfig.featured || {}), author: e.target.value } })} />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-xs text-zinc-500 uppercase font-bold">Role</label>
                                 <input className="w-full bg-transparent border-b border-zinc-700 focus:border-white outline-none py-1" value={reviewsConfig?.featured?.role} onChange={(e: any) => setReviewsConfig({ ...reviewsConfig, featured: { ...(reviewsConfig.featured || {}), role: e.target.value } })} />
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {reviewsConfig?.items?.map((review: any, idx: number) => (
                              <div key={idx} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm relative group">
                                 <button onClick={() => { const n = reviewsConfig.items.filter((_: any, i: number) => i !== idx); setReviewsConfig({ ...reviewsConfig, items: n }) }} className="absolute top-4 right-4 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-4 h-4" /></button>
                                 <div className="mb-4">
                                    <Input label="Review Text" type="textarea" value={review.text} onChange={(e: any) => { const n = [...(reviewsConfig.items || [])]; n[idx].text = e.target.value; setReviewsConfig({ ...reviewsConfig, items: n }) }} className="min-h-[80px]" />
                                 </div>
                                 <div className="grid grid-cols-2 gap-3">
                                    <Input label="Name" value={review.name} onChange={(e: any) => { const n = [...(reviewsConfig.items || [])]; n[idx].name = e.target.value; setReviewsConfig({ ...reviewsConfig, items: n }) }} />
                                    <Input label="Rating" type="number" value={review.rating} onChange={(e: any) => { const n = [...(reviewsConfig.items || [])]; n[idx].rating = parseInt(e.target.value); setReviewsConfig({ ...reviewsConfig, items: n }) }} />
                                    <div className="col-span-2"><Input label="Date" value={review.date} onChange={(e: any) => { const n = [...(reviewsConfig.items || [])]; n[idx].date = e.target.value; setReviewsConfig({ ...reviewsConfig, items: n }) }} /></div>
                                 </div>
                              </div>
                           ))}
                           <button onClick={() => setReviewsConfig({ ...reviewsConfig, items: [...(reviewsConfig.items || []), { name: "User", date: "Date", rating: 5, text: "Review text" }] })} className="border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-zinc-400 hover:bg-zinc-50 hover:border-zinc-300 transition-all min-h-[200px]">
                              <Plus className="w-6 h-6" /> <span className="font-medium">Add Review</span>
                           </button>
                        </div>
                     </div>
                  )}

                  {/* FAQ */}
                  {activeTab === "faq" && (
                     <div className="space-y-6 max-w-4xl">
                        <SectionCard>
                           <Input label="Headline" value={faqConfig?.headline} onChange={(e: any) => setFaqConfig({ ...faqConfig, headline: e.target.value })} />
                           <div className="mt-4">
                              <TextArea label="Description" value={faqConfig?.description} onChange={(e: any) => setFaqConfig({ ...faqConfig, description: e.target.value })} />
                           </div>
                        </SectionCard>

                        <div className="space-y-4">
                           {faqConfig?.items?.map((item: any, idx: number) => (
                              <div key={idx} className="bg-white p-5 rounded-xl border border-zinc-100 shadow-sm group">
                                 <div className="flex gap-4 items-start">
                                    <div className="flex-1 space-y-4">
                                       <Input label="Question" value={item.question} onChange={(e: any) => { const n = [...(faqConfig.items || [])]; n[idx].question = e.target.value; setFaqConfig({ ...faqConfig, items: n }) }} />
                                       <TextArea label="Answer" value={item.answer} onChange={(e: any) => { const n = [...(faqConfig.items || [])]; n[idx].answer = e.target.value; setFaqConfig({ ...faqConfig, items: n }) }} />
                                    </div>
                                    <IconButton icon={Trash2} variant="danger" onClick={() => { const n = faqConfig.items.filter((_: any, i: number) => i !== idx); setFaqConfig({ ...faqConfig, items: n }) }} className="mt-6" />
                                 </div>
                              </div>
                           ))}
                           <button onClick={() => setFaqConfig({ ...faqConfig, items: [...(faqConfig.items || []), { id: "00", question: "New Question?", answer: "Answer here." }] })} className="w-full py-4 border-2 border-dashed border-zinc-200 rounded-2xl flex items-center justify-center gap-2 text-zinc-400 hover:bg-zinc-50 hover:border-zinc-300 transition-all font-medium">
                              <Plus className="w-5 h-5" /> Add Question
                           </button>
                        </div>
                     </div>
                  )}

                  {/* FOOTER */}
                  {activeTab === "footer" && (
                     <div className="space-y-8 max-w-4xl">
                        <SectionCard title="Contact & Socials">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <Input label="Phone Number" value={footerConfig?.contact?.phone} onChange={(e: any) => setFooterConfig({ ...footerConfig, contact: { ...(footerConfig.contact || {}), phone: e.target.value } })} />
                              <div className="hidden md:block"></div>
                              <Input label="Twitter URL" value={footerConfig?.socials?.twitter} onChange={(e: any) => setFooterConfig({ ...footerConfig, socials: { ...(footerConfig.socials || {}), twitter: e.target.value } })} />
                              <Input label="Instagram URL" value={footerConfig?.socials?.instagram} onChange={(e: any) => setFooterConfig({ ...footerConfig, socials: { ...(footerConfig.socials || {}), instagram: e.target.value } })} />
                              <Input label="LinkedIn URL" value={footerConfig?.socials?.linkedin} onChange={(e: any) => setFooterConfig({ ...footerConfig, socials: { ...(footerConfig.socials || {}), linkedin: e.target.value } })} />
                              <Input label="Facebook URL" value={footerConfig?.socials?.facebook} onChange={(e: any) => setFooterConfig({ ...footerConfig, socials: { ...(footerConfig.socials || {}), facebook: e.target.value } })} />
                           </div>
                        </SectionCard>

                        <div className="space-y-4">
                           <div className="flex justify-between items-center">
                              <Label>Office Locations</Label>
                              <button onClick={() => setFooterConfig({ ...footerConfig, addresses: [...(footerConfig.addresses || []), { title: "New Location", lines: ["Address Line 1"] }] })} className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"><Plus className="w-3 h-3" /> Add Location</button>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {footerConfig?.addresses?.map((addr: any, idx: number) => (
                                 <div key={idx} className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm relative group">
                                    <button onClick={() => { const n = footerConfig.addresses.filter((_: any, i: number) => i !== idx); setFooterConfig({ ...footerConfig, addresses: n }) }} className="absolute top-4 right-4 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                    <div className="mb-4">
                                       <Input label="Location Title" value={addr.title} onChange={(e: any) => { const n = [...(footerConfig.addresses || [])]; n[idx].title = e.target.value; setFooterConfig({ ...footerConfig, addresses: n }) }} />
                                    </div>
                                    <div className="space-y-2">
                                       {addr.lines.map((line: string, lIdx: number) => (
                                          <div key={lIdx} className="flex gap-2">
                                             <input className="w-full bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2 text-sm text-zinc-600 focus:outline-none focus:border-zinc-300 transition-colors" value={line} onChange={(e) => { const n = [...(footerConfig.addresses || [])]; n[idx].lines[lIdx] = e.target.value; setFooterConfig({ ...footerConfig, addresses: n }) }} />
                                             <button onClick={() => { const n = [...(footerConfig.addresses || [])]; n[idx].lines = n[idx].lines.filter((_: any, li: number) => li !== lIdx); setFooterConfig({ ...footerConfig, addresses: n }) }} className="text-zinc-300 hover:text-red-500"><X className="w-4 h-4" /></button>
                                          </div>
                                       ))}
                                       <button onClick={() => { const n = [...(footerConfig.addresses || [])]; n[idx].lines.push(""); setFooterConfig({ ...footerConfig, addresses: n }) }} className="text-xs text-zinc-400 hover:text-zinc-600 flex items-center gap-1 mt-2"><Plus className="w-3 h-3" /> Add Line</button>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  )}

                  {/* CAREERS */}
                  {activeTab === "careers" && (
                     <div className="space-y-8 max-w-5xl">
                        <SectionCard title="Header Content">
                           <div className="space-y-4">
                              <Input label="Main Title" value={careersConfig?.headline} onChange={(e: any) => setCareersConfig({ ...careersConfig, headline: e.target.value })} placeholder="Join the Collective." />
                              <TextArea label="Subheadline" value={careersConfig?.subheadline} onChange={(e: any) => setCareersConfig({ ...careersConfig, subheadline: e.target.value })} placeholder="We hire and train..." />
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <Input label="Button Text" value={careersConfig?.heroButtonText} onChange={(e: any) => setCareersConfig({ ...careersConfig, heroButtonText: e.target.value })} placeholder="Apply now" />
                                 <Input label="Button Link" icon={LinkIcon} value={careersConfig?.heroButtonLink} onChange={(e: any) => setCareersConfig({ ...careersConfig, heroButtonLink: e.target.value })} placeholder="/#apply" />
                              </div>
                           </div>
                        </SectionCard>

                        <SectionCard title="Hero Checklist">
                           <div className="space-y-3">
                              <Label>Checklist Items</Label>
                              {careersConfig?.checklist?.map((item: string, idx: number) => (
                                 <div key={idx} className="flex gap-2">
                                    <input className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm" value={item} onChange={(e) => { const n = [...(careersConfig.checklist || [])]; n[idx] = e.target.value; setCareersConfig({ ...careersConfig, checklist: n }) }} />
                                    <IconButton icon={Trash2} variant="danger" onClick={() => { const n = careersConfig.checklist.filter((_: any, i: number) => i !== idx); setCareersConfig({ ...careersConfig, checklist: n }) }} />
                                 </div>
                              ))}
                              <button onClick={() => setCareersConfig({ ...careersConfig, checklist: [...(careersConfig.checklist || []), "New Benefit"] })} className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-2"><Plus className="w-3 h-3" /> Add Item</button>
                           </div>
                        </SectionCard>

                        <SectionCard title="Benefits Grid">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {careersConfig?.benefits?.map((benefit: any, idx: number) => (
                                 <div key={idx} className="bg-white p-5 rounded-xl border border-zinc-100 shadow-sm relative group">
                                    <button onClick={() => { const n = careersConfig.benefits.filter((_: any, i: number) => i !== idx); setCareersConfig({ ...careersConfig, benefits: n }) }} className="absolute top-2 right-2 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><X className="w-4 h-4" /></button>
                                    <Input label="Benefit Title" value={benefit.title} onChange={(e: any) => { const n = [...(careersConfig.benefits || [])]; n[idx].title = e.target.value; setCareersConfig({ ...careersConfig, benefits: n }) }} className="mb-3" />
                                    <TextArea label="Description" value={benefit.description} onChange={(e: any) => { const n = [...(careersConfig.benefits || [])]; n[idx].description = e.target.value; setCareersConfig({ ...careersConfig, benefits: n }) }} className="min-h-[80px]" />
                                 </div>
                              ))}
                              <button onClick={() => setCareersConfig({ ...careersConfig, benefits: [...(careersConfig.benefits || []), { title: "New Benefit", description: "Description" }] })} className="border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center gap-2 text-zinc-400 hover:bg-zinc-50 min-h-[200px]">
                                 <Plus className="w-5 h-5" /> Add Benefit
                              </button>
                           </div>
                        </SectionCard>

                        <div className="space-y-4">
                           <Label>Application Process Steps</Label>
                           {careersConfig?.process?.map((step: any, idx: number) => (
                              <div key={idx} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex gap-4 items-start relative group">
                                 <button onClick={() => { const n = careersConfig.process.filter((_: any, i: number) => i !== idx); setCareersConfig({ ...careersConfig, process: n }) }} className="absolute top-4 right-4 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                 <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center text-lg font-bold text-zinc-400 shrink-0">{step.id}</div>
                                 <div className="flex-1 space-y-4">
                                    <Input label="Step Title" value={step.title} onChange={(e: any) => { const n = [...(careersConfig.process || [])]; n[idx].title = e.target.value; setCareersConfig({ ...careersConfig, process: n }) }} />
                                    <TextArea label="Description" value={step.desc} onChange={(e: any) => { const n = [...(careersConfig.process || [])]; n[idx].desc = e.target.value; setCareersConfig({ ...careersConfig, process: n }) }} />
                                 </div>
                              </div>
                           ))}
                           <button onClick={() => setCareersConfig({ ...careersConfig, process: [...(careersConfig.process || []), { id: "05", title: "New Step", desc: "Step description" }] })} className="w-full py-4 border-2 border-dashed border-zinc-200 rounded-2xl flex items-center justify-center gap-2 text-zinc-400 hover:bg-zinc-50 font-medium">
                              <Plus className="w-5 h-5" /> Add Process Step
                           </button>
                        </div>

                        <SectionCard title="Bottom CTA">
                           <div className="space-y-4">
                              <Input label="Headline" value={careersConfig?.cta?.headline} onChange={(e: any) => setCareersConfig({ ...careersConfig, cta: { ...(careersConfig.cta || {}), headline: e.target.value } })} />
                              <TextArea label="Subheadline" value={careersConfig?.cta?.subheadline} onChange={(e: any) => setCareersConfig({ ...careersConfig, cta: { ...(careersConfig.cta || {}), subheadline: e.target.value } })} />
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <Input label="Button Text" value={careersConfig?.cta?.buttonText} onChange={(e: any) => setCareersConfig({ ...careersConfig, cta: { ...(careersConfig.cta || {}), buttonText: e.target.value } })} />
                                 <Input label="Button Link" icon={LinkIcon} value={careersConfig?.cta?.buttonLink} onChange={(e: any) => setCareersConfig({ ...careersConfig, cta: { ...(careersConfig.cta || {}), buttonLink: e.target.value } })} />
                              </div>
                           </div>
                        </SectionCard>
                     </div>
                  )}

                  {/* TEAM */}
                  {activeTab === "team" && (
                     <div className="space-y-6 max-w-4xl">
                        <SectionCard title="Section Header">
                           <Input label="Headline" value={teamConfig?.headline} onChange={(e: any) => setTeamConfig({ ...teamConfig, headline: e.target.value })} placeholder="Meet the *Minds*" />
                           <div className="mt-4">
                              <TextArea label="Subheadline" value={teamConfig?.subheadline} onChange={(e: any) => setTeamConfig({ ...teamConfig, subheadline: e.target.value })} />
                           </div>
                        </SectionCard>

                        <div className="space-y-6">
                           <Label>Team Members</Label>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {teamConfig?.members?.map((member: any, idx: number) => (
                                 <div key={idx} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm relative group">
                                    <button onClick={() => { const n = teamConfig.members.filter((_: any, i: number) => i !== idx); setTeamConfig({ ...teamConfig, members: n }) }} className="absolute top-4 right-4 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>

                                    <div className="mb-6 flex justify-center">
                                       <div className="w-32">
                                          <ImageUploader label="Photo" value={member.image} onChange={(res: string) => { const n = [...(teamConfig.members || [])]; n[idx].image = res; setTeamConfig({ ...teamConfig, members: n }) }} className="h-32 rounded-full overflow-hidden" />
                                       </div>
                                    </div>

                                    <div className="space-y-4">
                                       <Input label="Name" value={member.name} onChange={(e: any) => { const n = [...(teamConfig.members || [])]; n[idx].name = e.target.value; setTeamConfig({ ...teamConfig, members: n }) }} />
                                       <Input label="Slug" value={member.slug || ""} onChange={(e: any) => { const n = [...(teamConfig.members || [])]; n[idx].slug = e.target.value; setTeamConfig({ ...teamConfig, members: n }) }} placeholder="e.g. john-doe" />
                                       <Input label="Role" value={member.role} onChange={(e: any) => { const n = [...(teamConfig.members || [])]; n[idx].role = e.target.value; setTeamConfig({ ...teamConfig, members: n }) }} />
                                       <TextArea label="Blurb" value={member.blurb} onChange={(e: any) => { const n = [...(teamConfig.members || [])]; n[idx].blurb = e.target.value; setTeamConfig({ ...teamConfig, members: n }) }} className="min-h-[80px]" />
                                       <TextArea label="Bio (Markdown)" value={member.bio || ""} onChange={(e: any) => { const n = [...(teamConfig.members || [])]; n[idx].bio = e.target.value; setTeamConfig({ ...teamConfig, members: n }) }} className="min-h-[120px] font-mono text-sm" placeholder="## Experience\n- ..." />

                                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                          <Input label="Rate Value" value={member.rateValue || ""} onChange={(e: any) => { const n = [...(teamConfig.members || [])]; n[idx].rateValue = e.target.value; setTeamConfig({ ...teamConfig, members: n }) }} placeholder="e.g. 75" />
                                          <Input label="Currency" value={member.rateCurrency || ""} onChange={(e: any) => { const n = [...(teamConfig.members || [])]; n[idx].rateCurrency = e.target.value; setTeamConfig({ ...teamConfig, members: n }) }} placeholder="$" />
                                          <Input label="Rate Type" value={member.rateType || ""} onChange={(e: any) => { const n = [...(teamConfig.members || [])]; n[idx].rateType = e.target.value; setTeamConfig({ ...teamConfig, members: n }) }} placeholder="hour or project" />
                                       </div>
                                       <Input label="Rate Note" value={member.rateNote || ""} onChange={(e: any) => { const n = [...(teamConfig.members || [])]; n[idx].rateNote = e.target.value; setTeamConfig({ ...teamConfig, members: n }) }} placeholder="e.g. Project packages available" />

                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <Input label="Hire Button Label" value={member.hireLabel || ""} onChange={(e: any) => { const n = [...(teamConfig.members || [])]; n[idx].hireLabel = e.target.value; setTeamConfig({ ...teamConfig, members: n }) }} placeholder="Hire" />
                                          <Input label="Hire Link" icon={LinkIcon} value={member.hireLink || ""} onChange={(e: any) => { const n = [...(teamConfig.members || [])]; n[idx].hireLink = e.target.value; setTeamConfig({ ...teamConfig, members: n }) }} placeholder="/#contact or https://calendly..." />
                                       </div>

                                       <SectionCard title="Tags" description="Used for filtering on /experts." className="!p-4">
                                          <div className="flex flex-wrap gap-2">
                                             {(member.tags || []).map((tag: string, tIdx: number) => (
                                                <Badge
                                                   key={tIdx}
                                                   onRemove={() => {
                                                      const n = [...(teamConfig.members || [])];
                                                      const tags = [...(n[idx].tags || [])];
                                                      tags.splice(tIdx, 1);
                                                      n[idx].tags = tags;
                                                      setTeamConfig({ ...teamConfig, members: n });
                                                   }}
                                                >
                                                   {tag}
                                                </Badge>
                                             ))}
                                             <button
                                                type="button"
                                                onClick={() => {
                                                   const tag = prompt("Enter tag:");
                                                   if (!tag) return;
                                                   const n = [...(teamConfig.members || [])];
                                                   n[idx].tags = [...(n[idx].tags || []), tag];
                                                   setTeamConfig({ ...teamConfig, members: n });
                                                }}
                                                className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-700 flex items-center gap-1"
                                             >
                                                <Plus className="w-3 h-3" /> Add
                                             </button>
                                          </div>
                                       </SectionCard>

                                       <SectionCard title="Portfolio Highlights" description="Shown on marketplace card and profile." className="!p-4">
                                          <div className="space-y-2">
                                             {(member.highlights || []).map((h: string, hIdx: number) => (
                                                <div key={hIdx} className="flex gap-2 items-center">
                                                   <input
                                                      value={h}
                                                      onChange={(e) => {
                                                         const n = [...(teamConfig.members || [])];
                                                         const highlights = [...(n[idx].highlights || [])];
                                                         highlights[hIdx] = e.target.value;
                                                         n[idx].highlights = highlights;
                                                         setTeamConfig({ ...teamConfig, members: n });
                                                      }}
                                                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm"
                                                      placeholder="Highlight"
                                                   />
                                                   <IconButton
                                                      icon={Trash2}
                                                      variant="danger"
                                                      onClick={() => {
                                                         const n = [...(teamConfig.members || [])];
                                                         const highlights = [...(n[idx].highlights || [])];
                                                         highlights.splice(hIdx, 1);
                                                         n[idx].highlights = highlights;
                                                         setTeamConfig({ ...teamConfig, members: n });
                                                      }}
                                                   />
                                                </div>
                                             ))}
                                             <button
                                                type="button"
                                                onClick={() => {
                                                   const n = [...(teamConfig.members || [])];
                                                   n[idx].highlights = [...(n[idx].highlights || []), "New highlight"];
                                                   setTeamConfig({ ...teamConfig, members: n });
                                                }}
                                                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-2"
                                             >
                                                <Plus className="w-3 h-3" /> Add Highlight
                                             </button>
                                          </div>
                                       </SectionCard>
                                    </div>
                                 </div>
                              ))}

                              <button onClick={() => setTeamConfig({ ...teamConfig, members: [...(teamConfig.members || []), { name: "New Member", slug: "", role: "Role", blurb: "Description", bio: "", tags: [], highlights: [], rateType: "hour", rateValue: "", rateCurrency: "$", rateNote: "", hireLabel: "Hire", hireLink: "/#contact", image: "" }] })} className="border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-zinc-400 hover:bg-zinc-50 hover:border-zinc-300 transition-all min-h-[300px]">
                                 <Plus className="w-6 h-6" /> <span className="font-medium">Add Team Member</span>
                              </button>
                           </div>
                        </div>
                     </div>
                  )}
               </motion.div>
            </div>
         </main>
      </div>
   );
}
