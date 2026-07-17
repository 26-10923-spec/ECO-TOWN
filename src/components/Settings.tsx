import React from "react";
import { UserAccount } from "../types";
import { Settings as SettingsIcon, LogOut, RotateCcw, User, Shield, HelpCircle, Gamepad2 } from "lucide-react";

interface SettingsProps {
  user: UserAccount;
  onLogout: () => void;
  onResetVillage: () => void;
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onLogout, onResetVillage, onClose }) => {

  const handleResetConfirm = () => {
    const isConfirmed = window.confirm(
      "⚠️ 정말 마을을 초기화하시겠습니까?\n\n이 작업은 되돌릴 수 없으며, 구매하여 배치한 모든 집, 나무, 도로가 사라지고 포인트 및 기후 점수가 기본 황무지 상태(가뭄)로 리셋됩니다!"
    );
    if (isConfirmed) {
      onResetVillage();
      alert("🏜️ 마을 배치가 완전히 초기화되어 태초의 황무지로 돌아갔습니다!");
      onClose();
    }
  };

  const handleLogoutConfirm = () => {
    const isConfirmed = window.confirm("🚪 에코 영수증 빌리지에서 로그아웃 하시겠습니까?");
    if (isConfirmed) {
      onLogout();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f9f5eb]/95 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in zoom-in duration-200">
      <div className="comic-card w-full max-w-md bg-white p-6 relative">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-black hover:scale-110 transition-transform text-2xl font-bold bg-[#eae3cb] w-10 h-10 rounded-full flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
        >
          ✕
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-6 border-b-3 border-black pb-3">
          <SettingsIcon className="w-8 h-8 text-emerald-800 animate-spin" style={{ animationDuration: "8s" }} />
          <h2 className="text-3xl font-black text-emerald-800 font-game">마을 환경 설정</h2>
        </div>

        {/* User Account Card */}
        <div className="bg-[#fcfaf2] border-2 border-black rounded-xl p-4 mb-6 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-2 rounded-full border-2 border-black">
              <User className="w-6 h-6 text-emerald-800" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-bold block">그린 가디언 ID</span>
              <span className="text-xl font-black text-black">{user.username}님</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs border-t border-dashed border-gray-300 pt-3">
            <div>
              <span className="text-gray-400 font-bold block">나의 마을 이름</span>
              <span className="font-black text-emerald-900 text-sm">🏡 {user.villageName}</span>
            </div>
            <div>
              <span className="text-gray-400 font-bold block">분석된 영수증수</span>
              <span className="font-black text-emerald-900 text-sm">🧾 {user.scannedReceipts.length}개</span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-amber-50 border-2 border-black rounded-xl p-3 text-xs text-amber-900 mb-6 flex gap-2">
          <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="font-doodle">
            <p className="font-black mb-1">보안 및 저장 안내:</p>
            <p className="leading-relaxed">
              귀하의 마을 데이터는 브라우저의 보안 로컬 데이터베이스(localStorage)에 안전하게 실시간 저장됩니다. 브라우저 캐시를 삭제하기 전까지는 언제든 안전하게 이어할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Controls Layout */}
        <div className="flex flex-col gap-3">
          
          {/* Reset Village */}
          <button
            onClick={handleResetConfirm}
            className="comic-button py-3 font-black text-sm flex items-center justify-center gap-2 comic-button-yellow"
          >
            <RotateCcw className="w-4 h-4" /> 🏜️ 내 마을 초기화하기 (Reset)
          </button>

          {/* Real Logout */}
          <button
            onClick={handleLogoutConfirm}
            className="comic-button py-3 font-black text-sm flex items-center justify-center gap-2 comic-button-red"
          >
            <LogOut className="w-4 h-4" /> 🚪 안전하게 로그아웃 (Logout)
          </button>

          {/* Close cancel */}
          <button
            onClick={onClose}
            className="comic-button py-2 bg-neutral-200 hover:bg-neutral-300 text-black font-black text-xs mt-2"
          >
            설정 닫고 게임 계속하기
          </button>

        </div>

      </div>
    </div>
  );
};
