"use client";

interface RowProps {
  title: string;
  dataMap: Record<string, (number | string)[]>;
  days: number;
  type: 'number' | 'text';
}

export default function IsoMatrixRow({ title, dataMap, days, type }: RowProps) {
  const keys = dataMap ? Object.keys(dataMap) : [];

  return (
    <>
      <tr className="bg-slate-100 border-b border-slate-300">
        <td colSpan={days + 2} className="px-4 py-1.5 font-black text-[10px] text-slate-700 sticky left-0 z-20 bg-slate-100 uppercase border-r border-slate-300">
          {title}
        </td>
      </tr>
      {keys.length > 0 ? keys.map((key) => {
        const values = dataMap[key];
        const total = type === 'number' ? (values as number[]).reduce((a, b) => a + (Number(b) || 0), 0) : null;

        return (
          <tr key={key} className="hover:bg-blue-50 transition-colors border-b border-slate-200">
            <td className="p-2 sticky left-0 bg-white z-10 border-r border-slate-300 font-bold text-slate-800 text-[10px] min-w-[200px]">
              {key.toUpperCase()}
            </td>
            {Array.from({ length: days }, (_, i) => {
              const val = values[i];
              return (
                <td key={i} className="border-r border-slate-200 text-center min-w-[40px] h-8 text-[10px] text-slate-600">
                  {type === 'number' ? (val && Number(val) > 0 ? Number(val).toLocaleString() : "") : val}
                </td>
              );
            })}
            <td className="p-2 sticky right-0 bg-blue-50 z-10 border-l border-slate-300 font-black text-right text-blue-800 text-[10px] min-w-[80px]">
              {total !== null ? total.toLocaleString() : ""}
            </td>
          </tr>
        );
      }) : (
        <tr className="border-b border-slate-200">
          <td colSpan={days + 2} className="p-4 text-center text-slate-300 italic bg-white text-[10px]">No data recorded</td>
        </tr>
      )}
    </>
  );
}
