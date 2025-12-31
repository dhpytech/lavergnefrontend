// src/components/entries/DynamicSection.tsx
'use client'
import { useFieldArray, Control, UseFormRegister } from 'react-hook-form';
import { MultiMarisValues } from '@/src/schemas/marisSchema';
import { Plus, Minus } from 'lucide-react';

interface Props {
  title: string;
  path: any; // Sử dụng any để tránh lỗi Type Assignable lồng nhau
  type: "stop_time_data" | "problems";
  control: Control<MultiMarisValues>;
  register: UseFormRegister<MultiMarisValues>;
  options: string[];
}

export const DynamicSection = ({ title, path, type, control, register, options }: Props) => {
  const { fields, append, remove } = useFieldArray({ control, name: path });
  const codeKey = type === 'stop_time_data' ? 'stopCode' : 'problemCode';

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-300 flex flex-col h-full shadow-sm">
      <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-2">
        <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-tighter">{title}</h3>
        <button type="button" onClick={() => append({ [codeKey]: '', duration: 0 })}
          className="bg-slate-100 p-1 rounded border border-slate-300 hover:bg-slate-200">
          <Plus size={14} className="text-slate-600" />
        </button>
      </div>
      <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-center">
            <span className="text-[10px] text-slate-400 w-4">{index + 1}</span>
            <select
              {...register(`${path}.${index}.${codeKey}` as any)}
              className="flex-1 p-1.5 bg-white border border-slate-300 rounded text-[11px] outline-none"
            >
              <option value="">-- Dropdown --</option>
              {options.map((opt) => (
                <option key={`${field.id}-${opt}`} value={opt}>{opt}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Hour/Time"
              {...register(`${path}.${index}.duration` as any)}
              className="w-20 p-1.5 bg-white border border-slate-300 rounded text-[11px] text-center"
            />
            <button type="button" onClick={() => remove(index)} className="text-slate-300 hover:text-red-500">
              <Minus size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
