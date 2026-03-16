"use client";
import React, { useState, useEffect } from 'react';
import {Plus, Pencil, Trash2, Save, X, AlertTriangle, Loader2, RotateCw} from 'lucide-react';


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://gunicorn-lavergnebackendwsgi-production.up.railway.app';
const API_URL = `${BASE_URL}/dlnc_case/dlnc_case/`;

interface DlncCase {
  id: string | number;
  name: string;
  description: string;
}

interface ApiDlncCase {
    id: string | number;
    dlnc_case_name: string;
    dlnc_case_description: string;
}

const mapApiToFrontend = (apiItem: ApiDlncCase): DlncCase => ({
    id: apiItem.id,
    name: apiItem.dlnc_case_name || '',
    description: apiItem.dlnc_case_description || '',
});

const mapFrontendToApi = (feData: Omit<DlncCase, 'id'>): Omit<ApiDlncCase, 'id'> => ({
    dlnc_case_name: feData.name,
    dlnc_case_description: feData.description,
});


export default function App() {
  const [items, setItems] = useState<DlncCase[]>([]);
  const [formData, setFormData] = useState<Omit<DlncCase, 'id'>>({ name: '', description: '' });
  const [editingItem, setEditingItem] = useState<DlncCase | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<DlncCase | null>(null);

  const fetchItems = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Lỗi tải dữ liệu: ${response.status}`);
      const apiData: ApiDlncCase[] = await response.json();
      setItems(apiData.map(mapApiToFrontend));
    } catch (err) {
      setError("Không thể kết nối với máy chủ. Vui lòng kiểm tra lại kết nối mạng.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      setError('Vui lòng điền đầy đủ Tên (Mã) và Mô tả.');
      return false;
    }
    const isDuplicate = items.some(
      item => item.name.trim().toLowerCase() === formData.name.trim().toLowerCase() && item.id !== editingItem?.id
    );
    if (isDuplicate) {
        setError(`Mã "${formData.name.trim()}" đã tồn tại trong hệ thống.`);
        return false;
    }
    return true;
  };

  const handleServerError = async (response: Response) => {
      try {
          const errorData = await response.json();
          if (errorData.dlnc_case_name) return `Lỗi: ${errorData.dlnc_case_name[0]}`;
          return `Lỗi hệ thống (${response.status})`;
      } catch {
          return "Đã xảy ra lỗi không xác định từ máy chủ.";
      }
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isLoading) return;
    setIsLoading(true);
    setError('');

    try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mapFrontendToApi(formData)),
        });
        if (!response.ok) {
            setError(await handleServerError(response));
            return;
        }
        const newItem = await response.json();
        setItems(prev => [...prev, mapApiToFrontend(newItem)]);
        setFormData({ name: '', description: '' });
    } catch {
        setError("Lỗi kết nối mạng: Không thể gửi yêu cầu.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !validateForm() || isLoading) return;
    setIsLoading(true);
    setError('');

    try {
        const response = await fetch(`${API_URL}${editingItem.id}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mapFrontendToApi(formData)),
        });
        if (!response.ok) {
            setError(await handleServerError(response));
            return;
        }
        const updated = await response.json();
        setItems(prev => prev.map(item => item.id === editingItem.id ? mapApiToFrontend(updated) : item));
        handleCancelEdit();
    } catch {
        setError("Lỗi kết nối mạng khi cập nhật.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleStartEdit = (item: DlncCase) => {
    setEditingItem(item);
    setFormData({ name: item.name, description: item.description });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setFormData({ name: '', description: '' });
    setError('');
  };

  const confirmDelete = async () => {
      if (!itemToDelete || isLoading) return;
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}${itemToDelete.id}/`, { method: 'DELETE' });
        if (!response.ok) throw new Error();
        setItems(prev => prev.filter(item => item.id !== itemToDelete.id));
        if (editingItem?.id === itemToDelete.id) handleCancelEdit();
      } catch {
        setError("Không thể xóa dữ liệu.");
      } finally {
        setItemToDelete(null);
        setIsLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-900">
      {itemToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center space-x-3 mb-4 text-red-600">
              <div className="bg-red-100 p-2 rounded-full"><AlertTriangle size={28}/></div>
              <h3 className="text-xl font-bold">Xác nhận xóa</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa trường hợp: <span className="font-bold text-gray-900">"{itemToDelete.name}"</span>?
            </p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setItemToDelete(null)} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg" disabled={isLoading}>Hủy</button>
              <button onClick={confirmDelete} className="px-5 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 flex items-center" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 animate-spin" size={18} />} Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Quản lý DLNC Case</h1>
        <p className="text-gray-500 text-sm mt-1">Hệ thống danh mục các trường hợp không phù hợp</p>
      </header>

      {/* Form Section */}
      <section className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 mb-8">
        <div className="flex items-center mb-5 text-lg font-bold">
          {editingItem ? (
            <div className="flex items-center text-indigo-600">
              <Pencil className="mr-2" size={20} />
              <span>Chỉnh sửa: {editingItem.name}</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-800">
              <Plus className="mr-2" size={20} />
              <span>Thêm mới trường hợp</span>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-lg mb-6 flex items-center">
            <AlertTriangle className="mr-3 shrink-0" size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Mã/Tên Case</label>
              <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="VD: LOI-BAO-BI" className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" required disabled={isLoading} />
            </div>
            <div className="md:col-span-2 flex flex-col space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Mô tả chi tiết</label>
              <input name="description" type="text" value={formData.description} onChange={handleChange} placeholder="Nhập mô tả chi tiết..." className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" required disabled={isLoading} />
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <button type="submit" className={`flex items-center px-8 py-2.5 rounded-xl font-bold text-white shadow-md transition-all active:scale-95 ${editingItem ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'}`} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 animate-spin" size={18} /> : (editingItem ? <Save className="mr-2" size={18} /> : <Plus className="mr-2" size={18} />)}
              {editingItem ? 'Cập nhật' : 'Lưu dữ liệu'}
            </button>
            {editingItem && (
              <button type="button" onClick={handleCancelEdit} className="flex items-center px-6 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition" disabled={isLoading}>
                <X className="mr-2" size={18} /> Hủy bỏ
              </button>
            )}
          </div>
        </form>
      </section>

      {/* List Section */}
      <section className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
        <div className="p-5 flex justify-between items-center bg-gray-50/50 border-b border-gray-100">
            <h2 className="font-black text-gray-800 uppercase tracking-tight flex items-center">
              Danh sách <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">{items.length}</span>
            </h2>
             <button onClick={fetchItems} disabled={isLoading} className="flex items-center text-xs font-bold px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">
                <RotateCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} size={14} /> Làm mới
            </button>
        </div>

        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-4 text-left font-black text-gray-400 uppercase tracking-widest">Mã Case</th>
                        <th className="px-6 py-4 text-left font-black text-gray-400 uppercase tracking-widest">Nội dung</th>
                        <th className="px-6 py-4 text-right font-black text-gray-400 uppercase tracking-widest">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {items.length === 0 && !isLoading ? (
                        <tr>
                            <td colSpan={3} className="px-6 py-12 text-center text-gray-400 italic">Chưa có dữ liệu khả dụng</td>
                        </tr>
                    ) : (
                        items.map((item, index) => (
                            <tr key={`${item.id}-${index}`} className={`group transition-colors ${editingItem?.id === item.id ? 'bg-indigo-50/50' : 'hover:bg-gray-50/80'}`}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                    {item.name}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600 font-medium">{item.description}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-1">
                                        <button onClick={() => handleStartEdit(item)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition" disabled={isLoading}><Pencil size={18} /></button>
                                        <button onClick={() => setItemToDelete(item)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" disabled={isLoading}><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </section>
    </div>
  );
}
