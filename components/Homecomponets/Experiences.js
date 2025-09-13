import { Heart, Users, Mountain, Crown } from "lucide-react";

const experiences = [
  {
    icon: Heart,
    title: "Romantic",
    description: "Intimate settings for couples with scenic views and privacy",
    image: "https://images.unsplash.com/photo-1728051104384-41471b90d035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMHJlc29ydHxlbnwxfHx8fDE3NTc3NzQxMzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    features: ["Private dining", "Sunset views", "Couple spa", "Candlelight setup"]
  },
  {
    icon: Users,
    title: "Family",
    description: "Spacious accommodations perfect for family bonding time",
    image: "https://images.unsplash.com/photo-1711994373910-e0f280fa5bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjB2YWNhdGlvbiUyMHRyYXZlbHxlbnwxfHx8fDE3NTc3NTU4ODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    features: ["Kids play area", "Family pools", "Game rooms", "Safe environment"]
  },
  {
    icon: Mountain,
    title: "Adventure",
    description: "Thrilling outdoor activities and nature experiences",
    image: "https://images.unsplash.com/photo-1586706433769-85dda96efb8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZlbnR1cmUlMjBjYW1waW5nJTIwbmF0dXJlfGVufDF8fHx8MTc1Nzc3NDE1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    features: ["Trekking trails", "Camping sites", "Water sports", "Paragliding"]
  },
  {
    icon: Crown,
    title: "Luxury",
    description: "Premium amenities and world-class hospitality",
    image: "https://images.unsplash.com/photo-1649663724528-3bd2ce98b6e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMGludGVyaW9yfGVufDF8fHx8MTc1NzY2NTQyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    features: ["Butler service", "Private pools", "Fine dining", "Spa treatments"]
  }
];

export function Experiences() {
  return (
    <section id="experiences" className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            Curated Experiences
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {`Whether you're seeking romance, family fun, adventure, or luxury, 
            we have the perfect experience waiting for you`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {experiences.map((experience, index) => {
            const IconComponent = experience.icon;
            return (
              <div 
                key={experience.title}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="md:flex">
                  <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
                    <img
                      src={experience.image}
                      alt={experience.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                  </div>
                  
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
                        <IconComponent className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h3 className="text-2xl font-serif text-gray-900">
                        {experience.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {experience.description}
                    </p>
                    
                    <ul className="space-y-2">
                      {experience.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <button className="text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center group-hover:translate-x-1 transition-transform">
                        Explore {experience.title} Options
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}