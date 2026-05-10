import { NavLink, Outlet } from "react-router-dom";

import useSocketConnection from "../hooks/useSocketConnection";

const navItems = [
  { to: "/", label: "Experts" },
  { to: "/my-bookings", label: "My Bookings" },
];

function MainLayout() {
  useSocketConnection();

  return (
    <div className="min-h-screen bg-hero-mesh text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white shadow-soft">
              ES
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-600">
                Expert Booking
              </p>
              <h1 className="text-lg font-semibold text-slate-900">Session Platform</h1>
            </div>
          </NavLink>

          <nav className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 p-1 shadow-soft">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
