export interface AnalyzedItem {
  name: string;
  category: "Red" | "Yellow" | "Green";
  score_impact: number;
}

export interface ReceiptMetadata {
  store_name: string;
  transaction_date: string;
  approval_number: string;
}

export interface ReceiptAnalysisResult {
  metadata: ReceiptMetadata;
  analyzed_items: AnalyzedItem[];
  scoring: {
    final_score: number;
    points_earned_or_lost: number;
  };
  game_village_status: {
    current_environment: "Wasteland" | "Developing" | "Forest";
    weather: "Sunny" | "Cloudy" | "Disaster";
    active_disaster: "None" | "Drought" | "Flood";
    disaster_visual_effect_trigger: boolean;
    shop_available: boolean;
    status_message: string;
  };
  recommendations: string[];
}

// Representing items in the village shop
export interface ShopItem {
  id: string;
  name: string;
  cost: number;
  category: "building" | "nature";
  description: string;
  // Visual render properties or type identifiers
  type: "tree" | "house" | "apartment" | "mailbox" | "small_house" | "large_house" | "pond" | "fountain" | "flower" | "grass" | "fence" | "street_light" | "bench";
}

// Placed item on the grid
export interface PlacedItem {
  id: string;
  itemTypeId: string;
  x: number; // percentage coordinate x (0-100) or pixels on canvas
  y: number; // percentage coordinate y (0-100) or pixels on canvas
}

// Past analyzed receipts list
export interface ReceiptRecord {
  id: string; // unique scan id (e.g. approvalNumber or timestamp)
  storeName: string;
  transactionDate: string;
  approvalNumber: string;
  items: AnalyzedItem[];
  finalScore: number;
  pointsEarned: number;
  scannedAt: string;
}

// Registered User structure in localStorage
export interface UserAccount {
  username: string;
  villageName: string;
  points: number;
  climateScore: number; // 0 to 1500+ (0-500: Drought, 501-1000: Cloudy, 1001+: Sunny)
  placedItems: PlacedItem[];
  scannedReceipts: ReceiptRecord[];
}
