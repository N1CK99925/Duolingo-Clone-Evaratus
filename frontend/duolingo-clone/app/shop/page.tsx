"use client";

import { useEffect, useState } from "react";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightRail } from "@/components/RightRail";
import { HeartRepairSection } from "@/components/shop/HeartRepairSection";
import { ShopGridItem } from "@/components/shop/ShopGridItem";
import { SuperCard } from "@/components/shop/SuperCard";
import { SHOP_ITEMS } from "@/data/shop";
import { api, UserSummary } from "@/lib/api";

export default function ShopPage() {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.me().then(setUser).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-dvh bg-white justify-center">
      <LeftSidebar />

      <main className="flex-1 max-w-2xl px-6 py-10 flex flex-col gap-8">
        <div className="flex flex-col items-center text-center mb-2">
          <img src="/assets/shop.svg" alt="Shop" className="w-20 h-20 mb-4" />
          <h1 className="text-3xl font-extrabold text-[#4B4B4B]">Shop</h1>
          <p className="text-[#777777] font-bold text-sm mt-1">
            Spend your gems on rewards
          </p>
        </div>

        {loading ? (
          <div className="text-center font-bold text-gray-400 py-8">Loading shop…</div>
        ) : (
          <>
            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-extrabold text-[#4B4B4B]">Avatar Frames</h2>
              <div className="grid grid-cols-2 gap-3">
                {SHOP_ITEMS.filter((i) => i.kind === "frame").map((item) => (
                  <ShopGridItem key={item.id} item={item} />
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-extrabold text-[#4B4B4B]">Outfits</h2>
              <div className="grid grid-cols-2 gap-3">
                {SHOP_ITEMS.filter((i) => i.kind === "outfit").map((item) => (
                  <ShopGridItem key={item.id} item={item} />
                ))}
              </div>
            </section>

            <HeartRepairSection />
            <SuperCard />
          </>
        )}
      </main>

      <RightRail user={user} />
    </div>
  );
}