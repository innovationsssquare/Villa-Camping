"use client";
import { useState } from "react";

import Header from "@/components/Myaccountcomponent/Header";
import ProfileSection from "@/components/Myaccountcomponent/ProfileSection";
import ToolkitSection from "@/components/Myaccountcomponent/ToolkitSection";
import AccountSection from "@/components/Myaccountcomponent/AccountSection";
import LegalSection from "@/components/Myaccountcomponent/LegalSection";
import SignOutDialog from "@/components/Myaccountcomponent/SignOutDialog";
import EditProfileDialog from "@/components/Myaccountcomponent/EditProfileDialog";
import { UserSidebar } from "@/components/Navbarcomponents/Sidebar";
import { NotificationSheet } from "@/components/Navbarcomponents/Notificationsheet";
import { cn } from "@/lib/utils";

const Index = () => {
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [showEditProfileDialog, setShowEditProfileDialog] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "santosh alimkar",
    email: "santosh.sa4d@gmail.com",
    phone: "+91 98765 43210",
    bio: "Travel enthusiast exploring the world one destination at a time.",
    location: "Mumbai, India",
  });

  const handleBackClick = () => {
  
  };

  const handleEditProfile = () => {
    setShowEditProfileDialog(true);
  };

  const handleSignOut = () => {
    setShowSignOutDialog(true);
  };

  const handleConfirmSignOut = () => {
   
    setShowSignOutDialog(false);
  };

  const handleSaveProfile = (data) => {
    setProfileData(data);
   
  };

  return (
    <div className="min-h-screen">
      {/* Mobile-first design container */}
      <div className="w-full mx-auto  min-h-screen">
       <section
        className={cn(
          " w-full sticky top-0  bg-white  rounded-b-2xl px-4 py-3 z-50 transition-transform duration-300 ease-in-out md:hidden "
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserSidebar />
            Profile
          </div>

          <div className="flex items-center gap-2">
            <NotificationSheet />

            {/* <Button
                           onClick={() => router.push("/bag")}
                           variant="outline"
                           size="icon"
                           className="rounded-md  border-gray-300 relative bg-[#FFFFFF4D]"
                         >
                           <IoBag className="h-5 w-5" />
                           {cartItemCount > 0 && (
                             <Badge
                               className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-black text-white border-1 border-white min-w-[1.25rem] h-5"
                               variant="default"
                             >
                               {cartItemCount}
                             </Badge>
                           )}
                           <span className="sr-only">Shopping cart</span>
                         </Button> */}
          </div>
        </div>
      </section>

        <ProfileSection
          name={profileData.name}
          email={profileData.email}
          onEditProfile={handleEditProfile}
        />

        <ToolkitSection />

        <AccountSection onSignOut={handleSignOut} />

        <LegalSection />

        {/* Dialogs */}
        <SignOutDialog
          open={showSignOutDialog}
          onOpenChange={setShowSignOutDialog}
          onConfirm={handleConfirmSignOut}
        />

        <EditProfileDialog
          open={showEditProfileDialog}
          onOpenChange={setShowEditProfileDialog}
          onSave={handleSaveProfile}
          initialData={profileData}
        />
      </div>
    </div>
  );
};

export default Index;
