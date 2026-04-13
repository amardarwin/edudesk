"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus, Trash2, ArrowLeft, GripVertical, FileText, Headphones, Video, PlayCircle, Edit2, BookOpen } from "lucide-react";

export default function MaterialBuilderPage() {
  const { classId, subjectId, chapterId } = useParams();
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", type: "pdf", links: { english: "", hindi: "", punjabi: "" }, chapterId: chapterId, order: 0 });

  // Native HTML5 Drag and Drop References
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    if (chapterId) {
      fetchMaterials();
    }
  }, [chapterId]);

  const fetchMaterials = async () => {
    try {
      const res = await fetch(`/api/admin/materials?chapterId=${chapterId}`);
      const data = await res.json();
      setMaterials(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // For new items, attach them at the end dynamically
      const newOrder = materials.length > 0 ? Math.max(...materials.map(m => m.order)) + 1 : 0;
      const payload = { ...formData, order: newOrder };

      const res = await fetch("/api/admin/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setIsAdding(false);
        setFormData({ name: "", type: "pdf", links: { english: "", hindi: "", punjabi: "" }, chapterId: chapterId, order: 0 });
        fetchMaterials();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to create material");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this material?")) return;
    try {
      const res = await fetch(`/api/admin/materials/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchMaterials();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ================= Drag and Drop Logic =================

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragItem.current = index;
    // Add visual styling for dragging
    e.currentTarget.style.opacity = "0.5";
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = async (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = "1"; // Reset visual

    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      // Fast deep copy
      const copyListItems = [...materials];
      const draggedItemContent = copyListItems[dragItem.current];
      
      // Remove item from original index
      copyListItems.splice(dragItem.current, 1);
      // Insert item into new index
      copyListItems.splice(dragOverItem.current, 0, draggedItemContent);
      
      // Re-assign the new order bounds sequentially based on new array index
      const reorderedList = copyListItems.map((item, index) => ({
        ...item,
        order: index
      }));

      // Optimistically update UI
      setMaterials(reorderedList);

      // Build payload for bulk server action
      const payload = reorderedList.map(item => ({
        _id: item._id,
        order: item.order
      }));

      try {
        await fetch("/api/admin/materials/reorder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        // You could handle error states silently here if it fails to sync.
      } catch (err) {
        console.error("Failed to persist reordering", err);
      }
    }

    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  // ================= UI Helpers =================
  
  const getIconForType = (type: string) => {
    switch (type) {
      case "pdf": return <FileText className="w-5 h-5 text-red-500" />;
      case "audio": return <Headphones className="w-5 h-5 text-yellow-500" />;
      case "video": return <Video className="w-5 h-5 text-blue-500" />;
      case "quiz": return <PlayCircle className="w-5 h-5 text-purple-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) return <div className="text-zinc-500">Loading learning materials...</div>;

  return (
    <div>
      <Link href={`/dashboard/admin/classes/${classId}/subjects/${subjectId}`} className="flex items-center text-sm text-blue-600 hover:underline mb-4 w-max">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Chapters
      </Link>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Learning Material Builder</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Drag to reorder your curriculum path.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Material
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-8 p-5 bg-white dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="font-semibold mb-4 text-zinc-800 dark:text-zinc-200">Create New Module</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-4">
            <div>
               <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Module Name</label>
               <input
                 type="text"
                 required
                 placeholder="e.g. Chapter 1 PDF Notes"
                 value={formData.name}
                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                 className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg dark:bg-zinc-900/50 dark:border-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
               />
            </div>
            
            <div>
               <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Material Type</label>
               <select
                 required
                 value={formData.type}
                 onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                 className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg dark:bg-zinc-900/50 dark:border-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-shadow"
               >
                 <option value="pdf">PDF (Drive Link)</option>
                 <option value="audio">Audio (Drive Link)</option>
                 <option value="video">Video (YouTube Link)</option>
                 <option value="quiz">Interactive Quiz</option>
               </select>
            </div>

            <div className="md:col-span-2 lg:col-span-1 space-y-3">
               <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Target Links (Language Mediums)</label>
               <input
                 type="url"
                 disabled={formData.type === "quiz"}
                 placeholder={formData.type === "quiz" ? "Internal Quiz Engine..." : "English Link (https://...)"}
                 value={formData.links.english}
                 onChange={(e) => setFormData({ ...formData, links: { ...formData.links, english: e.target.value } })}
                 className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg dark:bg-zinc-900/50 dark:border-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
               />
               <input
                 type="url"
                 disabled={formData.type === "quiz"}
                 placeholder={formData.type === "quiz" ? "Internal Quiz Engine..." : "Hindi Link (https://...)"}
                 value={formData.links.hindi}
                 onChange={(e) => setFormData({ ...formData, links: { ...formData.links, hindi: e.target.value } })}
                 className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg dark:bg-zinc-900/50 dark:border-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
               />
               <input
                 type="url"
                 disabled={formData.type === "quiz"}
                 placeholder={formData.type === "quiz" ? "Internal Quiz Engine..." : "Punjabi Link (https://...)"}
                 value={formData.links.punjabi}
                 onChange={(e) => setFormData({ ...formData, links: { ...formData.links, punjabi: e.target.value } })}
                 className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg dark:bg-zinc-900/50 dark:border-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
               />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm transition-colors">Save Module</button>
            <button type="button" onClick={() => setIsAdding(false)} className="bg-white hover:bg-zinc-50 border border-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 px-5 py-2 rounded-lg text-sm transition-colors">Cancel</button>
          </div>
        </form>
      )}

      {materials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-900/30">
          <BookOpen className="w-12 h-12 text-zinc-400 mb-3" />
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">No learning materials installed yet.</p>
          <p className="text-sm text-zinc-400 mt-1">Click "Add Material" to inject your first resource into the curriculum.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {materials.map((mat, index) => (
            <div
              key={mat._id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              className="flex items-center p-4 bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 rounded-xl hover:border-blue-300 dark:hover:border-blue-900/50 transition-all cursor-grab active:cursor-grabbing hover:shadow-sm"
            >
              <div className="mr-4 text-zinc-400 hover:text-zinc-600">
                 <GripVertical className="w-5 h-5 focus:outline-none" />
              </div>
              
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 mr-4">
                 {getIconForType(mat.type)}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100 truncate">{mat.name}</h3>
                <div className="flex items-center mt-0.5 text-xs">
                  <span className="uppercase font-semibold tracking-wider text-zinc-400 mr-2">{mat.type}</span>
                  {mat.type === "quiz" ? (
                    <span className="text-purple-500 flex items-center"><Edit2 className="w-3 h-3 mr-1"/> Builder Ready</span>
                  ) : (
                    <div className="flex gap-2 isolate">
                      {mat.links?.english && (
                        <a href={mat.links.english} target="_blank" rel="noopener noreferrer" className="bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 px-2 py-0.5 rounded text-[10px] font-bold" onClick={(e) => e.stopPropagation()}>EN</a>
                      )}
                      {mat.links?.hindi && (
                        <a href={mat.links.hindi} target="_blank" rel="noopener noreferrer" className="bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/40 px-2 py-0.5 rounded text-[10px] font-bold" onClick={(e) => e.stopPropagation()}>HI</a>
                      )}
                      {mat.links?.punjabi && (
                        <a href={mat.links.punjabi} target="_blank" rel="noopener noreferrer" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40 px-2 py-0.5 rounded text-[10px] font-bold" onClick={(e) => e.stopPropagation()}>PA</a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(mat._id); }} 
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" 
                  title="Delete Resource"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
