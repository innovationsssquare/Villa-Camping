export const metadata = {
  title: 'Terms of Service | ThevillaCamp',
  description: 'Terms of service for ThevillaCamp - rules and regulations for using our platform.',
};

export default function TermsOfServicePage() {
  return (
    <main className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-semibold mb-6">Terms of Service</h1>
      <p className="text-gray-700 mb-4">These Terms govern your use of ThevillaCamp.</p>
      <section className="prose">
        <h2>Using the Service</h2>
        <p>Rules and responsibilities for users and hosts.</p>
        <h2>Bookings and Payments</h2>
        <p>Information about cancellations, payments, and refunds.</p>
        <h2>Limitation of Liability</h2>
        <p>Disclaimer and liability limits.</p>
      </section>
    </main>
  );
}
