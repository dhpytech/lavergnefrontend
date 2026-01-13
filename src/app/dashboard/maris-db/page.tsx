'use client';

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid
} from 'recharts';
import SafetyDurationDisplay from '@/src/components/dashboard/SafetyDurationDisplay';

// --- Cấu hình màu sắc và Mục tiêu ---
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFF', '#FF6699'];

const targetRules: Record<string, { target: number; direction: 'higher' | 'lower' }> = {
  "SCRAP/PRODUCTION (%)": { target: 1, direction: 'lower' },
  "OEE (%)": { target: 80, direction: 'higher' },
  "YIELD (%)": { target: 98, direction: 'higher' },
  "UTILISATION (%)": { target: 83, direction: 'higher' },
  "MTTR (HOUR)": { target: 2.5, direction: 'lower' },
  "MTBF (HOUR)": { target: 200, direction: 'higher' },
};

function StatCard({ label, data, onClick }: { label: string; data: any; onClick?: () => void }) {
  const rule = targetRules[label];
  const value = data?.value ?? "0";
  const numericValue = parseFloat(String(value).replace(/[%,\s]/g, ""));

  let barColor = "bg-gray-300";
  if (rule && !isNaN(numericValue)) {
    const isBad = rule.direction === "higher" ? numericValue < rule.target : numericValue > rule.target;
    barColor = isBad ? "bg-red-500" : "bg-green-500";
  }

  return (
    <div onClick={onClick} className="bg-white shadow rounded p-4 cursor-pointer hover:border-blue-500 border border-transparent transition-all">
      <h3 className="text-xs font-bold text-gray-500 uppercase">{label}</h3>
      <p className="text-2xl font-bold text-blue-700">{value}</p>
      <div className="text-[10px] mt-1 text-gray-400 flex justify-between">
        <span>L.Month: {data?.lastMonth ?? "0%"}</span>
        <span>L.Year: {data?.lastYear ?? "0%"}</span>
      </div>
      {rule && (
        <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full ${barColor}`} style={{ width: `${Math.min((numericValue / rule.target) * 100, 100)}%` }} />
        </div>
      )}
    </div>
  );
}

export default function MarisDashboard() {
  const [shiftType, setShiftType] = useState('Total');
  const [startDate, setStartDate] = useState('2025-06-01');
  const [endDate, setEndDate] = useState('2025-06-30');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");

  const API_BASE_URL = "http://127.0.0.1:8000";

  const handleViewStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/maris/?start=${startDate}&end=${endDate}&shift=${shiftType}`);
      const json = await res.json();
      // Gán thẳng json vào data vì Backend đã trả về {stats, charts, results}
      setData(json);
    } catch (error) {
      console.error("API Error:", error);
      alert("Kết nối API thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const statEntries = data?.stats ? Object.entries(data.stats) : [];

  return (
    <div className="space-y-6 p-4 bg-gray-50 min-h-screen">
      {/* 🚀 Bộ lọc chuẩn gốc */}
      <div className="bg-white p-4 shadow rounded flex flex-wrap items-center justify-between gap-4 border-t-4 border-blue-600">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Shift</label>
            <select value={shiftType} onChange={(e) => setShiftType(e.target.value)} className="border rounded px-2 py-1 text-sm outline-none">
              <option value="Total">Total</option>
              <option value="Day">Day</option>
              <option value="Night">Night</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border rounded px-2 py-1 text-sm outline-none" />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-400 uppercase">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border rounded px-2 py-1 text-sm outline-none" />
          </div>
          <button onClick={handleViewStats} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-bold self-end transition-all active:scale-95">
            {loading ? 'LOADING...' : 'VIEW DASHBOARD'}
          </button>
        </div>
        <SafetyDurationDisplay />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Cột 1: 8 chỉ số đầu */}
        <div className="space-y-4">
          {statEntries.slice(0, 8).map(([label, stat]) => (
            <StatCard key={label} label={label} data={stat} onClick={() => {setSelectedLabel(label); setModalOpen(true)}} />
          ))}
        </div>

        {/* Cột giữa: Biểu đồ */}
        <div className="col-span-2 space-y-4">
          {!data ? (
            <div className="h-full flex items-center justify-center bg-white border-2 border-dashed rounded-xl py-40 text-gray-400">
              Nhấn VIEW DASHBOARD để tải dữ liệu
            </div>
          ) : (
            <>
              <div className="bg-white shadow rounded p-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-4">Production Share (%)</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie data={data.charts.production_pie} dataKey="percent" nameKey="name" outerRadius={120} label={({percent}) => `${(percent*100).toFixed(0)}%`}>
                      {data.charts.production_pie.map((_:any, i:number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Legend /><Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white shadow rounded p-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-4">Production Volume (KG)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.charts.production_bar}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{fontSize: 10}} /><YAxis tick={{fontSize: 10}} /><Tooltip />
                    <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>

        {/* Cột 3: 7 chỉ số còn lại */}
        <div className="space-y-4">
          {statEntries.slice(8).map(([label, stat]) => (
            <StatCard key={label} label={label} data={stat} onClick={() => {setSelectedLabel(label); setModalOpen(true)}} />
          ))}
        </div>
      </div>

      {/* Modal chi tiết - Khớp hoàn toàn với production_data */}
      {modalOpen && data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-gray-700 uppercase">Audit Log: {selectedLabel}</h2>
              <button onClick={() => setModalOpen(false)} className="text-2xl hover:text-red-500">&times;</button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-blue-50 sticky top-0 font-bold text-blue-600">
                  <tr className="border-b">
                    <th className="p-3">Date</th>
                    <th className="p-3 text-center">Shift</th>
                    <th className="p-3">Product SKU</th>
                    <th className="p-3 text-right">Qty (KG)</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.results?.map((record: any) => record.mainData?.map((item: any, i: number) => (
                    <tr key={`${record.id}-${i}`} className="hover:bg-blue-50/30">
                      <td className="p-3 text-gray-600">{record.date}</td>
                      <td className="p-3 text-center"><span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold">{record.shift}</span></td>
                      <td className="p-3 font-mono text-blue-700 font-bold">{item.productCode}</td>
                      <td className="p-3 text-right font-bold">{(parseInt(item.goodPro) || 0).toLocaleString()}</td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
