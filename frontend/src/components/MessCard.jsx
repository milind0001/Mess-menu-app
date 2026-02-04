import { useMemo } from "react";
import { deleteMess } from "../services/api";

/* ================= Utilities ================= */

function getTimeRemaining(expiresAt) {
  const now = Date.now();
  const diff = expiresAt - now;

  if (diff <= 0) return { text: "Expired", urgent: true };

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return { text: `${hours}h ${minutes}m left`, urgent: hours < 1 };
  }
  return { text: `${minutes}m left`, urgent: true };
}

function getMenuTypeLabel(type) {
  const labels = {
    veg: "Veg Only",
    "non-veg": "Non-Veg Available",
    budget: "Budget Friendly"
  };
  return labels[type] || type;
}

/* ================= Component ================= */

export default function MessCard({ mess, onView, user }) {
  const timeRemaining = useMemo(
    () => getTimeRemaining(mess.expiresAt),
    [mess.expiresAt]
  );

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this menu?"
    );
    if (!confirmDelete) return;

    try {
      await deleteMess(mess._id);
    } catch (err) {
      alert("Failed to delete menu");
    }
  };

  const isOwner =
    user && (mess.owner === user.id || mess.owner?._id === user.id);

  return (
    <div className="mess-card fade-in">
      <h3>{mess.name}</h3>

      <div className="location">
        <i className="fas fa-map-marker-alt"></i> {mess.location}
      </div>

      {/* Menu preview */}
      <div className="menu-preview">
        {mess.menuText}
      </div>

      {/* 🤖 AI SUMMARY */}
      {mess.aiSummary && (
        <p className="ai-summary">
          🤖 <strong>{mess.aiSummary}</strong>
        </p>
      )}

      {/* 🏷️ AI TAGS */}
      {mess.aiTags?.length > 0 && (
        <div className="ai-tags">
          {mess.aiTags.map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {mess.menuType && (
        <div className={`menu-type ${mess.menuType}`}>
          {getMenuTypeLabel(mess.menuType)}
        </div>
      )}

      {mess.price && (
        <div className="price">
          <i className="fas fa-rupee-sign"></i> {mess.price}
        </div>
      )}

      <div className={`time-remaining ${timeRemaining.urgent ? "urgent" : ""}`}>
        <i className="fas fa-clock"></i> {timeRemaining.text}
      </div>

      {/* Actions */}
      <div className="card-actions">
        <button
          className="view-details-btn"
          onClick={() => onView(mess)}
        >
          <i className="fas fa-eye"></i> View Details
        </button>

        {isOwner && (
          <button
            className="delete-btn"
            onClick={handleDelete}
          >
            <i className="fas fa-trash"></i> Delete
          </button>
        )}
      </div>
    </div>
  );
}
