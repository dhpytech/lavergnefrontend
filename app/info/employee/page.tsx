"use client";
import React, { useState, useEffect } from 'react';

// =======================================================
<<<<<<< HEAD
// [CONFIG] Cấu hình API và Model (ĐÃ CẬP NHẬT)
// =======================================================

// ĐỊNH NGHĨA API BACKEND (ĐÃ CẬP NHẬT)
const API_URL = 'http://127.0.0.1:8000/employee/employee'; // Giả định API endpoint là /employee/

// Khai báo kiểu dữ liệu mà Component React mong muốn
interface Employee {
  id: string | number; // ID từ DB
  employeeId: string; // employee_id (Trường chính, dùng để nhập liệu)
=======
// [CONFIG] Cấu hình API và Model MỚI (Employee)
// =======================================================

// ĐỊNH NGHĨA API BACKEND MỚI
// Thay thế ItemCode API bằng Employee API (Giả sử: http://127.0.0.1:8000/employee/employees/)
const API_URL = 'http://127.0.0.1:8000/employee/employees/'; // Vui lòng cập nhật đúng URL của bạn!


// Khai báo kiểu dữ liệu mà Component React mong muốn
// Dựa trên Django Model: employee_id, employee_name, employee_position
interface Employee {
  id: number; // Mặc định dùng id là primary key
  employeeId: number | string; // employee_id
>>>>>>> aea4fe9 (FE01)
  name: string; // employee_name
  position: string; // employee_position
}

// Khai báo kiểu dữ liệu mà API Django trả về/mong đợi
interface ApiEmployee {
<<<<<<< HEAD
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
=======
    employee_id: number | string;
    employee_name: string;
    employee_position: string;
    // Thêm trường id nếu API Django trả về, nếu không thì dùng employee_id làm PK
    id?: number;
}

// Hàm chuyển đổi từ API sang Frontend (READ)
const mapApiToFrontend = (apiEmployee: ApiEmployee): Employee => {
    return {
        // Dùng id từ API nếu có, nếu không thì dùng employee_id
        id: apiEmployee.id || (typeof apiEmployee.employee_id === 'number' ? apiEmployee.employee_id : Math.random()),
        employeeId: apiEmployee.employee_id, // Map employee_id -> employeeId
        name: apiEmployee.employee_name, // Map employee_name -> name
        position: apiEmployee.employee_position, // Map employee_position -> position
    };
};

// Hàm chuyển đổi từ Frontend sang API (CREATE/UPDATE)
const mapFrontendToApi = (feData: Omit<Employee, 'id'>): Omit<ApiEmployee, 'id'> => ({
    employee_id: feData.employeeId, // Map employeeId -> employee_id
    employee_name: feData.name, // Map name -> employee_name
    employee_position: feData.position, // Map position -> employee_position
>>>>>>> aea4fe9 (FE01)
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
<<<<<<< HEAD
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
=======
// [MAIN COMPONENT] EmployeeManager
// =======================================================

export default function App() {
  // State chứa danh sách nhân viên
  const [employees, setEmployees] = useState<Employee[]>([]);

  // State quản lý form input
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    employeeId: '', // employee_id
    name: '', // employee_name
    position: '', // employee_position
  });

  // State quản lý item đang được chỉnh sửa
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
>>>>>>> aea4fe9 (FE01)

  // State quản lý thông báo lỗi
  const [error, setError] = useState<string>('');

  // State quản lý trạng thái tải (loading)
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // States cho modal xác nhận xóa
<<<<<<< HEAD
  const [itemToDelete, setItemToDelete] = useState<Employee | null>(null);
=======
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
>>>>>>> aea4fe9 (FE01)

  // ------------------------------------
  // [CRUD - READ] Tải dữ liệu từ API
  // ------------------------------------
<<<<<<< HEAD
  const fetchItems = async () => {
=======
  const fetchEmployees = async () => {
>>>>>>> aea4fe9 (FE01)
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
<<<<<<< HEAD
      setError("Không thể kết nối hoặc tải dữ liệu Nhân viên từ API backend. Vui lòng kiểm tra server.");
=======
      // Sử dụng `error` trong state để hiển thị thông báo lỗi API ra UI
      setError("Không thể kết nối hoặc tải dữ liệu nhân viên từ API backend. Vui lòng kiểm tra server.");
>>>>>>> aea4fe9 (FE01)
    } finally {
      setIsLoading(false);
    }
  };

  // Tự động tải dữ liệu khi component được mount
  useEffect(() => {
<<<<<<< HEAD
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
=======
    fetchEmployees();
  }, []);

  // Xử lý thay đổi input trong form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // Xử lý đặc biệt cho employeeId để đảm bảo nó là số (hoặc string nếu cần)
    const value = e.target.name === 'employeeId' ? e.target.value.replace(/[^0-9]/g, '') : e.target.value;

    setFormData({ ...formData, [e.target.name]: value });
    setError('');
  };

  // Hàm kiểm tra tính hợp lệ cục bộ
  const validateForm = () => {
    if (!formData.employeeId || !formData.name.trim() || !formData.position.trim()) {
      setError('ID, Tên và Vị trí của Nhân viên không được để trống.');
      return false;
    }
    // Chuyển employeeId thành number để so sánh
    const currentEmployeeId = Number(formData.employeeId);

    // Kiểm tra trùng lặp employeeId cục bộ
    const isDuplicate = employees.some(
      emp =>
        Number(emp.employeeId) === currentEmployeeId &&
        emp.id !== editingEmployee?.id
    );
    if (isDuplicate) {
        setError(`Mã nhân viên "${currentEmployeeId}" đã tồn tại cục bộ. Vui lòng kiểm tra lại.`);
>>>>>>> aea4fe9 (FE01)
        return false;
    }
    return true;
  };

<<<<<<< HEAD
  // Hàm xử lý lỗi từ Server (Django REST Framework) (ĐÃ CẬP NHẬT TÊN TRƯỜNG)
=======
  // Hàm xử lý lỗi từ Server (Django REST Framework)
>>>>>>> aea4fe9 (FE01)
  const handleServerError = async (response: Response) => {
      let errorData: any;
      try {
          errorData = await response.json();
      } catch {
          return `Lỗi Server (${response.status}): ${response.statusText}`;
      }

      console.error("Lỗi chi tiết từ Server:", errorData);

      let message = `Lỗi Server (${response.status}): `;

<<<<<<< HEAD
      // Kiểm tra lỗi theo tên trường API
=======
      // Kiểm tra lỗi theo tên trường API (employee_id, employee_name, employee_position)
>>>>>>> aea4fe9 (FE01)
      if (errorData.employee_id && errorData.employee_id[0]) {
          message = `Lỗi Validation: ${errorData.employee_id[0]} (ID Nhân viên đã bị trùng hoặc không hợp lệ).`;
      } else if (errorData.employee_name && errorData.employee_name[0]) {
          message = `Lỗi Validation: ${errorData.employee_name[0]} (Tên Nhân viên không hợp lệ).`;
      } else if (errorData.employee_position && errorData.employee_position[0]) {
<<<<<<< HEAD
          message = `Lỗi Validation: ${errorData.employee_position[0]} (Chức vụ không hợp lệ).`;
=======
          message = `Lỗi Validation: ${errorData.employee_position[0]} (Vị trí Nhân viên không hợp lệ).`;
>>>>>>> aea4fe9 (FE01)
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
<<<<<<< HEAD
             employeeId: formData.employeeId.trim(),
             name: formData.name.trim(),
             position: formData.position.trim(),
=======
            employeeId: Number(formData.employeeId), // Đảm bảo gửi số nếu cần
            name: formData.name.trim(),
            position: formData.position.trim()
>>>>>>> aea4fe9 (FE01)
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

<<<<<<< HEAD
        const newItemApi: ApiEmployee = await response.json(); // Nhận object mới kèm ID từ DB
        const newItemFrontend: Employee = mapApiToFrontend(newItemApi); // Ánh xạ lại về cấu trúc Frontend
=======
        const newItemApi: ApiEmployee = await response.json();
        const newItemFrontend: Employee = mapApiToFrontend(newItemApi);
>>>>>>> aea4fe9 (FE01)

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
<<<<<<< HEAD
    if (!editingItem || !validateForm() || isLoading) return;

    setIsLoading(true);
    setError('');
    // Xây dựng URL cho thao tác trên một mục cụ thể
    // Giả sử API sử dụng trường employee_id làm lookup cho PUT/DELETE
    const itemUrl = `${API_URL}${editingItem.employeeId}/`;
=======
    if (!editingEmployee || !validateForm() || isLoading) return;

    setIsLoading(true);
    setError('');
    // Xây dựng URL cho thao tác trên một mục cụ thể (sử dụng employee_id làm PK nếu không có id)
    // Giả sử API sử dụng employee_id làm phần của URL (ví dụ: /employees/101/)
    const itemUrl = `${API_URL}${editingEmployee.employeeId}/`;
>>>>>>> aea4fe9 (FE01)

    try {
        // Ánh xạ dữ liệu từ Frontend sang cấu trúc API trước khi gửi
        const itemDataToSend = mapFrontendToApi({
<<<<<<< HEAD
            employeeId: formData.employeeId.trim(),
=======
            employeeId: Number(formData.employeeId), // Đảm bảo gửi số nếu cần
>>>>>>> aea4fe9 (FE01)
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
<<<<<<< HEAD
          item.id === editingItem.id ? updatedItemFrontend : item
=======
          item.id === editingEmployee.id ? updatedItemFrontend : item
>>>>>>> aea4fe9 (FE01)
        ));

        handleCancelEdit(); // Kết thúc chỉnh sửa

    } catch (err) {
        console.error("Lỗi khi cập nhật:", err);
        setError("Lỗi kết nối mạng: Không thể gửi yêu cầu cập nhật.");
    } finally {
        setIsLoading(false);
    }
  };

<<<<<<< HEAD
  // Bắt đầu chỉnh sửa (ĐÃ CẬP NHẬT)
  const handleStartEdit = (item: Employee) => {
    setEditingItem(item);
    setFormData({
      employeeId: item.employeeId,
      name: item.name,
      position: item.position,
=======
  // Bắt đầu chỉnh sửa
  const handleStartEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      employeeId: employee.employeeId,
      name: employee.name,
      position: employee.position,
>>>>>>> aea4fe9 (FE01)
    });
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

<<<<<<< HEAD
  // Hủy bỏ chỉnh sửa và reset form (ĐÃ CẬP NHẬT)
  const handleCancelEdit = () => {
    setEditingItem(null);
=======
  // Hủy bỏ chỉnh sửa và reset form
  const handleCancelEdit = () => {
    setEditingEmployee(null);
>>>>>>> aea4fe9 (FE01)
    setFormData({ employeeId: '', name: '', position: '' });
    setError('');
  };

  // ------------------------------------
  // [CRUD - DELETE] Xóa Employee (DELETE)
  // ------------------------------------

  // Chuẩn bị xóa (Mở modal)
<<<<<<< HEAD
  const handlePrepareDelete = (item: Employee) => {
    setItemToDelete(item);
=======
  const handlePrepareDelete = (employee: Employee) => {
    setEmployeeToDelete(employee);
>>>>>>> aea4fe9 (FE01)
  };

  // Xác nhận xóa (Thực hiện xóa)
  const confirmDelete = async () => {
<<<<<<< HEAD
      if (!itemToDelete || isLoading) return;

      setIsLoading(true);
      setError('');
      // Giả sử API sử dụng trường employee_id làm lookup cho DELETE
      const itemUrl = `${API_URL}${itemToDelete.employeeId}/`;
=======
      if (!employeeToDelete || isLoading) return;

      setIsLoading(true);
      setError('');
      // Sử dụng employeeId (primary key trong Django Model)
      const itemUrl = `${API_URL}${employeeToDelete.employeeId}/`;
>>>>>>> aea4fe9 (FE01)

      try {
        const response = await fetch(itemUrl, {
            method: 'DELETE',
        });

<<<<<<< HEAD
=======
        // Django REST Framework thường trả về 204 No Content cho DELETE thành công
>>>>>>> aea4fe9 (FE01)
        if (response.status !== 204 && response.status !== 200) {
            throw new Error(`Lỗi Server: ${response.status}`);
        }

        // Cập nhật state cục bộ sau khi Server xác nhận xóa thành công
<<<<<<< HEAD
        setEmployees(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));

        if (editingItem && editingItem.id === itemToDelete.id) {
=======
        setEmployees(prevItems => prevItems.filter(item => item.id !== employeeToDelete.id));

        if (editingEmployee && editingEmployee.id === employeeToDelete.id) {
>>>>>>> aea4fe9 (FE01)
            handleCancelEdit();
        }
      } catch (err) {
        console.error("Lỗi khi xóa:", err);
        setError("Lỗi hệ thống: Không thể xóa nhân viên.");
      } finally {
<<<<<<< HEAD
        setItemToDelete(null); // Đóng modal
=======
        setEmployeeToDelete(null); // Đóng modal
>>>>>>> aea4fe9 (FE01)
        setIsLoading(false);
      }
  };

  // Hủy xóa (Đóng modal)
  const cancelDelete = () => {
<<<<<<< HEAD
      setItemToDelete(null);
  };


  // Form chung (Thêm mới/Chỉnh sửa) (ĐÃ CẬP NHẬT NỘI DUNG)
  const FormComponent = (
    <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-blue-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        {editingItem ? (
            <>
                <EditIcon /> Chỉnh sửa Nhân viên: <span className="text-blue-600 ml-2">{editingItem.name}</span>
=======
      setEmployeeToDelete(null);
  };


  // Form chung (Thêm mới/Chỉnh sửa)
  const FormComponent = (
    <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-blue-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        {editingEmployee ? (
            <>
                <EditIcon /> Chỉnh sửa Nhân viên: <span className="text-blue-600 ml-2">{editingEmployee.name}</span>
>>>>>>> aea4fe9 (FE01)
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

<<<<<<< HEAD
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
=======
      <form onSubmit={editingEmployee ? handleUpdateItem : handleAddItem} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

          {/* employee_id */}
          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">Mã Nhân Viên (PK)</label>
            <input
              id="employeeId"
              name="employeeId"
              type="number" // Đảm bảo input là số
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="Ví dụ: 101"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              required
              disabled={isLoading || (editingEmployee !== null)} // Không cho phép sửa employeeId khi đang edit
            />
          </div>

          {/* employee_name */}
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ Tên Nhân Viên</label>
>>>>>>> aea4fe9 (FE01)
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

<<<<<<< HEAD
          {/* Chức Vụ */}
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Chức Vụ</label>
=======
          {/* employee_position - Dùng input text đơn giản thay vì select */}
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Vị Trí/Chức Danh</label>
>>>>>>> aea4fe9 (FE01)
            <input
              id="position"
              name="position"
              type="text"
              value={formData.position}
              onChange={handleChange}
<<<<<<< HEAD
              placeholder="Ví dụ: Lập trình viên"
=======
              placeholder="Ví dụ: Trưởng phòng QA"
>>>>>>> aea4fe9 (FE01)
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              required
              disabled={isLoading}
            />
          </div>
<<<<<<< HEAD
          {/* Đã loại bỏ trường Category/Phân loại vì không có trong Employee Model */}
=======
>>>>>>> aea4fe9 (FE01)
        </div>

          {/* Nút Action */}
        <div className="pt-2 flex space-x-3">
<<<<<<< HEAD
          {editingItem ? (
=======
          {editingEmployee ? (
>>>>>>> aea4fe9 (FE01)
            <>
              <button
                type="submit"
                className="flex items-center justify-center px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition duration-200 disabled:opacity-50"
<<<<<<< HEAD
                // ĐÃ CẬP NHẬT CHECK REQUIRED
=======
>>>>>>> aea4fe9 (FE01)
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
<<<<<<< HEAD
              // ĐÃ CẬP NHẬT CHECK REQUIRED
=======
>>>>>>> aea4fe9 (FE01)
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

<<<<<<< HEAD
  // Modal xác nhận xóa (ĐÃ CẬP NHẬT NỘI DUNG)
  const ConfirmationModal = itemToDelete && (
=======
  // Modal xác nhận xóa
  const ConfirmationModal = employeeToDelete && (
>>>>>>> aea4fe9 (FE01)
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="text-red-500" />
          <h3 className="text-xl font-bold text-gray-900">Xác Nhận Xóa</h3>
        </div>
        <p className="text-gray-700 mb-6">
          Bạn có chắc chắn muốn xóa Nhân Viên:
<<<<<<< HEAD
          <span className="font-semibold text-red-600 ml-1">{itemToDelete.name} ({itemToDelete.employeeId})</span>
          ? Hành động này không thể hoàn tác.
=======
          <span className="font-semibold text-red-600 ml-1">{employeeToDelete.name}</span>
          ? (ID: {employeeToDelete.employeeId}). Hành động này không thể hoàn tác.
>>>>>>> aea4fe9 (FE01)
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
<<<<<<< HEAD
        Quản Lý Nhân Viên
=======
        Quản Lý Nhân Viên (Employee)
>>>>>>> aea4fe9 (FE01)
      </h1>

      {/* Form Thêm/Sửa */}
      {FormComponent}

      {/* Bảng Danh Sách */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
        <div className="p-4 flex justify-between items-center bg-blue-50 border-b border-blue-100">
            <h2 className="text-xl font-bold text-gray-800">Danh Sách Nhân Viên ({employees.length} mục)</h2>
             <button
<<<<<<< HEAD
                onClick={fetchItems}
=======
                onClick={fetchEmployees}
>>>>>>> aea4fe9 (FE01)
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
<<<<<<< HEAD
                    {/* ĐÃ CẬP NHẬT HEADER */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Nhân Viên</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Nhân Viên</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chức Vụ</th>
=======
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã NV (PK)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ Tên Nhân Viên</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vị Trí</th>
>>>>>>> aea4fe9 (FE01)
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
<<<<<<< HEAD
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
=======
                    employees.map((employee) => (
                        <tr key={employee.id} className={editingEmployee?.id === employee.id ? 'bg-yellow-50 hover:bg-yellow-100 transition duration-150' : 'hover:bg-gray-50 transition duration-150'}>
                        <td className="px-6 py-4 font-mono text-sm font-semibold text-blue-700">
                            {employee.employeeId}
                            <span className="text-xs text-gray-400 ml-2">[{employee.id}]</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                            {employee.name}
                        </td>
                        <td className="px-6 py-4 text-sm">
                            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${
                            employee.position.toLowerCase().includes('trưởng') ? 'bg-indigo-100 text-indigo-800' :
                            employee.position.toLowerCase().includes('phòng') ? 'bg-green-100 text-green-800' :
                            'bg-orange-100 text-orange-800'
                            }`}>
                            {employee.position}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => handleStartEdit(employee)}
>>>>>>> aea4fe9 (FE01)
                                className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50 transition duration-150 flex items-center disabled:opacity-50"
                                title="Chỉnh sửa"
                                disabled={isLoading}
                            >
                                <EditIcon />
                            </button>
                            <button
<<<<<<< HEAD
                                onClick={() => handlePrepareDelete(item)}
=======
                                onClick={() => handlePrepareDelete(employee)}
>>>>>>> aea4fe9 (FE01)
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
