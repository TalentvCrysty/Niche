"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { Calendar, Clock, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function CalendlySection() {
  const calendlyContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initCalendly = () => {
      // @ts-ignore
      if (window.Calendly && calendlyContainerRef.current) {
        calendlyContainerRef.current.innerHTML = ''; // Clear previous instance if any
        // @ts-ignore
        window.Calendly.initInlineWidget({
          url: "https://calendly.com/sosikomegrelidze95/new-meeting?hide_event_type_details=1&hide_gdpr_banner=1&background_color=0a0a0a&text_color=ffffff&primary_color=3b82f6",
          parentElement: calendlyContainerRef.current,
        });
      }
    };

    // Attempt to initialize immediately if script is already loaded
    initCalendly();

    // If Script loads later, this interval/check ensures we catch it. 
    // However, Script onLoad is cleaner if we can rely on it, but useEffect is safer for re-mounts.
    const interval = setInterval(() => {
      // @ts-ignore
      if (window.Calendly && calendlyContainerRef.current && calendlyContainerRef.current.childElementCount === 0) {
        initCalendly();
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-24 md:py-32 bg-black relative overflow-hidden" id="contact">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-6">
            Schedule a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Free Consultation</span>
          </h2>
          <p className="text-lg md:text-xl text-neutral-400 leading-relaxed max-w-2xl mx-auto">
            Book a time that works for you. Let's discuss your objectives and map out a strategy for your business growth.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20 max-w-6xl mx-auto">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group p-8 rounded-3xl bg-neutral-900/40 border border-white/5 hover:border-blue-500/20 transition-all duration-300 backdrop-blur-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-medium text-white mb-3">Easy Scheduling</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Seamlessly sync with your calendar to find the perfect slot without the back-and-forth.
            </p>
          </motion.div>

          {/* Card 2 - Featured */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative p-8 rounded-3xl bg-gradient-to-b from-blue-900/20 to-neutral-900/40 border border-blue-500/30 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors duration-500" />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
                  <span className="text-xs font-medium text-blue-300">Popular</span>
                </div>
              </div>

              <h3 className="text-xl font-medium text-white mb-3">30-Min Discovery</h3>
              <p className="text-blue-100/70 text-sm leading-relaxed mb-6">
                A focused session to understand your needs and determine if we're the right fit for your goals.
              </p>

              <div className="flex items-center text-blue-400 text-sm font-medium">
                <span>Book now</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12">
              <Clock className="w-40 h-40" />
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group p-8 rounded-3xl bg-neutral-900/40 border border-white/5 hover:border-blue-500/20 transition-all duration-300 backdrop-blur-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-medium text-white mb-3">Expert Guidance</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Direct access to our specialists who can provide actionable insights for your business.
            </p>
          </motion.div>
        </div>

        {/* Calendly Widget Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-4xl mx-auto bg-neutral-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-900/10"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-50" />
          <div
            ref={calendlyContainerRef}
            className="w-full bg-neutral-900"
            style={{ minWidth: "320px", height: "700px" }}
          />
        </motion.div>
      </div>

      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
    </section>
  );
}
