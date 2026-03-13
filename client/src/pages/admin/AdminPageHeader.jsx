function AdminPageHeader({ title, subtitle }) {
  return (
    <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}

export default AdminPageHeader;
