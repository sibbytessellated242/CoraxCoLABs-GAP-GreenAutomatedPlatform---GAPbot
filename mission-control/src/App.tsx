import Telemetry from './Telemetry';
import AuditLedger from './AuditLedger';
import LidarMap from './LidarMap';
import VisionStream from './VisionStream';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Camera, Box, Key, Compass } from 'lucide-react';
import DigitalTwin from './DigitalTwin';

function App() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: 'Digital Twin', icon: Box, id: 'twin' },
    { name: 'Vision Stream', icon: Camera, id: 'vision' },
    { name: 'Lidar Map', icon: Compass, id: 'lidar' },
    { name: 'Audit Ledger', icon: Key, id: 'ledger' },
    { name: 'Telemetry', icon: Activity, id: 'telemetry' }
  ];

  return (
    <div className="flex h-screen w-full bg-zinc-950 font-mono text-zinc-300">
      {/* Sidebar */}
      <div className="w-64 border-r border-zinc-800 bg-zinc-900/50 flex flex-col backdrop-blur-md z-10">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-xl font-bold text-emerald-400 tracking-wider">GAP<span className="text-zinc-500">bot</span></h1>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Mission Control</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(idx)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                activeTab === idx
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.name}</span>
              {activeTab === idx && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute left-0 w-1 h-8 bg-emerald-500 rounded-r-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-800 text-xs text-zinc-600 text-center">
          SYSTEM ONLINE <br/>
          <span className="text-emerald-500">SECURE CONNECTION</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 to-zinc-950">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTIwIDIwaDIwdjIwSDIwdjIweiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjAyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')] opacity-20 pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 p-8 flex flex-col pointer-events-none"
          >
            <div className="mb-6 flex items-center justify-between pointer-events-auto">
              <h2 className="text-2xl font-semibold text-zinc-100 flex items-center gap-3">
                {React.createElement(tabs[activeTab].icon, { className: "w-6 h-6 text-emerald-400" })}
                {tabs[activeTab].name}
              </h2>
              <div className="flex items-center gap-2">
                 <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-sm text-emerald-400 font-medium">LIVE</span>
              </div>
            </div>

            <div className="flex-1 border border-zinc-800/50 rounded-2xl bg-black/40 backdrop-blur-sm overflow-hidden relative shadow-2xl pointer-events-auto">
                {activeTab === 0 && <DigitalTwin />}
                {activeTab === 1 && <VisionStream />}
                {activeTab === 2 && <LidarMap />}
                {activeTab === 3 && <AuditLedger />}
                {activeTab === 4 && <Telemetry />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
