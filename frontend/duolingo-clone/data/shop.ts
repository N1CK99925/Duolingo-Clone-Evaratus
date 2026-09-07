/** Static shop catalog; purchases are not wired up yet — items are display-only. */

export interface ShopItem {
  id: string;
  name: string;
  cost: number;
  kind: "frame" | "outfit";
  color?: string;
  icon: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  { id: "frame1", name: "Classic Frame", cost: 0, kind: "frame", color: "#1CB0F6", icon: "🟦" },
  { id: "frame2", name: "Gold Frame", cost: 100, kind: "frame", color: "#FFC800", icon: "🟨" },
  { id: "frame3", name: "Rose Frame", cost: 200, kind: "frame", color: "#CE82FF", icon: "🟪" },
  { id: "frame4", name: "Spiked Frame", cost: 350, kind: "frame", color: "#FF4B4B", icon: "🟥" },
  { id: "outfit1", name: "Default Look", cost: 0, kind: "outfit", icon: "😎" },
  { id: "outfit2", name: "Party Outfit", cost: 250, kind: "outfit", icon: "🎉" },
  { id: "outfit3", name: "Winter Gear", cost: 400, kind: "outfit", icon: "🧊" },
  { id: "outfit4", name: "Champion Robe", cost: 600, kind: "outfit", icon: "🏆" },
];

export const REPAIR_OPTIONS = [
  { id: "repair1", name: "Restore 1 Heart", cost: 10, hearts: 1 },
  { id: "repair2", name: "Restore 5 Hearts", cost: 45, hearts: 5 },
  { id: "repair3", name: "Full Restore", cost: 80, hearts: 5 },
];