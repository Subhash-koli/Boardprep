import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Eye, Download, Upload, CheckCircle, X } from "lucide-react";
import { papers as initialPapers, subjects } from "../data/mockData";
import type { Paper } from "../data/mockData";

export function AdminPapers() {
  const [paperList, setPaperList] = useState(initialPapers);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Paper | null>(null);
  const [formData, setFormData] = useState({
    title: "", standard: "10" as "10" | "12", subjectId: "", year: 2024, type: "board" as any, medium: "english" as any, marks: 80, durationMinutes: 180, status: "draft" as any,
  });
  const [saved, setSaved] = useState(false);

  const filtered = paperList.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) || p.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    const subject = subjects.find(s => s.id === formData.subjectId);
    if (!formData.title || !formData.subjectId) return;
    if (editing) {
      setPaperList(prev => prev.map(p => p.id === editing.id ? { ...p, ...formData, subject: subject?.name || p.subject } : p));
    } else {
      const newPaper: Paper = {
        id: `p${Date.now()}`,
        ...formData,
        subject: subject?.name || "",
        analytics: { views: 0, downloads: 0, bookmarks: 0 },
        createdAt: new Date().toISOString().split("T")[0],
      };
      setPaperList(prev => [newPaper, ...prev]);
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowForm(false); setEditing(null); }, 1500);
  };

  const handleDelete = (id: string) => {
    setPaperList(prev => prev.filter(p => p.id !== id));
  };

  const handleEdit = (paper: Paper) => {
    setEditing(paper);
    setFormData({
      title: paper.title, standard: paper.standard, subjectId: paper.subjectId,
      year: paper.year, type: paper.type, medium: paper.medium,
      marks: paper.marks, durationMinutes: paper.durationMinutes, status: paper.status,
    });
    setShowForm(true);
  };

  const typeColors: Record<string, string> = {
    board: "bg-blue-100 text-blue-700",
    model: "bg-purple-100 text-purple-700",
    practice: "bg-green-100 text-green-700",
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>Question Papers</h2>
          <p className="text-gray-500 text-sm">{paperList.length} papers total</p>
        </div>
        <button
          onClick={() => { setEditing(null); setFormData({ title: "", standard: "10", subjectId: "", year: 2024, type: "board", medium: "english", marks: 80, durationMinutes: 180, status: "draft" }); setShowForm(true); }}
          className="bg-[#1E3A8A] hover:bg-blue-900 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors"
        >
          <Plus size={16} /> Upload Paper
        </button>
      </div>

      {/* Upload Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>
              {editing ? "Edit Paper" : "Upload New Paper"}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-500 mb-1 block">Paper Title *</label>
              <input
                value={formData.title}
                onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g. SSC Mathematics March 2024 Board Paper"
                className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
              />
            </div>
            {[
              { label: "Standard", key: "standard", type: "select", opts: [{ value: "10", label: "10th (SSC)" }, { value: "12", label: "12th (HSC)" }] },
              { label: "Year", key: "year", type: "select", opts: [2024, 2023, 2022, 2021, 2020].map(y => ({ value: y, label: y.toString() })) },
              { label: "Paper Type", key: "type", type: "select", opts: [{ value: "board", label: "Board Exam" }, { value: "model", label: "Model Paper" }, { value: "practice", label: "Practice Set" }] },
              { label: "Medium", key: "medium", type: "select", opts: [{ value: "english", label: "English" }, { value: "semi-english", label: "Semi-English" }, { value: "marathi", label: "Marathi" }] },
              { label: "Marks", key: "marks", type: "number" },
              { label: "Duration (min)", key: "durationMinutes", type: "number" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-gray-500 mb-1 block">{f.label}</label>
                {f.type === "select" ? (
                  <select
                    value={(formData as any)[f.key]}
                    onChange={e => setFormData(p => ({ ...p, [f.key]: f.key === "year" ? Number(e.target.value) : e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
                  >
                    {f.opts?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : (
                  <input
                    type="number"
                    value={(formData as any)[f.key]}
                    onChange={e => setFormData(p => ({ ...p, [f.key]: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
                  />
                )}
              </div>
            ))}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Subject *</label>
              <select
                value={formData.subjectId}
                onChange={e => setFormData(p => ({ ...p, subjectId: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
              >
                <option value="">Select Subject</option>
                {subjects.filter(s => s.standard === formData.standard).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData(p => ({ ...p, status: e.target.value as any }))}
                className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {/* PDF Upload Mock */}
          <div className="mt-4 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#1E3A8A] transition-colors cursor-pointer">
            <Upload size={24} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">Click to upload PDF (max 20MB)</p>
            <p className="text-xs text-gray-400 mt-1">PDF format only</p>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-[#1E3A8A] hover:bg-blue-900 text-white py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              {saved ? <><CheckCircle size={15} /> Saved!</> : editing ? "Update Paper" : "Upload Paper"}
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search papers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1E3A8A] bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs text-gray-500" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Title</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 hidden sm:table-cell" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Subject</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 hidden md:table-cell" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Type</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 hidden md:table-cell" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Year</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Status</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Analytics</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(paper => (
                <tr key={paper.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{paper.title}</p>
                    <p className="text-xs text-gray-400 sm:hidden">{paper.subject}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-sm text-gray-600">{paper.subject}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${typeColors[paper.type]}`}>{paper.type}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-600">{paper.year}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${paper.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {paper.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <Eye size={11} /> {paper.analytics.views}
                      <Download size={11} className="ml-1" /> {paper.analytics.downloads}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleEdit(paper)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(paper.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm">No papers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
