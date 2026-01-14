// components/dashboard/audit-modals/tables/DowntimeTable.tsx

export default function DowntimeTable({ records }: { records: any[] }) {
  // Trích xuất tất cả các sự cố dừng máy từ các bản ghi
  const downtimeRecords = records.flatMap(r =>
    (r.stopTimes || []).map((stop: any) => ({
      date: r.date,
      shift: r.shift,
      employee: r.employee,
      stopType: stop.stopTime,
      hours: stop.hour || 0,
      comment: r.comment
    }))
  ).filter(item => item.hours > 0);

  return (
    <table className="w-full text-sm text-left border-collapse">
      <thead className="bg-amber-50 sticky top-0 font-bold text-amber-800 shadow-sm z-10">
        <tr className="border-b border-amber-100">
          <th className="p-4">Date</th>
          <th className="p-4">Shift</th>
          <th className="p-4">Downtime Category</th>
          <th className="p-4 text-right">Duration (Hr)</th>
          <th className="p-4">PIC / Comment</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {downtimeRecords.length > 0 ? (
          downtimeRecords.map((item, idx) => (
            <tr key={idx} className="hover:bg-amber-50/20 transition-colors">
              <td className="p-4 text-gray-600">{item.date}</td>
              <td className="p-4">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                  {item.shift}
                </span>
              </td>
              <td className="p-4 font-bold text-gray-700">{item.stopType}</td>
              <td className="p-4 text-right font-mono font-bold text-red-600">{item.hours.toFixed(2)}</td>
              <td className="p-4 text-xs text-gray-500 italic max-w-xs truncate">
                {item.employee} - {item.comment || "No logs"}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} className="p-10 text-center text-gray-400 italic">No downtime records found.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
