import UploadForm from "../components/UploadForm";

export default function MessOwnerView({ user }) {
  if (!user) {
    return (
      <main className="app-shell">
        <div className="container">
          <p>Please login as a mess owner to upload menus.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <div className="container">
        <section className="section">
          <h2 className="section-title">Upload Today’s Menu</h2>
          <p className="section-subtitle">
            Menus automatically expire after 5 hours
          </p>

          <UploadForm />
        </section>
      </div>
    </main>
  );
}
