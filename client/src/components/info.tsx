import { useNavigate } from "react-router-dom";
import PageCard from "./page-card";

interface InfoProps {
  title: string;
  icon?: string;
}

export default function Info({ title, icon = "😊" }: InfoProps) {
  const navigate = useNavigate();

  return (
    <PageCard>
      <h1 className="text-2xl font-semibold text-center">{title}</h1>

      <div className="mt-5 text-4xl" aria-hidden>
        {icon}
      </div>

      <button
        type="button"
        onClick={() => navigate("/")}
        className="mt-6 w-full max-w-xl h-11 rounded-xl bg-black text-white hover:opacity-90 active:scale-[0.99] transition"
      >
        Continue
      </button>
    </PageCard>
  );
}
