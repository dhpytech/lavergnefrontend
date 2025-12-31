// src/components/entries/MarisFormUnit.tsx
'use client'
import React from 'react';
import { useFieldArray, Control, UseFormRegister, useWatch } from 'react-hook-form';
import { Plus, Minus, Trash2, Calendar, User, Clock } from 'lucide-react';
import { MultiMarisValues } from '@/src/schemas/marisSchema';
import { DynamicSection } from './DynamicSection';

interface Props {
  index: number;
  control: Control<MultiMarisValues>;
  register: UseFormRegister<MultiMarisValues>;
  onRemove: (index: number) => void;
  metadata: any;
}

export function MarisFormUnit({ index, control, register, onRemove, metadata }: Props) {
  const { fields, append, remove } = useFieldArray({ control, name: `units.${index}.production_data` as any });
  const watchProd = useWatch({ control, name: `units.${index}.production_data` as any });

  return (
    <div className="bg-[#E2E8F0] p-6 rounded-lg border-2 border-slate-400 mb-10 relative shadow-md">
      <button type="button" onClick={() => onRemove(index)} className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-700">
        <Trash2 size={16} />
      </button>

      {/* Header Info - Giống bản vẽ */}
      <div className="flex flex-wrap items-center gap-8 mb-6 bg-white/50 p-4 rounded-lg border border-slate-300">
        <div className="flex items-center gap-3 border-r border-slate-400 pr-8">
          <Calendar size={20} className="text-slate-700" />
          <input type="date" {...register(`units.${index}.date` as any)} className="bg-white border border-blue-400 rounded px-2 py-1 text-sm font-bold text-slate-700 outline-none" />
        </div>
        <div className="flex items-center gap-3 border-r border-slate-400 pr-8">
          <User size={20} className="text-slate-700" />
          <select {...register(`units.${index}.employee` as any)} className="bg-white border border-slate-400 rounded px-3 py-1 text-sm font-bold outline-none min-w-[150px]">
            <option value="">Dropdown</option>
            {metadata.employees.map((e: any) => (
              <option key={`unit-${index}-emp-${e.employee_id}`} value={e.employee_name}>{e.employee_name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <Clock size={20} className="text-slate-700" />
          <select {...register(`units.${index}.shift` as any)} className="bg-white border border-slate-400 rounded px-3 py-1 text-sm font-bold outline-none">
            <option value="DAY">CA NGÀY</option>
            <option value="NIGHT">CA ĐÊM</option>
          </select>
        </div>
      </div>

      {/* Production Table - Bổ sung đầy đủ trường & Output Setting */}
      <div className="bg-white p-4 rounded-lg border border-slate-400 shadow-inner mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] font-bold text-slate-800">
            <thead>
              <tr className="text-slate-900 border-b border-slate-300">
                <th className="pb-3 text-left">Product Code</th>
                <th className="pb-3 text-center">Good Product</th>
                <th className="pb-3 text-center">DLNC</th>
                <th className="pb-3 text-center">Case</th>
                <th className="pb-3 text-center">Total</th>
                <th className="pb-3 text-center">Reject</th>
                <th className="pb-3 text-center">Scrap</th>
                <th className="pb-3 text-center">Screen Changer</th>
                <th className="pb-3 text-center text-blue-700">VisLab</th>
                <th className="pb-3 text-center bg-blue-50">Output Setting</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fields.map((field, idx) => {
                const total = (Number(watchProd?.[idx]?.goodPro) || 0) + (Number(watchProd?.[idx]?.reject) || 0);
                return (
                  <tr key={field.id}>
                    <td className="py-2">
                      <select {...register(`units.${index}.production_data.${idx}.productCode` as any)} className="w-full border border-slate-300 rounded p-1">
                        <option value="">Dropdown</option>
                        {metadata.productCodes.map((code: string) => (
                          <option key={`${field.id}-${code}`} value={code}>{code}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-1"><input type="number" {...register(`units.${index}.production_data.${idx}.goodPro` as any)} className="w-full border border-slate-300 rounded p-1 text-center" placeholder="Input text" /></td>
                    <td className="p-1"><input type="number" {...register(`units.${index}.production_data.${idx}.dlnc` as any)} className="w-full border border-slate-300 rounded p-1 text-center" placeholder="Input text" /></td>
                    <td className="p-1">
                      <select {...register(`units.${index}.production_data.${idx}.case` as any)} className="w-full border border-slate-300 rounded p-1">
                        <option value="Case A">Case A</option>
                        <option value="Case B">Case B</option>
                      </select>
                    </td>
                    <td className="p-1 text-center font-black bg-slate-50 border border-slate-200">{total}</td>
                    <td className="p-1"><input type="number" {...register(`units.${index}.production_data.${idx}.reject` as any)} className="w-full border border-slate-300 rounded p-1 text-center" placeholder="Input text" /></td>
                    <td className="p-1"><input type="number" {...register(`units.${index}.production_data.${idx}.scrap` as any)} className="w-full border border-slate-300 rounded p-1 text-center" placeholder="Input text" /></td>
                    <td className="p-1"><input type="number" {...register(`units.${index}.production_data.${idx}.screenChanger` as any)} className="w-full border border-slate-300 rounded p-1 text-center" placeholder="Input text" /></td>
                    <td className="p-1"><input type="number" {...register(`units.${index}.production_data.${idx}.visLab` as any)} className="w-full border border-blue-400 rounded p-1 text-center" placeholder="Input text" /></td>
                    <td className="p-1 bg-blue-50/50">
                      <input type="number" {...register(`units.${index}.production_data.${idx}.outputSetting` as any)}
                        className="w-full border border-blue-400 rounded p-1 text-center font-bold text-blue-800 bg-white" placeholder="Input text" />
                    </td>
                    <td className="p-1 text-center">
                      <button type="button" onClick={() => remove(idx)} className="text-slate-300 hover:text-red-500"><Minus size={18}/></button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <button type="button" onClick={() => append({ productCode: '', goodPro: 0, dlnc: 0, scrap: 0, reject: 0, screenChanger: 0, visLab: 0, outputSetting: 0 } as any)}
            className="mt-3 px-4 py-1.5 bg-slate-800 text-white rounded text-[10px] uppercase font-bold hover:bg-black transition-colors">
            + Add Row
          </button>
        </div>
      </div>

      {/* Bottom Section - StopTime, Problems, Comment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="space-y-4 flex flex-col">
          <DynamicSection title="Stop Time" type="stop_time_data" path={`units.${index}.stop_time_data`} control={control} register={register} options={metadata.stopCodes} />
          <DynamicSection title="Problems" type="problems" path={`units.${index}.problems`} control={control} register={register} options={metadata.problemCodes} />
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm flex flex-col">
          <h3 className="text-[11px] font-bold text-slate-800 mb-3 uppercase border-b pb-2">Comment For Stop Time</h3>
          <textarea
            {...register(`units.${index}.comment` as any)}
            className="flex-1 w-full p-4 text-[11px] font-bold text-slate-700 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-400 resize-none"
            placeholder="Input text"
          />
        </div>
      </div>
    </div>
  );
}
