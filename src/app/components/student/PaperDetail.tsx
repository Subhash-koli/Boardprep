import { ArrowLeft, Download, Bookmark, BookmarkCheck, Eye, Clock, Award, Calendar, FileText, ZoomIn, ZoomOut, Zap } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { papers, PAPER_TYPE_CONFIG } from "../data/mockData";

export function PaperDetail() {
  const { selectedPaperId, setView, toggleBookmark, isBookmarked } = useApp();
  const [viewing, setViewing] = useState(false);
  const [zoom, setZoom] = useState(100);

  const paper = papers.find(p => p.id === selectedPaperId);
  if (!paper) return (
    <div className="text-center py-20 text-gray-400">
      <p>Paper not found.</p>
      <button onClick={() => setView("papers")} className="mt-3 text-[#1E3A8A]">Back to Papers</button>
    </div>
  );

  const bookmarked = isBookmarked("paper", paper.id);
  const typeCfg = PAPER_TYPE_CONFIG[paper.type] ?? PAPER_TYPE_CONFIG["practice"];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back */}
      <button onClick={() => setView("papers")} className="flex items-center gap-2 text-gray-500 hover:text-[#1E3A8A] mb-4 transition-colors text-sm">
        <ArrowLeft size={16} /> Back to Papers
      </button>

      <div className="rounded-2xl p-6 mb-5" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 2px 12px rgba(30,58,138,0.06)" }}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-3">
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium border"
                style={{ background: typeCfg.bg, color: typeCfg.text, borderColor: typeCfg.border }}
              >
                {typeCfg.label}
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{paper.year}</span>
              {paper.medium && <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full capitalize">{paper.medium}</span>}
              {paper.standard && <span className="text-xs bg-blue-50 text-[#1E3A8A] px-2.5 py-1 rounded-full">Class {paper.standard}</span>}
              {paper.session && <span className="text-xs bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full capitalize">{paper.session}</span>}
              {paper.shift && <span className="text-xs bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full capitalize">{paper.shift.replace("-", " ")}</span>}
              {paper.paperNumber && <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full capitalize">{paper.paperNumber.replace("-", " ")}</span>}
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                <Zap size={12} className="inline mr-0.5" /> Offline Sync Ready
              </span>
            </div>

            <h1 className="text-xl mb-2 leading-snug" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>{paper.title}</h1>
            <p className="text-gray-500 text-sm">{paper.subject}</p>
          </div>
          <button
            onClick={() => toggleBookmark("paper", paper.id)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm transition-all ${bookmarked ? "border-[#F97316] bg-orange-50 text-[#F97316]" : "border-gray-200 text-gray-500 hover:border-[#F97316] hover:text-[#F97316]"}`}
          >
            {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            {bookmarked ? "Saved" : "Save"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-gray-100">
          {[
            { icon: Award, label: "Total Marks", value: `${paper.marks} marks` },
            { icon: Clock, label: "Duration", value: `${paper.durationMinutes} min` },
            { icon: Calendar, label: "Year", value: paper.year.toString() },
            { icon: Eye, label: "Total Views", value: paper.analytics.views.toLocaleString() },
          ].map(s => (
            <div key={s.label} className="text-center p-3 bg-gray-50 rounded-xl">
              <s.icon size={18} className="mx-auto text-gray-400 mb-1" />
              <div className="font-semibold text-gray-800 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={() => setViewing(!viewing)}
            className="flex-1 bg-[#1E3A8A] hover:bg-blue-900 text-white py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors min-h-[44px]"
          >
            <Eye size={16} /> {viewing ? "Close Viewer" : "View PDF Online"}
          </button>
          <button
            onClick={() => {
              const content = `PARIKSHACRACK QUESTION PAPER\nTitle: ${paper.title}\nSubject: ${paper.subject}\nYear: ${paper.year}\nMarks: ${paper.marks}\nDuration: ${paper.durationMinutes} mins\n\n--- GENERAL INSTRUCTIONS ---\n1. All questions are compulsory.\n2. Write question numbers clearly.\n3. Calculators are not allowed.\n\nDownloaded from ParikshaCrack v2.0 Platform (https://parikshacrack.in)`;
              const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `${paper.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_parikshacrack.txt`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex-1 bg-[#F97316] hover:bg-orange-600 text-white py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors min-h-[44px]"
          >
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>


      {/* PDF Viewer */}
      {viewing && (
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 2px 12px rgba(30,58,138,0.06)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>PDF Viewer</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(z => Math.max(50, z - 10))}
                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <ZoomOut size={14} className="text-gray-500" />
              </button>
              <span className="text-sm text-gray-500 w-12 text-center">{zoom}%</span>
              <button
                onClick={() => setZoom(z => Math.min(200, z + 10))}
                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <ZoomIn size={14} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Mock PDF Viewer */}
          <div className="bg-gray-100 rounded-xl p-4 min-h-96 flex flex-col items-center justify-center" style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}>
            <div className="bg-white shadow-md rounded-lg w-full max-w-2xl p-8">
              <div className="text-center mb-8 border-b border-gray-200 pb-6">
                <div className="text-sm text-gray-500 mb-1">Maharashtra State Board of Secondary & Higher Secondary Education</div>
                <h2 className="text-xl mb-1" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>{paper.title}</h2>
                <div className="flex justify-center gap-6 text-sm text-gray-500 mt-3">
                  <span>Time: {paper.durationMinutes} minutes</span>
                  <span>Total Marks: {paper.marks}</span>
                </div>
              </div>
              <div className="space-y-4 text-sm text-gray-700">
                <div className="font-semibold text-gray-800">General Instructions:</div>
                <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                  <li>All questions are compulsory unless stated otherwise.</li>
                  <li>Write the question number correctly.</li>
                  <li>Draw neat diagrams wherever necessary.</li>
                  <li>Calculators are not allowed.</li>
                  <li>Use of blue/black ink pen is compulsory.</li>
                </ol>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="font-semibold text-gray-800 mb-3">Section A — Multiple Choice Questions (20 marks)</div>
                  <div className="space-y-3 text-gray-600">
                    <div>Q1. Choose the correct alternative: (All questions carry 1 mark each)</div>
                    <div className="pl-4">
                      <div>i. Which of the following is a rational number?</div>
                      <div className="pl-3 text-gray-500 mt-1 space-y-0.5">
                        <div>a) √2 &nbsp;&nbsp; b) √3 &nbsp;&nbsp; c) √4 &nbsp;&nbsp; d) √5</div>
                      </div>
                    </div>
                    <div className="pl-4">
                      <div>ii. The formula for sum of first n terms of an AP with first term a and common difference d is:</div>
                      <div className="pl-3 text-gray-500 mt-1">a) Sn = n/2[2a+(n-1)d] &nbsp;&nbsp; b) Sn = n[a+(n-1)d] &nbsp;&nbsp; c) Sn = n/2[a+l] &nbsp;&nbsp; d) Both a and c</div>
                    </div>
                  </div>
                </div>
                <div className="text-center text-gray-400 text-xs mt-6 border-t pt-4">
                  *** This is a preview. Download the full PDF for complete question paper. ***
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Related Papers */}
      <div className="rounded-2xl p-5 mt-5">
        <h3 className="mb-3 text-sm" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>Related Papers</h3>
        <div className="space-y-2">
          {papers.filter(p => (p.goalCategory === paper.goalCategory) && p.id !== paper.id && p.status === "published").slice(0, 3).map(rp => {
            const rpCfg = PAPER_TYPE_CONFIG[rp.type] ?? PAPER_TYPE_CONFIG["practice"];
            return (
              <button
                key={rp.id}
                onClick={() => { setSelectedPaperId(rp.id); }}
                className="w-full text-left flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <FileText size={15} className="text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">{rp.title}</p>
                  <p className="text-xs text-gray-400">{rp.year} · {rp.marks} marks</p>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium border flex-shrink-0"
                  style={{ background: rpCfg.bg, color: rpCfg.text, borderColor: rpCfg.border }}
                >
                  {rpCfg.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
