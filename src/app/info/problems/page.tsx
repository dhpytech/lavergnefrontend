"use client";
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  AlertTriangle,
  Loader2,
  RefreshCw
} from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://gunicorn-lavergnebackendwsgi-production.up.railway.app';
const API_URL = `${BASE_URL}/problem/problems/`;

interface Problem {
  id: string | number;
  code: string;
  name: string;
}

interface ApiProblem {
    id: string | number;
    problem_code: string;
    problem_name: string;
}

const mapApiToFrontend = (apiItem: ApiProblem): Problem => ({
    id: apiItem.id,
    code: apiItem.problem_code,
    name: apiItem.problem_name,
});

const mapFrontendToApi = (feData: Omit<Problem, 'id'>): Omit<ApiProblem, 'id'> => ({
    problem_code: feData.code,
    problem_name: feData.name,
});

export default function ProblemManager() {
  const [items, setItems] = useState<Problem[]>([]);
  const [formData, setFormData] = useState<Omit<Problem, 'id'>>({
    code: '',
    name: '',
  });
  const [editingItem, setEditingItem] = useState<Problem | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<Problem | null>(null);

  const fetchItems = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const apiData: ApiProblem[] = await response.json();
      setItems(apiData.map(mapApiToFrontend));
    } catch (err) {
      setError("Không thể kết nối hoặc tải dữ liệu từ API backend.");
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
    if (!formData.code.trim() || !formData.name.trim()) {
      setError('Mã Lỗi và Tên Lỗi không được để trống.');
      return false;
    }
    const isCodeDuplicate = items.some(
      item => item.code.trim() === formData.code.trim() && item.id !== editingItem?.id
    );
    if (isCodeDuplicate) {
        setError(`Mã Lỗi "${formData.code.trim()}" đã tồn tại.`);
        return false;
    }
    return true;
  };

  const handleServerError = async (response: Response) => {
      let errorData: any;
      try {
          errorData = await response.json();
      } catch {
          return `Lỗi Server (${response.status})`;
      }
      let message = `Lỗi Server (${response.status}): `;
      if (errorData.problem_code) message = `Mã Lỗi: ${errorData.problem_code[0]}`;
      else if (errorData.problem_name) message = `Tên Lỗi: ${errorData.problem_name[0]}`;
      return message;
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isLoading) return;
    setIsLoading(true);
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
        setFormData({ code: '', name: '' });
    } catch {
        setError("Lỗi kết nối mạng.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !validateForm() || isLoading) return;
    setIsLoading(true);
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
        setError("Lỗi kết nối.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleStartEdit = (item: Problem) => {
    setEditingItem(item);
    setFormData({ code: item.code, name: item.name });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setFormData({ code: '', name: '' });
    setError('');
  };

  const confirmDelete = async () => {
      if (!itemToDelete) return;
      setIsLoading(true);
      try {
        await fetch(`${API_URL}${itemToDelete.id}/`, { method: 'DELETE' });
        setItems(prev => prev.filter(item => item.id !== itemToDelete.id));
        if (editingItem?.id === itemToDelete.id) handleCancelEdit();
      } catch {
        setError("Không thể xóa.");
      } finally {
        setItemToDelete(null);
        setIsLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {itemToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 text-gray-900">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="text-red-500" />
              <h3 className="text-xl font-bold">Xác Nhận Xóa</h3>
            </div>
            <p className="mb-6">Xóa mã lỗi: <span className="font-bold text-red-600">{itemToDelete.code}</span>?</p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setItemToDelete(null)} className="px-4 py-2 bg-gray-200 rounded-lg">Hủy</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center">
                {isLoading && <Loader2 className="animate-spin mr-2" size={18} />} Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">Quản Lý Mã Lỗi</h1>

      <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          {editingItem ? <><Pencil size={24} /> Chỉnh sửa</> : <><Plus size={24} /> Thêm mới</>}
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
            <AlertTriangle size={18} /> {error}
          </div>
        )}

        <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Mã Lỗi"
              className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              disabled={isLoading}
            />
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tên Lỗi"
              className="md:col-span-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : (editingItem ? <Save size={20} /> : <Plus size={20} />)}
              {editingItem ? 'Lưu' : 'Thêm'}
            </button>
            {editingItem && (
              <button onClick={handleCancelEdit} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg">
                <X size={20} /> Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="p-4 flex justify-between items-center bg-blue-50">
            <h2 className="font-bold text-gray-800">Danh Sách ({items.length})</h2>
             <button onClick={fetchItems} disabled={isLoading} className="flex items-center gap-1 text-sm px-3 py-1 bg-white border rounded-lg">
                <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Làm mới
            </button>
        </div>

        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 text-gray-500">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs uppercase">Mã Lỗi</th>
                        <th className="px-6 py-3 text-left text-xs uppercase">Tên Lỗi</th>
                        <th className="px-6 py-3 text-right text-xs uppercase">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-900">
                    {items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-mono font-bold text-blue-700">{item.code}</td>
                            <td className="px-6 py-4">{item.name}</td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                <button onClick={() => handleStartEdit(item)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"><Pencil size={18} /></button>
                                <button onClick={() => setItemToDelete(item)} className="p-2 text-red-600 hover:bg-red-50 rounded-full"><Trash2 size={18} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
