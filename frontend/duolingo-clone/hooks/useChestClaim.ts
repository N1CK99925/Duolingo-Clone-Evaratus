"use client";

import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { api, PathResponse } from "@/lib/api";

/** Claim path chests and surface a one-time gem toast (Duolingo-style). */
export function useChestClaim(setPath: Dispatch<SetStateAction<PathResponse | null>>) {
  const [chestFeedback, setChestFeedback] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const claimChest = useCallback(
    async (unitId: number) => {
      try {
        const res = await api.claimChest(unitId);
        setPath(
          (p) =>
            p && {
              ...p,
              units: p.units.map((u) =>
                u.id === unitId ? { ...u, chest: { ...u.chest, claimed: true } } : u,
              ),
            },
        );
        setChestFeedback(`+${res.reward} 💎`);
      } catch {
        setChestFeedback("Couldn't open the chest");
      }
    },
    [setPath],
  );

  /* Auto-hide the feedback toast. */
  useEffect(() => {
    if (!chestFeedback) return;
    timer.current = setTimeout(() => setChestFeedback(null), 2500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [chestFeedback]);

  return { chestFeedback, claimChest };
}