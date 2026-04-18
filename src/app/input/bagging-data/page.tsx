'use client'
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import {
  RefreshCw, Edit2, Trash2, Plus, Filter,
  ChevronRight, Package, Users, Search,
  Calendar, X, Save, Database, TrendingUp, RotateCcw
} from 'lucide-react';
import BaggingFormUnit from '@/src/components/bagging/baggingFormUnit';
import { useBaggingMetadata } from '@/src/hooks/useBaggingMetadata';

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/entries/bagging/`;

export default function BaggingEnterpriseManager() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Bộ lọc chuyên nghiệp
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const metadata = useBaggingMetadata();
  const { register, control, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setRecords(res.data);
    } catch (err) {
      console.error("Lỗi tải dữ liệu Bagging:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // LOGIC RESET BỘ LỌC
  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setSearchTerm('');
  };

  const isFiltering = useMemo(() => !!(startDate || endDate || searchTerm), [startDate, endDate, searchTerm]);

  // LOGIC LỌC DỮ LIỆU
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const recordDate = new Date(r.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);
      const dateMatch = (!start || recordDate >= start) && (!end || recordDate <= end);

      const searchStr = searchTerm.toLowerCase();
      const searchMatch = !searchTerm ||
        r.employee_1?.toLowerCase().includes(searchStr) ||
        r.employee_2?.toLowerCase().includes(searchStr) ||
        r.lot_number?.toLowerCase().includes(searchStr) ||
        r.production_data?.some((p: any) => p.productCode.toLowerCase().includes(searchStr));

      return dateMatch && searchMatch;
    });
  }, [records, startDate, endDate, searchTerm]);

  // TÍNH TOÁN THỐNG KÊ
  const stats = useMemo(() => {
    return filteredRecords.reduce((acc, curr) => {
      curr.production_data?.forEach((p: any) => {
        acc.totalIn += Number(p.inputQty || 0);
        acc.totalOut += Number(p.outputQty || 0);
      });
      return acc;
    }, { totalIn: 0, totalOut: 0 });
  }, [filteredRecords]);

  const onSubmit = async (formData: any) => {
    const payload = formData.entries[0];
    try {
      if (editingId) {
        await axios.put(`${API_URL}${editingId}/`, payload);
      } else {
        await axios.post(API_URL, payload);
      }
      setIsFormOpen(false);
      setEditingId(null);
      fetchData();
    } catch (e) {
      alert("Lỗi khi lưu dữ liệu!");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Xác nhận xóa bản ghi này?")) return;
    try {
      await axios.delete(`${API_URL}${id}/`);
      fetchData();
    } catch (e) {
      alert("Xóa thất bại!");
    }
  };

  return (
    <div className="h-screen w-full bg-[#F8FAFC] flex flex-col overflow-hidden font-sans">

      {/* HEADER DARK ENTERPRISE */}
      <header className="bg-[#0F172A] text-white shadow-2xl z-50">
        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-700/50">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
              <div className="w-1.5 h-7 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"/>
              Lavergne <span className="text-emerald-400 not-italic font-bold">Bagging Unit</span>
            </h1>

            {/* Search Bar & Reset Button */}
            <div className="flex items-center gap-3">
              <div className="relative group hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors" size={16}/>
                <input
                  type="text"
                  placeholder="Search Operator, Lot, Product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs w-72 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                />
              </div>
              {isFiltering && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-red-500/20 shadow-lg"
                >
                  <RotateCcw size={12}/>
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Date Range Filter */}
            <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-700 shadow-inner">
              <div className="px-3 py-1 flex items-center gap-2 border-r border-slate-700">
                <Calendar size={14} className="text-emerald-400"/>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-transparent text-[11px] font-bold outline-none [color-scheme:dark]"/>
              </div>
              <div className="px-3 py-1 flex items-center gap-2">
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-transparent text-[11px] font-bold outline-none [color-scheme:dark]"/>
              </div>
            </div>

            <button
              onClick={() => { setEditingId(null); reset({ entries: [{ date: new Date().toISOString().split('T')[0], shift: 'DAY', production_data: [] }] }); setIsFormOpen(true); }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg flex items-center gap-2 transition-all active:scale-95"
            >
              <Plus size={16} strokeWidth={3}/> New Lot
            </button>
          </div>
        </div>

        {/* QUICK STATS BAR */}
        <div className="px-6 py-2.5 bg-slate-800/40 flex gap-10 items-center border-b border-slate-700/30 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] uppercase font-black text-slate-500 tracking-tighter text-emerald-400">Filtered: {filteredRecords.length}</span>
          </div>
          <div className="w-px h-4 bg-slate-700"/>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] uppercase font-black text-slate-500 tracking-tighter">Total In:</span>
            <span className="text-xs font-black text-white">{stats.totalIn.toLocaleString()} <small className="text-[10px] font-normal text-slate-500">kg</small></span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] uppercase font-black text-slate-500 tracking-tighter">Total Out:</span>
            <span className="text-xs font-black text-emerald-400">{stats.totalOut.toLocaleString()} <small className="text-[10px] font-normal text-slate-500">kg</small></span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] uppercase font-black text-slate-500 tracking-tighter text-red-400/80">Var:</span>
            <span className="text-xs font-black text-red-400">{(stats.totalIn - stats.totalOut).toLocaleString()}</span>
          </div>
        </div>
      </header>

      {/* MAIN TABLE */}
      <main className="flex-1 p-4 lg:p-6 overflow-hidden">
        <div className="bg-white rounded-2xl shadow-xl h-full flex flex-col overflow-hidden border border-slate-200">
          <div className="overflow-auto flex-1 custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
                <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                  <th className="p-5 w-40">Date / Lot No.</th>
                  <th className="p-5 w-56">Production Team</th>
                  <th className="p-5">Production Details</th>
                  <th className="p-5 w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map(r => (
                  <tr key={r.id} className="hover:bg-blue-50/30 transition-all group">
                    <td className="p-5 align-top">
                      <div className="font-black text-slate-900 text-sm italic">{r.date}</div>
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold mt-1.5 px-2 py-0.5 bg-emerald-50 w-fit rounded-md uppercase tracking-tighter">
                        <Package size={10}/> {r.lot_number || "NO LOT"}
                      </div>
                    </td>
                    <td className="p-5 align-top">
                      <div className="flex flex-col gap-1.5">
                        <span className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase"><Users size={12} className="text-slate-400"/> {r.employee}</span>
                        {r.employee_2 && <span className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase border-t border-dashed border-slate-100 pt-1"><Users size={12} className="text-slate-300"/> {r.employee_2}</span>}
                        <span className="text-[9px] font-black bg-slate-900 text-white w-fit px-2.5 py-0.5 rounded italic mt-1 uppercase tracking-widest">{r.shift}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col gap-2">
                        {r.production_data?.map((p: any, idx: number) => {
                          const eff = p.inputQty > 0 ? (p.outputQty / p.inputQty) * 100 : 0;
                          return (
                            <div key={idx} className="bg-white border border-slate-100 rounded-xl p-3 flex justify-between items-center shadow-sm group-hover:border-emerald-200 transition-colors">
                              <span className="font-black text-slate-800 text-xs tracking-tight">{p.productCode}</span>
                              <div className="flex gap-10 font-mono text-[11px] items-center">
                                <span className="text-slate-400">IN: <b className="text-slate-900">{p.inputQty}</b></span>
                                <span className="text-slate-400">OUT: <b className="text-emerald-600 font-bold">{p.outputQty}</b></span>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black border ${eff >= 98 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                  {eff.toFixed(1)}%
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td className="p-5 text-right align-top">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingId(r.id); reset({ entries: [r] }); setIsFormOpen(true); }} className="p-2.5 bg-white border border-slate-200 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                          <Edit2 size={16}/>
                        </button>
                        <button onClick={() => handleDelete(r.id)} className="p-2.5 bg-white border border-slate-200 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRecords.length === 0 && (
              <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Database size={48} className="text-slate-100"/>
                <div className="text-center">
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No matching records found</p>
                  <button onClick={resetFilters} className="mt-4 text-emerald-500 text-[10px] font-black uppercase hover:underline flex items-center gap-2 mx-auto">
                    <RotateCcw size={12}/> Reset Filter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsFormOpen(false)} />
          <div className="relative bg-[#F1F5F9] w-full max-w-5xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-6 bg-[#0F172A] text-white flex justify-between items-center shadow-lg">
              <span className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-400"/>
                {editingId ? `Edit Record: #${editingId}` : 'New Bagging Entry'}
              </span>
              <button onClick={() => setIsFormOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors"><X size={20}/></button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
              <BaggingFormUnit index={0} control={control} register={register} metadata={metadata} onRemove={() => setIsFormOpen(false)} />
            </div>

            <div className="p-6 bg-white border-t border-slate-200 flex justify-end">
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-black text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center gap-3 disabled:bg-slate-300"
              >
                {isSubmitting ? <RefreshCw className="animate-spin" size={18}/> : <Save size={18}/>}
                {editingId ? "Update Sync" : "Save to DB"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
