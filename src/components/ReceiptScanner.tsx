import React, { useState, useRef } from "react";
import { ReceiptAnalysisResult, ReceiptRecord } from "../types";
import { Upload, Camera, FileText, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

interface ReceiptScannerProps {
  onAnalysisComplete: (result: ReceiptAnalysisResult) => void;
  pastReceipts: ReceiptRecord[];
  onAddReceiptRecord: (record: ReceiptRecord) => void;
  onClose: () => void;
}

// Pre-defined sample receipt templates for immediate, hassle-free testing
const MOCK_RECEIPT_TEMPLATES = [
  {
    name: "🥩 한우 축산 마트 영수증 (가뭄 유발 고탄소)",
    imagePlaceholder: "https://images.unsplash.com/photo-1544025162-d76694265947?w=100&auto=format&fit=crop&q=60",
    description: "소고기와 가공 치즈, 수입산 커피를 가득 사서 높은 메탄 발생 및 가뭄 재해를 유발하는 영수증 예시입니다.",
    promptHint: "소고기 수입산, 체다치즈 슬라이스, 수입 가공 커피 원두 구매 내역을 가진 마트 영수증"
  },
  {
    name: "🍏 농협 로컬푸드 마트 영수증 (맑음 유발 친환경)",
    imagePlaceholder: "https://images.unsplash.com/photo-1610348725531-843dff14a9da?w=100&auto=format&fit=crop&q=60",
    description: "국산 두부, 로컬푸드 사과, 감자, 시금치를 가득 사서 탄소를 저감하고 맑은 날씨를 유발하는 친환경 영수증 예시입니다.",
    promptHint: "국내산 완두콩, 친환경 국산 감자, 국산 두부, 로컬 사과가 포함된 농협 로컬푸드 마켓 영수증"
  },
  {
    name: "🛒 이마트 공산품 영수증 (홍수 유발 플라스틱)",
    imagePlaceholder: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=60",
    description: "돼지고기와 함께 대량의 비닐봉지, 일회용 컵, 가공 초콜릿을 구매하여 홍수 재해를 유발하는 영수증 예시입니다.",
    promptHint: "수입산 초콜릿, 삼겹살, 일회용 비닐 쓰레기봉투, 일회용 플라스틱 컵이 포함된 이마트 영수증"
  }
];

export const ReceiptScanner: React.FC<ReceiptScannerProps> = ({
  onAnalysisComplete,
  pastReceipts,
  onAddReceiptRecord,
  onClose
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ReceiptAnalysisResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert File to Base64
  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드할 수 있습니다.");
      return;
    }
    setError(null);
    setWarning(null);
    setAnalysisResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(reader.result as string);
    };
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => {
    setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Submit the real/mock image to our Express server
  const handleAnalyze = async (customImageBase64?: string, isTemplate: boolean = false, templateName?: string) => {
    const targetImage = customImageBase64 || image;
    if (!targetImage) {
      setError("분석할 이미지를 업로드하거나 선택해 주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    setWarning(null);
    setLoadingStep("영수증 이미지에서 텍스트 인식 중...");

    try {
      // Simulate receipt steps to give a cute retro game vibe
      setTimeout(() => setLoadingStep("Our World in Data 탄소 배출 등급 분류 중..."), 1200);
      setTimeout(() => setLoadingStep("빌리지 에코 점수 및 상점 포인트 계산 중..."), 2500);

      const response = await fetch("/api/receipt/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: targetImage, templateName }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "영수증 분석에 실패했습니다.");
      }

      const result: ReceiptAnalysisResult = data;

      // Anti-abuse Check: Duplicate check based on store name, date, and approval number
      const isDuplicate = pastReceipts.some(
        (r) =>
          r.storeName === result.metadata.store_name &&
          r.transactionDate === result.metadata.transaction_date &&
          r.approvalNumber === result.metadata.approval_number &&
          result.metadata.approval_number !== "UNKNOWN"
      );

      if (isDuplicate) {
        setWarning(`⚠️ [중복 등록 감지] '${result.metadata.store_name}'에서 결제된 영수증(승인번호: ${result.metadata.approval_number})은 이미 한 번 등록되어 기후 점수가 분석된 영수증입니다! 어뷰징 방지를 위해 포인트 지급 및 날씨 변화는 반영되지 않으나, 세부 내역은 확인하실 수 있습니다.`);
        setAnalysisResult(result);
        setLoading(false);
        return;
      }

      // Successfully unique receipt -> Create and add past record
      const newRecord: ReceiptRecord = {
        id: result.metadata.approval_number !== "UNKNOWN" ? result.metadata.approval_number : `TX_${Date.now()}`,
        storeName: result.metadata.store_name,
        transactionDate: result.metadata.transaction_date,
        approvalNumber: result.metadata.approval_number,
        items: result.analyzed_items,
        finalScore: result.scoring.final_score,
        pointsEarned: result.scoring.points_earned_or_lost,
        scannedAt: new Date().toLocaleDateString()
      };

      // Set states
      setAnalysisResult(result);
      onAddReceiptRecord(newRecord);
      onAnalysisComplete(result);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "서버 통신 중 알 수 없는 에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // Quick simulation helper using high quality mock image templates (they have preset base64 or prompts)
  const handleSimulateTemplate = async (templateName: string, promptHint: string) => {
    setImage(null);
    setAnalysisResult(null);
    setError(null);
    setWarning(null);
    setLoading(true);
    setLoadingStep(`[샘플 영수증] '${templateName}' 생성 중...`);

    try {
      // We will ask Gemini to generate content with a simulated text receipt matching the description
      setTimeout(() => setLoadingStep("Simulating OCR matching real receipt text..."), 1000);
      
      // Let's call the server with a text trigger or let the server prompt Gemini using a simulated canvas layout!
      // To ensure Gemini gives a beautiful authentic receipt, we can generate a simple canvas with receipt-like visual text on the client
      // or we can pass a preset high-quality Base64 receipt style canvas!
      // Let's generate a beautiful mock receipt canvas right here and send it! This is extremely robust and acts exactly like a real upload!
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 600;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Draw receipt background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 400, 600);
        
        // Draw cute doodle dashed line
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(10, 50); ctx.lineTo(390, 50);
        ctx.moveTo(10, 550); ctx.lineTo(390, 550);
        ctx.stroke();
        ctx.setLineDash([]);

        // Write cute mock text
        ctx.fillStyle = "#222222";
        ctx.font = "bold 18px monospace";
        ctx.fillText(templateName.includes("농협") ? "NONGHYUP LOCAL FOOD" : (templateName.includes("한우") ? "HANWOO MEAT MART" : "EMART STORE"), 40, 90);
        
        ctx.font = "14px monospace";
        ctx.fillText(`TRANS DATE : 2026-07-16 ${new Date().toLocaleTimeString().slice(0, 5)}`, 40, 130);
        ctx.fillText(`APPROVAL NO: APP-77${Math.floor(Math.random() * 8999 + 1000)}`, 40, 160);
        ctx.fillText("----------------------------------", 40, 190);
        
        if (templateName.includes("농협")) {
          ctx.fillText("국산 꿀사과 (Domestic Apple)      5,900", 40, 220);
          ctx.fillText("친환경 햇감자 (Domestic Potato)   3,200", 40, 250);
          ctx.fillText("국산 무농약 두부 (Local Tofu)     1,800", 40, 280);
          ctx.fillText("로컬푸드 완두콩 (Peas)            2,400", 40, 310);
        } else if (templateName.includes("한우")) {
          ctx.fillText("한우 꽃등심 1등급 (Beef Import)  48,000", 40, 220);
          ctx.fillText("수입산 가공 슬라이스 치즈         4,200", 40, 250);
          ctx.fillText("브라질산 프리미엄 커피 원두      15,000", 40, 280);
        } else {
          ctx.fillText("국산 삼겹살 500g                 14,000", 40, 220);
          ctx.fillText("일회용 비닐 쓰레기봉투            1,200", 40, 250);
          ctx.fillText("수입 초콜릿 바                    2,500", 40, 280);
          ctx.fillText("일회용 플라스틱 테이크아웃 컵     3,000", 40, 310);
        }
        
        ctx.fillText("----------------------------------", 40, 360);
        ctx.font = "bold 16px monospace";
        ctx.fillText("TOTAL AMOUNT : " + (templateName.includes("농협") ? "13,300 KRW" : templateName.includes("한우") ? "67,200 KRW" : "20,700 KRW"), 40, 400);
      }

      const base64Data = canvas.toDataURL("image/png");
      setImage(base64Data);
      
      // Call analyze
      await handleAnalyze(base64Data, true, templateName);

    } catch (err: any) {
      setError(err.message || "샘플 영수증 시뮬레이션에 실패했습니다.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="comic-card w-full max-w-2xl bg-[#faf6ed] p-6 max-h-[90vh] overflow-y-auto flex flex-col relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-black hover:scale-110 transition-transform text-2xl font-bold bg-[#eae3cb] w-10 h-10 rounded-full flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
        >
          ✕
        </button>

        <h2 className="text-3xl font-black text-center mb-1 text-emerald-800">📸 영수증 탄소 분석기</h2>
        <p className="text-center text-sm text-gray-600 mb-6 font-doodle">
          실제 영수증 사진을 올리거나 모바일로 촬영해 보세요! 진짜 마트 이름과 품목을 완벽하게 인식합니다.
        </p>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 border-3 border-dashed border-black bg-white rounded-lg comic-border">
            <Loader2 className="w-16 h-16 animate-spin text-emerald-700 mb-6" />
            <h3 className="text-xl font-bold text-center mb-2">{loadingStep}</h3>
            <p className="text-xs text-gray-500 text-center animate-pulse">
              기후 재해 가뭄/홍수 상태를 실시간 시각 동기화하는 중입니다... 잠시만 기다려주세요!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            
            {/* Split layout: Upload field on left, quick testing on right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Drag & Drop Upload Zone */}
              <div 
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={triggerFileInput}
                className={`flex flex-col items-center justify-center p-6 border-3 border-dashed rounded-xl cursor-pointer transition-colors text-center ${
                  dragActive ? "border-emerald-700 bg-emerald-50" : "border-black hover:bg-orange-50 bg-white"
                } comic-border-sm`}
              >
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileChange}
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                />
                
                {image ? (
                  <div className="relative w-full max-h-40 overflow-hidden rounded-lg border-2 border-black mb-3">
                    <img src={image} alt="Receipt Upload" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                ) : (
                  <div className="bg-[#eae3cb] p-3 rounded-full border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] mb-3">
                    <Upload className="w-8 h-8 text-black" />
                  </div>
                )}
                
                <span className="font-bold text-base block mb-1">
                  {image ? "영수증 이미지 선택 완료!" : "영수증 사진 드래그 / 클릭"}
                </span>
                <span className="text-xs text-gray-500">
                  {image ? "사진을 바꾸려면 클릭하세요." : "카메라 촬영 및 파일 선택 가능"}
                </span>
              </div>

              {/* Sample testing options */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-black text-gray-700 flex items-center gap-1">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  간편 영수증 시뮬레이터 (추천):
                </span>
                <div className="flex flex-col gap-2">
                  {MOCK_RECEIPT_TEMPLATES.map((tpl, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSimulateTemplate(tpl.name, tpl.promptHint)}
                      className="text-left p-2 bg-white hover:bg-emerald-50 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] active:translate-y-[1px] transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <img src={tpl.imagePlaceholder} alt="" className="w-8 h-8 rounded border border-black object-cover" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-black truncate text-emerald-900">{tpl.name}</h4>
                          <p className="text-[10px] text-gray-500 truncate leading-tight">{tpl.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {image && (
              <button
                onClick={() => handleAnalyze()}
                className="comic-button w-full py-3 text-lg font-black bg-emerald-600 hover:bg-emerald-700"
              >
                ⚡ AI 영수증 분석 시작하기 (진짜 마트/품목 인식!)
              </button>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-3 border-red-500 text-red-900 p-4 rounded-lg flex items-start gap-3 comic-border-sm animate-bounce">
                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-sm">에러가 발생했습니다</h4>
                  <p className="text-xs">{error}</p>
                </div>
              </div>
            )}

            {/* Warning (Duplicate) */}
            {warning && (
              <div className="bg-amber-50 border-3 border-amber-500 text-amber-900 p-4 rounded-lg flex items-start gap-3 comic-border-sm">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-sm">중복 영수증 경고</h4>
                  <p className="text-xs">{warning}</p>
                </div>
              </div>
            )}

            {/* Analysis Results Display */}
            {analysisResult && (
              <div className="bg-white border-3 border-black p-4 rounded-xl comic-border-sm flex flex-col gap-4 animate-in slide-in-from-bottom duration-300">
                
                {/* Receipt Header info */}
                <div className="border-b-2 border-dashed border-black pb-3 flex justify-between items-center bg-gray-50 p-2 rounded">
                  <div>
                    <h3 className="font-black text-lg text-emerald-900">
                      🏢 {analysisResult.metadata.store_name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      일시: {analysisResult.metadata.transaction_date} | 승인번호: {analysisResult.metadata.approval_number}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 font-bold rounded-full text-xs border-2 border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] ${
                      analysisResult.scoring.final_score >= 80 ? "bg-green-200 text-green-900" :
                      analysisResult.scoring.final_score >= 40 ? "bg-yellow-200 text-yellow-900" :
                      "bg-red-200 text-red-900"
                    }`}>
                      Score: {analysisResult.scoring.final_score}점
                    </span>
                  </div>
                </div>

                {/* Items analyzed list */}
                <div>
                  <h4 className="font-black text-sm mb-2 text-gray-700">🛒 실시간 품목 친환경 분석:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {analysisResult.analyzed_items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 border-2 border-black bg-neutral-50 rounded-lg">
                        <span className="font-bold text-xs truncate max-w-[150px]">{item.name}</span>
                        <div className="flex items-center gap-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-black text-white ${
                            item.category === "Green" ? "bg-green-600" :
                            item.category === "Yellow" ? "bg-yellow-500" :
                            "bg-red-600"
                          }`}>
                            {item.category === "Green" ? "저탄소" : item.category === "Yellow" ? "보통" : "고탄소"}
                          </span>
                          <span className={`text-xs font-bold ${item.score_impact >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {item.score_impact >= 0 ? `+${item.score_impact}` : item.score_impact}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Game / point metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-amber-50/70 p-3 rounded-lg border-2 border-black">
                  <div>
                    <span className="text-xs text-gray-500 block">지급/차감 상점 포인트</span>
                    <span className="text-xl font-black text-amber-700">
                      {analysisResult.scoring.points_earned_or_lost > 0 ? "+" : ""}
                      {analysisResult.scoring.points_earned_or_lost} 에코 포인트
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">마을 기후 변화 예보</span>
                    <span className="text-base font-black flex items-center gap-1">
                      {analysisResult.game_village_status.weather === "Sunny" && "☀️ 맑고 투명함"}
                      {analysisResult.game_village_status.weather === "Cloudy" && "☁️ 서서히 먹구름이 낌"}
                      {analysisResult.game_village_status.weather === "Disaster" && (
                        <span className="text-red-600 animate-pulse font-black">
                          🚨 기후재해 ({analysisResult.game_village_status.active_disaster === "Drought" ? "가뭄 🏜️" : "홍수 🌊"})
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Warm generating alternative recommendations */}
                {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                  <div className="bg-emerald-50/50 p-3 rounded-lg border-2 border-black border-dashed">
                    <h5 className="text-xs font-black text-emerald-800 mb-1">🌱 에코 AI의 상냥한 친환경 추천:</h5>
                    <ul className="list-disc pl-4 text-[11px] text-gray-700 flex flex-col gap-1">
                      {analysisResult.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={onClose}
                  className="comic-button py-2 bg-[#eae3cb] hover:bg-[#dcd1b3] text-black font-black text-sm"
                >
                  확인하고 내 마을로 가기
                </button>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
