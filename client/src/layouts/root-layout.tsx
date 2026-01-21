import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

export default function RootLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-100">
      <AnimatePresence mode="wait">
        <Outlet key={location.pathname} />
      </AnimatePresence>
    </div>
  );
}
