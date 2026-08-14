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

    import("locomotive-scroll").then(({ default: LocomotiveScroll }) => {
      try {
        scrollInstance = new LocomotiveScroll({
          lenisOptions: {
            lerp: 0.09,
            duration: 1.2,
            smoothWheel: true,
            syncTouch: false,
          },
          scrollCallback: () => {
            ScrollTrigger.update();
          },
        });

        locoRef.current = scrollInstance;

        if (scrollInstance?.lenisInstance) {
          scrollInstance.lenisInstance.on("scroll", () => {
            ScrollTrigger.update();
          });
        }

        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 150);
      } catch (err) {
        console.warn("Locomotive Scroll init:", err);
      }
    });

    return () => {
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
