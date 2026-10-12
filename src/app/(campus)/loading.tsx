export default function CampusLoading() {
  return <div className="page-loading" role="status" aria-label="Loading page">
    <span className="loading-label">Loading…</span>
    <div className="loading-heading" aria-hidden="true" />
    <div className="loading-card" aria-hidden="true"><span /><span /><span /></div>
    <div className="loading-card" aria-hidden="true"><span /><span /><span /></div>
  </div>;
}
