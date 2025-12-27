'use client'
import { useFieldArray, Control, UseFormRegister } from 'react-hook-form';
import { MarisFormValues } from '@/src/schemas/marisSchema';
import { Plus, Minus } from 'lucide-react';

interface Props {
  title: string;
  name: "stop_time_data" | "problems";
  control: Control<MarisFormValues>;
  register: UseFormRegister<MarisFormValues>;
  options: string[];
}

export const DynamicSection = ({ title, name, control, register, options }: Props) => {
  const { fields, append, remove } = useFieldArray({ control, name: name as any });

  return (
    <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h3>
        <button type="button" onClick={() => append({ [name === 'stop_time_data' ? 'stopCode' : 'problemCode']: '', duration: 0 } as any)}
          className="bg-slate-900 text-white p-1 rounded-lg hover:bg-blue-600 transition-colors">
          <Plus size={14} />
        </button>
      </div>
      <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-center">
            <select {...register(`${name}.${index}.${name === 'stop_time_data' ? 'stopCode' : 'problemCode'}` as any)}
              className="flex-1 p-2 bg-slate-50 border rounded-xl text-xs font-bold outline-none">
              <option value="">Chọn mã...</option>
              {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <input type="number" placeholder="Phút" {...register(`${name}.${index}.duration` as any)}
              className="w-16 p-2 bg-slate-50 border rounded-xl text-xs text-center font-bold" />
            <button type="button" onClick={() => remove(index)} className="text-slate-300 hover:text-red-500"><Minus size={18} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};
