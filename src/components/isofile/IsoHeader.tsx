"use client";

import { Calendar, RefreshCcw, FileSpreadsheet, Clock } from 'lucide-react';

export default function IsoHeader({ filters, setFilters, onRefresh, loading }: any) {
  return (
    <div className="bg-[#e2e8f0] p-6 rounded-[2rem] border border-slate-300 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <span className="bg-[#2563eb] text-white px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm">
          ISO Report
        </span>
        <h1 className="font-bold text-slate-800 uppercase text-sm tracking-tight">Monthly Production Matrix</h1>
      </div>

      <div className="flex flex-wrap gap-6 items-end">
        <div className="space-y-1.5">
          <p className="text-[10px] font-black text-slate-500 uppercase ml-3 tracking-widest">Report Period</p>
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-300 w-60 shadow-inner">
            <Calendar className="w-4 h-4 text-blue-600" />
            <input
              type="month"
              className="text-xs font-bold outline-none w-full bg-transparent cursor-pointer"
              value={`${filters.year}-${String(filters.month).padStart(2, '0')}`}
              onChange={(e) => {
                const [y, m] = e.target.value.split('-');
                setFilters({...filters, year: parseInt(y), month: parseInt(m)});
              }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-[10px] font-black text-slate-500 uppercase ml-3 tracking-widest">Work Shift</p>
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-300 w-48 shadow-inner">
            <Clock className="w-4 h-4 text-blue-600" />
            <select
              className="text-xs font-bold outline-none w-full bg-transparent cursor-pointer appearance-none"
              value={filters.shift}
              onChange={(e) => setFilters({...filters, shift: e.target.value})}
            >
              <option value="total"># TOTAL</option>
              <option value="Day">DAY SHIFT</option>
              <option value="Night">NIGHT SHIFT</option>
            </select>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="bg-[#2563eb] hover:bg-blue-700 text-white px-8 py-3 rounded-2xl text-[10px] font-black shadow-lg flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 uppercase"
        >
          <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          View Report
        </button>

        <button className="bg-[#059669] hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl text-[10px] font-black shadow-lg flex items-center gap-2 ml-auto uppercase transition-all active:scale-95">
          <FileSpreadsheet className="w-3.5 h-3.5" />
          Export Excel
        </button>
      </div>
    </div>
  );
}
