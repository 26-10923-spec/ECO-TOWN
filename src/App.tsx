import React, { useState, useEffect, useRef } from "react";
import { UserAccount, ShopItem, PlacedItem, ReceiptAnalysisResult, ReceiptRecord } from "./types";
import { SHOP_ITEMS } from "./data/shopItems";
import { Auth } from "./components/Auth";
import { Shop } from "./components/Shop";
import { ReceiptScanner } from "./components/ReceiptScanner";
import { ReceiptHistory } from "./components/ReceiptHistory";
import { Settings } from "./components/Settings";
import { VillageItemRenderer } from "./components/VillageItemRenderer";
import { 
  ShoppingBag, 
  Camera, 
  PieChart, 
  Settings as SettingsIcon, 
  Lock, 
  HelpCircle, 
  Compass, 
  AlertTriangle,
  Move,
  Trash2,
  CheckCircle,
  Sparkles,
  Cloud,
  Sun,
  Droplets
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  
  // UI Panel Triggers
  const [showShop, setShowShop] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Edit Mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  
  // Unplaced purchased items waiting to be placed
  const [inventory, setInventory] = useState<ShopItem[]>([]);

  // Weather state & transition triggers
  const [weatherState, setWeatherState] = useState<"Sunny" | "Cloudy" | "Disaster">("Disaster");
  const [activeDisaster, setActiveDisaster] = useState<"None" | "Drought" | "Flood">("Drought");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState<string>("");
  const previousWeatherRef = useRef<"Sunny" | "Cloudy" | "Disaster" | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);

  // 1. Authenticate user on mount
  useEffect(() => {
    const loggedInId = localStorage.getItem("eco_village_current_user");
    if (loggedInId) {
      const accounts = JSON.parse(localStorage.getItem("eco_village_accounts") || "{}");
      if (accounts[loggedInId]) {
        const user = accounts[loggedInId].account;
        setCurrentUser(user);
        syncWeather(user.climateScore, user.scannedReceipts);
      }
    }
  }, []);

  // Sync state to LocalStorage
  const saveUserToStorage = (updatedUser: UserAccount) => {
    setCurrentUser(updatedUser);
    const accounts = JSON.parse(localStorage.getItem("eco_village_accounts") || "{}");
    if (accounts[updatedUser.username]) {
      accounts[updatedUser.username].account = updatedUser;
      localStorage.setItem("eco_village_accounts", JSON.stringify(accounts));
    }
  };

  // Weather syncing logic based on Climate Score
  const syncWeather = (score: number, receiptsList: ReceiptRecord[], triggerAnimation = false) => {
    let currentW: "Sunny" | "Cloudy" | "Disaster" = "Disaster";
    let currentD: "None" | "Drought" | "Flood" = "None";

    if (score >= 1000) {
      currentW = "Sunny";
      currentD = "None";
    } else if (score >= 500 && score < 1000) {
      currentW = "Cloudy";
      currentD = "None";
    } else {
      currentW = "Disaster";
      currentD = "Drought";
    }

    // Set states
    setWeatherState(currentW);
    setActiveDisaster(currentD);

    // Run weather transition overlay if the state changed
    const prevW = previousWeatherRef.current;
    if (triggerAnimation && prevW !== null && prevW !== currentW) {
      setTransitionType(`${prevW} ➡️ ${currentW}`);
      setIsTransitioning(true);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 4500); // Transitions display for 4.5 seconds
    }
    previousWeatherRef.current = currentW;
  };

  // Login handler
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    syncWeather(user.climateScore, user.scannedReceipts);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("eco_village_current_user");
    setCurrentUser(null);
    setShowSettings(false);
  };

  // Reset village to starting template
  const handleResetVillage = () => {
    if (!currentUser) return;
    const resetUser: UserAccount = {
      ...currentUser,
      points: 500,
      climateScore: 250, // Back to Drought Wasteland base
      placedItems: [
        { id: "start_house", itemTypeId: "house", x: 50, y: 50 }
      ],
      scannedReceipts: []
    };
    setInventory([]);
    previousWeatherRef.current = null;
    saveUserToStorage(resetUser);
    syncWeather(250, [], false);
  };

  // Buying item from Eco Shop
  const handleBuyItem = (item: ShopItem) => {
    if (!currentUser) return;
    
    // Deduct points
    const updatedPoints = currentUser.points - item.cost;
    
    // Adding eco points/items adds eco score!
    // Building a tree adds 40 climate points, a large house adds 100!
    let scoreBoost = 30;
    if (item.id === "apartment") scoreBoost = 150;
    else if (item.id === "large_house") scoreBoost = 100;
    else if (item.id === "pond") scoreBoost = 90;
    else if (item.id === "fountain") scoreBoost = 110;

    const updatedClimateScore = currentUser.climateScore + scoreBoost;

    // Immediately place it onto a random spot in the village for seamless UX, or put it in inventory
    const newItem: PlacedItem = {
      id: `${item.id}_${Date.now()}`,
      itemTypeId: item.id,
      x: Math.floor(Math.random() * 60) + 20, // 20% to 80%
      y: Math.floor(Math.random() * 50) + 25  // 25% to 75%
    };

    const updatedUser: UserAccount = {
      ...currentUser,
      points: updatedPoints,
      climateScore: updatedClimateScore,
      placedItems: [...currentUser.placedItems, newItem]
    };

    saveUserToStorage(updatedUser);
    syncWeather(updatedClimateScore, currentUser.scannedReceipts, true);
  };

  // Delete placed item and refund 50% points in Edit Mode
  const handleDeleteItem = (itemId: string, itemTypeId: string) => {
    if (!currentUser) return;
    const findItem = SHOP_ITEMS_CATALOG().find((i) => i.id === itemTypeId);
    const refund = findItem ? Math.floor(findItem.cost * 0.5) : 0;

    let scoreLoss = 30;
    if (itemTypeId === "apartment") scoreLoss = 150;
    else if (itemTypeId === "large_house") scoreLoss = 100;

    const updatedItems = currentUser.placedItems.filter((item) => item.id !== itemId);
    const updatedUser: UserAccount = {
      ...currentUser,
      points: currentUser.points + refund,
      climateScore: Math.max(0, currentUser.climateScore - scoreLoss),
      placedItems: updatedItems
    };

    saveUserToStorage(updatedUser);
    syncWeather(updatedUser.climateScore, currentUser.scannedReceipts, true);
  };

  // Add parsed receipt record to past list & apply point shifts
  const handleAddReceiptRecord = (record: ReceiptRecord) => {
    if (!currentUser) return;
    
    // Add points earned (cannot go below 0)
    const updatedPoints = currentUser.points + record.pointsEarned;

    // Apply carbon rating final score dynamically to overall village climate score.
    // Good receipts (>50) give slightly less positive score, while bad receipts (<=50) deduct score heavily.
    const scoreDifference = record.finalScore - 50;
    const climateScoreChange = scoreDifference > 0 
      ? Math.round(scoreDifference * 0.8)  // Give slightly less
      : Math.round(scoreDifference * 1.5); // Deduct more heavily

    const updatedClimateScore = Math.max(0, currentUser.climateScore + climateScoreChange);

    const updatedReceipts = [record, ...currentUser.scannedReceipts];
    const updatedUser: UserAccount = {
      ...currentUser,
      points: updatedPoints,
      climateScore: updatedClimateScore,
      scannedReceipts: updatedReceipts
    };

    saveUserToStorage(updatedUser);
    syncWeather(updatedClimateScore, updatedReceipts, true);
  };

  // Seamless drag handlers
  const handlePointerDown = (e: React.PointerEvent, itemId: string) => {
    if (!isEditMode) return;
    e.stopPropagation();
    // Enable dragging
    setDraggingItemId(itemId);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingItemId || !currentUser || !mapRef.current) return;
    e.preventDefault();

    const rect = mapRef.current.getBoundingClientRect();
    // Calculate percentages relative to map canvas
    const x = Math.min(94, Math.max(2, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(88, Math.max(8, ((e.clientY - rect.top) / rect.height) * 100));

    // Update coordinates in temporary state
    const updatedItems = currentUser.placedItems.map((item) => {
      if (item.id === draggingItemId) {
        return { ...item, x, y };
      }
      return item;
    });

    setCurrentUser({
      ...currentUser,
      placedItems: updatedItems
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggingItemId) return;
    setDraggingItemId(null);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    
    // Persist new dragged placement coordinates to storage
    if (currentUser) {
      saveUserToStorage(currentUser);
    }
  };

  // Helper dictionary catalog to resolve item cost & visual attributes
  const SHOP_ITEMS_CATALOG = () => {
    return SHOP_ITEMS as ShopItem[];
  };

  if (!currentUser) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  // Determine current active landscape styling
  const getMapBackgroundClass = () => {
    if (weatherState === "Sunny") return "bg-[#b7e4c7] border-4 border-black"; // Beautiful green meadow
    if (weatherState === "Cloudy") return "bg-[#a2aab0] border-4 border-black"; // Cool rainy grey field
    // Disaster
    if (activeDisaster === "Drought") return "bg-[#e29578] border-4 border-black cracked-soil"; // Cracked orange soil
    return "bg-[#8ab17d] border-4 border-black flooded-shallows"; // Flooded water log
  };

  return (
    <div className="min-h-screen bg-[#f3efe0] p-4 flex flex-col font-game select-none relative pb-12">
      
      {/* 1. WEATHER TRANSITION ANIMATION OVERLAY OVER THE PORTAL */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 z-[100] flex flex-col items-center justify-center p-6 text-center"
          >
            {/* Visual indicator for transitioning to Sunny */}
            {transitionType.endsWith("Sunny") && (
              <div className="flex flex-col items-center animate-in zoom-in duration-300">
                <div className="relative mb-6">
                  <Sun className="w-24 h-24 text-amber-500 animate-spin" style={{ animationDuration: "12s" }} />
                  <Droplets className="w-10 h-10 text-blue-400 absolute top-16 right-[-8px] animate-bounce" />
                </div>
                <h2 className="text-4xl font-black text-[#76ba60] mb-2 font-game">🌈 기후 위기 극복! 날씨 예보: 맑음 ☀️</h2>
                <p className="text-sm text-gray-300 max-w-md font-doodle leading-relaxed">
                  먹구름에서 세차게 정화의 비가 내리고 있습니다! 대지를 깨끗이 적셔 오염을 씻어내며 하늘이 투명하고 푸르게 개어납니다. 마을이 완전한 숲이자 쉼터로 변신합니다!
                </p>
                <div className="flex gap-1 mt-4">
                  {[...Array(6)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      animate={{ y: [0, 40, 0], opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                      className="w-1.5 h-6 bg-blue-400 rounded-full"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Transitioning to Cloudy */}
            {transitionType.includes("Disaster") && transitionType.endsWith("Cloudy") && (
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <Cloud className="w-24 h-24 text-gray-400 animate-pulse" />
                  <div className="absolute inset-0 bg-grey-300 opacity-20 blur-lg rounded-full" />
                </div>
                <h2 className="text-4xl font-black text-yellow-500 mb-2 font-game">☁️ 황무지 대지 회복 시작!</h2>
                <p className="text-sm text-gray-300 max-w-md font-doodle leading-relaxed">
                  유저님의 지속 가능한 실천으로 극단적인 가뭄/홍수의 기후 재앙 위협을 탈출했습니다! 대지 위로 먹구름이 서서히 들어오며 건조하고 거칠었던 화면이 차츰 온화하게 가라앉습니다.
                </p>
                <div className="mt-6 flex gap-2">
                  <motion.div 
                    animate={{ x: [-150, 150] }}
                    transition={{ repeat: Infinity, duration: 3.5 }}
                    className="flex gap-1"
                  >
                    <Cloud className="w-10 h-10 text-slate-500" />
                    <Cloud className="w-6 h-6 text-slate-400 mt-2" />
                  </motion.div>
                </div>
              </div>
            )}

            {/* Transitioning back to Disaster */}
            {transitionType.endsWith("Disaster") && (
              <div className="flex flex-col items-center">
                <AlertTriangle className="w-24 h-24 text-red-500 animate-bounce mb-6" />
                <h2 className="text-4xl font-black text-red-500 mb-2 font-game">
                  🚨 기후 경보 발생: {activeDisaster === "Drought" ? "가뭄 발생 🏜️" : "홍수 발생 🌊"}
                </h2>
                <p className="text-sm text-gray-300 max-w-md font-doodle leading-relaxed">
                  {activeDisaster === "Drought" 
                    ? "축산업 소고기 및 초고농축 탄소 식품 구매가 대량 감지되었습니다! 온실가스(메탄) 수치가 폭증하여 대지가 타들어 가고 메마른 갈라짐 시각 효과가 덮치고 있습니다!"
                    : "일회용품 및 유독 가공식품의 과소비로 환경 파괴가 감지되었습니다! 마을에 수위가 상승하여 물에 잠기는 홍수 시각 재난 효과가 강제 활성화됩니다!"}
                </p>
                <div className="w-48 bg-gray-700 h-3 border-2 border-black rounded-full overflow-hidden mt-6">
                  <motion.div 
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 4 }}
                    className="bg-red-500 h-full"
                  />
                </div>
              </div>
            )}

            {/* Other generic cloudy transition */}
            {transitionType.startsWith("Sunny") && transitionType.endsWith("Cloudy") && (
              <div className="flex flex-col items-center">
                <Cloud className="w-24 h-24 text-slate-500 mb-6 animate-pulse" />
                <h2 className="text-4xl font-black text-gray-400 mb-2">☁️ 마을에 드리우는 먹구름...</h2>
                <p className="text-sm text-gray-300 max-w-md font-doodle leading-relaxed">
                  과다 탄소 영향이 유입되고 있어 맑고 쾌청하던 마을에 서서히 먹구름이 옆에서 미끄러지듯 유입되어 해를 가립니다! 더 철저한 분리배출과 식습관 제어가 필요합니다.
                </p>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

      {/* App HUD Top Bar */}
      <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center bg-white border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] gap-4 mb-6 relative">
        <div className="flex items-center gap-3">
          <div className="bg-[#76ba60] text-white border-2 border-black w-12 h-12 rounded-xl flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            🌿
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block">그린 에너지 마을 </span>
            <h1 className="text-2xl font-black text-black leading-none font-game">🏡 {currentUser.villageName}</h1>
          </div>
        </div>

        {/* Dashboard Status HUD */}
        <div className="flex flex-wrap items-center gap-4 text-sm font-black">
          {/* Points */}
          <div className="comic-border-sm bg-[#faf6ed] px-3.5 py-1.5 rounded-xl flex items-center gap-1">
            <span className="text-amber-700">🌿 포인트:</span>
            <span className="text-base text-black font-game">{currentUser.points.toLocaleString()}</span>
            <span className="text-xs text-gray-400">P</span>
          </div>

          {/* Climate score */}
          <div className="comic-border-sm bg-[#faf6ed] px-3.5 py-1.5 rounded-xl flex items-center gap-1">
            <span className="text-emerald-700">🌲 기후 점수:</span>
            <span className="text-base text-black font-game">{currentUser.climateScore}</span>
            <span className="text-xs text-gray-400">점</span>
          </div>

          {/* Weather status indicator */}
          <div className="comic-border-sm bg-[#faf6ed] px-3.5 py-1.5 rounded-xl flex items-center gap-1">
            <span className="text-gray-500">날씨:</span>
            <span className="font-game">
              {weatherState === "Sunny" && "☀️ 맑음 (안전)"}
              {weatherState === "Cloudy" && "☁️ 먹구름 끼는 중"}
              {weatherState === "Disaster" && (
                <span className="text-red-500 animate-pulse">
                  🚨 기후 재해 ({activeDisaster === "Drought" ? "가뭄 🏜️" : "홍수 🌊"})
                </span>
              )}
            </span>
          </div>

          {/* Settings cog */}
          <button
            onClick={() => setShowSettings(true)}
            className="comic-button p-2 bg-[#eae3cb] hover:bg-[#dcd1b3] rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:rotate-45 transition-transform"
          >
            <SettingsIcon className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>

      {/* Main Map Box & Layout Area */}
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col relative">
        
        {/* Helper guide ribbon */}
        <div className="mb-2 text-center text-xs font-black text-gray-600 bg-[#eae3cb]/40 border-2 border-black rounded-lg py-1 shadow-[1px_1px_0px_rgba(0,0,0,1)]">
          {isEditMode 
            ? "🛠️ [편집 모드 활성화됨] 마우스로 나무나 집을 잡고 드래그하면 움직입니다! (삭제 시 50% 포인트 환불)" 
            : "👀 [감상 모드] 오른쪽 하단의 '마을 편집' 도구를 누르면 배치를 바꾸거나 이동할 수 있습니다!"}
        </div>

        {/* The Map Arena */}
        <div 
          ref={mapRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`relative flex-1 min-h-[460px] rounded-3xl overflow-hidden transition-all duration-700 ${getMapBackgroundClass()} shadow-[8px_8px_0px_rgba(0,0,0,1)]`}
        >
          
          {/* A. VISUAL CLOUD EFFECT SLIDER FOR CLOUDY WEATHER STATE */}
          {weatherState === "Cloudy" && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-75">
              {/* Overlay slide-in effect */}
              <motion.div 
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute top-4 left-6 flex gap-4"
              >
                <Cloud className="w-16 h-10 text-slate-400 fill-current" />
                <Cloud className="w-24 h-14 text-slate-500 fill-current mt-2" />
              </motion.div>
              <motion.div 
                initial={{ x: 200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute top-10 right-12 flex gap-4"
              >
                <Cloud className="w-20 h-12 text-slate-500 fill-current" />
                <Cloud className="w-12 h-8 text-slate-400 fill-current mt-4" />
              </motion.div>
            </div>
          )}

          {/* B. DRASTIC DISASTER VISUALS FOR DROUGHT (CRACKED/BURN OVERLAYS) */}
          {weatherState === "Disaster" && activeDisaster === "Drought" && (
            <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4">
              {/* Cracked Soil Visual Texture Overlay */}
              <div className="absolute inset-0 opacity-20 border-4 border-[#eae3cb] bg-repeat pointer-events-none" 
                   style={{ 
                     backgroundImage: `url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=100&auto=format&fit=crop&q=60')`,
                     mixBlendMode: "multiply"
                   }} 
              />
              <div className="absolute inset-0 bg-[#ea5a5a]/20 pointer-events-none mix-blend-color-burn" />
              
              {/* Rising Heat Waves Wave representation */}
              <div className="w-full text-center bg-red-600/80 text-white border-2 border-black text-[10px] font-black rounded-lg py-1 animate-pulse">
                🏜️ 극심한 가뭄 발령: 축산 식품 소비 과다로 대지가 타고 있습니다! (물 가뭄 현상)
              </div>
            </div>
          )}

          {/* C. DRASTIC DISASTER VISUALS FOR FLOOD (WATERLOG OVERLAYS) */}
          {weatherState === "Disaster" && activeDisaster === "Flood" && (
            <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4">
              {/* Translucent rising water level overlay */}
              <div className="absolute inset-x-0 bottom-0 top-1/4 bg-[#55a8e6]/40 border-t-4 border-dashed border-blue-600 mix-blend-color" />
              <div className="absolute inset-0 bg-blue-900/10" />
              
              <div className="w-full text-center bg-blue-600/90 text-white border-2 border-black text-[10px] font-black rounded-lg py-1 animate-pulse">
                🌊 기후 홍수 경보: 플라스틱 쓰레기 및 가공 가공품 영향으로 마을이 잠기고 있습니다!
              </div>
            </div>
          )}

          {/* D. SUNNY WEATHER VISUAL (GLOWING RAYS / SUNBURST) */}
          {weatherState === "Sunny" && (
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
              <div className="absolute top-6 right-6 w-16 h-16 bg-[#ffd166] rounded-full border-3 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] animate-pulse flex items-center justify-center text-xl">
                ☀️
              </div>
              {/* Flowing sparkles */}
              <div className="absolute top-12 right-24 text-amber-600 opacity-60 text-xs animate-bounce">✨</div>
              <div className="absolute top-36 left-16 text-emerald-600 opacity-60 text-xs animate-bounce" style={{ animationDelay: "0.5s" }}>🌸</div>
            </div>
          )}

          {/* Base Grid Playground (Isometric-like placement) */}
          <div className="absolute inset-0 z-0">
            {currentUser.placedItems.map((item) => (
              <div
                key={item.id}
                onPointerDown={(e) => handlePointerDown(e, item.id)}
                className={`absolute cursor-pointer select-none group ${
                  draggingItemId === item.id ? "" : "transition-all duration-300"
                } ${
                  isEditMode ? "hover:scale-105 active:scale-95" : ""
                }`}
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: `translate(-50%, -50%)`,
                  touchAction: "none"
                }}
              >
                {/* Visual guideline when dragging or editing */}
                {isEditMode && (
                  <div className={`absolute -inset-4 border-2 border-dashed rounded-full ${
                    draggingItemId === item.id ? "border-emerald-500 animate-spin bg-emerald-50/20" : "border-black/30 bg-black/5"
                  }`} 
                  style={{ animationDuration: "10s" }}
                  />
                )}

                {/* The beautiful custom visual SVG renderer (NO label texts underneath!) */}
                <VillageItemRenderer type={item.itemTypeId} size={76} />

                {/* Delete button (Edit Mode only) */}
                {isEditMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item.id, item.itemTypeId);
                    }}
                    className="absolute -top-3 -right-3 bg-[#ea5a5a] text-white border-2 border-black w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs hover:scale-110 active:scale-90 shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                  >
                    ✕
                  </button>
                )}

                {/* Tiny move dragging icon */}
                {isEditMode && (
                  <div className="absolute -bottom-2 -left-2 bg-emerald-200 border-2 border-black w-5 h-5 rounded flex items-center justify-center shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                    <Move className="w-3 h-3 text-emerald-900" />
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* 3 Main Action Hub Buttons */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          
          {/* Shop button */}
          <button
            onClick={() => setShowShop(true)}
            className="comic-button py-4 text-lg font-black flex flex-col items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-7 h-7 text-white" />
            에코 상점
          </button>

          {/* Receipt analysis scanner button */}
          <button
            onClick={() => setShowScanner(true)}
            className="comic-button py-4 text-lg font-black bg-[#4ca64c] hover:bg-[#3d8c3d] flex flex-col items-center justify-center gap-1.5 animate-pulse"
          >
            <Camera className="w-7 h-7 text-white animate-bounce" />
            영수증 촬영/분석
          </button>

          {/* History / metrics logs button */}
          <button
            onClick={() => setShowHistory(true)}
            className="comic-button py-4 text-lg font-black bg-[#55a8e6] hover:bg-[#3fa0ea] flex flex-col items-center justify-center gap-1.5"
          >
            <PieChart className="w-7 h-7 text-white" />
            카테고리별 분석
          </button>

        </div>

        {/* Right side floating edit control toolbox */}
        <div className="absolute bottom-24 right-4 z-25 flex flex-col gap-2">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`comic-border-sm p-3 font-black text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] active:translate-y-[1px] ${
              isEditMode 
                ? "bg-amber-400 text-black border-black" 
                : "bg-white text-gray-700 hover:bg-[#eae3cb]"
            }`}
          >
            <Move className={`w-4 h-4 ${isEditMode ? "animate-spin" : ""}`} />
            {isEditMode ? "💾 편집 완료" : "🛠️ 마을 편집 / 이동"}
          </button>
        </div>

      </div>

      {/* 4. SEPARATE FULL WINDOW / OVERLAY INJECTIONS FOR PANELS */}
      
      {/* A. Shop (Takes over entire screen as requested!) */}
      {showShop && (
        <Shop
          userPoints={currentUser.points}
          onBuyItem={handleBuyItem}
          onClose={() => setShowShop(false)}
        />
      )}

      {/* B. Receipt Scanner */}
      {showScanner && (
        <ReceiptScanner
          pastReceipts={currentUser.scannedReceipts}
          onAddReceiptRecord={handleAddReceiptRecord}
          onAnalysisComplete={(result) => {
            // Keep scanner open so they see the result report, they can close it manually
          }}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* C. History Analytics */}
      {showHistory && (
        <ReceiptHistory
          receipts={currentUser.scannedReceipts}
          onClose={() => setShowHistory(false)}
        />
      )}

      {/* D. Settings */}
      {showSettings && (
        <Settings
          user={currentUser}
          onLogout={handleLogout}
          onResetVillage={handleResetVillage}
          onClose={() => setShowSettings(false)}
        />
      )}

    </div>
  );
}
