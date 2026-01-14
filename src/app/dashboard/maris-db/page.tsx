'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import StatCard from '@/src/components/dashboard/StatCard';
import ModalContainer from '@/src/components/dashboard/audit-modals/ModalContainer';
import ModalDispatcher from '@/src/components/dashboard/audit-modals/ModalDispatcher';
import SafetyDurationDisplay from '@/src/components/dashboard/SafetyDurationDisplay';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFF'];

export default function MarisDashboard() {
  // --- States ---
  const [filters, setFilters] = useState({ shift: 'Total', start: '2025-06-01', end: '2025-06-30' });
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, label: "" });

  const handleFetch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/dashboard/maris/?start=${filters.start}&end=${filters.end}&shift=${filters.shift}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      alert("API Error!");
    } finally {
      setLoading(false);
    }
  };

  const statEntries = data?.kpis ? Object.entries(data.kpis) : [];

  return (
    <div className="space-y-6 p-4 bg-gray-50 min-h-screen">
      {/* FILTER BAR */}
      <div className="bg-white p-4 shadow rounded flex items-end gap-4 border-t-4 border-blue-600">
        <div className="flex gap-4 items-center">
            {/* ... Các inputs chọn Date và Shift như code cũ của bạn ... */}
            <button onClick={handleFetch} className="bg-blue-600 text-white px-6 py-2 rounded font-bold">
                {loading ? 'LOADING...' : 'VIEW DASHBOARD'}
            </button>
        </div>
        <SafetyDurationDisplay />
      </div>

      {/* DASHBOARD GRID */}
      <div className="grid grid-cols-4 gap-4">
        {/* Cột trái: 8 chỉ số */}
        <div className="space-y-4">
          {statEntries.slice(0, 8).map(([label, stat]) => (
            <StatCard key={label} label={label} data={stat} onClick={() => setModal({ open: true, label })} />
          ))}
        </div>

        {/* Cột giữa: Biểu đồ */}
        <div className="col-span-2 space-y-4">
          {data && (
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-xs font-bold text-gray-400 mb-4">PRODUCTION VOLUME</h3>
              <ResponsiveContainer width="100%" height={300}>
                 <BarChart data={data.charts.production_bar}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#2563eb" />
                 </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Cột phải: 7 chỉ số */}
        <div className="space-y-4">
          {statEntries.slice(8).map(([label, stat]) => (
            <StatCard key={label} label={label} data={stat} onClick={() => setModal({ open: true, label })} />
          ))}
        </div>
      </div>

      {/* MODAL ĐIỀU HƯỚNG ĐỘNG */}
      {modal.open && (
        <ModalContainer label={modal.label} onClose={() => setModal({ open: false, label: "" })}>
          <ModalDispatcher label={modal.label} records={data?.records || []} />
        </ModalContainer>
      )}
    </div>
  );
}
