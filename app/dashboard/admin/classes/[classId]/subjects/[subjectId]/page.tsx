"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus, Edit2, Trash2, BookOpen, ArrowLeft, ArrowRight } from "lucide-react";

export default function ChaptersPage() {
  const { classId, subjectId } = useParams();
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", classId: classId, subjectId: subjectId, order: 0 });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ name: "", description: "", order: 0 });

  useEffect(() => {
    if (subjectId) {
      fetchChapters();
    }
  }, [subjectId]);

  const fetchChapters = async () => {
    try {
      const res = await fetch(`/api/admin/chapters?subjectId=${subjectId}`);
      const data = await res.json();
      setChapters(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/chapters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsAdding(false);
        setFormData({ ...formData, name: "", description: "", order: formData.order + 1 });
        fetchChapters();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to create chapter");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this chapter?")) return;
    try {
      const res = await fetch(`/api/admin/chapters/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchChapters();
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
      const res = await fetch(`/api/admin/chapters/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });
      if (res.ok) {
        setEditingId(null);
        fetchChapters();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to update");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-zinc-500">Loading chapters...</div>;

  return (
    <div>
      <Link href={`/dashboard/admin/classes/${classId}`} className="flex items-center text-sm text-blue-600 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Subjects
      </Link>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Manage Chapters</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Add or manage chapters inside this subject.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Chapter
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
          <h3 className="font-medium mb-3 dark:text-zinc-200">Create New Chapter</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              required
              placeholder="Chapter Name (e.g. Chemical Reactions)"
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
            <input
              type="number"
              placeholder="Order (e.g. 1)"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
              className="p-2 border rounded-lg dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Save</button>
            <button type="button" onClick={() => setIsAdding(false)} className="bg-transparent border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 px-4 py-2 rounded-lg text-sm">Cancel</button>
          </div>
        </form>
      )}

      {chapters.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">No chapters found for this subject.</div>
      ) : (
        <div className="space-y-3">
          {chapters.map((chap) => (
            <div key={chap._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-blue-300 dark:hover:border-blue-900/50 transition-colors">
              {editingId === chap._id ? (
                <form 
                  onSubmit={(e) => handleEditSubmit(e, chap._id)} 
                  className="flex flex-col sm:flex-row w-full gap-3 sm:items-center"
                >
                  <input
                    type="number"
                    required
                    value={editFormData.order}
                    onChange={(e) => setEditFormData({ ...editFormData, order: Number(e.target.value) })}
                    className="p-2 border rounded-lg dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-20"
                  />
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="p-2 border rounded-lg dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto flex-1"
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
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-bold text-sm">
                      {chap.order}
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{chap.name}</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">{chap.description || "No description"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 sm:mt-0">
                    <button 
                      onClick={() => { setEditingId(chap._id); setEditFormData({ name: chap.name, description: chap.description || "", order: chap.order }); }} 
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg" 
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(chap._id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/dashboard/admin/classes/${classId}/subjects/${subjectId}/chapters/${chap._id}`}
                      className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 px-3 py-2 rounded-lg text-sm font-medium ml-2 transition-colors"
                      title="Build Curriculum"
                    >
                      <BookOpen className="w-4 h-4" /> Learning Material <ArrowRight className="w-4 h-4" />
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
