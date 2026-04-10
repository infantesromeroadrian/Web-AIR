import { useState, useCallback } from "react";
import BreachSequence from "./BreachSequence";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
}

export default function L4tentNoiseShell({ children }: Props) {
  const [breachComplete, setBreachComplete] = useState(false);

  const handleComplete = useCallback(() => {
    setBreachComplete(true);
  }, []);

  return (
    <>
      {!breachComplete && <BreachSequence onComplete={handleComplete} />}
      {breachComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      )}
    </>
  );
}
