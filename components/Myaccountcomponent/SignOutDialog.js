"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { LogOut } from "lucide-react";

const SignOutDialog = ({ open, onOpenChange, onConfirm }) => {
  return (
    <Modal
      isOpen={open}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="blur"
      classNames={{
        base: "max-w-md mx-auto bg-white rounded-3xl p-2 border border-neutral-150 shadow-2xl overflow-hidden",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-3 pb-2">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center shrink-0">
                <LogOut className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Sign out?</h3>
              </div>
            </ModalHeader>
            <ModalBody className="py-2 text-sm text-neutral-600 leading-relaxed">
              Are you sure you want to sign out of your account? You&apos;ll need to sign in again to access your trips and bookings.
            </ModalBody>
            <ModalFooter className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button
                variant="bordered"
                onPress={onClose}
                className="w-full sm:w-auto border-neutral-300 font-semibold text-neutral-700 rounded-xl cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={() => {
                  onConfirm?.();
                  onClose();
                }}
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl cursor-pointer shadow-sm"
              >
                Sign Out
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SignOutDialog;
