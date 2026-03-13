function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/20">
      <h2 className="text-lg font-semibold text-slate-200">{title}</h2>
      <p className="mt-3 text-4xl font-bold text-cyan-400">{value}</p>
    </div>
  );
}

export default StatCard;
