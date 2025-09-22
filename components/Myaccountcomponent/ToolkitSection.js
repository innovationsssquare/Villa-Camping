import { Briefcase, Heart, Home, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const ToolkitItem = ({ icon, title, description, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4  transition-colors rounded-xl group"
    >
      <div className="text-gray-400 group-hover:text-gray-500 transition-colors">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <h3 className="font-medium-weight text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <ChevronRight className="w-5 h-5 text-accent" />
    </button>
  );
};

const ToolkitSection = () => {
  const navigate = useRouter();

  const handleViewTrips = () => {
    navigate.push("/manage-trips");
  };

  const handleWishlist = () => {
    navigate.push("/wishlist");
  };

  const handleBecomeHost = () => {
    navigate.push("/become-host");
  };

  return (
    <div className="px-3 py-4">
      <h2 className="text-sm font-medium-weight text-muted-foreground uppercase tracking-wider mb-2">
        MY TOOLKIT
      </h2>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <ToolkitItem
          icon={<Briefcase className="w-6 h-6" />}
          title="View/Manage Trips"
          onClick={handleViewTrips}
        />

        <div className="border-t border-gray-200" />

        <ToolkitItem
          icon={<Heart className="w-6 h-6" />}
          title="Wishlist"
          onClick={handleWishlist}
        />

        <div className="border-t border-gray-200" />

        <ToolkitItem
          icon={<Home className="w-6 h-6" />}
          title="Become a Host"
          onClick={handleBecomeHost}
        />
      </div>
    </div>
  );
};

export default ToolkitSection;
