'use client';

import Link from 'next/link';
import Image from 'next/image';

interface FooterProps {
  config?: any;
}

export const Footer = ({ config }: FooterProps) => {
  return (
    <footer className="relative w-full text-white overflow-hidden bg-gradient-to-br from-[#3B5BF7] via-[#3B5BF7] to-[#2D4AD9]">
      {/* Footer Background Image - World Map Pattern */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[300px] pointer-events-none"
        style={{
          backgroundImage: 'url(/world-map.png)',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%',
          opacity: 1,
          filter: 'invert(1) brightness(1.5)'
        }}
      />

      <div className="relative z-10 w-full px-6 md:px-12 pt-16 pb-8">
        <div className="max-w-[1320px] mx-auto">

          {/* Footer Top */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">

            {/* Brand & Contact Info */}
            <div className="space-y-6">
              <Link href="/" className="inline-block">
                <div className="relative w-32 h-10 mb-4">
                  <Image
                    src="/logo.png"
                    alt="Niche logo"
                    fill
                    className="object-contain object-left"
                  />
                </div>
              </Link>

              <div className="space-y-2">
                <div className="text-white/80 text-sm font-medium">Customer service:</div>
                <div className="text-white font-semibold text-base">
                  <Link
                    href={`https://wa.me/${(config?.contact?.phone || '995555317927').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    className="hover:opacity-80 transition-opacity"
                  >
                    {config?.contact?.phone || '+995555317927'}
                  </Link>
                </div>
              </div>

              <div>
                <div className="text-white/80 text-sm font-medium mb-3">Follow Us On</div>
                <div className="flex gap-2">
                  <Link
                    href={config?.socials?.instagram || 'https://www.instagram.com/nicheconsultation?igsh=dGU3ZjV5ZGJrYjdp&utm_source=qr'}
                    target="_blank"
                    className="w-9 h-9 rounded-md bg-white/30 hover:bg-white/50 transition-all flex items-center justify-center"
                  >
                    <Image
                      src="https://cdn.prod.website-files.com/66f8845b6f7911f99d856648/68651833093255776e4fa3a3_IG.svg"
                      alt="Instagram"
                      width={18}
                      height={18}
                    />
                  </Link>
                  <Link
                    href={config?.socials?.facebook || 'https://www.facebook.com/share/19vzYFD6yV/?mibextid=wwXIfr'}
                    target="_blank"
                    className="w-9 h-9 rounded-md bg-white/30 hover:bg-white/50 transition-all flex items-center justify-center"
                  >
                    <Image
                      src="https://cdn.prod.website-files.com/66f8845b6f7911f99d856648/686518334513574e2051ac62_Dribble.svg"
                      alt="Facebook"
                      width={18}
                      height={18}
                    />
                  </Link>
                  <Link
                    href={config?.socials?.tiktok || 'https://www.tiktok.com/@nicheconsultation?_r=1&_t=ZS-91FvrhAwfDE'}
                    target="_blank"
                    className="w-9 h-9 rounded-md bg-white/30 hover:bg-white/50 transition-all flex items-center justify-center"
                  >
                    <Image
                      src="https://cdn.prod.website-files.com/66f8845b6f7911f99d856648/686518339c8e9fe4343a4d39_Pinterest.svg"
                      alt="TikTok"
                      width={18}
                      height={18}
                    />
                  </Link>
                </div>
              </div>
            </div>

            {/* Address Wrapper */}
            <div className="space-y-6">
              <div className="text-white text-sm font-bold uppercase tracking-wide">Address</div>

              <address className="not-italic text-white/80 text-sm leading-relaxed space-y-1">
                <div className="font-bold text-white">Dubai,</div>
                <div>Dubai design district,</div>
                <div>Floor 3, Building 3,</div>
                <div>Dubai, UAE</div>
              </address>

              <div className="h-px bg-white/20 w-full"></div>

              <address className="not-italic text-white/80 text-sm leading-relaxed space-y-1">
                <div className="font-bold text-white">United Kingdom,</div>
                <div>6 Giles Building,</div>
                <div>Upper Hampstead Walk,</div>
                <div>London, United Kingdon</div>
              </address>

              <div className="h-px bg-white/20 w-full"></div>

              <address className="not-italic text-white/80 text-sm leading-relaxed space-y-1">
                <div className="font-bold text-white">Stepantsminda,</div>
                <div>street 31</div>
              </address>
            </div>

            {/* Explore Links */}
            <div>
              <div className="text-white text-sm font-bold uppercase tracking-wide mb-6">Explore</div>
              <nav className="flex flex-col space-y-3">
                <Link href="/#projects" className="text-white/80 hover:text-white transition-colors text-sm">
                  Case studies
                </Link>
                <Link href="/#About" className="text-white/80 hover:text-white transition-colors text-sm">
                  Why us
                </Link>
                <Link href="/#testimonial" className="text-white/80 hover:text-white transition-colors text-sm">
                  Testimonials
                </Link>
                <Link href="/#Process" className="text-white/80 hover:text-white transition-colors text-sm">
                  How it works
                </Link>
                <Link href="/blog" className="text-white/80 hover:text-white transition-colors text-sm">
                  Blog
                </Link>
                <Link href="/store" className="text-white/80 hover:text-white transition-colors text-sm">
                  Store
                </Link>
                <Link href="#pricing" className="text-white/80 hover:text-white transition-colors text-sm">
                  Pricing
                </Link>
                <Link href="/#Faq" className="text-white/80 hover:text-white transition-colors text-sm">
                  FAQ
                </Link>
              </nav>
            </div>

            {/* Legal Links */}
            <div>
              <div className="text-white text-sm font-bold uppercase tracking-wide mb-6">Legal</div>
              <nav className="flex flex-col space-y-3">
                <Link href="/terms-and-conditions" className="text-white/80 hover:text-white transition-colors text-sm">
                  Terms and Conditions
                </Link>
                <Link href="/legal-notice" className="text-white/80 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </nav>
            </div>

          </div>

          {/* Divider */}
          <div className="h-px bg-white/20 w-full my-8"></div>

          {/* Footer Bottom */}
          <div className="text-center">
            <div className="text-white/80 text-sm">
              © Niche 2025. All Rights Reserved.
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
