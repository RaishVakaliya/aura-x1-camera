"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  "Machined top plate",
  "Mechanical control dials",
  '0.5" EVF viewfinder',
  "Tactile textured grip",
];

export default function BodySection() {
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
        { y: "2%" },
        {
          y: "-2%",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      gsap.from(text.querySelectorAll(".gsap-item"), {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
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
        background: "var(--bg-section)",
      }}
    >
      <div className="editorial-container">
        <div className="editorial-grid">
          <div ref={textRef} className="editorial-text-col">
            <h2
              className="section-heading gsap-item"
              style={{ marginBottom: "24px" }}
            >
              FORM FOLLOWS
              <br />
              CONTROL.
            </h2>

            <p className="body-text gsap-item" style={{ marginBottom: "16px" }}>
              Control starts with the hand. The grip profile is contoured around
              a held camera in live action, not an abstract geometric study.
            </p>

            <p className="body-text gsap-item">
              The top plate is single-piece machined aluminum. The dials are
              physical knurled metal. Each control is positioned to be located
              by touch without looking away from the viewfinder.
            </p>

            <div
              className="gsap-item"
              style={{
                marginTop: "36px",
                paddingTop: "20px",
                borderTop: "1px solid var(--divider)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "14px 24px",
              }}
            >
              {FEATURES.map((feat) => (
                <span
                  key={feat}
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--text-label)",
                    fontWeight: 500,
                  }}
                >
                  {feat}
                </span>
              ))}
            </div>
          </div>

          <div
            ref={imageRef}
            className="editorial-image-col"
            style={{
              overflow: "hidden",
              borderRadius: "2px",
            }}
          >
            <Image
              src="/editorial/body.png"
              alt="AURA X1 camera body"
              width={1024}
              height={1024}
              quality={90}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
