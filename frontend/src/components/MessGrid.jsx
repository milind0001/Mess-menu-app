import MessCard from "./MessCard";

export default function MessGrid({ messes, onView, user }) {
  // ✅ Always normalize data first
  const safeMesses = Array.isArray(messes) ? messes : [];

  if (safeMesses.length === 0) {
    return (
      <div className="no-results">
        <i className="fas fa-search"></i>
        <h3>No messes found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="mess-grid">
      {safeMesses.map((mess) => (
        <MessCard
          key={mess._id}
          mess={mess}
          onView={onView}
          user={user}
        />
      ))}
    </div>
  );
}
