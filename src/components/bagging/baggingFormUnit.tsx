'use client'
import { useFieldArray, Control, UseFormRegister } from 'react-hook-form';
import { Minus, Calendar, User, Clock, Package, Plus } from 'lucide-react';
import { MultiBaggingValues } from '@/src/schemas/baggingSchema';

interface Props {
  index: number;
  control: Control<MultiBaggingValues>;
  register: UseFormRegister<MultiBaggingValues>;
  onRemove: (index: number) => void;
  metadata: any;
}

export default function BaggingFormUnit({ index, control, register, onRemove, metadata }: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `entries.${index}.production_data` as any // Khử lỗi FieldPath
  });

  return (
    <div className="bg-[#D1D5DB] p-6 rounded-2xl border border-slate-400 mb-8 relative shadow-sm">
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 border-2 border-white hover:bg-red-600 shadow-lg z-10"
      >
        <Minus size={16} />
      </button>

      {/* Header Info - Khớp hoàn toàn với Schema (2 Employees) */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-6">
        <div className="flex items-center gap-2 bg-white border border-emerald-500 rounded-xl px-3 py-2 shadow-sm">
          <Calendar size={16} className="text-emerald-500" />
          <input type="date" {...register(`entries.${index}.date` as any)} className="outline-none text-[11px] w-full font-bold" />
        </div>

        {/* Employee 1 */}
        <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-2">
          <User size={16} className="text-slate-400" />
          <select {...register(`entries.${index}.employee_1` as any)} className="outline-none text-[11px] w-full font-bold">
            <option value="">Employee 1</option>
            {metadata.employees?.map((e: any) => (
              <option key={e.id} value={e.employee_name}>{e.employee_name}</option> // Key unique
            ))}
          </select>
        </div>

        {/* Employee 2 */}
        <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-2">
          <User size={16} className="text-slate-400" />
          <select {...register(`entries.${index}.employee_2` as any)} className="outline-none text-[11px] w-full font-bold">
            <option value="">Employee 2</option>
            {metadata.employees?.map((e: any) => (
              <option key={e.id} value={e.employee_name}>{e.employee_name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-2">
          <Clock size={16} className="text-slate-400" />
          <select {...register(`entries.${index}.shift` as any)} className="outline-none text-[11px] w-full font-bold">
            <option value="DAY">CA NGÀY</option>
            <option value="NIGHT">CA ĐÊM</option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-2">
          <Package size={16} className="text-slate-400" />
          <input {...register(`entries.${index}.lot_number` as any)} placeholder="LOT NUMBER" className="outline-none text-[11px] w-full font-bold uppercase" />
        </div>
      </div>

      {/* Production List - Khớp Input/Output Qty */}
      <div className="bg-white/70 p-4 rounded-xl border border-white">
        <div className="grid grid-cols-12 gap-4 mb-3 px-2 text-[10px] font-black italic uppercase text-slate-500">
          <div className="col-span-1 text-center">No</div>
          <div className="col-span-5">Product Code</div>
          <div className="col-span-2 text-center">Input Qty</div>
          <div className="col-span-3 text-center">Output Qty</div>
          <div className="col-span-1"></div>
        </div>

        {fields.map((field, idx) => (
          <div key={field.id} className="grid grid-cols-12 gap-4 mb-3 items-center">
            <div className="col-span-1 bg-white border border-slate-300 rounded-lg h-9 flex items-center justify-center text-xs font-black italic shadow-sm">
                {idx + 1}
            </div>

            <select {...register(`entries.${index}.production_data.${idx}.productCode` as any)} className="col-span-5 h-9 border border-slate-300 rounded-lg px-2 text-[11px] font-bold outline-none focus:border-emerald-500">
              <option value="">Select Code</option>
              {metadata.productCodes?.map((code: string) => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>

            <input type="number" {...register(`entries.${index}.production_data.${idx}.inputQty` as any)} className="col-span-2 h-9 border border-slate-300 rounded-lg px-2 text-[11px] text-center font-bold" placeholder="0" />
            <input type="number" {...register(`entries.${index}.production_data.${idx}.outputQty` as any)} className="col-span-3 h-9 border border-emerald-300 rounded-lg px-2 text-[11px] text-center font-bold text-emerald-700 bg-emerald-50/50" placeholder="0" />

            <button type="button" onClick={() => remove(idx)} className="col-span-1 text-slate-400 hover:text-red-500 flex justify-center transition-all">
              <Minus size={18} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ productCode: '', inputQty: 0, outputQty: 0 } as any)}
          className="mt-2 text-[10px] font-black underline uppercase text-slate-600 hover:text-emerald-600 flex items-center gap-1"
        >
          <Plus size={12} /> Add Bagging Row
        </button>
      </div>
    </div>
  );
}
