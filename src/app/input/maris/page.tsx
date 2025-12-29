// src/app/maris-form/page.tsx
'use client'
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Send, Layers, Database } from 'lucide-react';
import { multiMarisSchema, MultiMarisValues } from '@/src/schemas/marisSchema';
import { useMarisMetadata } from '@/src/hooks/useMarisMetadata';
import { MarisFormUnit } from '@/src/components/maris/MarisFormUnit';

export default function GlobalMarisPage() {
  const metadata = useMarisMetadata();
  const { register, control, handleSubmit, reset, formState: { isSubmitting } } = useForm<MultiMarisValues>({
    defaultValues: {
      units: [{
        date: new Date().toISOString().split('T')[0],
        employee: '', shift: 'DAY',
        production_data: [{ productCode: '', goodPro: 0, dlnc: 0, scrap: 0, reject: 0, screenChanger: 0, visLab: 0, outputSetting: 0 }],
        stop_time_data: [], problems: []
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "units" });

  const onFinalSubmit = async (data: MultiMarisValues) => {
    // Logic gửi dữ liệu qua Axios đã bàn ở trên
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header Full-width */}
      <header className="w-full bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2 rounded-lg text-blue-400">
            <Layers size={20} />
          </div>
          <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">Maris Bulk Data Center</h1>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span className="flex items-center gap-1"><Database size={12}/> Connection: Stable</span>
        </div>
      </header>

      {/* Main Content - Full Width Container */}
      <main className="flex-1 w-full px-4 py-8 max-w-full mx-auto pb-32">
        <div className="space-y-6">
          {fields.map((field, index) => (
            <MarisFormUnit
              key={field.id}
              index={index}
              control={control}
              register={register}
              onRemove={remove}
              metadata={metadata}
            />
          ))}
        </div>
      </main>

      {/* Tối ưu nút Submit & Add Unit chuyên nghiệp trong Sticky Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="w-full max-w-full px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="hidden md:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
              <p className="text-sm font-bold text-slate-700">{fields.length} Units Ready to Sync</p>
            </div>

            {/* Nút THÊM UNIT linh hoạt nằm cạnh nút Submit */}
            <button
              type="button"
              onClick={() => append({
                date: new Date().toISOString().split('T')[0], employee: '', shift: 'DAY',
                production_data: [{ productCode: '', goodPro: 0, dlnc: 0, scrap: 0, reject: 0, screenChanger: 0, visLab: 0, outputSetting: 0 }],
                stop_time_data: [], problems: []
              })}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-900 text-slate-900 rounded-xl font-black text-xs uppercase hover:bg-slate-900 hover:text-white transition-all shadow-sm"
            >
              <Plus size={16} /> Add Unit
            </button>
          </div>

          {/* Nút SUBMIT TỔNG CHUYÊN NGHIỆP */}
          <button
            type="submit"
            onClick={handleSubmit(onFinalSubmit)}
            disabled={isSubmitting}
            className="w-full md:w-[400px] bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-black transition-all shadow-lg shadow-blue-200 disabled:bg-slate-300"
          >
            {isSubmitting ? "Syncing..." : <><Send size={16}/> Finalize & Push To Server</>}
          </button>
        </div>
      </footer>
    </div>
  );
}
