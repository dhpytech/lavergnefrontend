"use client";
import React, { useState, useEffect } from 'react';

// =======================================================
// [CONFIG] Cấu hình API và Model (ĐÃ CẬP NHẬT)
// =======================================================

// ĐỊNH NGHĨA API BACKEND (ĐÃ CẬP NHẬT)
const API_URL = 'http://127.0.0.1:8000/employee/employee'; // Giả định API endpoint là /employee/

// Khai báo kiểu dữ liệu mà Component React mong muốn
interface Employee {
  id: string | number; // ID từ DB
  employeeId: string; // employee_id (Trường chính, dùng để nhập liệu)
  name: string; // employee_name
  position: string; // employee_position
}

// Khai báo kiểu dữ liệu mà API Django trả về/mong đợi
interface ApiEmployee {
    id: string | number; // ID tự động (nếu có, thường không dùng)
    employee_id: number; // Trường chính
    employee_name: string;
    employee_position: string;
}

// Hàm chuyển đổi từ API sang Frontend (READ) (ĐÃ CẬP NHẬT)
const mapApiToFrontend = (apiEmployee: ApiEmployee): Employee => {
    return {
        id: apiEmployee.id || apiEmployee.employee_id, // Sử dụng ID tự động nếu có, hoặc employee_id
        employeeId: String(apiEmployee.employee_id), // Chuyển số thành chuỗi để dễ làm việc với input
        name: apiEmployee.employee_name,
        position: apiEmployee.employee_position,
    };
};

// Hàm chuyển đổi từ Frontend sang API (CREATE/UPDATE) (ĐÃ CẬP NHẬT)
const mapFrontendToApi = (feData: Omit<Employee, 'id'>): Omit<ApiEmployee, 'id'> => ({
    // Chuyển lại về kiểu number nếu API yêu cầu
    employee_id: Number(feData.employeeId),
    employee_name: feData.name,
    employee_position: feData.position,
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
// [MAIN COMPONENT] EmployeeManager (ĐÃ CẬP NHẬT TÊN)
// =======================================================

export default function EmployeeManager() {
  // State chứa danh sách nhân viên
  const [employees, setEmployees] = useState<Employee[]>([]);

  // State quản lý form input (ĐÃ CẬP NHẬT)
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    employeeId: '',
    name: '',
    position: '',
  });

  // State quản lý item đang được chỉnh sửa
  const [editingItem, setEditingItem] = useState<Employee | null>(null);

  // State quản lý thông báo lỗi
  const [error, setError] = useState<string>('');

  // State quản lý trạng thái tải (loading)
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // States cho modal xác nhận xóa
  const [itemToDelete, setItemToDelete] = useState<Employee | null>(null);

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
      const apiData: ApiEmployee[] = await response.json();

      // Ánh xạ dữ liệu từ cấu trúc API sang cấu trúc Frontend
      const frontendData: Employee[] = apiData.map(mapApiToFrontend);

      setEmployees(frontendData);
      console.log("Dữ liệu nhân viên đã tải và ánh xạ thành công:", frontendData);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Không thể kết nối hoặc tải dữ liệu Nhân viên từ API backend. Vui lòng kiểm tra server.");
    } finally {
      setIsLoading(false);
    }
  };

  // Tự động tải dữ liệu khi component được mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Xử lý thay đổi input trong form (ĐÃ CẬP NHẬT)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // Không cần type casting phức tạp, chỉ cần cập nhật state
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // Hàm kiểm tra tính hợp lệ cục bộ (ĐÃ CẬP NHẬT LOGIC CHECK)
  const validateForm = () => {
    if (!formData.employeeId.trim() || !formData.name.trim() || !formData.position.trim()) {
      setError('ID Nhân viên, Tên và Chức vụ không được để trống.');
      return false;
    }
    if (isNaN(Number(formData.employeeId.trim()))) {
        setError('ID Nhân viên phải là một số.');
        return false;
    }

    // Kiểm tra trùng lặp ID cục bộ
    const isDuplicate = employees.some(
      // Chỉ kiểm tra trùng lặp nếu ID mới khác ID cũ (trong chế độ Edit)
      item => item.employeeId.trim() === formData.employeeId.trim() && item.id !== editingItem?.id
    );
    if (isDuplicate) {
        setError(`ID Nhân viên "${formData.employeeId.trim()}" đã tồn tại cục bộ. Vui lòng kiểm tra lại.`);
        return false;
    }
    return true;
  };

  // Hàm xử lý lỗi từ Server (Django REST Framework) (ĐÃ CẬP NHẬT TÊN TRƯỜNG)
  const handleServerError = async (response: Response) => {
      let errorData: any;
      try {
          errorData = await response.json();
      } catch {
          return `Lỗi Server (${response.status}): ${response.statusText}`;
      }

      console.error("Lỗi chi tiết từ Server:", errorData);

      let message = `Lỗi Server (${response.status}): `;

      // Kiểm tra lỗi theo tên trường API
      if (errorData.employee_id && errorData.employee_id[0]) {
          message = `Lỗi Validation: ${errorData.employee_id[0]} (ID Nhân viên đã bị trùng hoặc không hợp lệ).`;
      } else if (errorData.employee_name && errorData.employee_name[0]) {
          message = `Lỗi Validation: ${errorData.employee_name[0]} (Tên Nhân viên không hợp lệ).`;
      } else if (errorData.employee_position && errorData.employee_position[0]) {
          message = `Lỗi Validation: ${errorData.employee_position[0]} (Chức vụ không hợp lệ).`;
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
  // [CRUD - CREATE] Thêm mới Employee (POST)
  // ------------------------------------
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
        // Ánh xạ dữ liệu từ Frontend sang cấu trúc API trước khi gửi
        const itemDataToSend = mapFrontendToApi({
             employeeId: formData.employeeId.trim(),
             name: formData.name.trim(),
             position: formData.position.trim(),
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

        const newItemApi: ApiEmployee = await response.json(); // Nhận object mới kèm ID từ DB
        const newItemFrontend: Employee = mapApiToFrontend(newItemApi); // Ánh xạ lại về cấu trúc Frontend

        setEmployees(prevItems => [...prevItems, newItemFrontend]);
        setFormData({ employeeId: '', name: '', position: '' }); // Reset form
        setError('');

    } catch (err) {
        console.error("Lỗi khi thêm mới:", err);
        setError("Lỗi kết nối mạng: Không thể gửi yêu cầu đến Server.");
    } finally {
        setIsLoading(false);
    }
  };

  // ------------------------------------
  // [CRUD - UPDATE] Cập nhật Employee (PUT)
  // ------------------------------------
  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !validateForm() || isLoading) return;

    setIsLoading(true);
    setError('');
    // Xây dựng URL cho thao tác trên một mục cụ thể
    // Giả sử API sử dụng trường employee_id làm lookup cho PUT/DELETE
    const itemUrl = `${API_URL}${editingItem.employeeId}/`;

    try {
        // Ánh xạ dữ liệu từ Frontend sang cấu trúc API trước khi gửi
        const itemDataToSend = mapFrontendToApi({
            employeeId: formData.employeeId.trim(),
            name: formData.name.trim(),
            position: formData.position.trim()
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

        const updatedItemApi: ApiEmployee = await response.json();
        const updatedItemFrontend: Employee = mapApiToFrontend(updatedItemApi); // Ánh xạ lại về cấu trúc Frontend


        setEmployees(prevItems => prevItems.map(item =>
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

  // Bắt đầu chỉnh sửa (ĐÃ CẬP NHẬT)
  const handleStartEdit = (item: Employee) => {
    setEditingItem(item);
    setFormData({
      employeeId: item.employeeId,
      name: item.name,
      position: item.position,
    });
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hủy bỏ chỉnh sửa và reset form (ĐÃ CẬP NHẬT)
  const handleCancelEdit = () => {
    setEditingItem(null);
    setFormData({ employeeId: '', name: '', position: '' });
    setError('');
  };

  // ------------------------------------
  // [CRUD - DELETE] Xóa Employee (DELETE)
  // ------------------------------------

  // Chuẩn bị xóa (Mở modal)
  const handlePrepareDelete = (item: Employee) => {
    setItemToDelete(item);
  };

  // Xác nhận xóa (Thực hiện xóa)
  const confirmDelete = async () => {
      if (!itemToDelete || isLoading) return;

      setIsLoading(true);
      setError('');
      // Giả sử API sử dụng trường employee_id làm lookup cho DELETE
      const itemUrl = `${API_URL}${itemToDelete.employeeId}/`;

      try {
        const response = await fetch(itemUrl, {
            method: 'DELETE',
        });

        if (response.status !== 204 && response.status !== 200) {
            throw new Error(`Lỗi Server: ${response.status}`);
        }

        // Cập nhật state cục bộ sau khi Server xác nhận xóa thành công
        setEmployees(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));

        if (editingItem && editingItem.id === itemToDelete.id) {
            handleCancelEdit();
        }
      } catch (err) {
        console.error("Lỗi khi xóa:", err);
        setError("Lỗi hệ thống: Không thể xóa nhân viên.");
      } finally {
        setItemToDelete(null); // Đóng modal
        setIsLoading(false);
      }
  };

  // Hủy xóa (Đóng modal)
  const cancelDelete = () => {
      setItemToDelete(null);
  };


  // Form chung (Thêm mới/Chỉnh sửa) (ĐÃ CẬP NHẬT NỘI DUNG)
  const FormComponent = (
    <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-blue-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        {editingItem ? (
            <>
                <EditIcon /> Chỉnh sửa Nhân viên: <span className="text-blue-600 ml-2">{editingItem.name}</span>
            </>
        ) : (
            <>
                <PlusIcon /> Thêm Nhân Viên Mới
            </>
        )}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

          {/* ID Nhân Viên */}
          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">ID Nhân Viên</label>
            <input
              id="employeeId"
              name="employeeId"
              type="text" // Dùng text để kiểm soát format, validate khi submit
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="Ví dụ: 1001"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              required
              disabled={isLoading}
            />
          </div>

          {/* Tên Nhân Viên */}
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Tên Nhân Viên</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ví dụ: Nguyễn Văn A"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              required
              disabled={isLoading}
            />
          </div>

          {/* Chức Vụ */}
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Chức Vụ</label>
            <input
              id="position"
              name="position"
              type="text"
              value={formData.position}
              onChange={handleChange}
              placeholder="Ví dụ: Lập trình viên"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              required
              disabled={isLoading}
            />
          </div>
          {/* Đã loại bỏ trường Category/Phân loại vì không có trong Employee Model */}
        </div>

          {/* Nút Action */}
        <div className="pt-2 flex space-x-3">
          {editingItem ? (
            <>
              <button
                type="submit"
                className="flex items-center justify-center px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition duration-200 disabled:opacity-50"
                // ĐÃ CẬP NHẬT CHECK REQUIRED
                disabled={!formData.employeeId || !formData.name || !formData.position || isLoading}
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
              // ĐÃ CẬP NHẬT CHECK REQUIRED
              disabled={!formData.employeeId || !formData.name || !formData.position || isLoading}
            >
              {isLoading ? <LoaderIcon /> : <PlusIcon />}
              {isLoading ? 'Đang Thêm...' : 'Thêm Mới'}
            </button>
          )}
        </div>
      </form>
    </div>
  );

  // Modal xác nhận xóa (ĐÃ CẬP NHẬT NỘI DUNG)
  const ConfirmationModal = itemToDelete && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="text-red-500" />
          <h3 className="text-xl font-bold text-gray-900">Xác Nhận Xóa</h3>
        </div>
        <p className="text-gray-700 mb-6">
          Bạn có chắc chắn muốn xóa Nhân Viên:
          <span className="font-semibold text-red-600 ml-1">{itemToDelete.name} ({itemToDelete.employeeId})</span>
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
        Quản Lý Nhân Viên
      </h1>

      {/* Form Thêm/Sửa */}
      {FormComponent}

      {/* Bảng Danh Sách */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
        <div className="p-4 flex justify-between items-center bg-blue-50 border-b border-blue-100">
            <h2 className="text-xl font-bold text-gray-800">Danh Sách Nhân Viên ({employees.length} mục)</h2>
             <button
                onClick={fetchItems}
                disabled={isLoading}
                className="flex items-center text-sm px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
            >
                <RefreshCw />
                <span className="ml-1">{isLoading ? 'Đang Tải...' : 'Làm Mới Dữ Liệu'}</span>
            </button>
        </div>

        {isLoading && employees.length === 0 ? (
            <div className="p-6 text-center text-blue-600 font-semibold flex items-center justify-center">
                <LoaderIcon /> Đang tải dữ liệu từ Server...
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                    {/* ĐÃ CẬP NHẬT HEADER */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Nhân Viên</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Nhân Viên</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chức Vụ</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành Động</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {employees.length === 0 ? (
                    <tr>
                        <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-center text-gray-500 italic">
                        {error ? 'Không thể tải dữ liệu.' : 'Chưa có nhân viên nào được thêm.'}
                        </td>
                    </tr>
                    ) : (
                    employees.map((item) => (
                        <tr key={item.id} className={editingItem?.id === item.id ? 'bg-yellow-50 hover:bg-yellow-100 transition duration-150' : 'hover:bg-gray-50 transition duration-150'}>
                        {/* ID Nhân Viên */}
                        <td className="px-6 py-4 font-mono text-sm font-semibold text-blue-700">
                            {item.employeeId}
                            <span className="text-xs text-gray-400 ml-2">[{item.id}]</span>
                        </td>
                        {/* Tên Nhân Viên */}
                        <td className="px-6 py-4 text-sm text-gray-900">
                            {item.name}
                        </td>
                        {/* Chức Vụ */}
                        <td className="px-6 py-4 text-sm">
                             <span className='inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800'>
                                {item.position}
                             </span>
                        </td>
                        {/* Hành Động */}
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
