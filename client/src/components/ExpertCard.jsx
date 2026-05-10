import { Link } from "react-router-dom";

import ExpertAvailabilityBadge from "./ExpertAvailabilityBadge";

function ExpertCard({ expert }) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white/85 p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_64px_rgba(15,23,42,0.18)]">
      <div className="flex flex-col gap-5 md:flex-row">
        <img
          src={expert.profileImage}
          alt={expert.name}
          className="h-32 w-32 rounded-[24px] object-cover transition duration-300 group-hover:scale-[1.02]"
        />
        <div className="flex flex-1 flex-col">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">
                {expert.category}
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">{expert.name}</h3>
            </div>
            <div className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
              {expert.rating.toFixed(1)} rating
            </div>
          </div>

          <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{expert.bio}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-1.5">{expert.experience}+ years</span>
            <span className="rounded-full bg-slate-100 px-3 py-1.5">
              {expert.availableSlots?.length || 0} available days
            </span>
            <ExpertAvailabilityBadge availableSlots={expert.availableSlots} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={`/experts/${expert._id}`}
              className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              View Profile
            </Link>
            <Link
              to={`/booking/${expert._id}`}
              className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              Book Session
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ExpertCard;
