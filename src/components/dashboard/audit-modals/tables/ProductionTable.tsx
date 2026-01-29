// components/dashboard/audit-modals/tables/ProductionTable.tsx

export default function ProductionTable({ records = [], visibleColumns = [], filterCriteria }: any) {
  const isVisible = (name: string) => visibleColumns.includes(name);

  const filteredRecords = records.filter((item: any) => {
    const matchSku = !filterCriteria?.sku || filterCriteria.sku === 'All' ||
                     item.productCode?.toLowerCase().includes(filterCriteria.sku.toLowerCase());
    const matchShift = !filterCriteria?.shift || filterCriteria.shift === 'Total' ||
                       item.shift === filterCriteria.shift;
    return matchSku && matchShift;
  });

  // ✅ Tính toán tổng số cho các cột
  const totals = filteredRecords.reduce((acc, curr) => ({
    good: acc.good + (Number(curr.goodPro) || 0),
    dlnc: acc.dlnc + (Number(curr.dlnc) || 0),
    reject: acc.reject + (Number(curr.reject) || 0),
    scrap: acc.scrap + (Number(curr.scrap) || 0),
    screen: acc.screen + (Number(curr.screenChanger) || 0),
    vis: acc.vis + (Number(curr.visLab) || 0),
  }), { good: 0, dlnc: 0, reject: 0, scrap: 0, screen: 0, vis: 0 });

  return (
    <div className="w-full h-full overflow-auto">
      <table className="w-full text-[11px] text-left border-collapse min-w-[1200px]">
        <thead className="bg-slate-50 sticky top-0 z-10 border-b-2 border-slate-200">
          <tr className="bg-slate-100">
            <th className="p-4 font-black text-slate-600 uppercase">Date</th>
            <th className="p-4 font-black text-slate-600 uppercase">Shift</th>
            {isVisible("Product Code") && <th className="p-4 text-blue-800 font-black uppercase">Product Code</th>}
            {isVisible("Good Product") && <th className="p-4 text-right font-black uppercase">Good Product</th>}
            {isVisible("DLNC") && <th className="p-4 text-right font-black uppercase">DLNC</th>}
            {isVisible("Total") && <th className="p-4 text-right font-black uppercase text-slate-900 bg-slate-200/30">Total</th>}
            {isVisible("Reject") && <th className="p-4 text-right font-black uppercase text-red-600">Reject</th>}
            {isVisible("Scrap") && <th className="p-4 text-right font-black uppercase text-red-600">Scrap</th>}
            {isVisible("Screen Changer") && <th className="p-4 text-right font-black uppercase">Screen Changer</th>}
            {isVisible("VisLab") && <th className="p-4 text-right font-black uppercase">VisLab</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {filteredRecords.map((item: any, idx: number) => (
            <tr key={idx} className="hover:bg-blue-50/50 transition-colors group">
              <td className="p-4 font-medium text-slate-500">
                {item.date ? new Intl.DateTimeFormat('en-GB').format(new Date(item.date)) : '-'}
              </td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded text-[10px] font-black border ${
                  item.shift === 'Day' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-slate-900 text-white border-slate-900'
                }`}>
                  {item.shift?.toUpperCase()}
                </span>
              </td>
              {isVisible("Product Code") && <td className="p-4 font-black text-blue-700 underline decoration-blue-200 cursor-pointer">{item.productCode}</td>}
              {isVisible("Good Product") && <td className="p-4 text-right font-bold text-blue-700">{Number(item.goodPro || 0).toLocaleString()}</td>}
              {isVisible("DLNC") && <td className="p-4 text-right text-red-700">{Number(item.dlnc || 0).toLocaleString()}</td>}
              {isVisible("Total") && <td className="p-4 text-right font-black text-slate-900 bg-slate-50/50">{(Number(item.goodPro || 0) + Number(item.dlnc || 0)).toLocaleString()}</td>}
              {isVisible("Reject") && <td className="p-4 text-right text-red-700">{Number(item.reject || 0).toLocaleString()}</td>}
              {isVisible("Scrap") && <td className="p-4 text-right text-red-700">{Number(item.scrap || 0).toLocaleString()}</td>}
              {isVisible("Screen Changer") && <td className="p-4 text-right text-red-700">{Number(item.screenChanger || 0).toLocaleString()}</td>}
              {isVisible("VisLab") && <td className="p-4 text-right text-red-700">{Number(item.visLab|| 0).toLocaleString()}</td>}
            </tr>
          ))}
        </tbody>

        {/* ✅ Dòng Grand Total cố định ở cuối bảng */}
        <tfoot className="sticky bottom-0 bg-slate-900 text-white shadow-[0_-5px_15px_rgba(0,0,0,0.2)] font-black uppercase z-20">
          <tr>
            <td colSpan={2} className="p-4 text-center tracking-[0.2em] text-blue-400 border-r border-slate-700">Grand Total</td>
            {isVisible("Product Code") && <td className="p-4 italic text-slate-500 text-[9px] lowercase tracking-tight">results based on filters</td>}
            {isVisible("Good Product") && <td className="p-4 text-right text-emerald-400">{totals.good.toLocaleString('en-US')}</td>}
            {isVisible("DLNC") && <td className="p-4 text-right text-orange-400">{totals.dlnc.toLocaleString()}</td>}
            {isVisible("Total") && <td className="p-4 text-right text-blue-400 bg-slate-800/50">{(totals.good + totals.dlnc).toLocaleString()}</td>}
            {isVisible("Reject") && <td className="p-4 text-right text-red-400">{totals.reject.toLocaleString()}</td>}
            {isVisible("Scrap") && <td className="p-4 text-right text-red-400">{totals.scrap.toLocaleString()}</td>}
            {isVisible("Screen Changer") && <td className="p-4 text-right text-red-400">{totals.screen.toLocaleString()}</td>}
            {isVisible("VisLab") && <td className="p-4 text-right text-red-400">{totals.vis.toLocaleString()}</td>}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
