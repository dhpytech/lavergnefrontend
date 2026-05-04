"use client";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const EmployeeComparisonChart = ({ data, selectedEmps, metric = 'prod' }: any) => {
  if (!data || selectedEmps.length === 0) return null;

  const months = Object.keys(data).sort();
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

  const datasets = selectedEmps.map((emp: string, i: number) => ({
    label: emp,
    data: months.map(m => data[m].DETAILS?.[emp]?.[metric] ?? 0),
    borderColor: colors[i % colors.length],
    tension: 0.4,
    borderWidth: 3,
    pointRadius: 4,
  }));

  return (
    <div className="h-[450px]">
      <Line
        data={{ labels: months, datasets }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' as const, labels: { boxWidth: 12, font: { weight: 'bold' } } } }
        }}
      />
    </div>
  );
};
