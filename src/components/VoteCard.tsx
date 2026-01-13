"use client";

import { useState, useCallback } from "react";
import { useReadContract } from "wagmi";
import { encodeFunctionData, concat } from "viem";
import { CONTRACT_ADDRESS, CLASS_VOTE_ABI, BUILDER_CODE_HEX } from "@/app/constants";
import { HowToVote } from "@mui/icons-material";
import Image from "next/image";

import { 
  Transaction, 
  TransactionButton, 
  TransactionStatus, 
  TransactionStatusLabel, 
  TransactionStatusAction 
} from '@coinbase/onchainkit/transaction';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';

// Interface untuk Tipe Data
interface Candidate {
  name: string;
  photoUrl: string;
  voteCount: bigint;
}

export default function VoteCard({ isAdmin }: { isAdmin: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { data: candidates, refetch } = useReadContract({
    abi: CLASS_VOTE_ABI, 
    address: CONTRACT_ADDRESS as `0x${string}`, 
    functionName: "getCandidates",
  });

  const { data: pollTitle } = useReadContract({
    abi: CLASS_VOTE_ABI, 
    address: CONTRACT_ADDRESS as `0x${string}`, 
    functionName: "pollTitle",
  });

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  const buildVoteTransaction = useCallback(async () => {
    if (selectedIndex === null) return [];
    const baseData = encodeFunctionData({
        abi: CLASS_VOTE_ABI,
        functionName: "vote",
        args: [BigInt(selectedIndex)]
    });
    const finalData = concat([baseData, BUILDER_CODE_HEX as `0x${string}`]);
    return [{
        to: CONTRACT_ADDRESS as `0x${string}`,
        data: finalData,
        value: BigInt(0),
    }];
  }, [selectedIndex]);

  const handleStatus = (status: LifecycleStatus) => {
    if (status.statusName === 'success') {
        setTimeout(() => {
            setIsModalOpen(false);
            refetch();
        }, 2000);
    }
  };

  const castCandidates = candidates as Candidate[] | undefined;
  if (!castCandidates || castCandidates.length === 0) return null;
  const selectedCandidate = selectedIndex !== null ? castCandidates[selectedIndex] : null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-center text-blue-600 mb-6 uppercase tracking-tight">
        {pollTitle as string || "MEMUAT JUDUL..."}
      </h2>

      {castCandidates.map((c, i) => (
        <div key={i} className="bg-white dark:bg-zinc-900 p-4 rounded-[28px] border flex items-center gap-4 shadow-sm">
          <Image 
            src={c.photoUrl || "https://via.placeholder.com/150"} 
            width={80}
            height={80}
            className="w-20 h-20 rounded-2xl object-cover border" 
            alt={c.name} 
          />
          <div className="flex-1">
            <h3 className="font-black text-gray-800 dark:text-zinc-100 text-lg uppercase tracking-tight">{c.name}</h3>
            {isAdmin && (
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">
                {Number(c.voteCount)} Suara
              </p>
            )}
          </div>
          <button 
            onClick={() => openModal(i)} 
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs active:scale-95 transition-all"
          >
            PILIH
          </button>
        </div>
      ))}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[32px] p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HowToVote className="text-blue-600" fontSize="large" />
                </div>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Konfirmasi</h3>
                <p className="mt-2 text-sm text-zinc-500 font-medium">
                    Yakin memilih <span className="font-black text-blue-600 uppercase">&quot;{selectedCandidate?.name}&quot;</span>?
                </p>
            </div>
            <div className="flex flex-col gap-3">
                <Transaction chainId={84532} calls={buildVoteTransaction} onStatus={handleStatus}>
                    <TransactionButton className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 disabled:bg-zinc-400" text="YA, SAYA YAKIN" />
                    <TransactionStatus>
                        <TransactionStatusLabel className="text-xs font-bold text-center mt-2" />
                        <TransactionStatusAction className="text-xs text-blue-500 underline text-center block w-full" />
                    </TransactionStatus>
                </Transaction>
                <button onClick={() => setIsModalOpen(false)} className="w-full py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-2xl font-bold text-sm">BATAL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}