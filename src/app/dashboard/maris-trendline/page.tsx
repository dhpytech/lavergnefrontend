"use client";

import React, { useState, useEffect } from 'react';
import { FactoryTrendChart } from '@/src/components/dashboard/FactoryTrendChart';
import { MiniTrendChart } from '@/src/components/dashboard/MiniTrendChart';
import { getActiveMonth} from "@/src/constants/FormatDateTime";


const chartConfigurations = [
  {
    id: 'TOTAL_PROD',
    title: 'PRODUCTION TREND LINE CHART',
    menuTitle: 'PRODUCTION',
    datasets: [{ label: 'PRODUCTION (kg)', dataPath: 'SUMMARY.total_prod', borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.05)', fill: true }]
  },
  {
    id: 'TOTAL_SCRAP',
    title: 'SCRAP TREND LINE CHART',
    menuTitle: 'SCRAP',
    datasets: [{ label: 'SCRAP (kg)', dataPath: 'SUMMARY.total_scrap', borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.05)', fill: true }]
  },
  {
    id: 'TOTAL_DLNC',
    title: 'DLNC TITLE',
    menuTitle: 'DLNC',
    datasets: [{ label: 'DLNC (kg)', dataPath: 'SUMMARY.total_dlnc', borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.05)', fill: true }]
  },
  {
    id: 'TOTAL_REJECT',
    title: 'REJECT TITLE',
    menuTitle: 'REJECT',
    datasets: [{ label: 'REJECT (kg)', dataPath: 'SUMMARY.total_reject', borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.05)', fill: true }]
  },
  {
    id: 'TOTAL_SCREEN',
    title: 'SCREEN TITLE',
    menuTitle: 'SCREEN',
    datasets: [{ label: 'SCREEN (kg)', dataPath: 'SUMMARY.total_screen', borderColor: '#3b82f6', backgroundColor: 'transparent' }]
  },
  {
    id: 'TOTAL_VISSLAB',
    title: 'VISSLAB TITLE',
    menuTitle: 'VISSLAB',
    datasets: [{ label: 'VISSLAB (kg)', dataPath: 'SUMMARY.total_visslab', borderColor: '#3b82f6', backgroundColor: 'transparent' }]
  },
  {
    id: 'TOTAL_NUM_SHIFTS',
    title: 'NUM_SHIFTS TITLE',
    menuTitle: 'NUM_SHIFTS',
    datasets: [{ label: 'NUM_SHIFTS (shifts)', dataPath: 'SUMMARY.total_shifts', borderColor: '#3b82f6', backgroundColor: 'transparent' }]
  },
  {
    id: 'NET PER_HOUR',
    title: 'NET PER HOUR TITLE',
    menuTitle: 'NET PER HOUR',
    datasets: [{ label: 'NET PER HOUR (kg/hour)', dataPath: 'SUMMARY.net_per_hour', borderColor: '#3b82f6', backgroundColor: 'transparent' }]
  },
];

export default function MarisTrendlineDashboard() {
  const [apiData, setApiData] = useState<any>(null);
  const [activeChartId, setActiveChartId] = useState<string>('TOTAL_PROD');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [dates, setDates] = useState(() => {
    const { startDate, endDate } = getActiveMonth();
    return {
      start: startDate,
      end: endDate,
    };
  });

  const startDate = dates.start
  const endDate = dates.end

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const fetchData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/dashboard/monthly-maris?start=${startDate}&end=${endDate}`);
      const json = await res.json();
      setApiData(json);
    } catch (error) { console.error("API Error:", error); }
  };

  useEffect(() => { fetchData(); }, []);

  if (!apiData) return <div className="h-screen flex items-center justify-center font-bold text-slate-300 uppercase">Initialising...</div>;

  const activeChartConfig = chartConfigurations.find(c => c.id === activeChartId) || chartConfigurations[0];

  return (
    // CHIỀU CAO: Trừ đi 64px của Nav và ẩn scroll dọc toàn trang
    <div className="flex flex-col w-full bg-[#F8FAFC] overflow-hidden h-[calc(100vh-64px)]">

      {/* HEADER */}
      <header className="h-14 bg-white border-b flex items-center justify-between px-8 shrink-0 z-20">
        <div className="flex items-center space-x-10">
          <h1 className="text-xl font-black tracking-tighter text-slate-900 italic">LAVERNE <span className="text-blue-600">VN</span></h1>
          <div className="flex items-center bg-slate-100 rounded-full px-4 py-1.5 border border-slate-200">
             <input type="date" value={startDate} onChange={e => setDates({...dates, start: e.target.value})} className="bg-transparent text-[11px] font-bold outline-none text-slate-600"/>
             <span className="mx-2 text-slate-300">→</span>
             <input type="date" value={endDate} onChange={e => setDates({...dates, end: e.target.value})} className="bg-transparent text-[11px] font-bold outline-none text-slate-600"/>
             <button onClick={fetchData} className="ml-4 bg-blue-600 text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-sm hover:bg-blue-700 transition-all">Update</button>
          </div>
        </div>
        <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Trendline Analytics</div>
      </header>

      <div className="flex flex-1 min-h-0">

        {/* MAIN CONTENT: flex-col và overflow-hidden để ép nội dung con */}
        <main className="flex-1 p-6 pr-3 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col relative overflow-hidden">

            <div className="mb-6 shrink-0 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">{activeChartConfig.title}</h2>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Operational Trendline Analysis</p>
              </div>

              {/* NÚT TOGGLE CHUYỂN ĐỔI BIỂU ĐỒ */}
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                {['line', 'bar'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type as any)}
                    className={`px-4 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${chartType === type ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-500'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* VÙNG CHỨA BIỂU ĐỒ CHÍNH: flex-1 min-h-0 */}
            <div className="flex-1 min-h-0 w-full relative">
              <FactoryTrendChart
                data={apiData}
                title="" // Bỏ title của Chart.js vì đã có tiêu đề custom bên trên
                datasetsConfig={activeChartConfig.datasets}
                type={chartType}
              />
            </div>
          </div>
        </main>

        {/* SIDEBAR NAVIGATION: Giữ nguyên logic map của bạn */}
        <aside className="w-[300px] p-6 pl-4 h-full shrink-0 flex flex-col z-10 border-l bg-[#F8FAFC] overflow-hidden">
          <div className="mb-4 shrink-0">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Navigation</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 pb-10 space-y-4 custom-scrollbar scroll-smooth">
            {chartConfigurations.map(config => (
                <div
                    key={config.id}
                    onClick={() => setActiveChartId(config.id)}
                    className={`relative cursor-pointer rounded-xl transition-all p-4 flex flex-col bg-white shadow-sm border border-slate-100 ${
                        activeChartId === config.id ? 'ring-2 ring-blue-500/10 translate-x-1 shadow-md' : 'hover:border-slate-200'
                    }`}
                >
                  {activeChartId === config.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-blue-600" style={{borderRadius: '12px 0 0 12px'}} />
                  )}
                  <div className="flex justify-between items-start mb-3 ml-2">
                    <span className={`text-[10px] font-bold uppercase tracking-tight ${activeChartId === config.id ? 'text-blue-700' : 'text-slate-500'}`}>
                      {config.menuTitle}
                    </span>
                    {activeChartId === config.id && <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]"/>}
                  </div>
                  <div className="h-16 w-full pointer-events-none p-1 ml-1 overflow-hidden">
                    <MiniTrendChart data={apiData} datasetsConfig={config.datasets} type={chartType}/>
                  </div>
                </div>
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
}
