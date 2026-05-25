import { useState } from "react";
import { Plus, Edit2, Trash2, X, CheckCircle, Megaphone, Pin } from "lucide-react";
import { announcements as initialAnnouncements } from "../data/mockData";
import type { Announcement } from "../data/mockData";

export function AdminAnnouncements() {
  const [list, setList] = useState(initialAnnouncements);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    title: "", content: "", type: "info" as "info" | "warning" | "success" | "urgent",
    targetAudience: "all" as "all" | "10" | "12", isPinned: false,
  });

  const typeConfig = {
    info: { label: "Info", bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
    warning: { label: "Warning", bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200" },
    success: { label: "Success", bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
    urgent: { label: "Urgent", bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
  };

  const audienceLabel = { all: "All Students", "10": "10th (SSC)", "12": "12th (HSC)" };

  const openCreate = () => {
    setEditing(null);
    setFormData({ title: "", content: "", type: "info", targetAudience: "all", isPinned: false });
    setShowForm(true);
  };

  const openEdit = (ann: Announcement) => {
    setEditing(ann);
    setFormData({ title: ann.title, content: ann.content, type: ann.type, targetAudience: ann.targetAudience, isPinned: ann.isPinned });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) return;
    if (editing) {
      setList(prev => prev.map(a => a.id === editing.id ? { ...a, ...formData } : a));
    } else {
      const newAnn: Announcement = {
        id: `ann_${Date.now()}`, ...formData,
        date: new Date().toISOString().split("T")[0],
      };
      setList(prev => [newAnn, ...prev]);
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowForm(false); setEditing(null); }, 1500);
  };

  const handleDelete = (id: string) => {
    setList(prev => prev.filter(a => a.id !== id));
  };

  const togglePin = (id: string) => {
    setList(prev => prev.map(a => a.id === id ? { ...a, isPinned: !a.isPinned } : a));
  };

  const sorted = [...list].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>Announcements</h2>
          <p className="text-gray-500 text-sm">{list.length} announcements · {list.filter(a => a.isPinned).length} pinned</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#1E3A8A] hover:bg-blue-900 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors"
        >
          <Plus size={16} /> New Announcement
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>
              {editing ? "Edit Announcement" : "New Announcement"}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400"><X size={18} /></button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Title *</label>
              <input
                value={formData.title}
                onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                placeholder="Announcement title"
                className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Content *</label>
              <textarea
                value={formData.content}
                onChange={e => setFormData(p => ({ ...p, content: e.target.value }))}
                placeholder="Write announcement content..."
                rows={4}
                className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Type</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData(p => ({ ...p, type: e.target.value as any }))}
                  className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Target Audience</label>
                <select
                  value={formData.targetAudience}
                  onChange={e => setFormData(p => ({ ...p, targetAudience: e.target.value as any }))}
                  className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
                >
                  <option value="all">All Students</option>
                  <option value="10">10th (SSC) Only</option>
                  <option value="12">12th (HSC) Only</option>
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPinned}
                onChange={e => setFormData(p => ({ ...p, isPinned: e.target.checked }))}
                className="w-4 h-4 accent-[#1E3A8A]"
              />
              <span className="text-sm text-gray-600">Pin this announcement (shows at top for all students)</span>
            </label>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={handleSave}
              className="flex-1 bg-[#1E3A8A] hover:bg-blue-900 text-white py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              {saved ? <><CheckCircle size={15} /> Saved!</> : editing ? "Update" : "Publish Announcement"}
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {sorted.map(ann => {
          const cfg = typeConfig[ann.type];
          return (
            <div key={ann.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${ann.isPinned ? "border-[#F97316]/30" : "border-gray-100"}`}>
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                  <Megaphone size={16} className={cfg.text} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="text-gray-800 text-sm" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>{ann.title}</h4>
                    {ann.isPinned && (
                      <span className="flex items-center gap-1 text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                        <Pin size={10} /> Pinned
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${cfg.bg} ${cfg.text}`}>{ann.type}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{audienceLabel[ann.targetAudience]}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{ann.content}</p>
                  <p className="text-xs text-gray-400">{ann.date}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => togglePin(ann.id)}
                    className={`p-1.5 rounded-lg transition-colors ${ann.isPinned ? "text-orange-500 bg-orange-50" : "text-gray-400 hover:bg-gray-50"}`}
                    title={ann.isPinned ? "Unpin" : "Pin"}
                  >
                    <Pin size={14} />
                  </button>
                  <button onClick={() => openEdit(ann)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(ann.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {list.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <Megaphone size={32} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400 text-sm">No announcements yet. Create your first one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
