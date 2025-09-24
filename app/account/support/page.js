"use client";
import Header from "@/components/Myaccountcomponent/Header";
import { NotificationSheet } from "@/components/Navbarcomponents/Notificationsheet";
import { UserSidebar } from "@/components/Navbarcomponents/Sidebar";
import { useToast } from "@/components/ui/toast-provider";
import { cn } from "@/lib/utils";
import {
  MessageCircle,
  Phone,
  Mail,
  FileText,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";

const SupportItem = ({
  icon,
  title,
  description,
  action = "navigate",
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors rounded-xl group text-left"
    >
      <div className="text-accent">{icon}</div>
      <div className="flex-1">
        <h3 className="font-medium-weight text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      {action === "external" ? (
        <ExternalLink className="w-5 h-5 text-accent" />
      ) : (
        <ChevronRight className="w-5 h-5 text-accent" />
      )}
    </button>
  );
};

const FAQItem = ({ question, answer }) => {
  return (
    <div className="p-4 bg-card rounded-xl border border-gray-300">
      <h3 className="font-medium-weight text-foreground mb-2">{question}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
    </div>
  );
};

const HelpSupport = () => {
  const navigate = useRouter();
  const { addToast } = useToast();

  const handleBackClick = () => {
    navigate.push("/");
  };

  const handleLiveChat = () => {
    addToast({
      title: "Live Chat",
      description: "Connecting you to our support team...",
    });
  };

  const handlePhoneSupport = () => {
    addToast({
      title: "Phone Support",
      description: "Our support number: +1-800-TRAVEL",
    });
  };

  const handleEmail = () => {
    addToast({
      title: "Email Support",
      description: "Send us an email at support@travelapp.com",
    });
  };

  const handleGuidesAndTips = () => {
    addToast({
      title: "Travel Guides",
      description: "Opening travel guides and tips...",
    });
  };

  const faqs = [
    {
      question: "How do I cancel my booking?",
      answer:
        "You can cancel your booking up to 24 hours before check-in from the 'My Trips' section. Cancellation fees may apply based on the property's policy.",
    },
    {
      question: "When will I be charged?",
      answer:
        "You'll be charged when your booking is confirmed. For some properties, you may pay at the property directly.",
    },
    {
      question: "How do I contact my host?",
      answer:
        "You can message your host directly through the app once your booking is confirmed. Go to 'My Trips' and select your booking.",
    },
    {
      question: "What if I need to change my dates?",
      answer:
        "Contact your host or our support team to discuss date changes. Changes are subject to availability and may incur additional charges.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full mx-auto bg-background min-h-screen">
        <section
          className={cn(
            " w-full sticky top-0  bg-white   px-4 py-3 z-50 transition-transform duration-300 ease-in-out md:hidden "
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserSidebar />
              Help & Support
            </div>

            <div className="flex items-center gap-2">
              <NotificationSheet />
            </div>
          </div>
        </section>
        <div className="px-3 py-section-gap">
          {/* Contact Support Section */}
          <div className="mb-8">
            <h2 className="text-lg font-heading-weight text-foreground mb-4">
              Get Help
            </h2>
            <div className="bg-card rounded-2xl border border-gray-300 shadow-soft overflow-hidden">
              <SupportItem
                icon={<MessageCircle className="w-6 h-6 text-gray-500" />}
                title="Live Chat"
                description="Chat with our support team in real-time"
                action="contact"
                onClick={handleLiveChat}
              />
              <div className="border-t border-gray-200" />
              <SupportItem
                icon={<Phone className="w-6 h-6 text-gray-500" />}
                title="Phone Support"
                description="Call us for immediate assistance"
                action="contact"
                onClick={handlePhoneSupport}
              />
              <div className="border-t border-gray-200" />
              <SupportItem
                icon={<Mail className="w-6 h-6 text-gray-500" />}
                title="Email Support"
                description="Send us an email and we'll respond within 24 hours"
                action="contact"
                onClick={handleEmail}
              />
            </div>
          </div>

          {/* Resources Section */}
          <div className="mb-8">
            <h2 className="text-lg font-heading-weight text-foreground mb-4">
              Resources
            </h2>
            <div className="bg-card border border-gray-300 rounded-2xl shadow-soft overflow-hidden">
              <SupportItem
                icon={<FileText className="w-6 h-6" />}
                title="Travel Guides & Tips"
                description="Helpful guides for your next adventure"
                action="external"
                onClick={handleGuidesAndTips}
              />
            </div>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-lg font-heading-weight text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3 ">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>
          </div>

          {/* App Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">Thevillacamp</p>
            <p className="text-xs text-muted-foreground mt-1">
              Need technical support? Contact our development team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
