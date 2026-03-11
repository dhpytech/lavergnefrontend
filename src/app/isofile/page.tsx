"use client";

import React, { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import IsoHeader from '@/src/components/isofile/IsoHeader';
import IsoMatrixRow from '@/src/components/isofile/IsoMatrixRow';
import styles from '@/src/app/isofile/isofile.module.css';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
export default function IsoFilePage() {
  // Mặc định tháng/năm hiện tại
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    shift: 'total'
  });
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchIsoData = useCallback(async () => {
    setLoading(true);
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://gunicorn-lavergnebackendwsgi-production.up.railway.app';
      const params = new URLSearchParams({
        month: filters.month.toString(),
        year: filters.year.toString(),
        shift: filters.shift
      });
      const res = await fetch(`${BASE_URL}/entries/iso-file/?${params.toString()}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchIsoData(); }, [fetchIsoData]);

  const exportToExcel = async () => {
    if (!data || !data.matrix) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('ISO PRODUCTION REPORT');
    const lastDay = data.metadata.last_day;

    worksheet.columns = [
      { key: 'type', width: 30 },
      ...Array.from({ length: lastDay }, (_, i) => ({ key: `d${i + 1}`, width: 10 })),
      { key: 'total', width: 10 }
    ];

    const titleRow = worksheet.addRow([`ISO PRODUCTION REPORT - MONTH ${filters.month}/${filters.year} - SHIFT: ${filters.shift.toUpperCase()}`]);
    worksheet.mergeCells(1, 1, 1, lastDay + 2);
    titleRow.getCell(1).font = { bold: true, size: 12, name: 'Segoe UI' };
    titleRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
    titleRow.height = 30;
    titleRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E293B' } };
    titleRow.getCell(1).font = { color: { argb: 'FFFFFF' }, bold: true, size: 10, name: 'Segoe UI' };

    const headerLabels = ['TYPE / DATE', ...Array.from({ length: lastDay }, (_, i) => (i + 1).toString()), 'TOTAL'];
    const headerRow = worksheet.addRow(headerLabels);
    headerRow.height = 20;
    headerRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E293B' } };
      cell.font = { color: { argb: 'FFFFFF' }, bold: true, size: 10, name: 'Segoe UI' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin', color: { argb: '475569' } }
      };
    });

    const addSection = (title: string, dataMap: any, isNumber: boolean, manualTotals?: any, showGrandTotal: boolean = true) => {
      const sectionRow = worksheet.addRow([title.toUpperCase()]);
      sectionRow.height = 20;
      worksheet.mergeCells(sectionRow.number, 1, sectionRow.number, lastDay + 2);

      sectionRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F8FAFC' } };
      sectionRow.getCell(1).font = { bold: true, color: { argb: '1E293B' }, size: 10, name: 'Segoe UI' };
      sectionRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
      sectionRow.getCell(1).border = {
        top: { style: 'thin', color: { argb: 'CBD5E1' } },
        bottom: { style: 'thin', color: { argb: 'CBD5E1' } }
      };

      const colTotals = Array(lastDay).fill(0);
      let sectionGrandTotal = 0;

      Object.keys(dataMap).forEach((key) => {
        const values = dataMap[key];
        const rowData = [key.toUpperCase()];

        for (let i = 0; i < lastDay; i++) {
          const val = values[i];
          const num = Number(val) || 0;
          rowData.push(isNumber ? (num !== 0 ? num : "") : (val || ""));
          if (isNumber) colTotals[i] += num;
        }

        const total = (manualTotals && manualTotals[key] !== undefined)
          ? manualTotals[key]
          : (isNumber ? values.reduce((a: any, b: any) => a + (Number(b) || 0), 0) : "");

        if (isNumber) sectionGrandTotal += Number(total) || 0;

        rowData.push(isNumber && total !== "" ? Number(total) : total);
        const newRow = worksheet.addRow(rowData);

        newRow.height = isNumber ? 20 : 35;

        newRow.eachCell((cell, colNumber) => {
          cell.font = { size: 9, name: 'Segoe UI', color: { argb: '334155' } };
          cell.border = {
            bottom: { style: 'hair', color: { argb: 'E2E8F0' } },
            right: { style: 'hair', color: { argb: 'E2E8F0' } }
          };

          cell.alignment = {
            vertical: 'middle',
            horizontal: colNumber === 1 ? 'left' : 'center',
            wrapText: colNumber === 1 || !isNumber
          };

          if (isNumber && typeof cell.value === 'number') {
            cell.numFmt = '#,##0.00';
            if (key.toLowerCase().includes('percent')) cell.numFmt = '0.00"%"';
          }

          if (colNumber === lastDay + 2) {
            cell.font = { bold: true, color: { argb: '1D4ED8' }, size: 9 };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F0F7FF' } };
            cell.alignment = { horizontal: 'right', vertical: 'middle' };
          }
        });
      });

      if (isNumber && showGrandTotal) {
        const totalLabel = "TOTAL " + (title.includes('.') ? title.split('.')[1].trim() : title);
        const totalRowData = [totalLabel.toUpperCase(), ...colTotals.map(v => v || ""), sectionGrandTotal];
        const totalRow = worksheet.addRow(totalRowData);
        totalRow.height = 20;
        totalRow.eachCell((cell, colIdx) => {
          cell.font = { bold: true, size: 9, name: 'Segoe UI' };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F1F5F9' } };
          cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' } };
          if (colIdx > 1) {
            cell.numFmt = '#,##0.00';
            cell.alignment = { horizontal: colIdx === lastDay + 2 ? 'right' : 'center', vertical: 'middle' };
          }
        });
      }
    };

    const m = data.matrix;
    addSection("1. Operator Name", m.operators, false, null, false);
    addSection("2. Summary", m.summary, true, data.summary_totals, false);
    addSection("3. Good Product (KG)", m.production, true);
    addSection("4. Reject Shaker (KG)", m.reject, true);
    addSection("5. Scrap (KG)", m.scrap, true);
    addSection("6. Screen Changer (KG)", m.screen, true);
    addSection("7. Visslab (KG)", m.visslab, true);
    addSection("8. DLNC (KG)", m.dlnc, true);
    addSection("9. Stop Time (Times)", m.numtime, true);
    addSection("10. Stop Time (Hours)", m.downtime, true);
    addSection("11. Problem", m.problems, true);

    worksheet.views = [{ state: 'frozen', xSplit: 1, ySplit: 2 }];

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `ISO_PRODUCTION_REPORT_${filters.month}_${filters.year}.xlsx`);
  };
  const days = data?.metadata?.last_day || 31;

  return (
    <div className="h-screen w-full bg-[#f1f5f9] flex flex-col overflow-hidden font-sans">
      {/* Header cố định */}
      <IsoHeader
        filters={filters}
        setFilters={setFilters}
        onRefresh={fetchIsoData}
        onExport={exportToExcel}
        loading={loading}
      />

      {/* Vùng Main chứa bảng cuộn */}
      <main className="flex-1 px-4 pb-4 overflow-hidden flex flex-col">
        <div className="flex-1 mt-4 bg-white border border-slate-300 flex flex-col overflow-hidden relative shadow-md rounded-sm">

          {/* Vùng cuộn thực sự */}
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full border-collapse min-w-max">
              <thead className="sticky top-0 z-[100]">
                <tr className="bg-[#1e293b] text-white">
                  {/* TYPE/DATE: Sticky cả cột và hàng */}
                  <th className="p-3 sticky left-0 top-0 bg-[#1e293b] border-r border-slate-600 z-[110] text-left min-w-[200px] text-[10px] font-black uppercase">
                    TYPE / DATE
                  </th>

                  {Array.from({ length: days }, (_, i) => (
                    <th key={i} className="border-r border-slate-600 text-center w-[45px] min-w-[45px] text-[10px] font-bold">
                      {i + 1}
                    </th>
                  ))}

                  {/* TOTAL: Sticky cả cột và hàng */}
                  <th className="p-3 sticky right-0 top-0 bg-blue-700 border-l border-blue-800 z-[110] text-right min-w-[70px] w-[70px] text-[10px] font-black">
                    TOTAL
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {data?.matrix && (
                  <>
                    <IsoMatrixRow title="1. Operator Name" dataMap={data.matrix.operators} days={days} type="text" showTotal={false}/>
                    <IsoMatrixRow title="2. SUMMARY" dataMap={data.matrix.summary} manualTotals={data.summary_totals} days={days} type="number" showTotal={false}/>
                    <IsoMatrixRow title="3. Good Product (KG)" dataMap={data.matrix.production} days={days} type="number"/>
                    <IsoMatrixRow title="4. Reject Shaker (KG)" dataMap={data.matrix.reject} days={days} type="number"/>
                    <IsoMatrixRow title="5. Scrap (KG)" dataMap={data.matrix.scrap} days={days} type="number"/>
                    <IsoMatrixRow title="6. Screen Changer (KG)" dataMap={data.matrix.screen} days={days} type="number"/>
                    <IsoMatrixRow title="7. Visslab (KG)" dataMap={data.matrix.visslab} days={days} type="number"/>
                    <IsoMatrixRow title="8. DLNC (KG)" dataMap={data.matrix.dlnc} days={days} type="number"/>
                    <IsoMatrixRow title="9. Stop Time (Times)" dataMap={data.matrix.numtime} days={days} type="number"/>
                    <IsoMatrixRow title="10. Stop Time (Hours)" dataMap={data.matrix.downtime} days={days} type="number"/>
                    <IsoMatrixRow title="11. Problem" dataMap={data.matrix.problems} days={days} type="number"/>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Style bổ trợ cho Scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; border: 2px solid #f1f5f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}
