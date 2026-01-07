import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function CarouselIndicator({
  current,
  count,
  variant = "dots",
  className,
  onDotClick,
}) {
  if (count === 0) return null;

  switch (variant) {
    case "dots":
      return (
        <div
          className={cn(
            "flex items-center justify-center gap-2 py-3",
            className
          )}
        >
          {Array.from({ length: count }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => onDotClick?.(index)}
              className={cn(
                "rounded-full transition-all duration-300",
                current === index + 1
                  ? "bg-indicator-active w-6 h-2"
                  : "bg-indicator-inactive w-2 h-2 hover:bg-indicator-hover"
              )}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              initial={false}
              animate={{
                width: current === index + 1 ? 24 : 8,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          ))}
        </div>
      );

    case "pills":
      return (
        <div
          className={cn(
            "flex items-center justify-center gap-1.5 py-3",
            className
          )}
        >
          {Array.from({ length: count }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => onDotClick?.(index)}
              className={cn(
                "h-1.5 rounded-full transition-colors duration-300",
                current === index + 1
                  ? "bg-orange-500"
                  : "bg-orange-300 hover:bg-indicator-hover"
              )}
              initial={false}
              animate={{
                width: current === index + 1 ? 32 : 16,
                opacity: current === index + 1 ? 1 : 0.5,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          ))}
        </div>
      );

    case "progress":
      const progress = (current / count) * 100;
      return (
        <div className={cn("w-full max-w-xs mx-auto py-3", className)}>
          <div className="relative h-1 bg-orange-100 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-orange-500 rounded-full"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{current}</span>
            <span>{count}</span>
          </div>
        </div>
      );

    case "lines":
      return (
        <div
          className={cn(
            "flex items-center justify-center gap-1 ",
            className
          )}
        >
          {Array.from({ length: count }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => onDotClick?.(index)}
              className="relative h-8 flex items-center"
              whileHover={{ scale: 1.1 }}
            >
              <motion.div
                className={cn(
                  "rounded-full transition-colors duration-300",
                  current === index + 1
                    ? "bg-orange-500"
                    : "bg-orange-300 hover:bg-indicator-hover"
                )}
                initial={false}
                animate={{
                  width: current === index + 1 ? 24 : 12,
                  height: current === index + 1 ? 4 : 2,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            </motion.button>
          ))}
        </div>
      );

    case "numbered":
      return (
        <div className={cn("flex items-center justify-center py-3", className)}>
          <div className="flex items-center gap-2 bg-indicator-numbered-bg backdrop-blur-sm rounded-full px-4 py-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={current}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm font-semibold text-indicator-numbered-current min-w-[1.5ch] text-center"
              >
                {current}
              </motion.span>
            </AnimatePresence>
            <span className="text-indicator-numbered-separator">/</span>
            <span className="text-sm text-indicator-numbered-total">
              {count}
            </span>
          </div>
        </div>
      );

    case "glow":
      return (
        <div
          className={cn(
            "flex items-center justify-center gap-3 py-3",
            className
          )}
        >
          {Array.from({ length: count }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => onDotClick?.(index)}
              className="relative"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  current === index + 1
                    ? "bg-orange-500"
                    : "bg-orange-200"
                )}
                initial={false}
                animate={{
                  scale: current === index + 1 ? 1.2 : 1,
                }}
              />
              {current === index + 1 && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-indicator-glow-ring"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              )}
            </motion.button>
          ))}
        </div>
      );

    default:
      return null;
  }
}
