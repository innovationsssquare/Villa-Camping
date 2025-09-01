"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { CheckCircle, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function Successmodal() {
  const [isOpensucess, setIsOpensucess] = useState(true);
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/bookings");
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -90 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.3,
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.5,
      },
    },
  };

  useEffect(() => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 1.2 } });
  }, []);

  return (
    <Modal
      hideCloseButton={true}
      isDismissable={false}
      className="p-0"
      isKeyboardDismissDisabled={true}
      backdrop="opaque"
      isOpen={isOpensucess}
      onOpenChange={setIsOpensucess}
    >
      <ModalContent className="p-0">
        <div className="flex w-full items-center justify-center bg-white p-4">
          <Card className="w-full shadow-none border-none overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <motion.div
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <CheckCircle className="w-24 h-24 text-green-500" />
                </motion.div>
              </div>
              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
              >
                <CardTitle className="text-center text-2xl font-bold">
                  Payment Successful!
                </CardTitle>
                <CardDescription className="text-center mt-2">
                  Your transaction has been completed successfully.
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
              >
                <p className="text-xs text-gray-600 text-center">
                  A confirmation email has been sent to your registered email
                  address.
                </p>
              </motion.div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
              >
                <Button
                  onPress={handleRedirect}
                  className="px-8 py-0.5 rounded-sm w-48  border-none  bg-black border-black dark:border-white uppercase text-white  transition duration-200 text-sm"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Go to Bookings</span>
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </div>
      </ModalContent>
    </Modal>
  );
}
