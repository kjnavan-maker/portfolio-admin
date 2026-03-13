function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-10 h-10 border-4 border-slate-700 border-t-cyan-400 rounded-full animate-spin"></div>
      <p className="mt-3 text-slate-400">{text}</p>
    </div>
  );
}

export default LoadingSpinner;