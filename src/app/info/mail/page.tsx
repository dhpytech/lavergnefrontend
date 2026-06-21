"use client";
import React, { useState, useEffect } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://gunicorn-lavergnebackendwsgi-production.up.railway.app';
const API_URL = `${BASE_URL}/mail/mail/`;

type MailStatus = 'active' | 'inactive';
const STATUS_CHOICES = {
    active: 'Active',
    inactive: 'Inactive',
};
const DEFAULT_STATUS: MailStatus = 'active';

interface Mail {
    id: string | number;
    address: string;
    person: string;
    status: MailStatus;
}

interface ApiMail {
    id: string | number;
    mail_address: string;
    mail_person: string;
    mail_status: MailStatus | string;
}

const mapApiToFrontend = (apiMail: ApiMail): Mail => {
    let status: MailStatus = DEFAULT_STATUS;
    const mailStatus = apiMail.mail_status.toLowerCase();

    // Ánh xạ an toàn các giá trị hợp lệ từ API
    if (mailStatus === 'active' || mailStatus === 'inactive') {
        status = mailStatus as MailStatus;
    }

    return {
        id: apiMail.id,
        address: apiMail.mail_address,
        person: apiMail.mail_person,
        status: status,
    };
};

const mapFrontendToApi = (feData: Omit<Mail, 'id'>): Omit<ApiMail, 'id'> => ({
    mail_address: feData.address,
    mail_person: feData.person,
    mail_status: feData.status,
});

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


export default function MailAddressManager() {

  const [mails, setMails] = useState<Mail[]>([]);
  const [formData, setFormData] = useState<Omit<Mail, 'id'>>({
    address: '',
    person: '',
    status: DEFAULT_STATUS,
  });

  const [editingItem, setEditingItem] = useState<Mail | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<Mail | null>(null);

  const fetchItems = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Lỗi tải dữ liệu: ${response.status}`);
      }
      const apiData: ApiMail[] = await response.json();
      const frontendData: Mail[] = apiData.map(mapApiToFrontend);

      setMails(frontendData);
      console.log("Dữ liệu Mail đã tải và ánh xạ thành công:", frontendData);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Không thể kết nối hoặc tải dữ liệu từ API backend. Vui lòng kiểm tra server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Xử lý thay đổi input trong form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value as MailStatus }); // Đảm bảo type casting
    setError('');
  };

  const validateForm = () => {
    if (!formData.address.trim() || !formData.person.trim()) {
      setError('Địa chỉ Email và Tên người/Bộ phận không được để trống.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.address.trim())) {
        setError('Địa chỉ Email không đúng định dạng.');
        return false;
    }

    const isDuplicate = mails.some(
      mail => mail.address.trim().toLowerCase() === formData.address.trim().toLowerCase() && mail.id !== editingItem?.id
    );
    if (isDuplicate) {
        setError(`Địa chỉ Email "${formData.address.trim()}" đã tồn tại cục bộ. Vui lòng kiểm tra lại.`);
        return false;
    }
    return true;
  };

  const handleServerError = async (response: Response) => {
      let errorData: any;
      try {
          errorData = await response.json();
      } catch {
          return `Lỗi Server (${response.status}): ${response.statusText}`;
      }

      console.error("Lỗi chi tiết từ Server:", errorData);

      let message = `Lỗi Server (${response.status}): `;

      if (errorData.mail_address && errorData.mail_address[0]) {
          message = `Lỗi Validation: ${errorData.mail_address[0]} (Email đã bị trùng hoặc không hợp lệ).`;
      } else if (errorData.mail_person && errorData.mail_person[0]) {
           message = `Lỗi Validation (Người/Bộ Phận): ${errorData.mail_person[0]}.`;
      } else if (typeof errorData === 'object' && !Array.isArray(errorData)) {
          message += Object.entries(errorData).map(([key, value]) =>
              `${key}: ${Array.isArray(value) ? value.join(', ') : value}`
          ).join('; ');
      } else {
          message += response.statusText;
      }
      return message;
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
        const itemDataToSend = mapFrontendToApi({
            ...formData,
            address: formData.address.trim(),
            person: formData.person.trim()
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

        const newItemApi: ApiMail = await response.json();
        const newItemFrontend: Mail = mapApiToFrontend(newItemApi);

        setMails(prevItems => [...prevItems, newItemFrontend]);
        setFormData({ address: '', person: '', status: DEFAULT_STATUS });
        setError('');

    } catch (err) {
        console.error("Lỗi khi thêm mới:", err);
        setError("Lỗi kết nối mạng: Không thể gửi yêu cầu đến Server.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !validateForm() || isLoading) return;

    setIsLoading(true);
    setError('');
    const itemUrl = `${API_URL}${editingItem.id}/`;

    try {
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
        const updatedItemFrontend: Mail = mapApiToFrontend(updatedItemApi);


        setMails(prevItems => prevItems.map(item =>
          item.id === editingItem.id ? updatedItemFrontend : item
        ));

        handleCancelEdit();

    } catch (err) {
        console.error("Lỗi khi cập nhật:", err);
        setError("Lỗi kết nối mạng: Không thể gửi yêu cầu cập nhật.");
    } finally {
        setIsLoading(false);
    }
  };

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

  const handleCancelEdit = () => {
    setEditingItem(null);
    setFormData({ address: '', person: '', status: DEFAULT_STATUS });
    setError('');
  };

  const handlePrepareDelete = (item: Mail) => {
    setItemToDelete(item);
  };

  const confirmDelete = async () => {
      if (!itemToDelete || isLoading) return;

      setIsLoading(true);
      setError('');
      const itemUrl = `${API_URL}${itemToDelete.id}/`;

      try {
        const response = await fetch(itemUrl, {
            method: 'DELETE',
        });
        if (response.status !== 204 && response.status !== 200) {
            throw new Error(`Lỗi Server: ${response.status}`);
        }
        setMails(prevItems => prevItems.filter(item => item.id !== itemToDelete.id)); // Đã đổi setItems -> setMails

        if (editingItem && editingItem.id === itemToDelete.id) {
            handleCancelEdit();
        }
      } catch (err) {
        console.error("Lỗi khi xóa:", err);
        setError("Lỗi hệ thống: Không thể xóa địa chỉ email.");
      } finally {
        setItemToDelete(null);
        setIsLoading(false);
      }
  };

  const cancelDelete = () => {
      setItemToDelete(null);
  };


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

          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Địa Chỉ Email</label>
            <input
              id="address"
              name="address"
              type="email"
              value={formData.address}
              onChange={handleChange}
              placeholder="Example: hotmail@company.com"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="person" className="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
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

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  disabled={isLoading}
              >
                  {Object.entries(STATUS_CHOICES).map(([statusKey, statusValue]) => (
                    <option key={statusKey} value={statusKey}>{statusValue}</option>
                ))}
              </select>
          </div>
        </div>

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

  const ConfirmationModal = itemToDelete && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all duration-300">
          <div className="flex items-center space-x-3 mb-4">
              <div className="text-red-500">
                  <AlertTriangle/>
              </div>
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

      {FormComponent}

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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
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
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                            {item.person}
                        </td>
                        <td className="px-6 py-4 text-sm">

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
