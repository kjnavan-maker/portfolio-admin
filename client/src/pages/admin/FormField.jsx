function FormField({
  as = "input",
  label,
  error,
  className = "",
  ...props
}) {
  const Comp = as;
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <Comp
        {...props}
        className={`w-full rounded-xl border ${error ? "border-red-500" : "border-slate-700"} bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400 ${className}`}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </label>
  );
}

export default FormField;
