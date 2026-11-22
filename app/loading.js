import VillaCampLoader from "@/components/Loadercomponents/VillaCampLoader";

export default function Loading() {
  return (
    <div className="fixed inset-0 min-h-screen w-full flex items-center justify-center bg-white z-50">
      <VillaCampLoader size={120} logoColor="#111827" accentColor="#ff6900" />
    </div>
  );
}
