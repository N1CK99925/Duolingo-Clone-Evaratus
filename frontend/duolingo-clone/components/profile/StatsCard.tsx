"use client";

interface StatsCardProps {
  icon: string;
  alt: string;
  value: string | number;
  label: string;
}

/** One statistic tile: icon on the left, value + label on the right. */
export function StatsCard({ icon, alt, value, label }: StatsCardProps) {
  return (
    <div className="border-2 border-[#E5E5E5] rounded-2xl p-4 flex items-center gap-4">
      <img src={icon} alt={alt} className="w-8 h-8" />
      <div className="flex flex-col">
        <span className="text-2xl font-extrabold text-[#4B4B4B]">{value}</span>
        <span className="text-xs font-bold text-[#777777]">{label}</span>
      </div>
    </div>
  );
}