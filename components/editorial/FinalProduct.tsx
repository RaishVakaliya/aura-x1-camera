"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function FinalProduct() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const image = imageRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      if (image) {
        gsap.fromTo(
          image,
          { y: "3%", scale: 0.98 },
          {
            y: "-2%",
            scale: 1.0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      gsap.from(content.querySelectorAll(".gsap-item"), {
        opacity: 0,
        y: 24,
        duration: 0.85,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
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
          #2c323a 0%,
          #222830 45%,
          #191e23 100%
        )`,
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        padding: "clamp(80px, 10vw, 140px) 0",
      }}
    >
      <div
        ref={contentRef}
        className="editorial-container"
        style={{ width: "100%" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            alignItems: "center",
            gap: "clamp(40px, 6vw, 84px)",
          }}
        >
          <div>
            <h2
              className="gsap-item"
              style={{
                fontSize: "clamp(36px, 6.5vw, 88px)",
                fontWeight: 300,
                letterSpacing: "-0.04em",
                lineHeight: 0.94,
                color: "var(--text-primary)",
                marginBottom: "clamp(20px, 3vw, 28px)",
              }}
            >
              SEE BEYOND
              <br />
              THE FRAME.
            </h2>

            <p
              className="body-text gsap-item"
              style={{
                marginBottom: "clamp(28px, 4vw, 40px)",
                maxWidth: "42ch",
              }}
            >
              Designed around the moment before the shutter opens. Every
              surface, dial, and optical element exists to bring the
              photographer closer to the image.
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
                padding: "8px 0",
              }}
            >
              Explore AURA X1
              <span style={{ fontSize: "14px", fontWeight: 300 }}>↑</span>
            </a>
          </div>

          <div
            ref={imageRef}
            className="gsap-item"
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "2px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
            }}
          >
            <Image
              src="/editorial/final_showcase.avif"
              alt="AURA X1 Studio Showcase"
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

        <div
          className="gsap-item"
          style={{
            marginTop: "clamp(48px, 6vw, 80px)",
            height: "1px",
            background: "var(--divider)",
            width: "100%",
          }}
        />
      </div>
    </section>
  );
}
