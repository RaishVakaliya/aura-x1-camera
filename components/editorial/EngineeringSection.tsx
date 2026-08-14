'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '@/components/ui/SectionLabel';

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  {
    number: '01',
    title: 'OPTICS',
    desc: 'Controlled light from lens to sensor. Every optical element calculated, coated and aligned for maximum chromatic neutrality.',
  },
  {
    number: '02',
    title: 'SENSOR',
    desc: 'The exact point where photons convert to information. Tuned for wide dynamic range and organic color gradation.',
  },
  {
    number: '03',
    title: 'PROCESSING',
    desc: 'Designed around preserving what the glass captures. No aggressive algorithmic noise crushing. No synthetic sharpening.',
  },
  {
    number: '04',
    title: 'STRUCTURE',
    desc: 'A rigid magnesium chassis built around physical tactile control. The grip, shutter, and dials disappear into muscle memory.',
  },
];

export default function EngineeringSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    if (!section || !list) return;

    const ctx = gsap.context(() => {
      const rows = list.querySelectorAll<HTMLDivElement>('.eng-row');

      gsap.from(rows, {
        opacity: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
        },
      });

      rows.forEach((row) => {
        const enter = () => {
          rows.forEach((r) => {
            if (r !== row) gsap.to(r, { opacity: 0.4, duration: 0.25 });
          });
        };
        const leave = () => {
          rows.forEach((r) => gsap.to(r, { opacity: 1, duration: 0.3 }));
        };

        row.addEventListener('mouseenter', enter);
        row.addEventListener('mouseleave', leave);
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section"
      style={{
        background: 'var(--bg-light)',
      }}
    >
      <div className="editorial-container">
        <SectionLabel index="03" name="Engineering" />

        <h2
          className="section-heading"
          style={{ marginBottom: 'clamp(40px, 6vw, 64px)' }}
        >
          FOUR
          <br />
          SYSTEMS.
        </h2>

        <div ref={listRef}>
          {ITEMS.map((item, i) => (
            <div key={item.number} className="eng-row">
              {i === 0 && <div className="divider" />}
              <div className="engineering-grid">
                <span
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.12em',
                    color: 'var(--text-label)',
                    paddingTop: '4px',
                    fontWeight: 500,
                  }}
                >
                  {item.number}
                </span>
                <span
                  style={{
                    fontSize: 'clamp(18px, 2.2vw, 26px)',
                    fontWeight: 300,
                    letterSpacing: '-0.01em',
                    color: 'var(--text-primary)',
                  }}
                >
                  {item.title}
                </span>
                <p
                  className="eng-desc"
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    fontWeight: 300,
                  }}
                >
                  {item.desc}
                </p>
              </div>
              <div className="divider" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
