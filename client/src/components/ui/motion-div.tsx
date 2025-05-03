import { HTMLAttributes } from "react";
import { motion } from "framer-motion";

export interface MotionDivProps extends HTMLAttributes<HTMLDivElement> {
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  variants?: any;
  whileHover?: any;
  whileTap?: any;
  whileInView?: any;
  viewport?: any;
}

// Create a wrapper for motion.div to be used throughout the application
export const MotionDiv = (props: MotionDivProps) => {
  return <motion.div {...props} />;
};