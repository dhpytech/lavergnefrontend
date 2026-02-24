"use client";
import React, { useState, useEffect } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://gunicorn-lavergnebackendwsgi-production.up.railway.app';
const API_URL = `${BASE_URL}/employee/employee/`;

interface Employee {
  employeeId: string;
  name: string;
  position: string;
}

interface ApiEmployee {
    employee_id: string;
    employee_name: string;
    employee_position: string;
}

const mapApiToFrontend = (api: ApiEmployee): Employee => ({
    employeeId: api.employee_id,
    name: api.employee_name,
    position: api.employee_position,
});

const mapFrontendToApi = (fe: Employee): ApiEmployee => ({
    employee_id: fe.employeeId,
    employee_name: fe.name,
    employee_position: fe.position,
});

// =======================================================
// [ICONS] - Clean Minimalist Style
// =======================================================
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M5 12h14M12 5v14" /></svg>;
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;
const LoaderIcon = () => <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

export default function EmployeeManager() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState<Employee>({ employeeId: '', name: '', position: '' });
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      const apiData = await response.json();
      setEmployees(apiData.map(mapApiToFrontend));
    } catch (err) { setError("Network error: Could not load data."); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleStartEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({ ...employee });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingEmployee(null);
    setFormData({ employeeId: '', name: '', position: '' });
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mapFrontendToApi(formData)),
      });
      if (response.ok) {
        const newItem = await response.json();
        setEmployees([...employees, mapApiToFrontend(newItem)]);
        handleCancelEdit();
      } else {
        setError("Execution error: Employee ID already exists.");
      }
    } catch (err) { setError("Server error."); }
    finally { setIsLoading(false); }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}${editingEmployee.employeeId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mapFrontendToApi(formData)),
      });
      if (response.ok) {
        const updated = await response.json();
        setEmployees(employees.map(item => item.employeeId === editingEmployee.employeeId ? mapApiToFrontend(updated) : item));
        handleCancelEdit();
      }
    } catch (err) { setError("Update failed."); }
    finally { setIsLoading(false); }
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}${employeeToDelete.employeeId}/`, { method: 'DELETE' });
      if (response.ok || response.status === 204) {
        setEmployees(employees.filter(item => item.employeeId !== employeeToDelete.employeeId));
        setEmployeeToDelete(null);
      }
    } catch (err) { setError("Delete failed."); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans text-[#1E293B]">

      {/* Delete Confirmation Modal */}
      {employeeToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full border border-slate-100">
            <h3 className="text-xl font-bold mb-2 text-slate-800">Confirm Deletion</h3>
            <p className="text-slate-500 mb-8">Are you sure you want to remove <span className="text-red-600 font-semibold">{employeeToDelete.name}</span>? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setEmployeeToDelete(null)} className="flex-1 py-2.5 rounded-xl font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg shadow-red-200">Delete</button>
            </div>
          </div>
        </div>
      )}

      <header className="mb-10">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Employee Directory</h1>
        <p className="text-slate-500">Manage your staff information and organizational roles efficiently.</p>
      </header>

      {/* Main Form Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mb-10 transition-all">
        <div className="flex items-center justify-between mb-8">
            <h2 className={`text-lg font-bold flex items-center ${editingEmployee ? 'text-indigo-600' : 'text-slate-800'}`}>
                {editingEmployee ? <SaveIcon /> : <PlusIcon />}
                {editingEmployee ? `Editing: ${editingEmployee.name}` : "Register New Employee"}
            </h2>
            {editingEmployee && (
                <button onClick={handleCancelEdit} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-all">
                    <XIcon />
                </button>
            )}
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 flex items-center">⚠️ {error}</div>}

        <form onSubmit={editingEmployee ? handleUpdateItem : handleAddItem} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">Employee ID (PK)</label>
              <input name="employeeId" value={formData.employeeId} onChange={handleChange} disabled={!!editingEmployee} placeholder="e.g. EMP-101" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400 font-mono" required />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
              <input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. John Doe" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" required />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">Designation</label>
              <input name="position" value={formData.position} onChange={handleChange} placeholder="e.g. Software Engineer" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" required />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={isLoading} className={`min-w-[160px] py-3.5 px-6 rounded-2xl font-bold flex items-center justify-center transition-all shadow-xl shadow-indigo-100 ${editingEmployee ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-900 hover:bg-slate-800'} text-white active:scale-95`}>
              {isLoading ? <LoaderIcon /> : editingEmployee ? <SaveIcon /> : <PlusIcon />}
              {isLoading ? "Processing..." : editingEmployee ? "Save Changes" : "Create Record"}
            </button>
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-700 uppercase text-xs tracking-[2px]">Current Staff List</h3>
            <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-[11px] font-black">{employees.length} TOTAL</span>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full">
            <thead>
                <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-5 text-left">Internal ID</th>
                <th className="px-8 py-5 text-left">Full Name</th>
                <th className="px-8 py-5 text-left">Position</th>
                <th className="px-8 py-5 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {employees.length === 0 ? (
                    <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-medium">No employee records found.</td></tr>
                ) : (
                    employees.map((emp) => (
                    <tr key={emp.employeeId} className="group hover:bg-indigo-50/30 transition-all">
                        <td className="px-8 py-5 font-mono text-sm text-indigo-600 font-bold">{emp.employeeId}</td>
                        <td className="px-8 py-5 text-slate-700 font-bold">{emp.name}</td>
                        <td className="px-8 py-5">
                            <span className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold ring-1 ring-indigo-100 uppercase">{emp.position}</span>
                        </td>
                        <td className="px-8 py-5 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => handleStartEdit(emp)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all" title="Edit Profile"><EditIcon /></button>
                                <button onClick={() => setEmployeeToDelete(emp)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete Profile"><TrashIcon /></button>
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
