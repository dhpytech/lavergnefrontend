"use client";
import { Line } from 'react-chartjs-2';

interface MiniCardProps {
  title: string;
  value: string | number;
  unit: string;
  color: string;
  chartData: number[];
}

export const StatMiniCard = ({ title, value, unit, color, chartData }: MiniCardProps) => {
  const data = {
    labels: chartData.map((_, i) => i),
    datasets: [{
      data: chartData,
      borderColor: color,
      backgroundColor: color + '20', // Thêm độ trong suốt cho vùng fill
      fill: true,
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.4,
    }]
  };

  const options = {
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-32 hover:border-blue-200 transition-colors">
      <div>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-black text-slate-800">{typeof value === 'number' ? value.toLocaleString() : value}</span>
          <span className="text-slate-400 text-xs font-medium">{unit}</span>
        </div>
      </div>
      <div className="h-10 w-full">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};