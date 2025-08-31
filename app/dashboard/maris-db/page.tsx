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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFF', '#FF6699', '#33CC99', '#FF9933'];

export default function MarisDashboard() {
  const [shiftType, setShiftType] = useState('Total');
  const [startDate, setStartDate] = useState('2025-06-01');
  const [endDate, setEndDate] = useState('2025-06-30');
  const [stats, setStats] = useState<StatType[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStat, setSelectedStat] = useState<StatType | null>(null);

  const handleViewStats = () => {
    const simulatedStats: StatType[] = [
      { label: 'PRODUCTION (KG)', value: 247393, lastMonth: '+26.89%', lastYear: '-14.47%' },
      { label: 'YIELD (%)', value: '97.12%', lastMonth: '+2.08%', lastYear: '-0.44%' },
      { label: 'OEE (%)', value: '52.59%', lastMonth: '+4.21%', lastYear: '-0.88%' },
      { label: 'UTILISATION (%)', value: '58.67%', lastMonth: '-1.56%', lastYear: '-17.46%' },
      { label: 'NET/HOUR (KG/HOUR)', value: '646.083', lastMonth: '+3.72%', lastYear: '+11.50%' },
      { label: 'SCRAP (KG)', value: 5870, lastMonth: '-8.95%', lastYear: '+1.79%' },
      { label: 'SCRAP/PRODUCTION (%)', value: '2.373', lastMonth: '-28.24%', lastYear: '+19.01%' },
      { label: 'DL/NC (KG)', value: 4000, lastMonth: '-14.95%', lastYear: '-28.70%' },
      { label: 'MTBF (HOUR)', value: 672, lastMonth: '+21.74%', lastYear: '+460.00%' },
      { label: 'MTTR (HOUR)', value: 0, lastMonth: '0.00%', lastYear: '-100.00%' },
      { label: 'NUMBER OF ORDER CHANGE', value: 8, lastMonth: '-11.11%', lastYear: '-20.00%' },
      { label: 'NUMBER OF MECHANICAL FAILURE', value: 1, lastMonth: '0.00%', lastYear: '-83.33%' },
    ];

    const simulatedChartData = [
      { name: 'S014-47', value: 72915 },
      { name: 'S031-11', value: 64772 },
      { name: 'S118-01', value: 10520 },
      { name: 'S029-20', value: 1962 },
      { name: 'S001-02', value: 20912 },
      { name: 'S051-08', value: 46660 },
      { name: 'S031-04', value: 23395 },
      { name: 'S028-08', value: 2257 },
    ];

    setStats(simulatedStats);
    setChartData(simulatedChartData);
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
        <button onClick={handleViewStats} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded">
          Xem Thống Kê
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
              <span className={`mr-2 ${stat.lastMonth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>Last Month: {stat.lastMonth}</span>
              <span className={`${stat.lastYear.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>Last Year: {stat.lastYear}</span>
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
              <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={100} fill="#8884d8" label>
                {chartData.map((_, index) => (
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
            <BarChart data={chartData}>
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

            {/* Body */}p
            <div className="p-6 max-h-[70vh] overflow-auto">
              {/* Bảng dữ liệu mô phỏng */}
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
                  {[
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
