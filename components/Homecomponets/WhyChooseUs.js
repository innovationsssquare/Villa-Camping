import { Shield, Home, Headphones, Award, Wifi, Car } from "lucide-react";
import { Highlighter } from "../magicui/highlighter";
import { NumberTicker } from "../magicui/number-ticker";

const features = [
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Verified properties with 24/7 security and safety protocols",
  },
  {
    icon: Home,
    title: "Premium Stays",
    description: "Handpicked villas and cottages with modern amenities",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock customer service for seamless experience",
  },
  {
    icon: Award,
    title: "Best Price Guarantee",
    description: "Competitive rates with no hidden charges",
  },
  {
    icon: Wifi,
    title: "Modern Amenities",
    description: "Wi-Fi, AC, kitchen facilities and more in every property",
  },
  {
    icon: Car,
    title: "Easy Access",
    description: "Convenient locations with clear directions and parking",
  },
];

export function WhyChooseUs() {
  return (
    <section className="md:py-8 bg-white w-full">
      <div className="w-full mx-auto md:px-4 px-3 sm:px-6 lg:px-8">
        <div className="text-center md:mb-4 mb-4">
          <h2 className="text-lg  sm:text-3xl md:text-4xl font-medium text-black md:mb-4 text-balance">
            Why Choose The Villa Camp
          </h2>
          <p className="md:text-sm text-xs text-gray-600 max-w-3xl mx-auto">
           {` We're committed to providing exceptional experiences that create
            lasting memories`}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 md:gap-8 ">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.title}
                className="text-center group hover:bg-stone-50 rounded-2xl md:p-6 p-2 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-black transition-colors duration-300">
                  <IconComponent className="w-8 h-8  text-black group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="md:text-xl text-sm font-bold text-black mb-3">
                  <Highlighter action="underline" color="#000">
                    {feature.title}
                  </Highlighter>
                </h3>
                <p className="text-gray-600 leading-relaxed text-xs md:text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="md:mt-20 mt-4 bg-gray-200 border-white border rounded-3xl p-3 md:p-8">
          <div className="grid grid-cols-4 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 ">
              <NumberTicker
                value={500}
                className="whitespace-pre-wraptext-lg md:text-4xl font-bold tracking-tighter text-black"
              />
             <span>+</span>

              </div>
              <div className="text-black  text-xs md:text-sm">Happy Guests</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 ">
              <NumberTicker
                value={500}
                className="whitespace-pre-wraptext-lg md:text-4xl font-bold tracking-tighter text-black"
              />
             <span>+</span>
             </div>
              <div className="text-black  text-xs md:text-sm">
                Premium Properties
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 ">
              <NumberTicker
                value={4.4}
                className="whitespace-pre-wraptext-lg md:text-4xl font-bold tracking-tighter text-black"
              />
             <span>+</span>

              </div>
              <div className="text-black  text-xs md:text-sm">
                Average Rating
              </div>
            </div>
            <div>
              <div className="text-lg md:text-4xl font-bold text-black md:mb-2">
                <NumberTicker
                  value={24}
                  className="whitespace-pre-wraptext-lg md:text-4xl font-bold tracking-tighter text-black"
                />
                /
                <NumberTicker
                  value={7}
                  className="whitespace-pre-wraptext-lg md:text-4xl font-bold tracking-tighter text-black"
                />
              </div>
              <div className="text-black  text-xs md:text-sm">
                Customer Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
