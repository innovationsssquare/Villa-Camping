export const metadata = {
  title: 'Experiences | ThevillaCamp',
  description: 'Discover local experiences curated by ThevillaCamp hosts.',
};

export default function ExperiencesPage() {
  return (
    <main className="max-w-6xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-semibold mb-6">Experiences</h1>
      <p className="text-gray-700 mb-4">Explore curated local experiences and activities.</p>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 border rounded">Experience card placeholder</div>
        <div className="p-4 border rounded">Experience card placeholder</div>
        <div className="p-4 border rounded">Experience card placeholder</div>
      </section>
    </main>
  );
}
