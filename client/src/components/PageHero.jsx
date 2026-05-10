function PageHero({ badge, title, description, aside }) {
  return (
    <div className="overflow-hidden rounded-[36px] border border-slate-200 bg-white/75 shadow-soft">
      <div className="grid gap-8 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(251,113,133,0.12),transparent_32%)] px-6 py-8 md:px-8 md:py-10 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          {badge ? (
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-sky-600">{badge}</p>
          ) : null}
          <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{description}</p>
        </div>
        {aside ? <div className="rounded-[28px] bg-slate-950 p-6 text-white">{aside}</div> : null}
      </div>
    </div>
  );
}

export default PageHero;
