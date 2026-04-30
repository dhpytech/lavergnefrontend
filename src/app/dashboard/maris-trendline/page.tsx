"use client";

import React, { useState, useEffect } from 'react';
import { FactoryTrendChart } from '@/src/components/dashboard/FactoryTrendChart';
import { MiniTrendChart } from '@/src/components/dashboard/MiniTrendChart';

const chartConfigurations = [
  {
    id: 'TOTAL_PROD',
    title: 'Xu Hướng Tổng Sản Lượng',
    menuTitle: 'Sản Lượng Tổng',
    datasets: [{ label: 'Sản Lượng (kg)', dataPath: 'SUMMARY.total_prod', borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.05)', fill: true }]
  },
  {
    id: 'TOTAL_SCRAP',
    title: 'Xu Hướng Tổng Phế Phẩm',
    menuTitle: 'Phế Phẩm Tổng',
    datasets: [{ label: 'Phế Phẩm (kg)', dataPath: 'SUMMARY.total_scrap', borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.05)', fill: true }]
  },
  {
    id: 'PROD_SCRAP_TREND',
    title: 'So Sánh Sản Lượng & Phế Phẩm',
    menuTitle: 'Hiệu Suất Chung',
    datasets: [
      { label: 'Sản Lượng', dataPath: 'SUMMARY.total_prod', borderColor: '#3b82f6', backgroundColor: 'transparent' },
    ]
  }
];

export default function MarisTrendlineDashboard() {
  const [apiData, setApiData] = useState<any>(null);
  const [activeChartId, setActiveChartId] = useState<string>('TOTAL_PROD');
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2023-12-31');

  const fetchData = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/dashboard/monthly-maris?start=${startDate}&end=${endDate}`);
      const json = await res.json();
      setApiData(json);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (!apiData) return <div className="h-screen flex items-center justify-center font-bold text-slate-300 uppercase tracking-widest">Initialising...</div>;

  const activeChartConfig = chartConfigurations.find(c => c.id === activeChartId) || chartConfigurations[0];

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] overflow-hidden">

      {/* HEADER */}
      <header className="h-14 bg-white border-b flex items-center justify-between px-8 shrink-0 z-20">
        <div className="flex items-center space-x-10">
          <h1 className="text-xl font-black tracking-tighter text-slate-900">LAVERNE <span className="text-blue-600">VN</span></h1>
          <div className="flex items-center bg-slate-100 rounded-full px-4 py-1.5 border border-slate-200">
             <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-transparent text-[11px] font-bold outline-none cursor-pointer text-slate-600"/>
             <span className="mx-2 text-slate-300">→</span>
             <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-transparent text-[11px] font-bold outline-none cursor-pointer text-slate-600"/>
             <button onClick={fetchData} className="ml-4 bg-blue-600 text-white text-[9px] font-black px-4 py-1 rounded-full hover:bg-blue-700 transition-all uppercase tracking-widest shadow-sm">Update</button>
          </div>
        </div>
        <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Trendline Analytics</div>
      </header>

      <div className="flex flex-1 min-h-0 relative">

        {/* MAIN CHART CONTAINER */}
        <main className="flex-1 p-6 pr-3 h-full overflow-y-auto">
          <div className="w-full h-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col relative transition-all">

            {/*/!* THANH CHỈ THỊ ACTIVE - GÓC TRÊN CÙNG BÊN PHẢI BIỂU ĐỒ CHÍNH *!/*/}
            {/*<div className="absolute top-6 right-8 flex flex-col items-end pointer-events-none">*/}
            {/*  <div className="h-1.5 w-12 bg-blue-600 rounded-full mb-1 shadow-[0_0_10px_rgba(37,99,235,0.3)]"></div>*/}
            {/*  <span className="text-[9px] font-black text-blue-600/40 uppercase tracking-widest">Active View</span>*/}
            {/*</div>*/}

            <div className="mb-6 shrink-0 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">{activeChartConfig.title}</h2>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Operational
                  Trendline Analysis</p>
              </div>
              {/* Đường line trang trí phía dưới tiêu đề */}
              <div className="h-1 w-10 bg-blue-500/20 rounded-full mt-10 absolute left-8"></div>
            </div>

            <div className="flex-1 min-h-0 pt-4">
              <FactoryTrendChart data={apiData} datasetsConfig={activeChartConfig.datasets}/>
            </div>
          </div>
        </main>

        {/* CỘT MINI CHARTS (Cân đối về phía trên) */}
        {/* CỘT MINI CHARTS */}
        <aside className="w-[300px] p-6 pl-4 h-full shrink-0 flex flex-col z-10 border-l bg-[#F8FAFC]">
          <div className="mb-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Navigation</span>
          </div>

          <div className="space-y-4 h-full overflow-y-auto pr-2 pb-10">
            {chartConfigurations.map(config => (
                <div
                    key={config.id}
                    onClick={() => setActiveChartId(config.id)}
                    className={`relative cursor-pointer rounded-xl transition-all p-4 flex flex-col bg-white shadow-sm border border-slate-100 ${
                        activeChartId === config.id
                            ? 'ring-2 ring-blue-500/10 translate-x-1 shadow-md'
                            : 'hover:border-slate-200'
                    }`}
                    style={{
                      // Đảm bảo không bị mất border khi dùng ring
                      boxSizing: 'border-box'
                    }}
                >
                  {/* VẠCH XANH BÊN TRÁI - KHÔNG DÙNG BORDER ĐỂ TRÁNH BỊ KHUẤT */}
                  {activeChartId === config.id && (
                      <div
                          className="absolute left-0 top-0 bottom-0 w-[6px] bg-blue-600 z-50"
                          style={{borderRadius: '12px 0 0 12px'}} // Bo góc theo Card
                      />
                  )}

                  <div className="flex justify-between items-start mb-3 ml-2">
           <span className={`text-[10px] font-bold uppercase tracking-tight ${
               activeChartId === config.id ? 'text-blue-700' : 'text-slate-500'
           }`}>
            {config.menuTitle}
           </span>
                    {activeChartId === config.id && (
                        <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]"/>
                    )}
                  </div>

                  <div className="h-16 w-full pointer-events-none p-1 ml-1 overflow-hidden">
                    <MiniTrendChart data={apiData} datasetsConfig={config.datasets}/>
                  </div>
                </div>
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
}
