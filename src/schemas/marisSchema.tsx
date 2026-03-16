import { z } from 'zod';

const unitSchema = z.object({
  date: z.string().min(0),
  employee: z.string().min(0),
  shift: z.string().min(1),
  production_data: z.array(z.object({
    productCode: z.string().min(0),
    goodPro: z.coerce.number().default(0),
    dlnc: z.coerce.number().default(0),
    case: z.string().default('Color'),
    reject: z.coerce.number().default(0),
    scrap: z.coerce.number().default(0),
    screenChanger: z.coerce.number().default(0),
    visLab: z.coerce.number().default(0),
    outputSetting: z.coerce.number().default(0),
  })).default([]),
  stop_time_data: z.array(z.object({
    stopCode: z.string().min(1),
    duration: z.coerce.number().min(0),
  })).default([]),
  problems: z.array(z.object({
    problemCode: z.string().min(1),
    duration: z.coerce.number().min(0),
  })).default([]),
  comment: z.string().optional(),
});

export const multiMarisSchema = z.object({
  units: z.array(unitSchema)
});

export type MultiMarisValues = z.infer<typeof multiMarisSchema>;

