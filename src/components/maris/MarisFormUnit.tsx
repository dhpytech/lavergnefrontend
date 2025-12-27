'use client'
import React from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Minus, Trash2, Database, Calendar, User, Clock } from 'lucide-react';
import { marisSchema, MarisFormValues } from '@/src/schemas/marisSchema';
import { useMarisMetadata } from '@/src/hooks/useMarisMetadata';
import { DynamicSection } from './DynamicSection';

interface Props { instanceId: string; onRemove: (id: string) => void; }

export function MarisFormUnit({ instanceId, onRemove }: Props) {
  const { employees, productCodes, stopCodes, problemCodes, loading } = useMarisMetadata();
  const { register, control, handleSubmit, reset } = useForm<MarisFormValues>({
    resolver: zodResolver(marisSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      production_data: [{ productCode: '', goodPro: 0, dlnc: 0, scrap: 0, reject: 0, screenChanger: 0, visLab: 0, outputSetting: 0 }],
      stop_time_data: [], problems: []
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "production_data" });
  const watchProd = useWatch({ control, name: "production_data" });

  const onSubmit = async (data: MarisFormValues) => {
    console.log("Submit Unit Data:", data);
    alert(`Đã lưu dữ liệu Cụm ${instanceId}`);
  };

  if (loading) return <div className="p-10 border rounded-[2rem] animate-pulse bg-white">Loading Unit...</div>;

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-xl mb-12 relative">
      <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
      <button onClick={() => onRemove(instanceId)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500"><Trash2 size={24}/></button>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Database size={24} /></div>
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">Production Unit: {instanceId}</h2>
        </div>

        {/* Header Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-[2rem]">
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100">
            <Calendar size={18} className="text-blue-500" />
            <input type="date" {...register('date')} className="outline-none text-sm font-bold w-full" />
          </div>
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100">
            <User size={18} className="text-blue-500" />
            <select {...register('employee')} className="outline-none text-sm font-bold w-full">
              <option value="">Nhân viên</option>
              {employees.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100">
            <Clock size={18} className="text-blue-500" />
            <select {...register('shift')} className="outline-none text-sm font-bold w-full">
              <option value="DAY">CA NGÀY</option>
              <option value="NIGHT">CA ĐÊM</option>
            </select>
          </div>
        </div>

        {/* Full Fields Production Table */}

        <div className="rounded-3xl border border-slate-100 overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-800 text-white uppercase font-bold tracking-widest">
              <tr>
                <th className="p-4">Mã SP</th><th className="p-4">Good</th><th className="p-4">DLNC</th>
                <th className="p-4 text-blue-400">Total</th><th className="p-4 text-red-400">Reject</th>
                <th className="p-4">Scrap</th><th className="p-4">Screen</th><th className="p-4">VisLab</th>
                <th className="p-4">Output</th><th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fields.map((field, index) => {
                const total = (Number(watchProd?.[index]?.goodPro) || 0) + (Number(watchProd?.[index]?.reject) || 0);
                return (
                  <tr key={field.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-2"><select {...register(`production_data.${index}.productCode` as const)} className="w-full p-2 border-none bg-slate-100 rounded-lg font-bold">{productCodes.map(c => <option key={c} value={c}>{c}</option>)}</select></td>
                    <td className="p-2"><input type="number" {...register(`production_data.${index}.goodPro` as const)} className="w-16 p-2 bg-blue-50 rounded-lg text-center font-black text-blue-600" /></td>
                    <td className="p-2"><input type="number" {...register(`production_data.${index}.dlnc` as const)} className="w-14 p-2 bg-slate-50 rounded-lg text-center" /></td>
                    <td className="p-2 text-center font-black text-slate-800">{total}</td>
                    <td className="p-2"><input type="number" {...register(`production_data.${index}.reject` as const)} className="w-16 p-2 bg-red-50 rounded-lg text-center font-black text-red-500" /></td>
                    <td className="p-2"><input type="number" {...register(`production_data.${index}.scrap` as const)} className="w-14 p-2 bg-slate-50 rounded-lg text-center" /></td>
                    <td className="p-2"><input type="number" {...register(`production_data.${index}.screenChanger` as const)} className="w-14 p-2 bg-slate-50 rounded-lg text-center" /></td>
                    <td className="p-2"><input type="number" {...register(`production_data.${index}.visLab` as const)} className="w-14 p-2 bg-slate-50 rounded-lg text-center" /></td>
                    <td className="p-2"><input type="number" {...register(`production_data.${index}.outputSetting` as const)} className="w-14 p-2 bg-slate-50 rounded-lg text-center" /></td>
                    <td className="p-2 text-center"><button type="button" onClick={() => remove(index)} className="text-slate-300 hover:text-red-500"><Minus size={18}/></button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <button type="button" onClick={() => append({ productCode: '', goodPro: 0, dlnc: 0, scrap: 0, reject: 0, screenChanger: 0, visLab: 0, outputSetting: 0 })}
            className="w-full py-3 bg-slate-50 text-slate-400 font-bold hover:text-blue-600 transition-colors">+ Thêm dòng sản phẩm</button>
        </div>

        {/* Dynamic StopTime & Problems Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DynamicSection title="Stop Time Tracking" name="stop_time_data" control={control} register={register} options={stopCodes} />
          <DynamicSection title="Problem Management" name="problems" control={control} register={register} options={problemCodes} />
          <textarea {...register('comment')} placeholder="Ghi chú chi tiết ca..." className="w-full h-full min-h-[150px] p-4 bg-slate-50 rounded-[2rem] text-xs font-bold outline-none border-none focus:ring-1 ring-blue-500" />
        </div>

        <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg hover:bg-blue-600 transition-all">Lưu Báo Cáo Unit</button>
      </form>
    </div>
  );
}
