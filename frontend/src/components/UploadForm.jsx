import { useState } from "react";
import { createMess } from "../services/api";

export default function UploadForm() {
  const [loading, setLoading] = useState(false);
  const [imageName, setImageName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", e.target.name.value);
    formData.append("location", e.target.location.value);
    formData.append("phone", e.target.phone.value);
    formData.append("menuType", e.target.menuType.value || "");
    formData.append("menuText", e.target.menuText.value);
    formData.append("price", getPriceText(e.target.price.value) || "");
    formData.append("date", new Date().toISOString().split("T")[0]);

    if (e.target.image.files[0]) {
      formData.append("image", e.target.image.files[0]);
    }

    try {
      await createMess(formData);
      alert("Menu uploaded successfully!");
      e.target.reset();
      setImageName("");
    } catch (err) {
      alert("Error uploading menu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-section">
      <div className="upload-card">
        <h3>Add New Menu</h3>

        <div className="upload-time-info">
          <i className="fas fa-clock"></i>{" "}
          <strong>Note:</strong> Menus auto-delete after 5 hours
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mess Name</label>
            <input name="name" required placeholder="Enter mess name" />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input name="location" required placeholder="Enter location" />
          </div>

          <div className="form-group">
            <label>Contact Number</label>
            <input name="phone" required placeholder="Enter contact number" />
          </div>

          <div className="form-group">
            <label>Menu Type (Optional)</label>
            <select name="menuType">
              <option value="">Select menu type</option>
              <option value="veg">Veg Only</option>
              <option value="non-veg">Non-Veg Available</option>
              <option value="budget">Budget Friendly</option>
            </select>
          </div>

          <div className="form-group">
            <label>Menu Details</label>
            <textarea
              name="menuText"
              required
              rows="4"
              placeholder="Roti, Sabzi, Dal, Rice..."
            />
          </div>

          <div className="form-group">
            <label>Upload Menu Image (Optional)</label>
            <div className="file-upload">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) =>
                  setImageName(e.target.files[0]?.name || "")
                }
              />
              <div className="upload-placeholder">
                <i className="fas fa-cloud-upload-alt"></i>
                <span>{imageName || "Click to upload image"}</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Price Range (Optional)</label>
            <select name="price">
              <option value="">Select price range</option>
              <option value="budget">₹30-50 per meal</option>
              <option value="medium">₹50-80 per meal</option>
              <option value="premium">₹80+ per meal</option>
            </select>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Uploading...
              </>
            ) : (
              <>
                <i className="fas fa-upload"></i> Upload Menu
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

/**
 * Convert select value to display text
 */
function getPriceText(value) {
  const map = {
    budget: "₹30-50 per meal",
    medium: "₹50-80 per meal",
    premium: "₹80+ per meal",
  };
  return map[value] || value;
}
