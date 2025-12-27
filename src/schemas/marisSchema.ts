import { z } from 'zod';

export const marisSchema = z.object({
  date: z.string().min(1, "Ngày không được để trống"),
  employee: z.string().min(1, "Nhân viên không được để trống"),
  shift: z.string().min(1, "Ca không được để trống"),
  // Bảng sản xuất chính với đầy đủ 9 cột kỹ thuật
  production_data: z.array(z.object({
    productCode: z.string().min(1),
    goodPro: z.coerce.number().default(0),
    dlnc: z.coerce.number().default(0),
    case: z.string().default('Case A'),
    reject: z.coerce.number().default(0),
    scrap: z.coerce.number().default(0),
    screenChanger: z.coerce.number().default(0),
    visLab: z.coerce.number().default(0),
    outputSetting: z.coerce.number().default(0),
  })).min(1),
  // Dynamic Form cho dừng máy
  stop_time_data: z.array(z.object({
    stopCode: z.string().min(1),
    duration: z.coerce.number().min(0),
  })).default([]),
  // Dynamic Form cho lỗi chất lượng
  problems: z.array(z.object({
    problemCode: z.string().min(1),
    duration: z.coerce.number().min(0),
  })).default([]),
  comment: z.string().optional(),
});

export type MarisFormValues = z.infer<typeof marisSchema>;
