'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';

import { StatCard } from '@/src/components/dashboard/StatCard';
import ModalContainer from '@/src/components/dashboard/audit-modals/ModalContainer';
import ModalDispatcher from '@/src/components/dashboard/audit-modals/ModalDispatcher';
import SafetyDurationDisplay from '@/src/components/dashboard/SafetyDurationDisplay';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function MarisDashboard() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [filters, setFilters] = useState({ shift: 'Total', start: '2025-06-01', end: '2025-06-30' });
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, label: "" });

  const handleFetch = async () => {
    setLoading(true);
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${BASE_URL}/dashboard/maris/?start=${filters.start}&end=${filters.end}`);
      if (!res.ok) throw new Error("Server Error");
      const json = await res.json();
      setData(json);
      setShowDashboard(true); // Hiển thị sau khi load data thành công
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Không thể kết nối với Server Django!");
    } finally {
      setLoading(false);
    }
  };

  const statEntries = data?.kpis ? Object.entries(data.kpis) : [];

  return (
    <div className="p-6 bg-[#f1f5f9] min-h-screen space-y-6 font-sans">

      {/* TOOLBAR CHUYÊN NGHIỆP */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-slate-200 sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <div className="pl-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Maris Analytics</h1>
            <p className="text-[16px] text-slate-500 font-bold leading-none">FACTORY REAL-TIME MONITORING</p>
          </div>

          <div className="h-10 w-[1px] bg-slate-200 hidden md:block" />

          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-400">
              <input
                type="date"
                className="bg-transparent border-none text-base font-semibold text-slate-600 focus:ring-0 px-2"
                value={filters.start}
                onChange={(e) => setFilters({...filters, start: e.target.value})}
              />
              <span className="text-slate-600 self-center">→</span>
              <input
                type="date"
                className="bg-transparent border-none text-base font-semibold text-slate-600 focus:ring-0 px-2"
                value={filters.end}
                onChange={(e) => setFilters({...filters, end: e.target.value})}
              />
            </div>

            <button
              onClick={handleFetch}
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-base font-black transition-all shadow-lg active:scale-95 ${
                loading ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
              }`}
            >
              {loading ? (
                <span className="animate-spin text-lg">⏳</span>
              ) : (
                'VIEW DASHBOARD'
              )}
            </button>
          </div>
        </div>
        <SafetyDurationDisplay />
      </div>

      {/* DASHBOARD CONTENT - CHỈ HIỆN KHI NHẤN NÚT */}
      {showDashboard && data ? (
          <div className="grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* CỘT TRÁI: 7 CHỈ SỐ (Vùng An Toàn & Tổng quan) */}
            <div className="col-span-12 lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between px-1">
                <span
                    className="text-[16px] font-black text-slate-400 uppercase tracking-widest">General & Safety (7)</span>
                <div className="h-1 w-12 bg-indigo-500 rounded-full"/>
              </div>
              <div className="flex flex-col gap-4">
                {statEntries.slice(0, 7).map(([label, stat]: any) => (
                    <StatCard
                        key={label}
                        label={label}
                        value={stat.value}
                        lastMonth={stat.lastMonth}
                        lastYear={stat.lastYear}
                        onClick={() => setModal({open: true, label})}
                    />
                ))}
              </div>
            </div>

            {/* CỘT GIỮA: BIỂU ĐỒ (Dữ liệu trực quan) */}
            <div className="col-span-12 lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-[16px] font-black text-slate-400 uppercase tracking-widest">Pie Chart & Column Chart</span>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 group">
                <h3 className="text-[16px] font-black text-slate-500 uppercase mb-6 tracking-[0.2em] group-hover:text-indigo-600 transition-colors">
                  Production Trend (Volume KG)
                </h3>
                <div className="h-[405px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {/* Thêm margin top để label không bị chạm đỉnh */}
                    <BarChart data={data?.charts?.column_chart} margin={{top: 25, right: 10, left: 10, bottom: 0}}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                      <XAxis dataKey="name" tick={{fontSize: 10, fontWeight: 600}} axisLine={false} tickLine={false}/>
                      <YAxis tick={{fontSize: 14}} axisLine={false} tickLine={false}
                             tickFormatter={(value) => value.toLocaleString("en-US")}/>
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                      }}
                        formatter={(val: any) => [Number(val).toLocaleString('en-US'), "Volume (KG)"]}
                      />

                      <Bar dataKey="volume" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40}>
                        {/* SỬA TẠI ĐÂY: Thêm nhãn trên đầu cột */}
                        <LabelList
                            dataKey="volume"
                            position="top"
                            offset={12}
                            formatter={(val: any) => (typeof val === 'number' ? val.toLocaleString('en-US') : val)}
                            style={{fontSize: '10px', fontWeight: '800', fill: '#4f46e5'}}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>


              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 group">
                <h3 className="text-[16px] font-black text-slate-500 uppercase mb-6 tracking-[0.2em] group-hover:text-emerald-600 transition-colors">Product
                  Mix Ratio (%)</h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                          data={data?.charts?.pie_chart}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={80}
                          outerRadius={110}
                          paddingAngle={5}
                          label={({ percent }) => `${((percent || 0) * 100).toFixed(2)}%`}
                      >
                        {data?.charts?.pie_chart?.map((_: any, i: number) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} strokeWidth={0}/>
                        ))}
                      </Pie>
                      <Tooltip/>
                      <Legend verticalAlign="bottom" iconType="circle"
                              wrapperStyle={{paddingTop: '20px', fontSize: '11px', fontWeight: 700}}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: 8 CHỈ SỐ (Chi tiết Sản xuất) */}
            <div className="col-span-12 lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="h-1 w-12 bg-emerald-500 rounded-full"/>
                <span
                    className="text-[16px] font-black text-slate-400 uppercase tracking-widest">Production Metrics (8)</span>
              </div>
              {/* Chia lưới 2 cột cho 8 chỉ số để nhìn cân đối */}
              <div className="grid grid-cols-1 gap-3">
                {statEntries.slice(7, 15).map(([label, stat]: any) => (
                    <div key={label} className="col-span-1">
                      <StatCard
                          label={label}
                          value={stat.value}
                          lastMonth={stat.lastMonth}
                          lastYear={stat.lastYear}
                          onClick={() => setModal({open: true, label})}
                      />
                    </div>
                ))}
              </div>
            </div>

          </div>
      ) : (
          /* TRẠNG THÁI CHỜ KHI CHƯA BẤM NÚT */
          <div
              className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-slate-200 rounded-3xl">
            <div className="bg-indigo-50 p-6 rounded-full mb-4">
              <span className="text-4xl">📊</span>
            </div>
          <h2 className="text-lg font-bold text-slate-400 uppercase tracking-widest">Ready to Analyze</h2>
          <p className="text-sm text-slate-400">Select dates and click "View Dashboard" to sync factory data</p>
        </div>
      )}

      {/* MODAL SYSTEM */}
      {modal.open && (
        <ModalDispatcher
          label={modal.label}
          records={data?.results || []} // Records từ API backend
          isOpen={modal.open}
          onClose={() => setModal({ open: false, label: "" })}
          // TRUYỀN THÊM CÁI NÀY:
          globalDates={{ from: filters.start, to: filters.end }}
          currentShift={filters.shift}
        />
      )}

    </div>
  );
}
