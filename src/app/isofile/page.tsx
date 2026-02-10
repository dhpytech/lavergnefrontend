"use client";

import React, { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx'
import IsoHeader from '@/src/components/isofile/IsoHeader';
import IsoMatrixRow from '@/src/components/isofile/IsoMatrixRow';
import styles from '@/src/app/isofile/isofile.module.css';

export default function IsoFilePage() {
  const [filters, setFilters] = useState({ month: 6, year: 2025, shift: 'total' });
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchIsoData = useCallback(async () => {
    setLoading(true);
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
      const params = new URLSearchParams({ month: filters.month.toString(), year: filters.year.toString(), shift: filters.shift });
      const res = await fetch(`${BASE_URL}/entries/iso-file/?${params.toString()}`);
      const json = await res.json();
      setData(json);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchIsoData(); }, [fetchIsoData]);
  const exportToExcel = () => {
      if (!data || !data.matrix) return;

      const lastDay = data.metadata.last_day;
      const excelData: any[] = [];

      // Tạo tiêu đề cột: Ngày 1 -> Last Day và cột TOTAL
      const headerRow = ["TYPE / DATE", ...Array.from({ length: lastDay }, (_, i) => i + 1), "TOTAL"];
      excelData.push(headerRow);

      // Hàm helper để thêm từng nhóm dữ liệu (Production, Scrap, Downtime...)
      const addSection = (title: string, dataMap: any, isNumber: boolean, manualTotals?: any) => {
        excelData.push([]); // Dòng trống để phân cách các nhóm
        excelData.push([title.toUpperCase()]); // Dòng tiêu đề của nhóm

        Object.keys(dataMap).forEach((key) => {
          const rowValues = dataMap[key];
          const row: any[] = [key.toUpperCase()];

          for (let i = 0; i < lastDay; i++) {

            const val = rowValues[i];
            // Nếu là số và bằng 0, thì đẩy chuỗi rỗng vào mảng
            if (isNumber) {
              row.push(val && Number(val) !== 0 ? Number(val) : "");
            } else {
              row.push(val || "");
            }

            // row.push(isNumber ? (Number(rowValues[i]) || 0) : (rowValues[i] || ""));
          }

          // Lấy Total chuẩn (đặc biệt quan trọng cho phần % của Summary)
          const totalValue = (manualTotals && manualTotals[key] !== undefined)
            ? manualTotals[key]
            : (isNumber ? rowValues.reduce((a: any, b: any) => a + (Number(b) || 0), 0) : "");

          row.push(totalValue);
          excelData.push(row);
        });
      };

    const m = data.matrix;
    addSection("1. Operator Name", m.operators, false);
    addSection("2. Summary", m.summary, true, data.summary_totals);
    addSection("3. Good Product (KG)", m.production, true);
    addSection("4. Reject (KG)", m.reject, true);
    addSection("5. Scrap Die (KG)", m.scrap, true);
    addSection("6. Screen Changer (KG)", m.screen, true);
    addSection("7. Visslab (KG)", m.visslab, true);
    addSection("8. Dlnc (KG)", m.dlnc, true);

    addSection("9. Stop Time (Times)", m.numtime, true);
    addSection("10. Stop Time (Hours)", m.downtime, true);
    addSection("11. Problem (Hours)", m.problems, true);

    const worksheet = XLSX.utils.aoa_to_sheet(excelData);

    // Định dạng độ rộng cột để báo cáo đẹp hơn
    worksheet['!cols'] = [{ wch: 30 }, ...Array(lastDay).fill({ wch: 6 }), { wch: 12 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Production Matrix");
    XLSX.writeFile(workbook, `ISO_Report_${filters.month}_${filters.year}.xlsx`);
  };

  const days = data?.metadata?.last_day || 31;

  return (
    // <div className="flex flex-col h-screen bg-[#f1f5f9] p-4 overflow-hidden ${styles.container}" >
    <div className={`flex flex-col h-screen bg-[#f1f5f9] p-4 overflow-hidden ${styles.container}`}>
      <IsoHeader filters={filters} setFilters={setFilters} onRefresh={fetchIsoData} onExport={exportToExcel}
                 loading={loading}/>

      <div className="flex-1 mt-4 bg-white border border-slate-300 overflow-hidden relative shadow-sm">
        <div className="overflow-auto h-full custom-scrollbar">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-50">
            <tr className="bg-[#1e293b] text-white">
              <th className="p-3 sticky left-0 bg-[#1e293b] border-r border-slate-600 z-50 text-left min-w-[200px] text-[10px] font-black">TYPE
                / DATE
              </th>
              {Array.from({length: days}, (_, i) => (
                  <th key={i} className="border-r border-slate-600 text-center w-[40px] text-[10px]">{i + 1}</th>
              ))}
              <th className="p-3 sticky right-0 bg-blue-700 z-50 text-right min-w-[80px] text-[10px] font-black">TOTAL</th>
            </tr>
            </thead>
            <tbody className="bg-white">
            {data?.matrix && (
                <>
                  <IsoMatrixRow title="1. Operator Name" dataMap={data.matrix.operators} days={days} type="text"
                                showTotal={false}/>
                  <IsoMatrixRow title="2. SUMMARY" dataMap={data.matrix.summary} manualTotals={data.summary_totals}
                                days={days} type="number" showTotal={false}/>

                  <IsoMatrixRow title="3. Good Product (KG)" dataMap={data.matrix.production} days={days}
                                type="number"/>
                  <IsoMatrixRow title="4. Reject Shaker (KG)" dataMap={data.matrix.reject} days={days}
                                type="number"/>
                  <IsoMatrixRow title="5. Scrap (KG)" dataMap={data.matrix.scrap} days={days} type="number"/>
                  <IsoMatrixRow title="6. Screen Changer (KG)" dataMap={data.matrix.screen} days={days}
                                type="number"/>
                  <IsoMatrixRow title="7. Visslab (KG)" dataMap={data.matrix.visslab} days={days} type="number"/>
                  <IsoMatrixRow title="8. DLNC (KG)" dataMap={data.matrix.dlnc} days={days} type="number"/>

                  <IsoMatrixRow title="9. Stop Time (Times)" dataMap={data.matrix.numtime} days={days}
                                type="number"/>
                  <IsoMatrixRow title="10. Stop Time (Hours)" dataMap={data.matrix.downtime} days={days}
                                type="number"/>

                  <IsoMatrixRow title="11. Problem" dataMap={data.matrix.problems} days={days} type="number"/>
                </>
            )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  );
}