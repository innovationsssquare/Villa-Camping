"use client";

import { usePathname } from "next/navigation";

const titles= {
  "/eco-friendly": "Eco-Friendly",
  "/wishlist": "My Wishlist",
  "/about": "About Us",
  "/contact": "Conatct Us",
  "/bag": "My Bag",
  "/account": "My Profile",
  "/account/orders": "My Orders",
  "/account/settings": "Settings",
  "/account/privacy-policy": "Privacy Policy",
  "/account/support": "Help & Support",
  "/account/support/contactus": "Customer Service",
  "/account/support/social": "Socials",
  // Add more paths and titles as needed
};

export const HeaderTitle = () => {
  const pathname = usePathname();

  // Don't show title on home and explore
  if (
    pathname === "/" ||
    pathname === "/explore" ||
    pathname.startsWith("/products/") ||
    pathname.startsWith("/category/") 
  ) {
    return null;
  }

  const title = titles[pathname] || "Page";

  return (
    <div className="text-center ml-16 font-semibold text-white bg-[#106C83] px-4 py-1.5 rounded-lg text-sm">
      {title}
    </div>
  );
};
