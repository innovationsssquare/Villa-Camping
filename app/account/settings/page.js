"use client"
import { useToast } from "@/components/ui/toast-provider";
import { Moon, Sun, Globe, Shield, Smartphone, CreditCard, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";


const SettingItem = ({ 
  icon, title, description, value, hasToggle, isToggled, onClick, onToggle 
}) => {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="text-foreground">
        {icon}
      </div>
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
            isToggled ? "bg-accent" : "bg-muted"
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
    <div className="mb-6">
      <h2 className="text-sm font-medium-weight text-muted-foreground uppercase tracking-wider mb-3 px-mobile">
        {title}
      </h2>
      <div className="bg-card rounded-2xl shadow-soft overflow-hidden mx-mobile">
        {children}
      </div>
    </div>
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
        {/* <Header 
          title="Settings" 
          onBackClick={handleBackClick}
        /> */}
        
        <div className="py-section-gap">
          <SettingSection title="Appearance">
            <SettingItem
              icon={<Moon className="w-6 h-6" />}
              title="Dark Mode"
              description="Switch between light and dark themes"
              hasToggle
              isToggled={false}
              onToggle={(value) => handleToggle("Dark Mode", value)}
            />
            <div className="border-t border-border" />
            <SettingItem
              icon={<Globe className="w-6 h-6" />}
              title="Language"
              value="English"
              onClick={() => handleSettingClick("Language")}
            />
          </SettingSection>

          <SettingSection title="Privacy & Security">
            <SettingItem
              icon={<Shield className="w-6 h-6" />}
              title="Two-Factor Authentication"
              description="Add an extra layer of security"
              hasToggle
              isToggled={true}
              onToggle={(value) => handleToggle("Two-Factor Authentication", value)}
            />
            <div className="border-t border-border" />
            <SettingItem
              icon={<Smartphone className="w-6 h-6" />}
              title="Biometric Login"
              description="Use fingerprint or face recognition"
              hasToggle
              isToggled={false}
              onToggle={(value) => handleToggle("Biometric Login", value)}
            />
          </SettingSection>

          <SettingSection title="Notifications">
            <SettingItem
              icon={<Smartphone className="w-6 h-6" />}
              title="Push Notifications"
              description="Receive notifications on your device"
              hasToggle
              isToggled={true}
              onToggle={(value) => handleToggle("Push Notifications", value)}
            />
          </SettingSection>

          <SettingSection title="Payment">
            <SettingItem
              icon={<CreditCard className="w-6 h-6" />}
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