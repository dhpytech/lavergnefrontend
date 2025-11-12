'use client';

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8040', '#AF19FF'];

const pieData = [
  { name: 'Item A', value: 400 },
  { name: 'Item B', value: 300 },
  { name: 'Item C', value: 300 },
  { name: 'Item D', value: 200 },
];

const barData = [
  { name: 'Item A', quantity: 400 },
  { name: 'Item B', quantity: 300 },
  { name: 'Item C', quantity: 300 },
  { name: 'Item D', quantity: 200 },
];

const batchData = [
  { name: 'Batch 1', reject: 5, input: 120, shipping: 100 },
  { name: 'Batch 2', reject: 2, input: 110, shipping: 90 },
  { name: 'Batch 3', reject: 4, input: 130, shipping: 95 },
];

const kpis = [
  {
    label: 'TOTAL IN',
    value: 1200,
    lastMonth: 1150,
    lastYear: 1000,
  },
  {
    label: 'SHIPPING',
    value: 950,
    lastMonth: 970,
    lastYear: 800,
  },
  {
    label: 'RATE',
    value: 91,
    lastMonth: 89,
    lastYear: 85,
  },
  {
    label: 'WORKING TIME',
    value: 480,
    lastMonth: 500,
    lastYear: 520,
  },
];

function StatBox({ label, value, lastMonth, lastYear }: any) {
  const calcDiff = (current: number, prev: number) => {
    const diff = current - prev;
    const pct = (diff / prev) * 100;
    const color = diff >= 0 ? 'text-green-500' : 'text-red-500';
    const sign = diff >= 0 ? '+' : '';
    return <span className={color}>{sign}{Math.abs(pct).toFixed(1)}%</span>;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs">
        Last Month: {calcDiff(value, lastMonth)} | Last Year: {calcDiff(value, lastYear)}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [batchView, setBatchView] = useState<'reject' | 'input' | 'shipping'>('reject');
  const [showData, setShowData] = useState(false);
  const [shift, setShift] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFilter = () => {
    // logic lọc có thể thêm sau
    setShowData(true);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-4 rounded-2xl shadow">
        <label className="text-sm font-medium">Shift:</label>
        <select
          className="border rounded px-2 py-1"
          value={shift}
          onChange={(e) => setShift(e.target.value)}
        >
          <option value="All">Total</option>
          <option value="Day">Day</option>
          <option value="Night">Night</option>
        </select>

        <label className="text-sm font-medium">Start:</label>
        <input
          type="date"
          className="border rounded px-2 py-1"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label className="text-sm font-medium">End:</label>
        <input
          type="date"
          className="border rounded px-2 py-1"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button
          onClick={handleFilter}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Xem Thống Kê
        </button>
      </div>

      {showData && (
        <>
          {/* KPI Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
              <StatBox key={kpi.label} {...kpi} />
            ))}
          </div>

          {/* Shipping Charts: Pie & Bar on one row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-4 shadow">
              <h2 className="text-lg font-semibold mb-2">SHIPPING PER ITEM - Pie</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ percent }: any) => {
                        const value = typeof percent === 'number' ? percent : 0;
                        return `${(value * 100).toFixed(0)}%`;
                    }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow">
              <h2 className="text-lg font-semibold mb-2">SHIPPING PER ITEM - Bar</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantity" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Batch Chart */}
          <div className="bg-white rounded-2xl p-4 shadow">
            <h2 className="text-lg font-semibold mb-2">BATCH CHART - {batchView.toUpperCase()}</h2>
            <div className="flex justify-center gap-2 mb-2">
              {['reject', 'input', 'shipping'].map((type) => (
                <button
                  key={type}
                  className={`px-3 py-1 rounded ${batchView === type ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                  onClick={() => setBatchView(type as any)}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={batchData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey={batchView} fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
