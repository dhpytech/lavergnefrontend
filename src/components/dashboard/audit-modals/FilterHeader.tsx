// components/dashboard/audit-modals/FilterHeader.tsx
import { useState, useEffect } from 'react';
import { Calendar, Tag, Hash, Clock } from 'lucide-react';

export const COLUMNS = ["Product Code", "Good Product", "DLNC", "Total", "Reject", "Scrap", "Screen Changer", "VisLab"];

export default function FilterHeader({ initialDates, visibleColumns, onToggleColumn, onFilterChange }: any) {
  const [localFilters, setLocalFilters] = useState({
    fromDate: initialDates?.from || '',
    toDate: initialDates?.to || '',
    sku: 'All',
    shift: 'Total'
  });

  useEffect(() => {
    setLocalFilters(prev => ({
      ...prev,
      fromDate: initialDates?.from || prev.fromDate,
      toDate: initialDates?.to || prev.toDate
    }));
  }, [initialDates]);

  return (
    <div className="bg-[#e2e5e9] p-6 border-b border-slate-300">
      {/* Row 1: Filters */}
      <div className="flex flex-wrap gap-8 items-end mb-6">
        <div className="flex gap-4">
          {/* From Date */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-8 tracking-wider">From</label>
            <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-lg border border-slate-300 shadow-sm focus-within:border-blue-400">
              <Calendar className="w-4 h-4 text-blue-600" />
              <input
                type="date"
                value={localFilters.fromDate}
                onChange={e => setLocalFilters({...localFilters, fromDate: e.target.value})}
                className="text-xs font-bold outline-none bg-transparent"
              />
            </div>
          </div>
          {/* To Date */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-8 tracking-wider">To Date</label>
            <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-lg border border-slate-300 shadow-sm focus-within:border-blue-400">
              <Calendar className="w-4 h-4 text-blue-600" />
              <input
                type="date"
                value={localFilters.toDate}
                onChange={e => setLocalFilters({...localFilters, toDate: e.target.value})}
                className="text-xs font-bold outline-none bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* Product Code */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-500 uppercase ml-8 tracking-wider">Product Code</label>
          <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-lg border border-slate-300 shadow-sm w-48 focus-within:border-blue-400">
            <Tag className="w-4 h-4 text-blue-600" />
            <select
              value={localFilters.sku}
              onChange={e => setLocalFilters({...localFilters, sku: e.target.value})}
              className="text-xs font-bold outline-none w-full bg-transparent appearance-none cursor-pointer"
            >
              <option value="All">All Products</option>
            </select>
          </div>
        </div>

        {/* Shift - ĐÃ BỔ SUNG THEO YÊU CẦU */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-500 uppercase ml-8 tracking-wider">Shift</label>
          <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-lg border border-slate-300 shadow-sm w-40 focus-within:border-blue-400">
            <Clock className="w-4 h-4 text-blue-600" />
            <select
              value={localFilters.shift}
              onChange={e => setLocalFilters({...localFilters, shift: e.target.value})}
              className="text-xs font-bold outline-none w-full bg-transparent appearance-none cursor-pointer uppercase"
            >
              <option value="Total"># Total</option>
              <option value="Day">Day</option>
              <option value="Night">Night</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => onFilterChange(localFilters)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl text-[10px] font-black shadow-lg shadow-blue-200 transition-all active:scale-95 uppercase ml-auto"
        >
          View Data
        </button>
      </div>

      {/* Row 2: Checkboxes */}
      <div className="flex flex-wrap gap-x-10 gap-y-4 border-t border-slate-300 pt-5">
        {COLUMNS.map(col => (
          <label key={col} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={visibleColumns.includes(col)}
              onChange={() => onToggleColumn(col)}
              className="w-4 h-4 accent-blue-600 rounded border-slate-300 transition-all group-hover:scale-110"
            />
            <span className={`text-[11px] font-black uppercase transition-colors ${visibleColumns.includes(col) ? 'text-slate-800' : 'text-slate-400'}`}>
              {col}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
