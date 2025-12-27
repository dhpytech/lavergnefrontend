'use client'
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { MarisFormUnit } from '@/src/components/maris/MarisFormUnit';

export default function MultiMarisPage() {
  const [units, setUnits] = useState<string[]>(['Unit-1']);

  const addUnit = () => setUnits([...units, `Unit-${units.length + 1}-${Date.now().toString().slice(-4)}`]);
  const removeUnit = (id: string) => units.length > 1 && setUnits(units.filter(u => u !== id));

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-4 md:p-12">
      <div className="max-w-[1400px] mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">LA VERGNE MARIS</h1>
            <p className="text-slate-400 font-bold text-sm">Hệ thống nhập liệu đa cụm độc lập</p>
          </div>
          <button onClick={addUnit} className="bg-blue-600 text-white px-8 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all">
            <PlusCircle size={20} className="inline mr-2" /> Thêm Cụm Sản Xuất
          </button>
        </header>

        <div className="space-y-4">
          {units.map((id) => <MarisFormUnit key={id} instanceId={id} onRemove={removeUnit} />)}
        </div>
      </div>
    </div>
  );
}
