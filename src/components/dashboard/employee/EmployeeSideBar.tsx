"use client";
import { Line, Bar } from 'react-chartjs-2';
import {Chart as ChartJS, registerables} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(...registerables, ChartDataLabels);

const MiniChart = ({ data, activeEmp, metricPath, color, type = 'line' }: any) => {
  const months = Object.keys(data || {}).sort();
  return (
    <div className="h-12 w-full mt-2">
        {type === "line" ? (
        <Line
            data={{
              labels: months,
              datasets: [{
                data: months.map(m => data[m].DETAILS?.[activeEmp]?.[metricPath] ?? 0),
                borderColor: color,
                borderWidth: 2,
                fill:true,
                pointRadius: 0,
                tension: 0.1
              }]
            } as any}
            options={{
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
                  tooltip: { enabled: false }
              },
              scales: {
                  x: { display: false },
                  y: { display: true } }
            }}
          />
        ):(
        <Bar
            data={{
              labels: months,
              datasets: [{
                data: months.map(m => data[m].DETAILS?.[activeEmp]?.[metricPath] ?? 0),
                borderColor: color,
                borderWidth: 2,
                backgroundColor: type === 'bar' ? color : `${color}10`,
                fill:true,
                pointRadius: 0,
                tension: 0.1
              }]
            } as any}
            options={{
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
                  tooltip: { enabled: false }
              },
              scales: {
                  x: { display: false },
                  y: { display: true } }
            }}
          />
        )}
    </div>
  );
};

export const EmployeeSidebar = ({ data, activeEmp, activeId, onSelect, configs = [], type }: any) => (
  <aside className="w-[300px] p-6 border-l bg-white shrink-0 overflow-y-auto h-full">
    <div className="space-y-4">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Metrics</p>
      {configs.map((cfg: any) => (
        <div
          key={cfg.id}
          onClick={() => onSelect(cfg.id)}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeId === cfg.id ? 'border-blue-500 bg-blue-50/30' : 'bg-white hover:border-slate-300'
          }`}
        >
          <span className={`text-[10px] font-black uppercase ${activeId === cfg.id ? 'text-blue-600' : 'text-slate-500'}`}>
            {cfg.label}
          </span>
          <MiniChart data={data} activeEmp={activeEmp} metricPath={cfg.path} color={cfg.color} type={type}/>
        </div>
      ))}
    </div>
  </aside>
);
