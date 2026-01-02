import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface MarisSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string | number; label: string }[];
  register: UseFormRegisterReturn;
  placeholder?: string;
  watchValue?: any;
}

export const MarisSelect = ({
  options,
  register,
  placeholder,
  watchValue,
  className = "",
  ...props
}: MarisSelectProps) => {
  return (
    <select
      {...register}
      {...props}
      className={`h-[30px] border border-slate-300 rounded px-2 text-[11px] font-bold outline-none transition-all focus:border-emerald-500
        ${(!watchValue || watchValue === "") ? 'text-slate-400 font-normal' : 'text-slate-900 font-bold'} 
        ${className}`}
    >
      {/* Option này cho phép người dùng quay lại trạng thái trắng */}
      {placeholder && <option value="">{placeholder}</option>}

      {options.map((opt, i) => (
        <option key={`${opt.value}-${i}`} value={opt.value} className="text-slate-900 font-bold">
          {opt.label}
        </option>
      ))}
    </select>
  );
};
