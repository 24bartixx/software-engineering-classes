import type { ReactNode } from "react";

type PageCardProps = {
  children: ReactNode;
};

export default function PageCard({ children }: PageCardProps) {
  return (
    <div className="min-h-200 w-full flex items-center justify-center">
      <div className="w-full px-4 py-10">
        <div
          className={`mx-auto max-w-4xl rounded-2xl bg-white text-black p-6 shadow flex flex-col items-center py-10`}
        >
          {children}
        </div>
      </div>{" "}
      /{" "}
    </div>
  );
}
