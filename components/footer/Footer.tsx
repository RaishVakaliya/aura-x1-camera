"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = ["Product", "Optics", "Engineering", "Technology"];

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(section.querySelectorAll(".gsap-item"), {
        opacity: 0,
        y: 14,
        duration: 0.7,
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={sectionRef}
      style={{
        background: "var(--bg-deep)",
        borderTop: "1px solid var(--divider)",
        padding: "clamp(40px, 5vw, 72px) var(--section-pad-h)",
      }}
    >
      <div className="editorial-container">
        <div className="footer-grid">
          <div>
            <div className="gsap-item" style={{ marginBottom: "10px" }}>
              <span
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--text-primary)",
                  fontWeight: 500,
                }}
              >
                AURA X1
              </span>
            </div>
            <p
              className="gsap-item"
              style={{
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-label)",
              }}
            >
              See Beyond the Frame.
            </p>
          </div>

          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "flex-end",
            }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="gsap-item"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--text-label)",
                  transition: "color 0.2s",
                  padding: "2px 0",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--text-secondary)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--text-label)")
                }
              >
                {link}
              </a>
            ))}

            <div
              className="gsap-item"
              style={{
                height: "1px",
                width: "24px",
                background: "var(--divider)",
                margin: "4px 0",
              }}
            />

            {["Contact", "Privacy"].map((link) => (
              <a
                key={link}
                href="#"
                className="gsap-item"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--text-label)",
                  transition: "color 0.2s",
                  padding: "2px 0",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--text-secondary)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--text-label)")
                }
              >
                {link}
              </a>
            ))}
          </nav>
        </div>

        <div
          style={{
            marginTop: "clamp(36px, 4vw, 56px)",
            paddingTop: "20px",
            borderTop: "1px solid var(--divider)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <span
            className="gsap-item"
            style={{
              fontSize: "9px",
              letterSpacing: "0.1em",
              color: "var(--text-muted)",
            }}
          >
            © 2026 AURA Precision Systems. All rights reserved.
          </span>
          <span
            className="gsap-item"
            style={{
              fontSize: "9px",
              letterSpacing: "0.1em",
              color: "var(--text-muted)",
            }}
          >
            X1 / Engineering Study
          </span>
        </div>
      </div>
    </footer>
  );
}
