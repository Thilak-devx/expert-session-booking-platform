const styles = {
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Completed: "bg-slate-200 text-slate-700 border-slate-300",
};

function StatusBadge({ status }) {
  return (
    <span className={`rounded-full border px-4 py-2 text-sm font-medium ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
}

export default StatusBadge;
