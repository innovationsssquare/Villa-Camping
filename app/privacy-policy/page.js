export const metadata = {
  title: 'Privacy Policy | ThevillaCamp',
  description: 'Privacy policy for ThevillaCamp - how we collect and use personal data.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-semibold mb-6">Privacy Policy</h1>
      <p className="text-gray-700 mb-4">
        This Privacy Policy explains how ThevillaCamp collects, uses, and shares your personal data.
      </p>
      <section className="prose">
        <h2>Information we collect</h2>
        <p>We collect information you provide to us and information collected automatically.</p>
        <h2>How we use information</h2>
        <p>We use data to provide and improve our services, process bookings, and for analytics.</p>
        <h2>Your choices</h2>
        <p>You can manage cookies and marketing preferences in your account settings.</p>
      </section>
    </main>
  );
}
