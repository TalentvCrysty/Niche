'use client';

import React from 'react';

const technologies = [
    { name: 'Tailwind CSS', icon: 'https://cdn.simpleicons.org/tailwindcss/06B6D4', slug: 'tailwindcss' },
    { name: 'Next.js', icon: 'https://cdn.simpleicons.org/nextdotjs/000000', slug: 'nextdotjs' },
    { name: 'Figma', icon: 'https://cdn.simpleicons.org/figma/F24E1E', slug: 'figma' },
    { name: 'Framer', icon: 'https://cdn.simpleicons.org/framer/0055FF', slug: 'framer' },
    { name: 'React', icon: 'https://cdn.simpleicons.org/react/61DAFB', slug: 'react' },
    { name: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript/3178C6', slug: 'typescript' },
    { name: 'Python', icon: 'https://cdn.simpleicons.org/python/3776AB', slug: 'python' },
    { name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql/4169E1', slug: 'postgresql' },
    { name: 'MongoDB', icon: 'https://cdn.simpleicons.org/mongodb/47A248', slug: 'mongodb' },
    { name: 'AWS', icon: 'https://cdn.simpleicons.org/amazonaws/232F3E', slug: 'amazonaws' }, // using amazonaws
    { name: 'Docker', icon: 'https://cdn.simpleicons.org/docker/2496ED', slug: 'docker' },
    { name: 'GraphQL', icon: 'https://cdn.simpleicons.org/graphql/E10098', slug: 'graphql' },
];

export const Technologies = () => {
    // Create a long list for smooth infinite scrolling
    const items = [...technologies, ...technologies, ...technologies];

    return (
        <section className="w-full py-20 bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <p className="text-center text-xs font-semibold tracking-widest text-neutral-500 uppercase mb-12">
                    Technologies & Platforms We Master
                </p>

                <div className="relative w-full overflow-hidden mask-fade-sides">
                    <div className="flex w-max animate-scroll">
                        {items.map((tech, index) => (
                            <div
                                key={`${tech.slug}-${index}`}
                                className="mx-4"
                            >
                                <div className="bg-neutral-100 rounded-full px-6 py-3 flex items-center gap-3 min-w-[160px] justify-center transition-transform hover:-translate-y-1">
                                    <img
                                        src={tech.icon}
                                        alt={tech.name}
                                        className="w-5 h-5 object-contain"
                                    />
                                    <span className="text-sm font-semibold text-neutral-900 whitespace-nowrap">
                                        {tech.name}
                                    </span>
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
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%); /* Move by 1/3 of the total width since we tripled the list */
          }
        }
      `}</style>
        </section>
    );
};
