'use client';

import { useState } from 'react';

const dummyProductCodes = ['BG001', 'BG002', 'BG003'];
const dummyEmployees = ['Nguyen Van A', 'Tran Thi B', 'Le Van C'];

export default function BaggingPage() {
  const [date, setDate] = useState('');
  const [lot, setLot] = useState('');
  const [shift, setShift] = useState('1');
  const [employee1, setEmployee1] = useState('');
  const [employee2, setEmployee2] = useState('');

  const [rows, setRows] = useState(
    Array(5).fill({
      productCode: '',
      inputQty: '',
      outputQty: '',
    })
  );

  const handleChange = (index: number, key: string, value: string) => {
    const updated = [...rows];
    updated[index] = {
      ...updated[index],
      [key]: value,
    };
    setRows(updated);
  };

  const handleSubmit = () => {
    const payload = {
      date,
      lot,
      shift,
      employee1,
      employee2,
      data: rows,
    };
    console.log('Bagging Submit:', payload);
    // Gửi dữ liệu lên backend nếu cần
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bagging Input</h1>

      {/* Thông tin chung */}
      <h2 className="text-lg font-semibold">Thông tin chung</h2>
      <div className="grid grid-cols-5 gap-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
          placeholder="Ngày"
        />
        <input
          type="text"
          value={lot}
          onChange={(e) => setLot(e.target.value)}
          className="border p-2 rounded"
          placeholder="LOT"
        />
        <select
          value={shift}
          onChange={(e) => setShift(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="1">Ca 1</option>
          <option value="2">Ca 2</option>
          <option value="3">Ca 3</option>
        </select>
        <select
          value={employee1}
          onChange={(e) => setEmployee1(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Chọn nhân viên 1</option>
          {dummyEmployees.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
        <select
          value={employee2}
          onChange={(e) => setEmployee2(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Chọn nhân viên 2</option>
          {dummyEmployees.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>

      {/* Dữ liệu chính */}
      <h2 className="text-lg font-semibold">Dữ liệu Bagging</h2>
      <div className="space-y-4">
        {rows.map((row, index) => (
          <div key={index} className="grid grid-cols-3 gap-2">
            <select
              value={row.productCode}
              onChange={(e) => handleChange(index, 'productCode', e.target.value)}
              className="border p-1 rounded"
            >
              <option value="">Product Code</option>
              {dummyProductCodes.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Input QTY"
              value={row.inputQty}
              onChange={(e) => handleChange(index, 'inputQty', e.target.value)}
              className="border p-1 rounded"
            />

            <input
              type="number"
              placeholder="Output QTY"
              value={row.outputQty}
              onChange={(e) => handleChange(index, 'outputQty', e.target.value)}
              className="border p-1 rounded"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Nhập Dữ Liệu
      </button>
    </div>
  );
}
