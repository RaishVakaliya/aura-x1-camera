"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function ScrollIndicator() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lineAnim = gsap.to(lineRef.current, {
      scaleY: 0,
      transformOrigin: "top center",
      duration: 1.2,
      ease: "power2.in",
      repeat: -1,
      repeatDelay: 0.4,
    });

    const onScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const progress = scrollY / (window.innerHeight * 0.5);

      gsap.to(wrapRef.current, {
        opacity: Math.max(0, 1 - progress),
        duration: 0.2,
        overwrite: true,
      });

      if (progress > 0.6) {
        lineAnim.pause();
      } else {
        lineAnim.play();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      lineAnim.kill();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="hide-on-mobile"
      style={{
        position: "fixed",
        bottom: "32px",
        right: "40px",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontSize: "9px",
          fontWeight: 500,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--text-label)",
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
        }}
      >
        Scroll to explore
      </span>
      <div
        style={{
          width: "1px",
          height: "36px",
          background: "var(--divider-strong)",
          overflow: "hidden",
        }}
      >
        <div
          ref={lineRef}
          style={{
            width: "100%",
            height: "100%",
            background: "var(--text-secondary)",
            transformOrigin: "top center",
          }}
        />
      </div>
    </div>
  );
}
