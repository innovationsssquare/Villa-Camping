import { ArrowLeft } from "lucide-react";

const Header = ({ title, onBackClick }) => {
  return (
    <header className="flex items-center gap-4 px-mobile py-4 bg-card border-b border-border">
      <button 
        onClick={onBackClick}
        className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="w-6 h-6 text-foreground" />
      </button>
      <h1 className="text-xl font-heading-weight text-foreground">{title}</h1>
    </header>
  );
};

export default Header;