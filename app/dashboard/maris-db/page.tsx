'use client';

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

// Kiểu dữ liệu
type StatType = {
  label: string;
  value: string | number;
  lastMonth: string;
  lastYear: string;
};

type ChartType = {
  name: string;
  value: number;
  percent: number;
};

// Màu cho chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFF', '#FF6699', '#33CC99', '#FF9933'];

// Target + hướng so sánh
const targetRules: Record<string, { target: number; direction: 'higher' | 'lower' }> = {
  "SCRAP/PRODUCTION (%)": { target: 1, direction: 'lower' },
  "OEE (%)": { target: 80, direction: 'higher' },
  "YIELD (%)": { target: 98, direction: 'higher' },
  "UTILISATION (%)": { target: 83, direction: 'higher' },
  "MTTR (HOUR)": { target: 2.5, direction: 'lower' },
  "MTBF (HOUR)": { target: 200, direction: 'higher' },
};

function StatCard({ stat, onClick }: { stat: StatType; onClick?: () => void }) {
  const rule = targetRules[stat.label];
  const numericValue = parseFloat(String(stat.value).replace(/[%]/g, ""));

  let barColor = "bg-gray-400";
  if (rule && !isNaN(numericValue)) {
    const { target, direction } = rule;
    const isBad =
      direction === "higher" ? numericValue < target : numericValue > target;
    barColor = isBad ? "bg-red-500" : "bg-green-500";
  }

  return (
    <div
      onClick={onClick}
      className="bg-white shadow rounded p-4 cursor-pointer hover:bg-blue-50 transition-colors"
    >
      <h3 className="text-sm font-semibold text-gray-700">{stat.label}</h3>
      <p className="text-2xl font-bold text-blue-700">{stat.value}</p>
      <div className="text-sm mt-1">
        <span
          className={`mr-2 ${stat.lastMonth.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}
        >
          Last Month: {stat.lastMonth}
        </span>
        <span
          className={`${stat.lastYear.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}
        >
          Last Year: {stat.lastYear}
        </span>
      </div>

      {rule && !isNaN(numericValue) && (
        <div className="mt-2">
          <div className="h-2 bg-gray-200 rounded">
            <div
              className={`h-2 rounded ${barColor}`}
              style={{
                width: `${Math.min((numericValue / rule.target) * 100, 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Target: {rule.target} ({rule.direction === 'higher' ? '≥' : '≤'})
          </p>
        </div>
      )}
    </div>
  );
}

export default function MarisDashboard() {
  const [shiftType, setShiftType] = useState('Total');
  const [startDate, setStartDate] = useState('2025-06-01');
  const [endDate, setEndDate] = useState('2025-06-30');
  const [stats, setStats] = useState<StatType[]>([]);
  const [chartDataPie, setChartDataPie] = useState<ChartType[]>([]);
  const [chartDataBar, setChartDataBar] = useState<ChartType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStat, setSelectedStat] = useState<StatType | null>(null);

  const handleViewStats = async () => {
    setLoading(true);
    try {
      const query = `start_date=${startDate}&end_date=${endDate}&shift=${shiftType}`;
      const res = await fetch(`gunicorn-lavergnebackendwsgi-production.up.railway.app/dashboard/maris/?${query}`);

      if (!res.ok) throw new Error('Can not load data from DB');

      const data = await res.json();

      const statsArray: StatType[] = Object.entries(data.stats).map(
        ([key, val]: any) => ({
          label: key,
          value: val.value,
          lastMonth: val.lastMonth,
          lastYear: val.lastYear,
        })
      );

      setStats(statsArray);
      setChartDataPie(
        (data.charts.production_pie || []).map((item: any) => ({
          name: item.name,
          value: item.value,
          percent: item.percent,
        }))
      );
      setChartDataBar(
        (data.charts.production_bar || []).map((item: any) => ({
          name: item.name,
          value: item.value,
          percent: item.percent,
        }))
      );

      setShowCharts(true);
    } catch (error) {
      console.error(error);
      alert('Data Error!');
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

      {/* 🚀 Bộ lọc */}
      <div className="bg-white p-4 shadow rounded flex flex-wrap items-center justify-between gap-4">

        {/* Nhóm Controls (Left side) */}
        <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
                <label className="text-sm font-semibold">Shift:</label>
                <select
                    value={shiftType}
                    onChange={(e) => setShiftType(e.target.value)}
                    className="border rounded px-2 py-1"
                >
                    <option value="Total">Total</option>
                    <option value="Day">Day</option>
                    <option value="Night">Night</option>
                </select>
            </div>
            <div className="flex items-center gap-2">
                <label className="text-sm font-semibold">Start:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border rounded px-2 py-1"
                />
            </div>
            <div className="flex items-center gap-2">
                <label className="text-sm font-semibold">End:</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border rounded px-2 py-1"
                />
            </div>
            <button
                onClick={handleViewStats}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded disabled:opacity-50"
                disabled={loading}
            >
                {loading ? 'Đang tải...' : 'View Dashboard'}
            </button>
        </div>

        {/* Safety Time (Right side) */}
        <div className="text-sm font-bold text-green-700">
            SAFETY TIMES: 1000 HOURS
        </div>
      </div>

      {/* 📊 Layout 3 cột */}
      <div className="grid grid-cols-4 gap-4">

        {/* Cột 1 */}
        <div className="space-y-4">
          {stats
              .filter((stat) =>
                  [
                    'PRODUCTION (KG)',
                    'NET/HOUR (KG/HOUR)',
                    'DL/NC (KG)',
                    'SCRAP (KG)',
                    'SCRAP/PRODUCTION (%)',
                    'NUMBER OF ORDER CHANGE',
                    'NUMBER OF MECHANICAL FAILURE',
                  ].includes(stat.label)
            )
            .map((stat, idx) => (
              <StatCard key={idx} stat={stat} onClick={() => handleOpenModal(stat)} />
            ))}
        </div>

        {/* Cột 2 (Biểu đồ) - ĐÃ GIẢM CHIỀU CAO ĐỂ CÂN BẰNG LAYOUT */}
        <div className="col-span-2 space-y-4"> {/* Tăng khoảng cách giữa các phần tử lên 4 */}
          {!showCharts && (
            <div className="text-center text-gray-500 italic py-8 bg-white shadow rounded h-full flex items-center justify-center">
              Nhấn “View Dashboard” để hiển thị biểu đồ thống kê
            </div>
          )}

          {showCharts && (
            <>
              <div className="bg-white shadow rounded p-4">
                <h3 className="text-sm font-semibold mb-2">
                  Productions per Item (Pie)
                </h3>
                {/* Giảm height từ 400 xuống 350 */}
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={chartDataPie}
                      dataKey="percent"
                      nameKey="name"
                      outerRadius={130} // Giảm bán kính cho phù hợp
                      fill="#8884d8"
                      // FIX LỖI COMPILE: Đảm bảo percent là number trước khi nhân
                      label={({ percent }: any) => {
                          const value = typeof percent === 'number' ? percent : 0;
                          return `${(value * 100).toFixed(0)}%`;
                      }}
                    >
                      {chartDataPie.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      )) as unknown as React.ReactNode}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white shadow rounded p-4">
                <h3 className="text-sm font-semibold mb-2">
                  Productions per Item (Bar)
                </h3>
                {/* Giảm height từ 480 xuống 350 */}
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={chartDataBar}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#1D4ED8" label={{ position: 'top', fill: '#1D4ED8', fontSize: 14 }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>

        {/* Cột 3 */}
        <div className="space-y-4"> {/* Tăng khoảng cách giữa các phần tử lên 4 */}
          {stats
            .filter((stat) =>
              [
                'OEE (%)',
                'YIELD (%)',
                'UTILISATION (%)',
                'STOP TIME (HOUR)',
                'MTTR (HOUR)',
                'MTBF (HOUR)',
                'INCIDENT (TIMES)',
                'ACCIDENT (TIMES)'
              ].includes(stat.label)
            )
            .map((stat, idx) => (
              <StatCard key={idx} stat={stat} onClick={() => handleOpenModal(stat)} />
            ))}
        </div>
      </div>

      {/* 📝 Modal */}
      {modalOpen && selectedStat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 animate-fade-in-up transition-all duration-300 ease-out">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Chi tiết: {selectedStat.label}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-red-600 text-2xl font-bold"
                title="Đóng"
              >
                &times;
              </button>
            </div>

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
