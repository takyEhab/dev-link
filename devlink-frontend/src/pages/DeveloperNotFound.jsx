import { Link } from "react-router-dom";
import { UserX, ArrowLeft } from "lucide-react";

export default function DeveloperNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 px-6 relative overflow-hidden">
      {/* Subtle modern background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="text-center max-w-md relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-6 shadow-xl">
          <UserX className="w-8 h-8 text-zinc-400" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
          Profile Unavailable
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-white mt-2 mb-3">
          Developer Not Found
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          We couldn't find a developer profile matching this account. They may not have created a public profile yet.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/developers"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-sm transition-all"
          >
            Browse Developers
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 text-sm font-medium transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}
