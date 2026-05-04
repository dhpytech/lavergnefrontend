"use client";

import React, { useState, useEffect } from 'react';
import { EmployeeMainChart } from '@/src/components/dashboard/employee/EmployeeMainChart';
import { EmployeeSlicer } from '@/src/components/dashboard/employee/EmployeeSlicer';
import { EmployeeSidebar } from "@/src/components/dashboard/employee/EmployeeSideBar";

const METRIC_CONFIGS = [
  { id: 'PROD', label: 'PRODUCTION (KG)', menuTitle: 'PRODUCTION', path: 'prod', color: '#3b82f6' },
  { id: 'SCRAP', label: 'SCRAP (KG)', menuTitle: 'SCRAP', path: 'scrap', color: '#ef4444' },
  { id: 'REJECT', label: 'REJECT (KG)', menuTitle: 'REJECT', path: 'reject', color: '#f59e0b' },
  { id: 'DLNC', label: 'DLNC(KG)', menuTitle: 'DLNC', path: 'dlnc', color: '#f59e0b' },
];

export default function EmployeeDashboard() {
  const [data, setData] = useState<any>(null);
  const [employees, setEmployees] = useState<string[]>([]);
  const [activeEmps, setActiveEmps] = useState<string[]>([]);
  const [activeMetricId, setActiveMetricId] = useState('PROD');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [dates, setDates] = useState({ start: '2025-01-01', end: '2026-04-30' });

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const fetchAll = async () => {
    try {
      const [dRes, eRes] = await Promise.all([
        fetch(`${BASE_URL}/dashboard/monthly-maris?start=${dates.start}&end=${dates.end}`),
        fetch(`${BASE_URL}/dashboard/active-employees?start=${dates.start}&end=${dates.end}`)
      ]);
      const dJson = await dRes.json();
      const eJson = await eRes.json();
      setData(dJson);
      setEmployees(eJson);
      if (eJson.length > 0 && activeEmps.length === 0) setActiveEmps([eJson[0]]);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchAll(); }, [dates]);

  if (!data || activeEmps.length === 0) return <div className="p-10 text-slate-300 font-black animate-pulse uppercase tracking-widest">Initialising...</div>;

  const currentMetric = METRIC_CONFIGS.find(m => m.id === activeMetricId) || METRIC_CONFIGS[0];

  return (
    /*
       CHIẾN THUẬT:
       - h-[calc(100vh-64px)]: 64px là chiều cao ước tính của thanh Nav xanh (Lavergne VN).
       - overflow-hidden: Chặn hoàn toàn việc đẩy khung gây ra scrollbar ngoài.
    */
    <div className="flex flex-col w-full bg-[#F8FAFC] overflow-hidden h-[calc(100vh-90px)]">

      {/* 1. DASHBOARD HEADER (Cố định 56px) */}
      <header className="h-14 bg-white border-b flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center space-x-10">
          <h1 className="text-xl font-black tracking-tighter text-slate-900 italic">
            MARIS <span className="text-blue-600 uppercase">Employee</span>
          </h1>
          <div className="flex items-center bg-slate-100 rounded-full px-4 py-1 border border-slate-200">
             <input type="date" value={dates.start} onChange={e => setDates({...dates, start: e.target.value})} className="bg-transparent text-[11px] font-bold outline-none text-slate-600 w-[110px]"/>
             <span className="mx-2 text-slate-300">→</span>
             <input type="date" value={dates.end} onChange={e => setDates({...dates, end: e.target.value})} className="bg-transparent text-[11px] font-bold outline-none text-slate-600 w-[110px]"/>
             <button onClick={fetchAll} className="ml-4 bg-blue-600 text-white text-[9px] font-black px-4 py-1 rounded-full hover:shadow-md transition-all uppercase">Update</button>
          </div>
        </div>
        <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Performance Analytics</div>
      </header>

      {/* 2. AREA CHỨA BIỂU ĐỒ VÀ SIDEBAR */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* VÙNG CHỨA BIỂU ĐỒ CHÍNH */}
        <main className="flex-1 p-4 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col relative overflow-hidden">

            {/* Header và Slicer (Phần cố định bên trên biểu đồ) */}
            <div className="shrink-0">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 leading-tight uppercase">{currentMetric.label}</h2>
                  <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-0.5">Efficiency Trendline Analysis</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                  {['line', 'bar'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setChartType(t as any)}
                      className={`px-3 py-1 text-[9px] font-black uppercase rounded-lg transition-all ${chartType === t ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-500'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6 mt-2">
                 <EmployeeSlicer employees={employees} activeEmps={activeEmps} onEmpsChange={setActiveEmps} />
              </div>
            </div>

            {/* PHẦN QUAN TRỌNG: Biểu đồ chiếm nốt diện tích còn lại */}
            <div className="flex-1 min-h-0 w-full relative">
              <EmployeeMainChart
                data={data}
                activeEmps={activeEmps}
                metricPath={currentMetric.path}
                label={currentMetric.label}
                type={chartType}
              />
            </div>
          </div>
        </main>

        {/* CỘT SIDEBAR BÊN PHẢI */}
        <aside className="w-[300px] py-4 pr-4 pl-0 h-full shrink-0 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar scroll-smooth">
             <EmployeeSidebar
              data={data}
              activeEmp={activeEmps[0] || ""}
              activeId={activeMetricId}
              onSelect={setActiveMetricId}
              configs={METRIC_CONFIGS}
            />
          </div>
        </aside>

      </div>
    </div>
  );
}
