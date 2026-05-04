"use client";
import { Line } from 'react-chartjs-2';

const MiniChart = ({ data, activeEmp, metricPath, color }: any) => {
  const months = Object.keys(data || {}).sort();
  return (
    <div className="h-12 w-full mt-2">
      <Line
        data={{
          labels: months,
          datasets: [{
            data: months.map(m => data[m].DETAILS?.[activeEmp]?.[metricPath] ?? 0),
            borderColor: color,
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4
          }]
        } as any}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: { x: { display: false }, y: { display: false } }
        }}
      />
    </div>
  );
};

// Đảm bảo nhận configs từ props
export const EmployeeSidebar = ({ data, activeEmp, activeId, onSelect, configs = [] }: any) => (
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
          <MiniChart data={data} activeEmp={activeEmp} metricPath={cfg.path} color={cfg.color} />
        </div>
      ))}
    </div>
  </aside>
);
