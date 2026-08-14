"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SPECS = [
  { label: "SYSTEM", value: "AURA X1 Precision Camera" },
  { label: "FORM", value: "Professional Mirrorless Architecture" },
  { label: "OPTICS", value: "AURA 50mm 1:1.4 Multi-Coated" },
  { label: "APERTURE", value: "f/1.4 – f/22 (9-blade circular)" },
  { label: "BODY", value: "Single-piece magnesium alloy chassis" },
  { label: "VIEWFINDER", value: "0.5-inch 5.76M-dot OLED EVF" },
  { label: "DISPLAY", value: "3.2-inch 2.36M-dot tilting LCD" },
  { label: "MOUNT", value: "AURA precision bayonet mount" },
  { label: "SEALING", value: "All-weather dust & moisture resistance" },
];

export default function Specifications() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const rows = rowsRef.current;
    if (!section || !rows) return;

    const ctx = gsap.context(() => {
      gsap.from(rows.querySelectorAll(".specs-row"), {
        opacity: 0,
        x: -10,
        duration: 0.5,
        stagger: 0.05,
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
        background: "var(--bg-spec)",
      }}
    >
      <div className="specs-container">
        <div style={{ marginBottom: "clamp(36px, 5vw, 56px)" }}>
          <h2
            style={{
              fontSize: "clamp(22px, 3.2vw, 36px)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
            }}
          >
            TECHNICAL OVERVIEW
          </h2>
        </div>

        <div ref={rowsRef}>
          {SPECS.map((spec, i) => (
            <div key={spec.label}>
              {i === 0 && <div className="divider" />}
              <div className="specs-row">
                <span
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--text-label)",
                    fontWeight: 500,
                  }}
                >
                  {spec.label}
                </span>
                <span
                  style={{
                    fontSize: "14.5px",
                    color: "var(--text-secondary)",
                    fontWeight: 300,
                    letterSpacing: "0.01em",
                  }}
                >
                  {spec.value}
                </span>
              </div>
              <div className="divider" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
