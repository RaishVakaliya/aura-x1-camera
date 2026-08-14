"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 240;
const FRAME_PATH = (i: number) =>
  `/camera/frames/ezgif-frame-${String(i).padStart(3, "0")}.jpg`;

const COPY_MOMENTS = [
  {
    progress: 0.0,
    headline: "THE ART\nOF SEEING.",
    sub: "A precision camera system built around light, control and detail.",
  },
  {
    progress: 0.2,
    headline: "PRECISION\nREVEALED.",
    sub: "Every component placed with mechanical intention.",
  },
  {
    progress: 0.5,
    headline: "EVERY PART\nHAS PURPOSE.",
    sub: "Light. Mechanics. Control. Nothing is purely decorative.",
  },
  {
    progress: 0.75,
    headline: "COMPLEXITY,\nREFINED.",
    sub: "Machined magnesium housing engineered to disappear in the hand.",
  },
  {
    progress: 0.92,
    headline: "SEE BEYOND\nTHE FRAME.",
    sub: "Designed around the moment before the shutter opens.",
  },
];

export default function CameraSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const loadedFlagsRef = useRef<boolean[]>([]);
  const currentFrameRef = useRef<number>(0);
  const lastProgressRef = useRef<number>(-1);

  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const copyWrapRef = useRef<HTMLDivElement>(null);

  const drawImageToCanvas = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;

    const bgColor = "#282e36";
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const srcW = img.naturalWidth || 1280;
    const srcH = img.naturalHeight || 720;
    const srcAR = srcW / srcH;
    const dstAR = W / H;

    let dw: number, dh: number, dx: number, dy: number;

    if (W < 768 || dstAR < 1.0) {
      // Numerical value to adjust mobile frame zoom (lower = more frame content visible, higher = closer zoom)
      const MOBILE_FRAME_SCALE = 1.45;
      const scale = (W / srcW) * MOBILE_FRAME_SCALE;
      dw = srcW * scale;
      dh = srcH * scale;
      dx = (W - dw) / 2;
      dy = (H - dh) / 2 - H * 0.04;
    } else {
      const scale = Math.max(W / srcW, H / srcH);
      dw = srcW * scale;
      dh = srcH * scale;
      dx = (W - dw) / 2;
      dy = (H - dh) / 2;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      img,
      Math.round(dx),
      Math.round(dy),
      Math.round(dw),
      Math.round(dh),
    );

    // Seamless gradient edge blending for mobile and desktop
    if (W < 768 || dstAR < 1.0) {
      // Top blend
      const topGrad = ctx.createLinearGradient(0, dy, 0, dy + dh * 0.24);
      topGrad.addColorStop(0, bgColor);
      topGrad.addColorStop(1, "rgba(40, 46, 54, 0)");
      ctx.fillStyle = topGrad;
      ctx.fillRect(dx - 1, dy - 1, dw + 2, dh * 0.24 + 1);

      // Bottom blend
      const btmGrad = ctx.createLinearGradient(0, dy + dh * 0.76, 0, dy + dh);
      btmGrad.addColorStop(0, "rgba(40, 46, 54, 0)");
      btmGrad.addColorStop(1, bgColor);
      ctx.fillStyle = btmGrad;
      ctx.fillRect(dx - 1, dy + dh * 0.76, dw + 2, dh * 0.24 + 2);

      // Left blend
      const leftGrad = ctx.createLinearGradient(dx, 0, dx + dw * 0.12, 0);
      leftGrad.addColorStop(0, bgColor);
      leftGrad.addColorStop(1, "rgba(40, 46, 54, 0)");
      ctx.fillStyle = leftGrad;
      ctx.fillRect(dx - 1, dy - 1, dw * 0.12 + 1, dh + 2);

      // Right blend
      const rightGrad = ctx.createLinearGradient(dx + dw * 0.88, 0, dx + dw, 0);
      rightGrad.addColorStop(0, "rgba(40, 46, 54, 0)");
      rightGrad.addColorStop(1, bgColor);
      ctx.fillStyle = rightGrad;
      ctx.fillRect(dx + dw * 0.88, dy - 1, dw * 0.12 + 2, dh + 2);
    }

    ctx.restore();
  }, []);

  const renderFrame = useCallback(
    (index: number) => {
      const images = imagesRef.current;
      const loaded = loadedFlagsRef.current;

      let frameToDraw: HTMLImageElement | null = null;

      if (images[index] && loaded[index]) {
        frameToDraw = images[index];
      } else {
        for (let step = 1; step < TOTAL_FRAMES; step++) {
          const prev = index - step;
          if (prev >= 0 && images[prev] && loaded[prev]) {
            frameToDraw = images[prev];
            break;
          }
          const next = index + step;
          if (next < TOTAL_FRAMES && images[next] && loaded[next]) {
            frameToDraw = images[next];
            break;
          }
        }
      }

      if (frameToDraw && frameToDraw.complete && frameToDraw.naturalWidth > 0) {
        drawImageToCanvas(frameToDraw);
      }
    },
    [drawImageToCanvas],
  );

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    renderFrame(currentFrameRef.current);
  }, [renderFrame]);

  const updateCopy = useCallback((progress: number) => {
    let active = COPY_MOMENTS[0];
    for (const m of COPY_MOMENTS) {
      if (progress >= m.progress) active = m;
    }

    const headline = headlineRef.current;
    const sub = subRef.current;
    if (!headline || !sub) return;

    if (headline.dataset.text === active.headline) return;

    gsap.to(copyWrapRef.current, {
      opacity: 0,
      y: -6,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        headline.innerText = active.headline;
        headline.dataset.text = active.headline;
        sub.innerText = active.sub;
        gsap.fromTo(
          copyWrapRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        );
      },
    });
  }, []);

  useEffect(() => {
    const images: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(
      null,
    );
    const loaded: boolean[] = new Array(TOTAL_FRAMES).fill(false);

    imagesRef.current = images;
    loadedFlagsRef.current = loaded;

    resizeCanvas();

    const firstImg = new Image();
    firstImg.onload = () => {
      images[0] = firstImg;
      loaded[0] = true;
      if (currentFrameRef.current === 0) {
        renderFrame(0);
      }
    };
    firstImg.src = FRAME_PATH(1);
    images[0] = firstImg;

    for (let k = 6; k < TOTAL_FRAMES; k += 6) {
      const keyImg = new Image();
      const frameIdx = k;
      keyImg.onload = () => {
        images[frameIdx] = keyImg;
        loaded[frameIdx] = true;
        if (currentFrameRef.current === frameIdx) {
          renderFrame(frameIdx);
        }
      };
      keyImg.src = FRAME_PATH(frameIdx + 1);
      images[frameIdx] = keyImg;
    }

    let currentBatch = 1;
    const batchSize = 20;

    const loadNextBatch = () => {
      const end = Math.min(currentBatch + batchSize, TOTAL_FRAMES);
      for (let i = currentBatch; i < end; i++) {
        if (!images[i]) {
          const img = new Image();
          const idx = i;
          img.onload = () => {
            images[idx] = img;
            loaded[idx] = true;
            if (currentFrameRef.current === idx) {
              renderFrame(idx);
            }
          };
          img.src = FRAME_PATH(idx + 1);
          images[idx] = img;
        }
      }
      currentBatch = end;
      if (currentBatch < TOTAL_FRAMES) {
        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
          (window as any).requestIdleCallback(loadNextBatch, { timeout: 800 });
        } else {
          setTimeout(loadNextBatch, 35);
        }
      }
    };

    const initialTimer = setTimeout(loadNextBatch, 60);

    const onResize = () => {
      resizeCanvas();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      clearTimeout(initialTimer);
      window.removeEventListener("resize", onResize);
    };
  }, [renderFrame, resizeCanvas]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (headlineRef.current) {
      headlineRef.current.innerText = COPY_MOMENTS[0].headline;
      headlineRef.current.dataset.text = COPY_MOMENTS[0].headline;
    }
    if (subRef.current) {
      subRef.current.innerText = COPY_MOMENTS[0].sub;
    }

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=200%",
      pin: true,
      pinSpacing: true,
      scrub: 0.3,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;
        const targetFrame = Math.min(
          TOTAL_FRAMES - 1,
          Math.max(0, Math.floor(p * (TOTAL_FRAMES - 1))),
        );

        if (targetFrame !== currentFrameRef.current) {
          currentFrameRef.current = targetFrame;
          renderFrame(targetFrame);
        }

        if (Math.abs(p - lastProgressRef.current) > 0.005) {
          lastProgressRef.current = p;
          updateCopy(p);
        }
      },
    });

    gsap.fromTo(
      copyWrapRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.9, delay: 0.2, ease: "power2.out" },
    );

    return () => {
      st.kill();
    };
  }, [renderFrame, updateCopy]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: `
          radial-gradient(
            ellipse 140% 90% at 50% 44%,
            #2c323a 0%,
            #262c33 45%,
            #20252b 75%,
            #191e23 100%
          )
        `,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "90px",
          background:
            "linear-gradient(to bottom, #191e23 0%, transparent 100%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "120px",
          background:
            "linear-gradient(to top, #1f242a 0%, rgba(31, 36, 42, 0.5) 50%, transparent 100%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "block",
          zIndex: 1,
        }}
      />

      <div
        ref={copyWrapRef}
        style={{
          position: "absolute",
          bottom: "clamp(28px, 5vw, 56px)",
          left: "clamp(20px, 4vw, 48px)",
          zIndex: 10,
          maxWidth: "min(420px, 85vw)",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <h1
          ref={headlineRef}
          className="hero-heading"
          style={{
            marginBottom: "12px",
            whiteSpace: "pre-line",
          }}
          data-text=""
        />
        <p
          ref={subRef}
          className="body-text"
          style={{
            fontSize: "clamp(12px, 1.3vw, 14px)",
          }}
        />
      </div>
    </section>
  );
}
