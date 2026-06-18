export const metadata = {
  title: 'Cancellation Policy | ThevillaCamp',
  description: 'Cancellation policy for bookings made on ThevillaCamp.',
};

export default function CancellationPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-semibold mb-6">Cancellation Policy</h1>
      <p className="text-gray-700 mb-4">Our cancellation terms depend on the property and booking type.</p>
      <section className="prose">
        <h2>General Policy</h2>
        <p>Hosts may set their own cancellation rules; please review the policy on each listing.</p>
        <h2>Refunds</h2>
        <p>Refund eligibility varies by booking and timing. Contact support for help.</p>
      </section>
    </main>
  );
}
