"use client"
import { Heart, MapPin, Star, Trash2, Share } from "lucide-react";
import Header from "@/components/Myaccountcomponent/Header";
import { useToast } from "@/components/ui/toast-provider";
import { useRouter } from "next/navigation";


const WishlistItem = ({ 
  id, title, location, rating, reviews, price, imageUrl, onRemove, onShare 
}) => {
  return (
    <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
      <div className="aspect-video bg-muted relative">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => onRemove(id)}
          className="absolute top-3 right-3 p-2 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card transition-colors"
        >
          <Heart className="w-5 h-5 text-destructive fill-destructive" />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-heading-weight text-foreground text-lg leading-tight">
            {title}
          </h3>
          <button
            onClick={() => onShare(id)}
            className="p-1 hover:bg-secondary rounded-lg transition-colors"
          >
            <Share className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        
        <div className="flex items-center gap-1 mb-3">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{location}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium-weight text-foreground">{rating}</span>
            <span className="text-sm text-muted-foreground">({reviews})</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-heading-weight text-foreground">{price}</span>
            <span className="text-sm text-muted-foreground">/night</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Wishlist = () => {
  const navigate = useRouter();
  const { addToast } = useToast();

  const wishlistItems = [
    {
      id: "1",
      title: "Cozy Mountain Cabin",
      location: "Aspen, Colorado",
      rating: 4.8,
      reviews: 124,
      price: "$180",
      imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop"
    },
    {
      id: "2", 
      title: "Beachfront Villa",
      location: "Malibu, California",
      rating: 4.9,
      reviews: 87,
      price: "$350",
      imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop"
    },
    {
      id: "3",
      title: "Urban Loft",
      location: "New York City",
      rating: 4.6,
      reviews: 203,
      price: "$120",
      imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"
    }
  ];

  const handleBackClick = () => {
    navigate.push("/");
  };

  const handleRemoveFromWishlist = (id) => {
    addToast({
      title: "Removed from Wishlist",
      description: "Item has been removed from your wishlist",
    });
  };

  const handleShareItem = (id) => {
    addToast({
      title: "Share",
      description: "Sharing functionality will be implemented here",
    });
  };

  return (
    <div className="min-h-screen bg-background px-3">
      <div className="w-full mx-auto bg-background min-h-screen">
        {/* <Header 
          title="My Wishlist" 
          onBackClick={handleBackClick}
        /> */}
        
        <div className="px-mobile py-section-gap">
          {wishlistItems.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-heading-weight text-foreground">
                  {wishlistItems.length} saved places
                </h2>
                <button className="text-sm text-accent hover:text-accent/80 transition-colors">
                  Clear all
                </button>
              </div>
              
              <div className="space-y-4">
                {wishlistItems.map((item) => (
                  <WishlistItem
                    key={item.id}
                    {...item}
                    onRemove={handleRemoveFromWishlist}
                    onShare={handleShareItem}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-heading-weight text-foreground mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Start exploring and save places you'd love to visit
              </p>
              <button 
                onClick={() => navigate("/")}
                className="bg-accent text-accent-foreground px-6 py-3 rounded-xl font-medium-weight hover:bg-accent/90 transition-colors"
              >
                Start exploring
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;