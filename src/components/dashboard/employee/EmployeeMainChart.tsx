"use client";
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler, ChartDataLabels,
    annotationPlugin,
);

interface Props {
  data: any;
  activeEmps: string[];
  metricPath: string;
  label: string;
  type: 'line' | 'bar';
  isPercentage?: boolean;
  upperLimit?: number;
  underLimit?: number;
}

const CHART_COLORS = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4',
];

export const EmployeeMainChart = ({ data, activeEmps, metricPath, label, type = 'line', isPercentage = false,upperLimit, underLimit}: Props) => {
  const months = Object.keys(data || {}).sort();
  const datasets = activeEmps.map((emp, index) => {
    const color = CHART_COLORS[index % CHART_COLORS.length];
    return {
      label: emp,
      data: months.map(m => data[m].DETAILS?.[emp]?.[metricPath] ?? 0),
      borderColor: color,
      backgroundColor: type === 'line' ? color : `${color}`,
      fill: type === 'bar',
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
      annotation: {
        annotations: {
          upperLine: {
            type: 'line',
            yMin: upperLimit,
            yMax: upperLimit,
            borderColor: 'rgb(239, 68, 68)',
            borderWidth: 2,
            borderDash: [6, 6],
            label: {
              display: true,
              content: `Max: ${upperLimit?.toLocaleString()}`,
              position: 'end',
              backgroundColor: 'rgba(239, 68, 68, 0.8)',
              font: { size: 10, weight: 'bold' }
            }
          },

          underLine: {
            type: 'line',
            yMin: underLimit,
            yMax: underLimit,
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 2,
            borderDash: [6, 6],
            label: {
              display: true,
              content: `Min: ${underLimit?.toLocaleString()}`,
              position: 'start',
              backgroundColor: 'rgba(16, 185, 129, 0.8)',
              font: { size: 10, weight: 'bold' }
            }
          }
        }
      },
      legend: {
        display: true,
        label:{
          usePointStyle: false,
          boxWidth: 40,
          boxHeight: 12,
        },
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
          if (value === 0) return '';
          return isPercentage
              ? `${(value*100).toFixed(1)}%`
              : value.toLocaleString();
        }
      },

      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 12 },
        cornerRadius: 8,
        usePointStyle: true,
        callback: {
          label: (context: any) => {
            const val = context.raw;
            const label = context.dataset.label || '';
            return isPercentage
            ? `${label}: ${(val * 100).toFixed(2)}%`
            :  `${label}: ${val.toLocaleString()}`;
          }
        }
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
          callback: function (value: number) {
            if (isPercentage) {
              return (value * 100).toFixed(0) + '%';
            }
            return value.toLocaleString();
          }
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
