const Loading = () => {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-zinc-800"></div>
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-xs font-medium tracking-wider text-zinc-500 uppercase">
        Loading DevLink...
      </p>
    </div>
  );
};

export default Loading;
