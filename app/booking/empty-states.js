"use client";

import { motion } from "motion/react";
import {
  BookOpen,
  Search,
  Calendar,
  CheckCircle2,
  MapPin,
  Plane,
  Building,
  Compass,
  Sparkles,
  Clock,
} from "lucide-react";
import { Button } from "./ui/button";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const floatingAnimation = {
  y: [-10, 10, -10],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const rotateAnimation = {
  rotate: [0, 360],
  transition: {
    duration: 20,
    repeat: Infinity,
    ease: "linear",
  },
};

export function EmptyState({ type, searchTerm, onAction }) {
  const getEmptyStateContent = () => {
    switch (type) {
      case "no-bookings":
        return {
          icon: <BookOpen className="w-16 h-16 text-blue-500" />,
          title: "No bookings yet",
          description:
            "Your adventure starts here! Book your first hotel and create unforgettable memories.",
          actionText: "Explore Hotels",
          illustration: (
            <div className="relative">
              <motion.div
                className="absolute -top-4 -left-4"
                animate={floatingAnimation}
              >
                <Plane className="w-8 h-8 text-blue-400" />
              </motion.div>
              <motion.div
                className="absolute -top-2 -right-6"
                animate={pulseAnimation}
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
              <motion.div
                className="absolute -bottom-2 -left-2"
                animate={rotateAnimation}
              >
                <Compass className="w-5 h-5 text-green-400" />
              </motion.div>
            </div>
          ),
        };

      case "no-search-results":
        return {
          icon: <Search className="w-16 h-16 text-gray-400" />,
          title: `No results for "${searchTerm}"`,
          description:
            "Try adjusting your search terms or check the spelling. You can also browse all bookings below.",
          actionText: "Clear Search",
          illustration: (
            <div className="relative">
              <motion.div
                className="absolute -top-3 -right-3"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MapPin className="w-6 h-6 text-red-400" />
              </motion.div>
              <motion.div
                className="absolute -bottom-1 -left-3"
                animate={pulseAnimation}
              >
                <Building className="w-5 h-5 text-blue-400" />
              </motion.div>
            </div>
          ),
        };

      case "no-upcoming":
        return {
          icon: <Calendar className="w-16 h-16 text-orange-500" />,
          title: "No upcoming bookings",
          description:
            "Plan your next getaway and create new memories. The world is waiting for you!",
          actionText: "Book Now",
          illustration: (
            <div className="relative">
              <motion.div
                className="absolute -top-2 -right-4"
                animate={floatingAnimation}
              >
                <Clock className="w-6 h-6 text-orange-400" />
              </motion.div>
              <motion.div
                className="absolute -bottom-2 -left-4"
                animate={{
                  scale: [1, 1.2, 1],
                  transition: {
                    duration: 1.5,
                    repeat: Infinity,
                  },
                }}
              >
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </motion.div>
            </div>
          ),
        };

      case "no-completed":
        return {
          icon: <CheckCircle2 className="w-16 h-16 text-green-500" />,
          title: "No completed stays yet",
          description:
            "Once you complete your bookings, they'll appear here with options to review and rebook.",
          actionText: "View All Bookings",
          illustration: (
            <div className="relative">
              <motion.div
                className="absolute -top-3 -left-3"
                animate={rotateAnimation}
              >
                <Compass className="w-5 h-5 text-green-400" />
              </motion.div>
              <motion.div
                className="absolute -top-1 -right-2"
                animate={pulseAnimation}
              >
                <Building className="w-4 h-4 text-blue-400" />
              </motion.div>
            </div>
          ),
        };

      default:
        return {
          icon: <BookOpen className="w-16 h-16 text-gray-400" />,
          title: "No bookings found",
          description: "Start planning your next adventure!",
          actionText: "Explore",
          illustration: null,
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-blue-100 opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-purple-100 opacity-20"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -15, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/3 w-20 h-20 rounded-full bg-green-100 opacity-25"
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 10, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative flex flex-col items-center text-center space-y-6 z-10"
        variants={itemVariants}
      >
        {/* Icon with Animation */}
        <motion.div
          className="relative"
          animate={type === "no-bookings" ? pulseAnimation : {}}
        >
          <motion.div
            className="p-4 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {content.icon}
          </motion.div>
          {content.illustration}
        </motion.div>

        {/* Text Content */}
        <motion.div className="space-y-3 max-w-md" variants={itemVariants}>
          <motion.h3
            className="text-2xl text-foreground"
            variants={itemVariants}
          >
            {content.title}
          </motion.h3>
          <motion.p
            className="text-muted-foreground leading-relaxed"
            variants={itemVariants}
          >
            {content.description}
          </motion.p>
        </motion.div>

        {/* Action Button */}
        <motion.div variants={itemVariants}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg px-8 py-2.5"
              onClick={onAction}
            >
              <motion.span
                className="flex items-center gap-2"
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {content.actionText}
                <Sparkles className="w-4 h-4" />
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
