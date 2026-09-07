"use client";

import lottie, { AnimationItem } from "lottie-web";
import { useEffect, useRef } from "react";

interface LottiePlayerProps {
  src: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

/** Minimal lottie-web wrapper: fetches a lottie JSON from /assets and plays it. */
export function LottiePlayer({ src, className, loop = true, autoplay = true }: LottiePlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let anim: AnimationItem | null = null;
    let cancelled = false;

    fetch(src)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !containerRef.current) return;
        anim = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop,
          autoplay,
          animationData: data,
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      anim?.destroy();
    };
  }, [src, loop, autoplay]);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
