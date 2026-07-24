﻿import { useState } from "react";
import { Plus, Edit2, Trash2, X, CheckCircle, Megaphone, Pin, Target } from "lucide-react";
import { GoalIcon } from "../shared/GoalIcons";
import { announcements as initialAnnouncements } from "../data/mockData";
import type { Announcement, AnnouncementPriority, GoalCategory } from "../data/mockData";
import { GOAL_METADATA } from "../data/mockData";

const PRIORITY_CONFIG: Record<AnnouncementPriority, { label: string; bg: string; text: string; border: string }> = {
  normal:    { label: "Normal",    bg: "bg-blue-50",   text: "text-blue-700",  border: "border-blue-200" },
  important: { label: "Important", bg: "bg-amber-50",  text: "text-amber-700", border: "border-amber-200" },
  urgent:    { label: "Urgent",    bg: "bg-red-50",    text: "text-red-700",   border: "border-red-200" },
};

const ALL_GOALS: (GoalCategory | "all")[] = [
  "all", "board-8", "board-9", "board-10", "board-11", "board-12",
  "neet", "jee-mains", "jee-advanced", "mht-cet-pcb", "mht-cet-pcm",
];

function goalLabel(g: GoalCategory | "all") {
  if (g === "all") return "All Students";
  return GOAL_METADATA[g]?.label ?? g;
}

export function AdminAnnouncements() {
  const [list, setList] = useState<Announcement[]>(initialAnnouncements);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [saved, setSaved] = useState(false);
  const [filterPriority, setFilterPriority] = useState<AnnouncementPriority | "all">("all");

  const [formData, setFormData] = useState<{
    title: string;
    body: string;
    priority: AnnouncementPriority;
    targetGoals: (GoalCategory | "all")[];
    expiresAt: string;
    isActive: boolean;
  }>({
    title: "", body: "", priority: "normal",
    targetGoals: ["all"], expiresAt: "", isActive: true,
  });

  const openCreate = () => {
    setEditing(null);
    setFormData({ title: "", body: "", priority: "normal", targetGoals: ["all"], expiresAt: "", isActive: true });
    setShowForm(true);
  };

  const openEdit = (ann: Announcement) => {
    setEditing(ann);
    setFormData({ title: ann.title, body: ann.body, priority: ann.priority, targetGoals: ann.targetGoals, expiresAt: ann.expiresAt, isActive: ann.isActive });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.body.trim()) return;
    if (editing) {
      setList(prev => prev.map(a => a.id === editing.id ? { ...a, ...formData } : a));
    } else {
      const newAnn: Announcement = {
        id: `ann_${Date.now()}`,
        title: formData.title,
        body: formData.body,
        priority: formData.priority,
        targetGoals: formData.targetGoals,
        expiresAt: formData.expiresAt || "2099-12-31",
        isActive: formData.isActive,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setList(prev => [newAnn, ...prev]);
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowForm(false); setEditing(null); }, 1500);
  };

  const handleDelete = (id: string) => setList(prev => prev.filter(a => a.id !== id));
  const toggleActive = (id: string) => setList(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));

  const toggleGoal = (g: GoalCategory | "all") => {
    setFormData(prev => {
      if (g === "all") return { ...prev, targetGoals: ["all"] };
      const without = prev.targetGoals.filter(x => x !== "all" && x !== g);
      const hasIt = prev.targetGoals.includes(g);
      const next = hasIt ? without : [...without, g];
      return { ...prev, targetGoals: next.length === 0 ? ["all"] : next };
    });
  };

  const filtered = list.filter(a => filterPriority === "all" || a.priority === filterPriority);
  const sorted = [...filtered].sort((a, b) => {
    const po = { urgent: 3, important: 2, normal: 1 };
    return (po[b.priority] ?? 0) - (po[a.priority] ?? 0);
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#1E3A8A] font-['Poppins']">Announcements</h2>
          <p className="text-gray-500 text-sm">{list.length} total · {list.filter(a => a.isActive).length} active</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#1E3A8A] hover:bg-blue-900 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors"
        >
          <Plus size={16} /> New Announcement
        </button>
      </div>

      {/* Priority Filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(["all", "urgent", "important", "normal"] as const).map(p => (
          <button
            key={p}
            onClick={() => setFilterPriority(p)}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer select-none
              ${filterPriority === p
                ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white border-transparent shadow-[0_4px_14px_rgba(30,58,138,0.4)] scale-105"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] hover:shadow-md hover:scale-105 active:scale-95"
              }`}
          >
            {p === "all" ? "All" : PRIORITY_CONFIG[p as AnnouncementPriority].label}
          </button>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-t-3xl sm:rounded-2xl shadow-xl w-full sm:max-w-lg max-h-[92vh] sm:max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-semibold text-[#1E3A8A] font-['Poppins']">
                {editing ? "Edit Announcement" : "New Announcement"}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Title *</label>
                <input
                  value={formData.title}
                  onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                  placeholder="Announcement title"
                  className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
                />
              </div>

              {/* Body */}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Message *</label>
                <textarea
                  value={formData.body}
                  onChange={e => setFormData(p => ({ ...p, body: e.target.value }))}
                  placeholder="Write full announcement message..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50 resize-none"
                />
              </div>

              {/* Priority + Expires */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData(p => ({ ...p, priority: e.target.value as AnnouncementPriority }))}
                    className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
                  >
                    <option value="normal">Normal</option>
                    <option value="important">Important</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Expires On</label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={e => setFormData(p => ({ ...p, expiresAt: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
                  />
                </div>
              </div>

              {/* Target Goals */}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-2 block flex items-center gap-1">
                  <Target size={11} /> Target Exam Goals
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_GOALS.map(g => {
                    const selected = formData.targetGoals.includes(g);
                    const meta = g !== "all" ? GOAL_METADATA[g] : null;
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => toggleGoal(g)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all flex items-center gap-1 ${selected ? "bg-[#1E3A8A] text-white border-[#1E3A8A]" : "bg-white text-gray-500 border-gray-200"}`}
                      >
                        {meta && <GoalIcon category={g as import("../data/mockData").GoalCategory} size={11} />}
                        {goalLabel(g)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={e => setFormData(p => ({ ...p, isActive: e.target.checked }))}
                  className="w-4 h-4 accent-[#1E3A8A]"
                />
                <span className="text-sm text-gray-600">Mark as active (visible to students)</span>
              </label>
            </div>

            <div className="flex gap-3 p-5 pt-0">
              <button
                onClick={handleSave}
                className="flex-1 bg-[#1E3A8A] hover:bg-blue-900 text-white py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 font-semibold"
              >
                {saved ? <><CheckCircle size={15} /> Saved!</> : editing ? "Update" : "Publish"}
              </button>
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {sorted.map(ann => {
          const cfg = PRIORITY_CONFIG[ann.priority];
          const isUrgent = ann.priority === "urgent";
          return (
            <div
              key={ann.id}
              className={`rounded-2xl p-5 transition-opacity ${!ann.isActive ? "opacity-60" : ""} ${isUrgent ? "border-red-200" : "border-gray-100"}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Megaphone size={16} className={cfg.text} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="text-gray-800 text-sm font-semibold font-['Poppins']">{ann.title}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        {cfg.label}
                      </span>
                      {!ann.isActive && (
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Inactive</span>
                      )}
                    </div>

                    {/* Target goals */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {ann.targetGoals.slice(0, 4).map(g => {
                        const meta = g !== "all" ? GOAL_METADATA[g] : null;
                        return (
                          <span key={g} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                            {meta?.icon} {goalLabel(g)}
                          </span>
                        );
                      })}
                      {ann.targetGoals.length > 4 && (
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                          +{ann.targetGoals.length - 4} more
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-2">{ann.body}</p>
                    <div className="flex items-center gap-3 text-[10px] text-gray-400">
                      <span>Created: {ann.createdAt}</span>
                      <span>·</span>
                      <span>Expires: {ann.expiresAt}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 self-end sm:self-start sm:mt-0.5 pl-12 sm:pl-0 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(ann.id)}
                    className={`p-1.5 rounded-lg transition-colors text-xs ${ann.isActive ? "text-green-600 bg-green-50 hover:bg-green-100" : "text-gray-400 hover:bg-gray-50"}`}
                    title={ann.isActive ? "Deactivate" : "Activate"}
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

        {sorted.length === 0 && (
          <div className="rounded-2xl p-12 text-center" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 2px 12px rgba(30,58,138,0.06)" }}>
            <Megaphone size={36} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400 text-sm">No announcements found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
