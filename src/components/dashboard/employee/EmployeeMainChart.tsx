"use client";
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';


ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler, ChartDataLabels,
);

interface Props {
  data: any;
  activeEmps: string[];
  metricPath: string;
  label: string;
  type: 'line' | 'bar';
}

// Bảng màu cố định để đồng bộ giữa Slicer và Biểu đồ
const CHART_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
];

export const EmployeeMainChart = ({ data, activeEmps, metricPath, label, type = 'line' }: Props) => {
  // Lấy danh sách tháng và sắp xếp theo thời gian
  const months = Object.keys(data || {}).sort();

  const datasets = activeEmps.map((emp, index) => {
    const color = CHART_COLORS[index % CHART_COLORS.length];

    return {
      label: emp,
      data: months.map(m => data[m].DETAILS?.[emp]?.[metricPath] ?? 0),

      borderColor: color,
      backgroundColor: type === 'bar' ? color : `${color}10`,
      fill: type === 'line',
      tension: 0.1,
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 2,

      borderRadius: type === 'bar' ? 4 : 0,
    };
  });

  const chartData = {
    labels: months,
    datasets: datasets,
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },

      datalabels: {
        display: true,
        align: 'top',
        anchor: 'end',
        offset: 4,
        color: '#64748b',
        font: {
          size: 15,
          weight: 'bold',
        },
        formatter: (value: number) => {
          return value > 0 ? value.toLocaleString() : '';
        }
      },

      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 12 },
        cornerRadius: 8,
        usePointStyle: true,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f1f5f9',
          drawBorder: false,
        },
        ticks: {
          font: { size: 10, weight: '600' },
          color: '#94a3b8',
          callback: (value: number) => value.toLocaleString() + ' kg',
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 10, weight: '600' },
          color: '#94a3b8',
        }
      }
    },
    // Hiệu ứng mượt mà khi chuyển đổi type
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      {type === 'line' ? (
        <Line data={chartData} options={options} />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};
