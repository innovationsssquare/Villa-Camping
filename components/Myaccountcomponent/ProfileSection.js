import { Edit, Mail } from "lucide-react";


const ProfileSection = ({ name, email, onEditProfile }) => {
  return (
    <div className=" px-3 ">
      <div className="bg-white rounded-2xl  border border-gray-300">
        <div className="flex items-start gap-4">
          {/* Profile Avatar */}
          <div className="w-20 h-20 flex justify-center items-center bg-amber-300 rounded-full overflow-hidden flex-shrink-0">
            SA
          </div>
          
          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg capitalize font-heading-weight text-foreground mb-2">
              {name}
            </h2>
            
            {/* Edit Profile Button */}
            <button 
              onClick={onEditProfile}
              className="flex items-center gap-2 text-blue-400 hover:text-accent/80 transition-colors mb-3"
            >
              <Edit className="w-4 h-4" />
              <span className="text-sm font-medium-weight">Edit Profile</span>
            </button>
            
            {/* Email */}
            <div className="flex items-center gap-2 text-gray-400">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;