"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface LocoContextValue {
  locoInstance: any;
}

const LocoContext = createContext<LocoContextValue>({
  locoInstance: null,
});

export function useLocomotiveScroll() {
  return useContext(LocoContext);
}

export function LocomotiveProvider({ children }: { children: ReactNode }) {
  const locoRef = useRef<any>(null);

  useEffect(() => {
    let scrollInstance: any = null;
    let tickerCallback: ((time: number) => void) | null = null;

    import("locomotive-scroll").then(({ default: LocomotiveScroll }) => {
      try {
        scrollInstance = new LocomotiveScroll({
          lenisOptions: {
            lerp: 0.09,
            duration: 1.2,
            smoothWheel: true,
            syncTouch: false,
            autoRaf: false,
          },
        });

        locoRef.current = scrollInstance;

        const lenis = scrollInstance?.lenisInstance;
        if (lenis) {
          lenis.on("scroll", ScrollTrigger.update);

          tickerCallback = (time: number) => {
            lenis.raf(time * 1000);
          };
          gsap.ticker.add(tickerCallback);
          gsap.ticker.lagSmoothing(0);
        } else {
          // Fallback if lenisInstance is not exposed with autoRaf
          ScrollTrigger.update();
        }

        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      } catch (err) {
        console.warn("Locomotive Scroll init:", err);
      }
    });

    return () => {
      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback);
      }
      if (scrollInstance) {
        try {
          scrollInstance.destroy();
        } catch {
          // ignore
        }
        locoRef.current = null;
      }
    };
  }, []);

  return (
    <LocoContext.Provider value={{ locoInstance: locoRef.current }}>
      <div className="smooth-wrapper">{children}</div>
    </LocoContext.Provider>
  );
}
