'use client';

import { useState } from 'react';

const dummyTypes = [
  'INCIDENT',
  'ACCIDENT',
];

export default function SafetyPage() {
  const [date, setDate] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!date || !type || !description) {
      setMessage('⚠️ Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    setLoading(true);
    setMessage('');

    const payload = { date, type, description };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/safety/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Lỗi ${res.status}`);
      }

      const data = await res.json();
      console.log('Safety Submit:', data);

      setMessage('✅ Dữ liệu đã được gửi thành công!');
      setDate('');
      setType('');
      setDescription('');
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Lỗi khi gửi dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Safety Input</h1>

      <h2 className="text-lg font-semibold">Thông tin sự cố an toàn</h2>
      <div className="grid grid-cols-3 gap-4">
        {/* Ngày xảy ra */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
          placeholder="Ngày xảy ra"
        />

        {/* Loại sự cố */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Chọn loại sự cố</option>
          {dummyTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Mô tả */}
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
          placeholder="Mô tả chi tiết"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`${
          loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        } text-white px-4 py-2 rounded`}
      >
        {loading ? 'Đang gửi...' : 'Nhập Dữ Liệu'}
      </button>

      {message && <p className="text-sm font-medium">{message}</p>}
    </div>
  );
}
