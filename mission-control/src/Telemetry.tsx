import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Mock Data Generators
const genNoise = (base: number, variance: number) => base + (Math.random() - 0.5) * variance;

export default function Telemetry() {
  const [data, setData] = useState({
    cpuTemp: 45,
    npuTemp: 55,
    battery: 88,
    speed: 1.2,
    servos: Array.from({ length: 18 }, (_, i) => ({ id: i, load: 0, temp: 30, angle: 90 })),
    network: { ping: 12, tx: 0, rx: 0 }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        cpuTemp: genNoise(48, 4),
        npuTemp: genNoise(62, 8),
        battery: Math.max(0, prev.battery - 0.01),
        speed: Math.max(0, genNoise(1.5, 0.5)),
        network: { ping: genNoise(15, 5), tx: genNoise(250, 100), rx: genNoise(150, 50) },
        servos: prev.servos.map(s => ({
            ...s,
            load: genNoise(40, 30),
            temp: genNoise(35, 5),
            angle: genNoise(90, 45)
        }))
      }));
    }, 500); // 2Hz Update Rate

    return () => clearInterval(interval);
  }, []);

  // Helper for conditional styling
  const getStatusColor = (val: number, warn: number, crit: number) => {
      if (val >= crit) return 'text-rose-500 shadow-rose-500/50';
      if (val >= warn) return 'text-amber-500 shadow-amber-500/50';
      return 'text-emerald-400 shadow-emerald-500/20';
  };

  const getBarColor = (val: number, warn: number, crit: number) => {
    if (val >= crit) return 'bg-rose-500';
    if (val >= warn) return 'bg-amber-500';
    return 'bg-emerald-500';
  }

  return (
    <div className="w-full h-full p-6 bg-zinc-950 text-zinc-300 font-mono flex flex-col gap-6 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>

        {/* Core Systems Grid */}
        <div className="grid grid-cols-4 gap-4">
            {/* Battery */}
            <div className="col-span-1 border border-zinc-800 bg-zinc-900/50 p-4 rounded flex flex-col justify-between">
                <span className="text-xs text-zinc-500 uppercase">Primary Cell</span>
                <div className="flex items-end gap-2 mt-2">
                    <span className={`text-3xl font-bold ${getStatusColor(100-data.battery, 60, 80)} drop-shadow-md`}>
                        {data.battery.toFixed(1)}%
                    </span>
                    <span className="text-zinc-600 mb-1 text-sm">24V LiPo</span>
                </div>
                {/* Visual Bar */}
                <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                    <motion.div
                        className={`h-full ${getBarColor(100-data.battery, 60, 80)}`}
                        animate={{ width: `${data.battery}%` }}
                        transition={{ type: "spring", stiffness: 50 }}
                    />
                </div>
            </div>

            {/* RPi 5 CPU */}
            <div className="col-span-1 border border-zinc-800 bg-zinc-900/50 p-4 rounded flex flex-col justify-between">
                <span className="text-xs text-zinc-500 uppercase">RPi 5 Core Temp</span>
                <div className="flex items-end gap-2 mt-2">
                    <span className={`text-3xl font-bold ${getStatusColor(data.cpuTemp, 70, 85)} drop-shadow-md`}>
                        {data.cpuTemp.toFixed(1)}°C
                    </span>
                </div>
                 <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                    <motion.div
                        className={`h-full ${getBarColor(data.cpuTemp, 70, 85)}`}
                        animate={{ width: `${(data.cpuTemp / 100) * 100}%` }}
                    />
                </div>
            </div>

            {/* Hailo-8L NPU */}
            <div className="col-span-1 border border-zinc-800 bg-zinc-900/50 p-4 rounded flex flex-col justify-between relative overflow-hidden">
                <span className="text-xs text-zinc-500 uppercase relative z-10">Hailo-8L NPU Temp</span>
                 <div className="flex items-end gap-2 mt-2 relative z-10">
                    <span className={`text-3xl font-bold ${getStatusColor(data.npuTemp, 80, 95)} drop-shadow-md`}>
                        {data.npuTemp.toFixed(1)}°C
                    </span>
                    <span className="text-xs text-zinc-500 mb-1">PCIe Gen3</span>
                </div>
                 <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-3 overflow-hidden relative z-10">
                    <motion.div
                        className={`h-full ${getBarColor(data.npuTemp, 80, 95)}`}
                        animate={{ width: `${(data.npuTemp / 120) * 100}%` }}
                    />
                </div>
                {/* Background pulse if hot */}
                {data.npuTemp > 80 && <div className="absolute inset-0 bg-amber-500/10 animate-pulse z-0" />}
            </div>

            {/* Network / MQTT */}
            <div className="col-span-1 border border-zinc-800 bg-zinc-900/50 p-4 rounded flex flex-col justify-between">
                <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500 uppercase">MQTT Telemetry</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                </div>
                <div className="mt-2 space-y-1 text-sm font-mono text-zinc-400">
                    <div className="flex justify-between">
                        <span>LATENCY:</span>
                        <span className="text-emerald-400">{data.network.ping.toFixed(0)}ms</span>
                    </div>
                    <div className="flex justify-between">
                        <span>TX:</span>
                        <span>{data.network.tx.toFixed(0)} kbps</span>
                    </div>
                    <div className="flex justify-between">
                        <span>RX:</span>
                        <span>{data.network.rx.toFixed(0)} kbps</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Kinematics & Actuators (18 Servos) */}
        <div className="flex-1 border border-zinc-800 bg-zinc-900/30 rounded p-4 flex flex-col">
            <div className="flex justify-between items-end mb-4 border-b border-zinc-800 pb-2">
                <div>
                    <h3 className="text-zinc-100 font-bold tracking-widest text-sm">KINEMATICS CONTROL MATRIX</h3>
                    <p className="text-[10px] text-zinc-500 uppercase mt-1">18x PWM Actuators via I2C PCA9685</p>
                </div>
                <div className="text-right">
                     <div className="text-xs text-zinc-500">VELOCITY</div>
                     <div className="text-xl font-bold text-emerald-400">{data.speed.toFixed(2)} m/s</div>
                </div>
            </div>

            {/* 6 Legs x 3 Servos (Coxa, Femur, Tibia) representation */}
            <div className="grid grid-cols-6 gap-2 flex-1">
                {['FL', 'FR', 'ML', 'MR', 'RL', 'RR'].map((legName, legIdx) => (
                    <div key={legName} className="col-span-1 bg-black/40 border border-zinc-800/50 rounded flex flex-col overflow-hidden">
                        <div className="text-center py-1 bg-zinc-800/50 text-[10px] font-bold text-zinc-400 border-b border-zinc-800">
                            LEG {legName}
                        </div>
                        <div className="p-2 space-y-2 flex-1 flex flex-col justify-around">
                            {['COXA', 'FEMUR', 'TIBIA'].map((jointName, jIdx) => {
                                const servo = data.servos[legIdx * 3 + jIdx];
                                return (
                                    <div key={jointName} className="relative">
                                        <div className="flex justify-between text-[8px] mb-1">
                                            <span className="text-zinc-500">{jointName}</span>
                                            <span className={getStatusColor(servo.load, 70, 90)}>{servo.load.toFixed(0)}%</span>
                                        </div>
                                        {/* Load Bar */}
                                        <div className="w-full h-1 bg-zinc-800 rounded overflow-hidden">
                                             <motion.div
                                                className={`h-full opacity-80 ${getBarColor(servo.load, 70, 90)}`}
                                                animate={{ width: `${Math.min(100, Math.max(0, servo.load))}%` }}
                                            />
                                        </div>
                                         {/* Angle Indicator (Tiny circle moving along a line) */}
                                        <div className="mt-1 flex items-center gap-1 opacity-50">
                                            <div className="h-[1px] flex-1 bg-zinc-700 relative">
                                                <motion.div
                                                    className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full"
                                                    animate={{ left: `${(servo.angle / 180) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>

    </div>
  );
}
