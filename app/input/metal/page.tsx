'use client';

import { useState } from 'react';

const dummyProductCodes = ['MT001', 'MT002', 'MT003'];
const dummyActions = ['Cutting', 'Polishing', 'Assembling'];
const dummyEmployees = ['Nguyen Van A', 'Tran Thi B', 'Le Van C'];

export default function MetalPage() {
  const [date, setDate] = useState('');
  const [employee, setEmployee] = useState('');
  const [shift, setShift] = useState('1');
  const [lot, setLot] = useState('');

  const [rows, setRows] = useState(
    Array(5).fill({
      productCode: '',
      action: '',
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
      employee,
      shift,
      lot,
      data: rows,
    };
    console.log('Metal Submit:', payload);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Metal Input</h1>

      {/* Phần Thông tin chung */}
      <h2 className="text-lg font-semibold pb-1">Thông tin chung</h2>
      <div className="grid grid-cols-4 gap-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={employee}
          onChange={(e) => setEmployee(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Chọn nhân viên</option>
          {dummyEmployees.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
        <select
          value={shift}
          onChange={(e) => setShift(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="1">Ca 1</option>
          <option value="2">Ca 2</option>
          <option value="3">Ca 3</option>
        </select>
        <input
          type="text"
          placeholder="LOT"
          value={lot}
          onChange={(e) => setLot(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* Phần dữ liệu chính */}
      <h2 className="text-lg font-semibold pb-1">Dữ liệu Metal</h2>
      <div className="space-y-4">
        {rows.map((row, index) => (
          <div key={index} className="grid grid-cols-4 gap-2">
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

            <select
              value={row.action}
              onChange={(e) => handleChange(index, 'action', e.target.value)}
              className="border p-1 rounded"
            >
              <option value="">Action</option>
              {dummyActions.map((action) => (
                <option key={action} value={action}>
                  {action}
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
