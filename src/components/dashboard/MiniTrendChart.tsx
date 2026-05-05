"use client";
import {Bar, Line} from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(...registerables, ChartDataLabels);

interface MiniChartProps {
  data: any;
  title: string;
  datasetsConfig: any[];
  type?: 'line' | 'bar';
}

export const MiniTrendChart = ({ data, title, datasetsConfig,type = 'line' }: MiniChartProps) => {
  const months = Object.keys(data);

  const chartData = {
    labels: months,
    datasets: datasetsConfig.map(config => ({
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
      borderWidth: 1.5,
      pointRadius: 1,
      backgroundColor: type == 'bar'
        ? config.borderColor.replace('rgb', 'rgba').replace(')', ', 0.8)')
        : config.backgroundColor,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: {
        display: false,
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

      title: { display: false },
      tooltip: { enabled: false },
      grid: { display: true },
      },

    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          drawOnChartArea: true,
          drawTicks: false,
          color: '#f1f5f9'
        },
        ticks: {
          display: false
        },
        border: {
          display: false
        }
      },
      y: {
        display: true,
        grid: {
          display: true,
          drawOnChartArea: true,
          drawTicks: false,
          color: '#f1f5f9'
        },
        ticks: {
          display: true
        },
        border: {
          display: false
        }
      },
    },
    elements: {
    line: {
      tension: 0.1
      }
    }
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
