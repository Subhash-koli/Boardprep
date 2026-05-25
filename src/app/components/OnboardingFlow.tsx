import { useState } from "react";
import { BookOpen, ChevronRight, CheckCircle } from "lucide-react";
import { useApp } from "./context/AppContext";
import type { Standard, Medium } from "./data/mockData";
import { subjects } from "./data/mockData";

const steps = ["Your Standard", "Medium of Instruction", "Preferred Subjects"];

export function OnboardingFlow() {
  const { setView, user, setUser } = useApp();
  const [step, setStep] = useState(0);
  const [standard, setStandard] = useState<Standard>("10");
  const [medium, setMedium] = useState<Medium>("english");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const availableSubjects = subjects.filter(s => s.standard === standard);

  const toggleSubject = (name: string) => {
    setSelectedSubjects(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  };

  const handleNext = () => {
    if (step < 2) { setStep(s => s + 1); return; }
    if (user) {
      setUser({ ...user, standard, medium, subjects: selectedSubjects });
    }
    setView("dashboard");
  };

  const progress = ((step + 1) / 3) * 100;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <nav className="bg-[#1E3A8A] px-4 py-4 flex items-center gap-2">
        <div className="w-7 h-7 bg-[#F97316] rounded-lg flex items-center justify-center">
          <BookOpen size={15} className="text-white" />
        </div>
        <span className="text-white font-semibold" style={{ fontFamily: "Poppins, sans-serif" }}>MahaBoard Prep</span>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Step {step + 1} of 3</span>
              <span>{steps[step]}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#1E3A8A] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {step === 0 && (
            <>
              <h2 className="text-xl mb-1" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>
                Which standard are you in?
              </h2>
              <p className="text-gray-500 text-sm mb-6">This helps us show you relevant question papers and quizzes.</p>
              <div className="grid grid-cols-2 gap-4">
                {(["10", "12"] as Standard[]).map(std => (
                  <button
                    key={std}
                    onClick={() => setStandard(std)}
                    className={`border-2 rounded-2xl p-6 text-center transition-all ${standard === std ? "border-[#1E3A8A] bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <div className="text-4xl mb-2">{std === "10" ? "📘" : "📗"}</div>
                    <div className="font-semibold" style={{ fontFamily: "Poppins, sans-serif", color: standard === std ? "#1E3A8A" : "#374151" }}>
                      {std}th Standard
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{std === "10" ? "SSC" : "HSC"}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="text-xl mb-1" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>
                Medium of instruction?
              </h2>
              <p className="text-gray-500 text-sm mb-6">We'll filter papers by your preferred medium.</p>
              <div className="flex flex-col gap-3">
                {([
                  { value: "english", label: "English Medium", desc: "All subjects taught in English" },
                  { value: "semi-english", label: "Semi-English", desc: "Science/Math in English, Languages in Marathi" },
                  { value: "marathi", label: "Marathi Medium", desc: "All subjects taught in Marathi" },
                ] as { value: Medium; label: string; desc: string }[]).map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setMedium(opt.value)}
                    className={`border-2 rounded-xl p-4 text-left transition-all flex items-center gap-3 ${medium === opt.value ? "border-[#1E3A8A] bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${medium === opt.value ? "border-[#1E3A8A]" : "border-gray-300"}`}>
                      {medium === opt.value && <div className="w-2.5 h-2.5 bg-[#1E3A8A] rounded-full" />}
                    </div>
                    <div>
                      <div className="font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif", color: medium === opt.value ? "#1E3A8A" : "#374151" }}>{opt.label}</div>
                      <div className="text-xs text-gray-400">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl mb-1" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>
                Select your subjects
              </h2>
              <p className="text-gray-500 text-sm mb-6">Choose subjects to get personalized content. You can change this later.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {availableSubjects.map(sub => {
                  const selected = selectedSubjects.includes(sub.name);
                  return (
                    <button
                      key={sub.id}
                      onClick={() => toggleSubject(sub.name)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm transition-all ${selected ? "border-[#1E3A8A] bg-blue-50 text-[#1E3A8A]" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                    >
                      <span>{sub.icon}</span>
                      <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: selected ? 600 : 400 }}>{sub.name}</span>
                      {selected && <CheckCircle size={12} className="text-[#1E3A8A]" />}
                    </button>
                  );
                })}
              </div>
              {selectedSubjects.length === 0 && (
                <p className="text-xs text-gray-400">Select at least one subject to continue</p>
              )}
            </>
          )}

          <button
            onClick={handleNext}
            disabled={step === 2 && selectedSubjects.length === 0}
            className="w-full mt-6 bg-[#1E3A8A] hover:bg-blue-900 text-white py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-semibold"
          >
            {step < 2 ? "Continue" : "Go to Dashboard"}
            <ChevronRight size={18} />
          </button>

          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="w-full mt-3 text-gray-400 hover:text-gray-600 text-sm">
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
