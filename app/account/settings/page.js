"use client";
import { NotificationSheet } from "@/components/Navbarcomponents/Notificationsheet";
import { UserSidebar } from "@/components/Navbarcomponents/Sidebar";
import { useToast } from "@/components/ui/toast-provider";
import { cn } from "@/lib/utils";
import {
  Moon,
  Sun,
  Globe,
  Shield,
  Smartphone,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

const SettingItem = ({
  icon,
  title,
  description,
  value,
  hasToggle,
  isToggled,
  onClick,
  onToggle,
}) => {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="text-foreground">{icon}</div>
      <div className="flex-1">
        <h3 className="font-medium-weight text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {hasToggle ? (
        <button
          onClick={() => onToggle?.(!isToggled)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            isToggled ? "bg-black" : "bg-muted"
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
              isToggled ? "translate-x-7" : "translate-x-1"
            }`}
          />
        </button>
      ) : (
        <button
          onClick={onClick}
          className="flex items-center gap-2 hover:bg-secondary/50 rounded-lg p-1 transition-colors"
        >
          {value && (
            <span className="text-sm text-muted-foreground">{value}</span>
          )}
          <ChevronRight className="w-5 h-5 text-accent" />
        </button>
      )}
    </div>
  );
};

const SettingSection = ({ title, children }) => {
  return (
    <>

      <h2 className="text-sm font-medium-weight text-muted-foreground uppercase tracking-wider mb-3 px-mobile">
        {title}
      </h2>
    <div className="mb-6 border p-2 rounded-xl border-gray-300">
      <div className="bg-card rounded-2xl shadow-soft overflow-hidden mx-mobile">
        {children}
      </div>
    </div>
    </>
  );
};

const Settings = () => {
  const navigate = useRouter();
  const { addToast } = useToast();

  const handleBackClick = () => {
    navigate.push("/");
  };

  const handleToggle = (setting, value) => {
    addToast({
      title: "Setting updated",
      description: `${setting} has been ${value ? "enabled" : "disabled"}`,
    });
  };

  const handleSettingClick = (setting) => {
    addToast({
      title: "Coming soon",
      description: `${setting} settings will be available soon`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-3 mx-auto bg-background min-h-screen">
        <section
          className={cn(
            " w-full sticky top-0  bg-white   px-4 py-3 z-50 transition-transform duration-300 ease-in-out md:hidden "
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserSidebar/>
              Settings
            </div>

            <div className="flex items-center gap-2">
              <NotificationSheet />

              {/* <Button
                           onClick={() => router.push("/bag")}
                           variant="outline"
                           size="icon"
                           className="rounded-md  border-gray-300 relative bg-[#FFFFFF4D]"
                         >
                           <IoBag className="h-5 w-5" />
                           {cartItemCount > 0 && (
                             <Badge
                               className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-black text-white border-1 border-white min-w-[1.25rem] h-5"
                               variant="default"
                             >
                               {cartItemCount}
                             </Badge>
                           )}
                           <span className="sr-only">Shopping cart</span>
                         </Button> */}
            </div>
          </div>
        </section>

        <div className="py-4">
          <SettingSection title="Appearance">
            <SettingItem
              icon={<Moon className="w-6 h-6 text-gray-500" />}
              title="Dark Mode"
              description="Switch between light and dark themes"
              hasToggle
              isToggled={true}
              onToggle={(value) => handleToggle("Dark Mode", value)}
            />
            <div className="border-t border-gray-200" />
            <SettingItem
              icon={<Globe className="w-6 h-6 text-gray-500" />}
              title="Language"
              value="English"
              onClick={() => handleSettingClick("Language")}
            />
          </SettingSection>

          <SettingSection title="Privacy & Security">
            <SettingItem
              icon={<Shield className="w-6 h-6 text-gray-500" />}
              title="Two-Factor Authentication"
              description="Add an extra layer of security"
              hasToggle
              isToggled={true}
              onToggle={(value) =>
                handleToggle("Two-Factor Authentication", value)
              }
            />
            <div className="border-t border-gray-200" />
            <SettingItem
              icon={<Smartphone className="w-6 h-6 text-gray-500" />}
              title="Biometric Login"
              description="Use fingerprint or face recognition"
              hasToggle
              isToggled={false}
              onToggle={(value) => handleToggle("Biometric Login", value)}
            />
          </SettingSection>

          <SettingSection title="Notifications">
            <SettingItem
              icon={<Smartphone className="w-6 h-6 text-gray-500" />}
              title="Push Notifications"
              description="Receive notifications on your device"
              hasToggle
              isToggled={true}
              onToggle={(value) => handleToggle("Push Notifications", value)}
            />
          </SettingSection>

          <SettingSection title="Payment">
            <SettingItem
              icon={<CreditCard className="w-6 h-6 text-gray-500" />}
              title="Payment Methods"
              description="Manage your cards and payment options"
              onClick={() => handleSettingClick("Payment Methods")}
            />
          </SettingSection>
        </div>
      </div>
    </div>
  );
};

export default Settings;
