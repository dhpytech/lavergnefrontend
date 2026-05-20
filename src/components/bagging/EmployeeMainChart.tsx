// src/components/dashboard/bagging/EmployeeMainChart.tsx
"use client";

import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ChartDataLabels);

interface MainChartProps {
  timelineData: any[];
  selectedEmps: string[];
  activeMetricId: string;
  chartType: 'line' | 'bar';
}

export const EmployeeMainChart = ({ timelineData, selectedEmps, activeMetricId, chartType }: MainChartProps) => {
  const isPercentage = activeMetricId === 'RATE';

  // 1. Trục X hiển thị danh sách các Tháng / Các Ngày
  const chartLabels = timelineData.map(d => d.label);

  // Bảng màu động để phân biệt các nhân viên trên biểu đồ
  const colors = [
    { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.9)' },
    { border: '#10b981', bg: 'rgba(16, 185, 129, 0.9)' },
    { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.9)' },
    { border: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.9)' },
    { border: '#ec4899', bg: 'rgba(236, 72, 153, 0.9)' },
    { border: '#06b6d4', bg: 'rgba(6, 182, 212, 0.9)' },
    { border: '#f97316', bg: 'rgba(249, 115, 22, 0.9)' },
    { border: '#14b8a6', bg: 'rgba(20, 184, 166, 0.9)' },
    { border: '#a855f7', bg: 'rgba(168, 85, 247, 0.9)' },
    { border: '#64748b', bg: 'rgba(100, 116, 137, 0.9)' },
    { border: '#84cc16', bg: 'rgba(132, 204, 22, 0.9)' },
    { border: '#e11d48', bg: 'rgba(225, 29, 72, 0.9)' },
  ];

  // 2. Mỗi nhân viên tạo thành một đường xu hướng hoặc cột xếp chồng chạy qua các tháng
  const datasets = selectedEmps.map((empName, index) => {
    const color = colors[index % colors.length];

    // Trích xuất chỉ số của nhân viên này qua từng mốc thời gian trên trục X
    const dataByTimeline = timelineData.map(period => {
      const empData = period.details.find((e: any) => e.name === empName);
      if (!empData) return 0; // Nếu tháng đó nhân viên không đi làm thì trả về 0

      if (activeMetricId === 'OUT') return empData.out;
      if (activeMetricId === 'RATE') return empData.rate;
      return empData.time;
    });

    return {
      label: empName,
      data: dataByTimeline,
      borderColor: color.border,
      backgroundColor: color.bg,
      borderWidth: 2,
      borderRadius: chartType === 'bar' ? 4 : 0,
      tension: 0.1,
      pointRadius: chartType === 'line' ? 4 : 0,
      pointBackgroundColor: color.border,
      fill: false // Không tô vùng dưới đường để tránh bị đè mắt nhìn khi có nhiều người
    };
  });

  const chartData = { labels: chartLabels, datasets };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: { font: { size: 11, weight: '600' }, boxWidth: 12 }
      },
      datalabels: {
        // Chỉ hiển thị số trực tiếp lên cột nếu chọn ít hơn hoặc bằng 3 nhân viên để tránh rối mắt
        display: true,
        anchor: 'end',
        align: 'top',
        color: '#475569',
        font: { size: 12, weight: '700' },
        formatter: (value: number) => {
          if (value === 0) return '';
          return isPercentage ? `${value}%` : Math.round(value).toLocaleString();
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            const val = context.raw;
            const emp = context.dataset.label;
            const unit = (activeMetricId === 'IN'||activeMetricId === 'OUT') ? 'kg' : activeMetricId === 'RATE' ? '%' : 'h';
            return ` ${emp}: ${val.toLocaleString()} ${unit}`;
          }
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
          callback: (val: any) => isPercentage ? `${val}%` : val.toLocaleString()
        }
      }
    },
  };

  const ChartComponent = chartType === 'line' ? Line : Bar;

  return (
    <div className="w-full h-full">
      <ChartComponent data={chartData} options={options} />
    </div>
  );
};
