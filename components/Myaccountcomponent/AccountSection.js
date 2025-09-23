import { Settings, Bell, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const AccountItem = ({
  icon,
  title,
  description,
  onClick,
  variant = "default",
}) => {
  const textColor =
    variant === "danger" ? "text-red-500" : "text-foreground";
  const iconColor =
    variant === "danger"
      ? "text-red-500"
      : "text-gray-400 group-hover:text-accent";

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-2  transition-colors rounded-xl group"
    >
      <div className={`${iconColor} transition-colors`}>{icon}</div>
      <div className="flex-1 text-left">
        <h3 className={`font-medium  ${textColor}`}>{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <ChevronRight className="w-5 h-5 text-accent" />
    </button>
  );
};

const AccountSection = ({ onSignOut }) => {
  const navigate = useRouter();

  const handleSettings = () => {
    navigate.push("/account/settings");
  };

  const handleNotifications = () => {
    navigate.push("/notifications");
  };

  const handleHelp = () => {
    navigate.push("/account/support");
  };

  return (
    <div className="px-3 ">
      <h2 className="text-sm font-medium-weight text-muted-foreground uppercase tracking-wider mb-2">
        ACCOUNT SETTINGS
      </h2>

      <div className="bg-white p-2 rounded-2xl border border-gray-200 overflow-hidden">
        <AccountItem
          icon={<Settings className="w-6 h-6" />}
          title="Settings"
          description="Privacy, notifications, and preferences"
          onClick={handleSettings}
        />

        <div className="border-t border-gray-200" />

        <AccountItem
          icon={<Bell className="w-6 h-6" />}
          title="Notifications"
          description="Manage your notification preferences"
          onClick={handleNotifications}
        />

        <div className="border-t border-gray-200" />

        <AccountItem
          icon={<HelpCircle className="w-6 h-6" />}
          title="Help & Support"
          description="Get help and contact support"
          onClick={handleHelp}
        />

        <div className="border-t border-gray-200" />

        <AccountItem
          icon={<LogOut className="w-6 h-6" />}
          title="Sign Out"
          onClick={onSignOut}
          variant="danger"
        />
      </div>
    </div>
  );
};

export default AccountSection;
