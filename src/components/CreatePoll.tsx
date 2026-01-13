"use client";

import { useState } from "react";
import { useSendCalls } from "wagmi";
import { encodeFunctionData, concat } from "viem"; // Tambahkan concat
import { CONTRACT_ADDRESS, CLASS_VOTE_ABI, BUILDER_CODE_HEX } from "~/app/constants";
import { Add, DeleteOutline, AddPhotoAlternate } from "@mui/icons-material";

export default function CreatePoll({ onSuccess }: { onSuccess?: () => void }) {
  const [candidateList, setCandidateList] = useState([
    { name: "", photo: "" }, 
    { name: "", photo: "" }
  ]);
  const { sendCalls, isPending } = useSendCalls();

  const handleCreate = async () => {
    const paymasterUrl = process.env.NEXT_PUBLIC_PAYMASTER_URL;
    if (!paymasterUrl) return alert("Paymaster URL tidak ditemukan!");

    const names = candidateList.map(c => c.name).filter(n => n !== "");
    const photos = candidateList.map(c => c.photo || "https://via.placeholder.com/150");
    
    if (names.length < 2) return alert("Minimal 2 nama kandidat harus diisi!");

    try {
      // Encode data asli
      const baseData = encodeFunctionData({
        abi: CLASS_VOTE_ABI,
        functionName: "createPoll",
        args: [names, photos],
      });

      // Gabungkan dengan Builder Code menggunakan concat
      const finalData = concat([baseData, BUILDER_CODE_HEX as `0x${string}`]);

      sendCalls({
        calls: [{
          to: CONTRACT_ADDRESS as `0x${string}`,
          data: finalData,
        }],
        capabilities: { paymasterService: { url: paymasterUrl } }
      });
      alert("Pemilihan sedang diproses secara Gasless!");
      if (onSuccess) onSuccess();
    } catch (e) { 
      console.error(e);
      alert("Gagal memublikasikan pemilihan."); 
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-[28px] border shadow-sm">
      <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Setup Kandidat</h2>
      
      <div className="space-y-4">
        {candidateList.map((c, i) => (
          <div key={i} className="p-5 bg-zinc-50 rounded-[24px] border border-zinc-100 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Kandidat {i + 1}</span>
              {candidateList.length > 2 && (
                <button onClick={() => setCandidateList(candidateList.filter((_, idx) => idx !== i))}>
                  <DeleteOutline className="text-red-400" fontSize="small" />
                </button>
              )}
            </div>

            <input 
              placeholder="Nama Lengkap" 
              className="w-full bg-transparent border-b border-zinc-200 py-2 text-sm outline-none focus:border-blue-500 transition-colors"
              value={c.name} 
              onChange={(e) => {
                const newList = [...candidateList]; newList[i].name = e.target.value; setCandidateList(newList);
              }}
            />

            <div className="flex items-center gap-2">
              <AddPhotoAlternate className="text-zinc-400" fontSize="small" />
              <input 
                placeholder="URL Foto (https://...)" 
                className="w-full bg-transparent py-1 text-[11px] text-zinc-500 outline-none"
                value={c.photo} 
                onChange={(e) => {
                  const newList = [...candidateList]; newList[i].photo = e.target.value; setCandidateList(newList);
                }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {candidateList.length < 5 && (
        <button 
          onClick={() => setCandidateList([...candidateList, { name: "", photo: "" }])} 
          className="w-full py-3 border-2 border-dashed border-zinc-200 rounded-2xl flex items-center justify-center gap-2 text-zinc-400 hover:text-blue-500 transition-colors active:scale-95"
        >
          <Add fontSize="small" /> <span className="text-xs font-bold">Tambah Kandidat</span>
        </button>
      )}

      <button 
        onClick={handleCreate} 
        disabled={isPending} 
        className="w-full py-4 bg-zinc-900 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all disabled:opacity-50"
      >
        {isPending ? "MEMPROSES..." : "MULAI PEMILIHAN (GRATIS)"}
      </button>
      <p className="text-center text-[9px] text-gray-400 font-bold uppercase py-2">Biaya Gas Gratis</p>
    </div>
  );
}