'use client'
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Send, Database, ShoppingBag } from 'lucide-react';
import { multiBaggingSchema, MultiBaggingValues } from '@/src/schemas/baggingSchema';
import BaggingFormUnit from '@/src/components/bagging/baggingFormUnit';
import { useBaggingMetadata } from '@/src/hooks/useBaggingMetadata';

export default function BaggingPage() {
  const { employees, productCodes, loading } = useBaggingMetadata();

  const { register, control, handleSubmit, formState: { isSubmitting } } = useForm<MultiBaggingValues>({
    resolver: zodResolver(multiBaggingSchema),
    defaultValues: {
      entries: [{
        date: new Date().toISOString().split('T')[0],
        employee_1: '',
        employee_2: '',
        shift: 'DAY',
        lot_number: '',
        production_data: [{ productCode: '', inputQty: 0, outputQty: 0 }]
      }]
    }
  } as any);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "entries"
  } as any);

  const onSubmit = async (data: MultiBaggingValues) => {
    console.log("Final Bagging Data:", data);
    await new Promise(r => setTimeout(r, 1500));
    alert("Dữ liệu Bagging đã được ghi nhận!");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <p className="font-black text-slate-400 uppercase tracking-widest text-[10px] animate-pulse">Syncing Bagging Metadata...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <header className="w-full bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-600 p-2.5 rounded-xl text-white shadow-lg shadow-emerald-100">
            <ShoppingBag size={22} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">Bagging Data Center</h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Final Output Terminal</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
          <Database size={12} className="text-emerald-500"/> System: Ready
        </div>
      </header>

      <main className="flex-1 w-full px-6 py-10 max-w-7xl mx-auto pb-40">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {fields.map((field, index) => (
              <BaggingFormUnit
                key={field.id} // Giải quyết lỗi Unique Key
                index={index}
                control={control}
                register={register}
                onRemove={remove}
                metadata={{ employees, productCodes }}
              />
            ))}
          </div>

          <footer className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg border-t border-slate-200 p-5 z-50 shadow-[0_-15px_40px_rgba(0,0,0,0.08)]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 px-4">
              <button
                type="button"
                onClick={() => append({
                  date: new Date().toISOString().split('T')[0],
                  employee_1: '', employee_2: '', shift: 'DAY', lot_number: '',
                  production_data: [{ productCode: '', inputQty: 0, outputQty: 0 }]
                } as any)}
                className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl font-black text-xs uppercase hover:bg-slate-900 hover:text-white transition-all active:scale-95 shadow-md"
              >
                <Plus size={18} /> Add New Lot
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-[450px] bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.25em] text-xs flex items-center justify-center gap-4 hover:bg-black transition-all shadow-xl shadow-emerald-100 disabled:bg-slate-300"
              >
                {isSubmitting ? "Processing..." : <><Send size={18} /> Finalize & Sync Records</>}
              </button>
            </div>
          </footer>
        </form>
      </main>
    </div>
  );
}
