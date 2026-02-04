/**
 * Utilities
 */
function getMenuTypeLabel(type) {
  const labels = {
    veg: "Veg Only",
    "non-veg": "Non-Veg Available",
    budget: "Budget Friendly",
  };
  return labels[type] || type;
}

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

export default function MenuModal({ mess, onClose }) {
  if (!mess) return null;

  const timeRemaining = getTimeRemaining(mess.expiresAt);

  const callMess = () => {
    window.open(`tel:${mess.phone}`, "_blank");
  };

  const whatsappMess = () => {
    const msg = `Hi, I'm interested in your mess menu at ${mess.name}. Can you please share more details?`;
    const phone = mess.phone.replace(/\D/g, "");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="modal" style={{ display: "block" }} onClick={onClose}>
      <div className="modal-content slide-in" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>&times;</span>

        <h2>{mess.name}</h2>

        <div className="mess-details">
          <p><i className="fas fa-map-marker-alt"></i> <strong>Location:</strong> {mess.location}</p>
          <p><i className="fas fa-phone"></i> <strong>Contact:</strong> {mess.phone}</p>
          <p><i className="fas fa-calendar"></i> <strong>Date:</strong> {mess.date}</p>
          <p>
            <i className="fas fa-clock"></i>{" "}
            <strong>Time Left:</strong>{" "}
            <span className={timeRemaining.urgent ? "urgent" : ""}>
              {timeRemaining.text}
            </span>
          </p>

          {mess.price && (
            <p><i className="fas fa-tag"></i> <strong>Price:</strong> {mess.price}</p>
          )}

          {mess.menuType && (
            <p>
              <i className="fas fa-utensils"></i>{" "}
              <strong>Menu Type:</strong> {getMenuTypeLabel(mess.menuType)}
            </p>
          )}
        </div>

        <div className="menu-details">
          <h3>Today's Menu</h3>
          <div className="menu-text">{mess.menuText}</div>
        </div>

        {mess.image?.url && (
          <img
            src={mess.image.url}
            alt="Menu"
            className="menu-image"
          />
        )}

        <div className="contact-actions">
          <button className="call-btn" onClick={callMess}>
            <i className="fas fa-phone"></i> Call Now
          </button>
          <button className="whatsapp-btn" onClick={whatsappMess}>
            <i className="fab fa-whatsapp"></i> WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
