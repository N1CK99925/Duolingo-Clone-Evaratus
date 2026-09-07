"use client";

import { LeftSidebar } from "@/components/LeftSidebar";
import { RightRail } from "@/components/RightRail";
import { api, UserSummary } from "@/lib/api";
import { useEffect, useState } from "react";

const AVATAR_FRAMES = [
  { id: "frame1", name: "Classic Frame", cost: 0, color: "#1CB0F6", icon: "🟦" },
  { id: "frame2", name: "Gold Frame", cost: 100, color: "#FFC800", icon: "🟨" },
  { id: "frame3", name: "Rose Frame", cost: 200, color: "#CE82FF", icon: "🟪" },
  { id: "frame4", name: "Spiked Frame", cost: 350, color: "#FF4B4B", icon: "🟥" },
];

const OUTFITS = [
  { id: "outfit1", name: "Default Look", cost: 0, emoji: "😎" },
  { id: "outfit2", name: "Party Outfit", cost: 250, emoji: "🎉" },
  { id: "outfit3", name: "Winter Gear", cost: 400, emoji: "🧊" },
  { id: "outfit4", name: "Champion Robe", cost: 600, emoji: "🏆" },
];

const REPAIR_OPTIONS = [
  { id: "repair1", name: "Restore 1 Heart", cost: 10, hearts: 1 },
  { id: "repair2", name: "Restore 5 Hearts", cost: 45, hearts: 5 },
  { id: "repair3", name: "Full Restore", cost: 80, hearts: 5 },
];

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
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-2">
          <img
            src="/assets/shop.svg"
            alt="Shop"
            className="w-20 h-20 mb-4"
          />
          <h1 className="text-3xl font-extrabold text-[#4B4B4B]">
            Shop
          </h1>
          <p className="text-[#777777] font-bold text-sm mt-1">
            Spend your gems on rewards
          </p>
        </div>

        {loading ? (
          <div className="text-center font-bold text-gray-400 py-8">Loading shop…</div>
        ) : (
          <>
            {/* Avatar Frames */}
            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-extrabold text-[#4B4B4B]">Avatar Frames</h2>
              <div className="grid grid-cols-2 gap-3">
                {AVATAR_FRAMES.map((item) => (
                  <div
                    key={item.id}
                    className={`border-2 rounded-2xl p-4 flex items-center gap-3 transition-all ${item.cost === 0 ? "border-[#84D8FF] bg-[#DDF4FF]" : "border-[#E5E5E5] bg-white hover:bg-gray-50"}`}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-2xl font-extrabold text-white" style={{ backgroundColor: item.color }}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-sm text-[#4B4B4B]">{item.name}</div>
                      <div className="text-xs font-bold text-[#777777]">{item.cost === 0 ? "Free" : `${item.cost} gems`}</div>
                    </div>
                    {item.cost === 0 ? (
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Owned</span>
                    ) : (
                      <button className="text-xs font-bold text-[#1CB0F6] bg-white border-2 border-[#1CB0F6] px-3 py-1 rounded-full hover:bg-[#DDF4FF] active:translate-y-0.5">
                        Buy
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Outfits */}
            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-extrabold text-[#4B4B4B]">Outfits</h2>
              <div className="grid grid-cols-2 gap-3">
                {OUTFITS.map((item) => (
                  <div
                    key={item.id}
                    className={`border-2 rounded-2xl p-4 flex items-center gap-3 transition-all ${item.cost === 0 ? "border-[#84D8FF] bg-[#DDF4FF]" : "border-[#E5E5E5] bg-white hover:bg-gray-50"}`}
                  >
                    <div className="text-3xl">{item.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-sm text-[#4B4B4B]">{item.name}</div>
                      <div className="text-xs font-bold text-[#777777]">{item.cost === 0 ? "Free" : `${item.cost} gems`}</div>
                    </div>
                    {item.cost === 0 ? (
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Owned</span>
                    ) : (
                      <button className="text-xs font-bold text-[#1CB0F6] bg-white border-2 border-[#1CB0F6] px-3 py-1 rounded-full hover:bg-[#DDF4FF] active:translate-y-0.5">
                        Buy
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Heart Repair */}
            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-extrabold text-[#4B4B4B]">Heart Repair</h2>
              <div className="flex flex-col gap-3">
                {REPAIR_OPTIONS.map((item) => (
                  <div
                    key={item.id}
                    className="border-2 border-[#E5E5E5] rounded-2xl p-4 flex items-center justify-between gap-4 bg-white hover:bg-gray-50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img src="/assets/icons/heart.svg" alt="Heart" className="h-7 w-7 text-[#FF4B4B]" />
                      <div>
                        <div className="font-extrabold text-sm text-[#4B4B4B]">{item.name}</div>
                        <div className="text-xs font-bold text-[#777777]">+{item.hearts} heart{item.hearts > 1 ? "s" : ""}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <img src="/assets/icons/GEM_ICON.svg" alt="Gem" className="h-5 w-5" />
                      <span className="font-extrabold text-sm text-[#4B4B4B]">{item.cost}</span>
                      <button className="text-xs font-bold text-[#1CB0F6] bg-white border-2 border-[#1CB0F6] px-3 py-1 rounded-full hover:bg-[#DDF4FF] active:translate-y-0.5 ml-2">
                        Buy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Super Subscription (Coming Soon) */}
            <section className="border-2 border-dashed border-[#E5E5E5] rounded-2xl p-6 text-center">
              <div className="text-4xl mb-2">🌟</div>
              <h2 className="text-xl font-extrabold text-[#4B4B4B] mb-1">Super Duolingo</h2>
              <p className="text-sm font-bold text-[#777777]">
                No ads, unlimited hearts, and progress tracking
              </p>
              <div className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#1CB0F6] bg-[#DDF4FF] px-3 py-1 rounded-full">
                Coming soon
              </div>
            </section>
          </>
        )}
      </main>

      <RightRail user={user} />
    </div>
  );
}
