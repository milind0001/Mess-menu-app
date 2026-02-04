import { useState } from "react";
import MessGrid from "../components/MessGrid";
import MenuModal from "../components/MenuModal";

export default function StudentView({ messes, user }) {
  const [selectedMess, setSelectedMess] = useState(null);

  return (
    <main className="app-shell">
      <div className="container">
        <section className="section">
          <h2 className="section-title">Find Today’s Mess Menu</h2>
          <p className="section-subtitle">
            Fresh menus near you, updated in real time
          </p>

          <MessGrid
            messes={messes}
            onView={setSelectedMess}
            user={user}
          />
        </section>

        {selectedMess && (
          <MenuModal
            mess={selectedMess}
            onClose={() => setSelectedMess(null)}
          />
        )}
      </div>
    </main>
  );
}
