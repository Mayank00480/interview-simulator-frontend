import React from 'react';
import AuthIllustration from '../components/AuthIllustration';
import AuthForm from '../components/AuthForm';

export default function AuthPage() {
  return (
    <div className="auth-page-wrapper">
      <div className="bg-shape bg-shape-1" aria-hidden="true" />
      <div className="bg-shape bg-shape-2" aria-hidden="true" />
      <div className="bg-shape bg-shape-3" aria-hidden="true" />

      <main className="auth-card-shell">
        <div className="auth-card-grid">
          <section className="auth-grid-left" aria-label="Product Highlights">
            <AuthIllustration />
          </section>

          <section className="auth-grid-right" aria-label="Authentication">
            <AuthForm />
          </section>
        </div>
      </main>
    </div>
  );
}
