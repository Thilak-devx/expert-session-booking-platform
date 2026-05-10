import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import ErrorState from "../components/ErrorState";
import ExpertForm from "../components/ExpertForm";
import PageHero from "../components/PageHero";
import { createExpert, getExpertCategories } from "../services/expertService";
import getErrorMessage from "../utils/getErrorMessage";

function CreateExpertPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await getExpertCategories();
        setCategories(categoryData);
      } catch (requestError) {
        setError(getErrorMessage(requestError, "Failed to load categories"));
      }
    };

    fetchCategories();
  }, []);

  const handleCreate = async (payload) => {
    setIsSubmitting(true);

    try {
      await createExpert(payload);
      toast.success("Expert created successfully");
      navigate("/admin");
    } catch (requestError) {
      toast.error(getErrorMessage(requestError, "Failed to create expert"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return <ErrorState title="Unable to open create expert page" description={error} actionLabel="Back to admin" onAction={() => navigate("/admin")} />;
  }

  return (
    <section className="space-y-8">
      <PageHero
        badge="Admin"
        title="Create an expert profile"
        description="Add expert details, availability, and category information so the listing and booking flow stay current."
        aside={
          <div className="space-y-4">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-300">Existing categories</p>
              <p className="mt-2 text-3xl font-semibold">{categories.length}</p>
            </div>
            <Link to="/admin" className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-900">
              Back to Admin
            </Link>
          </div>
        }
      />

      <ExpertForm mode="create" categories={categories} isSubmitting={isSubmitting} onSubmit={handleCreate} />
    </section>
  );
}

export default CreateExpertPage;
