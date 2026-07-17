import React from "react";

interface VillageItemRendererProps {
  type: string;
  size?: number; // size in pixels
  className?: string;
}

export const VillageItemRenderer: React.FC<VillageItemRendererProps> = ({
  type,
  size = 64,
  className = ""
}) => {
  switch (type) {
    case "tree":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          {/* Trunk */}
          <path d="M45 65 L43 90 A 2 2 0 0 0 45 92 L55 92 A 2 2 0 0 0 57 90 L55 65 Z" fill="#8c5831" stroke="#000000" strokeWidth="2.5" />
          <path d="M47 68 L47 88" stroke="#5d371b" strokeWidth="2" strokeLinecap="round" />
          {/* Foliage (Cloudy Green shape) */}
          <path d="M50 15 
                   C32 15, 25 30, 32 43 
                   C20 45, 20 60, 32 63 
                   C42 66, 58 66, 68 63 
                   C80 60, 80 45, 68 43 
                   C75 30, 68 15, 50 15 Z" 
                fill="#4ca64c" stroke="#000000" strokeWidth="3" strokeLinejoin="round" />
          {/* Shadow/Highlights in foliage */}
          <path d="M45 22 C37 25, 33 34, 38 41 C31 46, 31 54, 39 56" fill="none" stroke="#2a662a" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M62 25 C68 28, 70 36, 66 42" fill="none" stroke="#7ad07a" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case "flower":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          {/* Stem & Leaves */}
          <path d="M50 50 L50 90" stroke="#2d6a4f" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M45 80 Q32 75, 48 70" fill="#40916c" stroke="#000000" strokeWidth="2" />
          <path d="M55 75 Q68 70, 52 65" fill="#40916c" stroke="#000000" strokeWidth="2" />
          
          {/* Flower 1 - Left */}
          <circle cx="35" cy="55" r="12" fill="#ea5a5a" stroke="#000000" strokeWidth="2" />
          <circle cx="35" cy="55" r="5" fill="#f6c84c" stroke="#000000" strokeWidth="1.5" />
          <path d="M35 55 L35 70" stroke="#2d6a4f" strokeWidth="2" />

          {/* Flower 2 - Middle (Big) */}
          <circle cx="50" cy="45" r="16" fill="#f6c84c" stroke="#000000" strokeWidth="2.5" />
          <circle cx="50" cy="45" r="6" fill="#8d5b4c" stroke="#000000" strokeWidth="2" />
          {/* Petal details */}
          <path d="M50 25 C45 35, 55 35, 50 25 Z" fill="#ffb703" />

          {/* Flower 3 - Right */}
          <circle cx="68" cy="58" r="10" fill="#55a8e6" stroke="#000000" strokeWidth="2" />
          <circle cx="68" cy="58" r="4" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
          <path d="M68 58 L65 78" stroke="#2d6a4f" strokeWidth="2" />
        </svg>
      );

    case "grass":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          {/* Ground patch */}
          <ellipse cx="50" cy="85" rx="35" ry="8" fill="#e1dbcb" />
          
          {/* Blade cluster 1 */}
          <path d="M30 85 Q22 55, 12 50 Q28 65, 33 85 Z" fill="#52b788" stroke="#000000" strokeWidth="2" strokeLinejoin="round" />
          <path d="M34 85 Q36 45, 30 35 Q40 55, 38 85 Z" fill="#74c69d" stroke="#000000" strokeWidth="2" strokeLinejoin="round" />

          {/* Blade cluster 2 */}
          <path d="M50 85 Q52 40, 48 25 Q58 50, 53 85 Z" fill="#40916c" stroke="#000000" strokeWidth="2" strokeLinejoin="round" />
          <path d="M52 85 Q65 45, 75 40 Q63 60, 56 85 Z" fill="#52b788" stroke="#000000" strokeWidth="2" strokeLinejoin="round" />

          {/* Blade cluster 3 */}
          <path d="M68 85 Q78 60, 88 58 Q76 72, 71 85 Z" fill="#74c69d" stroke="#000000" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );

    case "pond":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          {/* Water body */}
          <path d="M15 60 C 15 35, 85 35, 85 60 C 85 85, 15 85, 15 60 Z" fill="#55a8e6" stroke="#000000" strokeWidth="3" />
          
          {/* Ripples */}
          <path d="M35 55 Q50 50, 65 55" fill="none" stroke="#2f7bb6" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M28 67 Q50 63, 72 67" fill="none" stroke="#2f7bb6" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M42 75 Q50 73, 58 75" fill="none" stroke="#2f7bb6" strokeWidth="2" strokeLinecap="round" />

          {/* Stones border */}
          <circle cx="16" cy="55" r="6" fill="#8e9aaf" stroke="#000000" strokeWidth="2" />
          <circle cx="26" cy="42" r="5" fill="#cbc0d3" stroke="#000000" strokeWidth="2" />
          <circle cx="40" cy="38" r="7" fill="#8e9aaf" stroke="#000000" strokeWidth="2" />
          <circle cx="58" cy="39" r="6" fill="#cbc0d3" stroke="#000000" strokeWidth="2" />
          <circle cx="74" cy="45" r="7" fill="#8e9aaf" stroke="#000000" strokeWidth="2" />
          <circle cx="84" cy="58" r="6" fill="#cbc0d3" stroke="#000000" strokeWidth="2" />
          <circle cx="80" cy="72" r="8" fill="#8e9aaf" stroke="#000000" strokeWidth="2" />
          <circle cx="65" cy="80" r="5" fill="#cbc0d3" stroke="#000000" strokeWidth="2" />
          <circle cx="48" cy="83" r="7" fill="#8e9aaf" stroke="#000000" strokeWidth="2" />
          <circle cx="31" cy="79" r="6" fill="#cbc0d3" stroke="#000000" strokeWidth="2" />
          <circle cx="20" cy="70" r="7" fill="#8e9aaf" stroke="#000000" strokeWidth="2" />

          {/* Floating leaf */}
          <path d="M60 62 C50 65, 52 52, 60 62 Z" fill="#74c69d" stroke="#000000" strokeWidth="1.5" />
        </svg>
      );

    case "fountain":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          {/* Base Pool */}
          <ellipse cx="50" cy="82" rx="38" ry="12" fill="#adb5bd" stroke="#000000" strokeWidth="2.5" />
          <ellipse cx="50" cy="82" rx="30" ry="8" fill="#55a8e6" />
          
          {/* Lower Pillar */}
          <path d="M45 80 L42 50 L58 50 L55 80 Z" fill="#6c757d" stroke="#000000" strokeWidth="2.5" />

          {/* Middle Basin */}
          <ellipse cx="50" cy="50" rx="25" ry="8" fill="#adb5bd" stroke="#000000" strokeWidth="2.5" />
          <ellipse cx="50" cy="50" rx="19" ry="5" fill="#55a8e6" />

          {/* Upper Pillar */}
          <path d="M47 50 L45 28 L55 28 L53 50 Z" fill="#6c757d" stroke="#000000" strokeWidth="2" />

          {/* Top Basin */}
          <ellipse cx="50" cy="28" rx="14" ry="5" fill="#adb5bd" stroke="#000000" strokeWidth="2" />

          {/* Water Streams */}
          <path d="M50 24 Q50 10, 32 46 Q24 75, 40 80" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <path d="M50 24 Q50 10, 68 46 Q76 75, 60 80" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <path d="M50 24 Q40 14, 38 46" fill="none" stroke="#a2d2ff" strokeWidth="2" strokeLinecap="round" />
          <path d="M50 24 Q60 14, 62 46" fill="none" stroke="#a2d2ff" strokeWidth="2" strokeLinecap="round" />
          
          {/* Water Splashes at the bottom */}
          <circle cx="34" cy="80" r="3" fill="#ffffff" />
          <circle cx="66" cy="80" r="3" fill="#ffffff" />
          <circle cx="50" cy="81" r="2" fill="#ffffff" />
        </svg>
      );

    case "mailbox":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          {/* Post */}
          <rect x="46" y="55" width="8" height="35" fill="#8c5831" stroke="#000000" strokeWidth="2.5" />
          <line x1="46" y1="65" x2="54" y2="65" stroke="#5d371b" strokeWidth="1.5" />
          <line x1="46" y1="78" x2="54" y2="78" stroke="#5d371b" strokeWidth="1.5" />

          {/* Box Body */}
          <path d="M30 45 C30 25, 70 25, 70 45 L70 55 L30 55 Z" fill="#ea5a5a" stroke="#000000" strokeWidth="3" />
          
          {/* Mail Door / Front Grid */}
          <ellipse cx="50" cy="45" rx="14" ry="14" fill="#c13e3e" stroke="#000000" strokeWidth="2" />
          
          {/* Mail Flag */}
          <path d="M70 48 L82 48 L82 32 L78 32 L78 44 Z" fill="#ffb703" stroke="#000000" strokeWidth="2" />
          <rect x="76" y="28" width="10" height="6" fill="#ea5a5a" stroke="#000000" strokeWidth="1.5" />

          {/* Tiny Letter sticking out */}
          <rect x="42" y="42" width="16" height="10" fill="#ffffff" stroke="#000000" strokeWidth="1.5" transform="rotate(-10 50 45)" />
          <line x1="45" y1="47" x2="55" y2="45" stroke="#000000" strokeWidth="1" />
        </svg>
      );

    case "small_house":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          {/* Base Structure */}
          <rect x="25" y="45" width="50" height="40" fill="#fdf0d5" stroke="#000000" strokeWidth="3" />

          {/* Roof */}
          <polygon points="18,48 50,18 82,48" fill="#c1121f" stroke="#000000" strokeWidth="3" strokeLinejoin="round" />

          {/* Solar Panel on the Roof */}
          <polygon points="44,28 58,28 66,40 36,40" fill="#3a86c8" stroke="#000000" strokeWidth="2" />
          <line x1="50" y1="28" x2="51" y2="40" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="40" y1="34" x2="62" y2="34" stroke="#ffffff" strokeWidth="1" />

          {/* Window */}
          <rect x="33" y="55" width="12" height="12" fill="#90e0ef" stroke="#000000" strokeWidth="2" />
          <line x1="39" y1="55" x2="39" y2="67" stroke="#000000" strokeWidth="1.5" />
          <line x1="33" y1="61" x2="45" y2="61" stroke="#000000" strokeWidth="1.5" />

          {/* Door */}
          <rect x="54" y="55" width="14" height="30" fill="#780000" stroke="#000000" strokeWidth="2.5" />
          <circle cx="58" cy="70" r="1.5" fill="#ffb703" />
        </svg>
      );

    case "house":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          {/* Main Wall */}
          <rect x="20" y="42" width="60" height="45" fill="#f4e3b1" stroke="#000000" strokeWidth="3" />

          {/* Red Roof */}
          <polygon points="12,45 50,12 88,45" fill="#d94040" stroke="#000000" strokeWidth="3" strokeLinejoin="round" />

          {/* Chimney */}
          <rect x="68" y="20" width="10" height="18" fill="#8c2e2e" stroke="#000000" strokeWidth="2.5" />
          <rect x="66" y="17" width="14" height="4" fill="#521d1d" stroke="#000000" strokeWidth="2" />
          {/* Smoke Puff */}
          <path d="M73 12 Q71 5, 77 2 Q83 5, 78 12 Z" fill="#cccccc" opacity="0.8" />

          {/* Two Windows */}
          <rect x="28" y="50" width="14" height="14" fill="#a2d2ff" stroke="#000000" strokeWidth="2" />
          <line x1="35" y1="50" x2="35" y2="64" stroke="#000000" strokeWidth="1.5" />
          <line x1="28" y1="57" x2="42" y2="57" stroke="#000000" strokeWidth="1.5" />

          <rect x="58" y="50" width="14" height="14" fill="#a2d2ff" stroke="#000000" strokeWidth="2" />
          <line x1="65" y1="50" x2="65" y2="64" stroke="#000000" strokeWidth="1.5" />
          <line x1="58" y1="57" x2="72" y2="57" stroke="#000000" strokeWidth="1.5" />

          {/* Door with green plants beside */}
          <rect x="44" y="57" width="12" height="30" fill="#5c3b21" stroke="#000000" strokeWidth="2.5" />
          <circle cx="47" cy="72" r="1.5" fill="#ffc300" />

          {/* Flower pot beside door */}
          <rect x="73" y="78" width="5" height="7" fill="#c38d5e" stroke="#000000" strokeWidth="1.5" />
          <circle cx="75" cy="74" r="3" fill="#4ca64c" />
        </svg>
      );

    case "large_house":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          {/* Main big structure */}
          <rect x="15" y="35" width="70" height="52" fill="#eae2b7" stroke="#000000" strokeWidth="3" />
          
          {/* Roof (Steep Gable/Modern solar roof) */}
          <polygon points="10,38 42,10 60,38" fill="#003049" stroke="#000000" strokeWidth="3" />
          <polygon points="52,38 75,14 90,38" fill="#003049" stroke="#000000" strokeWidth="3" />

          {/* Solar arrays on main roof */}
          <rect x="25" y="22" width="14" height="10" fill="#2a6f97" stroke="#ffffff" strokeWidth="1" transform="rotate(-30 25 22)" />

          {/* Balcony / Second floor */}
          <rect x="15" y="52" width="36" height="4" fill="#d62828" stroke="#000000" strokeWidth="2" />
          <line x1="18" y1="42" x2="18" y2="52" stroke="#000000" strokeWidth="1.5" />
          <line x1="26" y1="42" x2="26" y2="52" stroke="#000000" strokeWidth="1.5" />
          <line x1="34" y1="42" x2="34" y2="52" stroke="#000000" strokeWidth="1.5" />
          <line x1="42" y1="42" x2="42" y2="52" stroke="#000000" strokeWidth="1.5" />

          {/* Large Glass Sliding Door */}
          <rect x="20" y="60" width="22" height="27" fill="#caf0f8" stroke="#000000" strokeWidth="2.5" />
          <line x1="31" y1="60" x2="31" y2="87" stroke="#000000" strokeWidth="2" />

          {/* Double Windows */}
          <rect x="54" y="44" width="10" height="12" fill="#caf0f8" stroke="#000000" strokeWidth="2" />
          <rect x="68" y="44" width="10" height="12" fill="#caf0f8" stroke="#000000" strokeWidth="2" />

          {/* Main Entrance wooden door */}
          <rect x="58" y="62" width="16" height="25" fill="#7f5539" stroke="#000000" strokeWidth="2.5" />
          <circle cx="62" cy="74" r="2" fill="#ffb703" />

          {/* Wall greenery (Climbing Ivy) */}
          <path d="M78 87 Q83 75, 79 66 T84 55" fill="none" stroke="#38b000" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="79" cy="75" r="3" fill="#007200" />
          <circle cx="81" cy="65" r="3.5" fill="#007200" />
        </svg>
      );

    case "apartment":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          {/* Main High Building */}
          <rect x="25" y="15" width="50" height="75" fill="#ced4da" stroke="#000000" strokeWidth="3" />

          {/* Rooftop Garden Forest */}
          <path d="M28 15 C26 10, 36 6, 40 10 C42 6, 52 8, 55 12 C58 8, 68 8, 72 15 Z" fill="#2d6a4f" />
          <rect x="46" y="10" width="4" height="6" fill="#8c5831" />

          {/* Grid of Glowing Energy Windows */}
          {/* Row 1 */}
          <rect x="32" y="24" width="8" height="8" fill="#ffea00" stroke="#000000" strokeWidth="1.5" />
          <rect x="46" y="24" width="8" height="8" fill="#caf0f8" stroke="#000000" strokeWidth="1.5" />
          <rect x="60" y="24" width="8" height="8" fill="#ffea00" stroke="#000000" strokeWidth="1.5" />

          {/* Row 2 */}
          <rect x="32" y="38" width="8" height="8" fill="#caf0f8" stroke="#000000" strokeWidth="1.5" />
          <rect x="46" y="38" width="8" height="8" fill="#ffea00" stroke="#000000" strokeWidth="1.5" />
          <rect x="60" y="38" width="8" height="8" fill="#caf0f8" stroke="#000000" strokeWidth="1.5" />

          {/* Row 3 */}
          <rect x="32" y="52" width="8" height="8" fill="#ffea00" stroke="#000000" strokeWidth="1.5" />
          <rect x="46" y="52" width="8" height="8" fill="#caf0f8" stroke="#000000" strokeWidth="1.5" />
          <rect x="60" y="52" width="8" height="8" fill="#ffea00" stroke="#000000" strokeWidth="1.5" />

          {/* Row 4 */}
          <rect x="32" y="66" width="8" height="8" fill="#caf0f8" stroke="#000000" strokeWidth="1.5" />
          <rect x="46" y="66" width="8" height="8" fill="#caf0f8" stroke="#000000" strokeWidth="1.5" />
          <rect x="60" y="66" width="8" height="8" fill="#ffea00" stroke="#000000" strokeWidth="1.5" />

          {/* Main Entrance Portal */}
          <path d="M42 90 L42 80 C42 77, 58 77, 58 80 L58 90 Z" fill="#495057" stroke="#000000" strokeWidth="2" />
        </svg>
      );

    case "fence":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          {/* Ground link */}
          <line x1="5" y1="80" x2="95" y2="80" stroke="#000000" strokeWidth="3" />

          {/* Cross rails */}
          <rect x="5" y="42" width="90" height="6" fill="#c39b75" stroke="#000000" strokeWidth="2" />
          <rect x="5" y="65" width="90" height="6" fill="#c39b75" stroke="#000000" strokeWidth="2" />

          {/* Pickets */}
          <path d="M12 90 L12 25 L18 15 L24 25 L24 90 Z" fill="#e7c8a4" stroke="#000000" strokeWidth="2" />
          <path d="M34 90 L34 25 L40 15 L46 25 L46 90 Z" fill="#e7c8a4" stroke="#000000" strokeWidth="2" />
          <path d="M56 90 L56 25 L62 15 L68 25 L68 90 Z" fill="#e7c8a4" stroke="#000000" strokeWidth="2" />
          <path d="M78 90 L78 25 L84 15 L90 25 L90 90 Z" fill="#e7c8a4" stroke="#000000" strokeWidth="2" />

          {/* Small nails */}
          <circle cx="18" cy="45" r="1.5" fill="#333" />
          <circle cx="18" cy="68" r="1.5" fill="#333" />
          <circle cx="40" cy="45" r="1.5" fill="#333" />
          <circle cx="40" cy="68" r="1.5" fill="#333" />
          <circle cx="62" cy="45" r="1.5" fill="#333" />
          <circle cx="62" cy="68" r="1.5" fill="#333" />
          <circle cx="84" cy="45" r="1.5" fill="#333" />
          <circle cx="84" cy="68" r="1.5" fill="#333" />
        </svg>
      );

    case "street_light":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          {/* Base */}
          <path d="M40 90 L60 90 L55 82 L45 82 Z" fill="#343a40" stroke="#000000" strokeWidth="2.5" />
          
          {/* Tall Iron Pole */}
          <rect x="47" y="25" width="6" height="57" fill="#495057" stroke="#000000" strokeWidth="2" />

          {/* Decorative bracket */}
          <path d="M47 35 Q35 35, 47 45" fill="none" stroke="#000000" strokeWidth="2" />

          {/* Top light housing */}
          <path d="M40 25 L60 25 L55 12 L45 12 Z" fill="#343a40" stroke="#000000" strokeWidth="2.5" />

          {/* Glowing Glass Panel */}
          <polygon points="44,25 56,25 53,38 47,38" fill="#ffd166" stroke="#000000" strokeWidth="2" />

          {/* Glow effect */}
          <circle cx="50" cy="30" r="15" fill="#ffe3a8" opacity="0.45" />
        </svg>
      );

    case "bench":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          {/* Legs */}
          <rect x="18" y="55" width="6" height="35" fill="#212529" stroke="#000000" strokeWidth="2" />
          <rect x="76" y="55" width="6" height="35" fill="#212529" stroke="#000000" strokeWidth="2" />
          <rect x="24" y="70" width="52" height="4" fill="#212529" stroke="#000000" strokeWidth="1.5" />

          {/* Back rest support */}
          <path d="M18 55 L15 25 L21 25 L24 55 Z" fill="#212529" stroke="#000000" strokeWidth="2" />
          <path d="M76 55 L73 25 L79 25 L82 55 Z" fill="#212529" stroke="#000000" strokeWidth="2" />

          {/* Wooden seat planks */}
          <rect x="10" y="52" width="80" height="6" rx="2" fill="#b17a50" stroke="#000000" strokeWidth="2.5" />
          <rect x="14" y="59" width="72" height="5" rx="2" fill="#9c643c" stroke="#000000" strokeWidth="2" />

          {/* Back planks */}
          <rect x="10" y="27" width="80" height="7" rx="2" fill="#b17a50" stroke="#000000" strokeWidth="2.5" />
          <rect x="10" y="37" width="80" height="7" rx="2" fill="#b17a50" stroke="#000000" strokeWidth="2.5" />
        </svg>
      );

    default:
      return (
        <div style={{ width: size, height: size }} className="bg-emerald-100 flex items-center justify-center border border-black rounded text-xs">
          📦 {type}
        </div>
      );
  }
};
