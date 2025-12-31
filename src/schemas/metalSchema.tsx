import { z } from 'zod';

const metalRowSchema = z.object({
  productCode: z.string().min(1, "Bắt buộc"),
  action: z.string().min(1, "Bắt buộc"),
  inputQty: z.coerce.number().min(0).default(0),
  outputQty: z.coerce.number().min(0).default(0),
});

const metalEntrySchema = z.object({
  date: z.string().min(1, "Bắt buộc"),
  employee: z.string().min(1, "Bắt buộc"),
  shift: z.string().min(1, "Bắt buộc"),
  lot_number: z.string().min(1, "Bắt buộc"),
  production_data: z.array(metalRowSchema).min(1),
});

export const multiMetalSchema = z.object({
  entries: z.array(metalEntrySchema)
});

export type MultiMetalValues = z.infer<typeof multiMetalSchema>;