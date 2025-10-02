import { useState, useEffect } from "react";
import logo from "@/public/Productasset/Logoicon.png";
import Image from "next/image";
import ButtonLoader from "../Loadercomponents/button-loader";

const SplashScreen = ({ onComplete }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Start content animation after brief delay
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    // Complete splash screen after animation
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-background via-professional-light to-background">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-professional-blue rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-professional-accent rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 px-6 text-center max-w-md mx-auto">
        {/* Logo */}
        <div
          className={`transform transition-all duration-700 ease-out ${
            showContent
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }`}
        >
          <div className="relative ">
            <Image
              src={logo}
              alt="Thevillacamp"
              className="w-20 h-20 md:w-24 md:h-24 object-contain"
            />
          </div>
        </div>

        {/* Brand Name with Custom Font */}
        {/* <div 
          className={`transform transition-all duration-700 ease-out delay-200 ${
            showContent 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-brand text-professional-navy tracking-tight leading-tight">
            Thevillacamp
          </h1>
        </div> */}

        {/* Tagline with Italic */}

        {/* Animated Loader */}
        <div
          className={`transform transition-all duration-700 ease-out delay-500 ${
            showContent
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <div className="loader">
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
