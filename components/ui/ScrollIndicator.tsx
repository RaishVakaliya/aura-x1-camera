"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollIndicator() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const line = lineRef.current;
    if (!wrap || !line) return;

    const lineAnim = gsap.to(line, {
      scaleY: 0,
      transformOrigin: "top center",
      duration: 1.2,
      ease: "power2.in",
      repeat: -1,
      repeatDelay: 0.4,
    });

    const st = ScrollTrigger.create({
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        const p = self.progress;
        wrap.style.opacity = String(Math.max(0, 1 - p * 2.5));
        if (p > 0.4) {
          if (!lineAnim.paused()) lineAnim.pause();
        } else {
          if (lineAnim.paused()) lineAnim.play();
        }
      },
    });

    return () => {
      st.kill();
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
        transition: "opacity 0.2s ease-out",
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
