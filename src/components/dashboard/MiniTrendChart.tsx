"use client";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

interface MiniChartProps {
  data: any;
  title: string;
  datasetsConfig: any[];
}

export const MiniTrendChart = ({ data, title, datasetsConfig }: MiniChartProps) => {
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
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { enabled: false },
      grid: { display: true },
      },

    scales: {
      x: { display: false},
      y: { display: true },
      },
    elements: {
    line: {
      tension: 0.3
      }
    }
  };
  return (
    <div className="h-full w-full">
      <Line data={chartData} options={options} />
    </div>
  );
};
