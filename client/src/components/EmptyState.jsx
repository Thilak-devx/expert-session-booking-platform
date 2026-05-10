function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/70 px-8 py-16 text-center shadow-soft transition duration-300">
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-slate-600">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
