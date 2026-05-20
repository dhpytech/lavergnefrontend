// src/app/dashboard/bagging-employee/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { EmployeeMainChart } from '@/src/components/bagging/EmployeeMainChart';
import { MiniTrendChart } from '@/src/components/bagging/MiniTrendChart';
import {getActiveMonth} from "@/src/constants/FormatDateTime"

export default function BaggingEmployeeDashboard() {
  const [apiResponse, setApiResponse] = useState<any>(null);

  const [viewType, setViewType] = useState<'daily' | 'monthly'>('monthly');
  const [dates, setDates] = useState(() => {
    const {startDate, endDate} = getActiveMonth();
    return {
      start: startDate,
      end: endDate,
    }});

  const [activeMetricId, setActiveMetricId] = useState<string>('IN');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  const [allEmployees, setAllEmployees] = useState<string[]>([]);
  const [selectedEmps, setSelectedEmps] = useState<string[]>([]);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/dashboard/bagging-detail?type=${viewType}&start=${dates.start}&end=${dates.end}`);
        const json = await res.json();
        setApiResponse(json);

        if (json.data && json.data.length > 0) {
          const uniqueEmps = new Set<string>();
          json.data.forEach((period: any) => {
            period.details.forEach((emp: any) => uniqueEmps.add(emp.name));
          });

          const empList = Array.from(uniqueEmps);
          setAllEmployees(empList);
          setSelectedEmps(empList);
        } else {
          setAllEmployees([]);
          setSelectedEmps([]);
        }
      } catch (error) {
        console.error("Lỗi kết nối API Dashboard Bagging: ", error);
      }
    };
    fetchDashboardData();
  }, [viewType, dates, BASE_URL]);

  if (!apiResponse) {
    return <div className="p-10 text-slate-400 font-bold animate-pulse tracking-widest">INITIALISING BAGGING ANALYTICS SYSTEM...</div>;
  }

  // Tính tổng chỉ số dựa trên toàn bộ các tháng của nhóm nhân viên đang được tích chọn ở Slicer
  const getFilteredTotalLabel = (metricId: string) => {
    let totalIn = 0;
    let totalOut = 0;
    let totalRate = 0;
    let totalTime = 0;

    apiResponse.data.forEach((period: any) => {
      period.details.forEach((emp: any) => {
        if (selectedEmps.includes(emp.name)) {
          totalIn += emp.in;
          totalOut += emp.out;
          totalTime += emp.time;
          totalRate = totalIn > 0 ? (totalOut / totalIn) * 100 : 0;
        }
      });
    });

    if (metricId === 'OUT' || metricId === 'IN' ) return Math.round(totalOut).toLocaleString() + " kg";
    if (metricId === 'TIME') return totalTime.toLocaleString() + " h";
    return totalIn > 0 ? ((totalOut / totalIn) * 100).toFixed(1) + "%" : "0%";
  };

  return (
    <div className="flex flex-col w-full bg-[#F8FAFC] h-[calc(100vh-90px)] overflow-hidden">

      <header className="h-14 bg-white border-b flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-black tracking-tighter text-slate-900 italic">
            MARIS <span className="text-blue-600 uppercase">Bagging Detail Analyst</span>
          </h1>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button onClick={() => setViewType('monthly')}
                    className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${viewType === 'monthly' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>
              {"Monthly".toUpperCase()}
            </button>
            <button onClick={() => setViewType('daily')}
                    className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${viewType === 'daily' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>
              {"Daily".toUpperCase()}
            </button>
          </div>

          <div className="flex items-center bg-slate-100 rounded-full px-4 py-1 border border-slate-200">
            <input type="date" value={dates.start} onChange={e => setDates({...dates, start: e.target.value})}
                   className="bg-transparent text-[11px] font-bold outline-none text-slate-600 w-[110px]"/>
            <span className="mx-2 text-slate-300">→</span>
            <input type="date" value={dates.end} onChange={e => setDates({...dates, end: e.target.value})}
                   className="bg-transparent text-[11px] font-bold outline-none text-slate-600 w-[110px]"/>
          </div>
        </div>
        <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Operator Analytics Panel</div>
      </header>

      {/* THÂN GIAO DIỆN CHỨA CHART XU HƯỚNG */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* VÙNG BIỂU ĐỒ TRUNG TÂM (Đã loại bỏ Sidebar tóm tắt bên trái) */}
        <main className="flex-1 p-4 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col overflow-hidden">

            <div className="shrink-0 flex items-center justify-between mb-6">
              {/* SLICER CHỌN NHÂN VIÊN ĐỂ ĐÈ ĐƯỜNG XU HƯỚNG LÊN CHART */}
              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 max-w-[600px] overflow-x-auto">
                <span className="text-[10px] font-black text-slate-400 uppercase mr-2 whitespace-nowrap">So sánh nhân viên:</span>
                {allEmployees.map(name => (
                  <label key={name} className="flex items-center space-x-1 text-xs text-slate-600 font-medium whitespace-nowrap cursor-pointer hover:text-blue-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedEmps.includes(name)}
                      className="rounded text-blue-600 border-slate-300 w-3.5 h-3.5"
                      onChange={(e) => {
                        if (e.target.checked) setSelectedEmps([...selectedEmps, name]);
                        else setSelectedEmps(selectedEmps.filter(n => n !== name));
                      }}
                    />
                    <span>{name}</span>
                  </label>
                ))}
              </div>

              {/* SWITCH LINE / BAR */}
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                {['line', 'bar'].map((t) => (
                  <button key={t} onClick={() => setChartType(t as any)}
                    className={`px-4 py-1 text-[9px] font-black uppercase rounded-lg transition-all ${chartType === t ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* BOX CHỨA BIỂU ĐỒ XU HƯỚNG */}
            <div className="flex-1 min-h-0 w-full relative">
              <EmployeeMainChart
                timelineData={apiResponse.data}
                selectedEmps={selectedEmps}
                activeMetricId={activeMetricId}
                chartType={chartType}
              />
            </div>
          </div>
        </main>

        <aside className="w-[280px] py-4 pr-4 pl-0 h-full shrink-0 flex flex-col space-y-4 overflow-y-auto">
          {apiResponse.metric_configs.map((config: any) => {
            const isActive = activeMetricId === config.id;
            return (
              <div
                key={config.id}
                onClick={() => setActiveMetricId(config.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                  isActive ? 'bg-white border-blue-500 shadow-md ring-4 ring-blue-500/5' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{config.label}</span>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight mt-0.5">
                    {getFilteredTotalLabel(config.id)}
                  </h3>
                </div>

                {/* MiniTrendChart hiển thị toàn bộ nhân viên và thay đổi line/bar theo trạng thái hệ thống */}
                <div className="h-10 w-full mt-4">
                  <MiniTrendChart
                    timelineData={apiResponse.data}
                    metricId={config.id}
                    chartType={chartType}
                  />
                </div>
              </div>
            );
          })}
        </aside>

      </div>
    </div>
  );
}
