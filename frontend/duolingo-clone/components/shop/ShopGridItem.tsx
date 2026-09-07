"use client";

import { ShopItem } from "@/data/shop";

/** One grid tile: frame wears a colored disc, outfit shows its emoji. */
export function ShopGridItem({ item }: { item: ShopItem }) {
  const owned = item.cost === 0;

  return (
    <div
      className={`border-2 rounded-2xl p-4 flex items-center gap-3 transition-all ${
        owned ? "border-[#84D8FF] bg-[#DDF4FF]" : "border-[#E5E5E5] bg-white hover:bg-gray-50"
      }`}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-2xl font-extrabold text-white shrink-0"
        style={item.kind === "frame" ? { backgroundColor: item.color } : undefined}
      >
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-extrabold text-sm text-[#4B4B4B]">{item.name}</div>
        <div className="text-xs font-bold text-[#777777]">{owned ? "Free" : `${item.cost} gems`}</div>
      </div>
      {owned ? (
        <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full whitespace-nowrap">
          Owned
        </span>
      ) : (
        <button className="text-xs font-bold text-[#1CB0F6] bg-white border-2 border-[#1CB0F6] px-3 py-1 rounded-full hover:bg-[#DDF4FF] active:translate-y-0.5">
          Buy
        </button>
      )}
    </div>
  );
}