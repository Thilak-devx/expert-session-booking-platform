import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import ConfirmModal from "../components/ConfirmModal";
import ExpertAvailabilityBadge from "../components/ExpertAvailabilityBadge";
import ExpertCardSkeleton from "../components/ExpertCardSkeleton";
import ExpertForm from "../components/ExpertForm";
import PageHero from "../components/PageHero";
import { deleteExpert, getAdminExperts, getExpertCategories, updateExpert } from "../services/expertService";
import getErrorMessage from "../utils/getErrorMessage";

function AdminPage() {
  const [experts, setExperts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [expertToDelete, setExpertToDelete] = useState(null);

  const fetchAdminData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const [expertData, categoryData] = await Promise.all([getAdminExperts(), getExpertCategories()]);
      setExperts(expertData);
      setCategories(categoryData);
      setSelectedExpert((previous) => expertData.find((item) => item._id === previous?._id) || expertData[0] || null);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Failed to load admin expert data"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdate = async (payload) => {
    if (!selectedExpert) {
      return;
    }

    setIsSaving(true);

    try {
      const updatedExpert = await updateExpert(selectedExpert._id, payload);
      toast.success("Expert updated successfully");
      setExperts((previous) => previous.map((item) => (item._id === updatedExpert._id ? updatedExpert : item)));
      setSelectedExpert(updatedExpert);
      setCategories((previous) =>
        [...new Set([...previous, updatedExpert.category])].sort((left, right) => left.localeCompare(right))
      );
    } catch (requestError) {
      toast.error(getErrorMessage(requestError, "Failed to update expert"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!expertToDelete?._id) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteExpert(expertToDelete._id);
      toast.success("Expert deleted successfully");

      setExperts((previous) => previous.filter((item) => item._id !== expertToDelete._id));
      setSelectedExpert((previous) => (previous?._id === expertToDelete._id ? null : previous));
      setExpertToDelete(null);
      await fetchAdminData();
    } catch (requestError) {
      toast.error(getErrorMessage(requestError, "Failed to delete expert"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="space-y-8">
      <PageHero
        badge="Admin"
        title="Manage experts, categories, and availability"
        description="Create and maintain the expert catalog that powers discovery, filtering, booking, and realtime availability across the platform."
        aside={
          <div className="space-y-4">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-300">Experts in catalog</p>
              <p className="mt-2 text-3xl font-semibold">{experts.length}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-300">Unique categories</p>
              <p className="mt-2 text-3xl font-semibold">{categories.length}</p>
            </div>
            <Link to="/admin/create-expert" className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-900">
              Add New Expert
            </Link>
          </div>
        }
      />

      {isLoading ? (
        <div className="grid gap-8 xl:grid-cols-[360px_minmax(0,1fr)] xl:items-start">
          <div className="space-y-4 xl:sticky xl:top-24">
            <div className="rounded-[32px] border border-slate-200 bg-white/90 p-5 shadow-soft">
              <div className="admin-scrollbar space-y-4 xl:max-h-[calc(100vh-11rem)] xl:overflow-y-auto xl:pr-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <ExpertCardSkeleton key={index} />
                ))}
              </div>
            </div>
          </div>
          <div className="mx-auto w-full max-w-4xl">
            <ExpertCardSkeleton />
          </div>
        </div>
      ) : error ? (
        <ErrorState title="Unable to load admin panel" description={error} actionLabel="Try again" onAction={fetchAdminData} />
      ) : (
        <div className="grid gap-8 xl:grid-cols-[360px_minmax(0,1fr)] xl:items-start">
          <div className="xl:sticky xl:top-24">
            <div className="rounded-[32px] border border-slate-200 bg-white/90 p-5 shadow-soft">
              <div className="mb-4">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Expert List</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">Select an expert to edit</h3>
              </div>

              <div className="admin-scrollbar space-y-4 xl:max-h-[calc(100vh-12rem)] xl:overflow-y-auto xl:pr-2">
                {experts.length ? (
                  experts.map((expert) => (
                    <button
                      key={expert._id}
                      type="button"
                      onClick={() => setSelectedExpert(expert)}
                      className={`w-full rounded-[28px] border bg-white/90 p-5 text-left shadow-soft transition ${
                        selectedExpert?._id === expert._id ? "border-slate-900" : "border-slate-200"
                      }`}
                    >
                      <div className="flex gap-4">
                        <img
                          src={expert.profileImage}
                          alt={expert.name}
                          className="h-20 w-20 shrink-0 rounded-[20px] object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
                                {expert.category}
                              </p>
                              <h3 className="mt-2 truncate text-xl font-semibold text-slate-900">{expert.name}</h3>
                            </div>
                            <ExpertAvailabilityBadge availableSlots={expert.availableSlots} />
                          </div>
                          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
                            <span className="rounded-full bg-slate-100 px-3 py-1.5">{expert.experience}+ years</span>
                            <span className="rounded-full bg-slate-100 px-3 py-1.5">{expert.rating.toFixed(1)} rating</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <EmptyState
                    title="No experts found"
                    description="Create your first expert to populate the homepage, category filters, and booking flow."
                    action={
                      <Link
                        to="/admin/create-expert"
                        className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                      >
                        Add Expert
                      </Link>
                    }
                  />
                )}
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-4xl">
            {selectedExpert ? (
              <div className="space-y-5">
                <div className="flex flex-col gap-4 rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-soft sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">Edit expert</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-900">{selectedExpert.name}</h3>
                    <p className="mt-2 text-sm text-slate-500">Update profile details, categories, and slot availability.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpertToDelete(selectedExpert)}
                    disabled={isDeleting}
                    aria-label={`Delete expert ${selectedExpert.name}`}
                    className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isDeleting && expertToDelete?._id === selectedExpert._id ? "Deleting..." : "Delete Expert"}
                  </button>
                </div>

                <ExpertForm
                  key={selectedExpert._id}
                  mode="edit"
                  initialValues={selectedExpert}
                  categories={categories}
                  isSubmitting={isSaving}
                  onSubmit={handleUpdate}
                />
              </div>
            ) : (
              <EmptyState
                title="Select an expert to edit"
                description="Choose an expert from the list to update details, manage categories, and adjust available slots."
              />
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(expertToDelete)}
        title="Delete this expert?"
        description="This will remove the expert profile and any related bookings. This action cannot be undone."
        confirmLabel="Delete Expert"
        confirmingText="Deleting..."
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onClose={() => {
          if (!isDeleting) {
            setExpertToDelete(null);
          }
        }}
      />
    </section>
  );
}

export default AdminPage;
