"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, ArrowRight } from "lucide-react";

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", order: 0 });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/admin/classes");
      const data = await res.json();
      setClasses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsAdding(false);
        setFormData({ name: "", description: "", order: 0 });
        fetchClasses();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to create");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;
    try {
      const res = await fetch(`/api/admin/classes/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchClasses();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/classes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });
      if (res.ok) {
        setEditingId(null);
        fetchClasses();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to update");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-zinc-500">Loading classes...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Manage Classes</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Add or manage educational classes.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Class
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
          <h3 className="font-medium mb-3 dark:text-zinc-200">Create New Class</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              required
              placeholder="Class Name (e.g. Class 10)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="p-2 border rounded-lg dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="p-2 border rounded-lg dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Save</button>
            <button type="button" onClick={() => setIsAdding(false)} className="bg-transparent border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 px-4 py-2 rounded-lg text-sm">Cancel</button>
          </div>
        </form>
      )}

      {classes.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">No classes found. Please add one.</div>
      ) : (
        <div className="space-y-3">
          {classes.map((cls) => (
            <div key={cls._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-blue-300 dark:hover:border-blue-900/50 transition-colors">
              {editingId === cls._id ? (
                <form 
                  onSubmit={(e) => handleEditSubmit(e, cls._id)} 
                  className="flex flex-col sm:flex-row w-full gap-3 sm:items-center"
                >
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="p-2 border rounded-lg dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                  />
                  <input
                    type="text"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="p-2 border rounded-lg dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto flex-1"
                  />
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm">Save</button>
                    <button type="button" onClick={() => setEditingId(null)} className="bg-transparent border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 px-3 py-2 rounded-lg text-sm">Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{cls.name}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{cls.description || "No description"}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-4 sm:mt-0">
                    <button 
                      onClick={() => { setEditingId(cls._id); setEditFormData({ name: cls.name, description: cls.description || "" }); }} 
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg" 
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(cls._id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/dashboard/admin/classes/${cls._id}`}
                      className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-200 px-3 py-2 rounded-lg text-sm font-medium ml-2"
                    >
                      Manage Subjects <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
