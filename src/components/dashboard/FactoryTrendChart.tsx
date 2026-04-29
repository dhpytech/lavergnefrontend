"use client";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  registerables
} from 'chart.js';

// Đăng ký để sửa lỗi "category is not a registered scale"
ChartJS.register(...registerables);

export const FactoryTrendChart = ({ data }: { data: any }) => {
  const months = Object.keys(data);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Tổng Sản Lượng (kg)',
        data: months.map(m => data[m].SUMMARY.total_prod),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Tổng Phế Phẩm (kg)',
        data: months.map(m => data[m].SUMMARY.total_scrap),
        borderColor: '#ef4444',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
      }
    ]
  };

  return (
    <div className="h-[400px] w-full">
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top' } }
        }}
      />
    </div>
  );
};
