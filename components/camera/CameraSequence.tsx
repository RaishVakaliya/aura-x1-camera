"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 240;
const FRAME_PATH = (i: number) =>
  `/camera/frames/ezgif-frame-${String(i).padStart(3, "0")}.jpg`;

const MAX_DESKTOP_DECODED_FRAMES = 36;
const MAX_MOBILE_DECODED_FRAMES = 14;
const MAX_CONCURRENT_DECODES = 4;

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

  const decodedCacheRef = useRef<Map<number, ImageBitmap>>(new Map());
  const inFlightRef = useRef<Map<number, Promise<ImageBitmap>>>(new Map());
  const activeDecodeCountRef = useRef<number>(0);
  const queueRef = useRef<number[]>([]);

  const currentFrameRef = useRef<number>(0);
  const lastRenderedFrameRef = useRef<number>(-1);
  const lastRenderedTypeRef = useRef<"exact" | "fallback" | "none">("none");
  const lastProgressRef = useRef<number>(-1);
  const scrollDirectionRef = useRef<number>(1);
  const maxDecodedFramesRef = useRef<number>(MAX_DESKTOP_DECODED_FRAMES);

  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const copyWrapRef = useRef<HTMLDivElement>(null);

  const evictLRU = useCallback(() => {
    const cache = decodedCacheRef.current;
    const limit = maxDecodedFramesRef.current;

    while (cache.size > limit) {
      const lruKey = cache.keys().next().value;
      if (lruKey === undefined) break;

      if (lruKey === currentFrameRef.current && cache.size > 1) {
        const currentBm = cache.get(lruKey)!;
        cache.delete(lruKey);
        cache.set(lruKey, currentBm);
        continue;
      }

      const bitmap = cache.get(lruKey);
      if (bitmap) {
        bitmap.close();
      }
      cache.delete(lruKey);
    }
  }, []);

  const putInCache = useCallback(
    (index: number, bitmap: ImageBitmap) => {
      const cache = decodedCacheRef.current;
      if (cache.has(index)) {
        const old = cache.get(index);
        if (old && old !== bitmap) {
          old.close();
        }
        cache.delete(index);
      }
      cache.set(index, bitmap);
      evictLRU();
    },
    [evictLRU],
  );

  const drawImageToCanvas = useCallback(
    (img: ImageBitmap | HTMLImageElement) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2.0);
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;

      const bgColor = "#282e36";
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const srcW = img.width || 1280;
      const srcH = img.height || 720;
      const dstAR = W / H;

      let dw: number, dh: number, dx: number, dy: number;

      if (W < 768 || dstAR < 1.0) {
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

      if (W < 768 || dstAR < 1.0) {
        const topGrad = ctx.createLinearGradient(0, dy, 0, dy + dh * 0.24);
        topGrad.addColorStop(0, bgColor);
        topGrad.addColorStop(1, "rgba(40, 46, 54, 0)");
        ctx.fillStyle = topGrad;
        ctx.fillRect(dx - 1, dy - 1, dw + 2, dh * 0.24 + 1);

        const btmGrad = ctx.createLinearGradient(0, dy + dh * 0.76, 0, dy + dh);
        btmGrad.addColorStop(0, "rgba(40, 46, 54, 0)");
        btmGrad.addColorStop(1, bgColor);
        ctx.fillStyle = btmGrad;
        ctx.fillRect(dx - 1, dy + dh * 0.76, dw + 2, dh * 0.24 + 2);

        const leftGrad = ctx.createLinearGradient(dx, 0, dx + dw * 0.12, 0);
        leftGrad.addColorStop(0, bgColor);
        leftGrad.addColorStop(1, "rgba(40, 46, 54, 0)");
        ctx.fillStyle = leftGrad;
        ctx.fillRect(dx - 1, dy - 1, dw * 0.12 + 1, dh + 2);

        const rightGrad = ctx.createLinearGradient(
          dx + dw * 0.88,
          0,
          dx + dw,
          0,
        );
        rightGrad.addColorStop(0, "rgba(40, 46, 54, 0)");
        rightGrad.addColorStop(1, bgColor);
        ctx.fillStyle = rightGrad;
        ctx.fillRect(dx + dw * 0.88, dy - 1, dw * 0.12 + 2, dh + 2);
      }

      ctx.restore();
    },
    [],
  );

  const fetchAndDecodeFrame = useCallback(
    (index: number): Promise<ImageBitmap> => {
      const cache = decodedCacheRef.current;

      if (cache.has(index)) {
        const bm = cache.get(index)!;
        cache.delete(index);
        cache.set(index, bm);
        return Promise.resolve(bm);
      }

      const inFlight = inFlightRef.current;
      if (inFlight.has(index)) {
        return inFlight.get(index)!;
      }

      activeDecodeCountRef.current++;

      const url = FRAME_PATH(index + 1);
      const promise = fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
          return res.blob();
        })
        .then((blob) => createImageBitmap(blob))
        .then((bitmap) => {
          activeDecodeCountRef.current--;
          inFlight.delete(index);
          putInCache(index, bitmap);
          processQueue();
          return bitmap;
        })
        .catch((err) => {
          activeDecodeCountRef.current--;
          inFlight.delete(index);
          processQueue();
          throw err;
        });

      inFlight.set(index, promise);
      return promise;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [putInCache],
  );

  const processQueue = useCallback(() => {
    while (
      activeDecodeCountRef.current < MAX_CONCURRENT_DECODES &&
      queueRef.current.length > 0
    ) {
      const nextIdx = queueRef.current.shift();
      if (
        nextIdx !== undefined &&
        !decodedCacheRef.current.has(nextIdx) &&
        !inFlightRef.current.has(nextIdx)
      ) {
        fetchAndDecodeFrame(nextIdx).catch(() => {});
      }
    }
  }, [fetchAndDecodeFrame]);

  const requestPriorityFrames = useCallback(
    (centerIndex: number) => {
      const dir = scrollDirectionRef.current;
      const isMobile = window.innerWidth < 768;

      const p1: number[] = [];
      const p2: number[] = [];

      // PRIORITY 1: Immediate neighbors in scroll direction
      p1.push(centerIndex);
      for (let i = 1; i <= 2; i++) {
        const fwd = centerIndex + i * dir;
        const bwd = centerIndex - i * dir;
        if (fwd >= 0 && fwd < TOTAL_FRAMES) p1.push(fwd);
        if (bwd >= 0 && bwd < TOTAL_FRAMES) p1.push(bwd);
      }

      // PRIORITY 2: Directional window (forward-biased)
      const forwardCount = isMobile ? 6 : 12;
      const backwardCount = isMobile ? 2 : 4;

      for (let offset = 3; offset <= forwardCount; offset++) {
        const idx = centerIndex + offset * dir;
        if (idx >= 0 && idx < TOTAL_FRAMES) p2.push(idx);
      }
      for (let offset = 3; offset <= backwardCount; offset++) {
        const idx = centerIndex - offset * dir;
        if (idx >= 0 && idx < TOTAL_FRAMES) p2.push(idx);
      }

      const priorityIndices = [...p1, ...p2];

      // Filter to only frames not yet decoded or in-flight
      const needed = priorityIndices.filter(
        (idx) =>
          !decodedCacheRef.current.has(idx) && !inFlightRef.current.has(idx),
      );

      // Replace queue with newly prioritized items (preserving priority order)
      queueRef.current = Array.from(new Set(needed));
      processQueue();
    },
    [processQueue],
  );

  const renderFrame = useCallback(
    (targetIndex: number) => {
      const cache = decodedCacheRef.current;

      // 1. Direct Hit: Requested frame is ready in decoded cache
      if (cache.has(targetIndex)) {
        // Redraw only if this exact frame is not already drawn
        if (
          lastRenderedFrameRef.current !== targetIndex ||
          lastRenderedTypeRef.current !== "exact"
        ) {
          const bitmap = cache.get(targetIndex)!;
          cache.delete(targetIndex);
          cache.set(targetIndex, bitmap);

          drawImageToCanvas(bitmap);
          lastRenderedFrameRef.current = targetIndex;
          lastRenderedTypeRef.current = "exact";
        }
        requestPriorityFrames(targetIndex);
        return;
      }

      // 2. Decode requested frame immediately (high priority)
      fetchAndDecodeFrame(targetIndex)
        .then((bitmap) => {
          if (currentFrameRef.current === targetIndex) {
            drawImageToCanvas(bitmap);
            lastRenderedFrameRef.current = targetIndex;
            lastRenderedTypeRef.current = "exact";
          }
        })
        .catch(() => {});

      // 3. Nearest-Frame Fallback (Instant, Zero Blank Flashes)
      if (cache.size > 0) {
        let bestIndex = -1;
        let minDiff = Infinity;

        for (const cachedIndex of cache.keys()) {
          const diff = Math.abs(cachedIndex - targetIndex);
          if (diff < minDiff) {
            minDiff = diff;
            bestIndex = cachedIndex;
          }
        }

        if (bestIndex !== -1 && lastRenderedFrameRef.current !== bestIndex) {
          const fallbackBitmap = cache.get(bestIndex);
          if (fallbackBitmap) {
            drawImageToCanvas(fallbackBitmap);
            lastRenderedFrameRef.current = bestIndex;
            lastRenderedTypeRef.current = "fallback";
          }
        }
      }

      requestPriorityFrames(targetIndex);
    },
    [drawImageToCanvas, fetchAndDecodeFrame, requestPriorityFrames],
  );

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.0);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    maxDecodedFramesRef.current =
      width < 768 ? MAX_MOBILE_DECODED_FRAMES : MAX_DESKTOP_DECODED_FRAMES;
    evictLRU();

    // Reset render tracker to force redraw with updated dimensions/DPR
    lastRenderedFrameRef.current = -1;
    renderFrame(currentFrameRef.current);
  }, [evictLRU, renderFrame]);

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
    maxDecodedFramesRef.current =
      window.innerWidth < 768
        ? MAX_MOBILE_DECODED_FRAMES
        : MAX_DESKTOP_DECODED_FRAMES;

    resizeCanvas();

    // Priority 1: Load initial frame
    fetchAndDecodeFrame(0)
      .then((bitmap) => {
        if (currentFrameRef.current === 0) {
          drawImageToCanvas(bitmap);
          lastRenderedFrameRef.current = 0;
          lastRenderedTypeRef.current = "exact";
        }
      })
      .catch(() => {});

    // Priority 3: Low-priority idle keyframe prefetching across sequence
    const keyframeStep = window.innerWidth < 768 ? 20 : 12;
    const keyframes: number[] = [];
    for (let k = keyframeStep; k < TOTAL_FRAMES; k += keyframeStep) {
      keyframes.push(k);
    }

    let keyframeIdx = 0;
    const prefetchNextKeyframe = () => {
      if (keyframeIdx >= keyframes.length) return;
      const k = keyframes[keyframeIdx++];
      if (!decodedCacheRef.current.has(k) && !inFlightRef.current.has(k)) {
        fetchAndDecodeFrame(k).catch(() => {});
      }
      if (keyframeIdx < keyframes.length) {
        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
          (window as any).requestIdleCallback(prefetchNextKeyframe, {
            timeout: 800,
          });
        } else {
          setTimeout(prefetchNextKeyframe, 80);
        }
      }
    };

    const idleTimer = setTimeout(prefetchNextKeyframe, 150);

    const onResize = () => {
      resizeCanvas();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener("resize", onResize);
      decodedCacheRef.current.forEach((bitmap) => {
        try {
          bitmap.close();
        } catch {}
      });
      decodedCacheRef.current.clear();
      inFlightRef.current.clear();
      queueRef.current = [];
    };
  }, [drawImageToCanvas, fetchAndDecodeFrame, resizeCanvas]);

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

        scrollDirectionRef.current = self.direction || 1;

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
