export default function ProductionTable({ records }: { records: any[] }) {
  return (
    <table className="w-full text-sm text-left border-collapse">
      <thead className="bg-blue-50 sticky top-0 font-bold text-blue-600">
        <tr className="border-b">
          <th className="p-3">Date</th>
          <th className="p-3">Shift</th>
          <th className="p-3">Product SKU</th>
          <th className="p-3 text-right">Good (KG)</th>
          <th className="p-3 text-right">Scrap (KG)</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {records.map((item, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            <td className="p-3">{item.date}</td>
            <td className="p-3"><span className="text-[10px] font-bold border px-1 rounded">{item.shift}</span></td>
            <td className="p-3 font-bold text-blue-700">{item.productCode}</td>
            <td className="p-3 text-right">{item.goodPro.toLocaleString()}</td>
            <td className="p-3 text-right text-red-500">{item.scrap.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
