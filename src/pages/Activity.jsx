
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import RecentActivity from "../components/dashboard/RecentActivity";

export default function Activity() {
  const navigate = useNavigate();

  return (
    <main className="page-content">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="activity-back-button"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <RecentActivity
        title="All Activity"
        description="All updates across your workspace."
        showAll
      />
    </main>
  );
}
