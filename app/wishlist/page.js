"use client";
import { Heart, MapPin, Star, Trash2, Share } from "lucide-react";
import Header from "@/components/Myaccountcomponent/Header";
import { useToast } from "@/components/ui/toast-provider";
import { useRouter } from "next/navigation";
import { NotificationSheet } from "@/components/Navbarcomponents/Notificationsheet";
import { UserSidebar } from "@/components/Navbarcomponents/Sidebar";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import PropertyCard from "@/components/Availableweekend/Weekendcard";
import { useEffect } from "react";
import { fetchmyWishlists } from "@/Redux/Slices/wishlistSlice";

const WishlistItem = ({
  id,
  title,
  location,
  rating,
  reviews,
  price,
  imageUrl,
  onRemove,
  onShare,
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
            <span className="text-sm font-medium-weight text-foreground">
              {rating}
            </span>
            <span className="text-sm text-muted-foreground">({reviews})</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-heading-weight text-foreground">
              {price}
            </span>
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
  const { wishlists, wishloading, wishlisterror } = useSelector(
    (state) => state.wishlist
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchmyWishlists());
  }, [dispatch]);

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
    <div className="h-screen bg-background px-3">
      <div className="w-full mx-auto bg-background h-screen">
        <section
          className={cn(
            " w-full sticky top-0  bg-white   px-4 py-3 z-50 transition-transform duration-300 ease-in-out md:hidden "
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserSidebar />
              Wishlist
            </div>

            <div className="flex items-center gap-2">
              <NotificationSheet />
            </div>
          </div>
        </section>
        <div className="px-mobile py-section-gap">
          {wishlists.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-3 ">
                <h2 className="text-lg font-heading-weight text-foreground">
                  {wishlists.length} saved places
                </h2>
                <button className="text-sm text-accent hover:text-accent/80 transition-colors">
                  Clear all
                </button>
              </div>

              <div className="space-y-4">
                {wishlists.map((item, k) => (
                  <PropertyCard key={k} property={item?.propertyId} />
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
                {` Start exploring and save places you'd love to visit`}
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
