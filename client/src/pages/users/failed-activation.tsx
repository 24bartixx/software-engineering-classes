import { useNavigate } from "react-router-dom";
import PageCard from "../../components/page-card";

export default function FailedActivation() {
  const navigate = useNavigate();

  return (
    <PageCard>
      <h1 className="text-2xl font-semibold text-center">
        Unfortunately, we couldn&apos;t activate your account
      </h1>

      <div className="mt-5 text-4xl" aria-hidden>
        😢
      </div>

      <button
        type="button"
        onClick={() => navigate("/")}
        className="mt-6 w-full max-w-xl h-11 rounded-xl bg-black text-white hover:opacity-90 active:scale-[0.99] transition"
      >
        Exit
      </button>
    </PageCard>
  );
}
