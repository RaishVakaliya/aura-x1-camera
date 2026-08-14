"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FinalProduct() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    if (!section || !text) return;

    const ctx = gsap.context(() => {
      gsap.from(text.querySelectorAll(".gsap-item"), {
        opacity: 0,
        y: 24,
        duration: 0.9,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      });

      const link = linkRef.current;
      if (link) {
        link.addEventListener("mouseenter", () =>
          gsap.to(link, {
            opacity: 0.6,
            x: 4,
            duration: 0.25,
            ease: "power2.out",
          }),
        );
        link.addEventListener("mouseleave", () =>
          gsap.to(link, {
            opacity: 1,
            x: 0,
            duration: 0.3,
            ease: "power2.out",
          }),
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section"
      style={{
        background: `radial-gradient(
          ellipse 140% 90% at 50% 50%,
          #2b3038 0%,
          #222830 45%,
          #191e23 100%
        )`,
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="editorial-container" style={{ width: "100%" }}>
        <div ref={textRef} style={{ maxWidth: "1100px" }}>
          <h2
            className="gsap-item"
            style={{
              fontSize: "clamp(36px, 7.5vw, 110px)",
              fontWeight: 300,
              letterSpacing: "-0.04em",
              lineHeight: 0.92,
              color: "var(--text-primary)",
              marginBottom: "clamp(24px, 4vw, 36px)",
            }}
          >
            SEE BEYOND
            <br />
            THE FRAME.
          </h2>

          <p
            className="body-text gsap-item"
            style={{
              marginBottom: "clamp(36px, 5vw, 56px)",
              maxWidth: "46ch",
            }}
          >
            Designed around the moment before the shutter. Every surface exists
            to bring the photographer closer to the image.
          </p>

          <a
            ref={linkRef}
            href="#hero"
            className="gsap-item"
            style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--accent)",
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            Explore AURA X1
            <span style={{ fontSize: "14px", fontWeight: 300 }}>↑</span>
          </a>

          <div
            className="gsap-item"
            style={{
              marginTop: "clamp(48px, 6vw, 72px)",
              height: "1px",
              background: "var(--divider)",
              width: "100%",
            }}
          />
        </div>
      </div>
    </section>
  );
}
