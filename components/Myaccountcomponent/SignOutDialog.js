import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut } from "lucide-react";

const SignOutDialog = ({ open, onOpenChange, onConfirm }) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-full mx-auto border-none">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
              <LogOut className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <AlertDialogTitle className="text-left">
                Sign out?
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-left">
           {` Are you sure you want to sign out of your account? You'll need to
            sign in again to access your trips and bookings.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="w-full sm:w-auto border border-gray-300">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="w-full sm:w-auto bg-red-500 hover:bg-red-500/90 text-white"
          >
            Sign Out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SignOutDialog;
