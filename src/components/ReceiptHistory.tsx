import React, { useState } from "react";
import { ReceiptRecord, AnalyzedItem } from "../types";
import { Receipt, Calendar, Award, FileText, ChevronDown, ChevronUp, BarChart2, CheckCircle2 } from "lucide-react";

interface ReceiptHistoryProps {
  receipts: ReceiptRecord[];
  onClose: () => void;
}

export const ReceiptHistory: React.FC<ReceiptHistoryProps> = ({ receipts, onClose }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Compute stats
  const totalScanned = receipts.length;
  
  // Flatten all items across all receipts
  const allItems: AnalyzedItem[] = receipts.flatMap((r) => r.items);
  const totalItemsCount = allItems.length;

  const redCount = allItems.filter((item) => item.category === "Red").length;
  const yellowCount = allItems.filter((item) => item.category === "Yellow").length;
  const greenCount = allItems.filter((item) => item.category === "Green").length;

  // Percentage calculations
  const redPercent = totalItemsCount > 0 ? Math.round((redCount / totalItemsCount) * 100) : 0;
  const yellowPercent = totalItemsCount > 0 ? Math.round((yellowCount / totalItemsCount) * 100) : 0;
  const greenPercent = totalItemsCount > 0 ? Math.round((greenCount / totalItemsCount) * 100) : 0;

  const averageScore = receipts.length > 0 
    ? Math.round(receipts.reduce((acc, curr) => acc + curr.finalScore, 0) / receipts.length)
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
      <div className="comic-card w-full max-w-3xl bg-[#faf6ed] p-6 max-h-[90vh] overflow-y-auto flex flex-col relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-black hover:scale-110 transition-transform text-2xl font-bold bg-[#eae3cb] w-10 h-10 rounded-full flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
        >
          ✕
        </button>

        <h2 className="text-3xl font-black text-center mb-1 text-emerald-800">📊 나의 영수증 분석 리포트</h2>
        <p className="text-center text-sm text-gray-600 mb-6 font-doodle">
          지금껏 제출된 영수증 총합 및 기후 영향도를 분석한 통계 자료입니다.
        </p>

        {totalScanned === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Receipt className="w-16 h-16 text-gray-400 mb-4 animate-bounce" />
            <h3 className="text-lg font-bold mb-1">분석된 영수증이 존재하지 않습니다.</h3>
            <p className="text-xs text-gray-500 max-w-xs leading-relaxed font-doodle">
              메인 화면에서 '영수증 촬영/분석' 버튼을 눌러 영수증을 제출해 보세요!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            
            {/* Quick summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border-2 border-black p-3 rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center gap-3">
                <div className="bg-emerald-100 p-2.5 rounded-lg border-2 border-black">
                  <FileText className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold">누적 분석 횟수</span>
                  <span className="text-xl font-black text-black">{totalScanned}개</span>
                </div>
              </div>

              <div className="bg-white border-2 border-black p-3 rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center gap-3">
                <div className="bg-amber-100 p-2.5 rounded-lg border-2 border-black">
                  <Award className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold">평균 탄소 기후 점수</span>
                  <span className="text-xl font-black text-black">{averageScore}점</span>
                </div>
              </div>

              <div className="bg-white border-2 border-black p-3 rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center gap-3">
                <div className="bg-blue-100 p-2.5 rounded-lg border-2 border-black">
                  <Receipt className="w-6 h-6 text-blue-700" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold font-game">전체 품목 구매수</span>
                  <span className="text-xl font-black text-black">{totalItemsCount}개</span>
                </div>
              </div>
            </div>

            {/* Custom Pie/Distribution Chart */}
            <div className="bg-white border-3 border-black p-4 rounded-xl comic-border-sm">
              <h3 className="font-black text-lg mb-4 text-emerald-900 flex items-center gap-1.5">
                <BarChart2 className="w-5 h-5" /> 누적 식품 구매 카테고리 기여도
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                
                {/* Visual donut diagram */}
                <div className="flex justify-center relative">
                  <svg width="180" height="180" viewBox="0 0 100 100" className="transform -rotate-90">
                    {/* Background circle */}
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f3f5" strokeWidth="15" />
                    
                    {/* Green slice */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#4ca64c"
                      strokeWidth="15"
                      strokeDasharray={`${greenPercent * 2.51} 251`}
                      strokeDashoffset="0"
                      className="transition-all duration-1000"
                    />
                    
                    {/* Yellow slice */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#f6c84c"
                      strokeWidth="15"
                      strokeDasharray={`${yellowPercent * 2.51} 251`}
                      strokeDashoffset={`-${greenPercent * 2.51}`}
                      className="transition-all duration-1000"
                    />

                    {/* Red slice */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#ea5a5a"
                      strokeWidth="15"
                      strokeDasharray={`${redPercent * 2.51} 251`}
                      strokeDashoffset={`-${(greenPercent + yellowPercent) * 2.51}`}
                      className="transition-all duration-1000"
                    />
                    
                    {/* Inner cutout for donut look */}
                    <circle cx="50" cy="50" r="32" fill="#ffffff" stroke="#000000" strokeWidth="2.5" />
                  </svg>
                  
                  {/* Center metrics labels */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] text-gray-400 font-bold leading-tight">가장 높은 비율</span>
                    <span className="text-lg font-black text-emerald-800 leading-none">
                      {greenPercent >= Math.max(redPercent, yellowPercent) ? "Green (저탄소)" : 
                       yellowPercent >= redPercent ? "Yellow (보통)" : "Red (고탄소)"}
                    </span>
                  </div>
                </div>

                {/* Legend list with counts */}
                <div className="flex flex-col gap-3">
                  {/* Green */}
                  <div className="flex flex-col gap-1 p-2 bg-green-50/50 border-2 border-green-600 rounded-lg">
                    <div className="flex justify-between items-center text-xs font-black text-green-900">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 bg-[#4ca64c] border border-black rounded" />
                        Green 등급 (저탄소/친환경)
                      </span>
                      <span>{greenCount}개 ({greenPercent}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden border border-black">
                      <div className="bg-[#4ca64c] h-full" style={{ width: `${greenPercent}%` }}></div>
                    </div>
                  </div>

                  {/* Yellow */}
                  <div className="flex flex-col gap-1 p-2 bg-yellow-50/40 border-2 border-yellow-500 rounded-lg">
                    <div className="flex justify-between items-center text-xs font-black text-yellow-900">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 bg-[#f6c84c] border border-black rounded" />
                        Yellow 등급 (중간/일반식품)
                      </span>
                      <span>{yellowCount}개 ({yellowPercent}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden border border-black">
                      <div className="bg-[#f6c84c] h-full" style={{ width: `${yellowPercent}%` }}></div>
                    </div>
                  </div>

                  {/* Red */}
                  <div className="flex flex-col gap-1 p-2 bg-red-50/50 border-2 border-red-500 rounded-lg">
                    <div className="flex justify-between items-center text-xs font-black text-red-900">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 bg-[#ea5a5a] border border-black rounded" />
                        Red 등급 (초고배출/메탄육류)
                      </span>
                      <span>{redCount}개 ({redPercent}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden border border-black">
                      <div className="bg-[#ea5a5a] h-full" style={{ width: `${redPercent}%` }}></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Past list of receipts */}
            <div className="flex-1 flex flex-col gap-3">
              <h3 className="font-black text-lg text-emerald-900">📜 누적 영수증 상세 이력 ({totalScanned}건)</h3>
              
              <div className="flex flex-col gap-3 overflow-y-auto max-h-[300px] pr-2">
                {receipts.map((record) => {
                  const isExpanded = expandedId === record.id;
                  return (
                    <div key={record.id} className="bg-white border-2 border-black rounded-xl p-3 shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all">
                      <div 
                        onClick={() => toggleExpand(record.id)}
                        className="flex justify-between items-center cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-[#eae3cb] p-2 rounded-lg border border-black">
                            <Calendar className="w-5 h-5 text-[#2e6244]" />
                          </div>
                          <div>
                            <h4 className="font-black text-sm text-gray-800">{record.storeName}</h4>
                            <p className="text-[10px] text-gray-400">
                              분석일시: {record.transactionDate} | 승인번호: {record.approvalNumber}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-xs font-black text-amber-700 block">+{record.pointsEarned} P</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-black text-white ${
                              record.finalScore >= 80 ? "bg-green-600" :
                              record.finalScore >= 40 ? "bg-yellow-500" :
                              "bg-red-600"
                            }`}>
                              Score: {record.finalScore}점
                            </span>
                          </div>
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>

                      {/* Expanded table details */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-dashed border-gray-300 animate-in slide-in-from-top duration-200">
                          <span className="text-xs font-black text-gray-500 block mb-2">📋 상세 식품 분석 목록:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {record.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center p-1.5 border border-black bg-neutral-50 rounded text-xs">
                                <span className="font-bold truncate">{item.name}</span>
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-black text-white ${
                                    item.category === "Green" ? "bg-green-600" :
                                    item.category === "Yellow" ? "bg-yellow-500" :
                                    "bg-red-600"
                                  }`}>
                                    {item.category === "Green" ? "저탄소" : item.category === "Yellow" ? "보통" : "고탄소"}
                                  </span>
                                  <span className={`font-black ${item.score_impact >= 0 ? "text-green-600" : "text-red-600"}`}>
                                    {item.score_impact >= 0 ? `+${item.score_impact}` : item.score_impact}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
