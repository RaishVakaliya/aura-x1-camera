'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function SensorSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const text = textRef.current;
    if (!section || !image || !text) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        image,
        { y: '2%' },
        {
          y: '-2%',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );

      gsap.from(text.querySelectorAll('.gsap-item'), {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section"
      style={{
        background: 'var(--bg-deep)',
      }}
    >
      <div className="editorial-container">
        <div className="editorial-grid editorial-grid--reverse">
          <div
            ref={imageRef}
            className="editorial-image-col"
            style={{
              overflow: 'hidden',
              borderRadius: '2px',
            }}
          >
            <Image
              src="/editorial/lens.png"
              alt="AURA X1 optical lens close-up"
              width={1024}
              height={1024}
              quality={90}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                filter: 'brightness(0.92)',
              }}
              loading="lazy"
            />
          </div>

          <div ref={textRef} className="editorial-text-col">
            <h2
              className="section-heading gsap-item"
              style={{ marginBottom: '24px' }}
            >
              WHERE LIGHT
              <br />
              BECOMES DATA.
            </h2>

            <p className="body-text gsap-item" style={{ marginBottom: '16px' }}>
              The sensor is where the image begins. Light enters, passes through
              the optical system, and arrives at a plane designed to translate
              photons into precise information.
            </p>

            <p className="body-text gsap-item">
              The AURA X1 sensor is tuned for tonal fidelity — holding highlight
              detail and preserving deep shadow structure simultaneously without
              artificial sharpening.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
