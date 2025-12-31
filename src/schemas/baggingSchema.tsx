import { z } from 'zod';

const baggingRowSchema = z.object({
  productCode: z.string().min(1, "Bắt buộc"),
  inputQty: z.coerce.number().min(0).default(0),
  outputQty: z.coerce.number().min(0).default(0),
});

const baggingEntrySchema = z.object({
  date: z.string().min(1, "Bắt buộc"),
  employee_1: z.string().min(1, "Bắt buộc"),
  employee_2: z.string().min(1, "Bắt buộc"),
  shift: z.string().min(1, "Bắt buộc"),
  lot_number: z.string().min(1, "Bắt buộc"),
  production_data: z.array(baggingRowSchema).min(1),
});

export const multiBaggingSchema = z.object({
  entries: z.array(baggingEntrySchema)
});

export type MultiBaggingValues = z.infer<typeof multiBaggingSchema>;
