import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Mock detections
const DETECTIONS = [
  { class: 'Person', conf: 0.98, color: '#10b981', type: 'biological' },
  { class: 'Obstacle', conf: 0.85, color: '#f59e0b', type: 'physical' },
  { class: 'Plant (Healthy)', conf: 0.92, color: '#3b82f6', type: 'biological' },
  { class: 'Weed', conf: 0.78, color: '#ef4444', type: 'biological' },
  { class: 'Tool', conf: 0.65, color: '#8b5cf6', type: 'physical' }
];

export default function VisionStream() {
  const [boxes, setBoxes] = useState<{id:string;class:string;conf:number;color:string;type:string;x:number;y:number;w:number;h:number}[]>([]);

  // Simulate real-time stream processing
  useEffect(() => {
    const generateBoxes = () => {
      const numBoxes = Math.floor(Math.random() * 3) + 1;
      const newBoxes = [];
      for (let i = 0; i < numBoxes; i++) {
        const detection = DETECTIONS[Math.floor(Math.random() * DETECTIONS.length)];
        newBoxes.push({
          id: Math.random().toString(),
          ...detection,
          x: Math.random() * 60 + 10, // 10% to 70% width
          y: Math.random() * 60 + 10, // 10% to 70% height
          w: Math.random() * 20 + 10,
          h: Math.random() * 20 + 10,
        });
      }
      setBoxes(newBoxes);
    };

    const interval = setInterval(generateBoxes, 800);
    generateBoxes();
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full relative bg-zinc-950 flex flex-col font-mono">
      {/* Header Overlay */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-zinc-950 to-transparent z-20 flex justify-between items-center px-6">
        <div className="flex items-center gap-4">
            <span className="text-emerald-400 font-bold tracking-widest text-sm">ECO-MIND / YOLOv8 INFERENCE</span>
            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-xs border border-emerald-500/30">30 FPS</span>
            <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-xs border border-zinc-700">HAILO-8L NPU</span>
        </div>
        <div className="text-zinc-500 text-xs text-right">
          LATENCY: 12ms<br/>
          CONFIDENCE THRESHOLD: 0.60
        </div>
      </div>

      {/* Main Video Stream Area (Simulated) */}
      <div className="flex-1 relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1599059021750-82716ae2b661?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
        {/* Overlay for cinematic effect */}
        <div className="absolute inset-0 bg-black/40 backdrop-grayscale-[0.5]" />

        {/* Scan line effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:100%_4px] opacity-20 pointer-events-none mix-blend-overlay" />

        <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute inset-0 h-[20%] bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent pointer-events-none"
        />

        {/* Bounding Boxes */}
        {boxes.map((box) => (
          <motion.div
            key={box.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute border-2 flex flex-col justify-start"
            style={{
              left: `${box.x}%`,
              top: `${box.y}%`,
              width: `${box.w}%`,
              height: `${box.h}%`,
              borderColor: box.color,
              boxShadow: `0 0 10px ${box.color}40 inset, 0 0 10px ${box.color}40`
            }}
          >
            {/* Box Label */}
            <div
                className="absolute -top-6 left-[-2px] px-2 py-1 text-[10px] font-bold text-white whitespace-nowrap flex items-center gap-2"
                style={{ backgroundColor: box.color }}
            >
              <span className="uppercase">{box.class}</span>
              <span>{(box.conf * 100).toFixed(0)}%</span>
            </div>

            {/* Crosshairs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 opacity-50" style={{ border: `1px solid ${box.color}` }}>
                <div className="absolute top-1/2 left-0 w-full h-[1px]" style={{ backgroundColor: box.color }} />
                <div className="absolute left-1/2 top-0 h-full w-[1px]" style={{ backgroundColor: box.color }} />
            </div>
          </motion.div>
        ))}

      </div>

      {/* Footer Info Bar */}
      <div className="h-12 bg-zinc-900 border-t border-zinc-800 flex items-center px-4 text-xs z-20 justify-between text-zinc-400">
        <div className="flex gap-6">
            <span>RES: 1920x1080</span>
            <span>ENCODER: H.265</span>
            <span>MODEL: ecomind-v2-nano.pt</span>
        </div>
        <div className="flex gap-2 items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            RECORDING
        </div>
      </div>
    </div>
  );
}
