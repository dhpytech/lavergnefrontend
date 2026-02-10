"use client";

interface RowProps {
  title: string;
  dataMap: Record<string, (number | string)[]>;
  days: number;
  type: 'number' | 'text';
  showTotal?: boolean;
  manualTotals?: Record<string, number|string>;
}

export default function IsoMatrixRow({ title, dataMap, days, type, showTotal = true, manualTotals }: RowProps) {
  const keys = dataMap ? Object.keys(dataMap) : [];
  const columnTotals = Array(days).fill(0);
    let grandTotal = 0;

    if (type === 'number') {
      keys.forEach((key) => {
        const values = dataMap[key] as number[];
        values.forEach((val, i) => {
          if (i < days) {
            const num = Number(val) || 0;
            columnTotals[i] += num;
            grandTotal += num;
          }
        });
      });
    }
  return (
    <>
      <tr className="bg-slate-100 border-b border-slate-300">
        <td colSpan={days + 2} className="px-4 py-1.5 font-black text-[10px] text-slate-700 sticky left-0 z-20 bg-slate-100 uppercase border-r border-slate-300">
          {title}
        </td>
      </tr>
      {keys.length > 0 ? (
        <>
          { keys.map((key) => {
          const values = dataMap[key];
          const total = type === 'number' ? (values as number[]).reduce((a, b) => a + (Number(b) || 0), 0) : null;
          const finalTotal = (manualTotals && manualTotals[key] !== undefined) ? manualTotals[key]
              : (type === 'number' ? (values as number[]).reduce((a, b) => a + (Number(b) || 0), 0) : null);

          return (
              <tr key={key} className="hover:bg-blue-50 transition-colors border-b border-slate-200">
                <td className="p-2 sticky left-0 bg-white z-10 border-r border-slate-300 font-bold text-slate-800 text-[10px] min-w-[200px]">
                  {key.toUpperCase()}
                </td>
                {Array.from({length: days}, (_, i) => {
                  const val = values[i];
                  return (
                      <td key={i}
                          className="border-r border-slate-200 text-center min-w-[60px] h-8 text-[10px] text-slate-600">
                        {type === 'number' ? (val && Number(val) > 0 ? Number(val).toLocaleString() : "") : val}
                      </td>
                  );
                })}
                <td className="p-2 sticky right-0 bg-blue-50 z-10 border-l border-slate-300 font-black text-right text-blue-800 text-[10px] min-w-[80px]">
                  {/*{total !== null ? total.toLocaleString() : ""}*/}
                  {finalTotal !== null ? finalTotal.toLocaleString() : ""}
                  {key.toLowerCase().includes('percent') && finalTotal > 0 ? '%' : ''}
                </td>
              </tr>
             );
          })}

          {type === 'number' && showTotal && (
            <tr className="bg-blue-50/50 border-b-2 border-slate-400 font-black italic">
              <td className="p-2 sticky left-0 bg-blue-100/80 z-10 border-r border-slate-300 text-[10px] text-blue-900 min-w-[200px]">
                TOTAL {title.split('.')[1] || title}
              </td>
              {columnTotals.map((colSum, i) => (
                <td key={i} className="border-r border-slate-300 text-center text-[10px] text-blue-900 bg-blue-50/30">
                  {colSum > 0 ? colSum.toLocaleString() : ""}
                </td>
              ))}
              <td className="p-2 sticky right-0 bg-blue-600 z-10 border-l border-blue-700 text-right text-white text-[10px] min-w-[80px]">
                {grandTotal.toLocaleString()}
              </td>
            </tr>
          )}
        </>
      ):(
        <tr className="border-b border-slate-200">
          <td colSpan={days + 2} className="p-4 text-center text-slate-300 italic bg-white text-[10px]">No data recorded</td>
        </tr>
      )}
    </>
  );
}
