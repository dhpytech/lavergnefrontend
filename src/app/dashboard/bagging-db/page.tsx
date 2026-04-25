'use client';

import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { StatCard } from '@/src/components/dashboard/StatCard';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function BaggingDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [lotView, setLotView] = useState<'reject' | 'input' | 'shipping'>('reject');
  const [filters, setFilters] = useState({
    start: '2026-03-01',
    end: '2026-03-31',
    shift: 'All'
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/bagging/?${query}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Lỗi fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen space-y-6">

      {/* 1. THANH CÔNG CỤ (Shift, Start, End) */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">Shift:</label>
          <select
            className="border rounded-md px-2 py-1 text-xs font-bold outline-none"
            value={filters.shift}
            onChange={e => setFilters({...filters, shift: e.target.value})}
          >
            <option value="All">All</option>
            <option value="Day">Day</option>
            <option value="Night">Night</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">Start:</label>
          <input type="date" className="border rounded-md px-2 py-1 text-xs font-bold outline-none" value={filters.start} onChange={e => setFilters({...filters, start: e.target.value})} />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">End:</label>
          <input type="date" className="border rounded-md px-2 py-1 text-xs font-bold outline-none" value={filters.end} onChange={e => setFilters({...filters, end: e.target.value})} />
        </div>

        <button onClick={fetchDashboardData} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md font-bold text-xs transition-all disabled:opacity-50">
          {loading ? 'Đang tải...' : 'Xem Thống Kê'}
        </button>
      </div>

      {data && (
        <>
          {/* 2. KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(data.kpis || {}).map(([label, stats]: any) => (
              <StatCard key={label} label={label} value={stats.value} lastMonth={stats.lastMonth} lastYear={stats.lastYear} />
            ))}
          </div>

          {/* 4. BIỂU ĐỒ TRÒN & CỘT XU HƯỚNG */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 h-[350px]">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Shipping Mix</h3>
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie data={data.charts.pie_chart} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {data.charts.pie_chart.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip /><Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="col-span-12 lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 h-[350px]">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Production Trend</h3>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={data.charts.bar_chart}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{fontSize: 10, fontWeight: 700}} axisLine={false} />
                  <YAxis tick={{fontSize: 10, fontWeight: 700}} axisLine={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="volume" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. BIỂU ĐỒ LOT (BATCH CHART) - MỚI THÊM */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Lot Chart - {lotView.toUpperCase()}</h3>
              <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                {(['shipping', 'input', 'reject'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setLotView(mode)}
                    className={`px-4 py-1 text-[10px] font-black rounded-md transition-all ${
                      lotView === mode ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {mode.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={data?.charts?.lot_chart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fontSize: 10, fontWeight: 700}} axisLine={false} />
                <YAxis tick={{fontSize: 10, fontWeight: 700}} axisLine={false} />
                <Tooltip />
                <Bar
                  dataKey={lotView}
                  fill={lotView === 'reject' ? '#86efac' : lotView === 'input' ? '#93c5fd' : '#818cf8'}
                  radius={[4, 4, 0, 0]}
                  barSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 5. BẢNG CHI TIẾT */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-widest">Production Detail by Lot</div>
            <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-white border-b text-[10px] font-black text-slate-400 uppercase">
                  <tr>
                    <th className="p-4">Lot Number</th>
                    <th className="p-4 text-right">In (KG)</th>
                    <th className="p-4 text-right">Out (KG)</th>
                    <th className="p-4 text-right">Reject</th>
                    <th className="p-4 text-right">Rework</th>
                    <th className="p-4 text-center">Efficiency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.lots?.map((lot: any, i: number) => (
                    <tr key={i} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="p-4 font-bold text-slate-700">{lot.lot}</td>
                      <td className="p-4 text-right font-mono text-slate-500">{lot.in?.toLocaleString()}</td>
                      <td className="p-4 text-right font-bold text-slate-900">{lot.out?.toLocaleString()}</td>
                      <td className="p-4 text-right font-bold text-slate-900">{lot.rj?.toLocaleString()}</td>
                      <td className="p-4 text-right text-orange-600 font-bold">{lot.rw > 0 ? `+${lot.rw.toLocaleString()}` : '-'}</td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${((lot.out - lot.rw) / lot.in) >= 0.98 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {lot.in > 0 ? (((lot.out - lot.rw) / lot.in) * 100).toFixed(1) : 0}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
