function ErrorState({ title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-[28px] border border-rose-200 bg-white/85 p-8 shadow-soft">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-lg text-rose-600">
          !
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          {actionLabel && onAction ? (
            <button
              type="button"
              onClick={onAction}
              className="mt-5 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white"
            >
              {actionLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ErrorState;
