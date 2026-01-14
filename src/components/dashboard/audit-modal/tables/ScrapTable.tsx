// components/dashboard/audit-modals/tables/ScrapTable.tsx

export default function ScrapTable({ records }: { records: any[] }) {
  // Chỉ lọc ra các dòng có Scrap hoặc Reject để bảng gọn gàng hơn
  const scrapRecords = records.filter(r => (r.scrap + r.reject) > 0);

  return (
    <table className="w-full text-sm text-left border-collapse">
      <thead className="bg-red-50 sticky top-0 font-bold text-red-700 shadow-sm z-10">
        <tr className="border-b border-red-100">
          <th className="p-4">Date</th>
          <th className="p-4">Product Code</th>
          <th className="p-4 text-right">Scrap (KG)</th>
          <th className="p-4 text-right">Reject (KG)</th>
          <th className="p-4">Employee</th>
          <th className="p-4">Reason/Comment</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {scrapRecords.length > 0 ? (
          scrapRecords.map((item, idx) => (
            <tr key={idx} className="hover:bg-red-50/30 transition-colors">
              <td className="p-4 text-gray-600 font-medium">{item.date}</td>
              <td className="p-4 font-mono font-bold text-blue-700">{item.productCode}</td>
              <td className="p-4 text-right font-bold text-red-600">{item.scrap.toLocaleString()}</td>
              <td className="p-4 text-right font-bold text-orange-600">{item.reject.toLocaleString()}</td>
              <td className="p-4 text-gray-600">{item.employee}</td>
              <td className="p-4 text-xs text-gray-500 italic max-w-xs truncate" title={item.comment}>
                {item.comment || "---"}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="p-10 text-center text-gray-400 italic">No scrap data found for this period.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
