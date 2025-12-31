'use client'
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Send, Database, Zap } from 'lucide-react';
import { multiMetalSchema, MultiMetalValues } from '@/src/schemas/metalSchema';
import MetalFormUnit from '@/src/components/metal/metalFormUnit';
import { useMetalMetadata } from '@/src/hooks/useMetalMetadata';

export default function MetalPage() {
  const { employees, productCodes, actions, loading } = useMetalMetadata();

  const { register, control, handleSubmit, formState: { isSubmitting } } = useForm<MultiMetalValues>({
    resolver: zodResolver(multiMetalSchema),
    defaultValues: {
      entries: [{
        date: new Date().toISOString().split('T')[0],
        employee: '',
        shift: 'DAY',
        lot_number: '',
        production_data: [{ productCode: '', action: '', inputQty: 0, outputQty: 0 }]
      }]
    }
  } as any);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "entries"
  } as any);

  const onSubmit = async (data: MultiMetalValues) => {
    console.log("Metal Bulk Syncing:", data);
    // Giả lập thời gian gửi dữ liệu
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert("Metal Data Synchronized Successfully!");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Initializing Metal Workspace...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header đồng bộ với phong cách Maris */}
      <header className="w-full bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-100">
            <Zap size={22} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">Metal Data Center</h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Production Processing Unit</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Database size={12}/> System Status
            </span>
            <span className="text-[10px] font-bold text-green-500 uppercase">Live Connection</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full px-6 py-10 max-w-7xl mx-auto pb-40">
        <div className="space-y-8">
          {fields.map((field, index) => (
            <MetalFormUnit
              key={field.id}
              index={index}
              control={control}
              register={register}
              onRemove={remove}
              metadata={{ employees, productCodes, actions }}
            />
          ))}
        </div>
      </main>

      {/* Sticky Footer đồng bộ hoàn toàn với Maris */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg border-t border-slate-200 p-5 z-50 shadow-[0_-15px_40px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="flex items-center gap-8">
            <div className="hidden lg:block border-r border-slate-200 pr-8">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Queue Status</p>
              <p className="text-sm font-bold text-slate-800">{fields.length} Production Lots Ready</p>
            </div>

            {/* Nút ADD UNIT linh hoạt cạnh nút Submit */}
            <button
              type="button"
              onClick={() => append({
                date: new Date().toISOString().split('T')[0],
                employee: '', shift: 'DAY', lot_number: '',
                production_data: [{ productCode: '', action: '', inputQty: 0, outputQty: 0 }]
              } as any )}
              className="group flex items-center gap-3 px-8 py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl font-black text-xs uppercase hover:bg-slate-900 hover:text-white transition-all shadow-md active:scale-95"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform" />
              Add New Lot Entry
            </button>
          </div>

          {/* Nút SUBMIT TỔNG CHUYÊN NGHIỆP */}
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="w-full md:w-[450px] bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.25em] text-xs flex items-center justify-center gap-4 hover:bg-black hover:shadow-2xl transition-all shadow-xl shadow-blue-200 disabled:bg-slate-300 disabled:shadow-none active:scale-[0.98]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Synchronizing...
              </span>
            ) : (
              <>
                <Send size={18} />
                Finalize & Push to Records
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}
