"use client";
import React, { useState, useEffect } from 'react';

// =======================================================
// [CONFIG] Cấu hình API và Model MỚI (Mail)
// =======================================================

// ĐỊNH NGHĨA API BACKEND MỚI
// Giả định endpoint mới là /mail/addresses/
// (Bạn cần điều chỉnh URL này nếu API Django có path khác, ví dụ: 'http://127.0.0.1:8000/mail/addresses/')
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
const API_URL = `${BASE_URL}/mail/mail/`;

// Định nghĩa các lựa chọn trạng thái mail từ Django Model
type MailStatus = 'active' | 'inactive';
const STATUS_CHOICES = {
    active: 'Active',
    inactive: 'Inactive',
};
const DEFAULT_STATUS: MailStatus = 'active';

// Khai báo kiểu dữ liệu mà Component React mong muốn (Mail)
interface Mail {
    id: string | number;
    address: string; // Tương ứng với mail_address
    person: string; // Tương ứng với mail_person
    status: MailStatus; // Tương ứng với mail_status
}

// Khai báo kiểu dữ liệu mà API Django trả về/mong đợi (ApiMail)
interface ApiMail {
    id: string | number;
    mail_address: string;
    mail_person: string;
    mail_status: MailStatus | string;
}

// Hàm chuyển đổi từ API sang Frontend (READ)
const mapApiToFrontend = (apiMail: ApiMail): Mail => {
    let status: MailStatus = DEFAULT_STATUS;
    const mailStatus = apiMail.mail_status.toLowerCase();

    // Ánh xạ an toàn các giá trị hợp lệ từ API
    if (mailStatus === 'active' || mailStatus === 'inactive') {
        status = mailStatus as MailStatus;
    }

    return {
        id: apiMail.id,
        address: apiMail.mail_address, // Map mail_address -> address
        person: apiMail.mail_person, // Map mail_person -> person
        status: status, // Map mail_status -> status
    };
};

// Hàm chuyển đổi từ Frontend sang API (CREATE/UPDATE)
// **QUAN TRỌNG: Giá trị gửi đi luôn là lowercase để khớp với Django choices**
const mapFrontendToApi = (feData: Omit<Mail, 'id'>): Omit<ApiMail, 'id'> => ({
    mail_address: feData.address, // Map address -> mail_address
    mail_person: feData.person, // Map person -> mail_person
    mail_status: feData.status, // Map status -> mail_status (giữ nguyên 'active', 'inactive')
});


// =======================================================
// [ICONS] Định nghĩa các biểu tượng (Giữ nguyên)
// =======================================================

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M5 12h14M12 5v14" /></svg>
);
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
);
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
);
const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
);
const CancelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M18 6 6 18M6 6l12 12" /></svg>
);
const AlertTriangle = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
);
const LoaderIcon = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
const RefreshCw = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6"/><path d="M2.5 22v-6h6"/><path d="M20.9 13.9a9 9 0 1 0-3.4 7.5l-2.8-2.8"/><path d="M7.6 3.1a9 9 0 1 0 3.4 7.5L8.2 8.3"/></svg>
)

// =======================================================
// [MAIN COMPONENT] MailAddressManager (Đã đổi tên)
// =======================================================

export default function MailAddressManager() {
  // State chứa danh sách mail addresses, ban đầu rỗng
  const [mails, setMails] = useState<Mail[]>([]);

  // State quản lý form input
  const [formData, setFormData] = useState<Omit<Mail, 'id'>>({
    address: '', // Mã Sản Phẩm -> Địa Chỉ Email
    person: '', // Mô Tả -> Tên Người/Bộ phận liên quan
    status: DEFAULT_STATUS, // Phân Loại -> Trạng Thái (active/inactive)
  });

  // State quản lý item đang được chỉnh sửa (null nếu đang ở chế độ Thêm mới)
  const [editingItem, setEditingItem] = useState<Mail | null>(null);

  // State quản lý thông báo lỗi
  const [error, setError] = useState<string>('');

  // State quản lý trạng thái tải (loading) khi tương tác với API
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // States cho modal xác nhận xóa
  const [itemToDelete, setItemToDelete] = useState<Mail | null>(null);

  // ------------------------------------
  // [CRUD - READ] Tải dữ liệu từ API
  // ------------------------------------
  const fetchItems = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Lỗi tải dữ liệu: ${response.status}`);
      }
      const apiData: ApiMail[] = await response.json();

      // Ánh xạ dữ liệu từ cấu trúc API sang cấu trúc Frontend
      const frontendData: Mail[] = apiData.map(mapApiToFrontend);

      setMails(frontendData); // Đã đổi setItem -> setMails
      console.log("Dữ liệu Mail đã tải và ánh xạ thành công:", frontendData);
    } catch (err) {
      console.error("Fetch Error:", err);
      // Sử dụng `error` trong state để hiển thị thông báo lỗi API ra UI
      setError("Không thể kết nối hoặc tải dữ liệu từ API backend. Vui lòng kiểm tra server.");
    } finally {
      setIsLoading(false);
    }
  };

  // Tự động tải dữ liệu khi component được mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Xử lý thay đổi input trong form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value as MailStatus }); // Đảm bảo type casting
    setError('');
  };

  // Hàm kiểm tra tính hợp lệ cục bộ (cho trải nghiệm người dùng nhanh)
  const validateForm = () => {
    // Kiểm tra các trường bắt buộc
    if (!formData.address.trim() || !formData.person.trim()) {
      setError('Địa chỉ Email và Tên người/Bộ phận không được để trống.');
      return false;
    }
    // Kiểm tra định dạng Email cơ bản
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.address.trim())) {
        setError('Địa chỉ Email không đúng định dạng.');
        return false;
    }

    // Kiểm tra trùng lặp cục bộ (Server sẽ kiểm tra lại lần cuối)
    const isDuplicate = mails.some(
      mail => mail.address.trim().toLowerCase() === formData.address.trim().toLowerCase() && mail.id !== editingItem?.id
    );
    if (isDuplicate) {
        setError(`Địa chỉ Email "${formData.address.trim()}" đã tồn tại cục bộ. Vui lòng kiểm tra lại.`);
        return false;
    }
    return true;
  };

  // Hàm xử lý lỗi từ Server (Django REST Framework)
  const handleServerError = async (response: Response) => {
      // Cố gắng đọc body lỗi
      let errorData: any;
      try {
          errorData = await response.json();
      } catch {
          // Nếu không phải JSON, trả về lỗi cơ bản
          return `Lỗi Server (${response.status}): ${response.statusText}`;
      }

      console.error("Lỗi chi tiết từ Server:", errorData);

      let message = `Lỗi Server (${response.status}): `;

      // Kiểm tra lỗi theo tên trường API MỚI (mail_address, mail_person)
      if (errorData.mail_address && errorData.mail_address[0]) {
          // Xử lý lỗi unique email
          message = `Lỗi Validation: ${errorData.mail_address[0]} (Email đã bị trùng hoặc không hợp lệ).`;
      } else if (errorData.mail_person && errorData.mail_person[0]) {
          // Xử lý lỗi mail_person
           message = `Lỗi Validation (Người/Bộ Phận): ${errorData.mail_person[0]}.`;
      } else if (typeof errorData === 'object' && !Array.isArray(errorData)) {
          // Xử lý các lỗi validation chung khác
          message += Object.entries(errorData).map(([key, value]) =>
              `${key}: ${Array.isArray(value) ? value.join(', ') : value}`
          ).join('; ');
      } else {
          message += response.statusText;
      }
      return message;
  }

  // ------------------------------------
  // [CRUD - CREATE] Thêm mới Mail (POST)
  // ------------------------------------
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
        // Ánh xạ dữ liệu từ Frontend sang cấu trúc API trước khi gửi
        const itemDataToSend = mapFrontendToApi({
            ...formData,
            address: formData.address.trim(), // Trim address
            person: formData.person.trim() // Trim person
        });

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemDataToSend),
        });

        if (!response.ok) {
            const errorMessage = await handleServerError(response);
            setError(errorMessage);
            setIsLoading(false);
            return;
        }

        const newItemApi: ApiMail = await response.json(); // Nhận object mới kèm ID từ DB
        const newItemFrontend: Mail = mapApiToFrontend(newItemApi); // Ánh xạ lại về cấu trúc Frontend

        setMails(prevItems => [...prevItems, newItemFrontend]); // Đã đổi setItems -> setMails
        setFormData({ address: '', person: '', status: DEFAULT_STATUS }); // Reset form
        setError('');

    } catch (err) {
        console.error("Lỗi khi thêm mới:", err);
        setError("Lỗi kết nối mạng: Không thể gửi yêu cầu đến Server.");
    } finally {
        setIsLoading(false);
    }
  };

  // ------------------------------------
  // [CRUD - UPDATE] Cập nhật Mail (PUT)
  // ------------------------------------
  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !validateForm() || isLoading) return;

    setIsLoading(true);
    setError('');
    // Xây dựng URL cho thao tác trên một mục cụ thể
    const itemUrl = `${API_URL}${editingItem.id}/`;

    try {
        // Ánh xạ dữ liệu từ Frontend sang cấu trúc API trước khi gửi
        const itemDataToSend = mapFrontendToApi({
            address: formData.address.trim(),
            person: formData.person.trim(),
            status: formData.status
        });

        const response = await fetch(itemUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemDataToSend),
        });

        if (!response.ok) {
            const errorMessage = await handleServerError(response);
            setError(errorMessage);
            setIsLoading(false);
            return;
        }

        const updatedItemApi: ApiMail = await response.json();
        const updatedItemFrontend: Mail = mapApiToFrontend(updatedItemApi); // Ánh xạ lại về cấu trúc Frontend


        setMails(prevItems => prevItems.map(item => // Đã đổi setItems -> setMails
          item.id === editingItem.id ? updatedItemFrontend : item
        ));

        handleCancelEdit(); // Kết thúc chỉnh sửa

    } catch (err) {
        console.error("Lỗi khi cập nhật:", err);
        setError("Lỗi kết nối mạng: Không thể gửi yêu cầu cập nhật.");
    } finally {
        setIsLoading(false);
    }
  };

  // Bắt đầu chỉnh sửa
  const handleStartEdit = (item: Mail) => {
    setEditingItem(item);
    setFormData({
      address: item.address,
      person: item.person,
      status: item.status,
    });
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hủy bỏ chỉnh sửa và reset form
  const handleCancelEdit = () => {
    setEditingItem(null);
    setFormData({ address: '', person: '', status: DEFAULT_STATUS });
    setError('');
  };

  // ------------------------------------
  // [CRUD - DELETE] Xóa Mail (DELETE)
  // ------------------------------------

  // Chuẩn bị xóa (Mở modal)
  const handlePrepareDelete = (item: Mail) => {
    setItemToDelete(item);
  };

  // Xác nhận xóa (Thực hiện xóa)
  const confirmDelete = async () => {
      if (!itemToDelete || isLoading) return;

      setIsLoading(true);
      setError('');
      const itemUrl = `${API_URL}${itemToDelete.id}/`;

      try {
        const response = await fetch(itemUrl, {
            method: 'DELETE',
        });

        // Django REST Framework thường trả về 204 No Content cho DELETE thành công
        if (response.status !== 204 && response.status !== 200) {
            throw new Error(`Lỗi Server: ${response.status}`);
        }

        // Cập nhật state cục bộ sau khi Server xác nhận xóa thành công
        setMails(prevItems => prevItems.filter(item => item.id !== itemToDelete.id)); // Đã đổi setItems -> setMails

        if (editingItem && editingItem.id === itemToDelete.id) {
            handleCancelEdit();
        }
      } catch (err) {
        console.error("Lỗi khi xóa:", err);
        setError("Lỗi hệ thống: Không thể xóa địa chỉ email.");
      } finally {
        setItemToDelete(null); // Đóng modal
        setIsLoading(false);
      }
  };

  // Hủy xóa (Đóng modal)
  const cancelDelete = () => {
      setItemToDelete(null);
  };


  // Form chung (Thêm mới/Chỉnh sửa)
  const FormComponent = (
    <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-blue-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        {editingItem ? (
            <>
                <EditIcon /> Chỉnh sửa Mail: <span className="text-blue-600 ml-2">{editingItem.address}</span>
            </>
        ) : (
            <>
                <PlusIcon /> Thêm Địa Chỉ Email Mới
            </>
        )}
      </h2>

      {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm" role="alert">
              <div className="text-red-500">
                  <AlertTriangle/>
              </div>
              {error}
          </div>
      )}

        <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

          {/* Địa Chỉ Email */}
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Địa Chỉ Email</label>
            <input
              id="address"
              name="address"
              type="email" // Đã đổi type sang email
              value={formData.address}
              onChange={handleChange}
              placeholder="Ví dụ: hotmail@company.com"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              required
              disabled={isLoading}
            />
          </div>

          {/* Tên Người/Bộ Phận */}
          <div>
            <label htmlFor="person" className="block text-sm font-medium text-gray-700 mb-1">Người/Bộ Phận Liên Quan</label>
            <input
              id="person"
              name="person"
              type="text"
              value={formData.person}
              onChange={handleChange}
              placeholder="Tên người hoặc bộ phận chịu trách nhiệm"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              required
              disabled={isLoading}
            />
          </div>

          {/* Trạng Thái */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Trạng Thái</label>
              <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  disabled={isLoading}
              >
                  {/* Sử dụng STATUS_CHOICES để map */}
                  {Object.entries(STATUS_CHOICES).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                  ))}
              </select>
          </div>
        </div>

          {/* Nút Action */}
        <div className="pt-2 flex space-x-3">
          {editingItem ? (
            <>
              <button
                type="submit"
                className="flex items-center justify-center px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition duration-200 disabled:opacity-50"
                disabled={!formData.address || !formData.person || isLoading}
              >
                {isLoading ? <LoaderIcon /> : <SaveIcon />}
                {isLoading ? 'Đang Lưu...' : 'Lưu Thay Đổi'}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow hover:bg-gray-400 transition duration-200 disabled:opacity-50"
                disabled={isLoading}
              >
                <CancelIcon /> Hủy
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-200 disabled:opacity-50"
              disabled={!formData.address || !formData.person || isLoading}
            >
              {isLoading ? <LoaderIcon /> : <PlusIcon />}
              {isLoading ? 'Đang Thêm...' : 'Thêm Mới'}
            </button>
          )}
        </div>
      </form>
    </div>
  );

  // Modal xác nhận xóa
  const ConfirmationModal = itemToDelete && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="text-red-500" />
          <h3 className="text-xl font-bold text-gray-900">Xác Nhận Xóa</h3>
        </div>
        <p className="text-gray-700 mb-6">
          Bạn có chắc chắn muốn xóa Địa Chỉ Email:
          <span className="font-semibold text-red-600 ml-1">{itemToDelete.address}</span>
          ? Hành động này không thể hoàn tác.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={cancelDelete}
            className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
            disabled={isLoading}
          >
            Hủy
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center"
            disabled={isLoading}
          >
            {isLoading ? <LoaderIcon /> : null}
            {isLoading ? 'Đang Xóa...' : 'Xác Nhận Xóa'}
          </button>
        </div>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {ConfirmationModal}

      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">
        Quản Lý Địa Chỉ Email (Mail Addresses)
      </h1>

      {/* Form Thêm/Sửa */}
      {FormComponent}

      {/* Bảng Danh Sách */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
        <div className="p-4 flex justify-between items-center bg-blue-50 border-b border-blue-100">
            <h2 className="text-xl font-bold text-gray-800">Danh Sách Email ({mails.length} mục)</h2>
             <button
                onClick={fetchItems}
                disabled={isLoading}
                className="flex items-center text-sm px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
            >
                <RefreshCw />
                <span className="ml-1">{isLoading ? 'Đang Tải...' : 'Làm Mới Dữ Liệu'}</span>
            </button>
        </div>

        {isLoading && mails.length === 0 ? (
            <div className="p-6 text-center text-blue-600 font-semibold flex items-center justify-center">
                <LoaderIcon /> Đang tải dữ liệu từ Server...
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa Chỉ Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người/Bộ Phận Liên Quan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành Động</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {mails.length === 0 ? (
                    <tr>
                        <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-center text-gray-500 italic">
                        {error ? 'Không thể tải dữ liệu.' : 'Chưa có địa chỉ email nào được thêm.'}
                        </td>
                    </tr>
                    ) : (
                    mails.map((item) => ( // Đã đổi items.map -> mails.map
                        <tr key={item.id} className={editingItem?.id === item.id ? 'bg-yellow-50 hover:bg-yellow-100 transition duration-150' : 'hover:bg-gray-50 transition duration-150'}>
                        <td className="px-6 py-4 font-mono text-sm font-semibold text-blue-700">
                            {item.address}
                            <span className="text-xs text-gray-400 ml-2">[{item.id}]</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                            {item.person}
                        </td>
                        <td className="px-6 py-4 text-sm">
                            {/* Hiển thị Status với màu sắc tương ứng */}
                            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${
                            item.status === 'active' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                            }`}>
                            {STATUS_CHOICES[item.status].toUpperCase()}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => handleStartEdit(item)}
                                className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50 transition duration-150 flex items-center disabled:opacity-50"
                                title="Chỉnh sửa"
                                disabled={isLoading}
                            >
                                <EditIcon />
                            </button>
                            <button
                                onClick={() => handlePrepareDelete(item)}
                                className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition duration-150 flex items-center disabled:opacity-50"
                                title="Xóa"
                                disabled={isLoading}
                            >
                                <TrashIcon />
                            </button>
                            </div>
                        </td>
                        </tr>
                    ))
                    )}
                </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
}
