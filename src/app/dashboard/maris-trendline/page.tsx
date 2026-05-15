"use client";

import React, { useState, useEffect } from 'react';
import { FactoryTrendChart } from '@/src/components/dashboard/FactoryTrendChart';
import { MiniTrendChart } from '@/src/components/dashboard/MiniTrendChart';
import { getActiveMonth} from "@/src/constants/FormatDateTime";


export default function MarisTrendlineDashboard() {
  const [apiData, setApiData] = useState<any>(null);
  const [activeChartId, setActiveChartId] = useState<string>('TOTAL_PROD');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

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
  if (!apiData || !apiData.configs) {
    return <div className="h-screen flex items-center justify-center font-bold text-slate-300 uppercase italic tracking-widest">Initialising System...</div>;
  }

  const chartConfigurations = apiData.configs.summary || [];
  const activeChartConfig = chartConfigurations.find((c: any) => c.id === activeChartId) || chartConfigurations[0];
  if (!activeChartConfig) return <div>No Chart Configuration found.</div>;
  if (!apiData) return <div className="h-screen flex items-center justify-center font-bold text-slate-300 uppercase">Initialising Dashboard</div>;


  return (
    <div className="flex flex-col w-full bg-[#F8FAFC] overflow-hidden h-[calc(100vh-90px)]">

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
                data={apiData.data}
                title=""
                datasetsConfig={activeChartConfig.datasets}
                isPercentage={['OEE', 'YIELD', 'USED'].includes(activeChartId)}
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
                    <MiniTrendChart data={apiData.data} datasetsConfig={config.datasets} type={chartType}/>
                  </div>
                </div>
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
}
