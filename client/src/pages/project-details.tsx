/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/static-components */
import { useParams, useNavigate } from "react-router-dom";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const project = {
    name: "A life to paint",
    startDate: "21.03.2026",
    endDate: "01.12.2026",
    managers: "Adam Tukan, Adam Dymko",
    status: "Aktywny",
    type: "Aplikacja webowa",
    roles: "Front-end developer, Back-end developer, DevOps, UX Designer",
    employees: "Marek Gołdap, Jacek Jaworek, Gerwazy Śliwka",
    description: "„A Life to Paint” to projekt rozwoju aplikacji webowej opartej na sztucznej inteligencji..."
  };

  const DetailField = ({ label, value, isTextArea = false }: any) => (
    <div className="grid grid-cols-3 gap-4 items-start mb-4 text-black"> 
      <label className="font-medium pt-2">{label}</label>
      {isTextArea ? (
        <textarea 
          readOnly 
          value={value} 
          className="col-span-2 border border-gray-300 rounded-xl p-3 h-32 bg-white resize-none text-black focus:outline-none" 
        />
      ) : (
        <input 
          readOnly 
          value={value} 
          className="col-span-2 border border-gray-300 rounded-full px-4 py-2 bg-white text-black focus:outline-none" 
        />
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-8 bg-slate-50 rounded-2xl shadow-sm">
      <h1 className="text-2xl font-bold text-center mb-10 text-black">Project "{project.name}"</h1>
      
      <div className="space-y-2">
        <DetailField label="Data rozpoczęcia" value={project.startDate} />
        <DetailField label="Planowana data zakończenia" value={project.endDate} />
        <DetailField label="Projekt Manager" value={project.managers} />
        <DetailField label="Status projektu" value={project.status} />
        <DetailField label="Typ projektu" value={project.type} />
        <DetailField label="Role" value={project.roles} />
        <DetailField label="Pracownicy" value={project.employees} />
        <DetailField label="Opis" value={project.description} isTextArea />
      </div>

      <div className="flex justify-center mt-10">
        <button 
          onClick={() => navigate(-1)}
          className="px-16 py-2 border border-black rounded-lg text-black hover:bg-black hover:text-white transition font-medium bg-white"
        >
          Back
        </button>
      </div>
    </div>
  );
}