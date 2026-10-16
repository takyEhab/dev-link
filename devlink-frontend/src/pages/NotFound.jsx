import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 px-6 relative overflow-hidden">
      {/* Subtle modern background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="text-center max-w-md relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-6 shadow-xl">
          <AlertCircle className="w-8 h-8 text-zinc-400" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
          404 Error
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-white mt-2 mb-3">
          Page Not Found
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back Home
        </Link>
      </div>
    </div>
  );
}
