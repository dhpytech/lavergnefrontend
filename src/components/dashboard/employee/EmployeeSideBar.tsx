"use client";
import { Line, Bar } from 'react-chartjs-2';
import {Chart as ChartJS, registerables} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels'
import MiniChart from './EmployeeMiniChart'

ChartJS.register(...registerables, ChartDataLabels);

export const EmployeeSidebar = ({ data, activeEmps, activeId, onSelect, configs = [], type }: any) => (
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
          <MiniChart key={`${activeEmps.join('-')}-${cfg.id}`} data={data} activeEmps={activeEmps} metricPath={cfg.path} color={cfg.color} type={type}/>
        </div>
      ))}
    </div>
  </aside>
);
