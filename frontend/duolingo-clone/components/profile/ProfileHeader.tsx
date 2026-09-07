"use client";

interface ProfileHeaderProps {
  username: string | undefined;
  joinedDate: string | undefined;
}

/** Profile card header: circular avatar + username and join date. */
export function ProfileHeader({ username, joinedDate }: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-6 border-b-2 border-[#E5E5E5] pb-8">
      <div className="w-24 h-24 rounded-full bg-sky-400 border-4 border-sky-200 flex items-center justify-center text-4xl font-extrabold text-white uppercase shadow-sm">
        {username?.charAt(0) ?? "D"}
      </div>
      <div className="flex flex-col">
        <h1 className="text-3xl font-extrabold text-[#4B4B4B]">
          {username ?? "Learner"}
        </h1>
        <p className="text-sm font-bold text-[#777777] mt-1">
          Joined {joinedDate ?? "September 2026"}
        </p>
      </div>
    </div>
  );
}