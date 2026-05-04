"use client";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

interface TrendChartProps {
  data: any;
  title: string;
  datasetsConfig: any[];
}

export const FactoryTrendChart = ({ data, title, datasetsConfig }: TrendChartProps) => {
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
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: title,
        font: { size: 16, weight: 'bold' },
        padding: { bottom: 20 },
      },
      legend: {
        display:false,
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: { display: true, text: 'MONTH', align: 'center' as const, padding: 30, font: {weight: 'bold', size: 15} },
      },
      y: {
        beginAtZero: true,
        title: { display: false, text: 'KG', align: 'center' as const, padding: 30, font: {weight: 'bold'} },
      },
    },
  };

  return (
    <div className="h-[400px] w-full">
      <Line data={chartData} options={options}/>
    </div>
  );
};
