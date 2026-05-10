function ConnectionBadge({ status }) {
  const statusMap = {
    connected: {
      label: "Live updates connected",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    reconnecting: {
      label: "Reconnecting live updates",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    },
    disconnected: {
      label: "Live updates offline",
      className: "border-rose-200 bg-rose-50 text-rose-700",
    },
  };

  const current = statusMap[status] || statusMap.disconnected;

  return (
    <span className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] ${current.className}`}>
      {current.label}
    </span>
  );
}

export default ConnectionBadge;
