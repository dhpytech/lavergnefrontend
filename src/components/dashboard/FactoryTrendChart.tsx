"use client";
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  registerables
} from 'chart.js';

ChartJS.register(...registerables);

interface TrendChartProps {
  data: any;
  datasetsConfig: any[];
  type?: 'line' | 'bar';
}

export const FactoryTrendChart = ({ data, datasetsConfig, type = 'line' }: TrendChartProps) => {
  const months = Object.keys(data || {}).sort();

  const chartData = {
    labels: months,
    datasets: datasetsConfig.map(config => {
      const isBar = type === 'bar';

      return {
        ...config,
        data: months.map(m => {
          const keys = config.dataPath.split('.');
          let value = data[m];
          for (const key of keys) {
            if (value && value[key] !== undefined) {
              value = value[key];
            } else {
              value = 0;
              break;
            }
          }
          return value;
        }),
        // TỰ ĐỘNG ĐIỀU CHỈNH MÀU ĐỂ TRÁNH BỊ MỜ
        // Nếu là Bar: Dùng màu đậm (0.8 opacity) để cột rõ ràng
        // Nếu là Line: Giữ nguyên màu cấu hình (thường là 0.05 để fill nhẹ bên dưới)
        backgroundColor: isBar
          ? config.borderColor.replace('rgb', 'rgba').replace(')', ', 0.8)')
          : config.backgroundColor,

        // Cấu hình riêng cho Bar để nhìn hiện đại hơn
        borderRadius: isBar ? 6 : 0,
        borderWidth: isBar ? 1 : 2,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
        // tension: 0.4, // Độ mượt của đường Line
      };
    }),
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        callbacks: {
          label: (context: any) => ` ${context.dataset.label}: ${context.raw.toLocaleString()} kg`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10, weight: '600' }, color: '#94a3b8' }
      },
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
        ticks: {
          font: { size: 10, weight: '600' },
          color: '#94a3b8',
          callback: (val: any) => val.toLocaleString()
        }
      },
    },
    animation: { duration: 400 }
  };

  return (
    <div className="h-full w-full">
      {type === 'line' ? (
        <Line data={chartData} options={options}/>
      ) : (
        <Bar data={chartData} options={options}/>
      )}
    </div>
  );
};
