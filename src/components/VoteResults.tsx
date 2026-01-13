"use client";

import { useEffect } from "react";
import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CLASS_VOTE_ABI } from "@/app/constants";
import { EmojiEvents } from "@mui/icons-material";
import confetti from "canvas-confetti";

interface Candidate {
  name: string;
  photoUrl: string;
  voteCount: bigint;
}

const getProgressColor = (percentage: number) => {
  if (percentage < 30) return "bg-red-500"; 
  if (percentage < 70) return "bg-yellow-400";
  return "bg-green-500";
};

export default function ResultsPage() {
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const { data: pollTitle } = useReadContract({
    abi: CLASS_VOTE_ABI,
    address: CONTRACT_ADDRESS as `0x${string}`,
    functionName: "pollTitle",
  });

  const { data: candidates } = useReadContract({
    abi: CLASS_VOTE_ABI,
    address: CONTRACT_ADDRESS as `0x${string}`,
    functionName: "getCandidates",
  });

  const castCandidates = candidates as Candidate[] | undefined;

  if (!castCandidates || castCandidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-gray-400">
        <p className="font-bold uppercase text-xs tracking-widest">Belum Ada Pemilihan Aktif</p>
      </div>
    );
  }

  const totalVotes = castCandidates.reduce((acc, curr) => acc + Number(curr.voteCount), 0);
  const maxVotes = Math.max(...castCandidates.map(c => Number(c.voteCount)));

  return (
    <div className="pb-24 p-6 animate-in fade-in duration-700">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-black text-blue-900 dark:text-blue-400 uppercase tracking-tighter leading-none">
          {pollTitle as string || "HASIL PEMILIHAN"}
        </h2>
        <div className="mt-2 inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
            Total: {totalVotes} Suara Masuk
          </p>
        </div>
      </div>

      <div className="flex flex-row justify-around items-end h-80 px-4 py-8 bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-sm relative">
        {castCandidates.map((c, i) => {
          const voteCount = Number(c.voteCount);
          const percentage = totalVotes === 0 ? 0 : Math.round((voteCount / totalVotes) * 100);
          const colorClass = getProgressColor(percentage);
          const isWinner = voteCount === maxVotes && voteCount > 0;

          return (
            <div key={i} className="flex flex-col items-center justify-end h-full w-20 gap-4 group relative">
              {isWinner && (
                <div className="absolute -top-8 animate-bounce">
                  <EmojiEvents className="text-yellow-500" fontSize="medium" />
                </div>
              )}
              <span className={`text-[11px] font-black ${isWinner ? 'text-yellow-600' : 'text-zinc-400'}`}>{percentage}%</span>
              <div className="relative w-10 h-full bg-zinc-50 dark:bg-zinc-800/50 rounded-full overflow-hidden border">
                <div className={`absolute bottom-0 w-full transition-all duration-1000 ${colorClass}`} style={{ height: `${percentage}%` }} />
              </div>
              <h3 className="font-black text-[10px] uppercase truncate w-20 text-center">{c.name}</h3>
              <p className="text-[9px] font-bold text-zinc-400">{voteCount} VOTE</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}