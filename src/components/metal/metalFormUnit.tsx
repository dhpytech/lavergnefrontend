'use client'
import { useFieldArray, Control, UseFormRegister } from 'react-hook-form';
import { Minus, Calendar, User, Clock, Package } from 'lucide-react';
import { MultiMetalValues } from '@/src/schemas/metalSchema';

interface Props {
  index: number;
  control: Control<MultiMetalValues>;
  register: UseFormRegister<MultiMetalValues>;
  onRemove: (index: number) => void;
  metadata: {
    employees: any[];
    productCodes: string[];
    actions: string[];
  };
}

export default function MetalFormUnit({ index, control, register, onRemove, metadata }: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `entries.${index}.production_data` as any // Sửa lỗi FieldPath
  });

  return (
    <div className="bg-[#D1D5DB] p-4 rounded-lg border border-black mb-6 relative">
      <button type="button" onClick={() => onRemove(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 border border-black shadow-sm">
        <Minus size={14} />
      </button>

      {/* Header Row - Bám sát image_5a506e.png */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 flex items-center gap-2 bg-white border border-blue-600 rounded px-2 py-1.5">
          <Calendar size={18} className="text-slate-500" />
          <input type="date" {...register(`entries.${index}.date` as any)} className="outline-none text-xs w-full font-bold" />
        </div>
        <div className="flex-1 flex items-center gap-2 bg-white border border-slate-400 rounded px-2 py-1.5">
          <User size={18} className="text-slate-500" />
          <select {...register(`entries.${index}.employee` as any)} className="outline-none text-xs w-full bg-transparent font-bold">
            <option value="">Employee</option>
            {metadata.employees?.map((e: any) => (
              <option key={e.id || e.employee_name} value={e.employee_name}>{e.employee_name}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 flex items-center gap-2 bg-white border border-slate-400 rounded px-2 py-1.5">
          <Clock size={18} className="text-slate-500" />
          <select {...register(`entries.${index}.shift` as any)} className="outline-none text-xs w-full bg-transparent font-bold">
            <option value="DAY">CA NGÀY</option>
            <option value="NIGHT">CA ĐÊM</option>
          </select>
        </div>
        <div className="flex-1 flex items-center gap-2 bg-white border border-slate-400 rounded px-2 py-1.5">
          <Package size={18} className="text-slate-500" />
          <input {...register(`entries.${index}.lot_number` as any)} placeholder="LOT NUMBER" className="outline-none text-xs w-full font-bold uppercase" />
        </div>
      </div>

      {/* Production Table */}
      <div className="bg-white p-3 rounded-md border border-slate-300">
        <div className="grid grid-cols-12 gap-3 mb-2 text-[11px] font-black italic uppercase">
          <div className="col-span-1 text-center">No</div>
          <div className="col-span-3">Product Code</div>
          <div className="col-span-3">Action</div>
          <div className="col-span-2 text-center">Input</div>
          <div className="col-span-2 text-center">Output</div>
        </div>

        {fields.map((field, idx) => (
          <div key={field.id} className="grid grid-cols-12 gap-3 mb-2 items-center">
            <div className="col-span-1 bg-slate-100 border border-slate-400 rounded h-8 flex items-center justify-center text-xs font-bold">{idx + 1}</div>

            <select {...register(`entries.${index}.production_data.${idx}.productCode` as any)} className="col-span-3 h-8 border border-slate-300 rounded px-2 text-[11px] font-bold">
              <option value="">Select Code</option>
              {metadata.productCodes?.map((code) => (
                <option key={code} value={code}>{code}</option> // Đã thêm key
              ))}
            </select>

            <select {...register(`entries.${index}.production_data.${idx}.action` as any)} className="col-span-3 h-8 border border-slate-300 rounded px-2 text-[11px]">
              <option value="">Action</option>
              {metadata.actions?.map((act) => (
                <option key={act} value={act}>{act}</option> // Đã thêm key
              ))}
            </select>

            <input type="number" {...register(`entries.${index}.production_data.${idx}.inputQty` as any)} className="col-span-2 h-8 border border-slate-300 rounded px-1 text-center text-[11px]" />
            <input type="number" {...register(`entries.${index}.production_data.${idx}.outputQty` as any)} className="col-span-2 h-8 border border-slate-300 rounded px-1 text-center text-[11px] font-bold text-blue-700 bg-blue-50" />

            <button type="button" onClick={() => remove(idx)} className="col-span-1 text-slate-300 hover:text-red-500 flex justify-center transition-colors">
              <Minus size={18} />
            </button>
          </div>
        ))}

        <button type="button" onClick={() => append({ productCode: '', action: '', inputQty: 0, outputQty: 0 } as any)} className="text-[10px] font-bold underline text-slate-500 uppercase hover:text-black mt-1">
          + Add Product Row
        </button>
      </div>
    </div>
  );
}