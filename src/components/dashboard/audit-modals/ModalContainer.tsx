// components/dashboard/audit-modals/ModalContainer.tsx
import React, { useState, useEffect } from 'react'; // Thêm useEffect
import FilterHeader, { COLUMNS } from './FilterHeader';

export default function ModalContainer({ label, initialDates, initialShift, onClose, rawRecords, children }: any) {
  const [visibleColumns, setVisibleColumns] = useState<string[]>(COLUMNS);
  const [displayRecords, setDisplayRecords] = useState(rawRecords || []);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: initialDates?.from || '',
    toDate: initialDates?.to || '',
    sku: 'All',
    shift: initialShift || 'Total'
  });

  const handleRefreshData = async (newFilters: any) => {
    setLoading(true);
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://gunicorn-lavergnebackendwsgi-production.up.railway.app';
      const res = await fetch(`${BASE_URL}/dashboard/maris/?start=${newFilters.fromDate}&end=${newFilters.toDate}`);
      const json = await res.json();
      // Đảm bảo json.records tồn tại, nếu không dùng json.results tùy theo API của bạn
      setDisplayRecords(json.records || json.results || []);
      setFilters(newFilters);
    } catch (error) {
      console.error("Refresh Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Tự động fetch dữ liệu lần đầu tiên khi Modal mount
  useEffect(() => {
    handleRefreshData(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
      <div className="bg-[#f1f5f9] rounded-[2rem] shadow-2xl w-full max-w-[98vw] h-[95vh] flex flex-col overflow-hidden border border-slate-300">
        <div className="px-8 py-4 bg-[#0f172a] text-white flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="bg-blue-600 px-3 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">Audit Log Detail</span>
            <h2 className="text-sm font-bold uppercase text-blue-400">{label}</h2>
            {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin ml-2" />}
          </div>
          <button onClick={onClose} className="w-10 h-10 hover:bg-white/10 rounded-full transition-all text-2xl font-light">&times;</button>
        </div>

        <FilterHeader
          initialDates={{ from: filters.fromDate, to: filters.toDate }}
          visibleColumns={visibleColumns}
          onToggleColumn={(col: string) => setVisibleColumns(prev => prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col])}
          onFilterChange={handleRefreshData}
        />

        <div className="flex-1 overflow-auto bg-white m-4 rounded-2xl border border-slate-200 shadow-inner p-2">
          {React.Children.map(children, child =>
            React.isValidElement(child as any) ? React.cloneElement(child as any, {
              records: displayRecords,
              visibleColumns,
              filterCriteria: filters
            } as any) : child
          )}
        </div>
      </div>
    </div>
  );
}
