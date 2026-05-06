"use client";
import { Line, Bar } from 'react-chartjs-2';
import {Chart as ChartJS, registerables} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(...registerables, ChartDataLabels);

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

const MiniChart = ({ data, activeEmps, metricPath, type = 'line' }: any) => {
  const months = Object.keys(data || {}).sort();

  // Tạo datasets cho TẤT CẢ nhân viên đang active
  const datasets = activeEmps.map((emp: string, index: number) => {
    const color = CHART_COLORS[index % CHART_COLORS.length];
    return {
      label: emp,
      data: months.map(m => data[m].DETAILS?.[emp]?.[metricPath] ?? 0),
      borderColor: color,
      backgroundColor: type === 'bar' ? color : `${color}10`,
      borderWidth: 1.5,
      fill: false,
      pointRadius: 0,
      tension: 0.1,
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
      legend: { display: false },
      datalabels: { display: false }, // Mini chart nên tắt cái này để tránh rối
      tooltip: { enabled: false }
    },
    scales: {
      x: { display: false },
      y: {
        display: true,
        beginAtZero: true,
        grace: '10%'
      }
    },
    elements: {
      line: { tension: 0.1 }
    }
  };

  return (
    <div className="h-12 w-full mt-2">
      {type === "line" ? (
        <Line data={chartData} options={options} />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default MiniChart;