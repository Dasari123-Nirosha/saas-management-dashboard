
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, SearchX } from "lucide-react";

import Button from "../components/common/Button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-icon">
          <SearchX size={42} strokeWidth={1.6} />
        </div>

        <p className="not-found-code">ERROR 404</p>

        <h1>Page not found</h1>

        <p className="not-found-description">
          Sorry, we couldn't find the page you're looking for.
          It may have been moved, deleted, or the URL may be incorrect.
        </p>

        <div className="not-found-actions">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            icon={<ArrowLeft size={17} />}
          >
            Go Back
          </Button>

          <Link to="/" className="not-found-home-link">
            <Button icon={<Home size={17} />}>
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <p className="not-found-help">
          Need help? Return to the dashboard and choose a page from
          the sidebar.
        </p>
      </div>
    </main>
  );
}