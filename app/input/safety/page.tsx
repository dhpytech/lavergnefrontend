'use client';

import { useState } from 'react';

// Cấu trúc MỚI: Gửi giá trị code (chữ thường) nhưng hiển thị label (chữ hoa)
const dummyTypes = [
  { code: 'incident', label: 'INCIDENT' },
  { code: 'accident', label: 'ACCIDENT' },
  { code: 'sop', label: 'SOP' },
];

export default function SafetyPage() {
  const [date, setDate] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    // Thêm kiểm tra cho trường 'type' có chọn không
    if (!date || !type || !description) {
      setMessage('⚠️ Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    setLoading(true);
    setMessage('');

    // **LƯU Ý:** Payload vẫn giữ tên trường type
    const payload = {
      safety_date: date, // Đổi tên trường để khớp với Django Model
      safety_type: type,   // Gửi giá trị code ('incident')
      safety_description: description // Đổi tên trường để khớp với Django Model
    };

    try {
      // **LƯU Ý:** Đã giữ URL như bạn cập nhật (không có dấu gạch chéo cuối /)
      const res = await fetch(`http://127.0.0.1:8000/safety/safety-time/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Cố gắng lấy lỗi cụ thể từ server nếu có
        const errorData = await res.json().catch(() => ({ detail: `Lỗi ${res.status}` }));

        // Nếu lỗi 400 Bad Request, thường là lỗi validation (ví dụ: dữ liệu sai kiểu)
        if (res.status === 400) {
           throw new Error(`Lỗi 400: Dữ liệu không hợp lệ. ${JSON.stringify(errorData)}`);
        }

        throw new Error(`Lỗi ${res.status}: ${errorData.detail || 'Lỗi Server nội bộ.'}`);
      }

      const data = await res.json();
      console.log('Safety Submit:', data);

      setMessage('✅ Dữ liệu đã được gửi thành công!');
      setDate('');
      setType('');
      setDescription('');
    } catch (error: any) {
      console.error('Error:', error);
      // Hiển thị thông báo lỗi cụ thể hơn nếu có
      setMessage(`❌ Lỗi khi gửi dữ liệu: ${error.message}. Vui lòng kiểm tra console.`);
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
          type="datetime-local"
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
          {/* Lặp qua dummyTypes MỚI: value là code, hiển thị là label */}
          {dummyTypes.map((t) => (
            <option key={t.code} value={t.code}>
              {t.label}
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