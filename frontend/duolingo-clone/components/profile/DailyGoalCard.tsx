"use client";

interface DailyGoalCardProps {
  todayXp: number;
  goalXp: number;
}

/** Daily XP goal card: progress bar + remaining/complete message. */
export function DailyGoalCard({ todayXp, goalXp }: DailyGoalCardProps) {
  const goalPercent = Math.min(100, Math.round((todayXp / goalXp) * 100));

  return (
    <div className="border-2 border-[#E5E5E5] rounded-2xl p-6 flex flex-col gap-3 bg-gray-50">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-extrabold text-[#4B4B4B]">Daily XP Goal</h2>
        <span className="text-sm font-extrabold text-[#1CB0F6]">
          {todayXp} / {goalXp} XP
        </span>
      </div>
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#1CB0F6] transition-all duration-500 rounded-full"
          style={{ width: `${goalPercent}%` }}
        />
      </div>
      <p className="text-xs font-bold text-[#777777]">
        {goalPercent >= 100
          ? "🎉 Daily goal complete! Great job!"
          : `${goalXp - todayXp} XP left to hit your daily goal.`}
      </p>
    </div>
  );
}