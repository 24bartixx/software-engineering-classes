import { useState } from "react";
import { Link } from "react-router-dom";
import type { Project } from "../types/project.tsx";

const MOCK_PROJECTS: Project[] = [
  { id: "1", name: "A life to paint", startDate: "2026-03-21", plannedEndDate: "2026-12-01", projectManagers: ["Adam Tukan"], status: "Aktywny", type: "Aplikacja webowa", roles: ["Dev"], employees: ["Marek G."], description: "Opis projektu..." },
  { id: "2", name: "Pure vessel", startDate: "2025-01-10", plannedEndDate: "2025-06-01", projectManagers: ["Jan Kowalski"], status: "Zakończony", type: "Mobile", roles: ["Designer"], employees: ["Ania K."], description: "Inny opis..." },
  { id: "3", name: "A life to dream", startDate: "2026-05-01", plannedEndDate: "2027-01-01", projectManagers: ["Ewa N."], status: "Planowany", type: "Desktop", roles: ["QA"], employees: ["Piotr R."], description: "Projekt marzeń..." },
];

export default function Projects() {
  const [view, setView] = useState<"list" | "sort" | "filter">("list");
  const [sortOrder, setSortOrder] = useState("Alfabetycznie");
  const [dateFrom, setDateFrom] = useState("2020-12-12");
  const [dateTo, setDateTo] = useState("2025-12-12");

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-50 min-h-screen rounded-xl shadow-sm text-black">
      <div className="relative flex justify-center items-center mb-8">
        <h1 className="text-2xl font-bold">Moje projekty</h1>
      </div>

      <div className="flex justify-center gap-4 mb-10">
        <button 
          onClick={() => setView(view === "sort" ? "list" : "sort")}
          className="px-10 py-2 border border-black rounded-lg text-black hover:bg-black hover:text-white transition cursor-pointer font-medium"
        >
          Sortuj projekty
        </button>
        <button 
          onClick={() => setView(view === "filter" ? "list" : "filter")}
          className="px-10 py-2 border border-black rounded-lg text-black hover:bg-black hover:text-white transition cursor-pointer font-medium"
        >
          Filtruj projekty
        </button>
      </div>

      {view !== "list" && (
        <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200 text-center shadow-sm">
          <h2 className="font-bold mb-4 text-xl text-black">Wyznacz kryterium</h2>
          {view === "sort" ? (
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 p-2 rounded-md w-64 text-black bg-white"
            >
              <option>Alfabetycznie</option>
              <option>Data rozpoczęcia</option>
            </select>
          ) : (
            <div className="flex justify-center gap-4 items-center text-black font-medium">
              <span>Od :</span>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="border border-gray-300 p-2 rounded text-black bg-white" />
              <span>Do :</span>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="border border-gray-300 p-2 rounded text-black bg-white" />
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        {MOCK_PROJECTS.map((project) => (
          <div key={project.id} className="flex justify-between items-center bg-transparent py-4 border-b border-gray-200">
            <span className="text-lg font-medium text-black">{project.name}</span>
            <Link 
              to={`/projects/${project.id}`}
              className="bg-stone-400 text-white px-8 py-2 rounded-lg hover:bg-stone-500 transition shadow-sm"
            >
              Szczegóły
            </Link>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-12 mb-6">
        <Link 
          to="/" 
          className="px-16 py-2 border-2 border-black rounded-lg text-black hover:bg-black hover:text-white transition font-medium text-center"
        >
          Wróć
        </Link>
      </div>
      
    </div>
  );
}