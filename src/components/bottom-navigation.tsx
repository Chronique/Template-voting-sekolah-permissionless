"use client";

import { 
  HowToVote, AddCircleOutline, PeopleOutline, 
  AccountCircle, Settings, Assessment, PlaylistAddCheck 
} from "@mui/icons-material";
import { ReactNode } from "react";

interface NavItemProps {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  colorClass: string;
}

const NavItem = ({ active, onClick, icon, label, colorClass }: NavItemProps) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center justify-center w-full py-1 transition-all active:scale-90 ${
      active ? "text-zinc-900 dark:text-white" : "text-zinc-400"
    }`}
  >
    <div className={`${active ? "scale-110" : "scale-100"} transition-transform duration-200`}>
      {active ? <span className={colorClass}>{icon}</span> : icon}
    </div>
    <span className="text-[10px] font-bold mt-1 tracking-wide">{label}</span>
  </button>
);

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdmin: boolean;
  pollCreated: boolean;
}

export function BottomNavigation({ activeTab, onTabChange, isAdmin, pollCreated }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 border-t pb-safe z-50 shadow-lg">
      <div className="max-w-md mx-auto flex justify-between items-center px-2 py-3">
        <NavItem active={activeTab === "vote"} onClick={() => onTabChange("vote")} icon={<HowToVote />} colorClass="text-blue-600" label="Vote" />
        {isAdmin && (
          <>
            {pollCreated ? (
              <NavItem active={activeTab === "results"} onClick={() => onTabChange("results")} icon={<Assessment />} colorClass="text-green-600" label="Hasil" />
            ) : (
              <NavItem active={activeTab === "create"} onClick={() => onTabChange("create")} icon={<AddCircleOutline />} colorClass="text-orange-500" label="Buat" />
            )}
            <NavItem active={activeTab === "verify"} onClick={() => onTabChange("verify")} icon={<PlaylistAddCheck />} colorClass="text-teal-500" label="Cek" />
            <NavItem active={activeTab === "admin"} onClick={() => onTabChange("admin")} icon={<PeopleOutline />} colorClass="text-purple-500" label="Murid" />
            <NavItem active={activeTab === "settings"} onClick={() => onTabChange("settings")} icon={<Settings />} colorClass="text-zinc-800" label="Set" />
          </>
        )}
        <NavItem active={activeTab === "wallet"} onClick={() => onTabChange("wallet")} icon={<AccountCircle />} colorClass="text-red-500" label="Profil" />
      </div>
    </div>
  );
}