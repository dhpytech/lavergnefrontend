'use client';

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LabelList
} from 'recharts';

import { StatCard } from '@/src/components/dashboard/StatCard';
import SafetyDurationDisplay from '@/src/components/dashboard/SafetyDurationDisplay';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function BaggingDashboard() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const [filters, setFilters] = useState({
    start: new Date().toISOString().split('T')[0], // Mặc định ngày hôm nay
    end: new Date().toISOString().split('T')[0],
    shift: 'Total'
  });

  const handleFetch = async () => {
    setLoading(true);
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(
        `${BASE_URL}/dashboard/bagging/?start=${filters.start}&end=${filters.end}&shift=${filters.shift}`
      );
      if (!res.ok) throw new Error("Server Error");
      const json = await res.json();

      // Đảm bảo cấu trúc data luôn có các key cần thiết để tránh crash FE
      setData(json);
      setShowDashboard(true);
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Lỗi kết nối Server!");
    } finally {
      setLoading(false);
    }
  };

  // Chuyển Object KPIs thành Array để Map, bảo vệ bằng Optional Chaining
  const statEntries = data?.kpis ? Object.entries(data.kpis) : [];

  return (
    <div className="p-6 bg-[#f1f5f9] min-h-screen space-y-6">

      {/* TOOLBAR CHUẨN MARIS */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-slate-200 sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <div className="pl-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Bagging Analytics</h1>
            <p className="text-[14px] text-slate-500 font-bold uppercase">Production Monitoring</p>
          </div>

          <div className="h-10 w-[1px] bg-slate-200 hidden md:block" />

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
            className={`px-8 py-2.5 rounded-xl text-base font-black transition-all shadow-lg active:scale-95 ${
              loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {loading ? 'WAITING...' : 'VIEW DASHBOARD'}
          </button>
        </div>
        <SafetyDurationDisplay />
      </div>

      {showDashboard && data ? (
        <div className="grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

          {/* CỘT TRÁI: KPI CARDS */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-[14px] font-black text-slate-400 uppercase tracking-widest">KPI Metrics</span>
              <div className="h-1 w-12 bg-indigo-500 rounded-full"/>
            </div>
            {statEntries.map(([label, stat]: any) => (
              <StatCard
                key={label}
                label={label}
                // Ép kiểu về String để tránh lỗi .startsWith() trong StatCard
                value={String(stat?.value ?? "0")}
                onClick={() => {}}
              />
            ))}
          </div>

          {/* CỘT GIỮA: CHARTS (GIỐNG LAYOUT MARIS) */}
          <div className="col-span-12 lg:col-span-6 space-y-6">
            {/* COLUMN CHART */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-[14px] font-black text-slate-500 uppercase mb-6 tracking-widest">Output Volume by Date</h3>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.charts?.column_chart || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                    <XAxis dataKey="name" tick={{fontSize: 12, fontWeight: 600}} axisLine={false} />
                    <YAxis axisLine={false} tickFormatter={(val) => val.toLocaleString()} />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                    <Bar dataKey="volume" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40}>
                       <LabelList dataKey="volume" position="top" formatter={(v:any) => v.toLocaleString()} style={{fontSize: '10px', fontWeight: 'bold'}} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* PIE CHART */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-[14px] font-black text-slate-500 uppercase mb-6 tracking-widest">Product Ratio (%)</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.charts?.pie_chart || []}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                    >
                      {(data?.charts?.pie_chart || []).map((_: any, i: number) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: LOT TABLE (GIỮ LẠI BẢN SẮC BAGGING) */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b bg-slate-50">
                <span className="text-[12px] font-black text-slate-400 uppercase">Production by Lot</span>
              </div>
              <div className="overflow-x-auto max-h-[750px] overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-white shadow-sm">
                    <tr className="text-[10px] font-black text-slate-400 uppercase">
                      <th className="p-4">Lot</th>
                      <th className="p-4 text-right">In</th>
                      <th className="p-4 text-right">Out</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data?.lots?.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-indigo-50/30 transition-colors">
                        <td className="p-4 text-sm font-bold text-slate-700">{item.lot}</td>
                        <td className="p-4 text-sm text-right font-mono text-slate-500">{item.input.toLocaleString()}</td>
                        <td className="p-4 text-sm text-right font-bold text-indigo-600">{item.output.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
          <div className="bg-indigo-50 p-6 rounded-full mb-4 animate-pulse">
            <span className="text-4xl">📦</span>
          </div>
          <h2 className="text-lg font-bold text-slate-400 uppercase tracking-widest">Bagging System Ready</h2>
          <p className="text-sm text-slate-400">Select date range and click view dashboard to sync</p>
        </div>
      )}
    </div>
  );
}
