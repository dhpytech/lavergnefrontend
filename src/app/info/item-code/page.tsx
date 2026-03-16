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
  RotateCw
} from 'lucide-react';

// =======================================================
// [CONFIG] Cấu hình API và Model
// =======================================================

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://gunicorn-lavergnebackendwsgi-production.up.railway.app';
const API_URL = `${BASE_URL}/itemcode/items-code/`;

type ItemCategory = 'tp' | 'semi-tp';
const DEFAULT_CATEGORY: ItemCategory = 'tp';

interface ItemCode {
  id: string | number;
  code: string;
  description: string;
  category: ItemCategory;
}

interface ApiItemCode {
    id: string | number;
    item_name: string;
    item_description: string;
    item_type: ItemCategory | string;
}

const mapApiToFrontend = (apiItem: ApiItemCode): ItemCode => {
    let category: ItemCategory = DEFAULT_CATEGORY;
    const itemType = apiItem.item_type.toLowerCase();
    if (itemType === 'tp' || itemType === 'semi-tp') {
        category = itemType as ItemCategory;
    }
    return {
        id: apiItem.id,
        code: apiItem.item_name,
        description: apiItem.item_description,
        category: category,
    };
};

const mapFrontendToApi = (feData: Omit<ItemCode, 'id'>): Omit<ApiItemCode, 'id'> => ({
    item_name: feData.code,
    item_description: feData.description,
    item_type: feData.category,
});

export default function ItemCodeManager() {
  const [items, setItems] = useState<ItemCode[]>([]);
  const [formData, setFormData] = useState<Omit<ItemCode, 'id'>>({
    code: '',
    description: '',
    category: DEFAULT_CATEGORY,
  });
  const [editingItem, setEditingItem] = useState<ItemCode | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<ItemCode | null>(null);

  const fetchItems = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Lỗi tải dữ liệu: ${response.status}`);
      const apiData: ApiItemCode[] = await response.json();
      setItems(apiData.map(mapApiToFrontend));
    } catch (err) {
      setError("Không thể kết nối hoặc tải dữ liệu từ API backend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value as ItemCategory });
    setError('');
  };

  const validateForm = () => {
    if (!formData.code.trim() || !formData.description.trim()) {
      setError('Mã sản phẩm và Mô tả không được để trống.');
      return false;
    }
    return true;
  };

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
      if (response.ok) {
        const newItem = await response.json();
        setItems(prev => [...prev, mapApiToFrontend(newItem)]);
        setFormData({ code: '', description: '', category: DEFAULT_CATEGORY });
      } else {
        setError("Lỗi: Không thể thêm mới. Vui lòng kiểm tra mã trùng lặp.");
      }
    } catch (err) { setError("Lỗi kết nối mạng."); }
    finally { setIsLoading(false); }
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
      if (response.ok) {
        const updated = await response.json();
        setItems(prev => prev.map(item => item.id === editingItem.id ? mapApiToFrontend(updated) : item));
        handleCancelEdit();
      }
    } catch (err) { setError("Lỗi cập nhật dữ liệu."); }
    finally { setIsLoading(false); }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}${itemToDelete.id}/`, { method: 'DELETE' });
      if (response.ok || response.status === 204) {
        setItems(prev => prev.filter(item => item.id !== itemToDelete.id));
        setItemToDelete(null);
      }
    } catch (err) { setError("Lỗi hệ thống khi xóa."); }
    finally { setIsLoading(false); }
  };

  const handleStartEdit = (item: ItemCode) => {
    setEditingItem(item);
    setFormData({ code: item.code, description: item.description, category: item.category });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setFormData({ code: '', description: '', category: DEFAULT_CATEGORY });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">

      {/* Modal xác nhận xóa */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <AlertTriangle size={28} />
              <h3 className="text-xl font-bold text-gray-900">Xác Nhận Xóa</h3>
            </div>
            <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa mã sản phẩm <span className="font-bold text-red-600">{itemToDelete.code}</span>?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setItemToDelete(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">Hủy</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex items-center gap-2">
                {isLoading && <Loader2 size={16} className="animate-spin" />} Đồng Ý Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-black text-gray-900 mb-8 border-b pb-4">Quản Lý Mã Sản Phẩm</h1>

      {/* Form Section */}
      <div className="bg-white shadow-xl rounded-2xl p-6 mb-8 border border-blue-50">
        <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${editingItem ? 'text-indigo-600' : 'text-gray-800'}`}>
          {editingItem ? <Pencil size={24} /> : <Plus size={24} />}
          {editingItem ? `Chỉnh sửa mã: ${editingItem.code}` : "Thêm Mã Sản Phẩm Mới"}
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-2 italic">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Mã Sản Phẩm</label>
              <input name="code" value={formData.code} onChange={handleChange} placeholder="Ví dụ: S014-47" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" required disabled={isLoading} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Mô Tả Chi Tiết</label>
              <input name="description" value={formData.description} onChange={handleChange} placeholder="Mô tả chi tiết sản phẩm" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" required disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Phân Loại</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none transition" disabled={isLoading}>
                <option value="tp">TP</option>
                <option value="semi-tp">SEMI-TP</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isLoading} className={`flex items-center gap-2 px-8 py-2.5 rounded-lg font-bold text-white shadow-lg transition-all ${editingItem ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} disabled:opacity-50`}>
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : editingItem ? <Save size={20} /> : <Plus size={20} />}
              {editingItem ? 'Lưu Thay Đổi' : 'Thêm Mới'}
            </button>
            {editingItem && (
              <button type="button" onClick={handleCancelEdit} className="flex items-center gap-2 px-6 py-2.5 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition" disabled={isLoading}>
                <X size={20} /> Hủy Chỉnh Sửa
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List Table Section */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <div className="p-5 flex justify-between items-center bg-blue-50/50 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              Danh Sách Mã <span className="bg-blue-200 text-blue-800 text-xs px-2.5 py-1 rounded-full font-black">{items.length}</span>
            </h2>
             <button onClick={fetchItems} disabled={isLoading} className="flex items-center gap-2 text-sm px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm disabled:opacity-50">
                <RotateCw size={16} className={isLoading ? "animate-spin" : ""} />
                Làm Mới
            </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Mã Sản Phẩm</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Mô Tả</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Loại</th>
                <th className="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {items.length === 0 && !isLoading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic font-medium">Chưa có mã sản phẩm nào trong hệ thống.</td></tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className={`hover:bg-blue-50/40 transition-colors ${editingItem?.id === item.id ? 'bg-yellow-50' : ''}`}>
                    <td className="px-6 py-4 font-mono text-sm font-bold text-blue-700">{item.code}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.description}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black tracking-tighter ${
                        item.category === 'tp' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-orange-100 text-orange-700 border border-orange-200'
                      }`}>
                        {item.category.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => handleStartEdit(item)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition" title="Chỉnh sửa"><Pencil size={18} /></button>
                        <button onClick={() => handlePrepareDelete(item)} className="p-2 text-red-600 hover:bg-red-50 rounded-full transition" title="Xóa"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
