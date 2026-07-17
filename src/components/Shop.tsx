import React, { useState } from "react";
import { ShopItem } from "../types";
import { SHOP_ITEMS } from "../data/shopItems";
import { VillageItemRenderer } from "./VillageItemRenderer";
import { Sparkles, Coins, HelpCircle, ArrowLeft } from "lucide-react";

interface ShopProps {
  userPoints: number;
  onBuyItem: (item: ShopItem) => void;
  onClose: () => void;
}

export const Shop: React.FC<ShopProps> = ({ userPoints, onBuyItem, onClose }) => {
  const [activeTab, setActiveTab] = useState<"all" | "building" | "nature">("all");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const filteredItems = SHOP_ITEMS.filter((item) => {
    if (activeTab === "all") return true;
    return item.category === activeTab;
  });

  const handlePurchase = (item: ShopItem) => {
    if (userPoints < item.cost) {
      alert("❌ 에코 포인트가 부족합니다! 영수증을 분석해 친환경 로컬푸드를 구매하고 포인트를 적립해 보세요.");
      return;
    }

    onBuyItem(item);
    
    // Show a cute success message
    setSuccessMsg(`🎉 '${item.name}' 구매 성공! 인벤토리에 추가되었습니다. 마을에 배치하여 꾸며 보세요!`);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f9f5eb] flex flex-col animate-in fade-in slide-in-from-bottom duration-300">
      
      {/* Shop Header */}
      <div className="border-b-4 border-black bg-[#eae3cb] p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-[0_4px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="comic-button px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-black flex items-center gap-1 text-sm font-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
          >
            <ArrowLeft className="w-4 h-4" /> 뒤로가기
          </button>
          <h1 className="text-3xl font-black text-[#2e6244] tracking-tight flex items-center gap-2 font-game">
            🏪 친환경 에코 상점 (Eco Shop)
          </h1>
        </div>

        {/* User points indicator */}
        <div className="comic-border-sm bg-white px-5 py-2 flex items-center gap-2 rounded-xl text-lg font-black text-amber-700 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
          <Coins className="w-5 h-5 text-amber-600 animate-bounce" />
          보유 에코 포인트: <span className="text-xl text-black font-game">{userPoints.toLocaleString()}</span> P
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full flex flex-col">
        
        {/* Helper info bubble */}
        <div className="bg-emerald-50 border-3 border-emerald-600 rounded-xl p-4 mb-6 comic-border-sm flex items-start gap-3">
          <Sparkles className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-black text-emerald-900 text-base">친환경 마을을 더 아름답게 꾸며보세요!</h3>
            <p className="text-xs text-emerald-800 leading-relaxed font-doodle">
              영수증을 올릴 때마다 저탄소 Green 식품은 <strong>+500P</strong>가 적립되고, 축산업 Red 식품은 <strong>-200P</strong>가 차감됩니다.
              꾸미기 오브젝트들을 구매하면 보유 에코 포인트에서 즉시 차감되며, 구매한 아이템은 마을에 <strong>드래그&드롭</strong>하여 자유롭게 배치 및 편집할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Success floating banner */}
        {successMsg && (
          <div className="bg-amber-100 border-3 border-amber-600 text-amber-900 p-3 rounded-lg mb-6 font-bold text-sm text-center animate-bounce comic-border-sm">
            {successMsg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b-3 border-black pb-1">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-5 py-2 text-base font-black border-3 border-black rounded-t-xl transition-all ${
              activeTab === "all"
                ? "bg-[#76ba60] text-white translate-y-[-2px] border-b-transparent shadow-[0_4px_0px_#f9f5eb]"
                : "bg-white hover:bg-orange-50 text-black border-b-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            }`}
          >
            전체 품목 (All)
          </button>
          <button
            onClick={() => setActiveTab("building")}
            className={`px-5 py-2 text-base font-black border-3 border-black rounded-t-xl transition-all ${
              activeTab === "building"
                ? "bg-[#76ba60] text-white translate-y-[-2px] border-b-transparent shadow-[0_4px_0px_#f9f5eb]"
                : "bg-white hover:bg-orange-50 text-black border-b-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            }`}
          >
            친환경 건축물 (Building)
          </button>
          <button
            onClick={() => setActiveTab("nature")}
            className={`px-5 py-2 text-base font-black border-3 border-black rounded-t-xl transition-all ${
              activeTab === "nature"
                ? "bg-[#76ba60] text-white translate-y-[-2px] border-b-transparent shadow-[0_4px_0px_#f9f5eb]"
                : "bg-white hover:bg-orange-50 text-black border-b-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            }`}
          >
            자연 오브젝트 (Nature)
          </button>
        </div>

        {/* Shop Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-12">
          {filteredItems.map((item) => {
            const isAffordable = userPoints >= item.cost;
            return (
              <div
                key={item.id}
                className="comic-card bg-white p-4 flex flex-col justify-between hover:scale-[1.02] transition-transform relative group"
              >
                {/* Visual model render box */}
                <div className="bg-[#fcfaf2] border-2 border-black rounded-lg p-3 flex items-center justify-center h-32 mb-4 relative overflow-hidden group-hover:bg-[#eae3cb]/30 transition-colors">
                  <VillageItemRenderer type={item.type} size={88} />
                  
                  {/* Category mini tag */}
                  <span className={`absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 rounded border border-black ${
                    item.category === "nature" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    {item.category === "nature" ? "자연" : "에코건물"}
                  </span>
                </div>

                {/* Details */}
                <div>
                  <h3 className="font-black text-lg mb-1 group-hover:text-emerald-700 transition-colors text-slate-800">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 leading-tight mb-4 font-doodle h-12 overflow-y-auto">
                    {item.description}
                  </p>
                </div>

                {/* Action panel */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-dashed border-gray-300">
                  <span className="font-black text-amber-700 text-base flex items-center gap-0.5 font-game">
                    🌿 {item.cost} <span className="text-xs text-gray-400">P</span>
                  </span>
                  
                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={!isAffordable}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all ${
                      isAffordable
                        ? "bg-[#76ba60] hover:bg-[#64a54e] text-white hover:translate-y-[-1px] active:translate-y-[1px]"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                    }`}
                  >
                    구매하기
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
