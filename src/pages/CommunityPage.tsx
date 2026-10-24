import type { AppApi } from "../App";
import CommunityCatalog from "../components/CommunityCatalog";
import { AUTHORING } from "../lib/community";

/** Courses written by people who use Erudior. Writing one starts here (website only). */
export default function CommunityPage({ api }: { api: AppApi }) {
  return (
    <div className="page">
      <div className="page-head row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1>Community</h1>
        </div>
        {AUTHORING && (
          <button className="btn primary" onClick={() => api.go({ name: "create" })}>
            Create a course
          </button>
        )}
      </div>
      <CommunityCatalog api={api} />
    </div>
  );
}
