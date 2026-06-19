// src/components/daily_report/reportUtils.ts
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import fileSaver from 'file-saver';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// ============================================================================
// 1. TẦNG XỬ LÝ LOGIC DỮ LIỆU CHUẨN HÓA
// ============================================================================

export const getValReport = (
  report: any,
  shift: 'day' | 'night' | 'total',
  key: string,
  formatType: 'number' | 'percent' | 'plain' = 'number',
  fallback = "-"
) => {
  if (!report || !report.kpis || !report.kpis[shift]) return fallback;
  const val = report.kpis[shift][key];
  if (val === undefined || val === null) return fallback;

  if (formatType === 'number') return typeof val === 'number' ? val.toLocaleString() : val;
  if (formatType === 'percent') return typeof val === 'number' ? `${(val * 100).toFixed(2)}%` : val;
  return val;
};

export const getActiveDlncCasesReport = (report: any): string[] => {
  if (!report || !report.dlnc_breakdown || !report.dlnc_breakdown.total) return [];
  return Object.keys(report.dlnc_breakdown.total).filter(caseName => {
    const value = report.dlnc_breakdown.total[caseName];
    return value !== undefined && value !== null && value !== 0 && caseName.toLowerCase() !== 'none';
  });
};

export const getDlncShiftValReport = (report: any, shift: 'day' | 'night' | 'total', caseName: string) => {
  if (!report || !report.dlnc_breakdown || !report.dlnc_breakdown[shift]) return "-";
  const val = report.dlnc_breakdown[shift][caseName];
  if (val === undefined || val === null || val === 0) return "-";
  return typeof val === 'number' ? val.toLocaleString() : val;
};

export const getAggregatedLogsByShiftReport = (report: any, shiftName: 'day' | 'night') => {
  if (!report) return { stopTimes: [], problems: [], comments: [] };

  const currentStops = report.stop_details?.[shiftName] || [];
  const currentProblems = report.problem_details?.[shiftName] || [];

  const stopMap: { [key: string]: number } = {};
  currentStops.forEach((st: any) => {
    const code = st.stopTime || st.stopCode || "UnknownCode";
    const rawDuration = st.hour || st.duration || st.stop_hr || 0;
    const hours = typeof rawDuration === 'string' ? parseFloat(rawDuration) : rawDuration;
    stopMap[code] = (stopMap[code] || 0) + (isNaN(hours) ? 0 : hours);
  });

  const stopTimesList = Object.entries(stopMap).map(([code, totalHours]) => ({
    code,
    hours: totalHours
  }));

  const problemSet = new Set<string>();
  currentProblems.forEach((pr: any) => {
    const pName = pr.problem || pr.problem_name || pr.reason || pr.title;
    if (pName && pName.toString().trim() !== "") problemSet.add(pName.toString().trim());
  });

  const commentSet = new Set<string>();
  if (report.kpis?.[shiftName]?.comments && Array.isArray(report.kpis[shiftName].comments)) {
    report.kpis[shiftName].comments.forEach((c: string) => {
      if (c && c.trim() !== "") commentSet.add(c.trim());
    });
  }

  [...currentStops, ...currentProblems].forEach((log: any) => {
    const cText = log.comment || log.comments || log.description || log.content;
    if (cText && cText.toString().trim() !== "") commentSet.add(cText.toString().trim());
  });

  return {
    stopTimes: stopTimesList,
    problems: Array.from(problemSet),
    comments: Array.from(commentSet)
  };
};

// ============================================================================
// 2. TẦNG XUẤT BẢN FILE ĐẸP NÂNG CAO (EXCELJS UTILITIES)
// ============================================================================

export const exportToExcel = async (report: any, selectedDate: string) => {
  if (!report) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Daily Report');

  const baseFont = { name: 'Segoe UI', size: 10 };
  const thinBorder = {
    top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
  };

  const _v = (shift: 'day' | 'night' | 'total', key: string, type: 'number' | 'percent' | 'plain' = 'number') =>
    getValReport(report, shift, key, type);

  const _d = (shift: 'day' | 'night' | 'total', cName: string) =>
    getDlncShiftValReport(report, shift, cName);

  // 1. Khởi tạo Title chính lớn của tài liệu
  worksheet.mergeCells('A1:D1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = "MARIS DAILY PRODUCTION REPORT";
  titleCell.font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: 'FF1E3A8A' } };
  titleCell.alignment = { horizontal: 'left', vertical: 'middle' };
  worksheet.getRow(1).height = 35;

  // Meta Information
  worksheet.addRow(["Production Date:", selectedDate, "Working hours / Shift:", "12 hrs"]);
  worksheet.addRow(["Product Code:", _v('total', 'product_codes', 'plain'), "", ""]);
  worksheet.addRow([]);

  // 2. Định dạng Header cho các bảng dữ liệu
  const headerRow = worksheet.addRow(["Items Description", "Day Shift", "Night Shift", "Total Combined"]);
  headerRow.height = 25;
  headerRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
    cell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FF334155' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { bottom: { style: 'medium', color: { argb: 'FF1E293B' } } };
  });

  // 3. Khai báo mảng cấu trúc các dòng của Bảng KPI chính kèm Style định danh riêng biệt
  const mainKpiRows = [
    { label: "Operator", day: _v('day', 'employees', 'plain'), night: _v('night', 'employees', 'plain'), total: _v('total', 'employees', 'plain'), style: 'plain' },
    { label: "Product Code", day: _v('day', 'product_codes', 'plain'), night: _v('night', 'product_codes', 'plain'), total: _v('total', 'product_codes', 'plain'), style: 'plain' },
    { label: "Net prod: Good product", day: _v('day', 'goodPro'), night: _v('night', 'goodPro'), total: _v('total', 'goodPro') },
    { label: "TOTAL DLNC", day: _v('day', 'dlnc'), night: _v('night', 'dlnc'), total: _v('total', 'dlnc'), style: 'dlnc' },
  ];

  // Đổ data mảng chính
  mainKpiRows.forEach(r => {
    const newRow = worksheet.addRow([r.label, r.day, r.night, r.total]);
    if (r.style === 'dlnc') {
      newRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
        cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF92400E' } };
      });
    }
  });

  // Thêm động các dòng DLNC Breakdown phụ thuộc vào dữ liệu phát sinh thực tế
  const activeDlnc = getActiveDlncCasesReport(report);
  if (activeDlnc.length > 0) {
    activeDlnc.forEach(cName => {
      const dlncRow = worksheet.addRow([`  - ${cName}`, _d('day', cName), _d('night', cName), _d('total', cName)]);
      dlncRow.getCell(1).font = { name: 'Segoe UI', size: 9.5, italic: true };
      dlncRow.eachCell((cell) => { cell.font = { ...cell.font, color: { argb: 'FF64748B' } }; });
    });
  } else {
    worksheet.addRow(["  - No Dlnc Case recorded -", "-", "-", "-"]);
  }

  // Đổ tiếp các dòng Scrap và Chỉ số Hiệu suất hệ thống
  const performanceRows = [
    { label: "TOTAL SCRAP", day: _v('day', 'scrap'), night: _v('night', 'scrap'), total: _v('total', 'scrap'), style: 'bold' },
    { label: "Scrap from Die", day: _v('day', 'scrapDie'), night: _v('night', 'scrapDie'), total: _v('total', 'scrapDie') },
    { label: "Scrap from Screen Changer", day: _v('day', 'screen'), night: _v('night', 'screen'), total: _v('total', 'screen') },
    { label: "Reject", day: _v('day', 'reject'), night: _v('night', 'reject'), total: _v('total', 'reject') },
    { label: "PROD BRUT", day: _v('day', 'output'), night: _v('night', 'output'), total: _v('total', 'output'), style: 'brut' },
    { label: "Yield", day: _v('day', 'yield_pct', 'percent'), night: _v('night', 'yield_pct', 'percent'), total: _v('total', 'yield_pct', 'percent'), style: 'bold' },
    { label: "Number of kg/h", day: _v('day', 'net_hr'), night: _v('night', 'net_hr'), total: _v('total', 'net_hr') },
    { label: "Number of stopping hours (h)", day: _v('day', 'stop_hr'), night: _v('night', 'stop_hr'), total: _v('total', 'stop_hr') },
    { label: "Util.%", day: _v('day', 'used_pct', 'percent'), night: _v('night', 'used_pct', 'percent'), total: _v('total', 'used_pct', 'percent') },
    { label: "OEE", day: _v('day', 'oee_pct', 'percent'), night: _v('night', 'oee_pct', 'percent'), total: _v('total', 'oee_pct', 'percent'), style: 'oee' },
    { label: "Screw rejections SLAB", day: _v('day', 'visslab'), night: _v('night', 'visslab'), total: _v('total', 'visslab') },
    { label: "% Screw rejections SLAB", day: _v('day', 'visslabPercent', 'percent'), night: _v('night', 'visslabPercent', 'percent'), total: _v('total', 'visslabPercent', 'percent') },
  ];

  performanceRows.forEach(r => {
    const newRow = worksheet.addRow([r.label, r.day, r.night, r.total]);
    if (r.style === 'bold') {
      newRow.getCell(1).font = { name: 'Segoe UI', size: 10, bold: true };
      newRow.getCell(4).font = { name: 'Segoe UI', size: 10, bold: true };
    } else if (r.style === 'brut') {
      newRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFAF3C' } };
        cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF92400E' } };
      });
    } else if (r.style === 'oee') {
      newRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1FAE5' } };
        cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF065F46' } };
      });
    }
  });

  worksheet.addRow([]);

  // 4. BẢNG KHỐI LƯỢNG THẤT THOÁT (LOSTS KGS)
  const lostHeader = worksheet.addRow(["Losts Breakdown", "", "", ""]);
  lostHeader.getCell(1).font = { name: 'Segoe UI', size: 11, bold: true, italic: true };
  worksheet.addRow(["For Yield", _v('day', 'scrap'), _v('night', 'scrap'), _v('total', 'scrap')]);
  worksheet.addRow(["For Disponibility", _v('day', 'lost_disp'), _v('night', 'lost_disp'), _v('total', 'lost_disp')]);

  worksheet.addRow([]);

  // 5. TÍCH HỢP TOÀN DIỆN PHẦN THIẾU 1: OPERATIONAL LOGS CHI TIẾT
  const shifts: ('day' | 'night')[] = ['day', 'night'];
  shifts.forEach(sh => {
    const logData = getAggregatedLogsByShiftReport(report, sh);
    const logTitle = sh === 'day' ? "🟠 DAY SHIFT OPERATIONAL LOGS" : "🌙 NIGHT SHIFT OPERATIONAL LOGS";

    const logHeaderRow = worksheet.addRow([logTitle, "", "", ""]);
    worksheet.mergeCells(`A${logHeaderRow.number}:D${logHeaderRow.number}`);
    logHeaderRow.getCell(1).font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FF1D4ED8' } };
    logHeaderRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0F2FE' } };

    // StopTime Section
    worksheet.addRow(["StopTime:"]).getCell(1).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF475569' } };
    if (logData.stopTimes.length > 0) {
      logData.stopTimes.forEach(item => {
        worksheet.addRow([`  • Code/Time: ${item.code}`, `${item.hours} hours`, "", ""]);
      });
    } else { worksheet.addRow(["  • No Stop Times recorded", "", "", ""]); }

    // Problems Section
    worksheet.addRow(["Problems:"]).getCell(1).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF475569' } };
    if (logData.problems.length > 0) {
      logData.problems.forEach(p => { worksheet.addRow([`  • ${p}`, "", "", ""]); });
    } else { worksheet.addRow(["  • No Problems recorded", "", "", ""]); }

    // Comments Section
    worksheet.addRow(["Comments:"]).getCell(1).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF475569' } };
    if (logData.comments.length > 0) {
      logData.comments.forEach(c => { worksheet.addRow([`  • ${c}`, "", "", ""]); });
    } else { worksheet.addRow(["  • No Comments recorded", "", "", ""]); }

    worksheet.addRow([]);
  });

  // 6. BẢNG SCRAP MARIS & OUTPUT CAPACITY
  const capacityHeader = worksheet.addRow(["Scrap Maris & Output Capacity", "DAY SHIFT", "NIGHT SHIFT", "TOTAL"]);
  capacityHeader.height = 22;
  capacityHeader.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
    cell.font = { name: 'Segoe UI', size: 10, bold: true };
    cell.alignment = { horizontal: 'center' };
  });

  worksheet.addRow(["Scrap Maris (KG)", _v('day', 'scrap'), _v('night', 'scrap'), _v('total', 'scrap')]);

  const outputRow = worksheet.addRow(["OUTPUT (KG/HR)", _v('total', 'net_hr'), "", ""]);
  worksheet.mergeCells(`B${outputRow.number}:D${outputRow.number}`);
  outputRow.getCell(2).font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FF1D4ED8' } };
  outputRow.getCell(2).alignment = { horizontal: 'center' };

  worksheet.addRow(["Setting of kg/h", _v('day', 'setting_kgh', 'plain'), _v('night', 'setting_kgh', 'plain'), _v('total', 'setting_kgh', 'plain')]);

  // Căn lề dữ liệu trái/phải, thêm viền cho toàn bộ ô trong bảng dữ liệu số
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 4) {
      // Bỏ qua không kẻ lưới thô bạo lên các dòng tiêu đề của Nhật ký ca
      const rowFirstVal = row.getCell(1).value?.toString() || "";
      if (rowFirstVal.includes("SHIFT OPERATIONAL LOGS") || rowFirstVal.startsWith("StopTime:") || rowFirstVal.startsWith("Problems:") || rowFirstVal.startsWith("Comments:")) {
        return;
      }

      row.eachCell((cell, colNumber) => {
        if (!cell.border) cell.border = thinBorder;
        if (!cell.font) cell.font = baseFont;
        if (colNumber === 1) {
          cell.alignment = { horizontal: 'left', vertical: 'middle' };
        } else {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        }
      });
    }
  });

  // Tự động căn chỉnh chiều rộng cột vừa vặn với nội dung text dài nhất
  worksheet.columns.forEach(column => {
    let maxLen = 15;
    column.eachCell?.({ includeEmpty: true }, (cell) => {
      const valLen = cell.value ? cell.value.toString().length : 0;
      if (valLen > maxLen) maxLen = valLen;
    });
    column.width = maxLen > 50 ? 50 : maxLen + 4; // Khống chế chiều rộng tối đa tránh vỡ layout cột chữ Log
  });

  // Biên dịch và xuất file nhị phân tải trực tiếp xuống trình duyệt bằng fileSaver an toàn
  const buffer = await workbook.xlsx.writeBuffer();
  fileSaver.saveAs(new Blob([buffer]), `Maris_Production_Report_${selectedDate}.xlsx`);
};

const cleanUnsupportedColors = (clonedDoc: Document) => {
  const elements = clonedDoc.querySelectorAll('*');
  elements.forEach((el: any) => {
    const computedStyle = window.getComputedStyle(el);
    const bg = computedStyle.backgroundColor;
    const border = computedStyle.borderColor;
    const color = computedStyle.color;

    if (bg && (bg.includes('lab') || bg.includes('oklab'))) {
      el.style.backgroundColor = 'transparent';
    }
    if (border && (border.includes('lab') || border.includes('oklab'))) {
      el.style.borderColor = '#cbd5e1';
    }
    if (color && (color.includes('lab') || color.includes('oklab'))) {
      el.style.color = '#0f172a';
    }
  });
};

export const exportToImage = async (element: HTMLDivElement | null, selectedDate: string) => {
  if (!element) return;
  try {
    const canvas = await html2canvas(element, {
      scale: 3,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
      onclone: (clonedDoc) => {
        cleanUnsupportedColors(clonedDoc);
      }
    });
    const imageUri = canvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.download = `Maris_Report_${selectedDate}.jpg`;
    link.href = imageUri;
    link.click();
  } catch (err) {
    console.error("Lỗi xuất ảnh bản in HTML5 Canvas:", err);
  }
};

/**
 * Kết xuất vùng DOM thành PDF khổ A4 và mã hóa chuỗi Base64
 */
export const generatePdfBase64 = async (element: HTMLDivElement | null): Promise<string | null> => {
  if (!element) return null;
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
      onclone: (clonedDoc) => {
        cleanUnsupportedColors(clonedDoc);
      }
    });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 297;
    const calculatedHeight = (canvas.height * imgWidth) / canvas.width;
    const imgHeight = calculatedHeight <= 297 ? calculatedHeight : 296.9;
    let heightLeft = imgHeight;
    let position = 0;

    // Trang đầu tiên
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Tạo thêm trang mới tự động nếu chiều cao bảng vượt quá khổ A4 dọc
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const dataUriString = pdf.output('datauristring');
    return dataUriString.split(',')[1]; // Tách chuỗi raw Base64 loại bỏ header định dạng dữ liệu
  } catch (err) {
    console.error("Lỗi khởi tạo chuỗi PDF Base64:", err);
    return null;
  }
};