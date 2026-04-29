'use client';

import { useRouter } from 'next/navigation';
import {
  Activity,
  TrendingUp,
  Cpu,
  Package,
  ChevronRight,
  FileJson,
  ShieldCheck,
  MonitorDot
} from 'lucide-react';

// Cấu trúc dữ liệu được chuẩn hóa theo tiêu chuẩn công nghiệp (IIoT/MES)
const dashboardGroups = [
  {
    title: "Operational Overview",
    description: "Real-time monitoring of active production lines and plant output.",
    items: [
      { label: 'MARIS PRODUCTION', icon: <Activity size={24} />, path: '/dashboard/maris-db', color: 'text-blue-600', bg: 'bg-blue-50', border: 'hover:border-blue-400' },
      { label: 'BAGGING OPERATIONS', icon: <Package size={24} />, path: '/dashboard/bagging-db', color: 'text-amber-600', bg: 'bg-amber-50', border: 'hover:border-amber-400' },
      { label: 'METAL PROCESSING', icon: <Cpu size={24} />, path: '/dashboard/metal-db', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'hover:border-emerald-400' },
    ]
  },
  {
    title: "Strategic Analytics",
    description: "Performance trends, statistical forecasting, and efficiency modeling.",
    items: [
      { label: 'PERFORMANCE TRENDS', icon: <TrendingUp size={24} />, path: '/dashboard/maris-trendline', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'hover:border-indigo-400' },
    ]
  },
  {
    title: "System Administration",
    description: "Granular entry logs and raw data reconciliation for technical audits.",
    items: [
      { label: 'MARIS DETAILS', icon: <FileJson size={24} />, path: '/dashboard/maris-detail-db', color: 'text-slate-600', bg: 'bg-slate-100', border: 'hover:border-slate-400' },
      { label: 'BAGGING DETAILS', icon: <FileJson size={24} />, path: '/dashboard/bagging-detail-db', color: 'text-slate-600', bg: 'bg-slate-100', border: 'hover:border-slate-400' },
      { label: 'METAL DETAILS', icon: <FileJson size={24} />, path: '/dashboard/metal-detail-db', color: 'text-slate-600', bg: 'bg-slate-100', border: 'hover:border-slate-400' },
    ]
  }
];

export default function InformationPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-12 font-sans selection:bg-blue-100">
      <div className="max-w-6xl mx-auto">

        {/* Tiêu đề tổng (Professional Header) */}
        <header className="mb-16 border-b border-slate-200 relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <MonitorDot size={24} />
            </div>
            <span className="text-xs font-black text-blue-600 tracking-[0.3em] uppercase">
              Lavergne Industrial System
            </span>
          </div>

          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">
            Production <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Control Center</span>
          </h1>

          {/* Badge trạng thái hệ thống */}
          <div className="absolute top-0 right-0 hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">System Live</span>
          </div>
        </header>

        {/* Nội dung chính chia theo Section */}
        <main className="space-y-20">
          {dashboardGroups.map((group, groupIndex) => (
            <section
              key={groupIndex}
              className="animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both"
              style={{ animationDelay: `${groupIndex * 150}ms` }}
            >
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                    {group.title}
                    <span className="h-px w-12 bg-slate-300 hidden sm:block"></span>
                  </h2>
                  <p className="text-sm text-slate-500 mt-1 italic">{group.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.items.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => router.push(item.path)}
                    className={`group flex items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 ${item.border}`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`p-4 rounded-xl ${item.bg} ${item.color} group-hover:bg-blue-600 group-hover:text-white transition-all duration-300`}>
                        {item.icon}
                      </div>
                      <div className="text-left">
                        <span className="block text-sm font-black text-slate-700 group-hover:text-blue-700 transition-colors tracking-wide">
                          {item.label}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                            View Insights
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1.5 transition-all" />
                  </button>
                ))}
              </div>
            </section>
          ))}
        </main>

        {/* Footer Section */}
        <footer className="mt-32 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 text-slate-400">
            <ShieldCheck size={20} />
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase">
              Lavergne Viet Nam Infrastructure
            </p>
          </div>
          <div className="flex gap-4">
            <button className="text-[10px] font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">Documentation</button>
            <span className="text-slate-300">|</span>
            <button className="text-[10px] font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">Support</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
