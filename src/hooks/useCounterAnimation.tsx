import { useEffect, useRef, useState } from "react";

export const useCounterAnimation = (end: number, duration: number = 2000, isVisible: boolean = false) => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  // Reset animation when the target value changes (e.g. data loaded)
  useEffect(() => {
    hasAnimated.current = false;
  }, [end]);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;

    hasAnimated.current = true;
    let startTime: number | null = null;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setCount(Math.floor(easeOutQuart * (end - startValue) + startValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  return count;
};
