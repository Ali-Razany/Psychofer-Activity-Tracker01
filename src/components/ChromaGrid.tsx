import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Icon } from '@iconify/react';

export interface ChromaGridItem {
  image: string;
  title: string;
  subtitle: string;
  handle?: string;
  borderColor: string;
  gradient: string;
  url?: string;
  points?: number;
  badges?: any[];
  onClick?: () => void;
}

export interface ChromaGridProps {
  items: ChromaGridItem[];
  radius?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
}

const ChromaGridItemCard: React.FC<{ item: ChromaGridItem, mouseX: any, mouseY: any, radius?: number }> = ({ item, mouseX, mouseY, radius = 300 }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: 0, top: 0, width: 0, height: 0 });

  useEffect(() => {
    const updatePosition = () => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setPosition({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
      }
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  const distance = useTransform([mouseX, mouseY], ([x, y]: any[]) => {
    const centerX = position.left + position.width / 2;
    const centerY = position.top + position.height / 2;
    const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    return dist;
  });

  const opacity = useTransform(distance, [0, radius], [1, 0]);
  const background = useTransform(opacity, (o) => `radial-gradient(circle at center, ${item.borderColor}33 0%, transparent ${o * 100}%)`);

  return (
    <div 
      ref={cardRef}
      onClick={item.onClick}
      className="relative rounded-3xl overflow-hidden group border border-neutral-200 bg-white transition-all cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 transform duration-300"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{ background, opacity }}
      />
      
      <div className="relative z-10 p-3 sm:p-6 flex flex-col items-center text-center h-full">
        <div 
          className="w-16 h-16 sm:w-24 sm:h-24 rounded-full p-1 mb-2 sm:mb-4"
          style={{ background: item.gradient }}
        >
          {item.image ? (
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover rounded-full border-2 border-white bg-white"
            />
          ) : (
            <div className="w-full h-full rounded-full border-2 border-white bg-neutral-100 flex items-center justify-center">
              <Icon icon="hugeicons:user" className="text-[24px] sm:text-[40px] text-neutral-400" />
            </div>
          )}
        </div>
        <h3 className="text-[12px] sm:text-[14px] md:text-lg font-bold text-neutral-800 line-clamp-1">{item.title}</h3>
        <p className="text-[10px] sm:text-[12px] md:text-sm font-medium text-neutral-500 mb-1 line-clamp-1">{item.subtitle}</p>
        {item.handle && <p className="text-[10px] sm:text-xs text-neutral-400 mb-2 sm:mb-4 line-clamp-1">{item.handle}</p>}
        
        <div className="mt-auto flex items-center justify-center gap-1 sm:gap-3 pt-2 sm:pt-4 flex-wrap">
           {item.points !== undefined && (
             <div className="flex items-center gap-0.5 sm:gap-1 bg-amber-50 text-amber-700 px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-sm font-bold border border-amber-200">
               <Icon icon="hugeicons:star" className="text-[12px] sm:text-[16px]" />
               {item.points}
             </div>
           )}
           {item.badges && item.badges.length > 0 && (
             <div className="flex items-center gap-0.5 sm:gap-1 bg-pink-50 text-pink-700 px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-sm font-bold border border-pink-200">
               <Icon icon="hugeicons:medal-01" width={16} />
               {item.badges.length}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default function ChromaGrid({ items, radius = 300, damping = 0.45, fadeOut = 0.6, ease = "power3.out" }: ChromaGridProps) {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springConfig = { damping: damping * 100, stiffness: 200, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const handleMouseLeave = () => {
    mouseX.set(-1000);
    mouseY.set(-1000);
  };

  return (
    <div 
      className="w-full relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 relative z-10">
        {items.map((item, idx) => (
          <ChromaGridItemCard 
            key={idx} 
            item={item} 
            mouseX={smoothMouseX} 
            mouseY={smoothMouseY} 
            radius={radius}
          />
        ))}
      </div>
    </div>
  );
}
