import React, { useState } from "react";
import { UserAccount } from "../types";
import { User, Lock, ArrowRightLeft, Sparkles, Smile } from "lucide-react";

interface AuthProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [villageName, setVillageName] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load existing accounts from localStorage
  const getExistingAccounts = (): Record<string, { password: string; account: UserAccount }> => {
    const raw = localStorage.getItem("eco_village_accounts");
    return raw ? JSON.parse(raw) : {};
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!username.trim() || !password.trim()) {
      setErrorMsg("⚠️ 아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }

    const accounts = getExistingAccounts();

    if (isRegisterMode) {
      // REGISTRATION FLOW
      if (!villageName.trim()) {
        setErrorMsg("⚠️ 가꾸고 싶은 에코 마을 이름을 입력해 주세요.");
        return;
      }

      if (accounts[username]) {
        setErrorMsg("❌ 이미 존재하는 아이디입니다! 다른 아이디를 입력해 주세요.");
        return;
      }

      // Create new user account object
      const newAccount: UserAccount = {
        username: username.trim(),
        villageName: villageName.trim(),
        points: 500, // Starts with a small welcome bonus to buy some trees/fences right away!
        climateScore: 250, // Starts at base Drought/Wasteland level (250) so they can save it!
        placedItems: [
          // Starting base layout item (e.g. standard small house in the center)
          { id: "start_house", itemTypeId: "house", x: 50, y: 50 }
        ],
        scannedReceipts: []
      };

      accounts[username] = {
        password: password,
        account: newAccount
      };

      localStorage.setItem("eco_village_accounts", JSON.stringify(accounts));
      
      setSuccessMsg("🎉 회원가입 성공! 이제 로그인하여 마을을 꾸며보세요.");
      setIsRegisterMode(false);
      setPassword("");
    } else {
      // LOGIN FLOW
      const userRecord = accounts[username];
      if (!userRecord || userRecord.password !== password) {
        setErrorMsg("❌ 아이디 또는 비밀번호가 일치하지 않습니다.");
        return;
      }

      // Successful login
      // Track session in localStorage
      localStorage.setItem("eco_village_current_user", username);
      onLoginSuccess(userRecord.account);
    }
  };

  return (
    <div className="min-h-screen bg-[#8ecae6] flex flex-col items-center justify-center p-4 relative overflow-hidden font-game">
      
      {/* Decorative cute clouds */}
      <div className="absolute top-10 left-[10%] bg-white rounded-full px-6 py-3 border-3 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] opacity-80 animate-pulse font-bold text-xs hidden md:block">
        ☁️ 미세먼지 수치: 제로!
      </div>
      <div className="absolute top-24 right-[12%] bg-white rounded-full px-6 py-3 border-3 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] opacity-80 animate-pulse font-bold text-xs hidden md:block">
        ☀️ 광합성 활발히 진행 중
      </div>
      <div className="absolute bottom-16 left-[8%] bg-white rounded-full px-6 py-3 border-3 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] opacity-80 hidden md:block">
        🌻 꽃이 피어나고 있어요!
      </div>

      <div className="w-full max-w-sm bg-white border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] flex flex-col relative">
        
        {/* Playful doodle-like header */}
        <div className="text-center mt-2 mb-8 select-none">
          <div className="inline-block bg-[#76ba60] text-white border-3 border-black px-4 py-1 rounded-full text-xs font-black shadow-[2px_2px_0px_rgba(0,0,0,1)] mb-2 transform rotate-[-2deg]">
            친환경 게이미피케이션 🌿
          </div>
          <h1 className="text-5xl font-black text-black tracking-tight leading-none mb-1 font-game">
            ECO TOWN
          </h1>
          <p className="text-sm font-black text-[#2e6244] leading-none font-doodle">
            {isRegisterMode ? "그린 가디언 회원가입" : "에코 영수증 빌리지"}
          </p>
        </div>

        {/* Validation Banners */}
        {errorMsg && (
          <div className="bg-red-100 border-2 border-black rounded-xl p-3 text-xs text-red-900 font-bold mb-4 text-center animate-shake">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-100 border-2 border-black rounded-xl p-3 text-xs text-emerald-900 font-bold mb-4 text-center">
            {successMsg}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          
          {/* ID input */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-black text-gray-700 ml-1">그린 가디언 ID (아이디)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center pr-3 pointer-events-none">
                <User className="w-5 h-5 text-gray-500" />
              </span>
              <input
                type="text"
                placeholder="가디언 아이디 입력"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border-3 border-black rounded-xl bg-[#fdfaf2] placeholder-gray-400 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-black text-gray-700 ml-1">비밀번호</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center pr-3 pointer-events-none">
                <Lock className="w-5 h-5 text-gray-500" />
              </span>
              <input
                type="password"
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border-3 border-black rounded-xl bg-[#fdfaf2] placeholder-gray-400 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Village Name Input - Only for registration */}
          {isRegisterMode && (
            <div className="flex flex-col gap-1 animate-in slide-in-from-top duration-150">
              <label className="text-xs font-black text-gray-700 ml-1">나만의 에코 빌리지 이름</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pr-3 pointer-events-none">
                  <Smile className="w-5 h-5 text-gray-500" />
                </span>
                <input
                  type="text"
                  placeholder="예: 푸른 숲속 마을"
                  value={villageName}
                  onChange={(e) => setVillageName(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border-3 border-black rounded-xl bg-[#fdfaf2] placeholder-gray-400 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Welcome points tip for Sign Up */}
          {isRegisterMode && (
            <p className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-300 p-2 rounded-lg font-doodle">
              ✨ 가입 시 마을을 바로 꾸밀 수 있도록 <strong>웰컴 보너스 500 에코 포인트</strong>를 지급해 드립니다!
            </p>
          )}

          {/* Main Action Button */}
          <button
            type="submit"
            className="comic-button py-3.5 mt-3 text-base font-black bg-[#76ba60] text-white"
          >
            {isRegisterMode ? "가디언 등록 완료 (회원가입) 🎉" : "마을 입장하기 (로그인) 🚪"}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className="text-xs font-black text-gray-700 hover:text-black hover:underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#2e6244]" />
            {isRegisterMode ? "이미 계정이 있으신가요? 로그인" : "처음이신가요? 신규 회원가입"}
          </button>
        </div>

      </div>

      {/* Retro-cartoon fence bottom border decoration */}
      <div className="absolute bottom-0 left-0 w-full flex items-end pointer-events-none select-none opacity-40">
        <svg viewBox="0 0 1000 120" className="w-full h-24 text-white fill-current">
          <path d="M 0 120 L 1000 120 L 1000 80 Q 950 110, 900 80 Q 850 110, 800 80 Q 750 110, 700 80 Q 650 110, 600 80 Q 550 110, 500 80 Q 450 110, 400 80 Q 350 110, 300 80 Q 250 110, 200 80 Q 150 110, 100 80 Q 50 110, 0 80 Z" />
        </svg>
      </div>

    </div>
  );
};
