"use client";

import { useEffect } from "react"; 
import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CLASS_VOTE_ABI } from "~/app/constants";
import { CheckCircle, RadioButtonUnchecked, VerifiedUser, PeopleAlt } from "@mui/icons-material";

/**
 * Komponen untuk mengecek status pilih tiap murid
 */
function VoterStatus({ address, pollId }: { address: string; pollId: bigint }) {
  const { data: hasVoted } = useReadContract({
    abi: CLASS_VOTE_ABI,
    address: CONTRACT_ADDRESS as `0x${string}`,
    functionName: "hasVotedInPoll",
    args: [pollId, address as `0x${string}`], 
  });

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-2xl border mb-2 shadow-sm transition-all hover:border-blue-200">
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Alamat Murid</span>
        <span className="text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200">
          {`${address.slice(0, 10)}...${address.slice(-8)}`}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {hasVoted ? (
          <div className="flex items-center gap-1.5 text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-tight">Sudah Memilih</span>
            <CheckCircle className="text-sm" />
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-zinc-300 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-tight text-zinc-400">Belum Memilih</span>
            <RadioButtonUnchecked className="text-sm" />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Komponen Utama Tab Verifikasi
 */
export default function Verification() {
  // 1. Ambil data Whitelist (Murid)
  const { data: whitelistData, refetch: refetchList } = useReadContract({
    abi: CLASS_VOTE_ABI,
    address: CONTRACT_ADDRESS as `0x${string}`,
    functionName: "getFullWhitelist",
  });

  // 2. Ambil data Admin
  const { data: adminData, refetch: refetchAdmins } = useReadContract({
    abi: CLASS_VOTE_ABI,
    address: CONTRACT_ADDRESS as `0x${string}`,
    functionName: "getFullAdmins", 
  });

  // 3. Ambil ID Pemilihan Aktif
  const { data: currentPollId, refetch: refetchId } = useReadContract({
    abi: CLASS_VOTE_ABI,
    address: CONTRACT_ADDRESS as `0x${string}`,
    functionName: "pollId",
  });

  useEffect(() => {
    if (refetchList) refetchList();
    if (refetchId) refetchId();
    if (refetchAdmins) refetchAdmins();
  }, [refetchList, refetchId, refetchAdmins]);

  // FIX: Casting tipe data yang benar agar tidak error TS
  const whitelist = (whitelistData as unknown as string[]) || [];
  const admins = (adminData as unknown as string[]) || [];
  const activePollId = typeof currentPollId === 'bigint' ? currentPollId : BigInt(0);

  return (
    <div className="p-6 pb-24 max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* SEKSI DAFTAR ADMIN (ATAS) */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <VerifiedUser className="text-blue-600" fontSize="small" />
          <h2 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
            Daftar Wallet Admin
          </h2>
        </div>
        
        {admins.length === 0 ? (
          <p className="text-[10px] text-zinc-400 font-bold uppercase p-4 bg-zinc-50 rounded-2xl border border-dashed text-center">
            Belum ada admin tambahan
          </p>
        ) : (
          <div className="space-y-2">
            {admins.map((adminAddr, i) => (
              <div key={i} className="p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-mono text-blue-700 dark:text-blue-300">
                  {`${adminAddr.slice(0, 12)}...${adminAddr.slice(-10)}`}
                </span>
                <span className="text-[8px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase">Admin</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="mb-10 border-zinc-100 dark:border-zinc-800" />

      {/* SEKSI VERIFIKASI MURID (BAWAH) */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <PeopleAlt className="text-teal-600" fontSize="small" />
          <h2 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
            Verifikasi Murid (Voter)
          </h2>
        </div>

        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">
          ID Pemilihan: #{activePollId.toString()}
        </p>

        {whitelist.length === 0 ? (
          <div className="text-center p-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-[32px] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
              Daftar Murid Kosong
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {whitelist.map((addr, i) => (
              <VoterStatus 
                key={i} 
                address={addr} 
                pollId={activePollId} 
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center text-[9px] font-black text-zinc-300 uppercase tracking-[0.3em]">
        Data Transparan Blockchain Base
      </div>
    </div>
  );
}