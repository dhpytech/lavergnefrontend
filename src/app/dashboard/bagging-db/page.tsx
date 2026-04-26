'use client';

import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { StatCard } from '@/src/components/dashboard/StatCard';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// Hàm định dạng ngày chuẩn múi giờ địa phương (Tránh lệch 1 ngày)
const getFormattedDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function BaggingDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [lotView, setLotView] = useState<'reject' | 'input' | 'shipping'>('shipping');

  // Khởi tạo Filters: Mặc định từ ngày 1 đến ngày hiện tại của tháng
  const [filters, setFilters] = useState(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      start: getFormattedDate(firstDay),
      end: getFormattedDate(now),
      shift: 'All'
    };
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      // Lưu ý: Đổi endpoint thành /dashboard/metal/ nếu dùng cho line Metal
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/bagging/?${query}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Lỗi fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen space-y-6">

      {/* --- HEADER TIÊU ĐỀ CHUYÊN NGHIỆP --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Live Monitoring</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
            BAGGING <span className="text-blue-600">DASHBOARD</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium italic">Production performance and efficiency analytics</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Current Shift</p>
            <p className="text-xs font-black text-slate-600">{filters.shift === 'All' ? 'Full Day' : `${filters.shift} Shift`}</p>
          </div>
          <div className="h-10 w-[1px] bg-slate-100 mx-2 hidden md:block"></div>
          <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
             <span className="text-[10px] font-black text-slate-400 uppercase block leading-none mb-1">Line Status</span>
             <span className="text-xs font-black text-green-600 uppercase">System Active</span>
          </div>
        </div>
      </div>

      {/* 1. THANH CÔNG CỤ (Shift, Start, End) */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Shift:</label>
          <select
            className="border rounded-md px-2 py-1 text-xs font-bold outline-none bg-slate-50 focus:ring-2 focus:ring-blue-500"
            value={filters.shift}
            onChange={e => setFilters({...filters, shift: e.target.value})}
          >
            <option value="All">All Shifts</option>
            <option value="Day">Day Shift</option>
            <option value="Night">Night Shift</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Start:</label>
          <input type="date" className="border rounded-md px-2 py-1 text-xs font-bold outline-none" value={filters.start} onChange={e => setFilters({...filters, start: e.target.value})} />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase">End:</label>
          <input type="date" className="border rounded-md px-2 py-1 text-xs font-bold outline-none" value={filters.end} onChange={e => setFilters({...filters, end: e.target.value})} />
        </div>

        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-1.5 rounded-md font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 flex items-center gap-2 ml-auto"
        >
          {loading ? (
            <>
              <span className="animate-spin text-sm">🔄</span>
              <span>SYNCING...</span>
            </>
          ) : 'VIEW DASHBOARD'}
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
            <div className="col-span-12 lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 h-[350px] shadow-sm">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Shipping Mix (Product Code)</h3>
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie data={data.charts.pie_chart} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {data.charts.pie_chart.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{fontSize: '10px', fontWeight: 700}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="col-span-12 lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 h-[350px] shadow-sm">
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

          {/* 3. BIỂU ĐỒ LOT (BATCH CHART) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Lot Analysis - {lotView.toUpperCase()}</h3>
              <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                {(['shipping', 'input', 'reject'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setLotView(mode)}
                    className={`px-4 py-1 text-[10px] font-black rounded-md transition-all ${
                      lotView === mode ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'
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
                  fill={lotView === 'reject' ? '#ef4444' : lotView === 'input' ? '#4f46e5' : '#10b981'}
                  radius={[4, 4, 0, 0]}
                  barSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 5. BẢNG CHI TIẾT */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
               <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Production Detail by Lot</span>
               <span className="text-[10px] font-bold text-slate-400 italic">*Efficiency = (Out - Rework) / In</span>
            </div>
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
                    <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-700">{lot.lot}</td>
                      <td className="p-4 text-right font-mono text-slate-500 text-xs">{lot.in?.toLocaleString()}</td>
                      <td className="p-4 text-right font-bold text-slate-900">{lot.out?.toLocaleString()}</td>
                      <td className="p-4 text-right font-bold text-red-600">{lot.rj?.toLocaleString()}</td>
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
