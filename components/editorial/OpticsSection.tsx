"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function OpticsSection() {
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
              LIGHT IS THE
              <br />
              FIRST COMPONENT.
            </h2>

            <p className="body-text gsap-item" style={{ marginBottom: "20px" }}>
              Before an image reaches the sensor, light passes through a
              carefully controlled optical system. Every element of the AURA
              optical path is calculated to preserve detail from the moment of
              capture.
            </p>

            <p
              className="gsap-item"
              style={{
                fontSize: "10px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--text-label)",
                marginTop: "32px",
                paddingTop: "20px",
                borderTop: "1px solid var(--divider)",
              }}
            >
              AURA Precision Optics
            </p>
          </div>

          <div
            ref={imageRef}
            className="editorial-image-col"
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "2px",
            }}
          >
            <Image
              src="/editorial/optics.avif"
              alt="AURA X1 optical system cutaway"
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
