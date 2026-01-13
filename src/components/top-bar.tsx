"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function TopBar() {
  return (
    <div className="flex items-center justify-between py-4">
      {/* BAGIAN KIRI: Logo & Animasi Teks */}
      <div className="flex items-center gap-3 overflow-hidden">
        {/* Logo Sekolah */}
        <div className="relative z-10 bg-white dark:bg-zinc-950 pr-1">
          <Image 
            src="/logo-sekolah.png" 
            alt="Logo Sekolah"
            width={56} 
            height={56}
            className="h-14 w-14 object-contain drop-shadow-sm"
          />
        </div>

        {/* Animasi Teks Muncul */}
        <motion.div
          className="flex flex-col justify-center"
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}   
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        >
          <h1 className="text-base font-black leading-none text-zinc-900 dark:text-white tracking-tighter">
            SMP NEGERI 21
          </h1>
          <p className="text-[9px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-0.5">
            JAMBI
          </p>
        </motion.div>
      </div>
    </div>
  );
}