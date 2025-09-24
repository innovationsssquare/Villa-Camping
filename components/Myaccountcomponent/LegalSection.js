import { Button } from "@heroui/react";
import { Phone, User, FileText, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const LegalItem = ({ icon, title, onClick }) => {
  return (
    <Button
    variant="light"
    size=""
      onPress={onClick}
      className="w-full flex items-center gap-4 p-4  transition-colors rounded-xl group"
    >
      <div className="text-gray-400 group-hover:text-accent transition-colors">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <h3 className="font-medium-weight text-foreground">{title}</h3>
      </div>
      <ChevronRight className="w-5 h-5 text-accent" />
    </Button>
  );
};

const LegalSection = () => {
  const navigate = useRouter();

  const handleContactUs = () => {
    navigate.push("/account/support");
  };

  const handlePrivacyPolicy = () => {
    navigate.push("/account/privacy-policy");
  };

  const handleTermsConditions = () => {
    navigate.push("/account/Terms-Conditions");
  };

  return (
    <div className="px-3 py-4">
      <h2 className="text-sm font-medium-weight text-muted-foreground uppercase tracking-wider mb-2">
        LEGAL & SUPPORT
      </h2>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <LegalItem
          icon={<Phone className="w-5 h-5" />}
          title="Contact us"
          onClick={handleContactUs}
        />

        <div className="border-t border-gray-200" />

        <LegalItem
          icon={<User className="w-5 h-5" />}
          title="Privacy Policy"
          onClick={handlePrivacyPolicy}
        />

        <div className="border-t border-gray-200" />

        <LegalItem
          icon={<FileText className="w-5 h-5" />}
          title="Terms & Conditions"
          onClick={handleTermsConditions}
        />
      </div>
    </div>
  );
};

export default LegalSection;
