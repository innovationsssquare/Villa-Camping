export const metadata = {
  title: 'Services | ThevillaCamp',
  description: 'Browse on-site services offered by hosts and partners.',
};

export default function ServicesPage() {
  return (
    <main className="max-w-6xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-semibold mb-6">Services</h1>
      <p className="text-gray-700 mb-4">Find services such as catering, activities, and more.</p>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 border rounded">Service card placeholder</div>
        <div className="p-4 border rounded">Service card placeholder</div>
        <div className="p-4 border rounded">Service card placeholder</div>
      </section>
    </main>
  );
}
