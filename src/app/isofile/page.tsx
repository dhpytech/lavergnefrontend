"use client";

import React, { useState, useEffect, useCallback } from 'react';
import IsoHeader from '@/src/components/isofile/IsoHeader';
import IsoMatrixRow from '@/src/components/isofile/IsoMatrixRow';

export default function IsoFilePage() {
  const [filters, setFilters] = useState({ month: 6, year: 2025, shift: 'total' });
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchIsoData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ month: filters.month.toString(), year: filters.year.toString(), shift: filters.shift });
      const res = await fetch(`http://127.0.0.1:8000/entries/iso-file/?${params.toString()}`);
      const json = await res.json();
      setData(json);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchIsoData(); }, [fetchIsoData]);

  const days = data?.metadata?.last_day || 31;

  return (
    <div className="flex flex-col h-screen bg-[#f1f5f9] p-4 overflow-hidden">
      <IsoHeader filters={filters} setFilters={setFilters} onRefresh={fetchIsoData} loading={loading} />

      <div className="flex-1 mt-4 bg-white border border-slate-300 overflow-hidden relative shadow-sm">
        <div className="overflow-auto h-full custom-scrollbar">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-50">
              <tr className="bg-[#1e293b] text-white">
                <th className="p-3 sticky left-0 bg-[#1e293b] border-r border-slate-600 z-50 text-left min-w-[200px] text-[10px] font-black">TYPE / DATE</th>
                {Array.from({ length: days }, (_, i) => (
                  <th key={i} className="border-r border-slate-600 text-center w-[40px] text-[10px]">{i + 1}</th>
                ))}
                <th className="p-3 sticky right-0 bg-blue-700 z-50 text-right min-w-[80px] text-[10px] font-black">TOTAL</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data?.matrix && (
                <>
                  <IsoMatrixRow title="1. Operator Name" dataMap={data.matrix.operators} days={days} type="text" />
                  <IsoMatrixRow title="2. Good Product (KG)" dataMap={data.matrix.production} days={days} type="number" />
                  <IsoMatrixRow title="3. Scrap & Waste (KG)" dataMap={data.matrix.scrap} days={days} type="number" />
                  <IsoMatrixRow title="4. Stop Time (Hours)" dataMap={data.matrix.downtime} days={days} type="number" />
                  <IsoMatrixRow title="5. Problem & Troubleshooting" dataMap={data.matrix.problems} days={days} type="text" />
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}