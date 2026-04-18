'use client'
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import {
  Plus, Send, Database, Zap, Trash2, Edit2,
  RefreshCw, Filter, ChevronRight, X, Save, Search
} from 'lucide-react';
import MetalFormUnit from '@/src/components/metal/metalFormUnit';
import { useMetalMetadata } from '@/src/hooks/useMetalMetadata';

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/entries/metal/`;

export default function MetalPage() {
  const { employees, productCodes, actions, loading: metaLoading } = useMetalMetadata();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // States cho bộ lọc
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { register, control, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setRecords(res.data);
    } catch (err) {
      console.error("Lỗi tải dữ liệu Metal:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Xử lý Filter
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const dateMatch = (!startDate || new Date(r.date) >= new Date(startDate)) &&
                        (!endDate || new Date(r.date) <= new Date(endDate));
      const searchMatch = !searchTerm ||
                         r.lot_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.employee?.toLowerCase().includes(searchTerm.toLowerCase());
      return dateMatch && searchMatch;
    });
  }, [records, startDate, endDate, searchTerm]);

  const handleOpenModal = (item: any = null) => {
    if (item) {
      setEditingId(item.id);
      reset({ entries: [item] });
    } else {
      setEditingId(null);
      reset({
        entries: [{
          date: new Date().toISOString().split('T')[0],
          employee: '', shift: 'DAY', lot_number: '',
          production_data: [{ productCode: '', action: '', inputQty: 0, outputQty: 0 }]
        }]
      });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data: any) => {
    const payload = data.entries[0];
    try {
      if (editingId) {
        await axios.put(`${API_URL}${editingId}/`, payload);
      } else {
        await axios.post(API_URL, payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (e) {
      alert("Lỗi khi lưu dữ liệu Metal!");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Xác nhận xóa bản ghi Metal này?")) return;
    try {
      await axios.delete(`${API_URL}${id}/`);
      setRecords(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      alert("Xóa thất bại!");
    }
  };

  if (metaLoading) return (
    <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="h-screen w-full bg-[#F8FAFC] flex flex-col overflow-hidden font-sans">
      {/* HEADER TỐI GIẢN - PHONG CÁCH ENTERPRISE */}
      <header className="flex-none bg-[#0F172A] text-white px-6 py-4 flex justify-between items-center shadow-2xl z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg cursor-pointer hover:bg-blue-500 transition-all shadow-lg" onClick={fetchData}>
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">
              Lavergne VN <span className="text-blue-400 not-italic">Metal Center</span>
            </h1>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2"
          >
            <Plus size={16} strokeWidth={3}/> New Metal Lot
          </button>
        </div>

        {/* BỘ LỌC TÍCH HỢP */}
        <div className="flex items-center bg-white/10 rounded-xl px-4 py-2 gap-4 border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2 border-r border-white/10 pr-4">
            <Search size={16} className="text-blue-400"/>
            <input
              placeholder="Search Lot/Operator..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-[11px] font-bold outline-none text-white placeholder:text-white/30 w-40"
            />
          </div>
          <Filter size={16} className="text-blue-400"/>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-transparent border-none text-[11px] font-bold outline-none text-white [color-scheme:dark]"/>
          <ChevronRight size={14} className="text-white/30"/>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-transparent border-none text-[11px] font-bold outline-none text-white [color-scheme:dark]"/>
        </div>
      </header>

      {/* DANH SÁCH BẢN GHI */}
      <main className="flex-1 p-4 lg:p-6 overflow-hidden flex flex-col">
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="overflow-auto flex-1 custom-scrollbar">
            <table className="w-full border-collapse table-fixed min-w-[1200px]">
              <thead className="sticky top-0 z-20 bg-[#F8FAFC] border-b border-slate-200">
                <tr className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <th className="px-6 py-4 w-[150px]">Date / Lot</th>
                  <th className="px-6 py-4 w-[180px]">Operator / Shift</th>
                  <th className="px-6 py-4 text-left">Processing Details</th>
                  <th className="px-6 py-4 w-[120px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((item) => (
                  <tr key={item.id} className="group hover:bg-blue-50/30 transition-all">
                    <td className="px-6 py-6 align-top">
                      <p className="text-sm font-black text-slate-900">{item.date}</p>
                      <p className="text-[10px] font-bold text-blue-600 mt-1 uppercase tracking-tighter">#{item.lot_number || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-6 align-top">
                      <p className="font-black text-slate-800 text-xs uppercase">{item.employee}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[9px] font-black uppercase italic">
                        {item.shift}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        {item.production_data?.map((p: any, idx: number) => (
                          <div key={idx} className="bg-white border border-slate-100 p-3 rounded-xl flex items-center justify-between shadow-sm group-hover:border-blue-200 transition-colors">
                            <div className="flex items-center gap-4">
                              <span className="bg-indigo-600 text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-tighter">
                                {p.action || 'PROCESS'}
                              </span>
                              <span className="font-black text-slate-800 text-xs">{p.productCode}</span>
                            </div>
                            <div className="flex gap-8 text-[11px] font-mono pr-4">
                              <span>In: <b className="text-slate-900">{p.inputQty}</b></span>
                              <span>Out: <b className="text-blue-600">{p.outputQty}</b></span>
                              <span>Loss: <b className="text-red-500">{Number(p.inputQty) - Number(p.outputQty)}</b></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-6 align-top text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(item)} className="p-2.5 bg-white border border-slate-200 rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                          <Edit2 size={16}/>
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2.5 bg-white border border-slate-200 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRecords.length === 0 && (
              <div className="p-20 text-center flex flex-col items-center gap-4">
                <Database size={48} className="text-slate-200"/>
                <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em]">No metal records found</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL FORM - CẤU TRÚC ĐỒNG BỘ MARIS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#F1F5F9] w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-[24px] shadow-2xl border border-white flex flex-col">
            <div className={`sticky top-0 z-10 px-8 py-5 flex justify-between items-center ${editingId ? 'bg-indigo-600' : 'bg-[#0F172A]'} text-white shadow-lg`}>
              <div className="flex items-center gap-3">
                <Zap size={20} className="text-yellow-400 fill-yellow-400"/>
                <span className="text-xs font-black uppercase tracking-widest">
                  {editingId ? `Edit Metal Record #${editingId}` : 'New Metal Production Lot'}
                </span>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors"><X size={20}/></button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
              <MetalFormUnit
                index={0}
                control={control}
                register={register}
                metadata={{ employees, productCodes, actions }}
                onRemove={() => setIsModalOpen(false)}
              />
            </div>

            <div className="p-6 bg-white border-t border-slate-200 flex justify-end">
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-black text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center gap-3 disabled:bg-slate-300"
              >
                {isSubmitting ? <RefreshCw className="animate-spin" size={18}/> : <Save size={18}/>}
                {editingId ? "Update Lot Entry" : "Synchronize Data"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
