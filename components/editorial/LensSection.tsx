"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function LensSection() {
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
        { scale: 1.05, y: "3%" },
        {
          scale: 1.0,
          y: "-3%",
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
        y: 24,
        duration: 0.85,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        background: "var(--bg-deep)",
        overflow: "hidden",
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        ref={imageRef}
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
        }}
      >
        <Image
          src="/editorial/lens.png"
          alt="AURA 50mm f/1.4 prime lens"
          fill
          quality={95}
          style={{
            objectFit: "cover",
            objectPosition: "center",
            filter: "brightness(0.38)",
          }}
          loading="lazy"
        />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(105deg, rgba(25,30,35,0.94) 0%, rgba(25,30,35,0.65) 50%, rgba(25,30,35,0.2) 100%)",
          zIndex: 1,
        }}
      />

      <div
        ref={textRef}
        style={{
          position: "relative",
          zIndex: 2,
          padding: "var(--section-pad-v) var(--section-pad-h)",
          maxWidth: "680px",
          width: "100%",
        }}
      >
        <span
          className="label gsap-item"
          style={{
            color: "var(--text-label)",
            display: "block",
            marginBottom: "clamp(24px, 4vw, 40px)",
          }}
        >
          04 / Lens Architecture
        </span>

        <div
          className="gsap-item"
          style={{
            fontSize: "clamp(48px, 10vw, 120px)",
            fontWeight: 300,
            letterSpacing: "-0.04em",
            lineHeight: 0.9,
            color: "var(--text-primary)",
            marginBottom: "12px",
          }}
        >
          50MM
        </div>

        <div
          className="gsap-item"
          style={{
            fontSize: "clamp(28px, 5.5vw, 64px)",
            fontWeight: 300,
            letterSpacing: "-0.03em",
            lineHeight: 1.0,
            color: "var(--accent)",
            marginBottom: "clamp(32px, 5vw, 48px)",
          }}
        >
          1:1.4
        </div>

        <h2
          className="gsap-item"
          style={{
            fontSize: "clamp(24px, 4.5vw, 48px)",
            fontWeight: 300,
            letterSpacing: "-0.03em",
            lineHeight: 1.0,
            color: "var(--text-primary)",
            marginBottom: "20px",
          }}
        >
          THE FRAME
          <br />
          STARTS HERE.
        </h2>

        <p className="body-text gsap-item">
          Light enters through eleven elements arranged in nine optical groups.
          Before the shutter, before the sensor — the image begins at the front
          element.
        </p>
      </div>
    </section>
  );
}
