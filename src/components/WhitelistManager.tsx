"use client";

import { useState } from "react";
import { useSendCalls } from "wagmi";
import { encodeFunctionData } from "viem";
import { CONTRACT_ADDRESS, CLASS_VOTE_ABI } from "~/app/constants";
import { Button } from "./ui/Button";

export default function WhitelistManager() {
  const [input, setInput] = useState("");
  const { sendCalls, isPending } = useSendCalls();

  // 1. Fungsi Tambah Whitelist (Gasless)
  const handleAdd = async () => {
    // FIX: Ambil URL dan pastikan tidak undefined
    const paymasterUrl = process.env.NEXT_PUBLIC_PAYMASTER_URL;
    if (!paymasterUrl) return alert("Paymaster URL belum diatur di .env");

    // FIX: Casting ke `0x${string}`[] agar TypeScript tidak komplain
    const addresses = input
      .split(/[\n,]+/)
      .map((a) => a.trim())
      .filter((a) => a.startsWith("0x")) as `0x${string}`[];

    if (addresses.length === 0) return alert("Alamat tidak valid!");

    try {
      sendCalls({
        calls: [
          {
            to: CONTRACT_ADDRESS as `0x${string}`,
            data: encodeFunctionData({
              abi: CLASS_VOTE_ABI,
              functionName: "addToWhitelist",
              args: [addresses],
            }),
          },
        ],
        capabilities: {
          paymasterService: { url: paymasterUrl },
        },
      });
      alert("Permintaan pendaftaran dikirim secara gratis!");
      setInput("");
    } catch (e) {
      alert("Terjadi kesalahan teknis.");
    }
  };

  // 2. Fungsi Reset (Gasless)
  const handleReset = async (hapusSemuaMurid: boolean) => {
    const paymasterUrl = process.env.NEXT_PUBLIC_PAYMASTER_URL;
    if (!paymasterUrl) return alert("Paymaster URL belum diatur di .env");

    const confirmMsg = hapusSemuaMurid 
      ? "Hapus SEMUA data termasuk daftar murid?" 
      : "Hapus pemilihan saja (Simpan daftar murid)?";

    if (!confirm(confirmMsg)) return;

    try {
      sendCalls({
        calls: [
          {
            to: CONTRACT_ADDRESS as `0x${string}`,
            data: encodeFunctionData({
              abi: CLASS_VOTE_ABI,
              functionName: "resetPoll",
              args: [hapusSemuaMurid],
            }),
          },
        ],
        capabilities: {
          paymasterService: { url: paymasterUrl },
        },
      });
      alert("Permintaan reset dikirim secara gratis!");
    } catch (e) {
      alert("Gagal melakukan reset.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border shadow-sm">
        <h2 className="text-xl font-black mb-4 uppercase tracking-tight">Daftarkan Murid</h2>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Masukkan alamat wallet (satu per baris atau pisahkan dengan koma)"
          className="w-full h-40 p-4 rounded-2xl border bg-zinc-50 dark:bg-zinc-800 mb-4 text-xs font-mono outline-none focus:border-blue-500"
        />
        <Button onClick={handleAdd} disabled={isPending} className="w-full py-6 rounded-2xl">
          {isPending ? "MEMPROSES..." : "SIMPAN WHITELIST"}
        </Button>
      </div>

      <div className="p-6 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100">
        <h3 className="text-xs font-black text-red-500 mb-4 uppercase tracking-widest">Kontrol Pemilihan</h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleReset(false)}
            disabled={isPending}
            className="w-full py-3 border border-red-200 text-red-600 rounded-xl text-[10px] font-bold hover:bg-white transition-all"
          >
            DAUR ULANG (SIMPAN DAFTAR MURID)
          </button>
          <button
            onClick={() => handleReset(true)}
            disabled={isPending}
            className="w-full py-3 bg-red-600 text-white rounded-xl text-[10px] font-bold shadow-lg shadow-red-200"
          >
            RESET TOTAL (HAPUS SEMUA DATA)
          </button>
        </div>
      </div>
    </div>
  );
}