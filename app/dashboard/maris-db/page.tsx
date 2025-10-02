'use client';

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

type StatType = {
  label: string;
  value: string | number;
  lastMonth: string;
  lastYear: string;
};

type ChartType = {
  name: string;
  value: number;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFF', '#FF6699', '#33CC99', '#FF9933'];

export default function MarisDashboard() {
  const [shiftType, setShiftType] = useState('Total');
  const [startDate, setStartDate] = useState('2025-06-01');
  const [endDate, setEndDate] = useState('2025-06-30');
  const [stats, setStats] = useState<StatType[]>([]);
  const [chartDataPie, setChartDataPie] = useState<ChartType[]>([]);
  const [chartDataBar, setChartDataBar] = useState<ChartType[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStat, setSelectedStat] = useState<StatType | null>(null);

  const handleViewStats = async () => {
    setLoading(true);
    try {
      const query = `start_date=${startDate}&end_date=${endDate}`;
      const res = await fetch(`http://127.0.0.1:8000/dashboard/maris/?${query}`);

      if (!res.ok) {
        throw new Error('Không thể tải dữ liệu AAA');
      }

      const data = await res.json();

      // Convert stats object -> array
      const statsArray: StatType[] = Object.entries(data.stats).map(([key, val]: any) => ({
        label: key,
        value: val.value,
        lastMonth: val.lastMonth,
        lastYear: val.lastYear,
      }));

      setStats(statsArray);
      setChartDataPie(
        (data.charts.production_pie || []).map((item: any) => ({
          name: item.productCode,
          value: item.production,
        }))
      );
      setChartDataBar(
        (data.charts.production_bar || []).map((item: any) => ({
          name: item.productCode,
          value: item.production,
        }))
      );
    } catch (error) {
      console.error(error);
      alert('Lỗi khi tải dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (stat: StatType) => {
    setSelectedStat(stat);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStat(null);
  };

  return (
    <div className="space-y-6">
      {/* Bộ lọc */}
      <div className="bg-white p-4 shadow rounded flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold">Shift:</label>
          <select value={shiftType} onChange={(e) => setShiftType(e.target.value)} className="border rounded px-2 py-1">
            <option value="Total">Total</option>
            <option value="Day">Day</option>
            <option value="Night">Night</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold">Start:</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold">End:</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <button
          onClick={handleViewStats}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Đang tải...' : 'Xem Thống Kê'}
        </button>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            onClick={() => handleOpenModal(stat)}
            className="bg-white shadow rounded p-4 cursor-pointer hover:bg-blue-50"
          >
            <h3 className="text-sm font-semibold text-gray-700">{stat.label}</h3>
            <p className="text-2xl font-bold text-blue-700">{stat.value}</p>
            <div className="text-sm mt-1">
              <span className={`mr-2 ${stat.lastMonth.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>
                Last Month: {stat.lastMonth}
              </span>
              <span className={`${stat.lastYear.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>
                Last Year: {stat.lastYear}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie Chart */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-sm font-semibold mb-2">Productions per Item (Pie)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chartDataPie} dataKey="value" nameKey="name" outerRadius={100} fill="#8884d8" label>
                {chartDataPie.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-sm font-semibold mb-2">Productions per Item (Bar)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartDataBar}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1D4ED8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && selectedStat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 animate-fade-in-up">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Chi tiết: {selectedStat.label}</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-red-600 text-2xl font-bold"
                title="Đóng"
              >
                &times;
              </button>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[70vh] overflow-auto">
              <table className="w-full text-sm border border-gray-200">
                <thead className="bg-blue-100 text-gray-700 text-left">
                  <tr>
                    <th className="p-3 border">Ngày</th>
                    <th className="p-3 border">Ca</th>
                    <th className="p-3 border">Mã sản phẩm</th>
                    <th className="p-3 border text-right">Sản lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {[ // tạm dữ liệu mock
                    { date: '2025-06-01', shift: 'Ca 1', code: 'S014-47', amount: '7,000' },
                    { date: '2025-06-01', shift: 'Ca 2', code: 'S031-11', amount: '8,000' },
                    { date: '2025-06-02', shift: 'Ca 1', code: 'S051-08', amount: '10,500' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="p-3 border">{row.date}</td>
                      <td className="p-3 border">{row.shift}</td>
                      <td className="p-3 border">{row.code}</td>
                      <td className="p-3 border text-right">{row.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t flex justify-end bg-gray-50 rounded-b-xl">
              <button
                onClick={handleCloseModal}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-md"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
