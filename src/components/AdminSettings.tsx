"use client";

import { useState } from "react";
import { useSendCalls } from "wagmi";
import { encodeFunctionData, concat } from "viem"; // Tambahkan concat
import { CONTRACT_ADDRESS, CLASS_VOTE_ABI, BUILDER_CODE_HEX } from "~/app/constants";
import { PersonAdd, RestartAlt, DeleteForever, EditNote } from "@mui/icons-material";

export default function AdminSettings() {
  const [newAdmin, setNewAdmin] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const { sendCalls, isPending } = useSendCalls();

  const paymasterUrl = process.env.NEXT_PUBLIC_PAYMASTER_URL;

  // Pastikan Builder Code memiliki prefix 0x
  const safeBuilderCode = BUILDER_CODE_HEX.startsWith("0x") 
    ? (BUILDER_CODE_HEX as `0x${string}`) 
    : (`0x${BUILDER_CODE_HEX}` as `0x${string}`);

  const handleUpdateTitle = async () => {
    if (!paymasterUrl || !newTitle) return;

    try {
      const baseData = encodeFunctionData({
        abi: CLASS_VOTE_ABI,
        functionName: "updateTitle",
        args: [newTitle],
      });

      // GABUNGKAN DENGAN CONCAT
      const finalData = concat([baseData, safeBuilderCode]);

      sendCalls({
        calls: [{
          to: CONTRACT_ADDRESS as `0x${string}`,
          data: finalData,
        }],
        capabilities: { paymasterService: { url: paymasterUrl } }
      });
      alert("Permintaan pembaruan judul dikirim!");
      setNewTitle("");
    } catch (e) {
      console.error(e);
      alert("Gagal memperbarui judul.");
    }
  };

  const handleAddAdmin = async () => {
    if (!paymasterUrl || !newAdmin.startsWith("0x")) return alert("Alamat tidak valid!");

    try {
      const baseData = encodeFunctionData({
        abi: CLASS_VOTE_ABI,
        functionName: "addAdmin",
        args: [newAdmin as `0x${string}`],
      });

      const finalData = concat([baseData, safeBuilderCode]);

      sendCalls({
        calls: [{
          to: CONTRACT_ADDRESS as `0x${string}`,
          data: finalData,
        }],
        capabilities: { paymasterService: { url: paymasterUrl } }
      });
      alert("Permintaan tambah admin dikirim!");
      setNewAdmin("");
    } catch (e) {
      console.error(e);
      alert("Gagal menambah admin. Pastikan alamat belum jadi admin.");
    }
  };

  const handleReset = async (clearWhitelist: boolean) => {
    if (!paymasterUrl) return;
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    try {
      const baseData = encodeFunctionData({
        abi: CLASS_VOTE_ABI,
        functionName: "resetPoll",
        args: [clearWhitelist],
      });

      const finalData = concat([baseData, safeBuilderCode]);

      sendCalls({
        calls: [{
          to: CONTRACT_ADDRESS as `0x${string}`,
          data: finalData,
        }],
        capabilities: { paymasterService: { url: paymasterUrl } }
      });
      alert("Permintaan reset dikirim!");
    } catch (e) {
      console.error(e);
      alert("Gagal reset data.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-[28px] border shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <PersonAdd className="text-blue-500" />
          <h2 className="font-black uppercase text-zinc-900 dark:text-white">Tambah Admin</h2>
        </div>
        <input 
          placeholder="0x..." 
          className="w-full p-4 rounded-2xl border bg-zinc-50 dark:bg-zinc-800 mb-3 text-sm outline-none focus:border-blue-500" 
          value={newAdmin} 
          onChange={(e) => setNewAdmin(e.target.value)} 
        />
        <button 
          onClick={handleAddAdmin} 
          disabled={isPending} 
          className="w-full bg-blue-600 text-white rounded-2xl py-4 font-bold active:scale-95 transition-transform disabled:opacity-50"
        >
          {isPending ? "MEMPROSES..." : "TAMBAH AKSES"}
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-[28px] border shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <EditNote className="text-blue-500" />
          <h2 className="font-black uppercase text-sm text-zinc-900 dark:text-white">Ganti Nama Pemilihan</h2>
        </div>
        <input 
          placeholder="Contoh: PEMILIHAN KETUA OSIS" 
          className="w-full p-4 rounded-2xl border bg-zinc-50 dark:bg-zinc-800 mb-3 text-sm outline-none focus:border-blue-500" 
          value={newTitle} 
          onChange={(e) => setNewTitle(e.target.value)} 
        />
        <button 
          onClick={handleUpdateTitle} 
          disabled={isPending}
          className="w-full bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white rounded-2xl py-4 font-bold text-xs active:scale-95 transition-transform disabled:opacity-50"
        >
          {isPending ? "MEMPROSES..." : "SIMPAN JUDUL BARU"}
        </button>
      </div>

      <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-[28px] border border-red-100 dark:border-red-900/20">
        <h2 className="font-black text-red-600 uppercase mb-4 text-sm tracking-widest">Area Berbahaya</h2>
        <div className="space-y-3">
          <button 
            onClick={() => handleReset(false)} 
            disabled={isPending}
            className="w-full py-4 bg-white dark:bg-zinc-900 border border-red-200 text-red-600 rounded-2xl font-black text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <RestartAlt fontSize="small" /> RESET & SIMPAN MURID
          </button>
          <button 
            onClick={() => handleReset(true)} 
            disabled={isPending}
            className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-red-200 dark:shadow-none"
          >
            <DeleteForever fontSize="small" /> RESET TOTAL (HAPUS SEMUA)
          </button>
        </div>
      </div>
    </div>
  );
}