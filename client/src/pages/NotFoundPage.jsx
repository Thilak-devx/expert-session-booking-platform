import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white/85 px-8 py-16 text-center shadow-soft">
      <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-600">404</p>
      <h2 className="mt-3 text-4xl font-semibold text-slate-900">Page not found</h2>
      <p className="mx-auto mt-4 max-w-xl text-slate-600">The page you requested could not be found.</p>
      <Link to="/" className="mt-8 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white">
        Return home
      </Link>
    </section>
  );
}

export default NotFoundPage;
