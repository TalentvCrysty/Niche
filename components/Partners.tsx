'use client';

import React from 'react';

interface PartnersProps {
  config?: any;
}

export const Partners = ({ config }: PartnersProps) => {
  const baseItems = [
    { type: 'image', value: '/brands/salesfocus.png', alt: 'Salesfocus', className: '' },
    { type: 'image', value: '/brands/arkle.svg', alt: 'Arkle', className: '' },
    { type: 'image', value: '/brands/y-combinator.svg', alt: 'Y Combinator', className: 'h-8' },
    { type: 'image', value: '/brands/apytel.svg', alt: 'Apytel', className: '' },
    { type: 'image', value: '/brands/frc.png', alt: 'Fil Rouge Capital', className: '' },
  ];

  // Create a long list for smooth infinite scrolling
  const items = [...baseItems, ...baseItems, ...baseItems, ...baseItems];

  return (
    <section className={`w-full ${config?.variant === 'hero' ? 'bg-transparent py-4 -mt-10 relative z-20' : 'py-12 bg-[#0a0a0a]'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {config?.variant !== 'hero' && (
          <p className="text-center text-xs font-semibold tracking-widest text-neutral-500 uppercase mb-12">
            {config?.title || "Trusted by forward-thinking companies"}
          </p>
        )}

        <div className="relative w-full overflow-hidden mask-fade-sides">
          <div className="flex w-max animate-scroll">
            {items.map((item, index) => (
              <div
                key={`${index}`}
                className="mx-3 flex items-center justify-center"
              >
                <div className="bg-white rounded-xl px-6 py-3 h-16 min-w-[150px] flex items-center justify-center transition-transform hover:-translate-y-1">
                  <img
                    src={item.value}
                    alt={item.alt}
                    className={`h-6 md:h-7 w-auto object-contain ${item.className || ''}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .mask-fade-sides {
            mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
      `}</style>
    </section>
  );
};
