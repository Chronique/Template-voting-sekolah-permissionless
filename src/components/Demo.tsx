"use client";

import React, { useState } from "react";
import { useAccount, useReadContract } from "wagmi";
// Pastikan path import ini sesuai (gunakan @/ atau ~/)
import { CONTRACT_ADDRESS, CLASS_VOTE_ABI } from "@/app/constants";
import { TopBar } from "@/components/top-bar";
import { BottomNavigation } from "@/components/bottom-navigation";

// Import Komponen Halaman
import VoteCard from "@/components/VoteCard";
import CreatePoll from "@/components/CreatePoll";
import WhitelistManager from "@/components/WhitelistManager";
import AdminSettings from "@/components/AdminSettings";
import VoteResults from "@/components/VoteResults";
import Verification from "@/components/Verification";

export default function Demo() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<string>("vote");

  // 1. Cek Status Poll
  const { data: pollCreated, refetch: refetchStatus } = useReadContract({
    abi: CLASS_VOTE_ABI,
    address: CONTRACT_ADDRESS as `0x${string}`,
    functionName: "pollCreated",
  });

  // 2. Cek Admin
  const { data: userIsAdmin } = useReadContract({
    abi: CLASS_VOTE_ABI,
    address: CONTRACT_ADDRESS as `0x${string}`,
    functionName: "isAdmin",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  });

  const isAdmin = !!userIsAdmin;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24">
      
      {/* HEADER */}
      <div className="px-4 sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-40 border-b border-zinc-100 dark:border-zinc-800">
        <TopBar />
      </div>

      {/* KONTEN UTAMA */}
      <div className="px-4 mt-6 max-w-lg mx-auto">
        
        {/* LOGIKA TAB */}
        {activeTab === "vote" && (
            pollCreated ? (
                <VoteCard isAdmin={isAdmin} /> 
            ) : (
                <div className="text-center p-12 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-300 text-gray-400 mt-10">
                    <p className="font-bold">Belum ada pemilihan aktif.</p>
                </div>
            )
        )}
        
        {activeTab === "create" && isAdmin && <CreatePoll onSuccess={refetchStatus} />}
        
        {activeTab === "admin" && isAdmin && <WhitelistManager />}

        {activeTab === "results" && isAdmin && <VoteResults />}

        {activeTab === "settings" && isAdmin && <AdminSettings />}

        {activeTab === "verify" && isAdmin && <Verification />}

        {activeTab === "wallet" && (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border shadow-sm">
            <h3 className="font-bold mb-4 text-xl">Profil Kamu</h3>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-mono break-all">
                    {address || "Belum terhubung"}
                </p>
            </div>
            </div>
        )}

      </div>

      {/* NAVIGASI BAWAH */}
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isAdmin={isAdmin}
        pollCreated={!!pollCreated}
      />

    </div>
  );
}