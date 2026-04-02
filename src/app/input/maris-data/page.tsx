'use client'
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import {RefreshCw, Edit2, Trash2, Save, X, Plus, Filter, ChevronRight, Database} from 'lucide-react';
import { MarisFormUnit } from '@/src/components/maris/MarisFormUnit';
import { useMarisMetadata } from '@/src/hooks/useMarisMetadata';

const cleanBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_URL = `${cleanBaseUrl}/entries/maris/`;

export default function MarisEnterpriseFullWide() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const metadata = useMarisMetadata();

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      units: [{ date: new Date().toISOString().split('T')[0], production_data: [], stop_time_data: [], problem_data: [], comment: '' }]
    }
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setRecords(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenForm = () => {
    handleHardReset();
    setIsFormOpen(true);
  };

  const handleHardReset = () => {
    setEditingId(null);
    reset({
      units: [{
        date: new Date().toISOString().split('T')[0],
        production_data: [],
        stop_time_data: [],
        problem_data: [],
        comment: ''
      }]
    });
  };

  const handleDelete = async (item: any) => {
    const confirmDelete = window.confirm(
      `Delete record #${item.id} (${new Date(item.date).toLocaleDateString('en-US')}) ?`
    );
    if (!confirmDelete) return;
    try {
      await axios.delete(`${API_URL}${item.id}/`);
      alert("Delete Successful!")
      setRecords(prev => prev.filter(r => r.id !== item.id));
    } catch (err) {
      console.error(err);
      alert("Delete failed!");
    }
  };

  const onSubmit = async (formData: any) => {
    const payload = formData.units[0];
    try {
      editingId ? await axios.put(`${API_URL}${editingId}/`, payload) : await axios.post(API_URL, payload);
      setIsFormOpen(false);
      handleHardReset();
      fetchData();
    } catch (e) { alert("Lỗi khi lưu dữ liệu!"); }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    reset({ units: [item] });
    setIsFormOpen(true);
  };

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      if (!startDate && !endDate) return true;
      const d = new Date(r.date);
      if (startDate && d < new Date(startDate)) return false;
      if (endDate && d > new Date(endDate)) return false;
      return true;
    });
  }, [records, startDate, endDate]);

  return (
    <div className="h-screen w-full bg-[#F8FAFC] antialiased flex flex-col overflow-hidden">
      <header className="flex-none bg-[#0F172A] rounded-[5px] text-white px-2 py-2 flex justify-between items-center shadow-xl z-[60]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg cursor-pointer hover:bg-blue-500 transition-colors" onClick={fetchData}>
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">
              Lavergne VN <span className="text-blue-400 not-italic">Maris System</span>
            </h1>
          </div>
          <button
            onClick={handleOpenForm}
            className="flex items-center gap-2 bg-blue-600 hover:bg-black text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
          >
            <Plus size={16} strokeWidth={3}/> New Maris Data
          </button>
        </div>

        <div className="flex items-center bg-white/10 rounded-xl px-4 py-2 gap-4 border border-white/10">
          <Filter size={16} className="text-blue-400"/>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-transparent border-none text-sm font-bold outline-none text-white [color-scheme:dark]"/>
          <ChevronRight size={14} className="text-white/30"/>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-transparent border-none text-sm font-bold outline-none text-white [color-scheme:dark]"/>
          {(startDate || endDate) && <button onClick={() => {setStartDate(''); setEndDate('')}} className="text-[10px] font-bold bg-red-500/20 text-red-400 px-2 py-1 rounded">RESET</button>}
        </div>
      </header>

      <main className="flex-1 py-2 lg:py-4 overflow-hidden flex flex-col">
        <section className="flex-1 bg-white rounded-[5px] shadow-sm border border-slate-200 flex flex-col overflow-hidden">

          <div className="overflow-auto flex-1 custom-scrollbar">
            <table className="w-full border-collapse table-fixed min-w-[1400px]">
              <thead className="sticky top-0 z-[55] bg-[#0F172A] text-white">
                <tr className="text-[10px] font-black uppercase tracking-[0.15em]">
                  <th className="px-6 py-4 w-[110px] text-left">ID/Date</th>
                  <th className="px-6 py-4 w-[140px] text-left">Operator</th>
                  <th className="px-6 py-4 text-left">Maris Data Preview</th>
                  <th className="px-6 py-4 w-[140px] text-right sticky right-0 bg-[#0F172A] z-[56] shadow-[-4px_0_10px_rgba(0,0,0,0.3)]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50 transition-all">
                    <td className="px-6 py-8 align-top">
                      <p className="text-[10px] font-bold text-slate-400">#{item.id}</p>
                      <p className="text-sm font-black text-slate-900 ">
                        {new Date(item.date).toLocaleDateString("en-US", {day: '2-digit', month: '2-digit'})}
                      </p>
                      <p className="text-sm font-black text-slate-900">
                        [{new Date(item.date).toLocaleDateString("en-US", {year: 'numeric'})}]
                      </p>
                    </td>
                    <td className="px-6 py-8 align-top">
                      <p className="font-black text-slate-800 text-xs uppercase mb-1">{item.employee}</p>
                      <span
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-tighter">{item.shift}</span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="bg-[#F8FAFC] border border-slate-100 rounded-[1.5rem] p-6 space-y-4">
                        <div>
                          <p className="text-[9px] font-black text-blue-600 uppercase mb-3 tracking-widest border-b border-blue-50 pb-2">Production
                            Detail</p>
                          {item.production_data?.map((p: any, i: number) => (
                              <div key={i}
                                   className="flex flex-wrap items-center gap-x-6 gap-y-3 bg-white border border-slate-100 p-4 rounded-xl mb-2 text-[11.5px] font-mono">
                                <span
                                    className="font-black text-slate-900 min-w-[120px] text-sm uppercase">CODE: {p.productCode}</span>
                                <div
                                    className="flex flex-1 flex-row items-center justify-between w-full min-w-max gap-x-8 px-4">
                                  <span>Good: <b className="text-slate-900 font-black">{p.goodPro}</b></span>
                                  <span>DLNC: <b>{p.dlnc}</b></span>
                                  <span>Case: <b>{p.dlnc_case || '-'}</b></span>
                                  <span>Total: <b
                                      className="text-indigo-600">{Number(p.goodPro) + Number(p.dlnc)}</b></span>
                                  <span>Reject: <b>{p.reject}</b></span>
                                  <span>Scrap: <b className="text-red-500">{p.scrap}</b></span>
                                  <span>Screen: <b>{p.screen || p.screenChanger}</b></span>
                                  <span className="text-blue-500">Vis-Lab: <b>{p.visslab}</b></span>
                                  <span>Output-Setting: <b>{p.outputSetting}</b></span>
                                </div>
                              </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4">
                            <p className="text-[9px] font-black text-red-600 uppercase mb-2 italic">Stop Time Log</p>
                            {item.stop_time_data?.length > 0 ? item.stop_time_data.map((s: any, idx: number) => {
                              const timeBasedCodes = ['# ORDER CHANGE', '# OF MECHANICAL FAILURE'];
                              const unitLabel = timeBasedCodes.includes(s.stopCode?.toUpperCase() || s.stopTime?.toUpperCase()) ? ' times' : 'h';
                              return (
                                  <div key={idx}
                                       className="flex justify-between text-[11px] font-bold py-1 border-b border-red-100 last:border-0">
                                    <span className="text-red-900 uppercase">{s.stopCode||s.stopTime}</span>
                                    <span className="font-black">{s.duration||s.hour}{unitLabel}</span>
                                  </div>
                              );
                            }) : <span className="text-slate-300 italic text-[11px]">No downtime</span>}
                          </div>

                          <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4">
                            <p className="text-[9px] font-black text-amber-600 uppercase mb-2 italic">Problem Codes</p>
                            {item.problem_data?.length > 0 ? item.problem_data.map((pr: any, idx: number) => (
                                <div key={idx}
                                     className="flex justify-between text-[11px] font-bold py-1 border-b border-amber-100 last:border-0">
                                  <span className="text-amber-900 uppercase">{pr.problemCode}</span>
                                  <span className="font-black text-slate-900">{pr.duration}h</span>
                                </div>
                            )) : <span className="text-slate-400 italic text-[11px]">No problems</span>}
                          </div>
                        </div>

                        <div className="bg-[#F8FAFC] border border-slate-100 rounded-[1.5rem] p-6 space-y-4">
                          <span
                              className="text-[9px] font-black text-blue-600 uppercase mb-3 tracking-widest border-b border-blue-50 pb-2">COMMENT:</span>
                          {item.comment && (
                              <div
                                  className="text-[11px] text-slate-500 italic flex gap-2 pt-2 border-t border-slate-100">
                                {item.comment}
                              </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-8 align-top text-right sticky right-0 bg-white/90 backdrop-blur-md z-10 group-hover:bg-slate-50/90 shadow-[-10px_0_15px_rgba(0,0,0,0.05)] transition-colors">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(item)} className="p-3 bg-white border border-slate-200 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-90">
                          <Edit2 size={18}/>
                        </button>
                        <button onClick={() => handleDelete(item)} className="p-3 bg-white border border-slate-200 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90">
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* MODAL*/}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
          <div className="relative bg-white w-full max-w-7xl max-h-[95vh] overflow-y-auto rounded-[20px] shadow-2xl border border-slate-200 flex flex-col">
            <div className={`sticky top-0 z-10 px-8 py-4 flex justify-between items-center ${editingId ? 'bg-blue-600' : 'bg-slate-800'} text-white`}>
              <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                {editingId ? <Edit2 size={16}/> : <Database size={16}/>}
                {editingId ? `Editing Record #${editingId}` : 'MARIS FORM ENTRY'}
              </span>
              <button onClick={() => setIsFormOpen(false)} className="bg-white/20 hover:bg-white/40 p-1 rounded-lg"><X size={20}/></button>
            </div>
            <div className="p-6">
              <MarisFormUnit index={0} control={control} register={register} metadata={metadata} onRemove={() => setIsFormOpen(false)} />
              <div className="flex justify-end mt-4 pb-2">
                <button onClick={handleSubmit(onSubmit)} className="bg-blue-600 hover:bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center gap-3">
                  <Save size={18}/> {editingId ? "Update Production" : "Save Production"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
