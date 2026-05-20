"use client";

import React from 'react';
import { Bar, Line } from 'react-chartjs-2';

interface MiniTrendChartProps {
  timelineData: any[];
  metricId: string;
  chartType: 'line' | 'bar';
}

export const MiniTrendChart = ({ timelineData, metricId, chartType }: MiniTrendChartProps) => {
  const chartLabels = timelineData.map(t => t.label);
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  const allEmpNames: string[] = [];
  timelineData.forEach(period => {
    period.details.forEach((e: any) => {
      if (!allEmpNames.includes(e.name)) allEmpNames.push(e.name);
    });
  });

  const datasets = allEmpNames.map((empName, index) => {
    const targetColor = colors[index % colors.length];

    const dataByTimeline = timelineData.map(period => {
      const empData = period.details.find((e: any) => e.name === empName);
      if (!empData) return 0;
      if (metricId === 'IN') return empData.in;
      if (metricId === 'OUT') return empData.out;
      if (metricId === 'RATE') return empData.rate;
      return empData.time;
    });

    return {
      data: dataByTimeline,
      borderColor: targetColor,
      backgroundColor: chartType === 'bar' ? targetColor : 'transparent',
      borderWidth: 1.2,
      borderRadius: chartType === 'bar' ? 1 : 0,
      pointRadius: 0,
      tension: 0.2,
      fill: false
    };
  });

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, datalabels: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false, beginAtZero: true } }
  };

  const ChartComponent = chartType === 'line' ? Line : Bar;

  return (
    <div className="w-full h-full">
      <ChartComponent data={{ labels: chartLabels, datasets }} options={options} />
    </div>
  );
};
